export default function IntakeNotificationNotice({ status }) {
  if (!['pending', 'failed'].includes(status)) return null;
  return (
    <p role="status" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
      {status === 'failed' ? 'El aviso por correo ha fallado.' : 'El aviso por correo no está confirmado.'}
      {' '}La solicitud está guardada. Atiéndela desde el panel y revisa el servicio de correo.
    </p>
  );
}
