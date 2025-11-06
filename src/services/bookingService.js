import api from './api';

/**
 * Booking Service
 * Handles all booking related API calls
 */

const bookingService = {
  /**
   * Create a new booking
   * @param {Object} bookingData - { eVId, centerId, bookingDate, bookingTime, offerTypeId, packageId, problemDescription, notes }
   * @returns {Promise} - BookingResponseDTO
   */
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

  /**
   * Get available time slots for a specific center and date
   * @param {number} centerId - Service center ID
   * @param {string} date - Date in format YYYY-MM-DD
   * @returns {Promise} - TimeSlotResponseDTO
   */
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

  /**
   * Get all offer types (service types)
   * @returns {Promise} - List<OfferTypeDTO>
   */
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

  /**
   * Get all bookings (for technician, staff, admin)
   * @returns {Promise} - List of all bookings
   */
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

  /**
   * Get customer's bookings
   * @param {string} status - 'upcoming', 'completed', 'cancelled', or 'all'
   * @returns {Promise} - List of bookings
   */
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

  /**
   * Get booking details by ID
   * @param {number} bookingId - Booking ID
   * @returns {Promise} - Booking details
   */
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

  /**
   * Cancel a booking
   * @param {number} bookingId - Booking ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise}
   */
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

  /**
   * Reschedule a booking
   * @param {number} bookingId - Booking ID
   * @param {Object} newSchedule - { bookingDate, bookingTime }
   * @returns {Promise}
   */
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

  // ======================
  // STAFF WORKFLOW METHODS
  // ======================
  
  /**
   * Get bookings by status
   * @param {string} status - PENDING, APPROVED, ASSIGNED, IN_PROGRESS, COMPLETED, REJECTED, CANCELLED
   * @returns {Promise}
   */
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

  /**
   * Staff approve booking
   * @param {number} bookingId
   * @returns {Promise}
   */
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

  /**
   * Staff reject booking
   * @param {number} bookingId
   * @param {string} reason
   * @returns {Promise}
   */
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

  /**
   * Staff assign technician to booking
   * @param {number} bookingId
   * @param {number} technicianId
   * @returns {Promise}
   */
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

  /**
   * Get technician's assigned bookings
   * @param {number} technicianId
   * @returns {Promise}
   */
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

  /**
   * Get all technicians for staff to assign
   * @returns {Promise}
   */
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
  },
  
  /**
   * Get booking statistics
   * @returns {Promise} Statistics with counts by status
   */
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
  }
};

export default bookingService;
