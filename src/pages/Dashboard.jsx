import React, { useState, useEffect } from "react";
import { FiTruck, FiCalendar, FiBattery, FiTrendingUp } from "react-icons/fi";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { formatCurrency, formatDate } from "../utils/format";

// Map key icon thành component icon tương ứng
const iconMap = {
  truck: FiTruck,
  calendar: FiCalendar,
  battery: FiBattery,
  trendingUp: FiTrendingUp,
};

// Mô phỏng API lấy dữ liệu user
const fetchUserInfo = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: "Dinh Chi Bao" });
    }, 500);
  });
};

// Mô phỏng API lấy dữ liệu thống kê
const fetchStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { title: "Xe của bạn", value: "2", iconKey: "truck" },
        { title: "Lịch hẹn", value: "5", iconKey: "calendar" },
        { title: "Điện năng đã sạc", value: "450 kWh", iconKey: "battery" },
        { title: "Chi phí tháng này", value: formatCurrency(2500000), iconKey: null },
      ]);
    }, 700);
  });
};

// Mô phỏng API lấy lịch đặt gần đây
const fetchRecentBookings = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          service: "Bảo dưỡng định kỳ",
          vehicle: "VinFast Evo 200",
          date: "2024-01-15",
          status: "completed",
          amount: 500000,
        },
        {
          id: 2,
          service: "Sạc nhanh",
          vehicle: "VinFast Evo 200 Lite",
          date: "2024-01-18",
          status: "upcoming",
          amount: 150000,
        },
        {
          id: 3,
          service: "Kiểm tra pin",
          vehicle: "VinFast ",
          date: "2024-01-20",
          status: "cancelled",
          amount: 300000,
        },
      ]);
    }, 800);
  });
};

const Dashboard = () => {
  // State chứa tên user
  const [userName, setUserName] = useState("");

  // State chứa danh sách stats
  const [stats, setStats] = useState([]);

  // State chứa danh sách lịch đặt gần đây
  const [recentBookings, setRecentBookings] = useState([]);

  // useEffect chạy 1 lần khi component mount để load dữ liệu từ API giả
  useEffect(() => {
    fetchUserInfo().then((data) => setUserName(data.name));
    fetchStats().then((data) => setStats(data));
    fetchRecentBookings().then((data) => setRecentBookings(data));
  }, []);

  // Hàm định nghĩa badge trạng thái cho bảng lịch đặt
  const getStatusBadge = (status) => {
    const badges = {
      completed: "bg-green-400 text-white",
      upcoming: "bg-blue-400 text-white",
      cancelled: "bg-red-400 text-white",
    };
    const labels = {
      completed: "Hoàn thành",
      upcoming: "Sắp tới",
      cancelled: "Đã hủy",
    };
    return (
      <span
        className={`inline-flex items-center justify-center px-4 py-1 rounded-md text-xs font-semibold ${badges[status]}`}
        style={{ whiteSpace: "nowrap", minWidth: "100px" }} // Đảm bảo badge không xuống dòng và rộng cố định
      >
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gradient-to-b from-[#B8ECFF] via-[#80D3EF] to-[#027C9D] rounded-md text-gray-900">
      {/* Phần chào mừng và tên user */}
      <div className="mb-8 text-white">
        <p className="text-lg mb-1 font-semibold drop-shadow-md">Xin chào,</p>
        <h1 className="text-5xl font-extrabold mb-1 uppercase drop-shadow-lg">{userName} 👋</h1>
        <p className="text-lg opacity-90 font-light drop-shadow-md">Chào mừng bạn quay trở lại với EV Service</p>
      </div>

      {/* Các ô thống kê chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(({ title, value, iconKey }, idx) => {
          // Xác định nền và màu chữ dựa theo index để tạo highlight kiểu xen kẽ
          let bgClass = "bg-white";
          let textColor = "text-[#027C9D]";
          let iconColor = "text-[#027C9D]";
          let changeTxt = "";

          if (idx === 1) {
            bgClass = "bg-gradient-to-tr from-[#2A5077] to-[#0F2A3D]";
            textColor = "text-white";
            iconColor = "text-white";
            changeTxt = "+1 tháng này";
          } else if (idx === 3) {
            bgClass = "bg-gradient-to-br from-[#034058] to-[#022838]";
            textColor = "text-white";
            iconColor = "text-white";
            changeTxt = "+1 tháng này";
          } else if (idx % 2 === 0) {
            changeTxt = "+12% so với tháng trước";
          } else {
            changeTxt = "+1 tháng này";
          }

          // Lấy component icon theo key từ iconMap
          const IconComponent = iconKey ? iconMap[iconKey] : null;

          return (
            <Card key={idx} hoverable className={`p-6 flex items-center justify-between rounded-md shadow-md ${bgClass}`}>
              <div>
                {/* Tiêu đề thống kê */}
                <p className={`text-sm font-medium ${textColor}`}>{title}</p>
                {/* Giá trị thống kê */}
                <p className={`text-3xl font-extrabold mt-2 ${textColor}`}>{value}</p>
                {/* Văn bản thay đổi */}
                <p className={`text-xs mt-1 ${textColor} opacity-80`}>{changeTxt}</p>
              </div>
              {/* Icon */}
              <div className="p-3 rounded-md bg-white/20 drop-shadow-md">
                {IconComponent && <IconComponent className={`h-8 w-8 ${iconColor}`} />}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Phần dịch vụ gần đây */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-white">
        <Card className="bg-white rounded-lg shadow-lg text-gray-900">
          <Card.Header>
            <Card.Title>Dịch vụ gần đây</Card.Title>
          </Card.Header>
          <Card.Content className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Dịch vụ</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Xe</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Ngày</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentBookings.map(({ id, service, vehicle, date, status }) => (
                  <tr key={id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 text-sm text-gray-900">{service}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{vehicle}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(date)}</td>
                    <td className="px-6 py-4">{getStatusBadge(status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card.Content>
          <Card.Footer>
            <Button variant="outline" size="sm" className="w-full font-semibold text-[#027C9D] hover:bg-[#80D3EF]">Xem tất cả</Button>
          </Card.Footer>
        </Card>

        {/* Phần thông báo */}
        <Card className="bg-white rounded-lg shadow-lg text-gray-900">
          <Card.Header>
            <Card.Title>Thông báo</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-4 text-gray-900">
            <NotificationItem color="bg-[#02617A]" title="Lịch bảo dưỡng xe VinFast Evo 200 sắp tới" time="2 giờ trước" />
            <NotificationItem color="bg-green-600" title="Sạc xe thành công" time="1 ngày trước" />
            <NotificationItem color="bg-yellow-400" title="Khuyến mãi 20% cho dịch vụ bảo dưỡng" time="3 ngày trước" />
          </Card.Content>
          <Card.Footer>
            <Button variant="outline" size="sm" className="w-full font-semibold text-[#027C9D] hover:bg-[#80D3EF]">Xem tất cả thông báo</Button>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

// Component cho item thông báo từng mục đơn giản
const NotificationItem = ({ color, title, time }) => (
  <div className="flex items-start space-x-3">
    {/* Chấm màu đại diện trạng thái */}
    <div className={`flex-shrink-0 w-3 h-3 mt-3 rounded-full ${color}`}></div>
    <div>
      {/* Tiêu đề */}
      <p className="text-sm font-semibold">{title}</p>
      {/* Thời gian */}
      <p className="text-xs opacity-80 mt-1">{time}</p>
    </div>
  </div>
);

export default Dashboard;
