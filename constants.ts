
import { Product, Review, User, Order, CartItem } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Футуристичные Кроссовки "Космос"',
    description: 'Инновационные кроссовки с адаптивной подошвой и неоновыми вставками. Идеальны для городских исследователей.',
    price: 12999,
    category: 'Обувь',
    brand: 'Галактика Спорт',
    imageUrl: 'https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/bea42b1906b51eeaea23a001b8137f3d.jpg',
    images: ['https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/bea42b1906b51eeaea23a001b8137f3d.jpg', 'https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/66c8a63097b5aeabc6003cb0d3958996.jpg', 'https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/a80047acc2439ca567434ce0fd498d14.jpg'],
    rating: 4.5,
    numReviews: 120,
    stock: 50,
    characteristics: { "Материал верха": "Текстиль/Синтетика", "Подошва": "Пеноматериал Boost", "Сезон": "Демисезон" }
  },
  {
    id: '2',
    name: 'Смарт-часы "Орион"',
    description: 'Многофункциональные смарт-часы с AMOLED-дисплеем, GPS и мониторингом здоровья. Ваш личный ассистент на запястье.',
    price: 19990,
    category: 'Электроника',
    brand: 'ТехноМир',
    imageUrl: 'https://hocotech.com/wp-content/uploads/2021/11/hoco-y2-smart-watch-waterproof.jpg',
    images: ['https://m.media-amazon.com/images/I/617Tk8Uh2JL._AC_UF1000,1000_QL80_.jpg', 'https://avatars.mds.yandex.net/get-mpic/12369201/2a00000193296cf2269d9d6a81f1d96b7822/orig'],
    rating: 4.8,
    numReviews: 250,
    stock: 30,
    characteristics: { "Дисплей": "1.4\" AMOLED", "Батарея": "300 мАч", "Защита": "IP68" }
  },
  {
    id: '3',
    name: 'Куртка "Полярная Звезда"',
    description: 'Утепленная куртка для экстремальных условий. Непромокаемая и ветрозащитная, сохраняет тепло до -30°C.',
    price: 25000,
    category: 'Одежда',
    brand: 'Экстрим Экип',
    imageUrl: 'https://image.made-in-china.com/251f0j00iGURelfgTEVB/made-in-china.jpg',
    rating: 4.9,
    numReviews: 95,
    stock: 20,
    characteristics: { "Утеплитель": "Гусиный пух 90/10", "Мембрана": "Gore-Tex Pro", "Температурный режим": "до -30°C" }
  },
  {
    id: '4',
    name: 'Беспроводные Наушники "Аура"',
    description: 'Наушники с активным шумоподавлением и кристально чистым звуком. До 30 часов автономной работы.',
    price: 15500,
    category: 'Электроника',
    brand: 'ЗвукЭксперт',
    imageUrl: 'https://www.borofone.com/wp-content/uploads/2020/08/borofone-be35-agreeable-voice-tws-wireless-headset-tws.jpg',
    rating: 4.7,
    numReviews: 180,
    stock: 60,
    characteristics: { "Тип": "Полноразмерные, закрытые", "Шумоподавление": "Активное (ANC)", "Время работы": "30 ч" }
  },
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'r1', productId: '1', userId: 'u1', userName: 'Иван П.', rating: 5, comment: 'Отличные кроссовки, очень удобные и стильные!', createdAt: '2023-10-01' },
  { id: 'r2', productId: '1', userId: 'u2', userName: 'Елена К.', rating: 4, comment: 'Немного маломерят, но в целом довольна.', createdAt: '2023-10-05' },
  { id: 'r3', productId: '2', userId: 'u3', userName: 'Сергей В.', rating: 5, comment: 'Часы просто супер! Функционал на высоте.', createdAt: '2023-09-15' },
];

export const MOCK_USER: User = {
  id: 'user123',
  fio: 'Алексей Иванов',
  email: 'alex@example.com',
  phone: '+79001234567',
  address: { street: 'ул. Пушкина, д.10, кв.5', city: 'Москва', zip: '101000', country: 'Россия' }
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'order1',
    userId: 'user123',
    items: [
      { ...MOCK_PRODUCTS[0], quantity: 1 },
      { ...MOCK_PRODUCTS[1], quantity: 1 }
    ],
    totalAmount: MOCK_PRODUCTS[0].price + MOCK_PRODUCTS[1].price,
    status: 'Delivered',
    orderDate: '2023-09-01',
    shippingAddress: MOCK_USER.address
  },
  {
    id: 'order2',
    userId: 'user123',
    items: [{ ...MOCK_PRODUCTS[2], quantity: 1 }],
    totalAmount: MOCK_PRODUCTS[2].price,
    status: 'Shipped',
    orderDate: '2023-10-10',
    shippingAddress: MOCK_USER.address
  }
];

export const MOCK_CART_ITEMS: CartItem[] = [
    {...MOCK_PRODUCTS[0], quantity: 1},
    {...MOCK_PRODUCTS[3], quantity: 2},
];

export const MOCK_WISHLIST_ITEMS: Product[] = [
    MOCK_PRODUCTS[1], MOCK_PRODUCTS[2]
]

export const CATEGORIES = ['Обувь', 'Электроника', 'Одежда', 'Аксессуары', 'Дом и Сад', 'Спорт'];
export const BRANDS = ['Галактика Спорт', 'ТехноМир', 'Экстрим Экип', 'ЗвукЭксперт', 'УютДом', 'ФитАктив'];

