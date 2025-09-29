import api from './api';
export const authService = {
  // dang nhap
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response;
  },
  
  // dang ky
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },
  
  // dang xuat
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response;
  },
  
  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response;
  },
  
  // lam moi token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response;
  },
  
  /**
   * Gui email reset password
   * @param {string} email - email nguoi dung
   * @returns {Promise} response tu server
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },
  
  /**
   * Reset password voi token
   * @param {string} token - reset token tu email
   * @param {string} newPassword - mat khau moi
   * @returns {Promise} response tu server
   */
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        password: newPassword,
      });
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },
  
  // doi mat khau
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response;
  },
  
  // xac thuc email
  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token });
    return response;
  },
  
  /**
   * Gui lai email verification
   * @returns {Promise} response tu server
   */
  resendVerificationEmail: async () => {
    try {
      const response = await api.post('/auth/resend-verification');
      return response;
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  },
  
  /**
   * Kiem tra reset token co hop le khong
   * @param {string} token - reset token
   * @returns {Promise} response tu server
   */
  verifyResetToken: async (token) => {
    try {
      const response = await api.get(`/auth/verify-reset-token/${token}`);
      return response;
    } catch (error) {
      console.error('Verify token error:', error);
      throw error;
    }
  },
};