'use client';

export default function ContactForm() {
  function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get('contactName');
    const phone = form.get('contactPhone');
    const service = form.get('service');
    const message = form.get('message');
    const subject = `Solicitud web - ${service}`;
    const body = `Nombre: ${name}\nTeléfono: ${phone}\nMotivo: ${service}\n\nMensaje:\n${message}`;
    window.location.href = `mailto:eleclakuntza@yahoo.es?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2.2rem] border border-neutral-200 bg-white p-7 shadow-2xl sm:p-9">
      <h3 className="text-3xl font-black tracking-[-.05em]">Formulario de solicitud</h3>
      <p className="mt-3 text-sm leading-6 text-neutral-500">Déjanos tus datos y una breve descripción del trabajo.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <input name="contactName" required className="focus-ring rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-sm outline-none focus:border-lakuntza-green" placeholder="Nombre" />
        <input name="contactPhone" required className="focus-ring rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-sm outline-none focus:border-lakuntza-green" placeholder="Teléfono" />
      </div>

      <select name="service" className="focus-ring mt-4 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-sm outline-none focus:border-lakuntza-green">
        <option>Instalación eléctrica</option>
        <option>Avería o mantenimiento</option>
        <option>Telecomunicaciones</option>
        <option>Comparación de factura / luz y gas</option>
        <option>Otro</option>
      </select>

      <textarea name="message" required rows={5} className="focus-ring mt-4 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-sm outline-none focus:border-lakuntza-green" placeholder="Describe brevemente qué necesitas, ubicación aproximada y urgencia." />

      <button className="mt-4 rounded-2xl bg-neutral-950 px-6 py-4 text-sm font-black text-white transition hover:bg-lakuntza-greenDark">
        Preparar email
      </button>
    </form>
  );
}
