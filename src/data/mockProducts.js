export const INITIAL_PRODUCTS = [
  {
    id: 1,
    codigo: 'SOL-101',
    nome: 'Thinner Polibrilho 101',
    categoria: 'Thinners',
    volume: '5 Litros',
    preco: 45.90,
    imagem: '/products/thinner-101.png',
    descricao: 'Thinner Polibrilho 101 Solvelusa indicado para diluição de tintas sintéticas, primers e limpeza de equipamentos.',
    estoque: 120
  },
  {
    id: 2,
    codigo: 'PUL-001',
    nome: 'Pulveroil',
    categoria: 'Óleos',
    volume: '900 ml',
    preco: 38.50,
    imagem: '/products/pulveroil.png',
    descricao: 'Óleo protetivo antiferrugem e lubrificante multiuso Petrolusa para peças metálicas e máquinas.',
    estoque: 85
  },
  {
    id: 3,
    codigo: 'SOL-254',
    nome: 'THINNER 254',
    categoria: 'Thinners',
    volume: '900 ml',
    preco: 42.00,
    imagem: '/products/thinner-254.png',
    descricao: 'Thinner 254 Solvelusa de alto desempenho para acabamentos automotivos e industriais.',
    estoque: 64
  },
  {
    id: 4,
    codigo: 'SOL-ATXL',
    nome: 'ATXL',
    categoria: 'Thinners',
    volume: '5 Litros',
    preco: 48.90,
    imagem: '/products/atxl.png',
    descricao: 'Thinner ATX-L Solvelusa especial para repintura automotiva, lacas nitrocelulose e esmaltes.',
    estoque: 92
  },
  {
    id: 5,
    codigo: 'GRA-ROL1',
    nome: 'Rolgrax',
    categoria: 'Graxas',
    volume: 'Pote 1 kg',
    preco: 34.90,
    imagem: '/products/rolgrax.png',
    descricao: 'Graxa especial à base de lítio para rolamentos automotivos e industriais de alta rotação.',
    estoque: 150
  },
  {
    id: 6,
    codigo: 'GRA-KAL1',
    nome: 'Kalgrax',
    categoria: 'Graxas',
    volume: 'Pote 1 kg',
    preco: 32.00,
    imagem: '/products/kalgrax.png',
    descricao: 'Graxa lubrificante à base de cálcio resistente à umidade, ideal para chassis e articulações.',
    estoque: 110
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'PED-2026-084',
    data: '20/11/2026',
    status: 'Entregue',
    total: 263.70,
    itens: [
      { nome: 'Thinner Polibrilho 101', quantidade: 3, precoUnitario: 45.90 },
      { nome: 'Rolgrax', quantidade: 2, precoUnitario: 34.90 },
      { nome: 'Pulveroil', quantidade: 1, precoUnitario: 38.50 }
    ]
  },
  {
    id: 'PED-2026-091',
    data: '22/11/2026',
    status: 'Em separação',
    total: 181.80,
    itens: [
      { nome: 'ATXL', quantidade: 2, precoUnitario: 48.90 },
      { nome: 'THINNER 254', quantidade: 2, precoUnitario: 42.00 }
    ]
  }
];
