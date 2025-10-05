import React from 'react';
import { FiTruck, FiCalendar, FiBattery, FiTrendingUp } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatCurrency, formatDate } from '../utils/format';
//api neu co data thi hien thi
const Dashboard = () => {
  const stats = [
    //fake data
    {
      title: 'Xe của bạn',
      value: '2',
      icon: FiTruck,
      color: 'primary',
      change: '+1 tháng này'
    },
    {
      title: 'Lịch hẹn',
      value: '5',
      icon: FiCalendar,
      color: 'secondary',
      change: '3 sắp tới'
    },
    {
      title: 'Điện năng đã sạc',
      value: '450 kWh',
      icon: FiBattery,
      color: 'yellow',
      change: '+12% so với tháng trước'
    },
    {
      title: 'Chi phí tháng này',
      value: formatCurrency(2500000),
      icon: FiTrendingUp,
      color: 'purple',
      change: '-5% so với tháng trước'
    }
  ];
  
  const recentBookings = [
    {
      id: 1,
      service: 'Bảo dưỡng định kỳ',
      vehicle: 'VinFast Evo 200',
      date: '2024-01-15',
      status: 'completed',
      amount: 500000
    },
    {
      id: 2,
      service: 'Sạc nhanh',
      vehicle: 'VinFast Evo 200 Lite',
      date: '2024-01-18',
      status: 'upcoming',
      amount: 150000
    },
    {
      id: 3,
      service: 'Kiểm tra pin',
      vehicle: 'VinFast ',
      date: '2024-01-20',
      status: 'upcoming',
      amount: 300000
    }
  ];
  
  const getStatusBadge = (status) => {
    const badges = {
      completed: 'badge-success',
      upcoming: 'badge-info',
      cancelled: 'badge-danger'
    };
    const labels = {
      completed: 'Hoàn thành',
      upcoming: 'Sắp tới',
      cancelled: 'Đã hủy'
    };
    
    return (
      <span className={`badge ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };
  
  const getIconColor = (color) => {
    const colors = {
      primary: 'bg-primary-100 text-primary-600',
      secondary: 'bg-secondary-100 text-secondary-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colors[color] || colors.primary;
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Xin chào, Dinh Chi Bao 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Chào mừng bạn quay trở lại với EV Service
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} hoverable className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${getIconColor(stat.color)}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <Card.Title>Lịch hẹn gần đây</Card.Title>
          </Card.Header>
          <Card.Content className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-y border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dịch vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Xe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {booking.service}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {booking.vehicle}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(booking.date)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(booking.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Content>
          <Card.Footer>
            <Button variant="outline" size="sm">
              Xem tất cả
            </Button>
          </Card.Footer>
        </Card>
        
        <Card>
          <Card.Header>
            <Card.Title>Thông báo</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 mt-2 bg-primary-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Lịch bảo dưỡng xe VinFast Evo 200 sắp tới
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    2 giờ trước
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Sạc xe thành công 
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    1 ngày trước
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 mt-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Khuyến mãi 20% cho dịch vụ bảo dưỡng
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    3 ngày trước
                  </p>
                </div>
              </div>
            </div>
          </Card.Content>
          <Card.Footer>
            <Button variant="outline" size="sm">
              Xem tất cả thông báo
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;