
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import Button from '../ui/Button';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { AppContext } from '../../contexts/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { addToCart, toggleWishlist, isInWishlist } = context;

  const isWishlisted = isInWishlist(product.id);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-brand-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-brand-purple/30 transform hover:-translate-y-1">
      <Link to={`/product/${product.id}`} className="relative block">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-black/50 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <Eye size={20} className="text-white" />
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-1">
          <span className="text-xs text-brand-muted uppercase tracking-wider">{product.category}</span>
        </div>
        <h3 className="text-lg font-semibold text-brand-light mb-2 truncate group-hover:text-brand-pink transition-colors">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        
        <div className="flex items-center mb-3">
          {renderStars(product.rating)}
          <span className="ml-2 text-sm text-brand-muted">({product.numReviews})</span>
        </div>

        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4">
          {product.price.toLocaleString('ru-RU')} ₽
        </p>

        <div className="mt-auto flex space-x-2">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => addToCart(product, 1)} 
            className="flex-1"
            leftIcon={<ShoppingCart size={18}/>}
          >
            В корзину
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => toggleWishlist(product)}
            className={`px-3 ${isWishlisted ? 'text-brand-pink bg-pink-500/10' : 'text-brand-muted hover:text-brand-pink hover:bg-slate-700'}`}
          >
            <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
