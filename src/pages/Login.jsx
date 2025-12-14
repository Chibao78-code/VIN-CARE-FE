import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiArrowLeft, FiHome } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
// trang dang nhap
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();
  const returnUrl = location.state?.returnUrl;
   // form hook
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  });
  
  useEffect(() => {
    // kiểm tra nếu đến từ thanh toán thành công
    const paymentSuccess = sessionStorage.getItem('paymentSuccess');
    if (paymentSuccess === 'true') {
      toast.success('Thanh toán thành công! Vui lòng đăng nhập.');
      sessionStorage.removeItem('paymentSuccess');
    }
  }, []);
  
  const onSubmit = async (data) => {
    const result = await login(data);
    
    if (result.success) {
      toast.success('Đăng nhập thành công!');
      
      // kiểm tra nếu đến từ thanh toán thành công
      const paymentSuccess = sessionStorage.getItem('paymentSuccess');
      if (paymentSuccess === 'true') {
        toast.success('Chào mừng bạn! Lịch hẹn của bạn đã được xác nhận.');
        sessionStorage.removeItem('paymentSuccess');
      }
      
      // nếu có return URL (ví dụ: từ thanh toán), điều hướng đến đó
      if (returnUrl) {
        navigate(returnUrl, { replace: true });
        return;
      }
      
      //  điều hướng theo vai trò người dùng
      const userRole = result.user?.role || 'CUSTOMER';
      
      switch(userRole) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'STAFF':
          navigate('/staff/dashboard');
          break;
        case 'TECHNICIAN':
          navigate('/technician/dashboard');
          break;
        case 'CUSTOMER':
        default:
          navigate('/app/dashboard');
          break;
      }
    } else {
      toast.error(result.error || 'Đăng nhập thất bại');
    }
  };
  // hiển thị trang đăng nhập
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-xl mb-4">
            <span className="text-white font-bold text-2xl">EV</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Đăng nhập</h1>
          <p className="mt-2 text-gray-600">
            Chào mừng bạn đến với EV Service
          </p>
        </div>
        
        <Card className="p-8">
          {returnUrl && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-semibold mb-1">
                ✅ Thanh toán thành công!
              </p>
              <p className="text-xs text-green-600">
                Vui lòng đăng nhập để xem lịch hẹn của bạn.
              </p>
            </div>
          )}
          
          
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email"
              type="email"
              icon={<FiMail />}
              placeholder="your@email.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Vui lòng nhập email',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email không hợp lệ'
                }
              })}
            />
            
            <Input
              label="Mật khẩu"
              type="password"
              icon={<FiLock />}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', {
                required: 'Vui lòng nhập mật khẩu',
                minLength: {
                  value: 6,
                  message: 'Mật khẩu phải có ít nhất 6 ký tự'
                }
              })}
            />
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  {...register('remember')}
                />
                <span className="ml-2 text-sm text-gray-700">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Quên mật khẩu?
              </Link>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={isLoading}
            >
              Đăng nhập
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                </span>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                </Link>
              </p>
            </div>
          </div>
        </Card>
        <div className="mt-6 text-center space-y-3">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-800 inline-flex items-center transition-colors"
          >
            <FiHome className="mr-2" />
            Về trang chủ
          </Link>
          
          <p className="text-xs text-gray-500">
            Cần hỗ trợ? Liên hệ{' '}
            <a href="mailto:support@evservice.com" className="text-primary-600 hover:text-primary-700">
              support@evservice.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;