import React, { useState } from 'react';
import { FiChevronRight, FiTool, FiPackage, FiSettings, FiCheck, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { serviceDetails, vinfastModels } from '../../../data/serviceCenters';
import Button from '../../ui/Button';

const SelectService = ({ data, onNext, onBack }) => {
  const [selectedService, setSelectedService] = useState(data.service || null);
  const [selectedPackage, setSelectedPackage] = useState(data.servicePackage || null);
  const [selectedParts, setSelectedParts] = useState(data.parts || []);
  const [partsSearch, setPartsSearch] = useState('');
  const [problemDescription, setProblemDescription] = useState(data.problemDescription || '');
  const [selectedVehicle, setSelectedVehicle] = useState(data.vehicle || '');
  const [selectedIssue, setSelectedIssue] = useState('');

  const services = [
    { ...serviceDetails.maintenance, icon: <FiTool /> },
    { ...serviceDetails.parts, icon: <FiPackage /> },
    { ...serviceDetails.repair, icon: <FiSettings /> }
  ];

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedPackage(null);
    setSelectedParts([]);
    setProblemDescription('');
  };

  const handlePartToggle = (part) => {
    if (selectedParts.find(p => p.id === part.id)) {
      setSelectedParts(selectedParts.filter(p => p.id !== part.id));
    } else {
      setSelectedParts([...selectedParts, part]);
    }
  };

  const handleNext = () => {
    const serviceData = {
      service: selectedService,
      vehicle: selectedVehicle
    };

    if (selectedService?.id === 'maintenance') {
      serviceData.servicePackage = selectedPackage;
    } else if (selectedService?.id === 'parts') {
      serviceData.parts = selectedParts;
    } else if (selectedService?.id === 'repair') {
      serviceData.problemDescription = problemDescription;
    }

    onNext(serviceData);
  };

  const canProceed = () => {
    if (!selectedService || !selectedVehicle) return false;
    
    if (selectedService.id === 'maintenance') {
      return selectedPackage !== null;
    } else if (selectedService.id === 'parts') {
      return selectedParts.length > 0;
    } else if (selectedService.id === 'repair') {
      return problemDescription.trim().length > 10;
    }
    return false;
  };

  const filteredParts = selectedService?.id === 'parts' 
    ? serviceDetails.parts.commonParts.filter(part => 
        part.name.toLowerCase().includes(partsSearch.toLowerCase())
      )
    : [];

  const calculateTotal = () => {
    let total = 0;
    if (selectedService?.id === 'maintenance' && selectedPackage) {
      total = selectedPackage.price;
    } else if (selectedService?.id === 'parts') {
      total = selectedParts.reduce((sum, part) => sum + part.price, 0);
    }
    return total;
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Chọn loại dịch vụ
        </h3>
        <p className="text-sm text-gray-600">
          Ngày hẹn: {new Date(data.date).toLocaleDateString('vi-VN')} tại {data.center?.name}
        </p>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chọn dòng xe VinFast của bạn <span className="text-red-500">*</span>
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
        >
          <option value="">-- Chọn dòng xe --</option>
          {vinfastModels.map(model => (
            <option key={model.id} value={model.id}>
              {model.name} ({model.batteryCapacity})
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => handleServiceSelect(service)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all
              ${selectedService?.id === service.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'}`}
          >
            <div className="flex items-center mb-2">
              <div className="text-2xl mr-3 text-blue-600">{service.icon}</div>
              <h4 className="font-semibold text-gray-900">{service.name}</h4>
            </div>
            <p className="text-sm text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
      {selectedService && (
        <div className="border-t pt-6">
          {selectedService.id === 'maintenance' && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Chọn gói bảo dưỡng:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedService.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${selectedPackage?.id === pkg.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-gray-900">{pkg.name}</h5>
                      <span className="text-blue-600 font-bold">
                        {pkg.price.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      Thời gian: {pkg.duration} phút
                    </p>
                    <ul className="space-y-1">
                      {pkg.includes.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <FiCheck className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedService.id === 'parts' && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Chọn phụ tùng cần thay thế:</h4>
              <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phụ tùng..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={partsSearch}
                  onChange={(e) => setPartsSearch(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {filteredParts.map((part) => (
                  <div
                    key={part.id}
                    onClick={() => part.inStock && handlePartToggle(part)}
                    className={`p-3 border rounded-lg transition-all
                      ${!part.inStock 
                        ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50' 
                        : selectedParts.find(p => p.id === part.id)
                        ? 'border-blue-500 bg-blue-50 cursor-pointer'
                        : 'border-gray-200 hover:border-blue-300 cursor-pointer'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{part.name}</p>
                        <p className="text-sm text-gray-600">
                          {part.price.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                      <div className="text-right">
                        {part.inStock ? (
                          <span className="text-xs text-green-600 font-medium">Còn hàng</span>
                        ) : (
                          <span className="text-xs text-red-600 font-medium">Hết hàng</span>
                        )}
                        {selectedParts.find(p => p.id === part.id) && (
                          <FiCheck className="text-blue-600 ml-2" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedParts.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    Đã chọn {selectedParts.length} phụ tùng - 
                    Tổng: {calculateTotal().toLocaleString('vi-VN')}đ
                  </p>
                </div>
              )}
            </div>
          )}
          {selectedService.id === 'repair' && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Mô tả vấn đề cần sửa chữa:</h4>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Vấn đề thường gặp:</p>
                <div className="flex flex-wrap gap-2">
                  {serviceDetails.repair.commonIssues.map((issue) => (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => {
                        setSelectedIssue(issue);
                        if (issue !== 'Khác') {
                          setProblemDescription(issue + '. ');
                        }
                      }}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors
                        ${selectedIssue === issue 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                      {issue}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={4}
                placeholder="Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải... (tối thiểu 10 ký tự)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
              />
              
              <p className="text-xs text-gray-500 mt-1">
                {problemDescription.length}/500 ký tự
              </p>

              {problemDescription.length > 0 && problemDescription.length < 10 && (
                <p className="text-xs text-red-600 mt-1">
                  <FiAlertCircle className="inline mr-1" />
                  Vui lòng mô tả chi tiết hơn (tối thiểu 10 ký tự)
                </p>
              )}
            </div>
          )}
        </div>
      )}
      {selectedService && (selectedService.id === 'maintenance' || selectedService.id === 'parts') && calculateTotal() > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Tạm tính:</span>
            <span className="text-xl font-bold text-blue-600">
              {calculateTotal().toLocaleString('vi-VN')}đ
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            * Giá có thể thay đổi tùy theo tình trạng thực tế của xe
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          Tiếp tục
          <FiChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default SelectService;
