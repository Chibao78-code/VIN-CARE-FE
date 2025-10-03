import React, { useState, useEffect } from 'react';
import { FiMapPin, FiPhone, FiClock, FiStar, FiNavigation, FiChevronRight } from 'react-icons/fi';
import { serviceCenters, calculateDistance } from '../../../data/serviceCenters';
import Button from '../../ui/Button';

const SelectCenter = ({ data, onNext }) => {
  const [centers, setCenters] = useState(serviceCenters);
  const [selectedCenter, setSelectedCenter] = useState(data.center);
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    // hoi user chap nhan vi tri
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // tinh khoang cach va sap xep
          const centersWithDistance = serviceCenters.map(center => ({
            ...center,
            distance: calculateDistance(latitude, longitude, center.lat, center.lng)
          })).sort((a, b) => a.distance - b.distance);
          
          setCenters(centersWithDistance);
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoadingLocation(false);
        }
      );
    }
  }, []);

  const handleSelectCenter = (center) => {
    setSelectedCenter(center);
  };

  const handleNext = () => {
    if (selectedCenter) {
      onNext({ center: selectedCenter });
    }
  };

  const isToday = (days) => {
    const today = new Date().getDay();
    const dayMap = { 'CN': 0, 'T2': 1, 'T3': 2, 'T4': 3, 'T5': 4, 'T6': 5, 'T7': 6 };
    const todayName = Object.keys(dayMap).find(key => dayMap[key] === today);
    return days.includes(todayName);
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Chọn trung tâm dịch vụ VinFast
        </h3>
        <p className="text-sm text-gray-600">
          Chọn trung tâm dịch vụ gần bạn nhất hoặc thuận tiện nhất
        </p>
        
        {loadingLocation && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            <FiNavigation className="inline mr-2 animate-pulse" />
            Đang xác định vị trí của bạn...
          </div>
        )}
      </div>

      <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
        {centers.map((center) => (
          <div
            key={center.id}
            onClick={() => handleSelectCenter(center)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md
              ${selectedCenter?.id === center.id 
                ? 'border-teal-500 bg-teal-50' 
                : 'border-gray-200 hover:border-teal-300'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-gray-900">{center.name}</h4>
                  {center.distance && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {center.distance} km
                    </span>
                  )}
                </div>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiMapPin className="mr-2 text-gray-400 flex-shrink-0" />
                    <span>{center.address}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <FiPhone className="mr-2 text-gray-400" />
                    <span>{center.phone}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <FiClock className="mr-2 text-gray-400" />
                    <span>{center.openTime} - {center.closeTime}</span>
                    <span className="ml-2">
                      ({center.workingDays.join(', ')})
                    </span>
                    {isToday(center.workingDays) && (
                      <span className="ml-2 text-green-600 font-medium">Hôm nay mở cửa</span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <FiStar className="mr-1 text-yellow-500" />
                    <span className="text-gray-700 font-medium">{center.rating}</span>
                    <span className="ml-3 text-gray-600">
                      {center.technicians} kỹ thuật viên
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {center.services.includes('maintenance') && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      Bảo dưỡng
                    </span>
                  )}
                  {center.services.includes('repair') && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      Sửa chữa
                    </span>
                  )}
                  {center.services.includes('parts') && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      Phụ tùng
                    </span>
                  )}
                  {center.services.includes('emergency') && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                      Cứu hộ 24/7
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!selectedCenter}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6"
        >
          Tiếp tục
          <FiChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default SelectCenter;
