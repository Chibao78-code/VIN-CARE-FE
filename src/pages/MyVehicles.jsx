import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBattery, FiCalendar, FiInfo, FiTruck } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/format';
import MultiStepBooking from '../components/booking/MultiStepBooking'; // Import modal đặt lịch

const MyVehicles = () => {
  const navigate = useNavigate();

  // Trạng thái mở/đóng modal đặt lịch
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  // Xe được chọn để đặt lịch (nếu muốn dùng)
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [vehicles] = useState([
    {
      id: 1,
      brand: 'VinFast',
      model: 'EVO 200',
      year: 2023,
      purchaseDate: '2023-04-15',
      licensePlate: '30A-12345',
      vin: 'VF8VN2023001234',
      color: 'Xanh dương',
      batteryCapacity: '87.7 kWh',
      mileage: '15,234 km',
      nextMaintenance: '2024-03-15',
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      brand: 'VinFast',
      model: 'Evo 200 Lite',
      year: 2022,
      purchaseDate: '2022-09-12',
      licensePlate: '51G-67890',
      vin: 'TM3US2022005678',
      color: 'Trắng ngọc trai',
      batteryCapacity: '75 kWh',
      mileage: '28,456 km',
      nextMaintenance: '2024-02-20',
      image: '/api/placeholder/300/200'
    }
  ]);

  // Hàm mở modal đặt lịch và chọn xe đó
  const openBookingModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsBookingOpen(true);
  };

  // Hàm đóng modal đặt lịch
  const closeBookingModal = () => {
    setSelectedVehicle(null);
    setIsBookingOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-3">
        Xe Của Tôi
      </h1>
      {vehicles.length === 0 ? (
        <Card className="text-center py-20">
          <FiTruck className="text-7xl text-gray-300 mx-auto mb-6" />
          <p className="text-gray-500 text-lg mb-6">Bạn chưa có xe nào trong danh sách</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {vehicles.map(vehicle => (
            <Card
              key={vehicle.id}
              className="flex flex-col md:flex-row items-center md:items-stretch md:gap-8 shadow-md rounded-xl overflow-hidden border border-gray-100"
            >
              <div className="md:w-48 w-full h-32 md:h-40 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                <img
                  src={vehicle.image}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="object-contain h-24 w-24"
                />
              </div>
              <div className="flex-1 px-0 md:px-3 py-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-0.5">{vehicle.brand} {vehicle.model}</h3>
                <p className="text-gray-600 mb-1">{vehicle.year} • {vehicle.color} • Mua ngày: <time dateTime={vehicle.purchaseDate}>{formatDate(vehicle.purchaseDate)}</time></p>
                <div className="font-mono text-teal-700 text-lg">{vehicle.licensePlate}</div>
                <div className="grid grid-cols-3 gap-4 text-sm py-2">
                  <div className="flex items-center gap-1 text-gray-600">
                    <FiBattery /><span>{vehicle.batteryCapacity}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <FiInfo /><span>{vehicle.mileage}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <FiCalendar /><span className="text-orange-600">{formatDate(vehicle.nextMaintenance)}</span>
                  </div>
                </div>
              </div>
              {/* Nhóm nút chức năng */}
              <div className="flex flex-row md:flex-col gap-3 md:pr-6 md:justify-center items-center md:items-end py-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openBookingModal(vehicle)} // Mở modal đặt lịch cho xe này
                  className="min-w-[140px] font-semibold"
                >
                  Đặt lịch bảo dưỡng
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/app/vehicle-history/${vehicle.id}`)}
                >
                  Lịch sử bảo dưỡng
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal đặt lịch */}
      <MultiStepBooking
        isOpen={isBookingOpen}
        onClose={closeBookingModal}
        vehicle={selectedVehicle} // Có thể truyền xe được chọn nếu cần
      />
    </div>
  );
};

export default MyVehicles;
