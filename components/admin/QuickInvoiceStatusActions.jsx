import { quickUpdateInvoiceStatus } from '@/app/admin/facturas/actions';

const quickStatuses = [
  { status: 'reviewing', label: 'Marcar en revisión', className: 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100' },
  { status: 'contacted', label: 'Marcar contactado', className: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100' },
  { status: 'converted', label: 'Marcar convertido', className: 'border-lakuntza-green/30 bg-[#F3FAEF] text-lakuntza-greenDark hover:bg-lakuntza-green/10' },
  { status: 'discarded', label: 'Descartar', className: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' },
];

export default function QuickInvoiceStatusActions({ leadId, currentStatus }) {
  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">Acciones rápidas</p>
      <div className="mt-3 grid gap-2">
        {quickStatuses.map((item) => (
          <form key={item.status} action={quickUpdateInvoiceStatus}>
            <input type="hidden" name="id" value={leadId} />
            <input type="hidden" name="status" value={item.status} />
            <button
              disabled={currentStatus === item.status}
              className={`inline-flex w-full items-center justify-center rounded-2xl border px-4 py-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-45 ${item.className}`}
            >
              {currentStatus === item.status ? `${item.label} ✓` : item.label}
            </button>
          </form>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-neutral-500">
        Actualiza el estado sin tocar las notas internas. Usa el formulario inferior si quieres guardar una observación junto al cambio.
      </p>
    </div>
  );
}
