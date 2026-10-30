'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginForm({ unauthorized = false }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    let signInError = null;
    try {
      const supabase = createSupabaseBrowserClient();
      const result = await supabase.auth.signInWithPassword({ email, password });
      signInError = result.error;
    } catch {
      setError('No se puede conectar con el servicio de acceso. Inténtalo de nuevo más tarde.');
      setLoading(false);
      return;
    }

    if (signInError) {
      setError('No se ha podido iniciar sesión. Revisa el correo y la contraseña.');
      setLoading(false);
      return;
    }

    // Never navigate to an untrusted URL from query parameters.
    router.push('/admin/facturas');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-neutral-800">Correo electrónico</span>
        <input
          type="email"
          name="email"
          autoComplete="username"
          spellCheck={false}
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-h-12 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base outline-none focus-visible:border-[#347C3B] focus-visible:ring-2 focus-visible:ring-[#A6D4A5]"
          placeholder="correo@empresa.com"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-neutral-800">Contraseña</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="min-h-12 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base outline-none focus-visible:border-[#347C3B] focus-visible:ring-2 focus-visible:ring-[#A6D4A5]"
          placeholder="••••••••"
        />
      </label>

      {unauthorized ? <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm font-bold text-amber-950">Esta cuenta no tiene acceso al panel. Contacta con la persona responsable de Electricidad Lakuntza.</p> : null}
      {error ? <p role="alert" aria-live="polite" className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="min-h-12 rounded-xl bg-[#24652C] px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#184A21] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Entrando…' : 'Entrar al panel'}
      </button>
    </form>
  );
}
