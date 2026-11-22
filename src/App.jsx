import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  Plus,
  Home,
  LayoutGrid,
  FileText,
  User,
  CheckCircle2,
  Building2,
  Phone,
  MapPin
} from 'lucide-react';
import { fetchProdutos, fetchPedidos, criarPedido } from './services/api';
import CartDrawer from './components/CartDrawer';
import ProductModal from './components/ProductModal';

const CATEGORIES = ['Todos', 'Thinners', 'Óleos', 'Graxas'];

export default function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('catalogo');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([1, 2]);
  const [cart, setCart] = useState([
    {
      id: 1,
      codigo: 'SOL-101',
      nome: 'Thinner Polibrilho 101',
      volume: '5 Litros',
      preco: 45.90,
      imagem: '/products/thinner-101.png',
      quantidade: 2
    }
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [prodData, orderData] = await Promise.all([
          fetchProdutos(),
          fetchPedidos()
        ]);
        setProducts(prodData);
        setOrders(orderData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'Todos' || p.categoria === selectedCategory;
      const matchesSearch =
        p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.codigo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const toggleFavorite = (e, productId) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantidade: 1 }];
    });
    showToast(`${product.nome} adicionado ao carrinho!`);
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantidade: newQty } : item))
      );
    }
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmitOrder = async (orderPayload) => {
    const createdOrder = await criarPedido(orderPayload);
    setOrders((prev) => [createdOrder, ...prev]);
    setCart([]);
    setIsCartOpen(false);
    setActiveTab('pedidos');
    showToast(`Pedido ${createdOrder.id} enviado com sucesso!`);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantidade, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="relative flex min-h-screen w-full max-w-md flex-col bg-[#F5F7F6] shadow-xl">
        {toastMessage && (
          <div className="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-gray-900 px-4 py-2.5 text-xs font-medium text-white shadow-lg">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {toastMessage}
          </div>
        )}

        <header className="sticky top-0 z-30 bg-petrolusa px-4 pt-4 pb-4 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 items-center rounded-lg bg-white px-2.5 py-1 shadow-xs">
                <img
                  src="/logo-petrolusa.png"
                  alt="PETROLUSA"
                  className="h-7 w-auto object-contain"
                />
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full p-2 transition hover:bg-white/10"
              aria-label="Abrir carrinho"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalCartItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white shadow">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>

          <div className="relative mt-3.5">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full rounded-full bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 shadow-xs focus:outline-none"
            />
          </div>
        </header>

        <main className="flex-1 pb-24">
          {(activeTab === 'catalogo' || activeTab === 'inicio') && (
            <>
              {activeTab === 'inicio' && (
                <div className="mx-4 mt-4 rounded-2xl bg-gradient-to-r from-petrolusa to-petrolusa-accent p-4 text-white shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                    Portal de Pedidos B2B
                  </p>
                  <h2 className="mt-1 text-lg font-bold">
                    Linha Completa Solvelusa & Petrolusa
                  </h2>
                  <p className="mt-1 text-xs text-emerald-50">
                    Thinners, óleos protetivos e graxas industriais com entrega rápida.
                  </p>
                </div>
              )}

              <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3.5">
                {CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                        isActive
                          ? 'bg-petrolusa text-white shadow-xs'
                          : 'bg-gray-200/80 text-gray-700 hover:bg-gray-300/70'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {loading ? (
                <div className="grid grid-cols-2 gap-3 px-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="h-60 animate-pulse rounded-2xl bg-white p-3 shadow-xs"
                    />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="px-4 py-12 text-center text-gray-500">
                  Nenhum produto encontrado para "{searchQuery}".
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 px-4">
                  {filteredProducts.map((product) => {
                    const isFav = favorites.includes(product.id);
                    return (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-3 shadow-xs transition hover:border-petrolusa/40 hover:shadow-md"
                      >
                        <div>
                          <div className="relative flex h-32 items-center justify-center rounded-xl bg-gray-50/70 p-2">
                            <button
                              onClick={(e) => toggleFavorite(e, product.id)}
                              className="absolute right-1.5 top-1.5 rounded-full p-1 text-gray-500 transition hover:bg-white"
                              aria-label="Favoritar"
                            >
                              <Heart
                                className={`h-4 w-4 ${
                                  isFav
                                    ? 'fill-red-500 text-red-500'
                                    : 'text-gray-600'
                                }`}
                              />
                            </button>
                            <img
                              src={product.imagem}
                              alt={product.nome}
                              className="h-28 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                            />
                          </div>

                          <h3 className="mt-2.5 line-clamp-1 text-sm font-bold text-gray-900">
                            {product.nome}
                          </h3>
                          <p className="text-[11px] text-gray-400">{product.volume}</p>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between gap-1">
                          <span className="text-sm font-extrabold text-gray-900">
                            R$ {product.preco.toFixed(2).replace('.', ',')}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className="flex items-center gap-0.5 rounded-lg bg-petrolusa px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-petrolusa-dark active:scale-95"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Adicionar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'pedidos' && (
            <div className="space-y-3 p-4">
              <h2 className="text-lg font-bold text-gray-900">Meus Pedidos</h2>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <div>
                      <span className="text-sm font-bold text-gray-900">{order.id}</span>
                      <p className="text-xs text-gray-500">Data: {order.data}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        order.status === 'Entregue'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <ul className="my-2.5 space-y-1 text-xs text-gray-600">
                    {order.itens.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>
                          {item.quantidade}x {item.nome}
                        </span>
                        <span className="font-medium">
                          R$ {(item.quantidade * item.precoUnitario).toFixed(2).replace('.', ',')}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
                    <span className="text-xs font-medium text-gray-500">Total</span>
                    <span className="text-sm font-bold text-petrolusa">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'perfil' && (
            <div className="space-y-4 p-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-petrolusa-light text-petrolusa">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Cliente Parceiro B2B</h2>
                    <p className="text-xs text-gray-500">CNPJ: 12.345.678/0001-90</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5 border-t border-gray-100 pt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-petrolusa" />
                    <span>(85) 99999-0000</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-petrolusa" />
                    <span>Fortaleza / Eusébio - CE</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <nav className="fixed bottom-0 z-30 flex w-full max-w-md items-center justify-around border-t border-gray-200 bg-white py-2 shadow-inner">
          <button
            onClick={() => setActiveTab('inicio')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium ${
              activeTab === 'inicio' ? 'text-petrolusa font-bold' : 'text-gray-500'
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Início</span>
          </button>

          <button
            onClick={() => setActiveTab('catalogo')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium ${
              activeTab === 'catalogo' ? 'text-petrolusa font-bold' : 'text-gray-500'
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
            <span>Catálogo</span>
          </button>

          <button
            onClick={() => setActiveTab('pedidos')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium ${
              activeTab === 'pedidos' ? 'text-petrolusa font-bold' : 'text-gray-500'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>Pedidos</span>
          </button>

          <button
            onClick={() => setActiveTab('perfil')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium ${
              activeTab === 'perfil' ? 'text-petrolusa font-bold' : 'text-gray-500'
            }`}
          >
            <User className="h-5 w-5" />
            <span>Perfil</span>
          </button>
        </nav>

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemoveFromCart}
          onSubmitOrder={handleSubmitOrder}
        />

        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
