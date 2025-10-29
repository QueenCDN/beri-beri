
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';
import { ArrowRight, Search, Zap, Tag, Gift } from 'lucide-react';

const HomePage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return <div className="container mx-auto p-4 text-center">Загрузка данных...</div>;
  const { products } = context;

  const popularProducts = products.slice(0, 4); // Show first 4 as popular

  return (
    <div className="min-h-screen bg-brand-dark text-brand-light">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-purple via-brand-dark to-brand-blue py-20 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          {/* You could add a subtle pattern or animated background shapes here */}
          <img src="https://cdn.shopify.com/s/files/1/0070/7032/articles/Header_32797302-c39f-49b9-9778-8e4ccd073571.png" alt="Abstract background" className="w-full h-full object-cover opacity-20"/>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-blue-300 mb-6 leading-tight">
            Бери Бери: <br className="sm:hidden"/> Твой Мир Выгодных Покупок
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Откройте для себя тысячи товаров по лучшим ценам. Новинки, акции и эксклюзивные предложения ждут вас!
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/products">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={20}/>}>
                Смотреть каталог
              </Button>
            </Link>
            <div className="relative w-full max-w-md">
              <input type="text" placeholder="Что вы ищете сегодня?" className="w-full bg-white/10 backdrop-blur-sm text-brand-light border border-white/20 rounded-xl py-3 px-5 pl-12 focus:outline-none focus:ring-2 focus:ring-brand-pink placeholder-slate-400"/>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-brand-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl hover:bg-slate-700 transition-all">
              <Zap size={48} className="mx-auto mb-4 text-brand-pink" />
              <h3 className="text-xl font-semibold mb-2">Быстрая Доставка</h3>
              <p className="text-brand-muted">Получите ваш заказ в кратчайшие сроки по всей стране.</p>
            </div>
            <div className="p-6 rounded-2xl hover:bg-slate-700 transition-all">
              <Tag size={48} className="mx-auto mb-4 text-brand-purple" />
              <h3 className="text-xl font-semibold mb-2">Лучшие Цены</h3>
              <p className="text-brand-muted">Гарантируем выгодные предложения и регулярные скидки.</p>
            </div>
            <div className="p-6 rounded-2xl hover:bg-slate-700 transition-all">
              <Gift size={48} className="mx-auto mb-4 text-brand-blue" />
              <h3 className="text-xl font-semibold mb-2">Эксклюзивные Товары</h3>
              <p className="text-brand-muted">Находите уникальные товары, которых нет больше нигде.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">Популярные категории</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
  
              <Link key={'Обувь'} to={`/products?category=${'Обувь'}`} className="block group">
                <div className="bg-brand-surface rounded-2xl p-6 text-center aspect-square flex flex-col justify-center items-center shadow-lg hover:shadow-brand-purple/30 transition-all duration-300 transform hover:scale-105">
                  <img src={`https://galereya.store/image/cache/catalog/easyphoto/41050/525224-01303-jpg-4-450x360.jpg`} alt={'Обувь'} className="w-16 h-16 mb-3 rounded-full object-cover"/>
                  <h3 className="text-md font-semibold text-brand-light group-hover:text-brand-pink transition-colors">{'Обувь'}</h3>
                </div>
              </Link>

              <Link key={'Электроника'} to={`/products?category=${'Электроника'}`} className="block group">
                <div className="bg-brand-surface rounded-2xl p-6 text-center aspect-square flex flex-col justify-center items-center shadow-lg hover:shadow-brand-purple/30 transition-all duration-300 transform hover:scale-105">
                  <img src={`https://lazada.ru/wp-content/uploads/2019/10/product-47-280x280.jpg`} alt={'Электроника'} className="w-16 h-16 mb-3 rounded-full object-cover"/>
                  <h3 className="text-md font-semibold text-brand-light group-hover:text-brand-pink transition-colors">{'Электроника'}</h3>
                </div>
              </Link>

              <Link key={'Одежда'} to={`/products?category=${'Одежда'}`} className="block group">
                <div className="bg-brand-surface rounded-2xl p-6 text-center aspect-square flex flex-col justify-center items-center shadow-lg hover:shadow-brand-purple/30 transition-all duration-300 transform hover:scale-105">
                  <img src={`https://img.freepik.com/free-photo/set-with-fashionable-women-s-clothing-jeans-sweater_169016-3214.jpg`} alt={'Одежда'} className="w-16 h-16 mb-3 rounded-full object-cover"/>
                  <h3 className="text-md font-semibold text-brand-light group-hover:text-brand-pink transition-colors">{'Одежда'}</h3>
                </div>
              </Link>

             <Link to="/products" className="block group">
                <div className="bg-gradient-to-br from-brand-purple to-brand-blue rounded-2xl p-6 text-center aspect-square flex flex-col justify-center items-center shadow-lg hover:shadow-brand-pink/40 transition-all duration-300 transform hover:scale-105">
                   <ArrowRight size={32} className="mb-3 text-white"/>
                  <h3 className="text-md font-semibold text-white">Все категории</h3>
                </div>
              </Link>
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-16 bg-brand-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Актуальные товары</h2>
            <Link to="/products">
              <Button variant="outline" size="md" rightIcon={<ArrowRight size={18}/>}>
                Все товары
              </Button>
            </Link>
          </div>
          {popularProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-brand-muted">Популярные товары скоро появятся.</p>
          )}
        </div>
      </section>

      {/* Discount Banner Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Скидки до 50% уже здесь!</h2>
              <p className="text-lg mb-6 md:mb-0">Не упустите шанс купить любимые товары по суперценам.</p>
            </div>
            <Link to="/sales">
              <Button variant="secondary" size="lg" className="bg-white text-brand-purple hover:bg-gray-200 font-bold">
                Узнать больше
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
