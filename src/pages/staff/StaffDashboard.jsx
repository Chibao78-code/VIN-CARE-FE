import React from 'react';
import {
  FiCalendar, FiUsers, FiClock, FiDollarSign,
  FiCheckCircle, FiRefreshCw, FiAlertTriangle,
  FiFileText, FiUser, FiTruck, FiMessageSquare,
  FiChevronRight, FiPlus
} from 'react-icons/fi'; // import icon
import { useNavigate } from 'react-router-dom'; // điều hướng trang
import Card from '../../components/ui/Card'; // component khung thẻ
import Button from '../../components/ui/Button'; // component nút bấm

// component bảng điều khiển nhân viên
const StaffDashboard = () => {
  const navigate = useNavigate(); // dùng để điều hướng

  // dữ liệu tạm
  const stats = {
    todayAppointments: 0,
    activeCustomers: 0,
    pendingServices: 0,
    todayRevenue: 0
  };

  // dữ liệu trống ban đầu
  const todaySchedule = [];
  const recentCustomers = [];
  const completedToday = 0;
  const inProgress = 0;
  const urgentItems = 0;

  // danh sách tác vụ nhanh
  const quickActions = [
    { icon: FiFileText, label: 'Quản lý lịch hẹn', path: '/staff/appointments' },
    { icon: FiUser, label: 'Khách hàng', path: '/staff/customers' },
    { icon: FiTruck, label: 'Tra cứu phương tiện', path: '/staff/vehicles' },
    { icon: FiMessageSquare, label: 'Gửi tin nhắn', path: '/staff/messages' }
  ];

  return (
    <div>
      {/* tiêu đề */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">Bảng điều khiển nhân viên</h1>
          <p className="text-gray-600 mt-1">Xin chào, DINH! Đây là tổng quan hôm nay.</p>
        </div>

        {/* nút tạo lịch hẹn */}
        <Button
          variant="primary"
          icon={<FiPlus />}
          onClick={() => navigate('/staff/appointments/new')}
          className="bg-gradient-to-r from-blue-600 to-blue-800"
        >
          Tạo lịch hẹn mới
        </Button>
      </div>

      {/* thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Lịch hẹn hôm nay', value: stats.todayAppointments, icon: FiCalendar, color: 'from-blue-500 to-blue-700' },
          { label: 'Khách hàng hoạt động', value: stats.activeCustomers, icon: FiUsers, color: 'from-green-500 to-emerald-600' },
          { label: 'Dịch vụ chờ xử lý', value: stats.pendingServices, icon: FiClock, color: 'from-yellow-400 to-amber-600' },
          { label: 'Doanh thu hôm nay', value: `${stats.todayRevenue.toLocaleString()}₫`, icon: FiDollarSign, color: 'from-sky-500 to-indigo-600' },
        ].map((item, i) => (
          <div
            key={i}
            className={`p-6 rounded-xl text-white bg-gradient-to-r ${item.color} shadow-sm flex items-center gap-4`}
          >
            <item.icon className="text-4xl opacity-90" />
            <div>
              <p className="text-sm opacity-80">{item.label}</p>
              <p className="text-2xl font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* phần chính 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* lịch hẹn hôm nay */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <FiCalendar className="text-blue-600" /> Lịch hẹn hôm nay
              </h3>
              <button
                onClick={() => navigate('/staff/appointments')}
                className="text-sm text-blue-600 hover:underline"
              >
                Xem tất cả
              </button>
            </div>
          </Card.Header>

          <Card.Content className="p-6">
            {/* nếu không có lịch hẹn */}
            {todaySchedule.length === 0 ? (
              <div className="text-center py-8">
                <FiCalendar className="mx-auto text-5xl text-gray-300 mb-3" />
                <p className="text-gray-500">Không có lịch hẹn nào hôm nay</p>
              </div>
            ) : (
              // hiển thị danh sách lịch hẹn
              <div className="space-y-4">
                {todaySchedule.map((app) => (
                  <div key={app.id} className="flex justify-between items-start border-b border-gray-100 pb-3">
                    <div>
                      <p className="font-medium text-gray-900">{app.customerName}</p>
                      <p className="text-sm text-gray-600">{app.service}</p>
                      <p className="text-xs text-gray-500 mt-1">{app.vehicle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{app.time}</p>
                      <span
                        className={`text-xs mt-1 inline-block px-2 py-1 rounded-full ${
                          app.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>

        {/* khách hàng gần đây */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <FiUsers className="text-blue-600" /> Khách hàng gần đây
              </h3>
              <button
                onClick={() => navigate('/staff/customers')}
                className="text-sm text-blue-600 hover:underline"
              >
                Xem tất cả
              </button>
            </div>
          </Card.Header>

          <Card.Content className="p-6">
            {/* nếu không có khách hàng */}
            {recentCustomers.length === 0 ? (
              <div className="text-center py-8">
                <FiUsers className="mx-auto text-5xl text-gray-300 mb-3" />
                <p className="text-gray-500">Chưa có khách hàng mới</p>
              </div>
            ) : (
              // hiển thị danh sách khách hàng
              <div className="space-y-4">
                {recentCustomers.map((customer) => (
                  <div key={customer.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FiUser className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-600">{customer.phone}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <FiChevronRight className="text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* trạng thái dịch vụ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Hoàn thành hôm nay', value: completedToday, icon: FiCheckCircle, color: 'text-green-600 bg-green-100' },
          { label: 'Đang xử lý', value: inProgress, icon: FiRefreshCw, color: 'text-yellow-600 bg-yellow-100' },
          { label: 'Cần chú ý', value: urgentItems, icon: FiAlertTriangle, color: 'text-red-600 bg-red-100' },
        ].map((item, i) => (
          <Card key={i}>
            <Card.Content className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${item.color}`}>
                  <item.icon className="text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.label}</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
              <p className="text-sm text-gray-500 mt-1">Cập nhật số liệu trong ngày</p>
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* tác vụ nhanh */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">Tác vụ nhanh</h3>
        </Card.Header>
        <Card.Content className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="p-5 bg-gray-50 hover:bg-blue-50 border border-gray-100 rounded-lg text-center transition-all group"
              >
                <action.icon className="text-3xl text-blue-600 group-hover:scale-110 transition mb-2 mx-auto" />
                <p className="text-sm font-medium text-gray-700">{action.label}</p>
              </button>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default StaffDashboard;
