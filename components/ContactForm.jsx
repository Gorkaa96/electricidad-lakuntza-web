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
    <form onSubmit={handleSubmit} className="rounded-[1.8rem] border border-neutral-200 bg-white p-5 shadow-2xl sm:rounded-[2.2rem] sm:p-9">
      <h3 className="text-2xl font-black tracking-[-.05em] sm:text-3xl">Formulario de solicitud</h3>
      <p className="mt-3 text-sm leading-6 text-neutral-500">Déjanos tus datos y una breve descripción del trabajo.</p>

      <div className="mt-7 grid gap-4 sm:mt-8 sm:grid-cols-2">
        <input name="contactName" required autoComplete="name" className="focus-ring min-h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-base outline-none focus:border-lakuntza-green sm:text-sm" placeholder="Nombre" />
        <input name="contactPhone" required type="tel" inputMode="tel" autoComplete="tel" className="focus-ring min-h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-base outline-none focus:border-lakuntza-green sm:text-sm" placeholder="Teléfono" />
      </div>

      <select name="service" className="focus-ring mt-4 min-h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-base outline-none focus:border-lakuntza-green sm:text-sm">
        <option>Instalación eléctrica</option>
        <option>Avería o mantenimiento</option>
        <option>Telecomunicaciones</option>
        <option>Comparación de factura / luz y gas</option>
        <option>Otro</option>
      </select>

      <textarea name="message" required rows={5} className="focus-ring mt-4 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-base outline-none focus:border-lakuntza-green sm:text-sm" placeholder="Describe brevemente qué necesitas, ubicación aproximada y urgencia." />

      <p className="mt-4 rounded-2xl bg-neutral-50 p-4 text-xs leading-5 text-neutral-500">
        Al preparar el email aceptas que Electricidad Lakuntza trate los datos indicados para responder a tu solicitud. Puedes consultar más información en la <a href="/privacidad" className="font-black text-lakuntza-greenDark underline">política de privacidad</a>.
      </p>

      <button className="mt-4 w-full rounded-2xl bg-neutral-950 px-6 py-4 text-sm font-black text-white transition hover:bg-lakuntza-greenDark sm:w-auto">
        Preparar email
      </button>
    </form>
  );
}
