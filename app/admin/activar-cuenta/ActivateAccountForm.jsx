'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function ActivateAccountForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let alive = true;
    supabase.auth.getUser().then(({ data }) => {
      if (alive) { setAuthenticated(Boolean(data?.user)); setReady(true); }
    }).catch(() => { if (alive) setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (alive && session) { setAuthenticated(true); setReady(true); }
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  async function activate(event) {
    event.preventDefault();
    setError('');
    if (password.length < 12 || password !== confirmPassword) {
      setError('La contraseña debe tener al menos 12 caracteres y coincidir en ambos campos.');
      return;
    }
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) { setError('No hemos podido establecer la contraseña. Abre de nuevo tu enlace de invitación.'); return; }
      router.replace('/admin/entrada');
      router.refresh();
    } catch {
      setError('No se ha podido contactar con el servicio de acceso.');
    } finally { setBusy(false); }
  }

  if (!ready) return <p className="mt-6 text-sm text-neutral-600">Comprobando invitación…</p>;
  if (!authenticated) return <p role="alert" className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-7 text-amber-900">No hay una invitación activa en esta sesión. Abre el enlace original del correo. Si ha caducado, solicita otro al administrador.</p>;

  return (
    <form onSubmit={activate} className="mt-7 grid gap-5">
      <label className="grid gap-2 text-sm font-semibold">Contraseña nueva
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} minLength={12} autoComplete="new-password" required className="min-h-12 rounded-xl border border-neutral-300 px-4 py-3 font-normal"/>
      </label>
      <label className="grid gap-2 text-sm font-semibold">Repetir contraseña
        <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} minLength={12} autoComplete="new-password" required className="min-h-12 rounded-xl border border-neutral-300 px-4 py-3 font-normal"/>
      </label>
      {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
      <button type="submit" disabled={busy} className="min-h-12 rounded-xl bg-[#24662D] px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Guardando…' : 'Activar mi cuenta'}</button>
    </form>
  );
}
