import api from './api';
const serviceCenterService = {
  // Lấy tất cả trung tâm dịch vụ
  getAllCenters: async () => {
    try {
      const response = await api.get('/centers');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Get centers error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tải danh sách trung tâm'
      };
    }
  },
  // Lấy thông tin chi tiết trung tâm theo ID
  getCenterById: async (centerId) => {
    try {
      const response = await api.get(`/centers/${centerId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tải thông tin trung tâm'
      };
    }
  }
};

export default serviceCenterService;
