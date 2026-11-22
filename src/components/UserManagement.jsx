import React, { useState } from 'react';
import { Pencil, Plus, Trash2, UserCheck, X } from 'lucide-react';

const EMPTY_USER = {
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'representante',
  active: true
};

export default function UserManagement({ users, onSave, onDelete }) {
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(EMPTY_USER);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openNew = () => {
    setEditingUser(null);
    setForm(EMPTY_USER);
    setIsModalOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({ ...user });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingUser(null);
    setForm(EMPTY_USER);
    setIsModalOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...form,
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      id: editingUser?.id
    });
    closeModal();
  };

  return (
    <div className="space-y-4 p-4 pb-8 lg:space-y-5 lg:p-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-petrolusa">Administração</p>
          <h2 className="text-lg font-bold text-gray-900">Gerenciar usuários</h2>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 rounded-xl bg-petrolusa px-3 py-2 text-xs font-bold text-white shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Novo
        </button>
      </div>

      <div className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {users.map((user) => (
          <article key={user.id} className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xs">
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${user.active ? 'bg-petrolusa-light text-petrolusa' : 'bg-gray-100 text-gray-400'}`}>
                <UserCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-bold text-gray-900">{user.name}</h3>
                  {!user.active && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">Inativo</span>}
                </div>
                <p className="truncate text-xs text-gray-500">@{user.username} · {user.email}</p>
                <p className="mt-1 text-xs font-semibold capitalize text-petrolusa">{user.role}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(user)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label={`Editar ${user.name}`}>
                  <Pencil className="h-4 w-4" />
                </button>
                {user.username !== 'admin' && (
                  <button
                    onClick={() => onDelete(user.id)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                    aria-label={`Excluir ${user.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{editingUser ? 'Editar usuário' : 'Novo usuário'}</h3>
              <button type="button" onClick={closeModal} className="rounded-full p-2 text-gray-500 hover:bg-gray-100" aria-label="Fechar">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" placeholder="Nome completo" required />
              <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" placeholder="Usuário" required />
              <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" placeholder="E-mail" required />
              <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" placeholder={editingUser ? 'Nova senha (opcional)' : 'Senha'} type="password" required={!editingUser} />
              <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm">
                <option value="representante">Representante</option>
                <option value="admin">Administrador</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} />
                Usuário ativo
              </label>
            </div>
            <button type="submit" className="mt-5 w-full rounded-xl bg-petrolusa px-4 py-3 text-sm font-bold text-white">
              Salvar usuário
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
