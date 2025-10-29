
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';
import { HeartCrack } from 'lucide-react';

const WishlistPage: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return <div className="container mx-auto p-4 text-center">Загрузка избранного...</div>;
  const { wishlist } = context;

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <HeartCrack size={80} className="mx-auto text-brand-muted mb-6" />
        <h1 className="text-3xl font-bold text-brand-light mb-4">Ваш список избранного пуст</h1>
        <p className="text-brand-muted mb-8">Добавляйте товары в избранное, чтобы не потерять их!</p>
        <Link to="/products">
          <Button variant="primary" size="lg">Начать покупки</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-brand-light mb-10">Избранные товары</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {wishlist.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
