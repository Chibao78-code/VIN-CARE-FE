import { useState } from 'react';
import { Search, User, Calendar, Clock, Car, MapPin, Phone, Mail, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const StaffBookingSearch = () => {
  const [bookingCode, setBookingCode] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const [assigning, setAssigning] = useState(false);

  // Tìm kiếm booking
  const handleSearch = async () => {
    if (!bookingCode.trim()) {
      toast.error('Vui lòng nhập mã booking');
      return;
    }
    // Tìm booking theo mã
    setLoading(true);
    try {
      const response = await api.get(`/bookings/${bookingCode}`);
      console.log('📋 Booking found:', response);
      setBooking(response);
      toast.success('Tìm thấy booking!');
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Không tìm thấy booking với mã: ' + bookingCode);
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  // Load danh sách technician
  const loadTechnicians = async () => {
    try {
      const response = await api.get('/technicians');
      setTechnicians(response);
    } catch (error) {
      console.error('Load technicians error:', error);
      toast.error('Không thể tải danh sách kỹ thuật viên');
    }
  };

  // Mở modal phân công
  const openAssignModal = () => {
    if (booking.status === 'ASSIGNED' || booking.status === 'IN_PROGRESS' || booking.status === 'COMPLETED') {
      toast.error('Booking này đã được phân công hoặc hoàn thành');
      return;
    }
    loadTechnicians();
    setShowAssignModal(true);
  };

  // Phân công technician
  const handleAssign = async () => {
    if (!selectedTech) {
      toast.error('Vui lòng chọn kỹ thuật viên');
      return;
    }

    setAssigning(true);
    try {
      // Approve booking trước
      await api.post(`/bookings/${booking.bookingId}/approve`);
      
      // Sau đó assign technician
      await api.post(`/bookings/${booking.bookingId}/assign?technicianId=${selectedTech}`);
      
      toast.success('Phân công thành công!');
      setShowAssignModal(false);
      
      // Refresh booking data
      handleSearch();
    } catch (error) {
      console.error('Assign error:', error);
      toast.error('Không thể phân công: ' + (error.response?.data || error.message));
    } finally {
      setAssigning(false);
    }
  };
  // Giao diện
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Tìm kiếm Booking</h1>

        {/* Search Box */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã Booking
              </label>
              <input
                type="number"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Nhập mã booking (VD: 1, 2, 3...)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Search size={20} />
                {loading ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        {booking && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Booking #{booking.bookingId}
                </h2>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                  booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  booking.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                  booking.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
                  booking.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
              </div>
              
              {booking.status === 'PENDING' && (
                <button
                  onClick={openAssignModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <UserCheck size={20} />
                  Phân công kỹ thuật viên
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={18} />
                  Thông tin khách hàng
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span>{booking.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <span>{booking.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <span>{booking.customerEmail}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Car size={18} />
                  Thông tin xe
                </h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Model:</strong> {booking.vehicleModel}</div>
                  <div><strong>Biển số:</strong> {booking.licensePlate}</div>
                  <div><strong>VIN:</strong> {booking.vin}</div>
                </div>
              </div>

              {/* Booking Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar size={18} />
                  Thông tin đặt lịch
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{booking.center}</span>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Dịch vụ</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Loại:</strong> {booking.serviceName || booking.offerType}</div>
                  {booking.maintenancePackage && (
                    <div><strong>Gói:</strong> {booking.maintenancePackage}</div>
                  )}
                  {booking.problemDescription && (
                    <div><strong>Mô tả:</strong> {booking.problemDescription}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Assigned Technician */}
            {booking.assignedTechnicianName && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-blue-600">
                  <UserCheck size={18} />
                  <span className="font-medium">Kỹ thuật viên: {booking.assignedTechnicianName}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Assign Technician Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Chọn kỹ thuật viên
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                {technicians.map((tech) => (
                  <div
                    key={tech.employeeId}
                    onClick={() => setSelectedTech(tech.employeeId)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedTech === tech.employeeId
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-medium">{tech.name}</div>
                    <div className="text-sm text-gray-600">{tech.email}</div>
                    <div className="text-sm text-gray-500">{tech.centerName}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!selectedTech || assigning}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {assigning ? 'Đang phân công...' : 'Xác nhận'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffBookingSearch;
