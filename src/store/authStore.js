import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants/config';
import { authService } from '../services/authService';
// call api tu be 
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          // call api tu be 
          const response = await authService.login({
            username: credentials.email, // be chap nhan username or email
            password: credentials.password
          });
          
          // luu token vao may local user
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return { success: true, user: response.user };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || error.message || 'Đăng nhập thất bại'
          };
        }
      },
      
      logout: () => {
        // dang xuat thi xoa token va user data
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
      
      checkAuth: () => {
        const state = get();
        return state.isAuthenticated && state.token;
      },
    }),
    {
      name: 'ev_auth_state', // Tên key trong localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
export default useAuthStore;
