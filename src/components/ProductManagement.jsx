import React, { useState } from 'react';
import { PackagePlus, Pencil, Trash2, X } from 'lucide-react';

const EMPTY_PRODUCT = {
  codigo: '',
  nome: '',
  categoria: 'Thinners',
  volume: '',
  preco: '',
  imagem: '/products/thinner-101.png',
  descricao: '',
  estoque: ''
};

export default function ProductManagement({ products, onSave, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_PRODUCT);
    setIsOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({ ...product, preco: String(product.preco), estoque: String(product.estoque ?? '') });
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setEditing(null);
    setForm(EMPTY_PRODUCT);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...form,
      id: editing?.id,
      preco: Number(form.preco),
      estoque: Number(form.estoque)
    });
    close();
  };

  return (
    <div className="space-y-3 p-4 lg:space-y-4 lg:p-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-petrolusa">Catálogo</p>
          <h2 className="text-lg font-bold text-gray-900">Gerenciar produtos</h2>
        </div>
        <button onClick={openCreate} className="flex items-center gap-1.5 rounded-xl bg-petrolusa px-3 py-2 text-xs font-bold text-white">
          <PackagePlus className="h-4 w-4" />
          Novo
        </button>
      </div>

      <div className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {products.map((product) => (
          <article key={product.id} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3">
            <img src={product.imagem} alt={product.nome} className="h-14 w-14 rounded-xl bg-gray-50 object-contain p-1" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-gray-900">{product.nome}</p>
              <p className="text-xs text-gray-500">{product.codigo} · {product.volume}</p>
              <p className="mt-0.5 text-xs font-bold text-petrolusa">R$ {product.preco.toFixed(2).replace('.', ',')}</p>
            </div>
            <div className="flex">
              <button onClick={() => openEdit(product)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label={`Editar ${product.nome}`}>
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => onDelete(product.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label={`Excluir ${product.nome}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4">
          <form onSubmit={handleSubmit} className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{editing ? 'Editar produto' : 'Novo produto'}</h3>
              <button type="button" onClick={close} className="rounded-full p-2 text-gray-500 hover:bg-gray-100" aria-label="Fechar">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <input value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" placeholder="Nome do produto" required />
              <input value={form.codigo} onChange={(event) => setForm({ ...form, codigo: event.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" placeholder="Código" required />
              <select value={form.categoria} onChange={(event) => setForm({ ...form, categoria: event.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm">
                <option>Thinners</option>
                <option>Óleos</option>
                <option>Graxas</option>
              </select>
              <input value={form.volume} onChange={(event) => setForm({ ...form, volume: event.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" placeholder="Volume" required />
              <input type="number" min="0" step="0.01" value={form.preco} onChange={(event) => setForm({ ...form, preco: event.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" placeholder="Preço" required />
              <input type="number" min="0" value={form.estoque} onChange={(event) => setForm({ ...form, estoque: event.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" placeholder="Estoque" required />
              <input value={form.imagem} onChange={(event) => setForm({ ...form, imagem: event.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" placeholder="Caminho da imagem" required />
              <textarea value={form.descricao} onChange={(event) => setForm({ ...form, descricao: event.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" placeholder="Descrição" rows={3} required />
            </div>
            <button type="submit" className="mt-5 w-full rounded-xl bg-petrolusa px-4 py-3 text-sm font-bold text-white">Salvar produto</button>
          </form>
        </div>
      )}
    </div>
  );
}
