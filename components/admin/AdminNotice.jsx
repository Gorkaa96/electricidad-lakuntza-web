const successMessages = {
  created: 'Trabajo creado correctamente.',
  updated: 'Cambios guardados correctamente.',
  deleted: 'Trabajo eliminado correctamente.',
  cover: 'Portada actualizada correctamente.',
  'image-deleted': 'Imagen eliminada correctamente.',
  estado: 'Estado actualizado correctamente.',
  analisis: 'Análisis guardado correctamente.',
  eliminada: 'Solicitud eliminada correctamente.',
  ocr_preparado: 'Lectura preparada correctamente.',
  ocr_completado: 'Lectura completada correctamente. Revisa los datos extraídos antes de contactar con el cliente.',
};

const errorMessages = {
  missing: 'Faltan campos obligatorios. Revisa el título, la categoría y el resumen.',
  'image-not-found': 'No se ha encontrado la imagen indicada.',
  unauthorized: 'No tienes permisos para acceder al panel.',
  datos: 'Faltan datos o la solicitud no existe.',
  estado: 'No se ha podido actualizar el estado.',
  analisis: 'No se ha podido guardar el análisis.',
  eliminar: 'No se ha podido eliminar la solicitud.',
  confirmacion: 'Para eliminar la solicitud tienes que escribir ELIMINAR.',
  ocr: 'No se ha podido procesar la lectura.',
  ocr_archivo: 'No hay archivo de factura asociado o no se ha podido leer.',
  ocr_config: 'La lectura automática no está configurada. Revisa manualmente o revisa la configuración.',
  ocr_json: 'No se ha devuelto un JSON válido. Revisa la factura manualmente o vuelve a intentarlo.',
  ocr_tipo: 'La lectura actual solo procesa PDF con texto. Para imágenes hará falta otro OCR o revisión manual.',
  ocr_texto: 'El PDF no contiene texto suficiente. Probablemente es escaneado o una imagen dentro de PDF.',
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
