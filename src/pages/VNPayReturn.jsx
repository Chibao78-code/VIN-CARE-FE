import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'failed'
  const [message, setMessage] = useState('Đang xác thực thanh toán...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Lấy tất cả query params từ VNPay
        const queryString = searchParams.toString();
        
        console.log('🔍 Verifying VNPay payment:', queryString);
        
        // Log individual params
        const paramsObj = Object.fromEntries(searchParams.entries());
        console.log('📋 VNPay params:', paramsObj);
        console.log('💳 Response Code:', paramsObj.vnp_ResponseCode);

        // Gọi backend verify payment
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vnpay/return?${queryString}`);
        const data = await response.json();

        console.log('✅ Payment verification result:', data);
        console.log('👉 Success:', data.success);
        console.log('👉 Message:', data.message);

        if (data.success) {
          setStatus('success');
          setMessage('Thanh toán thành công! Đặt lịch của bạn đã được xác nhận.');
          
          // Lấy booking data từ sessionStorage
          const pendingBooking = sessionStorage.getItem('pendingBooking');
          
          if (pendingBooking) {
            const bookingData = JSON.parse(pendingBooking);
            
            // Lưu vào localStorage để tracking
            const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            existingBookings.push({
              ...bookingData,
              status: 'confirmed',
              paidAt: new Date().toISOString()
            });
            localStorage.setItem('bookings', JSON.stringify(existingBookings));
            
            // Xóa pending booking
            sessionStorage.removeItem('pendingBooking');
          }

          toast.success('Thanh toán thành công!');
          
          // Redirect sau 3 giây
          setTimeout(() => {
            navigate('/my-bookings');
          }, 3000);
        } else {
          setStatus('failed');
          setMessage(data.message || 'Thanh toán không thành công. Vui lòng thử lại.');
          toast.error('Thanh toán thất bại');
          
          // Redirect về trang chủ sau 5 giây
          setTimeout(() => {
            navigate('/');
          }, 5000);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage('Có lỗi xảy ra khi xác thực thanh toán. Vui lòng liên hệ hỗ trợ.');
        toast.error('Lỗi xác thực thanh toán');
        
        setTimeout(() => {
          navigate('/');
        }, 5000);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

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
                  Chúng tôi chỉ giữ chỗ cho bạn trong 15 phút. Nếu đến sau thời gian đó, chúng tôi không có trách nhiệm hoàn tiền.
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Đang chuyển đến trang quản lý lịch hẹn...
              </p>
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
                onClick={() => navigate('/')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Quay về trang chủ
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VNPayReturn;
