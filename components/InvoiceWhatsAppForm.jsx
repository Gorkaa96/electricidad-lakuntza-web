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
    <form onSubmit={handleSubmit} className="rounded-[1.6rem] border border-white/10 bg-white/[.04] p-5 text-white sm:p-8">
      <p className="text-xs font-black uppercase tracking-[.22em] text-lakuntza-green">Estudio gratuito</p>
      <h3 className="mt-3 text-2xl font-black tracking-[-.05em] sm:text-3xl">Enviar factura por WhatsApp</h3>
      <p className="mt-3 text-sm leading-6 text-white/65">
        Rellena los datos y se abrirá WhatsApp con el mensaje preparado. Después adjuntas la foto o PDF de tu factura.
      </p>

      <div className="mt-7 grid gap-4 sm:mt-8 sm:grid-cols-2">
        <input name="name" required autoComplete="name" className="focus-ring min-h-12 rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-base outline-none placeholder:text-white/35 focus:border-lakuntza-green sm:text-sm" placeholder="Nombre" />
        <input name="phone" required type="tel" inputMode="tel" autoComplete="tel" className="focus-ring min-h-12 rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-base outline-none placeholder:text-white/35 focus:border-lakuntza-green sm:text-sm" placeholder="Teléfono" />
      </div>

      <select name="supply" className="focus-ring mt-4 min-h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-base outline-none focus:border-lakuntza-green sm:text-sm">
        <option className="text-neutral-950">Luz</option>
        <option className="text-neutral-950">Gas</option>
        <option className="text-neutral-950">Luz y gas</option>
      </select>

      <textarea name="notes" rows={4} className="focus-ring mt-4 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-base outline-none placeholder:text-white/35 focus:border-lakuntza-green sm:text-sm" placeholder="Comentario opcional" />

      <p className="mt-4 rounded-2xl border border-white/10 bg-white/[.06] p-4 text-xs leading-5 text-white/50">
        La solicitud se enviará por WhatsApp. Electricidad Lakuntza usará tus datos para revisar la factura y responder a tu consulta. Más información en la <a href="/privacidad" className="font-black text-lakuntza-green underline">política de privacidad</a>.
      </p>

      <button className="mt-4 w-full rounded-2xl bg-lakuntza-green px-6 py-4 text-sm font-black text-white shadow-green transition hover:bg-lakuntza-greenDark">
        Preparar WhatsApp
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-white/45">
        También puedes enviar la factura a eleclakuntza@yahoo.es
      </p>
    </form>
  );
}
