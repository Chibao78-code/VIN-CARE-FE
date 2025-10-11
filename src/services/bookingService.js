import api from './api';
const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', {
        eVId: bookingData.vehicleId || bookingData.eVId,
        centerId: bookingData.centerId,
        bookingDate: bookingData.date || bookingData.bookingDate, // nam/thang/ngay
        bookingTime: bookingData.time || bookingData.bookingTime  // gio
      });
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
//lay du lieu slot sua xe chong tai trung tam
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
//loai dich vu khach hang chon
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
//lay danh sach booking tu khach hang
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
//lay thong tin chi tiet booking
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
//huy book
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
//doi lich booking
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
  }
};

export default bookingService;
