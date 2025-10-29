
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, WishlistItem, User, Review, Order } from '../types';
import { MOCK_PRODUCTS, MOCK_USER, MOCK_REVIEWS, MOCK_CART_ITEMS, MOCK_WISHLIST_ITEMS, MOCK_ORDERS } from '../constants';

interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  currentUser: User | null;
  loginUser: (email: string, pass: string) => boolean; // Simplified
  logoutUser: () => void;
  registerUser: (userData: Omit<User, 'id'>) => boolean; // Simplified
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'userId' | 'userName' | 'createdAt'>) => void;
  getReviewsForProduct: (productId: string) => Review[];
  orders: Order[];
  placeOrder: (cartItems: CartItem[], shippingAddress: User['address']) => boolean;
  getOrdersForUser: (userId: string) => Order[];
  updateUser: (updatedUser: User) => void;
  MOCK_USER_EMAIL_FOR_ADMIN_CHECK: string;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(MOCK_CART_ITEMS);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(MOCK_WISHLIST_ITEMS);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Start with no user logged in
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [orders, setOrdersState] = useState<Order[]>(MOCK_ORDERS); // Renamed to avoid conflict with Order type

  // Mock login
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);


  const loginUser = (email: string, pass: string): boolean => {
    // In a real app, this would be an API call
    if (email === MOCK_USER.email && pass === "password123") { // Mock password check
      setCurrentUser(MOCK_USER);
      localStorage.setItem('currentUser', JSON.stringify(MOCK_USER));
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const registerUser = (userData: Omit<User, 'id'>): boolean => {
    // Mock registration
    const newUser: User = { ...userData, id: `user-${Date.now()}` };
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    // In a real app, you'd also add this user to your user database
    return true;
  };
  
  const updateUser = (updatedUserData: User) => {
    if (currentUser && currentUser.id === updatedUserData.id) {
      setCurrentUser(updatedUserData);
      localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
       // In a real app, you'd also update this user in your user database
    }
  };


  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      const existingItem = prevWishlist.find((item) => item.id === product.id);
      if (existingItem) {
        return prevWishlist.filter((item) => item.id !== product.id);
      }
      return [...prevWishlist, product];
    });
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((item) => item.id === productId);
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'userId' | 'userName' | 'createdAt'>) => {
    if (!currentUser) return; // Or handle anonymous reviews differently
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fio.split(' ')[0] || 'Аноним', // Use first name or 'Anonymous'
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  const getReviewsForProduct = (productId: string): Review[] => {
    return reviews.filter((review) => review.productId === productId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const placeOrder = (cartItems: CartItem[], shippingAddress: User['address']): boolean => {
    if (!currentUser || cartItems.length === 0) return false;
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId: currentUser.id,
      items: cartItems,
      totalAmount,
      status: 'Processing',
      orderDate: new Date().toISOString().split('T')[0],
      shippingAddress,
      paymentMethod: "Карта **** 1234 (Мок)"
    };
    setOrdersState(prevOrders => [newOrder, ...prevOrders]);
    clearCart(); // Clear cart after placing order
    return true;
  };
  
  const getOrdersForUser = (userId: string): Order[] => {
    return orders.filter(order => order.userId === userId).sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  };


  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        currentUser,
        loginUser,
        logoutUser,
        registerUser,
        reviews,
        addReview,
        getReviewsForProduct,
        orders,
        placeOrder,
        getOrdersForUser,
        updateUser,
        MOCK_USER_EMAIL_FOR_ADMIN_CHECK: MOCK_USER.email,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};