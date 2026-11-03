'use client';

import { useEffect, useRef, useState } from 'react';
import { validateInvoiceContact } from '@/lib/invoice/validate-contact.mjs';
import { sampleInvoiceBase64 } from '@/lib/invoice/rehearsal-sample.mjs';

export default function InvoiceReviewForm({ rehearsal = false, action, children, ...props }) {
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  const [valid, setValid] = useState(false);
  const result = useRef(null);
  const form = useRef(null);
  useEffect(() => setReady(true), []);
  useEffect(() => { if (message) result.current?.focus(); }, [message]);

  function useSample() {
    const target = form.current;
    target.elements.name.value = 'Persona de prueba';
    target.elements.phone.value = '600000001';
    target.elements.email.value = 'prueba@example.test';
    const bytes = Uint8Array.from(atob(sampleInvoiceBase64), c => c.charCodeAt(0));
    const files = new DataTransfer();
    files.items.add(new File([bytes], 'factura-ficticia.pdf', { type: 'application/pdf' }));
    target.elements.invoice.files = files.files;
    target.elements.invoice.dispatchEvent(new Event('change', { bubbles: true }));
    setMessage('');
  }

  function check(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const file = data.get('invoice');
    const contactValid = validateInvoiceContact({
      name: data.get('name'), phone: data.get('phone'), email: data.get('email'),
      consentAccepted: data.get('consent') === 'on',
    });
    const fileValid = file && file.size > 0 && file.size <= 10 * 1024 * 1024 &&
      ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type);
    const blocked = data.get('supplyType') !== 'gas' &&
      ['si', 'familia_numerosa'].includes(data.get('bonusStatus'));
    const ok = contactValid && fileValid && !blocked;
    setValid(ok);
    setMessage(ok
      ? 'Comprobación local completada. Los campos y el archivo seleccionado son válidos. No se ha enviado la factura, creado un expediente ni enviado un correo.'
      : 'Revisa el teléfono, los datos de contacto, el consentimiento y la factura antes de repetir la comprobación.');
  }

  if (!rehearsal) return <form {...props} action={action}>{children}</form>;

  return (
    <form {...props} ref={form} onSubmit={check} onChange={() => setMessage('')}>
      <fieldset disabled={!ready} className="min-w-0">
        <div className="border-b border-amber-300 bg-amber-50 p-6 text-amber-950 sm:p-8">
          <p className="font-bold">Prueba del formulario · sin envío</p>
          <p className="mt-2 text-sm leading-6">Puedes probar los campos y seleccionar un archivo. El archivo permanece en tu dispositivo: esta prueba no lo sube, no procesa su contenido y no crea solicitudes. Utiliza datos ficticios.</p>
          <button type="button" onClick={useSample} className="focus-ring mt-4 min-h-12 rounded-lg border border-amber-800 bg-white px-4 py-3 text-sm font-semibold">Usar datos y factura de ejemplo</button>
          <p className="mt-2 text-xs leading-5">Elige el suministro, responde sobre el bono social y marca el consentimiento para comprobar el recorrido.</p>
        </div>
        {children}
        <div className="p-5 pt-0 sm:p-8 sm:pt-0">
          <button type="submit" className="focus-ring min-h-14 w-full rounded-xl bg-lakuntza-greenDark px-6 py-4 text-sm font-bold text-white">Comprobar formulario sin enviar</button>
          {message ? <div ref={result} tabIndex={-1} role={valid ? 'status' : 'alert'} className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${valid ? 'border-green-300 bg-green-50 text-green-950' : 'border-red-300 bg-red-50 text-red-950'}`}>{message}</div> : null}
        </div>
      </fieldset>
      <noscript>Activa JavaScript para probar el formulario sin enviar datos.</noscript>
    </form>
  );
}
