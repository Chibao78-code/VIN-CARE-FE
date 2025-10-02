import React, { useState } from 'react';
import { 
  FiCalendar, FiSearch, FiFilter, FiPlus, FiEdit2,
  FiClock, FiUser, FiTruck, FiTool, FiDollarSign,
  FiCheckCircle, FiAlertCircle, FiX, FiCheck, FiMapPin
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const StaffAppointments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
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

  // fake data appointment
  const [appointments, setAppointments] = useState([]);

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

  // fake date technician
  const technicians = [
    'Nguyễn Văn A',
    'Trần Thị B',
    'Lê Văn C',
    'Phạm Thị D'
  ];

  // thoi gian
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  
  const stats = {
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    inProgress: appointments.filter(a => a.status === 'in-progress').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    unassigned: appointments.filter(a => !a.technician).length
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
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
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

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600 mt-1">Manage customer appointments and assign technicians</p>
        </div>
        <Button
          variant="primary"
          icon={<FiPlus />}
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-green-500 to-teal-600"
        >
          New Appointment
        </Button>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers, vehicles, or services..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <Card.Content className="p-6">
            <p className="text-sm text-gray-600 mb-2">Scheduled</p>
            <p className="text-3xl font-bold text-gray-900">{stats.scheduled}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <p className="text-sm text-gray-600 mb-2">In Progress</p>
            <p className="text-3xl font-bold text-gray-900">{stats.inProgress}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <p className="text-sm text-gray-600 mb-2">Completed</p>
            <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <p className="text-sm text-gray-600 mb-2">Unassigned</p>
            <p className="text-3xl font-bold text-gray-900">{stats.unassigned}</p>
          </Card.Content>
        </Card>
      </div>
      {sortedAppointments.length === 0 ? (
        <Card>
          <Card.Content className="p-12 text-center">
            <FiCalendar className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500 mb-4">No appointments have been scheduled yet</p>
            <Button
              variant="primary"
              icon={<FiPlus />}
              onClick={() => setShowAddModal(true)}
            >
              Create First Appointment
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <Card.Content className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.customerName}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FiCalendar className="text-xs" />
                            {appointment.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock className="text-xs" />
                            {appointment.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiTruck className="text-xs" />
                            {appointment.vehiclePlate}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status.toUpperCase().replace('-', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Service</p>
                        <p className="text-sm font-medium text-gray-900">{appointment.service}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Vehicle</p>
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.vehicleMake} {appointment.vehicleModel}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Technician</p>
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.technician || 'Unassigned'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="text-sm font-medium text-gray-900">
                          ${appointment.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500">Notes</p>
                        <p className="text-sm text-gray-700">{appointment.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {appointment.status === 'scheduled' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(appointment.id, 'in-progress')}
                          >
                            <FiClock className="mr-1" />
                            Start Service
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAppointment(appointment.id)}
                          >
                            <FiX className="mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                      {appointment.status === 'in-progress' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStatusChange(appointment.id, 'completed')}
                        >
                          <FiCheckCircle className="mr-1" />
                          Complete Service
                        </Button>
                      )}
                      {appointment.status === 'completed' && (
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <FiCheckCircle />
                          Service Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
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
                      <option key={tech} value={tech}>{tech}</option>
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
    </div>
  );
};

export default StaffAppointments;