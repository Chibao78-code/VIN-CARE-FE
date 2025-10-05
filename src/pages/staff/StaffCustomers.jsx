import React, { useState } from 'react';
import { 
  FiUsers, FiSearch, FiFilter, FiPlus, FiEdit2,
  FiPhone, FiMail, FiTruck, FiCalendar, FiDollarSign,
  FiMoreVertical, FiChevronDown, FiUser
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const StaffCustomers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePlate: ''
  });

  // fake data
  const [customers, setCustomers] = useState([]);
  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    withVehicles: customers.filter(c => c.vehicles && c.vehicles.length > 0).length,
    upcomingAppointments: 0
  };

  // dua tren tim kiem cua khach hang
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      (customer.vehiclePlate && customer.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'active') return matchesSearch && customer.status === 'active';
    if (filterType === 'withVehicles') return matchesSearch && customer.vehicles && customer.vehicles.length > 0;
    
    return matchesSearch;
  });

  // khach hang
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'recent') return new Date(b.lastVisit) - new Date(a.lastVisit);
    if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
    return 0;
  });

  // them khach hang
  const handleAddCustomer = (e) => {
    e.preventDefault();
    
    const newCustomer = {
      id: customers.length + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      lastVisit: new Date().toISOString().split('T')[0],
      totalSpent: 0,
      totalServices: 0,
      vehicles: formData.vehicleMake ? [{
        make: formData.vehicleMake,
        model: formData.vehicleModel,
        year: formData.vehicleYear,
        plate: formData.vehiclePlate
      }] : [],
      vehiclePlate: formData.vehiclePlate
    };

    setCustomers([...customers, newCustomer]);
    setShowAddModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      vehiclePlate: ''
    });
    toast.success('Customer added successfully');
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Directory</h1>
          <p className="text-gray-600 mt-1">Manage customer information and communication</p>
        </div>
        <Button
          variant="primary"
          icon={<FiPlus />}
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-green-500 to-teal-600"
        >
          Add Customer
        </Button>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Customers</option>
          <option value="active">Active</option>
          <option value="withVehicles">With Vehicles</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="recent">Recent Visit</option>
          <option value="spent">Total Spent</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <Card.Content className="p-6">
            <p className="text-sm text-gray-600 mb-2">Total Customers</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <p className="text-sm text-gray-600 mb-2">Active</p>
            <p className="text-3xl font-bold text-gray-900">{stats.activeCustomers}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <p className="text-sm text-gray-600 mb-2">With Vehicles</p>
            <p className="text-3xl font-bold text-gray-900">{stats.withVehicles}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <p className="text-sm text-gray-600 mb-2">Upcoming Appts</p>
            <p className="text-3xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
          </Card.Content>
        </Card>
      </div>
      {sortedCustomers.length === 0 ? (
        <Card>
          <Card.Content className="p-12 text-center">
            <FiUsers className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-4">No customers have registered yet</p>
            <Button
              variant="primary"
              icon={<FiPlus />}
              onClick={() => setShowAddModal(true)}
            >
              Add First Customer
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedCustomers.map((customer) => (
            <Card key={customer.id}>
              <Card.Content className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <FiUser className="text-gray-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <FiMail className="text-xs" />
                          {customer.email}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <FiPhone className="text-xs" />
                          {customer.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <FiMoreVertical className="text-gray-400" />
                  </button>
                </div>

                {customer.vehicles && customer.vehicles.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FiTruck className="text-gray-500" />
                      <span>{customer.vehicles[0].year} {customer.vehicles[0].make} {customer.vehicles[0].model}</span>
                      <span className="text-gray-500">•</span>
                      <span className="font-medium">{customer.vehicles[0].plate}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Last Visit</p>
                    <p className="font-medium text-gray-900">{customer.lastVisit}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Services</p>
                    <p className="font-medium text-gray-900">{customer.totalServices}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Spent</p>
                    <p className="font-medium text-gray-900">${customer.totalSpent}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <FiCalendar className="mr-1" />
                    Book Service
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <FiEdit2 className="mr-1" />
                    Edit
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Add New Customer</h3>
            </div>

            <form onSubmit={handleAddCustomer} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-3">Vehicle Information (Optional)</h4>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Make
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Tesla"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.vehicleMake}
                    onChange={(e) => setFormData({...formData, vehicleMake: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Model 3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 2023"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.vehicleYear}
                    onChange={(e) => setFormData({...formData, vehicleYear: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Plate
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ABC-123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.vehiclePlate}
                    onChange={(e) => setFormData({...formData, vehiclePlate: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      address: '',
                      vehicleMake: '',
                      vehicleModel: '',
                      vehicleYear: '',
                      vehiclePlate: ''
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Add Customer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffCustomers;