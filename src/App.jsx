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
  MapPin,
  Users,
  ShieldCheck,
  LogOut,
  Package,
  Trash2,
  Bell,
  Check,
  X
} from 'lucide-react';
import { fetchProdutos, fetchPedidos, criarPedido } from './services/api';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/mockProducts';
import CartDrawer from './components/CartDrawer';
import ProductModal from './components/ProductModal';
import LoginScreen from './components/LoginScreen';
import UserManagement from './components/UserManagement';
import ProductManagement from './components/ProductManagement';

const CATEGORIES = ['Todos', 'Thinners', 'Óleos', 'Graxas'];
const INITIAL_USERS = [
  {
    id: 1,
    name: 'Administrador Petrolusa',
    username: 'admin',
    email: 'admin@petrolusa.com.br',
    password: 'admin123',
    role: 'admin',
    active: true
  },
  {
    id: 2,
    name: 'Representante Petrolusa',
    username: 'representante',
    email: 'representante@petrolusa.com.br',
    password: 'rep123',
    role: 'representante',
    active: true
  }
];

export default function App() {
  const [users, setUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('petrolusa-users')) || INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('petrolusa-session'));
    } catch {
      return null;
    }
  });
  const [products, setProducts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('petrolusa-products')) || INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('petrolusa-orders')) || INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });
  const [deletionRequests, setDeletionRequests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('petrolusa-deletion-requests')) || [];
    } catch {
      return [];
    }
  });
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
  const [requestingOrder, setRequestingOrder] = useState(null);
  const [deletionReason, setDeletionReason] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const storedProducts = localStorage.getItem('petrolusa-products');
        const storedOrders = localStorage.getItem('petrolusa-orders');
        if (storedProducts && storedOrders) {
          setLoading(false);
          return;
        }
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

  useEffect(() => {
    localStorage.setItem('petrolusa-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('petrolusa-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('petrolusa-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('petrolusa-deletion-requests', JSON.stringify(deletionRequests));
  }, [deletionRequests]);

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

  const handleLogin = (identifier, password) => {
    const normalized = identifier.toLowerCase();
    const user = users.find(
      (item) =>
        item.active &&
        (item.username.toLowerCase() === normalized ||
          item.email.toLowerCase() === normalized) &&
        item.password === password
    );
    if (!user) return false;

    setCurrentUser(user);
    localStorage.setItem('petrolusa-session', JSON.stringify(user));
    setActiveTab('catalogo');
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('petrolusa-session');
  };

  const handleSaveUser = (user) => {
    if (currentUser.role !== 'admin') return;
    if (user.id) {
      setUsers((previous) =>
        previous.map((item) => {
          if (item.id !== user.id) return item;
          return {
            ...item,
            ...user,
            password: user.password || item.password
          };
        })
      );
    } else {
      setUsers((previous) => [
        ...previous,
        {
          ...user,
          id: Date.now()
        }
      ]);
    }
  };

  const handleDeleteUser = (id) => {
    if (currentUser.role !== 'admin') return;
    if (!window.confirm('Deseja excluir este usuário?')) return;
    setUsers((previous) => previous.filter((user) => user.id !== id));
  };

  const handleSaveProduct = (product) => {
    if (currentUser.role !== 'admin') return;
    if (product.id) {
      setProducts((previous) =>
        previous.map((item) => (item.id === product.id ? product : item))
      );
      showToast('Produto atualizado com sucesso!');
    } else {
      setProducts((previous) => [
        ...previous,
        { ...product, id: Date.now() }
      ]);
      showToast('Produto cadastrado com sucesso!');
    }
  };

  const handleDeleteProduct = (id) => {
    if (currentUser.role !== 'admin') return;
    if (!window.confirm('Deseja excluir este produto do catálogo?')) return;
    setProducts((previous) => previous.filter((product) => product.id !== id));
    showToast('Produto excluído com sucesso!');
  };

  const handleAdminDeleteOrder = (orderId) => {
    if (currentUser.role !== 'admin') return;
    if (!window.confirm('Deseja excluir este pedido?')) return;
    setOrders((previous) => previous.filter((order) => order.id !== orderId));
    setDeletionRequests((previous) =>
      previous.map((request) =>
        request.orderId === orderId && request.status === 'pendente'
          ? { ...request, status: 'atendido' }
          : request
      )
    );
    showToast('Pedido excluído com sucesso!');
  };

  const handleSubmitDeletionRequest = (event) => {
    event.preventDefault();
    if (currentUser.role !== 'representante') return;
    if (!deletionReason.trim()) return;
    const alreadyRequested = deletionRequests.some(
      (request) =>
        request.orderId === requestingOrder.id &&
        request.representativeId === currentUser.id &&
        request.status === 'pendente'
    );
    if (alreadyRequested) {
      showToast('Já existe uma solicitação pendente para este pedido.');
      setRequestingOrder(null);
      setDeletionReason('');
      return;
    }
    setDeletionRequests((previous) => [
      {
        id: Date.now(),
        orderId: requestingOrder.id,
        orderLabel: requestingOrder.id,
        reason: deletionReason.trim(),
        representativeId: currentUser.id,
        representativeName: currentUser.name,
        status: 'pendente',
        createdAt: new Date().toLocaleString('pt-BR')
      },
      ...previous
    ]);
    setRequestingOrder(null);
    setDeletionReason('');
    showToast('Solicitação enviada ao administrador!');
  };

  const handleApproveDeletion = (request) => {
    if (currentUser.role !== 'admin') return;
    setOrders((previous) => previous.filter((order) => order.id !== request.orderId));
    setDeletionRequests((previous) =>
      previous.map((item) =>
        item.id === request.id ? { ...item, status: 'aprovada' } : item
      )
    );
    showToast(`Pedido ${request.orderId} excluído.`);
  };

  const handleRejectDeletion = (request) => {
    if (currentUser.role !== 'admin') return;
    setDeletionRequests((previous) =>
      previous.map((item) =>
        item.id === request.id ? { ...item, status: 'rejeitada' } : item
      )
    );
    showToast(`Solicitação do pedido ${request.orderId} rejeitada.`);
  };

  const pendingDeletionRequests = deletionRequests.filter(
    (request) => request.status === 'pendente'
  ).length;
  const activePageTitle = {
    inicio: 'Início',
    catalogo: 'Catálogo',
    pedidos: 'Meus pedidos',
    perfil: 'Meu perfil',
    produtos: 'Gerenciar produtos',
    usuarios: 'Gerenciar usuários',
    solicitacoes: 'Solicitações'
  }[activeTab] || 'Petrolusa App';

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen justify-center bg-gray-100 lg:justify-start">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="border-b border-gray-100 p-5">
          <img
            src="/logo-petrolusa.png"
            alt="Petrolusa App"
            className="h-auto w-full object-contain"
          />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Navegação principal">
          <button
            onClick={() => setActiveTab('inicio')}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              activeTab === 'inicio' ? 'bg-petrolusa-light text-petrolusa' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Home className="h-5 w-5" />
            Início
          </button>
          <button
            onClick={() => setActiveTab('catalogo')}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              activeTab === 'catalogo' ? 'bg-petrolusa-light text-petrolusa' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
            Catálogo
          </button>
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              activeTab === 'pedidos' ? 'bg-petrolusa-light text-petrolusa' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="h-5 w-5" />
            Meus pedidos
          </button>

          {currentUser.role === 'admin' && (
            <>
              <p className="px-3 pb-1 pt-5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Administração
              </p>
              <button
                onClick={() => setActiveTab('produtos')}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  activeTab === 'produtos' ? 'bg-petrolusa-light text-petrolusa' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Package className="h-5 w-5" />
                Produtos
              </button>
              <button
                onClick={() => setActiveTab('usuarios')}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  activeTab === 'usuarios' ? 'bg-petrolusa-light text-petrolusa' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Users className="h-5 w-5" />
                Usuários
              </button>
              <button
                onClick={() => setActiveTab('solicitacoes')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  activeTab === 'solicitacoes' ? 'bg-petrolusa-light text-petrolusa' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Bell className="h-5 w-5" />
                  Solicitações
                </span>
                {pendingDeletionRequests > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                    {pendingDeletionRequests}
                  </span>
                )}
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab('perfil')}
            className={`mt-5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              activeTab === 'perfil' ? 'bg-petrolusa-light text-petrolusa' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User className="h-5 w-5" />
            Meu perfil
          </button>
        </nav>

        <div className="border-t border-gray-100 p-4">
          <p className="truncate text-sm font-semibold text-gray-800">{currentUser.name}</p>
          <p className="mt-0.5 text-xs text-gray-500">
            {currentUser.role === 'admin' ? 'Administrador' : 'Representante'}
          </p>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sair da conta
          </button>
        </div>
      </aside>

      <div className="relative flex min-h-screen w-full max-w-md flex-col bg-[#F5F7F6] shadow-xl lg:min-w-0 lg:max-w-none lg:flex-1 lg:shadow-none">
        {toastMessage && (
          <div className="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-gray-900 px-4 py-2.5 text-xs font-medium text-white shadow-lg">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {toastMessage}
          </div>
        )}

        <header className="sticky top-0 z-30 bg-petrolusa px-4 pt-4 pb-4 text-white shadow-md lg:hidden">
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

        <header className="sticky top-0 z-30 hidden items-center justify-between gap-6 border-b border-gray-200 bg-white px-8 py-4 lg:flex">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-petrolusa">Portal de Pedidos B2B</p>
            <h1 className="mt-0.5 truncate text-xl font-bold text-gray-900">{activePageTitle}</h1>
          </div>
          <div className="flex min-w-0 items-center gap-4">
            <label className="relative block w-72">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Buscar produtos..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-petrolusa focus:bg-white focus:ring-2 focus:ring-petrolusa/10"
              />
            </label>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-xl border border-gray-200 p-2.5 text-gray-600 transition hover:bg-gray-50"
              aria-label="Abrir carrinho"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalCartItems > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {totalCartItems}
                </span>
              )}
            </button>
            <div className="max-w-48 border-l border-gray-200 pl-4">
              <p className="truncate text-sm font-semibold text-gray-800">{currentUser.name}</p>
              <p className="text-xs text-gray-500">
                {currentUser.role === 'admin' ? 'Administrador' : 'Representante'}
              </p>
            </div>
          </div>
        </header>

        <main className="app-main min-w-0 flex-1 lg:mx-auto lg:w-full lg:max-w-7xl lg:px-4 lg:py-6">
          {(activeTab === 'catalogo' || activeTab === 'inicio') && (
            <>
              {activeTab === 'inicio' && (
                <div className="mx-4 mt-4 rounded-2xl bg-gradient-to-r from-petrolusa to-petrolusa-accent p-4 text-white shadow-sm lg:mt-0 lg:p-6">
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

              <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3.5 lg:pb-5 lg:pt-6">
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
                <div className="grid grid-cols-2 gap-3 px-4 md:grid-cols-3 lg:gap-5 2xl:grid-cols-4">
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
                <div className="grid grid-cols-2 gap-3 px-4 md:grid-cols-3 lg:gap-5 2xl:grid-cols-4">
                  {filteredProducts.map((product) => {
                    const isFav = favorites.includes(product.id);
                    return (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-3 shadow-xs transition hover:border-petrolusa/40 hover:shadow-md"
                      >
                        <div>
                          <div className="relative flex h-32 items-center justify-center rounded-xl bg-gray-50/70 p-2 lg:h-48">
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
                              className="h-28 w-auto object-contain transition-transform duration-200 group-hover:scale-105 lg:h-40"
                            />
                          </div>

                          <h3 className="mt-2.5 line-clamp-1 text-sm font-bold text-gray-900 lg:text-base">
                            {product.nome}
                          </h3>
                          <p className="text-[11px] text-gray-400">{product.volume}</p>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between gap-1">
                          <span className="text-sm font-extrabold text-gray-900 lg:text-base">
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
            <div className="space-y-3 p-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 lg:p-0">
              <h2 className="text-lg font-bold text-gray-900 lg:col-span-2">Meus Pedidos</h2>
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
                  {currentUser.role === 'admin' ? (
                    <button
                      onClick={() => handleAdminDeleteOrder(order.id)}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir pedido
                    </button>
                  ) : (
                    <button
                      onClick={() => setRequestingOrder(order)}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700"
                    >
                      <Bell className="h-4 w-4" />
                      Solicitar exclusão
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'perfil' && (
            <div className="space-y-4 p-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-4 lg:space-y-0 lg:p-0">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-petrolusa-light text-petrolusa">
                    {currentUser.role === 'admin' ? (
                      <ShieldCheck className="h-6 w-6" />
                    ) : (
                      <Building2 className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">{currentUser.name}</h2>
                    <p className="text-xs capitalize text-gray-500">
                      {currentUser.role === 'admin' ? 'Administrador' : 'Representante'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5 border-t border-gray-100 pt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-petrolusa" />
                    <span>@{currentUser.username}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-petrolusa" />
                    <span>{currentUser.email}</span>
                  </div>
                </div>
              </div>

              {currentUser.role === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveTab('produtos')}
                    className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-petrolusa" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">Gerenciar produtos</p>
                        <p className="text-xs text-gray-500">Cadastrar, editar e excluir produtos</p>
                      </div>
                    </div>
                    <span className="text-lg text-gray-400">›</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('usuarios')}
                    className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-petrolusa" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">Gerenciar usuários</p>
                        <p className="text-xs text-gray-500">Criar, editar e desativar contas</p>
                      </div>
                    </div>
                    <span className="text-lg text-gray-400">›</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('solicitacoes')}
                    className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Bell className="h-5 w-5 text-petrolusa" />
                        {pendingDeletionRequests > 0 && (
                          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">
                            {pendingDeletionRequests}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Solicitações de exclusão</p>
                        <p className="text-xs text-gray-500">Aprovar ou rejeitar pedidos</p>
                      </div>
                    </div>
                    <span className="text-lg text-gray-400">›</span>
                  </button>
                </>
              )}

              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
              >
                <LogOut className="h-4 w-4" />
                Sair da conta
              </button>
            </div>
          )}

          {activeTab === 'usuarios' && currentUser.role === 'admin' && (
            <UserManagement
              users={users}
              onSave={handleSaveUser}
              onDelete={handleDeleteUser}
            />
          )}

          {activeTab === 'produtos' && currentUser.role === 'admin' && (
            <ProductManagement
              products={products}
              onSave={handleSaveProduct}
              onDelete={handleDeleteProduct}
            />
          )}

          {activeTab === 'solicitacoes' && currentUser.role === 'admin' && (
            <div className="space-y-3 p-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 lg:p-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-petrolusa">Notificações</p>
                <h2 className="text-lg font-bold text-gray-900">Solicitações de exclusão</h2>
              </div>
              {deletionRequests.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500 lg:col-span-2">
                  Nenhuma solicitação recebida.
                </div>
              ) : (
                deletionRequests.map((request) => (
                  <article key={request.id} className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Pedido {request.orderLabel}</p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {request.representativeName} · {request.createdAt}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                        request.status === 'pendente'
                          ? 'bg-amber-100 text-amber-700'
                          : request.status === 'aprovada'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="mt-3 rounded-xl bg-gray-50 p-3 text-xs leading-relaxed text-gray-700">
                      <b>Justificativa:</b> {request.reason}
                    </p>
                    {request.status === 'pendente' && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleRejectDeletion(request)}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 px-3 py-2.5 text-xs font-bold text-gray-700"
                        >
                          <X className="h-4 w-4" />
                          Rejeitar
                        </button>
                        <button
                          onClick={() => handleApproveDeletion(request)}
                          className="flex items-center justify-center gap-1.5 rounded-xl bg-petrolusa px-3 py-2.5 text-xs font-bold text-white"
                        >
                          <Check className="h-4 w-4" />
                          Aprovar
                        </button>
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          )}
        </main>

        <nav className="bottom-nav fixed bottom-0 left-1/2 z-30 flex w-full max-w-md -translate-x-1/2 items-center justify-around border-t border-gray-200 bg-white py-2 shadow-inner lg:hidden">
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

          {currentUser.role === 'admin' && (
            <>
              <button
                onClick={() => setActiveTab('produtos')}
                className={`flex flex-col items-center gap-0.5 px-1 py-1 text-xs font-medium ${
                  activeTab === 'produtos' ? 'text-petrolusa font-bold' : 'text-gray-500'
                }`}
              >
                <Package className="h-5 w-5" />
                <span>Produtos</span>
              </button>
              <button
                onClick={() => setActiveTab('usuarios')}
                className={`relative flex flex-col items-center gap-0.5 px-1 py-1 text-xs font-medium ${
                  activeTab === 'usuarios' ? 'text-petrolusa font-bold' : 'text-gray-500'
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Usuários</span>
              </button>
              <button
                onClick={() => setActiveTab('solicitacoes')}
                className={`relative flex flex-col items-center gap-0.5 px-1 py-1 text-xs font-medium ${
                  activeTab === 'solicitacoes' ? 'text-petrolusa font-bold' : 'text-gray-500'
                }`}
              >
                <Bell className="h-5 w-5" />
                {pendingDeletionRequests > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">
                    {pendingDeletionRequests}
                  </span>
                )}
                <span>Avisos</span>
              </button>
            </>
          )}

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

        {requestingOrder && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
            <form
              onSubmit={handleSubmitDeletionRequest}
              className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-petrolusa">Solicitação de exclusão</p>
                  <h3 className="mt-0.5 text-lg font-bold text-gray-900">
                    Pedido {requestingOrder.id}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRequestingOrder(null);
                    setDeletionReason('');
                  }}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <label className="mt-4 block">
                <span className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Justificativa
                </span>
                <textarea
                  value={deletionReason}
                  onChange={(event) => setDeletionReason(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-petrolusa"
                  placeholder="Explique por que este pedido deve ser excluído"
                  rows={4}
                  required
                />
              </label>
              <button
                type="submit"
                className="mt-4 w-full rounded-xl bg-petrolusa px-4 py-3 text-sm font-bold text-white"
              >
                Enviar solicitação ao admin
              </button>
            </form>
          </div>
        )}

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
