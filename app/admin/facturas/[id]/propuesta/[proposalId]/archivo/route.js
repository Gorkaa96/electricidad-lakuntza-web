import {getAdminContext} from '@/lib/admin';
import {canViewLeads} from '@/lib/rolePermissions';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const headers={
 'Cache-Control':'private, no-store, max-age=0',
 'Referrer-Policy':'no-referrer',
 'X-Content-Type-Options':'nosniff',
 'Content-Security-Policy':"sandbox; default-src 'none'",
 'X-Robots-Tag':'noindex, nofollow',
};
const fail=(code)=>new Response('Documento no disponible.',{status:code,headers});
export async function GET(_request,{params}){
 const {id,proposalId}=await params;
 if(!uuid.test(id)||!uuid.test(proposalId))return fail(404);
 const {supabase,admin,user}=await getAdminContext();
 if(!user)return fail(401);
 if(!admin || !canViewLeads(admin))return fail(403);
 const {data:proposal,error}=await supabase.from('fenie_proposals')
   .select('id,version,file_path,file_size').eq('id',proposalId).eq('lead_id',id).maybeSingle();
 if(error||!proposal)return fail(404);
 const {data, error:downloadError}=await supabase.storage.from('invoice-files').download(proposal.file_path);
 if(downloadError || !data)return fail(404);
 if(data.size>4*1024*1024)return fail(413);
 return new Response(data,{headers:{
  ...headers,
  'Content-Type':'application/pdf',
  'Content-Disposition':'attachment; filename="propuesta-fenie-v'+proposal.version+'.pdf"'
 }});
}
