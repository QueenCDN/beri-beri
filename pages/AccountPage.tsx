
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { User as UserType, Order, AccountSection } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User, ShoppingBag, MapPinIcon, CreditCard, Settings, LogOut, Edit3, Save, XCircle, Package } from 'lucide-react';
import Spinner from '../components/ui/Spinner';

const AccountPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState<AccountSection>(AccountSection.Profile);
  const [userFormData, setUserFormData] = useState<Partial<UserType>>({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<{type: 'success'|'error', text:string} | null>(null);

  useEffect(() => {
    if (!context?.currentUser) {
      navigate('/auth?redirect=/account');
    } else {
      setUserFormData(context.currentUser);
      setOrders(context.getOrdersForUser(context.currentUser.id));
    }
  }, [context, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section') as AccountSection;
    if (section && Object.values(AccountSection).includes(section)) {
      setActiveSection(section);
    }
  }, [location.search]);

  if (!context || !context.currentUser) {
    return <div className="container mx-auto p-4 text-center"><Spinner /></div>;
  }
  const { currentUser, updateUser, logoutUser } = context;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserFormData(prev => {
      if (name.startsWith("address.")) {
        const addressField = name.split(".")[1] as keyof NonNullable<UserType['address']>;
        // Ensure currentAddress is a full address object, even if prev.address was undefined
        const currentAddress = prev.address || { street: '', city: '', zip: '', country: '' };
        return {
          ...prev,
          address: {
            ...currentAddress,
            [addressField]: value,
          },
        };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const handleProfileSave = () => {
    if (userFormData.id) { 
        updateUser(userFormData as UserType); 
        setIsEditingProfile(false);
    }
  };

  const handleChangePassword = () => {
    setPasswordChangeMessage(null);
    if (newPassword !== confirmNewPassword) {
        setPasswordChangeMessage({type: 'error', text: 'Новые пароли не совпадают.'});
        return;
    }
    if (newPassword.length < 6) {
        setPasswordChangeMessage({type: 'error', text: 'Пароль должен быть не менее 6 символов.'});
        return;
    }
    // Mock password change
    console.log("Password change attempt for user:", currentUser.email, "New password:", newPassword);
    setPasswordChangeMessage({type: 'success', text: 'Пароль успешно изменен (имитация).'});
    setNewPassword('');
    setConfirmNewPassword('');
    setTimeout(() => setPasswordChangeMessage(null), 3000);
  };

  const handleDeleteAccount = () => {
      if(window.confirm("Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.")) {
          console.log("Account deletion initiated for user:", currentUser.email);
          // Mock deletion
          logoutUser();
          alert("Аккаунт удален (имитация).");
          navigate('/');
      }
  };


  const renderSection = () => {
    switch (activeSection) {
      case AccountSection.Profile:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Личные данные</h2>
                <Button variant={isEditingProfile ? "danger" : "secondary"} size="sm" onClick={() => {
                    setIsEditingProfile(!isEditingProfile);
                    if (isEditingProfile) setUserFormData(currentUser); // Reset form on cancel
                }} leftIcon={isEditingProfile ? <XCircle size={18}/> : <Edit3 size={18}/>}>
                    {isEditingProfile ? "Отмена" : "Редактировать"}
                </Button>
            </div>
            <Input label="ФИО" name="fio" value={userFormData.fio || ''} onChange={handleInputChange} disabled={!isEditingProfile} />
            <Input label="Email" name="email" type="email" value={userFormData.email || ''} onChange={handleInputChange} disabled={!isEditingProfile} />
            <Input label="Телефон" name="phone" type="tel" value={userFormData.phone || ''} onChange={handleInputChange} disabled={!isEditingProfile} />
            {isEditingProfile && <Button variant="primary" onClick={handleProfileSave} leftIcon={<Save size={18}/>}>Сохранить изменения</Button>}
          </div>
        );
      case AccountSection.Addresses:
        return (
          <div className="space-y-6">
             <h2 className="text-2xl font-semibold">Адрес доставки</h2>
             <Input label="Улица, дом, квартира" name="address.street" value={userFormData.address?.street || ''} onChange={handleInputChange} />
             <Input label="Город" name="address.city" value={userFormData.address?.city || ''} onChange={handleInputChange} />
             <Input label="Почтовый индекс" name="address.zip" value={userFormData.address?.zip || ''} onChange={handleInputChange} />
             <Input label="Страна" name="address.country" value={userFormData.address?.country || ''} onChange={handleInputChange} />
             <Button variant="primary" onClick={() => updateUser(userFormData as UserType)} leftIcon={<Save size={18}/>}>Сохранить адрес</Button>
          </div>
        );
      case AccountSection.PaymentMethods:
        return (
            <div>
                <h2 className="text-2xl font-semibold mb-4">Способы оплаты</h2>
                <div className="bg-slate-700 p-6 rounded-xl text-center">
                    <CreditCard size={48} className="mx-auto text-brand-muted mb-4"/>
                    <p className="text-brand-muted">Управление способами оплаты будет доступно в ближайшее время.</p>
                    <p className="text-sm text-brand-muted mt-2">Пока что все заказы будут оформляться с "Оплата при получении" или мок-картой.</p>
                </div>
            </div>
        );
      case AccountSection.Orders:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Мои заказы</h2>
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="bg-slate-700 p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="text-lg font-semibold text-brand-light">Заказ #{order.id.substring(0,8)}</h3>
                            <p className="text-sm text-brand-muted">Дата: {new Date(order.orderDate).toLocaleDateString('ru-RU')}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' : order.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                            {order.status === 'Processing' ? 'В обработке' : order.status === 'Shipped' ? 'Отправлен' : order.status === 'Delivered' ? 'Доставлен' : 'Отменен'}
                        </span>
                    </div>
                    <ul className="space-y-2 mb-3">
                      {order.items.map(item => (
                        <li key={item.id} className="flex justify-between items-center text-sm">
                          <span>{item.name} (x{item.quantity})</span>
                          <span className="text-brand-light">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-slate-600 pt-3">
                        <p className="text-right font-semibold text-brand-light">Итого: {order.totalAmount.toLocaleString('ru-RU')} ₽</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-700 rounded-2xl">
                <Package size={48} className="mx-auto text-brand-muted mb-4"/>  
                <p className="text-brand-muted">У вас пока нет заказов.</p>
                <Button variant="primary" size="sm" onClick={() => navigate('/products')} className="mt-4">Начать покупки</Button>
              </div>
            )}
          </div>
        );
      case AccountSection.Settings:
        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Сменить пароль</h2>
                    <Input label="Новый пароль" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Минимум 6 символов"/>
                    <Input label="Подтвердите новый пароль" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="mt-4"/>
                    {passwordChangeMessage && <p className={`mt-2 text-sm ${passwordChangeMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{passwordChangeMessage.text}</p>}
                    <Button variant="primary" onClick={handleChangePassword} className="mt-4" disabled={!newPassword || !confirmNewPassword}>Сменить пароль</Button>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Удалить аккаунт</h2>
                    <p className="text-brand-muted mb-3">Это действие необратимо. Все ваши данные, включая историю заказов, будут удалены.</p>
                    <Button variant="danger" onClick={handleDeleteAccount}>Удалить мой аккаунт</Button>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  const menuItems = [
    { id: AccountSection.Profile, label: 'Личные данные', icon: User },
    { id: AccountSection.Orders, label: 'Мои заказы', icon: ShoppingBag },
    { id: AccountSection.Addresses, label: 'Адреса', icon: MapPinIcon },
    { id: AccountSection.PaymentMethods, label: 'Способы оплаты', icon: CreditCard },
    { id: AccountSection.Settings, label: 'Настройки', icon: Settings },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-brand-light mb-10">Мой аккаунт</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="bg-brand-surface p-6 rounded-2xl shadow-xl space-y-2 sticky top-24">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {setActiveSection(item.id); navigate(`/account?section=${item.id}`)}}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeSection === item.id ? 'bg-brand-purple text-white shadow-md' : 'text-brand-light hover:bg-slate-700'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
            <Button variant="ghost" onClick={() => { logoutUser(); navigate('/'); }} className="w-full !text-red-400 hover:!bg-red-500/10 justify-start" leftIcon={<LogOut size={20}/>}>
                Выйти
            </Button>
          </div>
        </aside>
        <main className="md:col-span-3 bg-brand-surface p-8 rounded-2xl shadow-xl">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default AccountPage;