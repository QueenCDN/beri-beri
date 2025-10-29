
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-surface border-t border-slate-700 text-brand-light mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-pink to-brand-blue mb-4">Бери Бери</h3>
            <p className="text-brand-muted text-sm leading-relaxed">
              Ваш надежный партнер в мире онлайн-шоппинга. Мы предлагаем лучшие товары по выгодным ценам с быстрой доставкой.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-brand-light mb-4">Быстрые ссылки</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-brand-muted hover:text-brand-pink transition-colors">Каталог товаров</Link></li>
              <li><Link to="/account" className="text-brand-muted hover:text-brand-pink transition-colors">Мой аккаунт</Link></li>
              <li><Link to="/cart" className="text-brand-muted hover:text-brand-pink transition-colors">Корзина</Link></li>
              <li><Link to="/faq" className="text-brand-muted hover:text-brand-pink transition-colors">Помощь (FAQ)</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-brand-light mb-4">Свяжитесь с нами</h4>
            <ul className="space-y-2 text-brand-muted">
              <li>Email: support@beriberi.shop</li>
              <li>Телефон: 8 (800) 555-35-35</li>
              <li>Адрес: г. Пермь, ул. Ленина, 1</li>
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-brand-light mb-4">Мы в соцсетях</h4>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-brand-muted hover:text-brand-pink transition-colors"><Facebook size={24} /></a>
              <a href="#" className="text-brand-muted hover:text-brand-pink transition-colors"><Instagram size={24} /></a>
              <a href="#" className="text-brand-muted hover:text-brand-pink transition-colors"><Twitter size={24} /></a>
              <a href="#" className="text-brand-muted hover:text-brand-pink transition-colors"><Youtube size={24} /></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-brand-muted text-sm">
          <p>&copy; {currentYear} Бери Бери. Все права защищены.</p>
          <p className="mt-1">
            <Link to="/privacy" className="hover:text-brand-pink transition-colors">Политика конфиденциальности</Link> | 
            <Link to="/terms" className="hover:text-brand-pink transition-colors ml-1"> Условия использования</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
