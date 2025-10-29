
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { AuthMode, User } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, Lock, User as UserIcon, Phone } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.Login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fio, setFio] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (context?.currentUser) {
        const params = new URLSearchParams(location.search);
        const redirectPath = params.get('redirect') || '/account';
        navigate(redirectPath);
    }
  }, [context?.currentUser, navigate, location.search]);

  if (!context) return <div className="container mx-auto p-4 text-center">Загрузка...</div>;
  const { loginUser, registerUser } = context;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (mode === AuthMode.Login) {
      const success = loginUser(email, password);
      if (success) {
        const params = new URLSearchParams(location.search);
        const redirectPath = params.get('redirect') || '/account';
        navigate(redirectPath);
      } else {
        setError('Неверный email или пароль.');
      }
    } else { // Register mode
      if (password !== confirmPassword) {
        setError('Пароли не совпадают.');
        setIsLoading(false);
        return;
      }
      if (!fio.trim() || !email.trim()) {
        setError('Пожалуйста, заполните Имя и Email.');
        setIsLoading(false);
        return;
      }
      const userData: Omit<User, 'id'> = { fio, email, phone };
      const success = registerUser(userData);
      if (success) {
        navigate('/account'); // Redirect to account page after registration
      } else {
        setError('Ошибка регистрации. Возможно, такой пользователь уже существует.');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-dark via-slate-800 to-brand-purple py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-brand-surface p-10 rounded-2xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
            {mode === AuthMode.Login ? 'Вход в аккаунт' : 'Создание аккаунта'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {mode === AuthMode.Register && (
            <Input 
              label="ФИО" 
              id="fio" 
              type="text" 
              value={fio} 
              onChange={(e) => setFio(e.target.value)} 
              placeholder="Иванов Иван Иванович"
              IconComponent={UserIcon} 
              required 
            />
          )}
          <Input 
            label="Email адрес" 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="you@example.com"
            IconComponent={Mail} 
            required 
          />
          {mode === AuthMode.Register && (
             <Input 
              label="Номер телефона (необязательно)" 
              id="phone" 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="+7 (999) 123-45-67"
              IconComponent={Phone}
            />
          )}
          <Input 
            label="Пароль" 
            id="password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
            IconComponent={Lock} 
            required 
          />
          {mode === AuthMode.Register && (
            <Input 
              label="Подтвердите пароль" 
              id="confirmPassword" 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="••••••••"
              IconComponent={Lock} 
              required 
            />
          )}

          {error && <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">{error}</p>}

          <div>
            <Button type="submit" variant="primary" className="w-full" size="lg" isLoading={isLoading}>
              {mode === AuthMode.Login ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </div>
        </form>
        <div className="text-sm text-center">
          <button
            onClick={() => {
              setMode(mode === AuthMode.Login ? AuthMode.Register : AuthMode.Login);
              setError(null); // Clear errors when switching mode
            }}
            className="font-medium text-brand-pink hover:text-pink-400 transition-colors"
          >
            {mode === AuthMode.Login ? 'Еще нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
