import React, { useState } from 'react';
import {
  FiUsers, FiSearch, FiFilter, FiChevronDown, FiMail, FiPhone,
  FiTruck, FiCalendar, FiDollarSign, FiUser, FiMoreVertical
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const StaffCustomers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [customers] = useState([]);

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    withVehicles: customers.filter(c => c.vehicles && c.vehicles.length > 0).length,
    upcomingAppointments: 0
  };

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

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'recent') return new Date(b.lastVisit) - new Date(a.lastVisit);
    if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
    return 0;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">Danh sách khách hàng</h1>
          <p className="text-gray-600 mt-1">Theo dõi thông tin, phương tiện và lịch sử dịch vụ</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm khách hàng theo tên, email, SĐT hoặc biển số..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="active">Đang hoạt động</option>
          <option value="withVehicles">Có phương tiện</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Tên (A-Z)</option>
          <option value="recent">Lần đến gần nhất</option>
          <option value="spent">Chi tiêu cao nhất</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Tổng khách hàng', value: stats.totalCustomers, icon: FiUsers, color: 'from-blue-500 to-blue-700' },
          { label: 'Đang hoạt động', value: stats.activeCustomers, icon: FiCalendar, color: 'from-green-500 to-teal-600' },
          { label: 'Có phương tiện', value: stats.withVehicles, icon: FiTruck, color: 'from-indigo-500 to-cyan-600' },
          { label: 'Cuộc hẹn sắp tới', value: stats.upcomingAppointments, icon: FiDollarSign, color: 'from-orange-500 to-amber-600' },
        ].map((item, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-sm text-white bg-gradient-to-r ${item.color} flex items-center gap-4`}
          >
            <item.icon className="text-3xl opacity-90" />
            <div>
              <p className="text-sm opacity-80">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Customer List */}
      {sortedCustomers.length === 0 ? (
        <Card>
          <Card.Content className="p-16 text-center">
            <FiUsers className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có khách hàng nào</h3>
            <p className="text-gray-500">Danh sách khách hàng trống</p>
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedCustomers.map((customer) => (
            <Card key={customer.id}>
              <Card.Content className="p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiUser className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><FiMail className="text-xs" />{customer.email}</span>
                        <span className="flex items-center gap-1"><FiPhone className="text-xs" />{customer.phone}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <FiMoreVertical className="text-gray-400" />
                  </button>
                </div>

                {customer.vehicles && customer.vehicles.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FiTruck className="text-blue-500" />
                      <span>{customer.vehicles[0].year} {customer.vehicles[0].make} {customer.vehicles[0].model}</span>
                      <span className="text-gray-500">•</span>
                      <span className="font-medium">{customer.vehicles[0].plate}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Lần đến gần nhất</p>
                    <p className="font-medium text-gray-900">{customer.lastVisit}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Số dịch vụ</p>
                    <p className="font-medium text-gray-900">{customer.totalServices}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tổng chi tiêu</p>
                    <p className="font-medium text-gray-900">{customer.totalSpent}₫</p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffCustomers;
