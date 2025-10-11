import React, { useState } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiUser, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatDate, formatCurrency } from '../utils/format';
import MultiStepBooking from '../components/booking/MultiStepBooking';

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const [bookings, setBookings] = useState({
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
  });

  const openBookingModal = () => setIsBookingOpen(true);
  const closeBookingModal = () => setIsBookingOpen(false);

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: <FiClock /> },
      confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: <FiCheck /> },
      completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: <FiCheck /> },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: <FiX /> }
    }[status];

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}{config.label}
      </span>
    );
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      setBookings(prev => {
        const bookingToCancel = prev.upcoming.find(b => b.id === bookingId);
        if (!bookingToCancel) return prev;

        return {
          ...prev,
          upcoming: prev.upcoming.filter(b => b.id !== bookingId),
          cancelled: [...prev.cancelled, { ...bookingToCancel, status: 'cancelled', cancelReason: 'Khách hàng hủy' }]
        };
      });
      toast.success('Đã hủy lịch hẹn thành công!');
    }
  };

  const handleReschedule = (booking) => {
    window.dispatchEvent(new CustomEvent('openBookingModal', { 
      detail: { booking, isReschedule: true } 
    }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex justify-between items-center">
        Lịch Hẹn Của Tôi
        <Button 
          size="md" 
          variant="primary" 
          onClick={openBookingModal}
        >
          Thêm lịch hẹn mới
        </Button>
      </h1>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['upcoming', 'completed', 'cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'upcoming' ? 'Sắp tới' : tab === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {bookings[tab].length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-4">
        {bookings[activeTab].length === 0 ? (
          <Card className="text-center py-12">
            <FiCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không có lịch hẹn nào</p>
          </Card>
        ) : (
          bookings[activeTab].map(b => (
            <Card key={b.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between flex-col lg:flex-row lg:items-center">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{b.service}</h3>
                      <p className="text-sm text-gray-600">{b.vehicle}</p>
                      {getStatusBadge(b.status)}
                    </div>
                  </div>

                  <div className="mt-3 text-sm space-y-1">
                    <p><FiCalendar className="inline mr-1" /> {formatDate(b.date)}</p>
                    <p><FiClock className="inline mr-1" /> {b.time}</p>
                    <p><FiMapPin className="inline mr-1" /> {b.station}</p>
                    {b.address && <p className="ml-5 text-gray-500">{b.address}</p>}
                    {b.technician && <p><FiUser className="inline mr-1" /> {b.technician}</p>}
                    {b.estimatedCost && <p>Chi phí dự kiến: {formatCurrency(b.estimatedCost)}</p>}
                    {b.totalCost && <p>Tổng chi phí: {formatCurrency(b.totalCost)}</p>}
                    {b.notes && <p className="italic text-gray-600">Ghi chú: {b.notes}</p>}
                    {b.cancelReason && <p className="italic text-red-600">Lý do hủy: {b.cancelReason}</p>}
                    {b.feedback && <p className="italic text-gray-600">Đánh giá: "{b.feedback}"</p>}
                  </div>
                </div>

                <div className="mt-3 lg:mt-0 flex flex-col gap-2">
                  {activeTab === 'upcoming' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleReschedule(b)}>Đổi lịch</Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleCancelBooking(b.id)}>Hủy lịch</Button>
                    </>
                  )}
                  {activeTab === 'completed' && !b.rating && <Button size="sm" variant="primary">Đánh giá</Button>}
                  <Button size="sm" variant="outline">Chi tiết</Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Note for upcoming */}
      {activeTab === 'upcoming' && (
        <div className="mt-8 p-4 bg-red-50 border border-red-300 rounded-lg flex items-start gap-3">
          <FiAlertCircle className="text-red-600 mt-0.5" />
          <p className="text-sm text-red-800">
            <strong>Lưu ý:</strong> Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục. 
            Nếu cần hủy hoặc dời lịch, vui lòng thông báo trước 24 giờ.
          </p>
        </div>
      )}

      {/* Modal đặt lịch */}
      <MultiStepBooking 
        isOpen={isBookingOpen} 
        onClose={closeBookingModal}
      />
    </div>
  );
};

export default MyBookings;
