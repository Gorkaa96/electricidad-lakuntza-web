import { getAdminContext } from '@/lib/admin';
import { canViewLeads } from '@/lib/rolePermissions';

const privateHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
};
const fileTypes = {
  'application/pdf': 'pdf', 'image/jpeg': 'jpg',
  'image/png': 'png', 'image/webp': 'webp',
};
function failure(status) {
  return new Response('Documento no disponible.', { status, headers: privateHeaders });
}

export async function GET(_request, { params }) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return failure(404);
  const { supabase, user, admin } = await getAdminContext();
  if (!user) return failure(401);
  if (!admin || !canViewLeads(admin)) return failure(403);
  // Re-check membership and row access on every download. Never issue a bearer
  // signed URL that would remain usable after the member is deactivated.
  const { data: lead, error } = await supabase.from('invoice_review_leads')
    .select('file_path,file_type').eq('id', id).maybeSingle();
  if (error || !lead?.file_path) return failure(404);
  const { data, error: fileError } = await supabase.storage.from('invoice-files').download(lead.file_path);
  if (fileError || !data) return failure(404);
  if (data.size > 10 * 1024 * 1024) return failure(413);
  const ext = fileTypes[lead.file_type] || 'bin';
  return new Response(data, {
    headers: {
      ...privateHeaders,
      'Content-Type': fileTypes[lead.file_type] ? lead.file_type : 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="factura.' + ext + '"',
      'Content-Security-Policy': "sandbox; default-src 'none'",
    },
  });
}
