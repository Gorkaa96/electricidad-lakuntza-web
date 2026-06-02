import { createProject, updateProject, deleteProject, setProjectCover, deleteProjectImage } from '@/app/admin/actions';
import { projectCategories } from '@/lib/projects';

export default function ProjectForm({ project }) {
  const isEdit = Boolean(project?.id);
  const action = isEdit ? updateProject.bind(null, project.id) : createProject;
  const images = project?.project_images || project?.images || [];

  return (
    <div className="grid gap-6">
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
          <span className="text-xs font-bold text-neutral-500">JPG, PNG o WebP. Máximo 5 MB por imagen. La primera imagen del proyecto será portada si todavía no hay ninguna marcada.</span>
        </label>

        <div className="grid gap-3 rounded-2xl bg-neutral-50 p-4 sm:grid-cols-3">
          <label className="flex items-center gap-3 text-sm font-black"><input name="published" type="checkbox" defaultChecked={project?.published || false} /> Publicado</label>
          <label className="flex items-center gap-3 text-sm font-black"><input name="featured" type="checkbox" defaultChecked={project?.featured || false} /> Destacado home</label>
          <label className="grid gap-1 text-sm font-black">Orden<input name="sort_order" type="number" defaultValue={project?.sort_order || project?.sortOrder || 100} className="rounded-xl border border-neutral-200 px-3 py-2 text-sm" /></label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" className="rounded-2xl bg-neutral-950 px-6 py-4 text-sm font-black text-white transition hover:bg-lakuntza-greenDark">
            {isEdit ? 'Guardar cambios' : 'Crear proyecto'}
          </button>
          {isEdit ? <button formAction={deleteProject.bind(null, project.id)} className="rounded-2xl border border-red-200 px-6 py-4 text-sm font-black text-red-700 transition hover:bg-red-50">Eliminar proyecto completo</button> : null}
        </div>
      </form>

      {isEdit && images.length > 0 ? (
        <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Imágenes del proyecto</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">Portada y galería</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">La imagen marcada como portada aparece en las tarjetas de la home, en el listado y como imagen principal del detalle.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => {
              const url = typeof image === 'string' ? image : image.public_url || image.url;
              const isCover = Boolean(image.is_cover || image.isCover);
              const imageId = image.id;
              return (
                <article key={imageId || url || index} className={`overflow-hidden rounded-2xl border bg-white ${isCover ? 'border-lakuntza-green ring-2 ring-lakuntza-green/20' : 'border-neutral-200'}`}>
                  <img src={url} alt={image.alt || project.title || ''} className="aspect-[4/3] w-full object-cover" />
                  <div className="grid gap-3 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${isCover ? 'bg-[#F3FAEF] text-lakuntza-greenDark' : 'bg-neutral-100 text-neutral-500'}`}>
                        {isCover ? 'Portada' : `Imagen ${index + 1}`}
                      </span>
                    </div>
                    <div className="grid gap-2">
                      {!isCover && imageId ? (
                        <form action={setProjectCover.bind(null, project.id, imageId)}>
                          <button className="w-full rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-lakuntza-greenDark">Marcar como portada</button>
                        </form>
                      ) : null}
                      {imageId ? (
                        <form action={deleteProjectImage.bind(null, project.id, imageId)}>
                          <button className="w-full rounded-xl border border-red-200 px-4 py-2.5 text-xs font-black text-red-700 transition hover:bg-red-50">Eliminar imagen</button>
                        </form>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
