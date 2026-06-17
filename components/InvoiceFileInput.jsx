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

  return (
    <div className="min-w-0 text-sm font-black text-neutral-800">
      <span className="block">Factura PDF o imagen *</span>

      <input
        id={inputId}
        name="invoice"
        required
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => setFile(event.target.files?.[0] || null)}
      />

      <label
        htmlFor={inputId}
        className="mt-2 block cursor-pointer rounded-[1.4rem] border border-dashed border-neutral-300 bg-neutral-50 p-4 transition focus-within:border-lakuntza-green hover:border-lakuntza-green/70 hover:bg-[#F8FCF6]"
      >
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
              <span className="mt-1 block text-xs font-bold leading-5 text-neutral-400">
                Tamaño máximo: 10 MB
              </span>
            </span>
          </span>

          <span className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-neutral-950 px-4 py-3 text-xs font-black text-white transition hover:bg-lakuntza-greenDark sm:w-auto">
            <UploadCloud className="mr-2" size={16} />
            {file ? 'Cambiar archivo' : 'Subir archivo'}
          </span>
        </span>
      </label>
    </div>
  );
}
