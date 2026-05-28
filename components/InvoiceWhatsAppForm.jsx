'use client';

export default function InvoiceWhatsAppForm() {
  function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get('name');
    const phone = form.get('phone');
    const supply = form.get('supply');
    const notes = form.get('notes');
    const text = `Hola Electricidad Lakuntza. Soy ${name}. Quiero solicitar una comparación gratuita de factura de ${supply}. Mi teléfono es ${phone}.${notes ? ` Comentario: ${notes}` : ''} Ahora adjunto la factura.`;
    window.open(`https://wa.me/34649853448?text=${encodeURIComponent(text)}`, '_blank');
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.6rem] border border-white/10 bg-white/[.04] p-6 text-white sm:p-8">
      <p className="text-xs font-black uppercase tracking-[.22em] text-lakuntza-green">Estudio gratuito</p>
      <h3 className="mt-3 text-3xl font-black tracking-[-.05em]">Enviar factura por WhatsApp</h3>
      <p className="mt-3 text-sm leading-6 text-white/65">
        Rellena los datos y se abrirá WhatsApp con el mensaje preparado. Después adjuntas la foto o PDF de tu factura.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <input name="name" required className="focus-ring rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm outline-none placeholder:text-white/35 focus:border-lakuntza-green" placeholder="Nombre" />
        <input name="phone" required className="focus-ring rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm outline-none placeholder:text-white/35 focus:border-lakuntza-green" placeholder="Teléfono" />
      </div>

      <select name="supply" className="focus-ring mt-4 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm outline-none focus:border-lakuntza-green">
        <option className="text-neutral-950">Luz</option>
        <option className="text-neutral-950">Gas</option>
        <option className="text-neutral-950">Luz y gas</option>
      </select>

      <textarea name="notes" rows={4} className="focus-ring mt-4 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm outline-none placeholder:text-white/35 focus:border-lakuntza-green" placeholder="Comentario opcional" />

      <button className="mt-4 w-full rounded-2xl bg-lakuntza-green px-6 py-4 text-sm font-black text-white shadow-green transition hover:bg-lakuntza-greenDark">
        Preparar WhatsApp
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-white/45">
        También puedes enviar la factura a eleclakuntza@yahoo.es
      </p>
    </form>
  );
}
