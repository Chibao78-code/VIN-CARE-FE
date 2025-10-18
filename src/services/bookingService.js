import api from './api';
const bookingService = {
   // tao moi booking
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
  //check xem khung gio con trong ko
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
// check xem co loai dich vu nao available khong
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
// lay tat ca booking
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
// lay booking cua minh
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
// lay booking theo id
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
  }
};

export default bookingService;
