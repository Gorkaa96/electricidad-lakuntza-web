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
    <div className="grid gap-2 text-sm font-black text-neutral-800">
      Factura PDF o imagen *
      <div className="rounded-[1.4rem] border border-dashed border-neutral-300 bg-neutral-50 p-4 transition focus-within:border-lakuntza-green focus-within:bg-[#F8FCF6] hover:border-lakuntza-green/70 hover:bg-[#F8FCF6]">
        <input
          id={inputId}
          name="invoice"
          required
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />

        <label htmlFor={inputId} className="flex cursor-pointer flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex min-w-0 items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-lakuntza-greenDark shadow-sm ring-1 ring-neutral-200">
              {file ? <CheckCircle2 size={24} /> : <FileText size={24} />}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-black text-neutral-950">
                {file ? file.name : 'Selecciona tu factura'}
              </span>
              <span className="mt-1 block text-xs font-bold leading-5 text-neutral-500">
                {file ? `${file.type || 'Archivo'} · ${formatFileSize(file.size)}` : 'PDF, JPG, PNG o WebP · máximo 10 MB'}
              </span>
            </span>
          </span>

          <span className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-neutral-950 px-4 py-3 text-xs font-black text-white transition hover:bg-lakuntza-greenDark">
            <UploadCloud className="mr-2" size={16} />
            {file ? 'Cambiar archivo' : 'Subir archivo'}
          </span>
        </label>
      </div>
    </div>
  );
}
