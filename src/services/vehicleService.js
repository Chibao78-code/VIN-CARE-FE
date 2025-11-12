import api from './api';

export const vehicleService = {
  // Lấy danh sách xe của customer đang đăng nhập
  getMyVehicles: async () => {
    const response = await api.get('/me/vehicles');
    return response; // api interceptor already returns response.data
  },

  // Test endpoint - lấy xe theo phone
  getVehiclesByPhone: async (phone) => {
    const response = await api.get(`/vehicles/test/${phone}`);
    return response; // api interceptor already returns response.data
  },
};

export default vehicleService;
