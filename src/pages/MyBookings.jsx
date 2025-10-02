import React, { useState } from 'react';
import { FiCalendar, FiClock, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Button from '../components/ui/Button';
import BookingModal from '../components/BookingModal';

const mockBookings = [
  {
    id: 1,
    serviceName: 'Kiểm tra xe điện',
    vehicle: 'Theon S',
    date: '2025-10-05',
    time: '09:30',
    status: 'Chờ xác nhận',
    progress: 30,
  },
  {
    id: 2,
    serviceName: 'Bảo dưỡng định kỳ',
    vehicle: 'Vento S',
    date: '2025-10-07',
    time: '14:00',
    status: 'Đang xử lý',
    progress: 60,
  },
  {
    id: 3,
    serviceName: 'Sửa chữa',
    vehicle: 'Klara S',
    date: '2025-09-28',
    time: '11:00',
    status: 'Hoàn tất',
    progress: 100,
  },
];

const MyBookings = () => {
  const [bookings, setBookings] = useState(mockBookings);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancelBooking = (id) => {
    setBookings(prev =>
      prev.map(b => b.id === id ? { ...b, status: 'Đã huỷ', progress: 0 } : b)
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Tiêu đề và nút đặt lịch */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#027C9D]">Lịch hẹn của bạn</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#027C9D] hover:bg-[#02617A] text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FiCalendar className="mr-2" /> Đặt lịch mới
        </Button>
      </div>

      {/* Danh sách lịch hẹn */}
      {bookings.length === 0 ? (
        <p className="text-gray-600">Bạn chưa có lịch hẹn nào.</p>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-[#027C9D]">{booking.serviceName}</h3>
                  <p className="text-gray-500 text-sm">Xe: {booking.vehicle}</p>
                  <div className="flex items-center text-gray-600 text-sm mt-1 space-x-4">
                    <div className="flex items-center space-x-1">
                      <FiCalendar /> <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiClock /> <span>{booking.time}</span>
                    </div>
                  </div>

                  {/* Trạng thái */}
                  <p className={`mt-2 font-medium ${
                    booking.status === 'Chờ xác nhận' ? 'text-yellow-600' :
                    booking.status === 'Đang xử lý' ? 'text-[#027C9D]' :
                    booking.status === 'Hoàn tất' ? 'text-gray-500' :
                    booking.status === 'Đã huỷ' ? 'text-red-500' : ''
                  }`}>
                    Trạng thái: {booking.status}
                  </p>

                  {/* Tiến độ xử lý */}
                  {booking.status !== 'Đã huỷ' && (
                    <div className="mt-2">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${booking.progress}%`,
                            backgroundColor: booking.progress === 100 ? '#4ade80' : '#027C9D',
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Tiến độ xử lý: {booking.progress}%
                      </p>
                    </div>
                  )}
                </div>

                {/* Nút huỷ hoặc trạng thái */}
                <div className="flex space-x-2">
                  {booking.status === 'Chờ xác nhận' && (
                    <Button
                      variant="destructive"
                      onClick={() => handleCancelBooking(booking.id)}
                      className="flex items-center"
                    >
                      <FiX className="mr-1" /> Huỷ lịch
                    </Button>
                  )}
                  {booking.status === 'Đang xử lý' && (
                    <div className="text-green-600 flex items-center text-sm">
                      <FiCheckCircle className="mr-1" /> Đang tiến hành
                    </div>
                  )}
                  {booking.status === 'Đã huỷ' && (
                    <div className="text-red-500 flex items-center text-sm">
                      <FiAlertCircle className="mr-1" /> Đã huỷ
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal đặt lịch mới */}
      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MyBookings;
