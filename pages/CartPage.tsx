
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const CartPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) return <div className="container mx-auto p-4 text-center">Загрузка корзины...</div>;
  const { cart, removeFromCart, updateCartQuantity, clearCart, currentUser } = context;

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/auth?redirect=/checkout'); // Redirect to login, then to a checkout page (not implemented)
    } else if (currentUser.address) {
        // For simplicity, directly use context's placeOrder and navigate to account orders
        context.placeOrder(cart, currentUser.address);
        navigate('/account?section=orders'); 
    } else {
        // User logged in but no address, redirect to add address in account
        navigate('/account?section=addresses&checkout=true');
    }
  };


  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <ShoppingBag size={80} className="mx-auto text-brand-muted mb-6" />
        <h1 className="text-3xl font-bold text-brand-light mb-4">Ваша корзина пуста</h1>
        <p className="text-brand-muted mb-8">Похоже, вы еще ничего не добавили. Самое время начать покупки!</p>
        <Link to="/products">
          <Button variant="primary" size="lg">Перейти в каталог</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-brand-light">Ваша корзина</h1>
        <Button variant="danger" onClick={clearCart} leftIcon={<Trash2 size={18}/>} size="sm" className={cart.length === 0 ? 'hidden' : ''}>
          Очистить корзину
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="bg-brand-surface rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-xl"/>
              <div className="flex-grow">
                <Link to={`/product/${item.id}`} className="text-lg font-semibold text-brand-light hover:text-brand-pink transition-colors">{item.name}</Link>
                <p className="text-sm text-brand-muted">{item.category} - {item.brand}</p>
                <p className="text-lg font-bold text-brand-purple mt-1">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="p-1.5" onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}><Minus size={16}/></Button>
                <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                <Button variant="ghost" size="sm" className="p-1.5" onClick={() => updateCartQuantity(item.id, Math.min(item.stock, item.quantity + 1))}><Plus size={16}/></Button>
              </div>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 p-2" onClick={() => removeFromCart(item.id)}>
                <Trash2 size={20}/>
              </Button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-brand-surface rounded-2xl p-8 shadow-xl sticky top-24">
            <h2 className="text-2xl font-semibold text-brand-light mb-6">Итог заказа</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-brand-muted">
                <span>Товары ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                <span>{totalAmount.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between text-brand-muted">
                <span>Доставка</span>
                <span className="text-green-400">Бесплатно</span>
              </div>
              <hr className="border-slate-700 my-3" />
              <div className="flex justify-between text-xl font-bold text-brand-light">
                <span>Всего к оплате</span>
                <span>{totalAmount.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
            <Button variant="primary" size="lg" className="w-full" onClick={handleCheckout} rightIcon={<ArrowRight size={20}/>}>
              {currentUser ? 'Оформить заказ' : 'Войти и оформить'}
            </Button>
            <Link to="/products" className="block text-center mt-4 text-brand-pink hover:underline">
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
