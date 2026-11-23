'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { validTotpCode } from '@/lib/admin-mfa.mjs';

export default function MfaChallenge() {
  const router = useRouter();
  const [factorId, setFactorId] = useState('');
  const [code, setCode] = useState('');
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error: factorsError } = await supabase.auth.mfa.listFactors();
        if (!active) return;
        if (factorsError) throw factorsError;
        const factor = (data?.totp || []).find((item) => item.status === 'verified');
        if (!factor) {
          setError('No se encuentra un autenticador verificado. Contacta con la persona administradora.');
        } else {
          setFactorId(factor.id);
        }
      } catch {
        if (active) setError('No se ha podido consultar el método de autenticación. Reinténtalo.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  async function verify(event) {
    event.preventDefault();
    if (!factorId || !validTotpCode(code)) {
      setError('Introduce un código válido de seis cifras.');
      return;
    }
    setPending(true);
    setError('');
    try {
      const supabase = createSupabaseBrowserClient();
      const result = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: code.trim(),
      });
      if (result.error) throw result.error;
      router.replace('/admin/entrada');
      router.refresh();
    } catch {
      setError('Código incorrecto o caducado. Comprueba la hora del dispositivo e inténtalo de nuevo.');
      setPending(false);
    }
  }

  async function signOut() {
    setPending(true);
    try {
      await createSupabaseBrowserClient().auth.signOut();
    } finally {
      router.replace('/admin/login');
      router.refresh();
    }
  }

  return (
    <div className="mt-7">
      {loading ? <p role="status" className="text-sm text-neutral-600">Comprobando el autenticador…</p> : (
        <form onSubmit={verify} className="grid gap-4">
          <label className="grid gap-2 text-sm font-semibold">
            Código de autenticación
            <input type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6}
              autoComplete="one-time-code" required disabled={!factorId || pending}
              value={code} onChange={(event) => setCode(event.target.value)}
              placeholder="000000"
              className="min-h-12 rounded-xl border border-neutral-300 px-4 text-base tracking-[.18em] focus-visible:outline-2 focus-visible:outline-[#24652C]" />
          </label>
          {error ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
          <button type="submit" disabled={!factorId || pending} className="min-h-12 rounded-xl bg-[#24652C] px-4 font-semibold text-white disabled:opacity-50">
            {pending ? 'Verificando…' : 'Verificar y entrar'}
          </button>
        </form>
      )}
      <button type="button" onClick={signOut} disabled={pending}
        className="mt-5 text-sm font-semibold text-[#24652C] underline disabled:opacity-50">Cerrar sesión</button>
    </div>
  );
}
