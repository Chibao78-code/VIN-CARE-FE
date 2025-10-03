import React, { useState, useEffect } from 'react';
import { FiClock, FiChevronRight, FiAlertCircle } from 'react-icons/fi';
import { timeSlots } from '../../../data/serviceCenters';
import Button from '../../ui/Button';

const SelectTimeSlot = ({ data, onNext, onBack }) => {
  const [selectedTime, setSelectedTime] = useState(data.timeSlot || null);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    // fake data, check xem co cho nao trong
    const slots = timeSlots.map(slot => ({
      ...slot,
      // random de demo
      available: Math.random() > 0.3
    }));
    setAvailableSlots(slots);
  }, [data.date, data.center]);

  const handleNext = () => {
    if (selectedTime) {
      onNext({ timeSlot: selectedTime });
    }
  };

  const getEstimatedDuration = () => {
    if (data.service?.id === 'maintenance') {
      return data.servicePackage?.duration || 60;
    } else if (data.service?.id === 'parts') {
      return 30 + (data.parts.length * 15); // 30p mỗi slot
    } else if (data.service?.id === 'repair') {
      return 90; // mặc định total sua 90 phút
    }
    return 60;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return `${days[date.getDay()]}, ${date.toLocaleDateString('vi-VN')}`;
  };

  const getEndTime = (startTime) => {
    const duration = getEstimatedDuration();
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const getServiceSummary = () => {
    if (data.service?.id === 'maintenance') {
      return `Bảo dưỡng - ${data.servicePackage?.name}`;
    } else if (data.service?.id === 'parts') {
      return `Thay thế ${data.parts.length} phụ tùng`;
    } else if (data.service?.id === 'repair') {
      return 'Sửa chữa';
    }
    return '';
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Chọn khung giờ
        </h3>
        <p className="text-sm text-gray-600">
          Chọn giờ hẹn phù hợp với bạn
        </p>
      </div>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Thông tin đặt lịch:</h4>
        <div className="space-y-1 text-sm text-blue-700">
          <p>📍 {data.center?.name}</p>
          <p>📅 {formatDate(data.date)}</p>
          <p>🔧 {getServiceSummary()}</p>
          <p>⏱️ Thời gian ước tính: {getEstimatedDuration()} phút</p>
        </div>
      </div>
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Buổi sáng</h4>
        <div className="grid grid-cols-4 gap-2">
          {availableSlots
            .filter(slot => {
              const hour = parseInt(slot.time.split(':')[0]);
              return hour < 12;
            })
            .map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.available && setSelectedTime(slot.time)}
                disabled={!slot.available}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all
                  ${!slot.available 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : selectedTime === slot.time
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                {slot.time}
              </button>
            ))}
        </div>
      </div>
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Buổi chiều</h4>
        <div className="grid grid-cols-4 gap-2">
          {availableSlots
            .filter(slot => {
              const hour = parseInt(slot.time.split(':')[0]);
              return hour >= 12;
            })
            .map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.available && setSelectedTime(slot.time)}
                disabled={!slot.available}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all
                  ${!slot.available 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : selectedTime === slot.time
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                {slot.time}
              </button>
            ))}
        </div>
      </div>
      {selectedTime && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <FiClock className="text-green-600 mr-2" />
            <div>
              <p className="font-medium text-green-900">
                Giờ hẹn: {selectedTime} - {getEndTime(selectedTime)}
              </p>
              <p className="text-sm text-green-700">
                Vui lòng đến trước 10 phút để làm thủ tục
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white border border-gray-300 rounded mr-1"></div>
          Còn chỗ
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-100 rounded mr-1"></div>
          Đã kín
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-600 rounded mr-1"></div>
          Đã chọn
        </div>
      </div>
      <div className="mt-6 p-4 bg-amber-50 rounded-lg">
        <div className="flex items-start">
          <FiAlertCircle className="text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-amber-700">
            <p className="font-medium mb-1">Lưu ý:</p>
            <ul className="space-y-1">
              <li>• Khung giờ có thể thay đổi tùy theo tình hình thực tế</li>
              <li>• Chúng tôi sẽ liên hệ xác nhận trước 1 ngày</li>
              <li>• Nếu cần đổi lịch, vui lòng báo trước 4 giờ</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!selectedTime}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          Tiếp tục
          <FiChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default SelectTimeSlot;
