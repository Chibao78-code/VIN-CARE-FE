import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ForgotPasswordFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // gui otp
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/password/forgot`, {
        email: email
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setTimeout(() => setStep(2), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi mã OTP. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // xac thuc otp
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/password/verify-otp`, {
        email: email,
        otpCode: otpCode
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setTimeout(() => setStep(3), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Mã OTP không hợp lệ.');
    } finally {
      setLoading(false);
    }
  };

  // doi mk moi
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/password/reset`, {
        email: email,
        otpCode: otpCode,
        newPassword: newPassword
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể đặt lại mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quên mật khẩu</h2>
          <p className="text-gray-600">
            {step === 1 && 'Nhập email của bạn để nhận mã OTP'}
            {step === 2 && 'Nhập mã OTP đã được gửi đến email'}
            {step === 3 && 'Nhập mật khẩu mới của bạn'}
          </p>
        </div>
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              step >= 1 ? 'bg-indigo-600 text-white scale-110' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 transition-all ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              step >= 2 ? 'bg-indigo-600 text-white scale-110' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 transition-all ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              step >= 3 ? 'bg-indigo-600 text-white scale-110' : 'bg-gray-300 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded animate-shake">
              <p className="font-medium">❌ {error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded animate-pulse">
              <p className="font-medium">✅ {success}</p>
            </div>
          )}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  📧 Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="dinhdinhchibao@gmail.com"
                  required
                  disabled={loading}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Nhập email bạn đã đăng ký với hệ thống
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang gửi...
                  </span>
                ) : (
                  '📤 Gửi mã OTP'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                >
                  ← Quay lại đăng nhập
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-center">
                  🔐 Nhập mã OTP (6 số)
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-3xl tracking-widest font-mono font-bold transition"
                  placeholder="• • • • • •"
                  maxLength="6"
                  required
                  disabled={loading}
                />
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 text-center">
                    📬 Mã OTP đã được gửi đến <br/>
                    <strong className="text-blue-900">{email}</strong>
                  </p>
                  <p className="text-xs text-blue-600 text-center mt-1">
                    ⏱️ Mã có hiệu lực trong 5 phút
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading ? '⏳ Đang xác thực...' : '✓ Xác nhận OTP'}
              </button>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-600 hover:text-gray-800 font-medium transition"
                >
                  ← Quay lại
                </button>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                >
                  🔄 Gửi lại OTP
                </button>
              </div>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  🔑 Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  required
                  disabled={loading}
                  minLength="6"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  🔑 Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  disabled={loading}
                  minLength="6"
                />
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">⚠️ Mật khẩu không khớp</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading ? '⏳ Đang đặt lại...' : '✓ Đặt lại mật khẩu'}
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-gray-600 mt-6 text-sm">
          © 2025 EV Service System
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordFlow;
