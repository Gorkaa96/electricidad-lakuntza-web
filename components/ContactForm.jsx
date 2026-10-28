'use client';

const whatsappNumber = '34649853448';
const emailTo = 'eleclakuntza@yahoo.es';

function getMessage(form) {
  const name = String(form.get('contactName') || '').trim();
  const phone = String(form.get('contactPhone') || '').trim();
  const service = String(form.get('service') || '').trim();
  const message = String(form.get('message') || '').trim();
  return { service, body: `Consulta desde la web de Electricidad Lakuntza

Nombre: ${name}
Teléfono: ${phone}
Motivo: ${service}

Mensaje:
${message}` };
}

export default function ContactForm() {
  function handleSubmit(event) {
    event.preventDefault();
    const { body } = getMessage(new FormData(event.currentTarget));
    window.location.assign(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(body)}`);
  }

  function prepareEmail(event) {
    const form = event.currentTarget.form;
    if (!form.reportValidity()) return;
    const { service, body } = getMessage(new FormData(form));
    window.location.assign(`mailto:${emailTo}?subject=${encodeURIComponent('Consulta web - ' + service)}&body=${encodeURIComponent(body)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="min-w-0 rounded-[1.8rem] border border-neutral-200 bg-white p-5 shadow-card sm:rounded-[2.2rem] sm:p-9">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Contacto directo</p>
      <h3 className="mt-3 text-2xl font-black tracking-[-.05em] sm:text-3xl">Cuéntanos qué necesitas.</h3>
      <p className="mt-3 text-sm leading-6 text-neutral-600">No hace falta tener una factura a mano. Puedes preparar tu consulta y enviárnosla por WhatsApp o por email.</p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="grid min-w-0 gap-2 text-sm font-bold text-neutral-800">Nombre *
          <input name="contactName" required autoComplete="name" maxLength={100} className="focus-ring min-h-12 w-full min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-base outline-none focus:border-lakuntza-green sm:text-sm" />
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-bold text-neutral-800">Teléfono *
          <input name="contactPhone" required type="tel" inputMode="tel" autoComplete="tel" maxLength={25} className="focus-ring min-h-12 w-full min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-base outline-none focus:border-lakuntza-green sm:text-sm" />
        </label>
      </div>

      <label className="mt-4 grid gap-2 text-sm font-bold text-neutral-800">Motivo
        <select name="service" defaultValue="Revisión de luz y gas" className="focus-ring min-h-12 w-full min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-base outline-none focus:border-lakuntza-green sm:text-sm">
          <option>Revisión de luz y gas</option>
          <option>Alarmas de Movistar Prosegur</option>
          <option>Instalación eléctrica</option>
          <option>Avería o mantenimiento</option>
          <option>Telecomunicaciones</option>
          <option>Otro</option>
        </select>
      </label>

      <label className="mt-4 grid gap-2 text-sm font-bold text-neutral-800">Consulta *
        <textarea name="message" required maxLength={1000} rows={4} className="focus-ring w-full min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-base outline-none focus:border-lakuntza-green sm:text-sm" placeholder="Describe brevemente qué necesitas. No incluyas datos bancarios o documentos personales." />
      </label>

      <p className="mt-4 text-xs leading-6 text-neutral-500">El formulario prepara el mensaje, pero no lo envía automáticamente. Al continuar se abrirá WhatsApp o tu aplicación de correo; tendrás que confirmar el envío. Consulta nuestra <a href="/privacidad" className="font-bold text-lakuntza-greenDark underline">política de privacidad</a>.</p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="rounded-2xl bg-lakuntza-green px-6 py-4 text-sm font-black text-white shadow-green transition hover:bg-lakuntza-greenDark">Continuar por WhatsApp</button>
        <button type="button" onClick={prepareEmail} className="rounded-2xl border border-neutral-300 bg-white px-6 py-4 text-sm font-black text-neutral-900 transition hover:border-lakuntza-green">Preparar email</button>
      </div>
    </form>
  );
}
