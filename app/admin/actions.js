'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const EXTENSION_BY_TYPE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

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

function validateImageFile(file) {
  if (!file || file.size === 0) return null;

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Formato de imagen no permitido. Usa JPG, PNG o WebP.');
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('La imagen supera el máximo permitido de 5 MB.');
  }

  return file;
}

async function revalidateProjectPaths(supabase, projectId, slug) {
  let projectSlug = slug;

  if (!projectSlug && projectId) {
    const { data } = await supabase.from('projects').select('slug').eq('id', projectId).maybeSingle();
    projectSlug = data?.slug;
  }

  revalidatePath('/');
  revalidatePath('/trabajos-realizados');
  revalidatePath('/admin/proyectos');

  if (projectId) revalidatePath(`/admin/proyectos/${projectId}`);
  if (projectSlug) revalidatePath(`/trabajos-realizados/${projectSlug}`);
}

async function ensureProjectHasCover(supabase, projectId) {
  const { data: existingCover } = await supabase
    .from('project_images')
    .select('id')
    .eq('project_id', projectId)
    .eq('is_cover', true)
    .maybeSingle();

  if (existingCover) return;

  const { data: firstImage } = await supabase
    .from('project_images')
    .select('id')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (firstImage?.id) {
    await supabase.from('project_images').update({ is_cover: true }).eq('id', firstImage.id);
  }
}

async function uploadProjectImages({ supabase, projectId, slug, title, files }) {
  const validFiles = Array.from(files || [])
    .map(validateImageFile)
    .filter(Boolean);

  if (validFiles.length === 0) return;

  const { data: existingImages = [] } = await supabase
    .from('project_images')
    .select('sort_order, is_cover')
    .eq('project_id', projectId);

  const maxSortOrder = existingImages.length
    ? Math.max(...existingImages.map((image) => image.sort_order ?? 0))
    : -1;
  const hasCover = existingImages.some((image) => image.is_cover);

  for (let index = 0; index < validFiles.length; index += 1) {
    const file = validFiles[index];
    const extension = EXTENSION_BY_TYPE[file.type] || 'jpg';
    const safeName = `${crypto.randomUUID()}.${extension}`;
    const path = `${slug}/${safeName}`;
    const sortOrder = maxSortOrder + index + 1;
    const isCover = !hasCover && index === 0;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(path, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage.from('project-images').getPublicUrl(path);

    const { error: insertError } = await supabase.from('project_images').insert({
      project_id: projectId,
      public_url: data.publicUrl,
      storage_path: path,
      alt: title,
      sort_order: sortOrder,
      is_cover: isCover,
    });

    if (insertError) {
      await supabase.storage.from('project-images').remove([path]);
      throw new Error(insertError.message);
    }
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
    .select('id, slug, title')
    .single();

  if (error) {
    redirect(`/admin/proyectos/nuevo?error=${encodeURIComponent(error.message)}`);
  }

  try {
    await uploadProjectImages({
      supabase,
      projectId: project.id,
      slug: project.slug,
      title: project.title,
      files: formData.getAll('images'),
    });
  } catch (uploadError) {
    redirect(`/admin/proyectos/${project.id}?error=${encodeURIComponent(uploadError.message)}`);
  }

  await revalidateProjectPaths(supabase, project.id, project.slug);
  redirect('/admin/proyectos');
}

export async function updateProject(projectId, formData) {
  const { supabase } = await requireAdmin();
  const payload = getProjectPayload(formData);

  if (!payload.title || !payload.slug || !payload.category || !payload.description) {
    redirect(`/admin/proyectos/${projectId}?error=missing`);
  }

  const { data: currentProject } = await supabase
    .from('projects')
    .select('slug')
    .eq('id', projectId)
    .maybeSingle();

  const { data: project, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', projectId)
    .select('id, slug, title')
    .single();

  if (error) {
    redirect(`/admin/proyectos/${projectId}?error=${encodeURIComponent(error.message)}`);
  }

  try {
    await uploadProjectImages({
      supabase,
      projectId: project.id,
      slug: project.slug,
      title: project.title,
      files: formData.getAll('images'),
    });
    await ensureProjectHasCover(supabase, project.id);
  } catch (uploadError) {
    redirect(`/admin/proyectos/${projectId}?error=${encodeURIComponent(uploadError.message)}`);
  }

  await revalidateProjectPaths(supabase, project.id, project.slug);
  if (currentProject?.slug && currentProject.slug !== project.slug) {
    revalidatePath(`/trabajos-realizados/${currentProject.slug}`);
  }
  redirect('/admin/proyectos');
}

export async function setProjectCover(projectId, imageId) {
  const { supabase } = await requireAdmin();

  const { data: image } = await supabase
    .from('project_images')
    .select('id, project_id')
    .eq('id', imageId)
    .eq('project_id', projectId)
    .maybeSingle();

  if (!image) redirect(`/admin/proyectos/${projectId}?error=image-not-found`);

  await supabase.from('project_images').update({ is_cover: false }).eq('project_id', projectId);
  await supabase.from('project_images').update({ is_cover: true }).eq('id', imageId);

  await revalidateProjectPaths(supabase, projectId);
  redirect(`/admin/proyectos/${projectId}`);
}

export async function deleteProjectImage(projectId, imageId) {
  const { supabase } = await requireAdmin();

  const { data: image } = await supabase
    .from('project_images')
    .select('id, project_id, storage_path, is_cover')
    .eq('id', imageId)
    .eq('project_id', projectId)
    .maybeSingle();

  if (!image) redirect(`/admin/proyectos/${projectId}?error=image-not-found`);

  if (image.storage_path) {
    const { error: storageError } = await supabase.storage.from('project-images').remove([image.storage_path]);
    if (storageError) redirect(`/admin/proyectos/${projectId}?error=${encodeURIComponent(storageError.message)}`);
  }

  await supabase.from('project_images').delete().eq('id', imageId);

  if (image.is_cover) {
    await ensureProjectHasCover(supabase, projectId);
  }

  await revalidateProjectPaths(supabase, projectId);
  redirect(`/admin/proyectos/${projectId}`);
}

export async function deleteProject(projectId) {
  const { supabase } = await requireAdmin();

  const { data: project } = await supabase
    .from('projects')
    .select('id, slug, project_images(storage_path)')
    .eq('id', projectId)
    .maybeSingle();

  const storagePaths = (project?.project_images || [])
    .map((image) => image.storage_path)
    .filter(Boolean);

  if (storagePaths.length > 0) {
    await supabase.storage.from('project-images').remove(storagePaths);
  }

  await supabase.from('project_images').delete().eq('project_id', projectId);
  await supabase.from('projects').delete().eq('id', projectId);

  await revalidateProjectPaths(supabase, projectId, project?.slug);
  redirect('/admin/proyectos');
}

export async function signOutAdmin() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
