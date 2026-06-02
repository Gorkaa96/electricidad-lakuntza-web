import { createSupabaseServerClient } from './supabase/server';

export const projectCategories = [
  'Instalaciones eléctricas',
  'Cuadros eléctricos',
  'Iluminación',
  'Telecomunicaciones',
  'Porteros y videoporteros',
  'Asesoría energética',
  'Otros trabajos',
];

export const projects = [];

function mapProject(row) {
  const images = Array.isArray(row.project_images)
    ? row.project_images
        .sort((a, b) => {
          if (a.is_cover && !b.is_cover) return -1;
          if (!a.is_cover && b.is_cover) return 1;
          return (a.sort_order ?? 0) - (b.sort_order ?? 0);
        })
        .map((image) => ({
          id: image.id,
          url: image.public_url,
          alt: image.alt || row.title,
          storagePath: image.storage_path,
          isCover: image.is_cover || false,
          sortOrder: image.sort_order ?? 100,
        }))
        .filter((image) => Boolean(image.url))
    : [];

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortTitle: row.short_title || row.title,
    category: row.category,
    location: row.location,
    year: row.year,
    description: row.description,
    longDescription: row.long_description,
    featured: row.featured,
    published: row.published,
    images,
    coverImage: images.find((image) => image.isCover) || images[0] || null,
  };
}

async function fetchProjects({ featuredOnly = false } = {}) {
  const supabase = createSupabaseServerClient();

  if (!supabase) return [];

  let query = supabase
    .from('projects')
    .select('id, slug, title, short_title, category, location, year, description, long_description, featured, published, sort_order, project_images(id, public_url, storage_path, alt, is_cover, sort_order)')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (featuredOnly) {
    query = query.eq('featured', true).limit(3);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error loading projects from Supabase:', error.message);
    return [];
  }

  return (data || []).map(mapProject);
}

export async function getFeaturedProjects() {
  return fetchProjects({ featuredOnly: true });
}

export async function getPublishedProjects() {
  return fetchProjects();
}

export async function getProjectBySlug(slug) {
  const supabase = createSupabaseServerClient();

  if (!supabase) return null;

  const { data, error } = await supabase
    .from('projects')
    .select('id, slug, title, short_title, category, location, year, description, long_description, featured, published, sort_order, project_images(id, public_url, storage_path, alt, is_cover, sort_order)')
    .eq('published', true)
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error loading project from Supabase:', error.message);
    return null;
  }

  return data ? mapProject(data) : null;
}

export const featuredProjects = projects.filter((project) => project.published && project.featured);
export const publishedProjects = projects.filter((project) => project.published);
