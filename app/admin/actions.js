'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function boolFromForm(value) {
  return value === 'on' || value === 'true' || value === true;
}

function getProjectPayload(formData) {
  const title = String(formData.get('title') || '').trim();
  const slug = slugify(formData.get('slug') || title);
  const yearRaw = String(formData.get('year') || '').trim();

  return {
    slug,
    title,
    short_title: String(formData.get('short_title') || '').trim() || title,
    category: String(formData.get('category') || '').trim(),
    location: String(formData.get('location') || '').trim(),
    year: yearRaw ? Number(yearRaw) : null,
    description: String(formData.get('description') || '').trim(),
    long_description: String(formData.get('long_description') || '').trim() || null,
    featured: boolFromForm(formData.get('featured')),
    published: boolFromForm(formData.get('published')),
    sort_order: Number(formData.get('sort_order') || 100),
    updated_at: new Date().toISOString(),
  };
}

async function uploadProjectImages({ supabase, projectId, slug, files }) {
  const validFiles = Array.from(files || []).filter((file) => file && file.size > 0);

  for (let index = 0; index < validFiles.length; index += 1) {
    const file = validFiles[index];
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${slug}/${Date.now()}-${index}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage.from('project-images').getPublicUrl(path);

    await supabase.from('project_images').insert({
      project_id: projectId,
      public_url: data.publicUrl,
      storage_path: path,
      alt: slug,
      sort_order: index,
    });
  }
}

export async function createProject(formData) {
  const { supabase } = await requireAdmin();
  const payload = getProjectPayload(formData);

  if (!payload.title || !payload.slug || !payload.category || !payload.description) {
    redirect('/admin/proyectos/nuevo?error=missing');
  }

  const { data: project, error } = await supabase
    .from('projects')
    .insert(payload)
    .select('id, slug')
    .single();

  if (error) {
    redirect(`/admin/proyectos/nuevo?error=${encodeURIComponent(error.message)}`);
  }

  try {
    await uploadProjectImages({
      supabase,
      projectId: project.id,
      slug: project.slug,
      files: formData.getAll('images'),
    });
  } catch (uploadError) {
    redirect(`/admin/proyectos/${project.id}?error=${encodeURIComponent(uploadError.message)}`);
  }

  revalidatePath('/');
  revalidatePath('/trabajos-realizados');
  revalidatePath('/admin/proyectos');
  redirect('/admin/proyectos');
}

export async function updateProject(projectId, formData) {
  const { supabase } = await requireAdmin();
  const payload = getProjectPayload(formData);

  if (!payload.title || !payload.slug || !payload.category || !payload.description) {
    redirect(`/admin/proyectos/${projectId}?error=missing`);
  }

  const { data: project, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', projectId)
    .select('id, slug')
    .single();

  if (error) {
    redirect(`/admin/proyectos/${projectId}?error=${encodeURIComponent(error.message)}`);
  }

  try {
    await uploadProjectImages({
      supabase,
      projectId: project.id,
      slug: project.slug,
      files: formData.getAll('images'),
    });
  } catch (uploadError) {
    redirect(`/admin/proyectos/${projectId}?error=${encodeURIComponent(uploadError.message)}`);
  }

  revalidatePath('/');
  revalidatePath('/trabajos-realizados');
  revalidatePath('/admin/proyectos');
  redirect('/admin/proyectos');
}

export async function deleteProject(projectId) {
  const { supabase } = await requireAdmin();
  await supabase.from('project_images').delete().eq('project_id', projectId);
  await supabase.from('projects').delete().eq('id', projectId);

  revalidatePath('/');
  revalidatePath('/trabajos-realizados');
  revalidatePath('/admin/proyectos');
  redirect('/admin/proyectos');
}

export async function signOutAdmin() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
