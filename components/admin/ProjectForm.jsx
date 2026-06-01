import { createProject, updateProject, deleteProject } from '@/app/admin/actions';
import { projectCategories } from '@/lib/projects';

export default function ProjectForm({ project }) {
  const isEdit = Boolean(project?.id);
  const action = isEdit ? updateProject.bind(null, project.id) : createProject;

  return (
    <form action={action} className="grid gap-6 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
      <div className="grid gap-5 lg:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-black">Título *</span>
          <input name="title" defaultValue={project?.title || ''} required className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-lakuntza-green" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-black">Título corto</span>
          <input name="short_title" defaultValue={project?.short_title || project?.shortTitle || ''} className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-lakuntza-green" />
        </label>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <label className="grid gap-2">
          <span className="text-sm font-black">Categoría *</span>
          <select name="category" defaultValue={project?.category || ''} required className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-lakuntza-green">
            <option value="">Seleccionar</option>
            {projectCategories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-black">Ubicación</span>
          <input name="location" defaultValue={project?.location || ''} placeholder="Lakuntza, Navarra" className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-lakuntza-green" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-black">Año</span>
          <input name="year" type="number" defaultValue={project?.year || new Date().getFullYear()} className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-lakuntza-green" />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-black">Slug URL</span>
        <input name="slug" defaultValue={project?.slug || ''} placeholder="se genera desde el título si lo dejas vacío" className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-lakuntza-green" />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-black">Descripción corta *</span>
        <textarea name="description" defaultValue={project?.description || ''} required rows={4} className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-lakuntza-green" />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-black">Descripción ampliada</span>
        <textarea name="long_description" defaultValue={project?.long_description || project?.longDescription || ''} rows={6} className="rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-lakuntza-green" />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-black">Añadir imágenes</span>
        <input name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-5 text-sm" />
        <span className="text-xs font-bold text-neutral-500">Sube imágenes reales y limpias. Mejor pocas y buenas que muchas repetidas.</span>
      </label>

      <div className="grid gap-3 rounded-2xl bg-neutral-50 p-4 sm:grid-cols-3">
        <label className="flex items-center gap-3 text-sm font-black"><input name="published" type="checkbox" defaultChecked={project?.published || false} /> Publicado</label>
        <label className="flex items-center gap-3 text-sm font-black"><input name="featured" type="checkbox" defaultChecked={project?.featured || false} /> Destacado home</label>
        <label className="grid gap-1 text-sm font-black">Orden<input name="sort_order" type="number" defaultValue={project?.sort_order || project?.sortOrder || 100} className="rounded-xl border border-neutral-200 px-3 py-2 text-sm" /></label>
      </div>

      {project?.project_images?.length || project?.images?.length ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {(project.project_images || project.images || []).map((image, index) => {
            const url = typeof image === 'string' ? image : image.public_url;
            return <img key={url || index} src={url} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />;
          })}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="rounded-2xl bg-neutral-950 px-6 py-4 text-sm font-black text-white transition hover:bg-lakuntza-greenDark">
          {isEdit ? 'Guardar cambios' : 'Crear proyecto'}
        </button>
        {isEdit ? <button formAction={deleteProject.bind(null, project.id)} className="rounded-2xl border border-red-200 px-6 py-4 text-sm font-black text-red-700 transition hover:bg-red-50">Eliminar proyecto</button> : null}
      </div>
    </form>
  );
}
