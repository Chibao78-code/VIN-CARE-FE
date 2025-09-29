import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiInfo, FiBattery, FiCalendar, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/format';
//goi api va dake data
const MyVehicles = () => {
  const [vehicles, setVehicles] = useState([

    {
      id: 1,
      brand: 'VinFast',
      model: 'EVO 200 ',
      year: 2023,
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
      licensePlate: '51G-67890',
      vin: 'TM3US2022005678',
      color: 'Trắng ngọc trai',
      batteryCapacity: '75 kWh',
      mileage: '28,456 km',
      nextMaintenance: '2024-02-20',
      image: '/api/placeholder/300/200'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // xoa xe
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa xe này?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
      toast.success('Đã xóa xe thành công!');
    }
  };

  // dat lich
  const handleBookMaintenance = (vehicle) => {
    // mo thong tin dat va thong tin xe
    window.dispatchEvent(new CustomEvent('openBookingModal', { 
      detail: { vehicle } 
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Xe Của Tôi
        </h1>
        <Button
          onClick={() => setShowAddModal(true)}
          icon={<FiPlus />}
        >
          Thêm xe mới
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <Card className="text-center py-12">
          <FiTruck className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            Bạn chưa có xe nào trong danh sách
          </p>
          <Button
            onClick={() => setShowAddModal(true)}
            icon={<FiPlus />}
          >
            Thêm xe đầu tiên
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} hoverable className="overflow-hidden">
              <div className="h-48 bg-gray-100">
                <img 
                  src={vehicle.image} 
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <Card.Content>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {vehicle.year} • {vehicle.color}
                  </p>
                  <p className="text-lg font-medium text-teal-600 mt-1">
                    {vehicle.licensePlate}
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <FiBattery className="mr-2" />
                      Dung lượng pin
                    </span>
                    <span className="font-medium">{vehicle.batteryCapacity}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <FiInfo className="mr-2" />
                      Số km đã đi
                    </span>
                    <span className="font-medium">{vehicle.mileage}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <FiCalendar className="mr-2" />
                      Bảo dưỡng tiếp
                    </span>
                    <span className="font-medium text-orange-600">
                      {formatDate(vehicle.nextMaintenance)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="flex-1"
                    onClick={() => handleBookMaintenance(vehicle)}
                  >
                    Đặt lịch
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedVehicle(vehicle)}
                    icon={<FiEdit2 />}
                  >
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(vehicle.id)}
                    className="text-red-600 hover:text-red-700"
                    icon={<FiTrash2 />}
                  >
                    Xóa
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
      {(showAddModal || selectedVehicle) && (
        <VehicleFormModal
          vehicle={selectedVehicle}
          onClose={() => {
            setShowAddModal(false);
            setSelectedVehicle(null);
          }}
          onSave={(vehicleData) => {
            if (selectedVehicle) {
              // cap nhat xe
              setVehicles(vehicles.map(v => 
                v.id === selectedVehicle.id ? { ...v, ...vehicleData } : v
              ));
              toast.success('Cập nhật thông tin xe thành công!');
            } else {
              // them xe
              setVehicles([...vehicles, { 
                ...vehicleData, 
                id: Date.now() 
              }]);
              toast.success('Thêm xe mới thành công!');
            }
            setShowAddModal(false);
            setSelectedVehicle(null);
          }}
        />
      )}
    </div>
  );
};

// trang modal them,sua xe
const VehicleFormModal = ({ vehicle, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    licensePlate: vehicle?.licensePlate || '',
    vin: vehicle?.vin || '',
    color: vehicle?.color || '',
    batteryCapacity: vehicle?.batteryCapacity || '',
    mileage: vehicle?.mileage || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {vehicle ? 'Chỉnh sửa thông tin xe' : 'Thêm xe mới'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hãng xe
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    required
                  >
                    <option value="">Chọn hãng xe</option>
                    <option value="VinFast">VinFast</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mẫu xe
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Năm sản xuất
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    min="2010"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biển số xe
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                    placeholder="30A-12345"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số VIN
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.vin}
                    onChange={(e) => setFormData({...formData, vin: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Màu sắc
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dung lượng pin
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.batteryCapacity}
                    onChange={(e) => setFormData({...formData, batteryCapacity: e.target.value})}
                    placeholder="75 kWh"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số km đã đi
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.mileage}
                    onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                    placeholder="10,000 km"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  {vehicle ? 'Cập nhật' : 'Thêm xe'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyVehicles;