import React, { useState, useEffect } from 'react';
import { FiUser, FiTruck, FiCheckSquare, FiUserCheck, FiFileText, FiSave, FiRotateCcw, FiCheck, FiX } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import vehicleReceptionService from '../../services/vehicleReceptionService';
import bookingService from '../../services/bookingService';
import { sparePartService } from '../../services/sparePartService';
import { maintenancePackageService } from '../../services/maintenancePackageService';
import { issueService } from '../../services/issueService';

const StaffVehicleReception = () => {
  const [formData, setFormData] = useState({
    // Thông tin khách hàng
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    
    // Thông tin xe
    vehicleModel: '',
    licensePlate: '',
    vehicleColor: '',
    vin: '',
    mileage: '',
    
    // Chọn loại dịch vụ
    services: {
      regularMaintenance: false,
      componentReplacement: false,
      technicalRepair: false
    },
    
    // Chọn kỹ thuật viên
    technicianId: '',
    
    // Ghi chú thêm
    notes: ''
  });

  const [technicians, setTechnicians] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [maintenancePackages, setMaintenancePackages] = useState([]);
  const [issues, setIssues] = useState([]);
  const [selectedMaintenancePackages, setSelectedMaintenancePackages] = useState([]);
  const [selectedSpareParts, setSelectedSpareParts] = useState([]);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);
  const [loadingSpareParts, setLoadingSpareParts] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [loadingIssues, setLoadingIssues] = useState(false);

  // Load all data on mount
  useEffect(() => {
    loadTechnicians();
    loadSpareParts();
    loadMaintenancePackages();
    loadIssues();
  }, []);

  // Calculate total cost based on selected items
  useEffect(() => {
    let cost = 0;
    
    // Add maintenance packages cost
    selectedMaintenancePackages.forEach(packageId => {
      const pkg = maintenancePackages.find(p => p.packageId === packageId);
      if (pkg) cost += pkg.price;
    });
    
    // Add spare parts cost
    selectedSpareParts.forEach(partId => {
      const part = spareParts.find(p => (p.partId || p.sparePartId) === partId);
      if (part) cost += (part.unitPrice || part.price || 0);
    });
    
    // Note: Issues don't have prices - they're just for tracking technical problems
    
    setTotalCost(cost);
  }, [selectedMaintenancePackages, selectedSpareParts, selectedIssues, maintenancePackages, spareParts, issues]);

  const loadTechnicians = async () => {
    setLoadingTechnicians(true);
    try {
      const result = await bookingService.getTechnicians();
      if (result.success) {
        const formattedTechs = result.data.map(tech => ({
          id: tech.employeeId,
          name: tech.name,
          available: true
        }));
        setTechnicians(formattedTechs);
      } else {
        toast.error(result.error || 'Không thể tải danh sách kỹ thuật viên');
      }
    } catch (error) {
      console.error('Error loading technicians:', error);
      toast.error('Lỗi khi tải danh sách kỹ thuật viên');
    } finally {
      setLoadingTechnicians(false);
    }
  };

  const loadSpareParts = async () => {
    setLoadingSpareParts(true);
    try {
      // Try to get in-stock parts first
      let response = await sparePartService.getInStockParts();
      
      // If no in-stock parts, get all parts
      if (!response || response.length === 0) {
        console.log('No in-stock parts, loading all parts...');
        response = await sparePartService.getAllSpareParts();
      }
      
      console.log('Spare parts loaded:', response);
      setSpareParts(response || []);
      
      if (!response || response.length === 0) {
        toast.info('Chưa có phụ tùng nào trong kho');
      }
    } catch (error) {
      console.error('Error loading spare parts:', error);
      toast.error('Lỗi khi tải danh sách phụ tùng: ' + error.message);
      setSpareParts([]); // Set empty array on error
    } finally {
      setLoadingSpareParts(false);
    }
  };

  const loadMaintenancePackages = async () => {
    setLoadingPackages(true);
    try {
      const response = await maintenancePackageService.getAllPackages();
      console.log('Maintenance packages loaded:', response);
      setMaintenancePackages(response || []);
    } catch (error) {
      console.error('Error loading maintenance packages:', error);
      toast.error('Lỗi khi tải danh sách gói bảo dưỡng');
      setMaintenancePackages([]);
    } finally {
      setLoadingPackages(false);
    }
  };

  const loadIssues = async () => {
    setLoadingIssues(true);
    try {
      const response = await issueService.getAllIssues();
      console.log('Issues loaded:', response);
      setIssues(response || []);
    } catch (error) {
      console.error('Error loading issues:', error);
      toast.error('Lỗi khi tải danh sách vấn đề');
      setIssues([]);
    } finally {
      setLoadingIssues(false);
    }
  };

  const toggleMaintenancePackage = (packageId) => {
    setSelectedMaintenancePackages(prev => 
      prev.includes(packageId) ? prev.filter(id => id !== packageId) : [...prev, packageId]
    );
  };

  const toggleSparePart = (partId) => {
    setSelectedSpareParts(prev => 
      prev.includes(partId) ? prev.filter(id => id !== partId) : [...prev, partId]
    );
  };

  const toggleIssue = (issueId) => {
    setSelectedIssues(prev => 
      prev.includes(issueId) ? prev.filter(id => id !== issueId) : [...prev, issueId]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceChange = (serviceName) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [serviceName]: !prev.services[serviceName]
      }
    }));
  };

  const handleReset = () => {
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      vehicleModel: '',
      licensePlate: '',
      vehicleColor: '',
      vin: '',
      mileage: '',
      services: {
        regularMaintenance: false,
        componentReplacement: false,
        technicalRepair: false
      },
      technicianId: '',
      notes: ''
    });
    setSelectedMaintenancePackages([]);
    setSelectedSpareParts([]);
    setSelectedIssues([]);
    toast.success('Đã làm mới form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.customerName || !formData.customerPhone) {
      toast.error('Vui lòng nhập đầy đủ thông tin khách hàng');
      return;
    }
    
    if (!formData.vehicleModel || !formData.licensePlate) {
      toast.error('Vui lòng nhập đầy đủ thông tin xe');
      return;
    }
    
    const selectedServices = Object.keys(formData.services).filter(key => formData.services[key]);
    if (selectedServices.length === 0) {
      toast.error('Vui lòng chọn ít nhất một loại dịch vụ');
      return;
    }
    
    if (!formData.technicianId) {
      toast.error('Vui lòng chọn kỹ thuật viên phụ trách');
      return;
    }

    // Prepare data for API
    const receptionData = {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail || null,
      vehicleModel: formData.vehicleModel,
      licensePlate: formData.licensePlate,
      vehicleColor: formData.vehicleColor || null,
      vin: formData.vin || null,
      mileage: formData.mileage ? parseInt(formData.mileage) : null,
      services: selectedServices,
      selectedMaintenancePackages: selectedMaintenancePackages,
      selectedSpareParts: selectedSpareParts,
      selectedIssues: selectedIssues,
      technicianId: parseInt(formData.technicianId),
      notes: formData.notes || null
    };

    setLoading(true);
    try {
      const result = await vehicleReceptionService.createReception(receptionData);
      
      if (result.success) {
        toast.success('Đã xác nhận tiếp nhận xe thành công!');
        console.log('Reception created:', result.data);
        
        // Reload spare parts to reflect updated quantities
        loadSpareParts();
        
        // Reset form after successful submission
        setTimeout(() => {
          handleReset();
        }, 1500);
      } else {
        toast.error(result.error || 'Không thể tạo phiếu tiếp nhận');
      }
    } catch (error) {
      console.error('Error submitting reception:', error);
      toast.error('Đã xảy ra lỗi khi tạo phiếu tiếp nhận');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <FiCheckSquare className="text-3xl" />
          Phiếu tiếp nhận xe khách
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Thông tin khách hàng */}
          <Card className="border border-blue-200">
            <Card.Content className="p-6">
              <h2 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                <FiUser />
                Thông tin khách hàng
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="Họ và tên khách hàng"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      placeholder="VD: 0909123456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div></div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    placeholder="VD: ten@gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Thông tin xe */}
          <Card className="border border-blue-200">
            <Card.Content className="p-6">
              <h2 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                <FiTruck />
                Thông tin xe
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mẫu xe
                    </label>
                    <input
                      type="text"
                      name="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={handleInputChange}
                      placeholder="VD: Feliz S, Evo, ..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biển số <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="licensePlate"
                      value={formData.licensePlate}
                      onChange={handleInputChange}
                      placeholder="VD: 51H-123.45"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div></div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Màu xe
                  </label>
                  <input
                    type="text"
                    name="vehicleColor"
                    value={formData.vehicleColor}
                    onChange={handleInputChange}
                    placeholder="VD: Đen"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số khung VIN
                  </label>
                  <input
                    type="text"
                    name="vin"
                    value={formData.vin}
                    onChange={handleInputChange}
                    placeholder="VD: VF123456789VN001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số km đã đi
                  </label>
                  <input
                    type="text"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    placeholder="VD: 12000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Chọn loại dịch vụ */}
        <Card className="border border-blue-200 mb-6">
          <Card.Content className="p-6">
            <h2 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
              <FiCheckSquare />
              Chọn loại dịch vụ
            </h2>
            
            <div className="space-y-6">
              {/* Bảo dưỡng định kỳ */}
              <div>
                <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.services.regularMaintenance}
                    onChange={() => handleServiceChange('regularMaintenance')}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-base font-semibold text-gray-900">Bảo dưỡng định kỳ</span>
                </label>
                
                {formData.services.regularMaintenance && (
                  <div className="mt-3 ml-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-700 mb-3">
                      Chọn gói bảo dưỡng:
                    </p>
                    {loadingPackages ? (
                      <p className="text-sm text-gray-600">Đang tải danh sách gói bảo dưỡng...</p>
                    ) : maintenancePackages.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500 mb-2">Chưa có gói bảo dưỡng nào</p>
                        <button 
                          type="button"
                          onClick={loadMaintenancePackages}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Thử tải lại
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {maintenancePackages.map((pkg) => (
                          <label key={pkg.packageId} className="flex items-center gap-2 p-2 bg-white border rounded cursor-pointer hover:bg-blue-50">
                            <input
                              type="checkbox"
                              checked={selectedMaintenancePackages.includes(pkg.packageId)}
                              onChange={() => toggleMaintenancePackage(pkg.packageId)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <span className="text-sm text-gray-800">{pkg.packageName}</span>
                                <span className="text-xs text-blue-600 font-medium ml-2">
                                  {pkg.price.toLocaleString('vi-VN')}₫
                                </span>
                              </div>
                              {pkg.description && (
                                <span className="text-xs text-gray-500 block mt-1">
                                  {pkg.description}
                                </span>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Thay thế phụ tùng */}
              <div>
                <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.services.componentReplacement}
                    onChange={() => handleServiceChange('componentReplacement')}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-base font-semibold text-gray-900">Thay thế phụ tùng</span>
                </label>
                
                {formData.services.componentReplacement && (
                  <div className="mt-3 ml-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-700 mb-3">
                      Chọn phụ tùng cần thay:
                    </p>
                    {loadingSpareParts ? (
                      <p className="text-sm text-gray-600">Đang tải danh sách phụ tùng...</p>
                    ) : spareParts.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500 mb-2">Chưa có phụ tùng nào trong hệ thống</p>
                        <button 
                          type="button"
                          onClick={loadSpareParts}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Thử tải lại
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                        {spareParts.map((part) => {
                          const partId = part.partId || part.sparePartId;
                          const partName = part.partName || part.sparePartName;
                          const partPrice = part.unitPrice || part.price || 0;
                          const stockQty = part.stockQuantity || part.quantity || 0;
                          const partCategory = part.category ? (typeof part.category === 'object' ? part.category.name : part.category) : 'N/A';
                          
                          return (
                            <label key={partId} className="flex items-center gap-2 p-2 bg-white border rounded cursor-pointer hover:bg-green-50">
                              <input
                                type="checkbox"
                                checked={selectedSpareParts.includes(partId)}
                                onChange={() => toggleSparePart(partId)}
                                className="w-4 h-4 text-green-600"
                                disabled={stockQty === 0 || !part.inStock}
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <span className="text-sm text-gray-800">{partName}</span>
                                  <span className="text-xs text-green-600 font-medium ml-2">
                                    {partPrice.toLocaleString('vi-VN')}₫
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  Kho: {stockQty} | {partCategory}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sửa chữa kỹ thuật */}
              <div>
                <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.services.technicalRepair}
                    onChange={() => handleServiceChange('technicalRepair')}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-base font-semibold text-gray-900">Sửa chữa kỹ thuật</span>
                </label>
                
                {formData.services.technicalRepair && (
                  <div className="mt-3 ml-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm font-semibold text-orange-700 mb-3">
                      Chọn vấn đề kỹ thuật cần sửa chữa:
                    </p>
                    {loadingIssues ? (
                      <p className="text-sm text-gray-600">Đang tải danh sách vấn đề...</p>
                    ) : issues.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500 mb-2">Chưa có vấn đề kỹ thuật nào</p>
                        <button 
                          type="button"
                          onClick={loadIssues}
                          className="text-xs text-orange-600 hover:underline"
                        >
                          Thử tải lại
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {issues.map((issue) => (
                          <label key={issue.issueId} className="flex items-center gap-2 p-2 bg-white border rounded cursor-pointer hover:bg-orange-50">
                            <input
                              type="checkbox"
                              checked={selectedIssues.includes(issue.issueId)}
                              onChange={() => toggleIssue(issue.issueId)}
                              className="w-4 h-4 text-orange-600"
                            />
                            <div className="flex-1">
                              <span className="text-sm text-gray-800">{issue.issueName}</span>
                              {issue.description && (
                                <span className="text-xs text-gray-500 block mt-1">
                                  {issue.description}
                                </span>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Tổng chi phí - Chọn kỹ thuật viên - Ghi chú */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Tổng chi phí */}
          <Card className="border-l-4 border-l-blue-600">
            <Card.Content className="p-6 text-right">
              <p className="text-sm text-gray-600 mb-2">Tổng chi phí:</p>
              <p className="text-3xl font-bold text-blue-700">
                {totalCost.toLocaleString('vi-VN')}₫
              </p>
            </Card.Content>
          </Card>

          {/* Chọn kỹ thuật viên phụ trách */}
          <Card className="border border-blue-200 lg:col-span-2">
            <Card.Content className="p-6">
              <h2 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                <FiUserCheck />
                Chọn kỹ thuật viên phụ trách
              </h2>
              
              <select
                name="technicianId"
                value={formData.technicianId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Chọn kỹ thuật viên --</option>
                {technicians.map(tech => (
                  <option key={tech.id} value={tech.id} disabled={!tech.available}>
                    {tech.name} {!tech.available ? '(Đang bận)' : ''}
                  </option>
                ))}
              </select>
            </Card.Content>
          </Card>
        </div>

        {/* Ghi chú thêm */}
        <Card className="border border-blue-200 mb-6">
          <Card.Content className="p-6">
            <h2 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
              <FiFileText />
              Ghi chú thêm
            </h2>
            
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="4"
              placeholder="Ghi chú về xe hoặc yêu cầu của khách"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <FiRotateCcw className="mr-2" />
            Đặt lại
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loading || loadingTechnicians}
          >
            <FiCheckSquare className="mr-2" />
            {loading ? 'Đang xử lý...' : 'Xác nhận tiếp nhận'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StaffVehicleReception;
