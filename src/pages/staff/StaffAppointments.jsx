import React, { useState, useEffect } from 'react';
import { 
  FiCalendar, FiSearch, FiFilter, FiPlus, FiEdit2,
  FiClock, FiUser, FiTruck, FiTool, FiDollarSign,
  FiCheckCircle, FiAlertCircle, FiX, FiCheck, FiMapPin
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import bookingService from '../../services/bookingService';

const StaffAppointments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [technicianWorkload, setTechnicianWorkload] = useState({});
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicleMake: '',
    vehicleModel: '',
    vehiclePlate: '',
    service: '',
    date: '',
    time: '',
    duration: '60',
    technician: '',
    notes: '',
    price: ''
  });

  // appointments from backend
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch bookings and technicians from backend when component mounts
  useEffect(() => {
    fetchBookings();
    fetchTechnicians();
  }, [statusFilter]);
  
  const fetchTechnicians = async () => {
    try {
      const result = await bookingService.getTechnicians();
      if (result.success && result.data) {
        setTechnicians(result.data);
        // Calculate workload for each technician
        calculateTechnicianWorkload(result.data);
      }
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };
  
  // Calculate how many bookings each technician has
  const calculateTechnicianWorkload = async (techList) => {
    const workload = {};
    
    for (const tech of techList) {
      try {
        const result = await bookingService.getTechnicianBookings(tech.employeeId);
        if (result.success && result.data) {
          // Count active bookings (ASSIGNED, IN_PROGRESS)
          const activeBookings = result.data.filter(booking => 
            booking.status === 'ASSIGNED' || booking.status === 'IN_PROGRESS'
          );
          workload[tech.employeeId] = activeBookings.length;
        } else {
          workload[tech.employeeId] = 0;
        }
      } catch (error) {
        workload[tech.employeeId] = 0;
      }
    }
    
    setTechnicianWorkload(workload);
  };
  
  const fetchBookings = async () => {
    setLoading(true);
    try {
      let result;
      // Fetch by status or all bookings
      if (statusFilter !== 'all') {
        // Map frontend status to backend status enum
        const statusMap = {
          'pending': 'PENDING',
          'approved': 'APPROVED',
          'assigned': 'ASSIGNED',
          'in-progress': 'IN_PROGRESS',
          'completed': 'COMPLETED',
          'cancelled': 'CANCELLED'
        };
        result = await bookingService.getBookingsByStatus(statusMap[statusFilter]);
      } else {
        // For staff, show all bookings (PENDING + APPROVED + ASSIGNED)
        result = await bookingService.getAllBookings();
      }
      
      if (result.success && result.data) {
        // Transform backend data to match frontend format
        const transformedAppointments = result.data.map(booking => ({
          id: booking.bookingId,
          customerName: booking.customerName || 'N/A',
          customerEmail: booking.customerEmail || '',
          customerPhone: booking.customerPhone || '',
          vehicleMake: booking.vehicleMake || 'EV',
          vehicleModel: booking.vehicleModel || '',
          vehiclePlate: booking.vehiclePlate || booking.licensePlate || 'N/A',
          service: booking.serviceName || booking.offerType || 'Service',
          date: booking.bookingDate,
          time: booking.bookingTime,
          duration: 60,
          technician: booking.assignedTechnicianName || '',
          notes: booking.notes || booking.problemDescription || '',
          price: 0,
          status: mapBackendStatus(booking.status),
          createdAt: booking.createdAt
        }));
        setAppointments(transformedAppointments);
      } else {
        toast.error(result.error || 'Không thể tải danh sách booking');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Lỗi khi tải danh sách booking');
    } finally {
      setLoading(false);
    }
  };
  
  // Map backend status to frontend status
  const mapBackendStatus = (backendStatus) => {
    const statusMap = {
      'PENDING': 'pending',
      'APPROVED': 'approved',
      'ASSIGNED': 'assigned',
      'IN_PROGRESS': 'in-progress',
      'COMPLETED': 'completed',
      'REJECTED': 'cancelled',
      'CANCELLED': 'cancelled'
    };
    return statusMap[backendStatus] || 'pending';
  };

  // dich vu
  const services = [
    'Battery Check & Replacement',
    'Software Update',
    'General Maintenance',
    'Charging System Service',
    'AC System Service',
    'Brake Service',
    'Tire Rotation & Balance',
    'Diagnostic Check'
  ];

  // thoi gian
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  
  const stats = {
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    assigned: appointments.filter(a => a.status === 'assigned').length,
    inProgress: appointments.filter(a => a.status === 'in-progress').length,
    completed: appointments.filter(a => a.status === 'completed').length
  };

  // appointment 
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'today' && isToday(appointment.date)) ||
      (dateFilter === 'week' && isThisWeek(appointment.date));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // appointment sap xep theo thoi gian
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time);
  });

  // check ngay hom nay va tuan nay
  const isToday = (date) => {
    const today = new Date();
    const appointmentDate = new Date(date);
    return today.toDateString() === appointmentDate.toDateString();
  };

  const isThisWeek = (date) => {
    const today = new Date();
    const appointmentDate = new Date(date);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return appointmentDate >= weekStart && appointmentDate <= weekEnd;
  };

  // mau sac trang thai sau khi chon
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'assigned': return 'bg-purple-100 text-purple-700';
      case 'in-progress': return 'bg-orange-100 text-orange-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // them appinement
  const handleAddAppointment = (e) => {
    e.preventDefault();
    
    const newAppointment = {
      id: appointments.length + 1,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      vehicleMake: formData.vehicleMake,
      vehicleModel: formData.vehicleModel,
      vehiclePlate: formData.vehiclePlate,
      service: formData.service,
      date: formData.date,
      time: formData.time,
      duration: parseInt(formData.duration),
      technician: formData.technician,
      notes: formData.notes,
      price: parseFloat(formData.price) || 0,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    setAppointments([...appointments, newAppointment]);
    setShowAddModal(false);
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      vehicleMake: '',
      vehicleModel: '',
      vehiclePlate: '',
      service: '',
      date: '',
      time: '',
      duration: '60',
      technician: '',
      notes: '',
      price: ''
    });
    toast.success('Appointment created successfully');
  };

  // cap nhat trang thai
  const handleStatusChange = (id, newStatus) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
    toast.success(`Appointment status updated to ${newStatus}`);
  };

  // xoa appointment
  const handleDeleteAppointment = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: 'cancelled' } : apt
      ));
      toast.success('Appointment cancelled');
    }
  };
  
  // Show detail modal
  const handleShowDetail = (appointment) => {
    setSelectedBooking(appointment);
    setShowDetailModal(true);
  };
  
  // Approve booking
  const handleApproveBooking = async (bookingId) => {
    try {
      const result = await bookingService.approveBooking(bookingId);
      if (result.success) {
        toast.success('Booking đã được duyệt!');
        fetchBookings(); // Refresh list
      } else {
        toast.error(result.error || 'Không thể duyệt booking');
      }
    } catch (error) {
      toast.error('Lỗi khi duyệt booking');
    }
  };
  
  // Reject booking
  const handleRejectBooking = async (bookingId) => {
    const reason = prompt('Nhập lý do từ chối:');
    if (!reason) return;
    
    try {
      const result = await bookingService.rejectBooking(bookingId, reason);
      if (result.success) {
        toast.success('Booking đã bị từ chối. Khách hàng đã được thông báo.');
        fetchBookings(); // Refresh list
      } else {
        toast.error(result.error || 'Không thể từ chối booking');
      }
    } catch (error) {
      toast.error('Lỗi khi từ chối booking');
    }
  };
  
  // Show assign technician modal
  const handleShowAssignModal = (booking) => {
    setSelectedBooking(booking);
    setShowAssignModal(true);
  };
  
  // Assign technician
  const handleAssignTechnician = async () => {
    if (!selectedTechnicianId) {
      toast.error('Vui lòng chọn kỹ thuật viên');
      return;
    }
    
    try {
      const result = await bookingService.assignTechnician(selectedBooking.id, parseInt(selectedTechnicianId));
      if (result.success) {
        toast.success('Đã phân công kỹ thuật viên. Khách hàng đã được thông báo xe đang sửa chữa.');
        setShowAssignModal(false);
        setSelectedTechnicianId('');
        fetchBookings(); // Refresh list
      } else {
        toast.error(result.error || 'Không thể phân công kỹ thuật viên');
      }
    } catch (error) {
      toast.error('Lỗi khi phân công kỹ thuật viên');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lịch hẹn chăm sóc, bảo dưỡng xe</h1>
        <p className="text-gray-600 mt-1">Quản ly lịch hẹn - theo dõi tiến trình</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="border border-gray-200">
          <Card.Content className="p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Đã đặt</p>
            <p className="text-3xl font-bold text-indigo-600">{stats.pending + stats.approved}</p>
          </Card.Content>
        </Card>

        <Card className="border border-gray-200">
          <Card.Content className="p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Đạt thành công</p>
            <p className="text-3xl font-bold text-teal-600">{stats.approved}</p>
          </Card.Content>
        </Card>
        
        <Card className="border border-gray-200">
          <Card.Content className="p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Đang thực hiện</p>
            <p className="text-3xl font-bold text-orange-600">{stats.inProgress}</p>
          </Card.Content>
        </Card>

        <Card className="border border-gray-200">
          <Card.Content className="p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Hoàn thành</p>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </Card.Content>
        </Card>

        <Card className="border border-gray-200">
          <Card.Content className="p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Đã hủy</p>
            <p className="text-3xl font-bold text-red-600">{appointments.filter(a => a.status === 'cancelled').length}</p>
          </Card.Content>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <Card.Content className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm khách, xe, gói DV..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Hiển thị: 5</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="assigned">Đã phân công</option>
              <option value="in-progress">Đang thực hiện</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </Card.Content>
      </Card>
      {/* Table */}
      <Card>
        <Card.Content className="p-0">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin mx-auto h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách booking...</p>
            </div>
          ) : sortedAppointments.length === 0 ? (
            <div className="p-12 text-center">
              <FiCalendar className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có lịch hẹn</h3>
              <p className="text-gray-500">Chưa có lịch hẹn nào được tạo</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mã</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tên KH</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Dòng xe</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Gói DV</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Giờ</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ngày</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Liên hệ</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tiếp nhận</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedAppointments.map((appointment, index) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        DL{String(appointment.id).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {appointment.customerName}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {appointment.vehicleModel || appointment.vehicleMake}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {appointment.service}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {appointment.time}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {appointment.date}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {appointment.customerPhone}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(appointment.status)}`}>
                          {appointment.status === 'pending' && 'Đã đặt'}
                          {appointment.status === 'approved' && 'Đạt thành công'}
                          {appointment.status === 'assigned' && 'Đã phân công'}
                          {appointment.status === 'in-progress' && 'Đang thực hiện'}
                          {appointment.status === 'completed' && 'Hoàn thành'}
                          {appointment.status === 'cancelled' && 'Đã hủy'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          {appointment.status === 'pending' && (
                            <button
                              onClick={() => handleApproveBooking(appointment.id)}
                              className="px-3 py-1 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              Xác nhận
                            </button>
                          )}
                          {appointment.status === 'approved' && !appointment.technician && (
                            <button
                              onClick={() => handleShowAssignModal(appointment)}
                              className="px-3 py-1 text-xs font-medium bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                            >
                              Đã xác nhận
                            </button>
                          )}
                          {(appointment.status === 'assigned' || appointment.status === 'in-progress') && (
                            <button
                              className="px-3 py-1 text-xs font-medium bg-gray-400 text-white rounded cursor-default"
                            >
                              Đã xác nhận
                            </button>
                          )}
                          {appointment.status === 'completed' && (
                            <button
                              className="px-3 py-1 text-xs font-medium bg-gray-400 text-white rounded cursor-default"
                            >
                              Đã xác nhận
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-2">
        <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">Trang trước</button>
        <button className="px-3 py-1 text-sm bg-gray-200 text-gray-900 rounded">Trang 1/3</button>
        <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">Trang sau</button>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Create New Appointment</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      customerName: '',
                      customerEmail: '',
                      customerPhone: '',
                      vehicleMake: '',
                      vehicleModel: '',
                      vehiclePlate: '',
                      service: '',
                      date: '',
                      time: '',
                      duration: '60',
                      technician: '',
                      notes: '',
                      price: ''
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddAppointment} className="p-6">
              <h4 className="font-medium text-gray-900 mb-4">Customer Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                    required
                  />
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-4">Vehicle Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Make *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Tesla"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.vehicleMake}
                    onChange={(e) => setFormData({...formData, vehicleMake: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Model 3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Plate *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ABC-123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.vehiclePlate}
                    onChange={(e) => setFormData({...formData, vehiclePlate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-4">Service Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Type *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    required
                  >
                    <option value="">Select Service</option>
                    {services.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-4">Schedule</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  >
                    <option value="30">30</option>
                    <option value="60">60</option>
                    <option value="90">90</option>
                    <option value="120">120</option>
                    <option value="180">180</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technician
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.technician}
                    onChange={(e) => setFormData({...formData, technician: e.target.value})}
                  >
                    <option value="">Assign Later</option>
                    {technicians.map(tech => (
                      <option key={tech.employeeId} value={tech.name}>{tech.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any special instructions or notes..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      customerName: '',
                      customerEmail: '',
                      customerPhone: '',
                      vehicleMake: '',
                      vehicleModel: '',
                      vehiclePlate: '',
                      service: '',
                      date: '',
                      time: '',
                      duration: '60',
                      technician: '',
                      notes: '',
                      price: ''
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  <FiCheck className="mr-1" />
                  Create Appointment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Chi tiết đặt lịch</h3>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedBooking(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Booking Status */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Trạng thái</h4>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status.toUpperCase().replace('-', ' ')}
                  </span>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUser className="mr-2" />
                  Thông tin khách hàng
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Họ tên</p>
                    <p className="text-base font-medium text-gray-900">{selectedBooking.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-base font-medium text-gray-900">{selectedBooking.customerEmail || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="text-base font-medium text-gray-900">{selectedBooking.customerPhone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiTruck className="mr-2" />
                  Thông tin xe
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Hãng xe</p>
                    <p className="text-base font-medium text-gray-900">{selectedBooking.vehicleMake}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dòng xe</p>
                    <p className="text-base font-medium text-gray-900">{selectedBooking.vehicleModel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Biển số</p>
                    <p className="text-base font-medium text-gray-900">{selectedBooking.vehiclePlate}</p>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiCalendar className="mr-2" />
                  Thông tin đặt lịch
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Dịch vụ</p>
                    <p className="text-base font-medium text-gray-900">{selectedBooking.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày hẹn</p>
                    <p className="text-base font-medium text-gray-900">
                      <FiCalendar className="inline mr-1" />
                      {selectedBooking.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giờ hẹn</p>
                    <p className="text-base font-medium text-gray-900">
                      <FiClock className="inline mr-1" />
                      {selectedBooking.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Thời gian dự kiến</p>
                    <p className="text-base font-medium text-gray-900">{selectedBooking.duration} phút</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kỹ thuật viên</p>
                    <p className="text-base font-medium text-gray-900">
                      <FiTool className="inline mr-1" />
                      {selectedBooking.technician || 'Chưa phân công'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giá dự kiến</p>
                    <p className="text-base font-medium text-gray-900">
                      <FiDollarSign className="inline mr-1" />
                      ${selectedBooking.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                {selectedBooking.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Ghi chú</p>
                    <p className="text-base text-gray-900 mt-1 p-3 bg-white rounded border border-gray-200">
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedBooking(null);
                  }}
                >
                  Đóng
                </Button>
                {selectedBooking.status === 'scheduled' && (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleStatusChange(selectedBooking.id, 'in-progress');
                        setShowDetailModal(false);
                      }}
                    >
                      <FiClock className="mr-1" />
                      Bắt đầu dịch vụ
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleDeleteAppointment(selectedBooking.id);
                        setShowDetailModal(false);
                      }}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <FiX className="mr-1" />
                      Hủy lịch
                    </Button>
                  </>
                )}
                {selectedBooking.status === 'in-progress' && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, 'completed');
                      setShowDetailModal(false);
                    }}
                  >
                    <FiCheckCircle className="mr-1" />
                    Hoàn thành
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Technician Modal */}
      {showAssignModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Phân công kỹ thuật viên</h3>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedBooking(null);
                    setSelectedTechnicianId('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Khách hàng</p>
                <p className="text-base font-semibold text-gray-900">{selectedBooking.customerName}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Dịch vụ</p>
                <p className="text-base font-medium text-gray-900">{selectedBooking.service}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Thời gian</p>
                <p className="text-base font-medium text-gray-900">
                  {selectedBooking.date} - {selectedBooking.time}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn kỹ thuật viên *
                </label>
                <div className="space-y-2">
                  {technicians.length === 0 ? (
                    <p className="text-sm text-gray-500">Không có kỹ thuật viên nào</p>
                  ) : (
                    technicians.map(tech => {
                      const workload = technicianWorkload[tech.employeeId] || 0;
                      const isAvailable = workload === 0;
                      
                      return (
                        <label
                          key={tech.employeeId}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedTechnicianId === String(tech.employeeId)
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="technician"
                            value={tech.employeeId}
                            checked={selectedTechnicianId === String(tech.employeeId)}
                            onChange={(e) => setSelectedTechnicianId(e.target.value)}
                            className="mr-3 text-green-600 focus:ring-green-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900">{tech.name}</p>
                              {isAvailable ? (
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                  Đang rảnh
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                                  {workload} công việc
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{tech.phone}</p>
                            {tech.centerName && (
                              <p className="text-xs text-gray-500 mt-1">
                                <FiMapPin className="inline mr-1" />
                                {tech.centerName}
                              </p>
                            )}
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedBooking(null);
                    setSelectedTechnicianId('');
                  }}
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAssignTechnician}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FiCheck className="mr-1" />
                  Phân công
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAppointments;
