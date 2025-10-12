import api from './api';

/**
 * Booking Service
 * Handles all booking related API calls
 */

const bookingService = {
  /**
   * Create a new booking
   * @param {Object} bookingData - { eVId, centerId, bookingDate, bookingTime }
   * @returns {Promise} - BookingResponseDTO
   */
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', {
        eVId: bookingData.vehicleId || bookingData.eVId,
        centerId: bookingData.centerId,
        bookingDate: bookingData.date || bookingData.bookingDate, // Format: YYYY-MM-DD
        bookingTime: bookingData.time || bookingData.bookingTime  // Format: HH:mm:ss
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
  }
};

export default bookingService;
