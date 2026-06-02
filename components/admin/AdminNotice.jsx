const successMessages = {
  created: 'Trabajo creado correctamente.',
  updated: 'Cambios guardados correctamente.',
  deleted: 'Trabajo eliminado correctamente.',
  cover: 'Portada actualizada correctamente.',
  'image-deleted': 'Imagen eliminada correctamente.',
};

const errorMessages = {
  missing: 'Faltan campos obligatorios. Revisa el título, la categoría y el resumen.',
  'image-not-found': 'No se ha encontrado la imagen indicada.',
  unauthorized: 'No tienes permisos para acceder al panel.',
};

export default function AdminNotice({ success, error }) {
  if (!success && !error) return null;

  const isError = Boolean(error);
  const message = isError
    ? errorMessages[error] || 'No se ha podido completar la acción. Revisa los datos e inténtalo de nuevo.'
    : successMessages[success] || 'Acción completada correctamente.';

  return (
    <div className={`mb-6 rounded-2xl border p-4 text-sm font-bold ${isError ? 'border-red-200 bg-red-50 text-red-700' : 'border-lakuntza-green/20 bg-[#F3FAEF] text-lakuntza-greenDark'}`}>
      {message}
    </div>
  );
}
