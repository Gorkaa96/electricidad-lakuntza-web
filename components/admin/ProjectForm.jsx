import { createProject, updateProject, deleteProject, setProjectCover, deleteProjectImage } from '@/app/admin/actions';
import { projectCategories } from '@/lib/projects';
import ConfirmSubmitButton from './ConfirmSubmitButton';

function Field({ label, children }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black leading-5 text-neutral-900">{label}</span>
      {children}
    </label>
  );
}

function inputClass() {
  return 'w-full min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-lakuntza-green';
}

export default function ProjectForm({ project }) {
  const isEdit = Boolean(project?.id);
  const action = isEdit ? updateProject.bind(null, project.id) : createProject;
  const images = project?.project_images || project?.images || [];

  return (
    <div className="grid gap-6">
      <form action={action} className="grid gap-6">
        <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Contenido</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">Información del trabajo</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Escribe una ficha clara y real. El título corto, la URL y el detalle son opcionales.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Field label="Título del trabajo *">
              <input name="title" defaultValue={project?.title || ''} required className={inputClass()} placeholder="Ej.: Instalación eléctrica en vivienda" />
            </Field>
            <Field label="Título corto">
              <input name="short_title" defaultValue={project?.short_title || project?.shortTitle || ''} className={inputClass()} placeholder="Ej.: Vivienda en Lakuntza" />
            </Field>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <Field label="Categoría *">
              <select name="category" defaultValue={project?.category || ''} required className={inputClass()}>
                <option value="">Seleccionar</option>
                {projectCategories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </Field>
            <Field label="Ubicación">
              <input name="location" defaultValue={project?.location || ''} placeholder="Lakuntza, Navarra" className={inputClass()} />
            </Field>
            <Field label="Año">
              <input name="year" type="number" defaultValue={project?.year || new Date().getFullYear()} className={inputClass()} />
            </Field>
          </div>

          <div className="mt-5 grid gap-5">
            <Field label="Resumen para tarjetas *">
              <textarea name="description" defaultValue={project?.description || ''} required rows={4} className={`${inputClass()} min-h-28`} placeholder="Describe el trabajo realizado de forma sencilla. Recomendado: 1 o 2 frases." />
            </Field>
            <Field label="Detalle del trabajo">
              <textarea name="long_description" defaultValue={project?.long_description || project?.longDescription || ''} rows={6} className={`${inputClass()} min-h-36`} placeholder="Opcional. Explica qué se hizo, dónde y qué resultado tuvo." />
            </Field>
          </div>
        </section>

        <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Publicación</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">Visibilidad en la web</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Puedes guardarlo como borrador y publicarlo cuando el texto y las imágenes estén revisados.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_180px]">
            <Field label="URL del trabajo">
              <input name="slug" defaultValue={project?.slug || ''} placeholder="instalacion-vivienda-lakuntza" className={inputClass()} />
            </Field>
            <Field label="Orden">
              <input name="sort_order" type="number" defaultValue={project?.sort_order || project?.sortOrder || 100} className={inputClass()} />
            </Field>
          </div>

          <div className="mt-6 grid gap-3 rounded-2xl bg-neutral-50 p-4 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-black text-neutral-800">
              <input name="published" type="checkbox" defaultChecked={project?.published || false} className="h-4 w-4 accent-lakuntza-green" />
              Publicar en la web
            </label>
            <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-black text-neutral-800">
              <input name="featured" type="checkbox" defaultChecked={project?.featured || false} className="h-4 w-4 accent-lakuntza-green" />
              Mostrar en la home
            </label>
          </div>
        </section>

        <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Imágenes</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">Fotos del trabajo</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Sube imágenes reales y limpias. La portada será la imagen principal en la web.
            </p>
          </div>

          <input name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple className="w-full rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-5 text-sm" />
          <p className="mt-3 text-xs font-bold leading-5 text-neutral-500">JPG, PNG o WebP. Máximo 5 MB por imagen.</p>
        </section>

        <div className="flex flex-col gap-3 rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" className="rounded-2xl bg-neutral-950 px-6 py-4 text-sm font-black text-white transition hover:bg-lakuntza-greenDark">
            {isEdit ? 'Guardar cambios' : 'Crear trabajo'}
          </button>
          {isEdit ? (
            <ConfirmSubmitButton
              formAction={deleteProject.bind(null, project.id)}
              message="Vas a eliminar el trabajo completo y todas sus imágenes. Esta acción no se puede deshacer. ¿Quieres continuar?"
              className="rounded-2xl border border-red-200 px-6 py-4 text-sm font-black text-red-700 transition hover:bg-red-50"
            >
              Eliminar trabajo
            </ConfirmSubmitButton>
          ) : null}
        </div>
      </form>

      {isEdit && images.length > 0 ? (
        <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Galería</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">Imágenes actuales</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Marca la mejor foto como portada. Elimina solo imágenes que no quieras mostrar.</p>
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
                    <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${isCover ? 'bg-[#F3FAEF] text-lakuntza-greenDark' : 'bg-neutral-100 text-neutral-500'}`}>
                      {isCover ? 'Portada' : `Imagen ${index + 1}`}
                    </span>
                    {!isCover && imageId ? (
                      <form action={setProjectCover.bind(null, project.id, imageId)}>
                        <button className="w-full rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-lakuntza-greenDark">Usar como portada</button>
                      </form>
                    ) : null}
                    {imageId ? (
                      <form action={deleteProjectImage.bind(null, project.id, imageId)}>
                        <ConfirmSubmitButton
                          message="Vas a eliminar esta imagen del trabajo. Esta acción no se puede deshacer. ¿Quieres continuar?"
                          className="w-full rounded-xl border border-red-200 px-4 py-2.5 text-xs font-black text-red-700 transition hover:bg-red-50"
                        >
                          Eliminar imagen
                        </ConfirmSubmitButton>
                      </form>
                    ) : null}
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
