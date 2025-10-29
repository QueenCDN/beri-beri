
import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';
import ProductListingPage from './pages/ProductListingPage';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-dark text-brand-light">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* Nested routes will render here */}
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductListingPage />} />
            <Route path="product/:productId" element={<ProductDetailsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="admin" element={<AdminPage />} />
            {/* Add other top-level routes here if needed, e.g., a dedicated sales page */}
            <Route path="sales" element={<ProductListingPage />} /> {/* Example: sales page also uses ProductListing */}
            <Route path="*" element={<div className="text-center p-10 text-2xl">Страница не найдена</div>} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
