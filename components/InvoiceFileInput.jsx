'use client';

import { useId, useState } from 'react';
import { CheckCircle2, FileText, UploadCloud } from 'lucide-react';

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function InvoiceFileInput() {
  const inputId = useId();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const maxSize = 10 * 1024 * 1024;
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

  function handleFileChange(event) {
    const selected = event.target.files?.[0] || null;
    setError('');
    if (selected && selected.size > maxSize) {
      event.target.value = '';
      setFile(null);
      setError('El archivo supera los 10 MB. Selecciona una factura más ligera.');
      return;
    }
    if (selected && !allowedTypes.includes(selected.type)) {
      event.target.value = '';
      setFile(null);
      setError('Formato no admitido. Sube PDF, JPG, PNG o WebP. Si tu foto es HEIC, envía una captura de pantalla.');
      return;
    }
    setFile(selected);
  }

  return (
    <div className="min-w-0 text-sm font-black text-neutral-800">
      <span className="block">Factura PDF o imagen *</span>

      <label
        htmlFor={inputId}
        className="relative mt-2 block cursor-pointer rounded-[1.4rem] border border-dashed border-neutral-300 bg-neutral-50 p-4 transition-colors focus-within:border-lakuntza-greenDark focus-within:ring-2 focus-within:ring-lakuntza-greenDark/40 hover:border-lakuntza-greenDark hover:bg-[#F8FCF6]"
      >
        <input
          id={inputId}
          name="invoice"
          required
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          aria-describedby={error ? `${inputId}-ayuda ${inputId}-error` : `${inputId}-ayuda`}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          onChange={handleFileChange}
        />
        <span className="block min-w-0">
          <span className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-lakuntza-greenDark shadow-sm ring-1 ring-neutral-200">
              {file ? <CheckCircle2 size={24} /> : <FileText size={24} />}
            </span>

            <span className="block min-w-0 flex-1">
              <span className="block max-w-full truncate text-sm font-black text-neutral-950">
                {file ? file.name : 'Selecciona tu factura'}
              </span>
              <span className="mt-1 block text-xs font-bold leading-5 text-neutral-500">
                {file ? `${file.type || 'Archivo'} · ${formatFileSize(file.size)}` : 'PDF, JPG, PNG o WebP'}
              </span>
              <span id={`${inputId}-ayuda`} className="mt-1 block text-xs font-bold leading-5 text-neutral-500">
                Tamaño máximo: 10 MB. Si haces una foto, comprueba que se pueda leer.
              </span>
            </span>
          </span>

          <span className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-neutral-950 px-4 py-3 text-xs font-black text-white transition hover:bg-lakuntza-greenDark sm:w-auto">
            <UploadCloud className="mr-2" size={16} />
            {file ? 'Cambiar archivo' : 'Subir archivo'}
          </span>
        </span>
      </label>
      {error ? <p id={`${inputId}-error`} role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold leading-6 text-red-800">{error}</p> : null}
    </div>
  );
}
