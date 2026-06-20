import { Category } from '../models/category.model';
import { MenuData } from '../models/menu-data.model';
import { OptionGroup } from '../models/option-group.model';
import { ProductOption } from '../models/product-option.model';
import { ProductVariation } from '../models/product-variation.model';
import { Product } from '../models/product.model';

const now = new Date().toISOString();

function stamp<T extends object>(value: T): T & { createdAt: string; updatedAt: string } {
  return { ...value, createdAt: now, updatedAt: now };
}

export function buildInitialMenuData(): MenuData {
  const categories: Category[] = [
    stamp({ id: 'cat-bolos', name: 'Bolos', slug: 'bolos', description: 'Bolos personalizados e especiais para encomenda.', displayOrder: 1, isActive: true }),
    stamp({ id: 'cat-bolos-simples', name: 'Bolos Simples', slug: 'bolos-simples', description: 'Bolos caseiros e sobremesas de vitrine.', displayOrder: 2, isActive: true }),
    stamp({ id: 'cat-sobremesas', name: 'Sobremesas', slug: 'sobremesas', description: 'Tortas, brownies e sobremesas para diferentes ocasiões.', displayOrder: 3, isActive: true }),
    stamp({ id: 'cat-salgados-assados', name: 'Salgados Assados', slug: 'salgados-assados', description: 'Opções assadas por unidade ou cento.', displayOrder: 4, isActive: true }),
    stamp({ id: 'cat-salgados-fritos', name: 'Salgados Fritos', slug: 'salgados-fritos', description: 'Salgados fritos para festas, coffee breaks e eventos.', displayOrder: 5, isActive: true }),
    stamp({ id: 'cat-coffee-break', name: 'Coffee Break', slug: 'coffee-break', description: 'Itens especiais para eventos, empresas e reuniões.', displayOrder: 6, isActive: true }),
    stamp({ id: 'cat-congelados', name: 'Congelados', slug: 'congelados', description: 'Produtos congelados prontos para facilitar sua rotina.', displayOrder: 7, isActive: true }),
    stamp({ id: 'cat-bolachas', name: 'Bolachas', slug: 'bolachas', description: 'Bolachas em pacotes de 500g.', displayOrder: 8, isActive: true }),
    stamp({ id: 'cat-produtos-avulsos', name: 'Produtos Avulsos', slug: 'produtos-avulsos', description: 'Itens com disponibilidade sob consulta.', displayOrder: 9, isActive: true }),
    stamp({ id: 'cat-servicos', name: 'Serviços sob Orçamento', slug: 'servicos-sob-orcamento', description: 'Serviços e montagens personalizadas sob orçamento.', displayOrder: 10, isActive: true })
  ];

  const products: Product[] = [
    stamp({
      id: 'prod-bolo-tradicional', categoryId: 'cat-bolos', name: 'Bolo personalizado', slug: 'bolo-personalizado',
      shortDescription: 'Massa branca ou chocolate, dois recheios à escolha e cobertura personalizada.',
      fullDescription: 'Pedidos com 3 dias de antecedência. Coberturas: chantilly, glacê suíço ou nata com valor adicional. Flores e topo decorativos cobrados à parte.',
      priceType: 'variation', basePrice: null, unitLabel: null, minQuantity: null, preparationDays: 3, availabilityStatus: 'available', availabilityNote: null,
      pricingNote: 'Cliente escolhe dois recheios. Nata, flores e topo decorativos podem ter valor adicional.', isFeatured: true, displayOrder: 1, isActive: true
    }),
    stamp({
      id: 'prod-bolo-red-velvet', categoryId: 'cat-bolos', name: 'Bolo Red Velvet', slug: 'bolo-red-velvet',
      shortDescription: 'Massa amanteigada, cream cheese, ganache de chocolate branco e frutas.', fullDescription: 'Pedido com 3 dias de antecedência.',
      priceType: 'variation', basePrice: null, unitLabel: null, minQuantity: null, preparationDays: 3, availabilityStatus: 'available', availabilityNote: null, pricingNote: null, isFeatured: true, displayOrder: 2, isActive: true
    }),
    stamp({ id: 'prod-red-velvet-piscina', categoryId: 'cat-bolos-simples', name: 'Bolo Red Velvet Piscina', slug: 'bolo-red-velvet-piscina', shortDescription: 'Bolo simples de 25 cm.', priceType: 'fixed', basePrice: 38, unitLabel: '25 cm', minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 1, isActive: true }),
    stamp({ id: 'prod-bolo-fuba', categoryId: 'cat-bolos-simples', name: 'Bolo de Fubá', slug: 'bolo-de-fuba', shortDescription: 'Bolo simples de 20 cm.', priceType: 'fixed', basePrice: 27, unitLabel: '20 cm', minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 2, isActive: true }),
    stamp({ id: 'prod-bolo-mineirinho', categoryId: 'cat-bolos-simples', name: 'Bolo Mineirinho', slug: 'bolo-mineirinho', shortDescription: 'Bolo de fubá com ganache de parmesão e goiabada.', priceType: 'variation', basePrice: null, unitLabel: null, minQuantity: null, preparationDays: null, availabilityStatus: 'available', pricingNote: 'Validar medidas e preços antes de produção.', isFeatured: false, displayOrder: 3, isActive: true }),
    stamp({ id: 'prod-bolo-cenoura', categoryId: 'cat-bolos-simples', name: 'Bolo de Cenoura', slug: 'bolo-de-cenoura', shortDescription: 'Com ganache de chocolate nobre.', priceType: 'variation', basePrice: null, unitLabel: null, minQuantity: null, preparationDays: null, availabilityStatus: 'available', pricingNote: 'Validar medidas e preços antes de produção.', isFeatured: false, displayOrder: 4, isActive: true }),
    stamp({ id: 'prod-bolo-churros', categoryId: 'cat-bolos-simples', name: 'Bolo de Churros', slug: 'bolo-de-churros', shortDescription: 'Com brigadeiro de ninho.', priceType: 'variation', basePrice: null, unitLabel: null, minQuantity: null, preparationDays: null, availabilityStatus: 'available', pricingNote: 'Validar medidas e preços antes de produção.', isFeatured: false, displayOrder: 5, isActive: true }),
    stamp({ id: 'prod-bolo-toalha-felpuda', categoryId: 'cat-bolos-simples', name: 'Bolo Toalha Felpuda', slug: 'bolo-toalha-felpuda', shortDescription: 'Bolo em formato retangular.', priceType: 'variation', basePrice: null, unitLabel: null, minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 6, isActive: true }),
    stamp({ id: 'prod-nega-maluca', categoryId: 'cat-bolos-simples', name: 'Nega Maluca', slug: 'nega-maluca', shortDescription: 'Com ganache de chocolate nobre.', priceType: 'variation', basePrice: null, unitLabel: null, minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 7, isActive: true }),
    stamp({ id: 'prod-pe-de-moleque', categoryId: 'cat-bolos-simples', name: 'Bolo Pé de Moleque', slug: 'bolo-pe-de-moleque', shortDescription: 'Bolo simples de 20 cm.', priceType: 'fixed', basePrice: 35, unitLabel: '20 cm', minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 8, isActive: true }),
    stamp({ id: 'prod-bolo-red-velvet-simples', categoryId: 'cat-bolos-simples', name: 'Bolo Red Velvet', slug: 'bolo-red-velvet-simples', shortDescription: 'Versão simples de 25 cm.', priceType: 'fixed', basePrice: 55, unitLabel: '25 cm', minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 9, isActive: true }),

    stamp({ id: 'prod-torta-morango', categoryId: 'cat-sobremesas', name: 'Torta de Morango', slug: 'torta-de-morango', shortDescription: 'Creme de nata com suspiro, morango e massa de pão de ló.', priceType: 'fixed', basePrice: 115, unitLabel: '25 cm', minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: true, displayOrder: 1, isActive: true }),
    stamp({ id: 'prod-torta-goiabada', categoryId: 'cat-sobremesas', name: 'Torta de Goiabada', slug: 'torta-de-goiabada', shortDescription: 'Suspiro caseiro com creme de nata e morango.', priceType: 'fixed', basePrice: 90, unitLabel: '25 cm', minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 2, isActive: true }),
    stamp({ id: 'prod-torta-abacaxi', categoryId: 'cat-sobremesas', name: 'Torta de Abacaxi', slug: 'torta-de-abacaxi', shortDescription: 'Sobremesa sob encomenda.', priceType: 'fixed', basePrice: 90, unitLabel: null, minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 3, isActive: true }),
    stamp({ id: 'prod-torta-red-velvet', categoryId: 'cat-sobremesas', name: 'Torta Red Velvet', slug: 'torta-red-velvet', shortDescription: 'Sobremesa especial Red Velvet.', priceType: 'fixed', basePrice: 115, unitLabel: null, minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 4, isActive: true }),
    stamp({ id: 'prod-torta-salgada', categoryId: 'cat-sobremesas', name: 'Torta Salgada', slug: 'torta-salgada', shortDescription: 'Torta salgada para encomenda.', priceType: 'fixed', basePrice: 85, unitLabel: null, minQuantity: null, preparationDays: null, availabilityStatus: 'available', pricingNote: 'Há informação visual de R$ 47,00/kg no PDF que deve ser validada.', isFeatured: false, displayOrder: 5, isActive: true }),
    stamp({ id: 'prod-pavlova', categoryId: 'cat-sobremesas', name: 'Pavlova', slug: 'pavlova', shortDescription: 'Sobremesa leve e elegante.', priceType: 'fixed', basePrice: 90, unitLabel: null, minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 6, isActive: true }),
    stamp({ id: 'prod-banoffee', categoryId: 'cat-sobremesas', name: 'Banoffee', slug: 'banoffee', shortDescription: 'Sobremesa clássica com banana e doce de leite.', priceType: 'fixed', basePrice: 90, unitLabel: null, minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 7, isActive: true }),
    stamp({ id: 'prod-brownie', categoryId: 'cat-sobremesas', name: 'Brownie', slug: 'brownie', shortDescription: 'Brownie em tamanhos P, M e G.', priceType: 'variation', basePrice: null, unitLabel: null, minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 8, isActive: true }),
    stamp({ id: 'prod-brownie-nutella', categoryId: 'cat-sobremesas', name: 'Brownie com adicional de Nutella', slug: 'brownie-com-nutella', shortDescription: 'Brownie com adicional de Nutella.', priceType: 'variation', basePrice: null, unitLabel: null, minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 9, isActive: true }),
    stamp({ id: 'prod-brownie-brigadeiro-frutas', categoryId: 'cat-sobremesas', name: 'Brownie com brigadeiro gourmet e frutas', slug: 'brownie-brigadeiro-gourmet-frutas', shortDescription: 'Brownie com brigadeiro gourmet e frutas.', priceType: 'variation', basePrice: null, unitLabel: null, minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 10, isActive: true }),

    stamp({ id: 'prod-mini-pizza-coffee', categoryId: 'cat-salgados-assados', name: 'Mini pizza coffee', slug: 'mini-pizza-coffee', shortDescription: 'Sabores: calabresa, bacon e quatro queijos.', priceType: 'unit', basePrice: 2.10, unitLabel: 'unidade', minQuantity: 10, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 1, isActive: true }),
    stamp({ id: 'prod-esfiha', categoryId: 'cat-salgados-assados', name: 'Esfiha', slug: 'esfiha', shortDescription: 'Sabores: frango, calabresa, carne e brócolis com ricota.', priceType: 'unit', basePrice: 1.30, unitLabel: 'unidade', minQuantity: 10, preparationDays: null, availabilityStatus: 'available', pricingNote: 'R$ 130,00 o cento ou R$ 1,30 cada.', isFeatured: false, displayOrder: 2, isActive: true }),
    stamp({ id: 'prod-trouxinha-legumes', categoryId: 'cat-salgados-assados', name: 'Trouxinha de legumes', slug: 'trouxinha-de-legumes', shortDescription: 'Salgado assado por unidade ou cento.', priceType: 'unit', basePrice: 1.30, unitLabel: 'unidade', minQuantity: 10, preparationDays: null, availabilityStatus: 'available', pricingNote: 'R$ 130,00 o cento ou R$ 1,30 cada.', isFeatured: false, displayOrder: 3, isActive: true }),
    stamp({ id: 'prod-enroladinho-salsicha', categoryId: 'cat-salgados-assados', name: 'Enroladinho de salsicha', slug: 'enroladinho-de-salsicha', shortDescription: 'Salgado assado por unidade ou cento.', priceType: 'unit', basePrice: 1.30, unitLabel: 'unidade', minQuantity: 10, preparationDays: null, availabilityStatus: 'available', pricingNote: 'R$ 130,00 o cento ou R$ 1,30 cada.', isFeatured: false, displayOrder: 4, isActive: true }),
    stamp({ id: 'prod-pao-de-queijo', categoryId: 'cat-salgados-assados', name: 'Pão de queijo', slug: 'pao-de-queijo', shortDescription: 'Salgado assado por unidade ou cento.', priceType: 'unit', basePrice: 1.30, unitLabel: 'unidade', minQuantity: 10, preparationDays: null, availabilityStatus: 'available', pricingNote: 'R$ 130,00 o cento ou R$ 1,30 cada.', isFeatured: false, displayOrder: 5, isActive: true }),

    ...['Pastelzinho de carne','Coxinha de frango','Coxinha de bacon e queijo','Bolinha de queijo','Risoles de frango','Travesseirinho de calabresa','Kibe','Croquete de calabresa'].map((name, index) => stamp({
      id: `prod-frito-${index + 1}`, categoryId: 'cat-salgados-fritos', name, slug: name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      shortDescription: 'Salgado frito por unidade ou cento.', priceType: 'unit' as const, basePrice: 1.20, unitLabel: 'unidade', minQuantity: 25, preparationDays: null, availabilityStatus: 'available' as const,
      pricingNote: 'R$ 120,00 o cento ou R$ 1,20 cada. Validar regra especial para pastel e/ou kibe a partir de 50 unidades.', isFeatured: false, displayOrder: index + 1, isActive: true
    })),

    stamp({ id: 'prod-quiche', categoryId: 'cat-coffee-break', name: 'Quiche', slug: 'quiche', shortDescription: 'Sabores: ricota e nozes, alho-poró, ricota e figo.', priceType: 'unit', basePrice: 2.80, unitLabel: 'unidade', minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 1, isActive: true }),
    stamp({ id: 'prod-mini-sanduiche-pate', categoryId: 'cat-coffee-break', name: 'Mini sanduíche com patê', slug: 'mini-sanduiche-com-pate', shortDescription: 'Frango, presunto e quatro queijos.', priceType: 'unit', basePrice: 2.10, unitLabel: 'unidade', minQuantity: 15, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 2, isActive: true }),
    stamp({ id: 'prod-mini-sanduiche-salame', categoryId: 'cat-coffee-break', name: 'Mini sanduíche com salame', slug: 'mini-sanduiche-com-salame', shortDescription: 'Queijo, alface e geleia de abacaxi com pimenta.', priceType: 'unit', basePrice: 1.90, unitLabel: 'unidade', minQuantity: 10, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 3, isActive: true }),
    stamp({ id: 'prod-barquete', categoryId: 'cat-coffee-break', name: 'Barquete', slug: 'barquete', shortDescription: 'Salpicão de frango com batata palha.', priceType: 'unit', basePrice: 3.20, unitLabel: 'unidade', minQuantity: 15, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 4, isActive: true }),
    stamp({ id: 'prod-mini-churros', categoryId: 'cat-coffee-break', name: 'Mini churros', slug: 'mini-churros', shortDescription: 'Doce de leite.', priceType: 'unit', basePrice: 1.70, unitLabel: 'unidade', minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 5, isActive: true }),
    stamp({ id: 'prod-mini-cachorro-quente', categoryId: 'cat-coffee-break', name: 'Mini cachorro-quente', slug: 'mini-cachorro-quente', shortDescription: 'Pedido mínimo de 15 unidades.', priceType: 'unit', basePrice: 4.50, unitLabel: 'unidade', minQuantity: 15, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 6, isActive: true }),
    stamp({ id: 'prod-mini-hamburguer', categoryId: 'cat-coffee-break', name: 'Mini hambúrguer', slug: 'mini-hamburguer', shortDescription: 'Pedido mínimo de 15 unidades.', priceType: 'unit', basePrice: 6.90, unitLabel: 'unidade', minQuantity: 15, preparationDays: null, availabilityStatus: 'available', isFeatured: true, displayOrder: 7, isActive: true }),
    stamp({ id: 'prod-mini-empadinha-frango', categoryId: 'cat-coffee-break', name: 'Mini empadinha de frango', slug: 'mini-empadinha-de-frango', shortDescription: 'Empadinha individual de frango.', priceType: 'unit', basePrice: 2.30, unitLabel: 'unidade', minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 8, isActive: true }),
    stamp({ id: 'prod-mini-sanduiche-artesanal', categoryId: 'cat-coffee-break', name: 'Mini sanduíche artesanal', slug: 'mini-sanduiche-artesanal', shortDescription: 'Pão artesanal com lombo ou salame, geleia de abacaxi com pimenta e queijo.', priceType: 'unit', basePrice: 6.90, unitLabel: 'unidade', minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 9, isActive: true }),
    stamp({ id: 'prod-folhados', categoryId: 'cat-coffee-break', name: 'Folhados', slug: 'folhados', shortDescription: 'Sabores: chocolate e goiabada.', priceType: 'unit', basePrice: 3.50, unitLabel: 'unidade', minQuantity: 15, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 10, isActive: true }),

    stamp({ id: 'prod-lasanhas', categoryId: 'cat-congelados', name: 'Lasanhas', slug: 'lasanhas', shortDescription: 'Sabores: bolonhesa, vegetariana, quatro queijos e frango.', priceType: 'kg', basePrice: 49, unitLabel: 'kg', minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 1, isActive: true }),
    stamp({ id: 'prod-empadao-frango', categoryId: 'cat-congelados', name: 'Empadão de frango', slug: 'empadao-de-frango', shortDescription: 'Dois tamanhos: aproximadamente 750g e 1,5kg.', priceType: 'kg', basePrice: 47, unitLabel: 'kg', minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 2, isActive: true }),
    stamp({ id: 'prod-mini-pizza-lanche', categoryId: 'cat-congelados', name: 'Mini pizza para lanche', slug: 'mini-pizza-para-lanche', shortDescription: 'Sabores: frango, calabresa e marguerita.', priceType: 'unit', basePrice: 3.75, unitLabel: 'unidade', minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 3, isActive: true }),
    stamp({ id: 'prod-nhoque', categoryId: 'cat-congelados', name: 'Nhoque', slug: 'nhoque', shortDescription: 'Pacote de 500g.', priceType: 'fixed', basePrice: 12, unitLabel: '500g', minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 4, isActive: true }),

    stamp({ id: 'prod-bolacha-fuba', categoryId: 'cat-bolachas', name: 'Bolacha de fubá', slug: 'bolacha-de-fuba', shortDescription: 'Pacote de 500g.', priceType: 'package', basePrice: 24, unitLabel: 'pacote 500g', minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 1, isActive: true }),
    stamp({ id: 'prod-bolacha-polvilho', categoryId: 'cat-bolachas', name: 'Bolacha de polvilho', slug: 'bolacha-de-polvilho', shortDescription: 'Pacote de 500g.', priceType: 'package', basePrice: 24, unitLabel: 'pacote 500g', minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 2, isActive: true }),
    stamp({ id: 'prod-bolacha-coco', categoryId: 'cat-bolachas', name: 'Bolacha de coco', slug: 'bolacha-de-coco', shortDescription: 'Pacote de 500g.', priceType: 'package', basePrice: 24, unitLabel: 'pacote 500g', minQuantity: null, preparationDays: null, availabilityStatus: 'available', isFeatured: false, displayOrder: 3, isActive: true }),

    stamp({ id: 'prod-bolo-de-pote', categoryId: 'cat-produtos-avulsos', name: 'Bolo de pote', slug: 'bolo-de-pote', shortDescription: 'Pote de 300g.', priceType: 'unit', basePrice: 15, unitLabel: 'unidade', minQuantity: null, preparationDays: null, availabilityStatus: 'on_request', availabilityNote: 'Verificar disponibilidade', isFeatured: false, displayOrder: 1, isActive: true }),
    stamp({ id: 'prod-pao-de-mel', categoryId: 'cat-produtos-avulsos', name: 'Pão de mel', slug: 'pao-de-mel', shortDescription: 'Produto por unidade.', priceType: 'unit', basePrice: 7.50, unitLabel: 'unidade', minQuantity: null, preparationDays: null, availabilityStatus: 'on_request', availabilityNote: 'Verificar disponibilidade', isFeatured: false, displayOrder: 2, isActive: true }),

    stamp({ id: 'prod-coffee-break-servico', categoryId: 'cat-servicos', name: 'Coffee break', slug: 'coffee-break-servico', shortDescription: 'Preparo de coffee para empresas, aniversários e eventos em geral.', priceType: 'quote', basePrice: null, unitLabel: null, minQuantity: null, preparationDays: null, availabilityStatus: 'quote', availabilityNote: 'Solicitar orçamento', isFeatured: true, displayOrder: 1, isActive: true }),
    stamp({ id: 'prod-tabua-frios', categoryId: 'cat-servicos', name: 'Tábua ou bandeja de frios', slug: 'tabua-ou-bandeja-de-frios', shortDescription: 'Serviço/produto sob encomenda.', priceType: 'quote', basePrice: null, unitLabel: null, minQuantity: null, preparationDays: null, availabilityStatus: 'quote', availabilityNote: 'Solicitar orçamento', isFeatured: false, displayOrder: 2, isActive: true })
  ];

  const variations: ProductVariation[] = [
    stamp({ id: 'var-bolo-trad-p', productId: 'prod-bolo-tradicional', name: 'P', sizeLabel: '20 cm', weightLabel: '2,5 kg', servesLabel: '15 fatias', price: 130, unitLabel: null, minQuantity: null, displayOrder: 1, isActive: true }),
    stamp({ id: 'var-bolo-trad-m', productId: 'prod-bolo-tradicional', name: 'M', sizeLabel: '25 cm', weightLabel: '3,5 kg', servesLabel: '30 fatias', price: 180, unitLabel: null, minQuantity: null, displayOrder: 2, isActive: true }),
    stamp({ id: 'var-bolo-trad-g', productId: 'prod-bolo-tradicional', name: 'G', sizeLabel: '30 cm', weightLabel: '4,5 kg', servesLabel: '40 fatias', price: 220, unitLabel: null, minQuantity: null, displayOrder: 3, isActive: true }),
    stamp({ id: 'var-red-p', productId: 'prod-bolo-red-velvet', name: 'P', sizeLabel: '20 cm', weightLabel: '2,5 kg', servesLabel: '15 fatias', price: 150, unitLabel: null, minQuantity: null, displayOrder: 1, isActive: true }),
    stamp({ id: 'var-red-m', productId: 'prod-bolo-red-velvet', name: 'M', sizeLabel: '25 cm', weightLabel: '3,5 kg', servesLabel: '30 fatias', price: 195, unitLabel: null, minQuantity: null, displayOrder: 2, isActive: true }),
    stamp({ id: 'var-red-g', productId: 'prod-bolo-red-velvet', name: 'G', sizeLabel: '30 cm', weightLabel: '4,5 kg', servesLabel: '40 fatias', price: 240, unitLabel: null, minQuantity: null, displayOrder: 3, isActive: true }),
    stamp({ id: 'var-mineirinho-20', productId: 'prod-bolo-mineirinho', name: '20 cm', sizeLabel: '20 cm', price: 35, unitLabel: null, displayOrder: 1, isActive: true }),
    stamp({ id: 'var-mineirinho-25', productId: 'prod-bolo-mineirinho', name: '25 cm', sizeLabel: '25 cm', price: 30, unitLabel: null, displayOrder: 2, isActive: true }),
    stamp({ id: 'var-cenoura-20', productId: 'prod-bolo-cenoura', name: '20 cm', sizeLabel: '20 cm', price: 50, unitLabel: null, displayOrder: 1, isActive: true }),
    stamp({ id: 'var-cenoura-25', productId: 'prod-bolo-cenoura', name: '25 cm', sizeLabel: '25 cm', price: 50, unitLabel: null, displayOrder: 2, isActive: true }),
    stamp({ id: 'var-churros-20', productId: 'prod-bolo-churros', name: '20 cm', sizeLabel: '20 cm', price: 30, unitLabel: null, displayOrder: 1, isActive: true }),
    stamp({ id: 'var-churros-25', productId: 'prod-bolo-churros', name: '25 cm', sizeLabel: '25 cm', price: 35, unitLabel: null, displayOrder: 2, isActive: true }),
    stamp({ id: 'var-toalha-18x25', productId: 'prod-bolo-toalha-felpuda', name: '18x25 cm', sizeLabel: '18x25 cm', price: 30, unitLabel: null, displayOrder: 1, isActive: true }),
    stamp({ id: 'var-toalha-25x35', productId: 'prod-bolo-toalha-felpuda', name: '25x35 cm', sizeLabel: '25x35 cm', price: 55, unitLabel: null, displayOrder: 2, isActive: true }),
    stamp({ id: 'var-nega-20', productId: 'prod-nega-maluca', name: '20 cm', sizeLabel: '20 cm', price: 30, unitLabel: null, displayOrder: 1, isActive: true }),
    stamp({ id: 'var-nega-35x25', productId: 'prod-nega-maluca', name: '35x25 cm', sizeLabel: '35x25 cm', price: 55, unitLabel: null, displayOrder: 2, isActive: true }),
    ...['prod-brownie','prod-brownie-nutella','prod-brownie-brigadeiro-frutas'].flatMap((productId, productIndex) => {
      const prices = productIndex === 0 ? [22,45,65] : [17,35,55];
      return ['P','M','G'].map((name, index) => stamp({ id: `var-${productId}-${name.toLowerCase()}`, productId, name, price: prices[index], unitLabel: null, displayOrder: index + 1, isActive: true }));
    })
  ];

  const optionGroups: OptionGroup[] = [
    stamp({ id: 'group-bolo-massa', productId: 'prod-bolo-tradicional', name: 'Massa', minSelect: 1, maxSelect: 1, isRequired: true, displayOrder: 1 }),
    stamp({ id: 'group-bolo-recheios', productId: 'prod-bolo-tradicional', name: 'Recheios', minSelect: 1, maxSelect: 2, isRequired: true, displayOrder: 2 }),
    stamp({ id: 'group-bolo-cobertura', productId: 'prod-bolo-tradicional', name: 'Cobertura', minSelect: 1, maxSelect: 1, isRequired: true, displayOrder: 3 }),
    stamp({ id: 'group-lasanha-sabores', productId: 'prod-lasanhas', name: 'Sabores', minSelect: 1, maxSelect: 1, isRequired: true, displayOrder: 1 }),
    stamp({ id: 'group-quiche-sabores', productId: 'prod-quiche', name: 'Sabores', minSelect: 1, maxSelect: 1, isRequired: false, displayOrder: 1 }),
    stamp({ id: 'group-folhados-sabores', productId: 'prod-folhados', name: 'Sabores', minSelect: 1, maxSelect: 1, isRequired: false, displayOrder: 1 })
  ];

  const productOptions: ProductOption[] = [
    ...['Branca','Chocolate'].map((name, index) => stamp({ id: `opt-massa-${index}`, optionGroupId: 'group-bolo-massa', name, additionalPrice: 0, isActive: true, displayOrder: index + 1 })),
    ...['Quatro leites','Doce de leite com amendoim','Doce de leite com ameixa','Nata e suspiro','Nata e bombom','Nata e pêssego','Nata, suspiro e morangos','Strogonoff de nozes','Brigadeiro de ninho','Brigadeiro gourmet','Prestígio','Abacaxi'].map((name, index) => stamp({ id: `opt-recheio-${index}`, optionGroupId: 'group-bolo-recheios', name, additionalPrice: name.includes('morangos') ? 0 : 0, isActive: true, displayOrder: index + 1 })),
    ...['Chantilly','Glacê suíço','Nata'].map((name, index) => stamp({ id: `opt-cobertura-${index}`, optionGroupId: 'group-bolo-cobertura', name, additionalPrice: 0, isActive: true, displayOrder: index + 1 })),
    ...['Bolonhesa','Vegetariana','Quatro queijos','Frango'].map((name, index) => stamp({ id: `opt-lasanha-${index}`, optionGroupId: 'group-lasanha-sabores', name, additionalPrice: 0, isActive: true, displayOrder: index + 1 })),
    ...['Ricota e nozes','Alho-poró','Ricota e figo'].map((name, index) => stamp({ id: `opt-quiche-${index}`, optionGroupId: 'group-quiche-sabores', name, additionalPrice: 0, isActive: true, displayOrder: index + 1 })),
    ...['Chocolate','Goiabada'].map((name, index) => stamp({ id: `opt-folhado-${index}`, optionGroupId: 'group-folhados-sabores', name, additionalPrice: 0, isActive: true, displayOrder: index + 1 }))
  ];

  return {
    schemaVersion: 1,
    businessSettings: stamp({
      id: 'business-praticita',
      businessName: 'Praticità',
      businessSubtitle: 'Doces e Salgados',
      slogan: 'Praticidade | Qualidade | Aconchego',
      whatsapp: '49 9991-6511',
      address: 'Rua Bulcão Viana, nº 1358',
      neighborhood: 'Floresta',
      deliveryEnabled: true,
      pickupEnabled: true,
      deliveryNote: 'Consultar taxas de entrega.',
      quoteNote: 'Solicite um orçamento personalizado pelo WhatsApp.',
      logoUrl: '/assets/praticita/logo.png',
      instagramUrl: null
    }),
    categories,
    products,
    variations,
    optionGroups,
    productOptions
  };
}
