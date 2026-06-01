'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError('No se ha podido iniciar sesión. Revisa el correo y la contraseña.');
      setLoading(false);
      return;
    }

    const next = searchParams.get('next') || '/admin/proyectos';
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
      <label className="grid gap-2">
        <span className="text-sm font-black text-neutral-800">Correo</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-lakuntza-green"
          placeholder="correo@empresa.com"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-black text-neutral-800">Contraseña</span>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-lakuntza-green"
          placeholder="••••••••"
        />
      </label>

      {error ? <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl bg-neutral-950 px-5 py-4 text-sm font-black text-white transition hover:bg-lakuntza-greenDark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Entrando...' : 'Entrar al panel'}
      </button>
    </form>
  );
}
