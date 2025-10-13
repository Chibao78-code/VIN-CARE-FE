import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/format';

const RescheduleBookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    if (booking) {
      setNewDate(booking.date);
      setNewTime(booking.time);
    }
  }, [booking]);

  if (!booking) return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center text-gray-500">
      Không tìm thấy thông tin lịch hẹn.
    </div>
  );

  const handleSave = () => {
    if (!newDate || !newTime) {
      alert('Vui lòng chọn ngày và giờ mới!');
      return;
    }
    // Xử lý lưu đổi lịch ở đây (gọi API hoặc cập nhật state toàn cục nếu có)
    alert('Đã cập nhật lịch hẹn thành công!');
    navigate(-1); // Quay lại trang trước
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-[#265085]">Đổi lịch hẹn</h2>
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-2 text-[#027C9D]">Thông tin lịch hẹn cũ</h3>
        <div className="mb-1"><strong>Dịch vụ:</strong> {booking.service}</div>
        <div className="mb-1"><strong>Xe:</strong> {booking.vehicle}</div>
        <div className="mb-1"><strong>Trạm:</strong> {booking.station}</div>
        <div className="mb-1"><strong>Ngày cũ:</strong> {booking.date}</div>
        <div className="mb-1"><strong>Giờ cũ:</strong> {booking.time}</div>
        {booking.technician && <div className="mb-1"><strong>Kỹ thuật viên:</strong> {booking.technician}</div>}
        {booking.notes && <div className="mb-1"><strong>Ghi chú:</strong> {booking.notes}</div>}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-[#027C9D]">Chọn lịch mới</h3>
        <label className="block mt-2">
          Ngày mới:
          <input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
            min={formatDate(new Date())}
          />
        </label>
        <label className="block mt-4">
          Giờ mới:
          <input
            type="time"
            value={newTime}
            onChange={e => setNewTime(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </label>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => navigate(-1)}>Quay lại</Button>
        <Button onClick={handleSave}>Lưu thay đổi</Button>
      </div>
    </div>
  );
};

export default RescheduleBookingPage;
