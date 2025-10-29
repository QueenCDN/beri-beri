
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  imageUrl: string;
  images?: string[];
  rating: number;
  numReviews: number;
  stock: number;
  characteristics?: { [key: string]: string };
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem extends Product {}

export interface User {
  id: string;
  fio: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  // Omitting password for frontend representation
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string;
  shippingAddress: User['address'];
  paymentMethod?: string; // e.g., "Visa **** 1234"
}

export enum AuthMode {
  Login = 'login',
  Register = 'register',
}

export enum AccountSection {
  Profile = 'profile',
  Orders = 'orders',
  Addresses = 'addresses',
  PaymentMethods = 'payment',
  Settings = 'settings',
}

export enum AdminSection {
  Dashboard = 'dashboard',
  ProductList = 'products',
  AddProduct = 'add-product',
  EditProduct = 'edit-product', // Will need a productId
  Orders = 'orders',
  Users = 'users',
  Settings = 'settings',
}