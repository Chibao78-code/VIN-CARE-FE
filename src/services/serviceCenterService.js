import api from './api';
const serviceCenterService = {
  //lay tat ca data trung tam 
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
 // lat data trung tam theo id
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
