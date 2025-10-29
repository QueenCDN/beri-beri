
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { Product, Order, User, AdminSection } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { LayoutDashboard, ListOrdered, PackagePlus, Users, Settings as SettingsIcon, Edit3, Trash2, Eye, PlusCircle } from 'lucide-react'; // Renamed Settings to SettingsIcon
import Spinner from '../components/ui/Spinner';

const AdminPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  
  const [activeSection, setActiveSection] = useState<AdminSection>(AdminSection.Dashboard);
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]); 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentUsers] = useState<User[]>([]); 
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ name: '', price: 0, category: '', description: '', imageUrl: '', stock: 0 });

  // Admin check: Use the email from context for checking admin privileges
  const isAdmin = context?.currentUser?.email === context?.MOCK_USER_EMAIL_FOR_ADMIN_CHECK;

  useEffect(() => {
    if (!context) return;
    
    if (!isAdmin) {
       // console.warn("Admin access attempt by non-admin user or no user logged in.");
       // navigate('/'); // Redirect non-admins or show "Not Authorized"
    }
    setCurrentProducts(context.products);
    setCurrentOrders(context.orders); 
    // if (context.currentUser) { // Example: just list current user, or fetch all users
    //    setCurrentUsers([context.currentUser]);
    // }
  }, [context, navigate, isAdmin]);


  if (!context) return <Spinner />;
  
  // It's generally better to handle unauthorized access by redirecting or showing a specific message
  // rather than just logging a warning. For this exercise, we'll allow the page to render
  // but in a real app, robust checks and balances would be in place.
  // if (!isAdmin) {
  //   return <div className="container mx-auto p-8 text-center text-red-500">Доступ запрещен. Только для администраторов.</div>;
  // }
  

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const productToAdd: Product = {
      id: `prod-${Date.now()}`,
      rating: 0,
      numReviews: 0,
      brand: newProduct.brand || 'Новый Бренд', 
      ...newProduct
    } as Product;
    context.setProducts(prev => [...prev, productToAdd]);
    setNewProduct({ name: '', price: 0, category: '', description: '', imageUrl: '', stock: 0, brand: '' });
    setActiveSection(AdminSection.ProductList);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveSection(AdminSection.EditProduct);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      context.setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
      setActiveSection(AdminSection.ProductList);
    }
  };
  
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
      context.setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };


  const renderSectionContent = () => {
    switch (activeSection) {
      case AdminSection.Dashboard:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Панель управления</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-700 p-6 rounded-xl shadow">
                <h3 className="text-lg font-medium text-brand-purple">Товары</h3>
                <p className="text-3xl font-bold mt-1">{currentProducts.length}</p>
              </div>
              <div className="bg-slate-700 p-6 rounded-xl shadow">
                <h3 className="text-lg font-medium text-brand-pink">Заказы</h3>
                <p className="text-3xl font-bold mt-1">{currentOrders.length}</p>
              </div>
              <div className="bg-slate-700 p-6 rounded-xl shadow">
                <h3 className="text-lg font-medium text-brand-blue">Пользователи</h3>
                <p className="text-3xl font-bold mt-1">{context.currentUser ? currentUsers.length + 1 : currentUsers.length}</p> {/* Placeholder, adjust as needed */}
              </div>
            </div>
          </div>
        );
      case AdminSection.ProductList:
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Список товаров</h2>
              <Button variant="primary" size="sm" onClick={() => setActiveSection(AdminSection.AddProduct)} leftIcon={<PlusCircle size={18}/>}>Добавить товар</Button>
            </div>
            <div className="bg-slate-700 rounded-xl shadow overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="p-4 text-left text-sm font-semibold text-brand-muted">Фото</th>
                    <th className="p-4 text-left text-sm font-semibold text-brand-muted">Название</th>
                    <th className="p-4 text-left text-sm font-semibold text-brand-muted">Цена</th>
                    <th className="p-4 text-left text-sm font-semibold text-brand-muted">Категория</th>
                    <th className="p-4 text-left text-sm font-semibold text-brand-muted">В наличии</th>
                    <th className="p-4 text-left text-sm font-semibold text-brand-muted">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map(p => (
                    <tr key={p.id} className="border-b border-slate-600 hover:bg-slate-600/50 transition-colors">
                      <td className="p-3"><img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded-md"/></td>
                      <td className="p-3 text-sm font-medium">{p.name}</td>
                      <td className="p-3 text-sm">{p.price.toLocaleString()} ₽</td>
                      <td className="p-3 text-sm">{p.category}</td>
                      <td className="p-3 text-sm">{p.stock}</td>
                      <td className="p-3 text-sm">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="!p-1.5 text-blue-400 hover:text-blue-300" onClick={() => navigate(`/product/${p.id}`)}><Eye size={16}/></Button>
                          <Button variant="ghost" size="sm" className="!p-1.5 text-yellow-400 hover:text-yellow-300" onClick={() => handleEditProduct(p)}><Edit3 size={16}/></Button>
                          <Button variant="ghost" size="sm" className="!p-1.5 text-red-400 hover:text-red-300" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={16}/></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        case AdminSection.AddProduct:
        case AdminSection.EditProduct:
          const currentFormData = activeSection === AdminSection.EditProduct ? editingProduct : newProduct;
          const formTitle = activeSection === AdminSection.EditProduct ? "Редактировать товар" : "Добавить новый товар";
          const handleSubmitForm = activeSection === AdminSection.EditProduct ? handleUpdateProduct : handleAddProduct;
          
          const handleFormChange = (field: keyof Product | keyof Partial<Product>, value: any) => {
            if (activeSection === AdminSection.EditProduct && editingProduct) {
                setEditingProduct(prev => prev ? {...prev, [field]: value} : null);
            } else {
                setNewProduct(prev => ({...prev, [field]: value}));
            }
          };


          return (
            <div>
              <h2 className="text-2xl font-semibold mb-6">{formTitle}</h2>
              <form onSubmit={handleSubmitForm} className="space-y-4 bg-slate-700 p-6 rounded-xl shadow">
                <Input label="Название товара" value={currentFormData?.name || ''} onChange={e => handleFormChange('name', e.target.value)} required/>
                <Input label="Цена (₽)" type="number" value={currentFormData?.price || 0} onChange={e => handleFormChange('price', parseFloat(e.target.value))} required/>
                <Input label="Категория" value={currentFormData?.category || ''} onChange={e => handleFormChange('category', e.target.value)} required/>
                <Input label="Бренд" value={currentFormData?.brand || ''} onChange={e => handleFormChange('brand', e.target.value)} />
                <div>
                    <label className="block text-sm font-medium text-brand-light mb-1">Описание</label>
                    <textarea value={currentFormData?.description || ''} onChange={e => handleFormChange('description', e.target.value)} rows={4} className="w-full bg-brand-surface text-brand-light border border-slate-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" required />
                </div>
                <Input label="URL изображения" value={currentFormData?.imageUrl || ''} onChange={e => handleFormChange('imageUrl', e.target.value)} required/>
                <Input label="В наличии (шт.)" type="number" value={currentFormData?.stock || 0} onChange={e => handleFormChange('stock', parseInt(e.target.value))} required/>
                <Button type="submit" variant="primary">{activeSection === AdminSection.EditProduct ? "Сохранить изменения" : "Добавить товар"}</Button>
              </form>
            </div>
          );
      case AdminSection.Orders:
         return (
            <div>
                <h2 className="text-2xl font-semibold mb-6">Заказы</h2>
                 {currentOrders.length > 0 ? (
                <div className="space-y-4">
                {currentOrders.map(order => (
                    <div key={order.id} className="bg-slate-700 p-4 rounded-lg">
                        <p>ID Заказа: {order.id}</p>
                        <p>Пользователь: {order.userId}</p>
                        <p>Сумма: {order.totalAmount} ₽</p>
                        <p>Статус: {order.status}</p>
                    </div>
                ))}
                </div>
            ) : <p>Нет заказов для отображения.</p>}
            </div>
         );
      case AdminSection.Users:
          return (
            <div>
                <h2 className="text-2xl font-semibold mb-6">Пользователи</h2>
                {/* Mock implementation */}
                {context.currentUser ? (
                     <div className="bg-slate-700 p-4 rounded-lg">
                        <p>ID: {context.currentUser.id}</p>
                        <p>ФИО: {context.currentUser.fio}</p>
                        <p>Email: {context.currentUser.email}</p>
                    </div>
                ) : <p>Нет пользователей для отображения.</p>}
            </div>
          );
      case AdminSection.Settings:
          return (
            <div>
                <h2 className="text-2xl font-semibold mb-6">Настройки Админ-панели</h2>
                <p>Здесь могли бы быть настройки админ-панели.</p>
            </div>
          );
      default:
        return <p>Выберите раздел из меню.</p>;
    }
  };

  const menuItems = [
    { id: AdminSection.Dashboard, label: 'Дашборд', icon: LayoutDashboard },
    { id: AdminSection.ProductList, label: 'Товары', icon: ListOrdered },
    { id: AdminSection.AddProduct, label: 'Добавить товар', icon: PackagePlus },
    { id: AdminSection.Orders, label: 'Заказы', icon: ListOrdered }, 
    { id: AdminSection.Users, label: 'Пользователи', icon: Users },
    { id: AdminSection.Settings, label: 'Настройки', icon: SettingsIcon },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-brand-light mb-10">Админ-панель</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="bg-brand-surface p-6 rounded-2xl shadow-xl space-y-2 sticky top-24">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeSection === item.id ? 'bg-brand-purple text-white shadow-md' : 'text-brand-light hover:bg-slate-700'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </aside>
        <main className="md:col-span-3 bg-brand-surface p-8 rounded-2xl shadow-xl min-h-[500px]">
          {renderSectionContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;