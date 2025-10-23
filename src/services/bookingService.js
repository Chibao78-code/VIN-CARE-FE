import api from './api';
// Dịch vụ đặt lịch
const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const payload = {
        eVId: bookingData.eVId || bookingData.vehicleId,
        centerId: bookingData.centerId,
        bookingDate: bookingData.bookingDate || bookingData.date,
        bookingTime: bookingData.bookingTime || bookingData.time,
        offerTypeId: bookingData.offerTypeId || null,
        packageId: bookingData.packageId || null,
        problemDescription: bookingData.problemDescription || null,
        notes: bookingData.notes || null
      };
      // Debug log payload
      console.log('📤 Sending booking payload to backend:', payload);
      const response = await api.post('/bookings', payload);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tạo booking'
      };
    }
  },
  // Lấy danh sách khung giờ có sẵn cho trung tâm và ngày đã chọn
  getAvailableTimeSlots: async (centerId, date) => {
    try {
      const response = await api.get(`/bookings/${centerId}/${date}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách time slots'
      };
    }
  },
  // Lấy danh sách loại dịch vụ
  getOfferTypes: async () => {
    try {
      const response = await api.get('/offer-types');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách dịch vụ'
      };
    }
  },
  // Lấy tất cả booking (admin)
  getAllBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách booking'
      };
    }
  },
  // Lấy booking của người dùng hiện tại
  getMyBookings: async (status = 'all') => {
    try {
      const endpoint = status === 'all' 
        ? '/bookings/my' 
        : `/bookings/my?status=${status}`;
      
      const response = await api.get(endpoint);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách booking'
      };
    }
  },
  // Lấy chi tiết booking theo ID
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy thông tin booking'
      };
    }
  },
  // huy booking
  cancelBooking: async (bookingId, reason) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`, { reason });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể hủy booking'
      };
    }
  },
  // doi lich booking
  rescheduleBooking: async (bookingId, newSchedule) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/reschedule`, newSchedule);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể đổi lịch booking'
      };
    }
  },
  // Lấy danh sách booking theo trạng thái (admin)
  getBookingsByStatus: async (status) => {
    try {
      const response = await api.get(`/bookings/status/${status}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách booking'
      };
    }
  },
  // Duyệt booking
  approveBooking: async (bookingId) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/approve`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể duyệt booking'
      };
    }
  },
  // cancell booking
  rejectBooking: async (bookingId, reason) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/reject`, reason);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể từ chối booking'
      };
    }
  },
  // Phân công technician cho booking
  assignTechnician: async (bookingId, technicianId) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/assign?technicianId=${technicianId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể phân công technician'
      };
    }
  },
  // Lấy danh sách công việc của technician
  getTechnicianBookings: async (technicianId) => {
    try {
      const response = await api.get(`/bookings/technician/${technicianId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách công việc'
      };
    }
  },
  // Lấy danh sách technician
  getTechnicians: async () => {
    try {
      const response = await api.get('/technicians');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách technician'
      };
    }
  }
};

export default bookingService;
