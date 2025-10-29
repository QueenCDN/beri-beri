
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { AppContext } from '../../contexts/AppContext';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const context = useContext(AppContext);

  if (!context) {
    return null; 
  }
  const { cart, wishlist, currentUser, logoutUser } = context;

  const navLinks = [
    { name: 'Главная', path: '/' },
    { name: 'Каталог', path: '/products' },
    { name: 'Акции', path: '/sales' }, // Example, not implemented
    { name: 'О нас', path: '/about' }, // Example, not implemented
  ];

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  }

  return (
    <nav className="bg-brand-surface shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Mobile Menu Toggle */}
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-pink to-brand-blue">
              Бери Бери
            </Link>
            <div className="hidden md:ml-10 md:flex md:items-baseline md:space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-brand-light hover:text-brand-pink px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xs ml-6">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-brand-muted" />
              </div>
              <input
                type="text"
                placeholder="Поиск товаров..."
                className="block w-full bg-slate-700 text-brand-light border border-slate-600 rounded-xl py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Icons and User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/wishlist" className="relative p-2 text-brand-light hover:text-brand-pink rounded-full hover:bg-slate-700 transition-colors">
              <Heart size={24} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-brand-pink rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative p-2 text-brand-light hover:text-brand-pink rounded-full hover:bg-slate-700 transition-colors">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-brand-pink rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
            {currentUser ? (
              <div className="relative group">
                 <Link to="/account" className="p-2 text-brand-light hover:text-brand-pink rounded-full hover:bg-slate-700 transition-colors flex items-center">
                    <User size={24} />
                    <span className="ml-2 text-sm hidden lg:inline">{currentUser.fio.split(' ')[0]}</span>
                 </Link>
                 <div className="absolute right-0 mt-2 w-48 bg-brand-surface rounded-xl shadow-lg py-1 hidden group-hover:block">
                    <Link to="/account" className="block px-4 py-2 text-sm text-brand-light hover:bg-slate-700">Мой аккаунт</Link>
                    <Link to="/admin" className="block px-4 py-2 text-sm text-brand-light hover:bg-slate-700">Админ панель</Link>
                    <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-brand-light hover:bg-slate-700">Выйти</button>
                 </div>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="primary" size="sm">Войти</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-brand-light hover:text-brand-pink rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-purple"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 inset-x-0 bg-brand-surface shadow-lg p-4 z-30">
          <div className="space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-brand-light hover:text-brand-pink px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="relative mt-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-brand-muted" />
                </div>
                <input
                  type="text"
                  placeholder="Поиск товаров..."
                  className="block w-full bg-slate-700 text-brand-light border border-slate-600 rounded-xl py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                />
            </div>
            <div className="flex justify-around items-center pt-4 border-t border-slate-700">
                <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="relative p-2 text-brand-light hover:text-brand-pink rounded-full hover:bg-slate-700 transition-colors">
                  <Heart size={24} />
                  {wishlist.length > 0 && <span className="absolute top-0 right-0 h-2 w-2 bg-brand-pink rounded-full"></span>}
                </Link>
                <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="relative p-2 text-brand-light hover:text-brand-pink rounded-full hover:bg-slate-700 transition-colors">
                  <ShoppingCart size={24} />
                  {cart.length > 0 && <span className="absolute top-0 right-0 h-2 w-2 bg-brand-pink rounded-full"></span>}
                </Link>
                {currentUser ? (
                    <div className="flex flex-col space-y-2">
                        <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-2 text-brand-light hover:text-brand-pink rounded-md hover:bg-slate-700 transition-colors">
                            <User size={24} className="mr-2" /> Мой аккаунт
                        </Link>
                         <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-2 text-brand-light hover:text-brand-pink rounded-md hover:bg-slate-700 transition-colors">
                            Админ панель
                        </Link>
                        <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} variant="secondary" size="sm" className="w-full">Выйти</Button>
                    </div>
                ) : (
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="primary" size="sm" className="w-full">Войти / Регистрация</Button>
                    </Link>
                )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
