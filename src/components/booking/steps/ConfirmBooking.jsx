import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { FiUser, FiPhone, FiMail, FiMapPin, FiAlertCircle } from 'react-icons/fi';
import { vinfastModels } from '../../../data/serviceCenters';
import Input from '../../ui/Input';
import toast from 'react-hot-toast';
import useAuthStore from '../../../store/authStore';
import bookingService from '../../../services/bookingService';
// infor booking
const ConfirmBooking = forwardRef(({ data, onNext, goToNextStep, onBookingSuccess }, ref) => {
  // state thong tin khach hang
  const [customerInfo, setCustomerInfo] = useState(data.customerInfo || {
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  // state ghi chu them
  const [notes, setNotes] = useState(data.notes || '');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // submiet form
  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit()
  }));
  
  // validation thong tin
  const validateForm = () => {
    const newErrors = {};
    //bat loi thong tin sai
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }
     // kiem tra so dien thoai
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
      // kiem tra email
    if (customerInfo.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
      // kiem tra dia chi
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }; 
  // xu ly submit form
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Định dạng thời gian đặt lịch
      // Format booking time
      const formattedTime = data.timeSlot.split(':').length === 3 
        ? data.timeSlot 
        : data.timeSlot + ':00';
      
      //  Chuẩn bị payload đặt lịch
      const getOfferTypeId = (serviceId) => {
        const mapping = {
          'maintenance': 1, // Bảo dưỡng định kỳ
          'parts': 2,       // Thay thế phụ tùng
          'repair': 3       // Sửa chữa
        };
        return mapping[serviceId] || null;
      };
      // Prepare booking payload
      // payload dat lich
      const bookingPayload = {
        eVId: parseInt(data.vehicleData?.id || data.vehicle?.id || data.vehicle) || null,// id xe
        centerId: parseInt(data.center?.id) || null,// id trung tam
        bookingDate: data.date, // ngay dat lich
        bookingTime: formattedTime, // gio dat lich
        customerName: customerInfo.name || null,// ten khach hang
        customerPhone: customerInfo.phone || null,// so dien thoai
        customerEmail: customerInfo.email || null, // email khach hang
        customerAddress: customerInfo.address || null, // dia chi khach hang
        offerTypeId: getOfferTypeId(data.service?.id), // loai dich vu
        packageId: data.servicePackage?.id || null,// goi dich vu
        problemDescription: data.problemDescription || null,// mo ta van de
        notes: notes || null // ghi chu them
      };
      // Log chi tiết payload để debug
      console.log('📤 Creating booking with payload:', bookingPayload);
      console.log('Vehicle details:', {
        vehicleData: data.vehicleData, // chi tiet xe
        vehicleId: data.vehicleData?.id || data.vehicle?.id || data.vehicle,// id xe
        licensePlate: data.vehicleData?.licensePlate,// bien so xe
        vin: data.vehicleData?.vin,// vin xe
        model: data.vehicleData?.model // model xe
      });
      // Log chi tiết dịch vụ và thông tin khách hàng
      console.log('Service details:', {
        service: data.service?.name, // ten dich vu
        package: data.servicePackage?.name, //  ten goi dich vu
        problem: data.problemDescription // mo ta van de
      });
      // Log chi tiết thông tin khách hàng
      console.log('Customer info:', {
        name: customerInfo.name, // ten khach hang
        phone: customerInfo.phone, //  so dien thoai
        email: customerInfo.email, // email khach hang
        address: customerInfo.address // dia chi khach hang
      });
      
      //  Goi API tao lich
      if (!bookingPayload.eVId || !bookingPayload.centerId) {
        toast.error('Thiếu thông tin xe hoặc trung tâm');
        setIsSubmitting(false);
        return;
      }
      
      const response = await bookingService.createBooking(bookingPayload);
      
      if (response.success && response.data) {
        const bookingId = response.data.bookingId;
        
        console.log('✅ Booking created successfully with ID:', bookingId);
        
        // Hiển thị thông báo thành công
        toast.success('Đặt lịch thành công!');
        
        // Cập nhật dữ liệu đặt lịch với ID đã tạo
        const finalBookingData = {
          ...data,
          customerInfo,
          notes,
          bookingId: bookingId,
          backendData: response.data,
          status: 'pending_payment'
        };
        
        // Lưu dữ liệu và kích hoạt modal thành công
        onNext(finalBookingData);
        if (onBookingSuccess) {
          onBookingSuccess(finalBookingData);
        }
      } else {
        // Kiểm tra các thông báo lỗi cụ thể
        const errorMsg = response.error || 'Không thể tạo lịch hẹn';
        if (errorMsg.includes('already has a pending booking') || errorMsg.includes('already booked')) {
          toast.error('🚗 Xe này đã có lịch hẹn khác. Vui lòng hủy lịch cũ trước khi đặt lịch mới.');
        } else if (errorMsg.includes('currently in service') || errorMsg.includes('IN_SERVICE')) {
          toast.error('🔧 Xe này đang được bảo dưỡng/sửa chữa. Vui lòng chờ xe hoàn tất dịch vụ.');
        } else {
          toast.error(errorMsg);
        }
      }
      // Ket thuc submit
    } catch (error) {
      console.error('Lỗi khi đặt lịch:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVehicleName = () => {
    // lay ten xe
    if (data.vehicleData) {
      return data.vehicleData.model || '';
    }
    // lay ten xe theo id
    const vehicle = vinfastModels.find(v => v.id === data.vehicle);
    return vehicle?.name || '';
  };
  // lay tom tat dich vu
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
  // tinh tong tien
  const calculateTotal = () => {
    if (data.service?.id === 'maintenance') {
      return data.servicePackage?.price || 0;
    } else if (data.service?.id === 'parts') {
      return data.parts.reduce((sum, part) => sum + part.price, 0);
    }
    return 0;
  };
  // định dạng ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };
  // định dạng ngày giờ
  const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString);
    const days = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = days[date.getDay()];
    const formattedDate = date.toLocaleDateString('vi-VN');// dd/mm/yyyy
    return `${dayName}, ${formattedDate}, ${timeString}`;// dd/mm/yyyy, hh:mm
  };
  // lay thong tin xe
  const getVehicleInfoTitle = () => {
    const model = data.vehicleData?.model || getVehicleName();// lay ten xe
    const plate = data.vehicleData?.licensePlate || '';// bien so xe
    if (model && plate) {
      return `VinFast ${model} - ${plate}`;
    } else if (model) {
      return `VinFast ${model}`;
    }
    return 'xe của bạn';
  };
  // giao dien xac nhan dat lich
  return (
    <div className="flex flex-col h-full">
      <p className="text-sm text-gray-600 mb-4">
        Vui lòng kiểm tra và điền đầy đủ thông tin liên hệ
      </p>

      <div className="flex-1">
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Thông tin đặt lịch cho xe {getVehicleInfoTitle()}</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm gap-4">
            <span className="text-gray-600 flex-shrink-0">Trung tâm:</span>
            <span className="font-medium text-right">{data.center?.name}</span>
          </div>
          <div className="flex justify-between items-center text-sm gap-4">
            <span className="text-gray-600 flex-shrink-0">Địa chỉ:</span>
            <span className="font-medium text-right line-clamp-1">{data.center?.address}</span>
          </div>
          <div className="flex justify-between items-center text-sm gap-4">
            <span className="text-gray-600 flex-shrink-0">Thời gian:</span>
            <span className="font-medium text-right">{formatDateTime(data.date, data.timeSlot)}</span>
          </div>
          {data.service?.id === 'parts' && data.parts.length > 0 && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-sm text-gray-600 mb-1">Phụ tùng:</p>
              <ul className="space-y-1">
                {data.parts.map((part) => (
                  <li key={part.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">• {part.name}</span>
                    <span>{part.price.toLocaleString('vi-VN')}đ</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {data.service?.id === 'repair' && data.problemDescription && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-sm text-gray-600">Mô tả vấn đề:</p>
              <p className="text-sm mt-1">{data.problemDescription}</p>
            </div>
          )}
          
          {calculateTotal() > 0 && (
            <div className="mt-3 pt-3 border-t flex justify-between">
              <span className="font-medium">Tạm tính:</span>
              <span className="font-bold text-blue-600">
                {calculateTotal().toLocaleString('vi-VN')}đ
              </span>
            </div>
          )}
        </div>
          </div>
        </div>
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-4">Thông tin khách hàng</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              error={errors.name}
              icon={<FiUser />}
              required
            />
          </div>
          
          <div>
            <Input
              label="Số điện thoại"
              placeholder="0912345678"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              error={errors.phone}
              icon={<FiPhone />}
              required
            />
          </div>
          
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="email@example.com"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              error={errors.email}
              icon={<FiMail />}
            />
          </div>
          
          <div>
            <Input
              label="Địa chỉ"
              placeholder="123 Đường ABC, Quận XYZ"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
              error={errors.address}
              icon={<FiMapPin />}
            />
          </div>
        </div>
        
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú thêm (tùy chọn)
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="Thông tin thêm về xe, yêu cầu đặc biệt..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-2">Lưu ý</p>
            <ul className="space-y-1">
              <li>• Vui lòng đến đúng giờ đã hẹn</li>
              <li>• Mang theo giấy tờ xe khi đến</li>
              <li>• Chúng tôi sẽ liên hệ xác nhận trong vòng 30 phút</li>
              <li>• Nếu cần hủy/đổi lịch, vui lòng báo trước 4 giờ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

ConfirmBooking.displayName = 'ConfirmBooking';

export default ConfirmBooking;
