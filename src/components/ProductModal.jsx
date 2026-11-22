import React from 'react';
import { X, Plus, Package, Tag } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gray-50 p-6">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-white p-1.5 text-gray-500 shadow-sm hover:text-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={product.imagem}
            alt={product.nome}
            className="mx-auto h-48 object-contain"
          />
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-petrolusa-light px-2.5 py-0.5 text-xs font-semibold text-petrolusa">
              <Tag className="h-3 w-3" />
              {product.categoria}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <Package className="h-3.5 w-3.5" />
              {product.volume}
            </span>
          </div>

          <h3 className="mt-2 text-xl font-bold text-gray-900">{product.nome}</h3>
          <p className="mt-0.5 text-xs text-gray-400">Cód: {product.codigo}</p>

          <p className="mt-3 text-sm leading-relaxed text-gray-600">{product.descricao}</p>

          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
            <div>
              <span className="block text-xs text-gray-400">Preço unitário</span>
              <span className="text-xl font-extrabold text-gray-900">
                R$ {product.preco.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="flex items-center gap-1.5 rounded-xl bg-petrolusa px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-petrolusa-dark"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
