'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { validTotpCode } from '@/lib/admin-mfa.mjs';

export default function SecurityFactors() {
  const router = useRouter();
  const [factors, setFactors] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function loadFactors() {
    const { data, error: listError } = await createSupabaseBrowserClient().auth.mfa.listFactors();
    if (listError) throw listError;
    setFactors((data?.totp || []).filter((item) => item.status === 'verified'));
  }

  useEffect(() => {
    let active = true;
    createSupabaseBrowserClient().auth.mfa.listFactors()
      .then(({ data, error: listError }) => {
        if (!active) return;
        if (listError) throw listError;
        setFactors((data?.totp || []).filter((item) => item.status === 'verified'));
      })
      .catch(() => { if (active) setError('No se ha podido consultar la configuración de seguridad.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function startEnrollment() {
    setError('');
    setNotice('');
    setBusy(true);
    try {
      const { data, error: enrollError } = await createSupabaseBrowserClient().auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Autenticador Electricidad Lakuntza',
      });
      if (enrollError || !data?.id || !data?.totp?.secret) throw enrollError || new Error('No TOTP');
      setEnrollment({ id: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
    } catch {
      setError('No se ha podido crear el autenticador. Revisa la conexión y vuelve a intentarlo.');
    } finally {
      setBusy(false);
    }
  }

  async function verifyEnrollment(event) {
    event.preventDefault();
    if (!enrollment || !validTotpCode(code)) {
      setError('Introduce las seis cifras del código.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const { error: verifyError } = await createSupabaseBrowserClient().auth.mfa.challengeAndVerify({
        factorId: enrollment.id,
        code: code.trim(),
      });
      if (verifyError) throw verifyError;
      setEnrollment(null);
      setCode('');
      await loadFactors();
      setNotice('Autenticación en dos pasos configurada. Las otras sesiones se han cerrado por seguridad.');
      router.refresh();
    } catch {
      setError('No se ha podido verificar el código. Comprueba el autenticador e inténtalo de nuevo.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
      <h2 className="text-xl font-semibold">Autenticación en dos pasos</h2>
      <p className="mt-3 text-sm leading-7 text-neutral-600">
        Usa una aplicación de códigos temporales (TOTP) para proteger tu cuenta. No guardes
        el código QR ni la clave secreta en fotografías, correos o documentos compartidos.
      </p>
      {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}
      {notice ? <p role="status" className="mt-4 rounded-xl bg-green-50 p-4 text-sm text-green-900">{notice}</p> : null}
      {loading ? <p className="mt-4 text-sm text-neutral-500">Consultando métodos…</p> : (
        <>
          <p className="mt-5 text-sm font-semibold text-neutral-700">
            {factors.length > 0 ? 'Autenticadores verificados: ' + factors.length : 'Todavía no hay autenticadores verificados.'}
          </p>
          {factors.length > 0 ? <p className="mt-2 text-sm text-neutral-600">
            Puedes añadir otro autenticador para disponer de un método de recuperación. Supabase no ofrece códigos de recuperación TOTP en esta integración.
          </p> : null}
          {!enrollment ? (
            <button type="button" disabled={busy} onClick={startEnrollment}
              className="mt-5 min-h-12 rounded-xl bg-[#24652C] px-5 font-semibold text-white disabled:opacity-50">
              {busy ? 'Preparando…' : factors.length > 0 ? 'Añadir otro autenticador' : 'Configurar autenticador'}
            </button>
          ) : (
            <form onSubmit={verifyEnrollment} className="mt-6 grid gap-4 rounded-xl border border-neutral-200 bg-[#F8FAF8] p-5">
              <h3 className="font-semibold">Añadir autenticador</h3>
              {enrollment.qr?.startsWith('data:image/') ? (
                <img src={enrollment.qr} alt="Código QR de configuración TOTP"
                  className="h-44 w-44 rounded-lg bg-white p-2" />
              ) : null}
              <p className="text-sm text-neutral-700">Escanea el QR con tu aplicación, o introduce la siguiente clave en ella:</p>
              <code className="break-all rounded-lg bg-white p-3 text-sm">{enrollment.secret}</code>
              <label className="grid gap-2 text-sm font-semibold">
                Código temporal de 6 cifras
                <input type="text" inputMode="numeric" pattern="[0-9]{6}"
                  maxLength={6} autoComplete="one-time-code" required
                  value={code} onChange={(event) => setCode(event.target.value)}
                  className="min-h-12 rounded-xl border border-neutral-300 bg-white px-4 text-base"
                  placeholder="000000" />
              </label>
              <button type="submit" disabled={busy}
                className="min-h-12 rounded-xl bg-[#24652C] px-4 font-semibold text-white disabled:opacity-50">
                {busy ? 'Verificando…' : 'Verificar y activar'}
              </button>
            </form>
          )}
          <p className="mt-6 text-xs leading-6 text-neutral-500">
            El segundo factor se exige para las sesiones de las cuentas que lo hayan activado.
            Antes de depender de este método, confirma un procedimiento de recuperación con la administración.
          </p>
        </>
      )}
    </section>
  );
}
