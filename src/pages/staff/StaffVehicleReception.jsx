import { useState, useEffect, useRef } from 'react';
import { FiUser, FiTruck, FiCheckSquare, FiUserCheck, FiFileText, FiRotateCcw, FiCheckCircle, FiPackage, FiTool } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import receptionService from '../../services/receptionService';
import bookingService from '../../services/bookingService';
import vehicleService from '../../services/vehicleService';
import { maintenancePackageService } from '../../services/maintenancePackageService';
import { sparePartService } from '../../services/sparePartService';
import BookingSlotsDisplay from '../../components/reception/BookingSlotsDisplay.jsx';
import WalkinReceptionsDisplay from '../../components/reception/WalkinReceptionsDisplay.jsx';

const StaffVehicleReception = () => {
  const [formData, setFormData] = useState({
    // Liên kết với booking (nếu có)
    bookingId: null,
    
    // Thông tin khách hàng
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    
    // Thông tin xe
    vehicleModel: '',
    licensePlate: '',
    vin: '',
    mileage: '',
    
    // Chọn kỹ thuật viên
    technicianId: '',
    
    // Chọn dịch vụ
    selectedOfferTypes: [], // vong lap offerTypeId
    selectedPackages: [], //  vong lap packageId
    selectedSpareParts: [], // vong lap sparePartId
    
    // Ghi chú thêm
    notes: '',
    issueDescription: '' // Mô tả vấn đề khi chọn dịch vụ sửa chữa
  });
  // state danh sach chuyen vien, mau xe, loai dich vu, goi bao duong, phu tung
  const [technicians, setTechnicians] = useState([]);
  const [evModels, setEvModels] = useState([]);
  const [offerTypes, setOfferTypes] = useState([]);
  const [availablePackages, setAvailablePackages] = useState({}); //  Grouped by offerTypeId
  const [availableSpareParts, setAvailableSpareParts] = useState([]); // All spare parts from inventory
  const [bookingSlots, setBookingSlots] = useState(null); // Booking slots for current + next 2 slots
  const [walkinReceptions, setWalkinReceptions] = useState(null); // Walk-in receptions queue (FIFO)
  const [loading, setLoading] = useState(false);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingOfferTypes, setLoadingOfferTypes] = useState(false);
  const [loadingBookingSlots, setLoadingBookingSlots] = useState(false);
  const [loadingWalkin, setLoadingWalkin] = useState(false);
  const [searchingVehicle, setSearchingVehicle] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(null);
  const [vehicleNotFound, setVehicleNotFound] = useState(false);
  const searchTimeoutRef = useRef(null);

  //  khoi phuc du lieu form tu localStorage neu co
  useEffect(() => {
    const savedFormData = localStorage.getItem('receptionFormData');
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        setFormData(prev => ({ ...prev, ...parsed }));
        console.log('✅ Restored form data from localStorage');
      } catch (error) {
        console.error('Error restoring form data:', error);
      }
    }
  }, []);

  //  luu form data vao localStorage khi thay doi
  useEffect(() => {
    //  Chỉ lưu nếu có dữ liệu quan trọng
    if (formData.customerName || formData.licensePlate || formData.selectedPackages.length > 0) {
      localStorage.setItem('receptionFormData', JSON.stringify(formData));
    }
  }, [formData]);

  //  load data ban dau
  useEffect(() => {
    loadTechnicians();
    loadEvModels();
    loadOfferTypes();
    loadPackages();
    loadSpareParts();
    loadBookingSlots(); // Load booking slots for display
    loadWalkinQueue(); // Load walk-in receptions queue
    
    //  tu fong dien dat lich 
    const bookingDataStr = sessionStorage.getItem('bookingForReception');
    
    if (bookingDataStr) {
      try {
        const bookingData = JSON.parse(bookingDataStr);
        
        //  dien thong tin tu booking
        setFormData(prev => ({
          ...prev,
          bookingId: bookingData.bookingId || null,
          customerName: bookingData.customerName || '',
          customerPhone: bookingData.customerPhone || '',
          customerEmail: bookingData.customerEmail || '',
          customerAddress: bookingData.customerAddress || '',
          vehicleModel: bookingData.vehicleModel || '',
          licensePlate: bookingData.licensePlate || '',
          vin: bookingData.vin || '',
          mileage: bookingData.mileage || '',
          notes: bookingData.notes || '',
          technicianId: bookingData.technicianId || '' 
        }));
        
        //  thong bao da tai du lieu booking
        if (bookingData.technicianId) {
          toast.success(`Đã tải thông tin từ booking #${bookingData.bookingId} và phân công kỹ thuật viên`);
        } else {
          toast.success(`Đã tải thông tin từ booking #${bookingData.bookingId}`);
        }
        
        //  xoa sessionStorage sau khi tai
        sessionStorage.removeItem('bookingForReception');
      } catch (error) {
        console.error('Error loading booking data:', error);
        toast.error('Lỗi khi tải dữ liệu booking');
      }
    }
  }, []);
  //  load danh sach ky thuat vien
  const loadTechnicians = async () => {
    setLoadingTechnicians(true);
    try {
      //  Lấy danh sách kỹ thuật viên từ backend
      const result = await bookingService.getMyTechnicians();
      
      if (result.success) {
        // Giữ tất cả dữ liệu kỹ thuật viên bao gồm trạng thái làm việc
        const formattedTechs = result.data.map(tech => ({
          id: tech.employeeId,
          employeeId: tech.employeeId,
          name: tech.name,
          phone: tech.phone,
          workingStatus: tech.workingStatus || 'AVAILABLE',
          available: tech.workingStatus === 'AVAILABLE' || !tech.workingStatus
        }));
        
        console.log('📋 Technicians loaded in Vehicle Reception:', formattedTechs);
        setTechnicians(formattedTechs);
         // thong bao neu khong co ky thuat vien
        if (formattedTechs.length === 0) {
          toast('Chưa có kỹ thuật viên nào tại trung tâm của bạn');
        }
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
  //  load mau xe dien
  const loadEvModels = async () => {
    setLoadingModels(true);
    try {
      const models = await vehicleService.getAllModels();
      setEvModels(models || []);
    } catch (error) {
      console.error('Error loading EV models:', error);
      toast.error('Lỗi khi tải danh sách mẫu xe');
    } finally {
      setLoadingModels(false);
    }
  };
  // load loai dich vu
  const loadOfferTypes = async () => {
    setLoadingOfferTypes(true);
    try {
      console.log('🔄 Loading offer types...');
      const result = await bookingService.getOfferTypes();
      console.log('📦 Offer types result:', result);
      // Kiểm tra và xử lý kết quả
      if (result.success) {
        console.log('✅ Offer types loaded:', result.data);
        setOfferTypes(result.data || []);
        // thong bao neu khong co loai dich vu
        if (!result.data || result.data.length === 0) {
          toast('Chưa có loại dịch vụ nào trong hệ thống');
        }
      } else {
        console.error('❌ Failed to load offer types:', result.error);
        toast.error(result.error || 'Không thể tải danh sách loại dịch vụ');
      }
    } catch (error) {
      console.error('❌ Error loading offer types:', error);
      toast.error('Lỗi khi tải danh sách loại dịch vụ');
    } finally {
      setLoadingOfferTypes(false);
    }
  };
  // load goi bao duong
  const loadPackages = async () => {
    try {
      console.log('🔄 Loading maintenance packages...');
      const result = await maintenancePackageService.getAllPackages();
      // Kiểm tra và xử lý kết quả
      if (result.success) {
        console.log('✅ Packages loaded:', result.data);
        
        // Group packages by offerType for UI
        const groupedPackages = {};
        if (result.data && Array.isArray(result.data)) {
          result.data.forEach(pkg => {
            //  map offerType sang offerTypeId
            const offerTypeMap = {
              'MAINTENANCE': 1,
              'REPLACEMENT': 2,
              'REPAIR': 3
            };
            const offerTypeId = offerTypeMap[pkg.offerType] || 1;
            
            if (!groupedPackages[offerTypeId]) {
              groupedPackages[offerTypeId] = [];
            }
            groupedPackages[offerTypeId].push(pkg);
          });
        }
         // luu goi bao duong da nhom
        setAvailablePackages(groupedPackages);
        console.log('📦 Grouped packages:', groupedPackages);
        // thong bao neu khong co goi bao duong
        if (!result.data || result.data.length === 0) {
          toast('Chưa có gói bảo dưỡng nào trong hệ thống');
        }
      } else {
        console.error('❌ Failed to load packages:', result.error);
        toast.error(result.error || 'Không thể tải danh sách gói bảo dưỡng');
      }
    } catch (error) {
      console.error('❌ Error loading packages:', error);
      toast.error('Lỗi khi tải danh sách gói bảo dưỡng');
    }
  };
  //    load khung gio dat lich
  const loadBookingSlots = async () => {
    setLoadingBookingSlots(true);
    try {
      console.log('🔄 Loading booking slots for my center...');
      // Không cần truyền centerId - backend lấy từ @AuthenticationPrincipal
      const result = await bookingService.getMyBookingSlots();
      
      console.log('📦 Raw API result:', result);
      // Kiểm tra và xử lý kết quả
      if (result.success) {
        console.log('✅ Booking slots loaded successfully:', result.data);
        setBookingSlots(result.data);
      } else {
        console.error('❌ Failed to load booking slots:', result.error);
        toast.error('Không thể tải thông tin booking: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error loading booking slots:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status
      });
      toast.error('Lỗi khi tải thông tin booking');
    } finally {
      setLoadingBookingSlots(false);
    }
  };
  // load hang doi don tiep nhan khach le
  const loadWalkinQueue = async () => {
    setLoadingWalkin(true);
    try {
      console.log('🚶 Loading walk-in receptions queue...');
      const result = await receptionService.getWalkinQueue();
      // Kiểm tra và xử lý kết quả
      console.log('📦 Walk-in queue result:', result);
      
      if (result.success) {
        console.log('✅ Walk-in queue loaded:', result.data);
        setWalkinReceptions(result.data);
      } else {
        console.error('❌ Failed to load walk-in queue:', result.error);
      }
    } catch (error) {
      console.error('❌ Error loading walk-in queue:', error);
    } finally {
      setLoadingWalkin(false);
    }
  };
  // load phu tung trong kho
  const loadSpareParts = async (showToast = false) => {
    try {
      console.log('🔄 Loading spare parts from inventory...');
      const response = await sparePartService.getInStockParts();
      console.log('📦 Raw spare parts response:', response);
      console.log('📦 Response type:', typeof response);
      console.log('📦 Is array?', Array.isArray(response));
      
      if (response && Array.isArray(response)) {
        // Chuyển đổi phụ tùng để phù hợp với định dạng cần thiết
        // Backend trả về DTO: partId, partName, partNumber, category, unitPrice, stockQuantity, description
        const transformedParts = response.map(part => {
          console.log('🔧 Processing part:', part);
          return {
            sparePartId: part.partId || part.sparePartId,
            partName: part.partName || part.sparePartName,
            partNumber: part.partNumber,
            category: part.category,
            price: part.unitPrice || part.price,
            stockQuantity: part.stockQuantity || part.quantity,
            description: part.description,
            supplier: part.supplier
          };
        });
        // Cập nhật trạng thái phụ tùng có sẵn
        setAvailableSpareParts(transformedParts);
        console.log('✅ Spare parts ready:', transformedParts.length, transformedParts);
        
        // Chỉ hiển thị toast nếu được yêu cầu rõ ràng (ví dụ: tải lại thủ công)
        if (showToast) {
          if (transformedParts.length === 0) {
            toast('Chưa có phụ tùng nào trong kho');
          } else {
            toast.success(`Đã tải ${transformedParts.length} phụ tùng từ kho`);
          }
        }
      } else {
        console.warn('⚠️ Response is not an array:', response);
        setAvailableSpareParts([]);
      }
    } catch (error) {
      console.error('❌ Error loading spare parts:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Chỉ hiển thị toast lỗi cho các lỗi không phải 404
      if (error.response && error.response.status !== 404) {
        toast.error('Không thể tải danh sách phụ tùng: ' + (error.response?.data?.message || error.message));
      }
      setAvailableSpareParts([]);
    }
  };


  //  xu ly thay doi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Tự động tìm kiếm khi nhập biển số hoặc VIN (debounced)
    if ((name === 'licensePlate' || name === 'vin') && value.trim().length >= 3) {
      //  xoa timeout cu neu co
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Đặt timeout mới cho tìm kiếm
      searchTimeoutRef.current = setTimeout(() => {
        searchVehicleHistory(name === 'licensePlate' ? value : null, name === 'vin' ? value : null);
      }, 800); // Đợi 800ms sau khi người dùng ngừng gõ
    }
  };

  const searchVehicleHistory = async (licensePlate, vin) => {
    // Không tìm kiếm nếu đã có dữ liệu từ booking
    if (formData.bookingId) return;
    // Bắt đầu tìm kiếm
    setSearchingVehicle(true);
    setVehicleFound(null);
    setVehicleNotFound(false);

    try {
      const result = await vehicleService.searchVehicle(licensePlate, vin);
      // Kiểm tra kết quả
      if (result.success && result.data) {
        console.log('🔍 Vehicle found:', result.data);
        setVehicleFound(result.data);
        setVehicleNotFound(false);

        // Tự động điền thông tin khách hàng và xe từ đối tượng chủ sở hữu
        const owner = result.data.owner;
        setFormData(prev => ({
          ...prev,
          customerName: owner?.name || prev.customerName,
          customerPhone: owner?.phone || prev.customerPhone,
          customerEmail: owner?.email || prev.customerEmail,
          customerAddress: owner?.address || prev.customerAddress,
          vehicleModel: result.data.model || prev.vehicleModel,
          licensePlate: result.data.licensePlate || prev.licensePlate,
          vin: result.data.vin || prev.vin
        }));
        // thông báo tìm thấy xe
        toast.success('Tìm thấy thông tin xe trong hệ thống');
      } else if (result.notFound) {
        console.log('ℹ️ No vehicle history found');
        setVehicleFound(null);
        setVehicleNotFound(true);
      }
    } catch (error) {
      console.error('Error searching vehicle:', error);
    } finally {
      setSearchingVehicle(false);
    }
  }; 
  // xu ly chon loai dich vu
  const handleOfferTypeToggle = (offerTypeId) => {
    const isSelected = formData.selectedOfferTypes.includes(offerTypeId);
    
    if (isSelected) {
      // Xóa loại dịch vụ và xóa các lựa chọn liên quan
      const offerType = offerTypes.find(ot => ot.id === offerTypeId);
      const offerTypeName = offerType?.name?.toLowerCase() || '';
      const isRepair = offerTypeName.includes('sửa chữa') || offerTypeName.includes('sửa');
       // Xóa loại dịch vụ và xóa các lựa chọn liên quan
      setFormData(prev => ({
        ...prev,
        selectedOfferTypes: prev.selectedOfferTypes.filter(id => id !== offerTypeId),
        selectedPackages: prev.selectedPackages.filter(pkgId => {
          const pkg = availablePackages[offerTypeId]?.find(p => p.packageId === pkgId);
          return !pkg;
        }),
        // Xóa phụ tùng nếu loại bỏ dịch vụ thay thế
        selectedSpareParts: [],
        // Xóa mô tả lỗi nếu loại bỏ dịch vụ sửa chữa
        issueDescription: isRepair ? '' : prev.issueDescription
      }));
    } else {
      // Thêm loại dịch vụ
      setFormData(prev => ({
        ...prev,
        selectedOfferTypes: [...prev.selectedOfferTypes, offerTypeId]
      }));
    }
  };


  // xu ly chon phu tung
  const handleSparePartToggle = (sparePartId) => {
    setFormData(prev => ({
      ...prev,
      selectedSpareParts: prev.selectedSpareParts?.includes(sparePartId)
        ? prev.selectedSpareParts.filter(id => id !== sparePartId)
        : [...(prev.selectedSpareParts || []), sparePartId]
    }));
  };
  // xu ly chon goi bao duong
  const handlePackageToggle = (packageId) => {
    //  kiem tra goi da duoc chon
    const isCurrentlySelected = formData.selectedPackages.includes(packageId);
    
    //  lay ten goi bao duong
    const allPackages = Object.values(availablePackages).flat();
    const selectedPackage = allPackages.find(p => p.packageId === packageId);
    const packageName = selectedPackage?.packageName || 'Gói bảo dưỡng';
    
    if (isCurrentlySelected) {
      // Bỏ chọn nếu nhấn vào cùng một gói
      setFormData(prev => ({
        ...prev,
        selectedPackages: []
      }));
      toast(`Đã bỏ chọn ${packageName}`);
    } else {
      // Thay thế bằng lựa chọn mới (chỉ cho phép một gói)
      if (formData.selectedPackages.length > 0) {
        toast(`Đã thay đổi sang ${packageName}`);
      } else {
        toast.success(`Đã chọn ${packageName}`);
      }
      setFormData(prev => ({
        ...prev,
        selectedPackages: [packageId]
      }));
    }
    
    console.log('📦 Package toggled:', packageId, 'Current selection:', formData.selectedPackages);
  };
  // xu ly lam moi form
  const handleReset = () => {
    setFormData({
      bookingId: null,
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerAddress: '',
      vehicleModel: '',
      licensePlate: '',
      vin: '',
      mileage: '',
      technicianId: '',
      selectedOfferTypes: [],
      selectedPackages: [],
      selectedSpareParts: [],
      notes: '',
      issueDescription: ''
    });
    
    //  reset trang thai tim kiem xe
    setVehicleFound(null);
    setVehicleNotFound(false);
    
    //  xóa bất kỳ timeout tìm kiếm nào đang chờ
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    //  xóa dữ liệu form đã lưu trong localStorage
    localStorage.removeItem('receptionFormData');
    
    toast.success('Đã làm mới form');
  };
  // xu ly gui form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.customerName || !formData.customerPhone) {
      toast.error('Vui lòng nhập đầy đủ thông tin khách hàng');
      return;
    }
    
    if (!formData.vehicleModel || !formData.licensePlate || !formData.mileage) {
      toast.error('Vui lòng nhập đầy đủ thông tin xe (bao gồm số km)');
      return;
    }
    
    //  Validate vehicle existence
    if (!formData.bookingId && vehicleNotFound) {
      toast.error('Xe không có trong hệ thống. Vui lòng liên hệ quản lý để đăng ký xe mới.');
      return;
    }
    
    //  Validate mileage if vehicle found
    if (vehicleFound && vehicleFound.lastMileage) {
      const currentMileage = parseInt(formData.mileage);
      if (currentMileage <= vehicleFound.lastMileage) {
        toast.error(`Số km hiện tại phải lớn hơn ${vehicleFound.lastMileage.toLocaleString('vi-VN')} km (số km lần trước)`);
        return;
      }
    }
    // ktr chon dich vu sua chua
    const hasRepairService = formData.selectedOfferTypes.some(offerTypeId => {
      const offerType = offerTypes.find(ot => ot.id === offerTypeId);
      const offerTypeName = offerType?.name?.toLowerCase() || '';
      return offerTypeName.includes('sửa chữa') || offerTypeName.includes('sửa');
    });

    // Nếu chọn dịch vụ sửa chữa, phải có mô tả vấn đề kỹ thuật
    if (hasRepairService && !formData.issueDescription.trim()) {
      toast.error('Vui lòng mô tả vấn đề kỹ thuật khi chọn dịch vụ sửa chữa');
      return;
    }

    //  validation chon it nhat 1 dich vu
    const hasSelectedServices = formData.issueDescription.trim() || 
                                formData.selectedPackages.length > 0 || 
                                formData.selectedSpareParts?.length > 0;
    
    if (!hasSelectedServices) {
      toast.error('Vui lòng chọn ít nhất một dịch vụ (gói bảo dưỡng, mô tả vấn đề, hoặc phụ tùng)');
      return;
    }

    //  Chuẩn bị dữ liệu gửi lên backend
    const receptionData = {
      bookingId: formData.bookingId || null,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail || null,
      customerAddress: formData.customerAddress || null,
      vehicleModel: formData.vehicleModel,
      licensePlate: formData.licensePlate,
      mileage: formData.mileage ? parseInt(formData.mileage) : null,
      technicianId: formData.technicianId ? parseInt(formData.technicianId) : null,
      issueDescription: formData.issueDescription.trim() || null, // Issue description for repair service
      selectedMaintenancePackages: formData.selectedPackages.length > 0 ? formData.selectedPackages[0] : null, // Send single package ID as Integer
      selectedSpareParts: formData.selectedSpareParts?.length > 0 ? formData.selectedSpareParts : null,
      notes: formData.notes || null
    };

    console.log('📤 Sending reception data:', receptionData);
    console.log('📦 Selected packages:', formData.selectedPackages);

    setLoading(true);
    try {
      const result = await receptionService.createReception(receptionData);
      
      if (result.success) {
        const hasServices = formData.issueDescription.trim() || formData.selectedPackages.length > 0;
        const message = hasServices 
          ? 'Đã tiếp nhận xe và chọn dịch vụ thành công!'
          : 'Đã tiếp nhận xe thành công! Kỹ thuật viên sẽ kiểm tra và đề xuất dịch vụ.';
        toast.success(message);
        
        //  reset form sau khi tao thanh cong
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
  // giao dien jsx
  return (
    <div>
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          Phiếu tiếp nhận xe khách
        </h1>
        <p className="text-gray-600 mt-1">Tạo phiếu tiếp nhận và ghi nhận thông tin xe</p>
      </div>

      {/* Booking Info Banner */}
      {formData.bookingId && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-lg">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-blue-600 text-xl" />
            <div className="flex-1">
              <p className="font-semibold text-blue-900">
                Khách hàng có đặt lịch - Booking #{formData.bookingId}
              </p>
              <p className="text-sm text-blue-700">
                Dữ liệu đã được tự động điền vào form. Bạn có thể chỉnh sửa nếu cần.
              </p>
              {formData.technicianId && (
                <p className="text-sm text-green-700 font-medium mt-1">
                  ✓ Kỹ thuật viên đã được phân công
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Thông tin khách hàng */}
          <Card className="border border-blue-200">
            <Card.Content className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                  <FiUser />
                  Thông tin khách hàng
                </h2>
                {!formData.bookingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        customerName: '',
                        customerPhone: '',
                        customerEmail: '',
                        customerAddress: ''
                      }));
                      toast.success('Đã xóa thông tin khách hàng');
                    }}
                    className="text-xs text-red-400 hover:text-red-600 underline"
                  >
                    Xóa
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                    {formData.bookingId && (
                      <span className="ml-2 text-xs text-gray-500">(từ booking, không thể sửa)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Họ và tên khách hàng"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    disabled={!!formData.bookingId}
                  />
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                    {formData.bookingId && (
                      <span className="ml-2 text-xs text-gray-500">(từ booking, không thể sửa)</span>
                    )}
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    placeholder="VD: ten@gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={!!formData.bookingId}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                    {formData.bookingId && (
                      <span className="ml-2 text-xs text-gray-500">(từ booking, không thể sửa)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={!!formData.bookingId}
                  />
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Thông tin xe */}
          <Card className="border border-blue-200">
            <Card.Content className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                  <FiTruck />
                  Thông tin xe
                </h2>
                {!formData.bookingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        vehicleModel: '',
                        licensePlate: '',
                        vin: '',
                        mileage: ''
                      }));
                      setVehicleFound(null);
                      setVehicleNotFound(false);
                      toast.success('Đã xóa thông tin xe');
                    }}
                    className="text-xs text-red-400 hover:text-red-600 underline"
                  >
                    Xóa
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mẫu xe <span className="text-red-500">*</span>
                    {(formData.bookingId || vehicleFound) && (
                      <span className="ml-2 text-xs text-gray-500">
                        {formData.bookingId ? '(từ booking, không thể sửa)' : '(từ hệ thống, không thể sửa)'}
                      </span>
                    )}
                  </label>
                  <select
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    disabled={!!formData.bookingId || !!vehicleFound}
                  >
                    <option value="">-- Chọn mẫu xe --</option>
                    {loadingModels ? (
                      <option disabled>Đang tải...</option>
                    ) : (
                      evModels.map((model) => (
                        <option key={model.modelId} value={model.modelName}>
                          {model.modelName}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biển số <span className="text-red-500">*</span>
                    {(formData.bookingId || vehicleFound) && (
                      <span className="ml-2 text-xs text-gray-500">
                        {formData.bookingId ? '(từ booking, không thể sửa)' : '(từ hệ thống, không thể sửa)'}
                      </span>
                    )}
                    {searchingVehicle && !formData.bookingId && (
                      <span className="ml-2 text-xs text-blue-600">🔍 Đang tìm kiếm...</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    placeholder="VD: 51H-123.45"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    disabled={!!formData.bookingId || !!vehicleFound}
                  />
                  {!formData.bookingId && !vehicleFound && (
                    <p className="text-xs text-gray-500 mt-1">
                      Nhập biển số để tự động tìm thông tin xe trong hệ thống
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số VIN (Vehicle Identification Number)
                    {vehicleFound && (
                      <span className="ml-2 text-xs text-gray-500">(từ hệ thống, không thể sửa)</span>
                    )}
                    {searchingVehicle && !formData.bookingId && (
                      <span className="ml-2 text-xs text-blue-600">🔍 Đang tìm kiếm...</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="vin"
                    value={formData.vin}
                    onChange={handleInputChange}
                    placeholder="VD: 1HGBH41JXMN109186"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    maxLength="17"
                    disabled={!!vehicleFound}
                  />
                  {!vehicleFound && (
                    <p className="text-xs text-gray-500 mt-1">
                      Số khung xe (17 ký tự) - Tùy chọn. Có thể dùng để tìm kiếm thông tin xe
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số km đã đi <span className="text-red-500">*</span>
                    {vehicleFound && vehicleFound.lastMileage && (
                      <span className="ml-2 text-xs text-blue-600">
                        (Lần trước: {vehicleFound.lastMileage.toLocaleString('vi-VN')} km)
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    placeholder="VD: 12000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                  {vehicleFound && vehicleFound.lastMileage && (
                    <p className="text-xs text-gray-500 mt-1">
                      Nhập số km hiện tại (phải lớn hơn {vehicleFound.lastMileage.toLocaleString('vi-VN')} km)
                    </p>
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Vehicle History Banner */}
        {vehicleFound && (
          <div className="mb-6 p-2 bg-green-50 border border-green-600 rounded text-center">
            <p className="text-xs text-green-800">
              <strong>Chủ xe:</strong> {vehicleFound.owner?.name} - {vehicleFound.owner?.phone} | <strong>Xe:</strong> {vehicleFound.model} - {vehicleFound.licensePlate}
            </p>
          </div>
        )}
        
        {vehicleNotFound && (
          <div className="mb-6 p-2 bg-red-50 border border-red-600 rounded text-center">
            <p className="text-xs text-red-800">
              Không tìm thấy thông tin xe điện trong hệ thống.
            </p>
          </div>
        )}

        {/* Chọn loại dịch vụ và các items */}
        <Card className="border border-blue-200 mb-6">
          <Card.Content className="p-6">
            <h2 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
              <FiPackage />
              Chọn loại dịch vụ
            </h2>
            


            {loadingOfferTypes ? (
              <div className="text-center py-4 text-gray-500">Đang tải loại dịch vụ...</div>
            ) : offerTypes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Chưa có loại dịch vụ nào trong hệ thống</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={loadOfferTypes}
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  🔄 Thử tải lại
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Offer Types Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại dịch vụ
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {offerTypes.map(offerType => (
                      <div
                        key={offerType.id}
                        onClick={() => handleOfferTypeToggle(offerType.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.selectedOfferTypes.includes(offerType.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.selectedOfferTypes.includes(offerType.id)}
                            onChange={() => {}}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{offerType.name}</p>
                            {offerType.description && (
                              <p className="text-xs text-gray-600 mt-1">{offerType.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Show Packages and Services for selected Offer Types */}
                {formData.selectedOfferTypes.map(offerTypeId => {
                  const offerType = offerTypes.find(ot => ot.id === offerTypeId);
                  const packages = availablePackages[offerTypeId] || [];
                  
                  // Determine what to show based on service type
                  const offerTypeName = offerType?.name?.toLowerCase() || '';
                  const isMaintenance = offerTypeName.includes('bảo dưỡng');
                  const isReplacement = offerTypeName.includes('thay thế') || offerTypeName.includes('phụ tùng');
                  const isRepair = offerTypeName.includes('sửa chữa') || offerTypeName.includes('sửa');
                  
                  console.log('🔍 Service type check:', {
                    offerTypeName,
                    isMaintenance,
                    isReplacement,
                    isRepair,
                    availableSparePartsCount: availableSpareParts.length
                  });

                  return (
                    <div key={offerTypeId} className="border-t pt-4">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <FiTool className="text-blue-600" />
                        {offerType?.name}
                      </h3>

                      {/* Bảo dưỡng: Chỉ hiển thị Packages */}
                      {isMaintenance && (
                        <>
                          {packages.length > 0 ? (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                📦 Chọn 1 gói bảo dưỡng
                                <span className="ml-2 text-xs text-blue-600 font-normal">(Chỉ được chọn 1 gói)</span>
                              </label>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {packages.map(pkg => (
                                  <div
                                    key={pkg.packageId}
                                    onClick={() => handlePackageToggle(pkg.packageId)}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                      formData.selectedPackages.includes(pkg.packageId)
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 hover:border-blue-300'
                                    }`}
                                  >
                                    <div className="flex items-start gap-2">
                                      <input
                                        type="radio"
                                        name="maintenancePackage"
                                        checked={formData.selectedPackages.includes(pkg.packageId)}
                                        onChange={() => {}}
                                        className="mt-1 w-4 h-4 text-blue-600"
                                      />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{pkg.packageName}</p>
                                        <p className="text-xs text-blue-600 font-semibold mt-1">
                                          {pkg.price?.toLocaleString('vi-VN')} VNĐ
                                        </p>
                                        {pkg.description && (
                                          <p className="text-xs text-gray-600 mt-1">{pkg.description}</p>
                                        )}
                                        {pkg.durationMinutes && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            ⏱️ {pkg.durationMinutes} phút
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">Đang tải gói bảo dưỡng...</p>
                          )}
                        </>
                      )}

                      {/* Thay thế: Hiển thị Spare Parts từ kho */}
                      {isReplacement && (
                        <>

                          {availableSpareParts.length > 0 ? (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                🔩 Phụ tùng có sẵn trong kho ({availableSpareParts.length} loại)
                              </label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                                {availableSpareParts.map(part => (
                                  <div
                                    key={part.sparePartId}
                                    onClick={() => handleSparePartToggle(part.sparePartId)}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                      formData.selectedSpareParts?.includes(part.sparePartId)
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-gray-300 hover:border-orange-300'
                                    } ${part.stockQuantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    <div className="flex items-start gap-2">
                                      <input
                                        type="checkbox"
                                        checked={formData.selectedSpareParts?.includes(part.sparePartId) || false}
                                        onChange={() => {}}
                                        disabled={part.stockQuantity === 0}
                                        className="mt-1 w-4 h-4 text-orange-600"
                                      />
                                      <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                          <p className="text-sm font-medium text-gray-900">{part.partName}</p>
                                          {part.category && (
                                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                              {part.category}
                                            </span>
                                          )}
                                        </div>
                                        {part.partNumber && (
                                          <p className="text-xs text-gray-500 mt-0.5">Mã: {part.partNumber}</p>
                                        )}
                                        <div className="flex justify-between items-center mt-1">
                                          <p className="text-xs font-semibold text-orange-600">
                                            {part.price?.toLocaleString('vi-VN')} ₫
                                          </p>
                                          <p className={`text-xs ${part.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            Kho: {part.stockQuantity}
                                          </p>
                                        </div>
                                        {part.description && (
                                          <p className="text-xs text-gray-600 mt-1">{part.description}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {formData.selectedSpareParts?.length > 0 && (
                                <div className="mt-3 p-3 bg-orange-100 rounded-lg">
                                  <p className="text-sm font-semibold text-orange-900">
                                    Đã chọn {formData.selectedSpareParts.length} phụ tùng - 
                                    Tổng giá: {availableSpareParts
                                      .filter(p => formData.selectedSpareParts.includes(p.sparePartId))
                                      .reduce((sum, p) => sum + (p.price || 0), 0)
                                      .toLocaleString('vi-VN')} ₫
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-6 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-500">Chưa có phụ tùng nào trong kho</p>
                              <p className="text-xs text-gray-400 mt-1">Vui lòng liên hệ quản lý để nhập phụ tùng</p>
                            </div>
                          )}
                        </>
                      )}

                      {/* Sửa chữa: Hiển thị textarea để nhập mô tả vấn đề */}
                      {isRepair && (
                        <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ⚠️ Mô tả vấn đề kỹ thuật <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={formData.issueDescription}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              issueDescription: e.target.value
                            }))}
                            placeholder="Vui lòng mô tả chi tiết vấn đề xe đang gặp phải..."
                            rows="4"
                            className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            required
                          />
                          <p className="text-xs text-gray-600 mt-1">
                            Hãy mô tả rõ ràng triệu chứng, âm thanh bất thường, hoặc bất kỳ chi tiết nào giúp kỹ thuật viên chẩn đoán chính xác.
                          </p>
                        </div>
                      )}

                      {/* Fallback: nếu không match loại nào */}
                      {!isMaintenance && !isReplacement && !isRepair && (
                        <>
                          {packages.length > 0 && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gói dịch vụ
                              </label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {packages.map(pkg => (
                                  <div
                                    key={pkg.packageId}
                                    onClick={() => handlePackageToggle(pkg.packageId)}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                      formData.selectedPackages.includes(pkg.packageId)
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-300 hover:border-purple-300'
                                    }`}
                                  >
                                    <div className="flex items-start gap-2">
                                      <input
                                        type="radio"
                                        name="maintenancePackageFallback"
                                        checked={formData.selectedPackages.includes(pkg.packageId)}
                                        onChange={() => {}}
                                        className="mt-1 w-4 h-4 text-purple-600"
                                      />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{pkg.packageName}</p>
                                        <p className="text-xs text-purple-600 font-semibold mt-1">
                                          {pkg.price?.toLocaleString('vi-VN')} VNĐ
                                        </p>
                                        {pkg.description && (
                                          <p className="text-xs text-gray-600 mt-1">{pkg.description}</p>
                                        )}
                                        {pkg.durationMinutes && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            ⏱️ {pkg.durationMinutes} phút
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Hiển thị booking slots */}
        <BookingSlotsDisplay 
          bookingSlots={bookingSlots} 
          loading={loadingBookingSlots} 
        />

        {/* Hiển thị walk-in receptions queue */}
        <WalkinReceptionsDisplay 
          receptions={walkinReceptions} 
          loading={loadingWalkin} 
        />

        {/* Chọn kỹ thuật viên phụ trách */}
        <Card className="border border-blue-200 mb-6">
          <Card.Content className="p-6">
            <h2 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
              <FiUserCheck />
              Chọn kỹ thuật viên phụ trách <span className="text-gray-400 text-sm">(Tùy chọn)</span>
            </h2>
            

            
            <select
              name="technicianId"
              value={formData.technicianId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chọn kỹ thuật viên --</option>
              {loadingTechnicians ? (
                <option disabled>Đang tải...</option>
              ) : (
                technicians.map(tech => {
                  const workingStatus = tech.workingStatus || 'AVAILABLE';
                  
                  const statusConfig = {
                    'AVAILABLE': { 
                      text: 'Sẵn sàng', 
                      textColor: '#10b981'
                    },
                    'ON_WORKING': { 
                      text: 'Đang làm việc', 
                      textColor: '#f59e0b'
                    },
                    'ON_BREAK': { 
                      text: 'Nghỉ giải lao', 
                      textColor: '#f97316'
                    },
                    'OFF_DUTY': { 
                      text: 'Hết ca', 
                      textColor: '#6b7280'
                    }
                  };
                  
                  const config = statusConfig[workingStatus] || statusConfig['OFF_DUTY'];
                  const isUnavailable = workingStatus !== 'AVAILABLE';
                  
                  return (
                    <option 
                      key={tech.employeeId || tech.id} 
                      value={tech.employeeId || tech.id}
                      disabled={isUnavailable}
                      style={{
                        color: config.textColor,
                        fontWeight: '500'
                      }}
                    >
                      {tech.name} - {config.text}
                    </option>
                  );
                })
              )}
            </select>
          </Card.Content>
        </Card>

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
            disabled={loading || loadingTechnicians || (vehicleNotFound && !formData.bookingId)}
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
