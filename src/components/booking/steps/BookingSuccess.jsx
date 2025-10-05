import React, { useEffect } from 'react';
import { FiCheckCircle, FiCalendar, FiMapPin, FiPhone, FiMail, FiDownload, FiHome } from 'react-icons/fi';
import { vinfastModels } from '../../../data/serviceCenters';
import Button from '../../ui/Button';
import confetti from 'canvas-confetti';

const BookingSuccess = ({ data, onNext }) => {
  useEffect(() => {
    // hieu ung sau khi dat lich thang cong,add npm canvas
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const getVehicleName = () => {
    const vehicle = vinfastModels.find(v => v.id === data.vehicle);
    return vehicle?.name || '';
  };

  const getServiceSummary = () => {
    if (data.service?.id === 'maintenance') {
      return `${data.service.name} - ${data.servicePackage?.name}`;
    } else if (data.service?.id === 'parts') {
      return `${data.service.name} (${data.parts.length} phụ tùng)`;
    } else if (data.service?.id === 'repair') {
      return data.service.name;
    }
    return '';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return `${days[date.getDay()]}, ${date.toLocaleDateString('vi-VN')}`;
  };

  const handleDownloadReceipt = () => {
    // tao thong tin dat lich ra file text
    const receipt = `
BIÊN NHẬN ĐẶT LỊCH DỊCH VỤ VINFAST
=====================================
Mã đặt lịch: ${data.bookingId}
Ngày đặt: ${new Date().toLocaleString('vi-VN')}
Trạng thái: ĐÃ XÁC NHẬN

THÔNG TIN KHÁCH HÀNG
-------------------------------------
Họ tên: ${data.customerInfo.name}
Số điện thoại: ${data.customerInfo.phone}
Email: ${data.customerInfo.email}
Địa chỉ: ${data.customerInfo.address}

THÔNG TIN DỊCH VỤ
-------------------------------------
Trung tâm: ${data.center?.name}
Địa chỉ: ${data.center?.address}
Ngày hẹn: ${formatDate(data.date)}
Giờ hẹn: ${data.timeSlot}
Xe: VinFast ${getVehicleName()}
Dịch vụ: ${getServiceSummary()}
${data.notes ? `Ghi chú: ${data.notes}` : ''}

LƯU Ý
-------------------------------------
- Vui lòng đến đúng giờ đã hẹn
- Mang theo giấy tờ xe
- Liên hệ hotline nếu cần hỗ trợ

Hotline: ${data.center?.phone}
=====================================
    `;

    // tao va tai file text
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VinFast_Booking_${data.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
   // tai lai trang chu sau khi dat lich
  const handleClose = () => {
    window.location.reload();
  };

  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <FiCheckCircle className="text-green-600 text-4xl" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Đặt lịch thành công!
      </h3>
      <p className="text-gray-600 mb-6">
        Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ xác nhận trong vòng 30 phút
      </p>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg inline-block">
        <p className="text-sm text-blue-600 mb-1">Mã đặt lịch của bạn:</p>
        <p className="text-2xl font-bold text-blue-900">{data.bookingId}</p>
        <p className="text-xs text-blue-600 mt-1">Vui lòng lưu mã này để theo dõi</p>
      </div>
      <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg text-left max-w-2xl mx-auto">
        <h4 className="font-semibold text-gray-900 mb-4">Chi tiết lịch hẹn</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Thông tin dịch vụ</p>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <FiMapPin className="text-gray-400 mr-2" />
                <span>{data.center?.name}</span>
              </div>
              <div className="flex items-center text-sm">
                <FiCalendar className="text-gray-400 mr-2" />
                <span>{formatDate(data.date)} - {data.timeSlot}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-600">Xe: VinFast {getVehicleName()}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-600">Dịch vụ: {getServiceSummary()}</span>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Thông tin liên hệ</p>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="text-gray-600">{data.customerInfo.name}</span>
              </div>
              <div className="flex items-center text-sm">
                <FiPhone className="text-gray-400 mr-2" />
                <span>{data.customerInfo.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <FiMail className="text-gray-400 mr-2" />
                <span className="truncate">{data.customerInfo.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8 p-4 bg-gray-50 rounded-lg max-w-2xl mx-auto">
        <h4 className="font-medium text-gray-900 mb-4">Quy trình tiếp theo</h4>
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center mb-2">
              ✓
            </div>
            <span className="text-xs text-gray-600">Đã gửi</span>
          </div>
          
          <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
          
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center mb-2 animate-pulse">
              2
            </div>
            <span className="text-xs text-gray-600">Chờ xác nhận</span>
          </div>
          
          <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
          
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-gray-300 text-white rounded-full flex items-center justify-center mb-2">
              3
            </div>
            <span className="text-xs text-gray-600">Đã xác nhận</span>
          </div>
          
          <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
          
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-gray-300 text-white rounded-full flex items-center justify-center mb-2">
              4
            </div>
            <span className="text-xs text-gray-600">Hoàn thành</span>
          </div>
        </div>
      </div>
      <div className="mb-8 p-4 bg-amber-50 rounded-lg text-left max-w-2xl mx-auto">
        <h4 className="font-medium text-amber-900 mb-2">Các bước tiếp theo:</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>✓ Chúng tôi sẽ gọi xác nhận trong vòng 30 phút</li>
          <li>✓ Bạn sẽ nhận email xác nhận với đầy đủ thông tin</li>
          <li>✓ Nhắc nhở qua SMS trước 1 ngày</li>
          <li>✓ Vui lòng mang theo giấy tờ xe khi đến</li>
        </ul>
      </div>
      <div className="flex justify-center gap-3">
        <Button
          onClick={handleDownloadReceipt}
          variant="outline"
          className="border-gray-300"
        >
          <FiDownload className="mr-2" />
          Tải biên nhận
        </Button>
        
        <Button
          onClick={handleClose}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <FiHome className="mr-2" />
          Về trang chủ
        </Button>
      </div>
    </div>
  );
};

export default BookingSuccess;
