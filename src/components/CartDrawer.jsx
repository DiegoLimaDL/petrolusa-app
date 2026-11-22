import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CheckCircle2, ShoppingBag, Loader2 } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemove,
  onSubmitOrder
}) {
  const [observacao, setObservacao] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      await onSubmitOrder({
        observacao,
        total,
        itens: cart.map((item) => ({
          produtoId: item.id,
          codigo: item.codigo,
          nome: item.nome,
          quantidade: item.quantidade,
          precoUnitario: item.preco
        }))
      });
      setObservacao('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-petrolusa px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Carrinho de Pedidos</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 transition hover:bg-white/15"
            aria-label="Fechar carrinho"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
              <ShoppingBag className="mb-3 h-14 w-14 stroke-1 text-gray-300" />
              <p className="text-base font-medium text-gray-600">Seu carrinho está vazio</p>
              <p className="mt-1 text-sm">Adicione produtos do catálogo Petrolusa para iniciar um pedido.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3"
                >
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className="h-16 w-16 rounded-lg border border-gray-200 bg-white object-contain p-1"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{item.nome}</p>
                    <p className="text-xs text-gray-500">{item.volume}</p>
                    <p className="mt-1 text-sm font-bold text-petrolusa">
                      R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-gray-400 transition hover:text-red-600"
                      title="Remover item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                      <button
                        onClick={() => onUpdateQty(item.id, item.quantidade - 1)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[28px] text-center text-xs font-bold text-gray-800">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.id, item.quantidade + 1)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Observações do Pedido (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Ex: Entregar no período da manhã, CNPJ filial..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-800 focus:border-petrolusa focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">Total do Pedido</span>
              <span className="text-xl font-bold text-gray-900">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-petrolusa py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-petrolusa-dark disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando Pedido...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Finalizar Pedido
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
