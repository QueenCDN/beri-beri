
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import ProductCard from '../components/product/ProductCard';
import Input from '../components/ui/Input';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../components/ui/Button';
import { CATEGORIES, BRANDS } from '../constants'; // Assuming these are exported

const ProductListingPage: React.FC = () => {
  const context = useContext(AppContext);
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 50000 });
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating' | 'newest'>('newest');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Get initial category from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [location.search]);

  const products = context?.products || [];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }
    
    // Filter by brands
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Filter by price range
    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    
    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest': // Assuming higher ID means newer for mock data
        result.sort((a,b) => parseInt(b.id) - parseInt(a.id));
        break;
    }
    return result;
  }, [products, searchTerm, selectedCategories, selectedBrands, priceRange, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };
  
  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const FilterAccordionItem: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <div className="py-4 border-b border-slate-700">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left font-semibold">
          {title}
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {isOpen && <div className="mt-3 space-y-2">{children}</div>}
      </div>
    );
  };

  const FiltersSidebar = () => (
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-brand-surface p-6 shadow-2xl transform ${isFiltersOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 md:block md:col-span-1 md:sticky md:top-24 md:h-[calc(100vh-7rem)] md:overflow-y-auto rounded-r-2xl md:rounded-2xl`}>
      <div className="flex justify-between items-center mb-6 md:hidden">
        <h3 className="text-xl font-semibold">Фильтры</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsFiltersOpen(false)} className="!p-1"><X size={24} /></Button>
      </div>
      
      <FilterAccordionItem title="Категории">
        {CATEGORIES.map(cat => (
          <label key={cat} className="flex items-center space-x-2 cursor-pointer text-brand-light hover:text-brand-pink">
            <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryChange(cat)} className="form-checkbox h-4 w-4 text-brand-purple bg-slate-600 border-slate-500 rounded focus:ring-brand-purple"/>
            <span>{cat}</span>
          </label>
        ))}
      </FilterAccordionItem>

      <FilterAccordionItem title="Бренды">
        {BRANDS.map(brand => (
          <label key={brand} className="flex items-center space-x-2 cursor-pointer text-brand-light hover:text-brand-pink">
            <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => handleBrandChange(brand)} className="form-checkbox h-4 w-4 text-brand-purple bg-slate-600 border-slate-500 rounded focus:ring-brand-purple"/>
            <span>{brand}</span>
          </label>
        ))}
      </FilterAccordionItem>
      
      <FilterAccordionItem title="Цена">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Input type="number" placeholder="Мин" value={priceRange.min} onChange={e => setPriceRange(p => ({...p, min: Number(e.target.value)}))} className="w-1/2 !py-2 !px-2 text-sm"/>
            <span className="text-brand-muted">-</span>
            <Input type="number" placeholder="Макс" value={priceRange.max} onChange={e => setPriceRange(p => ({...p, max: Number(e.target.value)}))} className="w-1/2 !py-2 !px-2 text-sm"/>
          </div>
          {/* Basic Range Slider (visual only) */}
          <input type="range" min="0" max="50000" value={priceRange.max} onChange={e => setPriceRange(p => ({...p, max: Number(e.target.value)}))} className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-brand-purple"/>
        </div>
      </FilterAccordionItem>
      <Button variant="danger" size="sm" onClick={() => {setSelectedCategories([]); setSelectedBrands([]); setPriceRange({min:0, max:50000});}} className="w-full mt-6">Сбросить все фильтры</Button>
    </aside>
  );

  if (!context) return <div className="container mx-auto p-4 text-center">Загрузка товаров...</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-brand-light mb-8">Каталог товаров</h1>
      
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <Input 
            type="text" 
            placeholder="Поиск по названию..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            IconComponent={Search}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" onClick={() => setIsFiltersOpen(true)} className="md:hidden" leftIcon={<Filter size={18}/>}>
                Фильтры
            </Button>
            <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-brand-surface text-brand-light border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
                <option value="newest">Сначала новые</option>
                <option value="price_asc">Цена: по возрастанию</option>
                <option value="price_desc">Цена: по убыванию</option>
                <option value="rating">По рейтингу</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <FiltersSidebar />
        {isFiltersOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsFiltersOpen(false)}></div>}
        
        <main className="md:col-span-3">
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-brand-surface rounded-2xl">
              <Search size={48} className="mx-auto text-brand-muted mb-4"/>
              <p className="text-xl text-brand-light font-semibold">Товары не найдены</p>
              <p className="text-brand-muted">Попробуйте изменить фильтры или поисковый запрос.</p>
            </div>
          )}
          {/* TODO: Pagination component here */}
        </main>
      </div>
    </div>
  );
};

export default ProductListingPage;
