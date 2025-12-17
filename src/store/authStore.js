import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants/config';
import { authService } from '../services/authService';
// goi api
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,
      // dang nhap 
      login: async (credentials) => {
        console.log('🔑 Starting login...');
        set({ isLoading: true });
        try {
          // Goi API backend thuc
          console.log('📡 Calling authService.login...');
          const response = await authService.login({
            username: credentials.email,
            password: credentials.password
          });
           // log ket qua nhan duoc
          console.log('✅ Login response received:', {
            hasToken: !!response.token,
            hasUser: !!response.user,
            tokenPreview: response.token ? response.token.substring(0, 20) + '...' : null
          });
          
          // Lưu token vào localStorage
          console.log('💾 Saving to localStorage...');
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
          
          // Xác minh đã lưu
          const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
          const savedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
          console.log('✅ Verified localStorage save:', {
            tokenSaved: !!savedToken,
            userSaved: !!savedUser,
            keys: Object.keys(STORAGE_KEYS)
          });
          // Cập nhật trạng thái xác thực trong store
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          console.log('✅ Auth store updated');
           // tra ve ket qua thanh cong
          return { success: true, user: response.user };
        } catch (error) {
          console.error('❌ Login failed:', error);
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || error.message || 'Đăng nhập thất bại'
          };
        }
      },
       // dang xuat
      logout: async () => {
        console.log('🚪 Starting logout...');
        try {
          // Goi API backend de blacklist token
          await authService.logout();
          console.log('✅ Logout API call successful');
        } catch (error) {
          console.error('⚠️ Logout API call failed (continuing with local logout):', error);
          // Tiếp tục đăng xuất cục bộ ngay cả khi gọi API thất bại
        }
        
        // Xóa localStorage
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        // Xác minh đã xóa
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        
        console.log('✅ Logout completed');
      },
    // cap nhat thong tin nguoi dung
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
      // kiem tra da dang nhap chua
      checkAuth: () => {
        const state = get();
        return state.isAuthenticated && state.token;
      },
      
      // Khởi tạo xác thực từ localStorage nếu có
      initializeAuth: () => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userDataStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        // log thong tin khoi tao
        console.log('📝 Initializing auth from localStorage:', {
          hasToken: !!token,
          hasUserData: !!userDataStr,
          token: token ? token.substring(0, 20) + '...' : null
        });
        // neu co thi dat lai trang thai dang nhap
        if (token && userDataStr) {
          try {
            const user = JSON.parse(userDataStr);
            console.log('✅ Setting auth state:', { user: user.email || user.phone, isAuthenticated: true });
            set({
              user,
              token,
              isAuthenticated: true,
              _hasHydrated: true
            });
            return true;
          } catch (error) {
            console.error('❌ Failed to parse user data:', error);
            return false;
          }
        }
        
        console.log('❌ No auth data found in localStorage');
        return false;
      },
    }),
    // cau hinh persist
    {
      name: 'ev_auth_state',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('💧 Zustand rehydrated:', state);
        if (state) {
          state._hasHydrated = true;
          console.log('🔑 Auth state after rehydration:', {
            isAuthenticated: state.isAuthenticated,
            hasToken: !!state.token,
            hasUser: !!state.user
          });
        }
      },
    }
  )
);
export default useAuthStore;
