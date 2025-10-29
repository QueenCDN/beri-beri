
import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { Product, Review } from '../types';
import Button from '../components/ui/Button';
import { ShoppingCart, Heart, Star, MessageSquare, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';
import Spinner from '../components/ui/Spinner';

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const context = useContext(AppContext);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);


  useEffect(() => {
    if (context && productId) {
      const foundProduct = context.products.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setReviews(context.getReviewsForProduct(productId));
      }
    }
  }, [productId, context]);

  if (!context) return <div className="container mx-auto p-4 text-center"><Spinner /></div>;
  const { addToCart, toggleWishlist, isInWishlist, addReview: contextAddReview, currentUser } = context;

  if (!product) return <div className="container mx-auto p-4 text-center">Товар не найден. <Link to="/" className="text-brand-pink hover:underline">Вернуться на главную</Link></div>;

  const isWishlisted = isInWishlist(product.id);
  const productImages = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setNotification({type: 'success', message: `${product.name} добавлен в корзину!`});
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    const message = isInWishlist(product.id) ? `${product.name} удален из избранного.` : `${product.name} добавлен в избранное!`;
    setNotification({type: isInWishlist(product.id) ? 'error' : 'success', message});
    setTimeout(() => setNotification(null), 3000);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > product.stock) val = product.stock;
    setQuantity(val);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewRating > 0 && newReviewComment.trim() !== '' && currentUser) {
      contextAddReview({ productId: product.id, rating: newReviewRating, comment: newReviewComment });
      setReviews(context.getReviewsForProduct(product.id)); // Refresh reviews
      setNewReviewRating(0);
      setNewReviewComment('');
      setShowReviewForm(false);
      setNotification({type: 'success', message: 'Спасибо за ваш отзыв!'});
      setTimeout(() => setNotification(null), 3000);
    } else if (!currentUser) {
       setNotification({type: 'error', message: 'Пожалуйста, войдите, чтобы оставить отзыв.'});
       setTimeout(() => setNotification(null), 3000);
    }
  };
  
  const renderStars = (rating: number, interactive: boolean = false, setRating?: (r: number) => void) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={interactive ? 24 : 20}
          className={`${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={interactive && setRating ? () => setRating(i) : undefined}
        />
      );
    }
    return stars;
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {notification && (
        <div className={`fixed top-24 right-6 p-4 rounded-xl shadow-lg text-white z-50 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.type === 'success' ? <CheckCircle className="inline mr-2" /> : <AlertTriangle className="inline mr-2" />}
          {notification.message}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Images */}
        <div className="relative">
          <img src={productImages[currentImageIndex]} alt={product.name} className="w-full h-auto max-h-[500px] object-contain rounded-2xl shadow-2xl bg-brand-surface p-2"/>
          {productImages.length > 1 && (
            <>
              <Button variant="ghost" size="sm" onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 !p-2">
                <ChevronLeft size={28} />
              </Button>
              <Button variant="ghost" size="sm" onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 !p-2">
                <ChevronRight size={28} />
              </Button>
              <div className="flex justify-center mt-4 space-x-2">
                {productImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${index === currentImageIndex ? 'border-brand-pink' : 'border-transparent hover:border-brand-muted'}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Product Info */}
        <div>
          <span className="text-sm text-brand-muted uppercase tracking-wider">{product.category} - {product.brand}</span>
          <h1 className="text-4xl font-bold text-brand-light my-3">{product.name}</h1>
          <div className="flex items-center mb-4">
            {renderStars(product.rating)}
            <span className="ml-3 text-brand-muted">({product.numReviews} отзывов)</span>
          </div>
          <p className="text-brand-muted leading-relaxed mb-6">{product.description}</p>
          
          {product.characteristics && Object.keys(product.characteristics).length > 0 && (
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-brand-light mb-2">Характеристики:</h3>
                <ul className="list-disc list-inside text-brand-muted space-y-1 pl-2">
                    {Object.entries(product.characteristics).map(([key, value]) => (
                        <li key={key}><span className="font-medium text-slate-300">{key}:</span> {value}</li>
                    ))}
                </ul>
            </div>
          )}

          <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-6">
            {product.price.toLocaleString('ru-RU')} ₽
          </p>

          <div className="flex items-center space-x-4 mb-8">
            <div className="flex items-center border border-slate-700 rounded-xl">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-brand-light hover:bg-slate-700 rounded-l-xl">-</button>
              <input 
                type="number" 
                value={quantity} 
                onChange={handleQuantityChange}
                min="1" max={product.stock}
                className="w-16 text-center bg-brand-surface text-brand-light border-y-0 border-x border-slate-700 focus:outline-none focus:ring-0"
              />
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-3 py-2 text-brand-light hover:bg-slate-700 rounded-r-xl">+</button>
            </div>
            <span className="text-sm text-brand-muted">В наличии: {product.stock} шт.</span>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Button variant="primary" size="lg" onClick={handleAddToCart} leftIcon={<ShoppingCart size={20}/>} className="flex-1">
              Добавить в корзину
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleToggleWishlist} 
              leftIcon={<Heart size={20} className={isWishlisted ? 'fill-current text-brand-pink' : ''}/>} 
              className={`flex-1 ${isWishlisted ? 'border-brand-pink text-brand-pink hover:bg-pink-500/10' : ''}`}
            >
              {isWishlisted ? 'В избранном' : 'В избранное'}
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 pt-10 border-t border-slate-700">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-brand-light">Отзывы ({reviews.length})</h2>
            <Button variant="secondary" onClick={() => setShowReviewForm(!showReviewForm)} leftIcon={<MessageSquare size={18}/>}>
                {showReviewForm ? 'Скрыть форму' : 'Оставить отзыв'}
            </Button>
        </div>

        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="bg-brand-surface p-6 rounded-2xl mb-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Ваш отзыв о товаре "{product.name}"</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-light mb-1">Оценка:</label>
              <div className="flex space-x-1">
                {renderStars(newReviewRating, true, setNewReviewRating)}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="reviewComment" className="block text-sm font-medium text-brand-light mb-1">Комментарий:</label>
              <textarea 
                id="reviewComment" 
                value={newReviewComment} 
                onChange={(e) => setNewReviewComment(e.target.value)}
                rows={4}
                className="w-full bg-slate-700 text-brand-light border border-slate-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                placeholder="Поделитесь вашим мнением о товаре..."
                required
              ></textarea>
            </div>
            <Button type="submit" variant="primary" disabled={!currentUser || newReviewRating === 0 || newReviewComment.trim() === ''}>
              Отправить отзыв
            </Button>
             {!currentUser && <p className="text-sm text-yellow-400 mt-2">Пожалуйста, <Link to="/auth" className="underline hover:text-brand-pink">войдите</Link>, чтобы оставить отзыв.</p>}
          </form>
        )}

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-brand-surface p-6 rounded-2xl shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-4">{renderStars(review.rating)}</div>
                  <h4 className="font-semibold text-brand-light">{review.userName}</h4>
                  <span className="ml-auto text-xs text-brand-muted">{new Date(review.createdAt).toLocaleDateString('ru-RU')}</span>
                </div>
                <p className="text-brand-muted leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-brand-muted text-center">Отзывов пока нет. Будьте первым!</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
