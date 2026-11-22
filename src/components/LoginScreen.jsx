import React, { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, LogIn, User } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const success = onLogin(identifier.trim(), password);
    if (!success) {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#F5F7F6] px-5 lg:px-8 lg:py-12">
      <section className="w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-6 shadow-xl lg:max-w-md lg:p-10 lg:shadow-2xl">
        <div className="text-center">
          <img
            src="/logo-petrolusa.png"
            alt="Petrolusa App"
            className="mx-auto h-auto w-full max-w-[18rem] object-contain"
          />
          <p className="mt-1 text-sm text-gray-500">Entre para acessar o catálogo e os pedidos.</p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-gray-700">Usuário ou e-mail</span>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-petrolusa focus:ring-2 focus:ring-petrolusa/10"
                placeholder="Digite seu usuário"
                autoComplete="username"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-gray-700">Senha</span>
            <div className="relative">
              <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-11 text-sm outline-none transition focus:border-petrolusa focus:ring-2 focus:ring-petrolusa/10"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-petrolusa px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-petrolusa-dark active:scale-[0.99]"
          >
            <LogIn className="h-4 w-4" />
            Entrar
          </button>
        </form>

      </section>
    </main>
  );
}
