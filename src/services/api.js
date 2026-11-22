import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/mockProducts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export async function fetchProdutos() {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve(INITIAL_PRODUCTS), 250));
  }
  const response = await fetch(`${API_URL}/produtos`);
  if (!response.ok) {
    throw new Error('Erro ao carregar produtos do servidor');
  }
  return response.json();
}

export async function criarPedido(payload) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `PED-2026-${Math.floor(100 + Math.random() * 900)}`,
          data: new Date().toLocaleDateString('pt-BR'),
          status: 'Recebido',
          total: payload.total,
          itens: payload.itens
        });
      }, 400);
    });
  }
  const response = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error('Erro ao enviar pedido');
  }
  return response.json();
}

export async function fetchPedidos() {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve(INITIAL_ORDERS), 200));
  }
  const response = await fetch(`${API_URL}/pedidos`);
  if (!response.ok) {
    throw new Error('Erro ao buscar pedidos');
  }
  return response.json();
}
