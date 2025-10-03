import React, { useState } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiUser, FiPhone, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatDate, formatCurrency } from '../utils/format';

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // dake data booking
  const bookings = {
    upcoming: [
      {
        id: 1,
        service: 'Bảo dưỡng định kỳ',
        vehicle: 'VinFast VF8 - 30A-12345',
        date: '2024-02-15',
        time: '09:00',
        station: 'EV Service Center Quận 1',
        address: '123 Nguyễn Huệ, Q.1, TP.HCM',
        technician: 'Nguyễn Văn A',
        estimatedCost: 1500000,
        status: 'confirmed',
        notes: 'Kiểm tra hệ thống phanh và pin'
      },
      {
        id: 2,
        service: 'Sạc xe điện',
        vehicle: 'Tesla Model 3 - 51G-67890',
        date: '2024-02-10',
        time: '14:30',
        station: 'EV Charging Hub Thủ Đức',
        address: '456 Võ Văn Ngân, Thủ Đức',
        technician: 'Trần Thị B',
        estimatedCost: 250000,
        status: 'pending',
        notes: 'Sạc nhanh DC'
      }
    ],
    completed: [
      {
        id: 3,
        service: 'Kiểm tra pin',
        vehicle: 'VinFast VF8 - 30A-12345',
        date: '2024-01-20',
        time: '10:00',
        station: 'EV Service Center Quận 1',
        address: '123 Nguyễn Huệ, Q.1, TP.HCM',
        technician: 'Lê Văn C',
        totalCost: 500000,
        status: 'completed',
        rating: 5,
        feedback: 'Dịch vụ tốt, nhân viên thân thiện'
      },
      {
        id: 4,
        service: 'Sửa chữa',
        vehicle: 'Tesla Model 3 - 51G-67890',
        date: '2024-01-15',
        time: '13:00',
        station: 'EV Service Center Quận 7',
        address: '789 Nguyễn Văn Linh, Q.7',
        technician: 'Phạm Văn D',
        totalCost: 3500000,
        status: 'completed',
        rating: 4,
        feedback: 'Sửa chữa nhanh chóng'
      }
    ],
    cancelled: [
      {
        id: 5,
        service: 'Bảo dưỡng định kỳ',
        vehicle: 'VinFast VF8 - 30A-12345',
        date: '2024-01-10',
        time: '11:00',
        station: 'EV Service Center Quận 1',
        status: 'cancelled',
        cancelReason: 'Khách hàng bận việc đột xuất'
      }
    ]
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        label: 'Chờ xác nhận', 
        className: 'bg-yellow-100 text-yellow-800',
        icon: <FiClock className="w-4 h-4" />
      },
      confirmed: { 
        label: 'Đã xác nhận', 
        className: 'bg-blue-100 text-blue-800',
        icon: <FiCheck className="w-4 h-4" />
      },
      completed: { 
        label: 'Hoàn thành', 
        className: 'bg-green-100 text-green-800',
        icon: <FiCheck className="w-4 h-4" />
      },
      cancelled: { 
        label: 'Đã hủy', 
        className: 'bg-red-100 text-red-800',
        icon: <FiX className="w-4 h-4" />
      }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      toast.success('Đã hủy lịch hẹn thành công!');
    }
  };

  const handleReschedule = (booking) => {
    // Mở modal đặt lại lịch với dữ liệu booking hiện tại
    window.dispatchEvent(new CustomEvent('openBookingModal', { 
      detail: { booking, isReschedule: true } 
    }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Lịch Hẹn Của Tôi
      </h1>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'upcoming', label: 'Sắp tới', count: bookings.upcoming.length },
            { key: 'completed', label: 'Hoàn thành', count: bookings.completed.length },
            { key: 'cancelled', label: 'Đã hủy', count: bookings.cancelled.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.key
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="space-y-4">
        {bookings[activeTab].length === 0 ? (
          <Card className="text-center py-12">
            <FiCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              Không có lịch hẹn nào
            </p>
          </Card>
        ) : (
          bookings[activeTab].map(booking => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
              <Card.Content>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4 lg:mb-0">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {booking.service}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {booking.vehicle}
                        </p>
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>

                    <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <FiCalendar className="mr-2 flex-shrink-0" />
                          <span>{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FiClock className="mr-2 flex-shrink-0" />
                          <span>{booking.time}</span>
                        </div>
                        {booking.technician && (
                          <div className="flex items-center text-gray-600">
                            <FiUser className="mr-2 flex-shrink-0" />
                            <span>KTV: {booking.technician}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start text-gray-600">
                          <FiMapPin className="mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">{booking.station}</p>
                            {booking.address && (
                              <p className="text-xs mt-0.5">{booking.address}</p>
                            )}
                          </div>
                        </div>
                        {booking.estimatedCost && (
                          <div className="flex items-center text-gray-600">
                            <span className="mr-2">Chi phí dự kiến:</span>
                            <span className="font-semibold text-teal-600">
                              {formatCurrency(booking.estimatedCost)}
                            </span>
                          </div>
                        )}
                        {booking.totalCost && (
                          <div className="flex items-center text-gray-600">
                            <span className="mr-2">Tổng chi phí:</span>
                            <span className="font-semibold text-teal-600">
                              {formatCurrency(booking.totalCost)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Ghi chú:</span> {booking.notes}
                        </p>
                      </div>
                    )}

                    {booking.cancelReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-600">
                          <span className="font-medium">Lý do hủy:</span> {booking.cancelReason}
                        </p>
                      </div>
                    )}

                    {booking.rating && (
                      <div className="mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Đánh giá:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-lg ${
                                  star <= booking.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        {booking.feedback && (
                          <p className="text-sm text-gray-600 mt-1 italic">
                            "{booking.feedback}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col gap-2">
                    {activeTab === 'upcoming' && (
                      <>
                        {booking.status === 'pending' && (
                          <Button size="sm" variant="primary">
                            Xác nhận
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReschedule(booking)}
                        >
                          Đổi lịch
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Hủy lịch
                        </Button>
                      </>
                    )}
                    {activeTab === 'completed' && !booking.rating && (
                      <Button size="sm" variant="primary">
                        Đánh giá
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Chi tiết
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))
        )}
      </div>
      {activeTab === 'upcoming' && (
        <div className="mt-8 p-4 bg-teal-50 border border-teal-200 rounded-lg">
          <div className="flex items-start">
            <FiAlertCircle className="text-teal-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-teal-800">
                <strong>Lưu ý:</strong> Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục. 
                Nếu cần hủy hoặc dời lịch, vui lòng thông báo trước 24 giờ.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;