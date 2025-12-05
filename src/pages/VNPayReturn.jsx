import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'failed'
  const [message, setMessage] = useState('Đang xác thực thanh toán...');
  const [authChecked, setAuthChecked] = useState(false);
  
  // Initialize xac thuc state
  useEffect(() => {
    const hasAuth = initializeAuth();
    setAuthChecked(true);
    console.log('🔑 Auth initialized:', hasAuth, 'isAuthenticated:', isAuthenticated);
  }, [initializeAuth]);

  useEffect(() => {
    // Wait for xac thuc state 
    if (!authChecked) {
      return;
    }
    
    const verifyPayment = async () => {
      try {
        //  Chuẩn bị query string từ search params
        const queryString = searchParams.toString();
        
        console.log('🔍 Verifying VNPay payment:', queryString);
        
        //  log cho debug
        const paramsObj = Object.fromEntries(searchParams.entries());
        console.log('📋 VNPay params:', paramsObj);
        console.log('💳 Response Code:', paramsObj.vnp_ResponseCode);

        //  goi be xac thuc thanh toan
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/vnpay/return?${queryString}`);
        const data = await response.json();

        console.log('✅ Payment verification result:', data);
        console.log('👉 Success:', data.success);
        console.log('👉 Message:', data.message);

        if (data.success) {
          setStatus('success');
          setMessage('Thanh toán thành công! Đặt lịch của bạn đã được xác nhận.');
          
          // Lấy booking data từ localStorage
          const pendingBooking = sessionStorage.getItem('pendingBooking');
          
          if (pendingBooking) {
            const bookingData = JSON.parse(pendingBooking);
            
            //  Lưu booking vào localStorage 
            const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            existingBookings.push({
              ...bookingData,
              status: 'confirmed',
              paidAt: new Date().toISOString()
            });
            localStorage.setItem('bookings', JSON.stringify(existingBookings));
            
            // Lưu booking data để hiển thị modal
            sessionStorage.setItem('paymentSuccessBooking', pendingBooking);
            sessionStorage.removeItem('pendingBooking');
          }

          toast.success('Thanh toán thành công!');
          
          // chuyen trang ve trang xe da dat
          if (isAuthenticated) {
            navigate('/app/vehicles?paymentSuccess=true');
          } else {
            sessionStorage.setItem('paymentSuccess', 'true');
            navigate('/login', { state: { returnUrl: '/app/vehicles?paymentSuccess=true' } });
          }
        } else {
          setStatus('failed');
          setMessage(data.message || 'Thanh toán không thành công. Vui lòng thử lại.');
          toast.error('Thanh toán thất bại');
          
          // chuyen trang ve trang xe da dat sau 5s
          setTimeout(() => {
            if (isAuthenticated) {
              navigate('/app/my-bookings');
            } else {
              navigate('/login', { state: { returnUrl: '/app/my-bookings' } });
            }
          }, 5000);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage('Có lỗi xảy ra khi xác thực thanh toán. Vui lòng liên hệ hỗ trợ.');
        toast.error('Lỗi xác thực thanh toán');
        // chuyen trang ve trang xe da dat sau 5s
        setTimeout(() => {
          if (isAuthenticated) {
            navigate('/app/my-bookings');
          } else {
            navigate('/login', { state: { returnUrl: '/app/my-bookings' } });
          }
        }, 5000);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, isAuthenticated, authChecked]);
  // hien thi trang ket qua thanh toan
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <Loader className="w-16 h-16 text-blue-600 mx-auto animate-spin mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Đang xử lý thanh toán
              </h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Thanh toán thành công!
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800">
                  Đặt cọc <strong>200,000đ</strong> đã được xác nhận.
                </p>
                <p className="text-xs text-green-700 mt-2">
                  Lịch hẹn của bạn đã được xác nhận. Vui lòng đến đúng giờ và mang theo giấy tờ xe.
                </p>
              </div>
              
              {/* Workflow Steps */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4 text-sm">Quy trình tiếp theo</h4>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center mb-2">
                      ✓
                    </div>
                    <span className="text-xs text-gray-600">Đã gửi</span>
                  </div>

                  <div className="flex-1 h-0.5 bg-green-400 mx-2"></div>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center mb-2">
                      ✓
                    </div>
                    <span className="text-xs text-gray-600">Chờ thanh toán</span>
                  </div>

                  <div className="flex-1 h-0.5 bg-green-400 mx-2"></div>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center mb-2">
                      ✓
                    </div>
                    <span className="text-xs text-gray-600">Hoàn thành</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                {isAuthenticated ? (
                  <>
                    <p className="text-sm text-gray-500 mb-3">
                      Bạn sẽ được chuyển đến trang lịch hẹn trong 3 giây...
                    </p>
                    <button
                      onClick={() => navigate('/app/my-bookings')}
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Xem lịch hẹn ngay
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500 mb-3">
                      Vui lòng đăng nhập để xem lịch hẹn của bạn...
                    </p>
                    <button
                      onClick={() => navigate('/login', { state: { returnUrl: '/app/my-bookings' } })}
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Đăng nhập ngay
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Thanh toán thất bại
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800">
                  Booking của bạn chưa được xác nhận do thanh toán không thành công.
                </p>
              </div>
              <button
                onClick={() => isAuthenticated ? navigate('/app/my-bookings') : navigate('/login', { state: { returnUrl: '/app/my-bookings' } })}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Quay về trang lịch hẹn
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VNPayReturn;
