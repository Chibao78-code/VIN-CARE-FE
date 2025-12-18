import api from './api';

const bookingService = {
// Tạo booking mới
  createBooking: async (bookingData) => {
    try {
      // Chuẩn bị payload với các trường cần thiết
      const payload = {
        eVId: bookingData.eVId || bookingData.vehicleId,
        centerId: bookingData.centerId,
        bookingDate: bookingData.bookingDate || bookingData.date,
        bookingTime: bookingData.bookingTime || bookingData.time,
        customerName: bookingData.customerName || null,
        customerPhone: bookingData.customerPhone || null,
        customerEmail: bookingData.customerEmail || null,
        customerAddress: bookingData.customerAddress || null,
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
// Lay danh sach khung gio trong ngay cho trung tam
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
// Lay loai dich vu (offer types)
  getOfferTypes: async () => {
    try {
      const response = await api.get('/receptions/offer-types');
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
// Lay tat ca booking (staff only)
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
// Lay booking cua khach hang dang dang nhap
  getMyBookings: async (status = 'all') => {
    try {
      const endpoint = status === 'all' 
        ? '/customers/my-bookings' 
        : `/customers/my-bookings?status=${status}`;
      
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
// Lay booking theo id
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
// Gui yeu cau huy booking
  requestCancellation: async (bookingId, reason) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/request-cancel`, reason || '');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể gửi yêu cầu hủy'
      };
    }
  },
// Chap thuan yeu cau huy booking
  approveCancellation: async (bookingId) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/approve-cancel`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể chấp thuận hủy'
      };
    }
  },
// Tu choi yeu cau huy booking
  rejectCancellation: async (bookingId, reason) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/reject-cancel`, reason || '');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể từ chối hủy'
      };
    }
  },
// Huy booking
  cancelBooking: async (bookingId, reason) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`, reason || '');
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

// Doi lich booking
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
// Lay booking theo trang thai
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
// Phan cong technician cho booking
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

// Lay danh sach booking cua ky thuat vien
  getTechnicianBookings: async (technicianId) => {
    try {
      // Use receptions endpoint instead of bookings
      const response = await api.get(`/receptions/technician/${technicianId}`);
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
// Lay tat ca technician
  getTechnicians: async () => {
    try {
      const response = await api.get('/employees/technicians');
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
  },
// Lay technician theo trung tam
  getTechniciansByCenter: async (centerId) => {
    try {
      const response = await api.get(`/employees/technicians/center/${centerId}`);
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
  },
// Lay technician cua trung tam dang dang nhap
  getMyTechnicians: async () => {
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await api.get(`/employees/technicians/my-center?_t=${timestamp}`);
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
  },
// Lay thong ke booking
  getBookingStatistics: async () => {
    try {
      const response = await api.get('/bookings/statistics');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy thống kê booking'
      };
    }
  },
// Lay cac khung gio booking cua trung tam dang dang nhap
  getMyBookingSlots: async (date = null) => {
    try {
      const dateParam = date ? `?date=${date}` : '';
      const response = await api.get(`/bookings/my-center/slots${dateParam}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy thông tin booking slots'
      };
    }
  },
// Tao thanh toan dat coc cho booking
  createDepositPayment: async (bookingId) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/create-deposit-payment`);
      return {
        success: true,
        paymentUrl: response.paymentUrl,
        depositAmount: response.depositAmount,
        depositPolicy: response.depositPolicy,
        invoiceNumber: response.invoiceNumber
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tạo thanh toán đặt cọc'
      };
    }
  },
// Tiep nhan xe
  receiveVehicle: async (bookingId, receptionData) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/receive`, receptionData);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tiếp nhận xe'
      };
    }
  }
};

export default bookingService;
