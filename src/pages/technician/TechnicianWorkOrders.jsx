import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCheckCircle,
  FiUser, FiTool,
  FiRefreshCw, FiCheckSquare, FiPackage,
  FiFileText, FiPlus, FiMessageSquare
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { getInspectionDetailsForReception, batchUpdateInspectionRecords } from '../../services/inspectionService';
import technicianService from '../../services/technicianService';
 // trang don cong viec ky thuat vien
const TechnicianWorkOrders = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inspectionData, setInspectionData] = useState(null);
  const [loadingChecklist, setLoadingChecklist] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [localChanges, setLocalChanges] = useState({});
  const [showSparePartsModal, setShowSparePartsModal] = useState(false);
  const [selectedRecordForReplace, setSelectedRecordForReplace] = useState(null);
  const [spareParts, setSpareParts] = useState([]);
  const [selectedSparePart, setSelectedSparePart] = useState(null);
  const [activeTab, setActiveTab] = useState('checklist'); // 'checklist' or 'spare-parts'
  const [receptionSpareParts, setReceptionSpareParts] = useState([]);
  const [replacedParts, setReplacedParts] = useState({}); // Track which parts have been replaced
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showRequestPartsModal, setShowRequestPartsModal] = useState(false);
  const [showCompleteConfirmModal, setShowCompleteConfirmModal] = useState(false);
  // load don cong viec
  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      
      if (!user || !user.userId) {
        console.error('❌ No user logged in');
        toast.error('Vui lòng đăng nhập lại');
        setLoading(false);
        return;
      }
      
      console.log('🔄 Fetching my assigned receptions...');
      
      //  call api
      const result = await technicianService.getMyReceptions();
      
      if (result.success) {
        const receptions = result.data;
        console.log('✅ Fetched assigned receptions:', receptions);
        
        //  Filter to active receptions only
        const activeReceptions = receptions.filter(r => 
          r.status === 'RECEIVED' || r.status === 'ASSIGNED' || r.status === 'IN_PROGRESS'
        );
        
        console.log(`📊 Total receptions: ${receptions.length}, Active: ${activeReceptions.length}`);
        
        // Chuyển đổi các reception đang hoạt động để hiển thị
        const transformedReceptions = activeReceptions.map((reception) => {
          //  Debug createdAt
          console.log(`🕒 Reception #${reception.receptionId} createdAt:`, reception.createdAt);
           // map data hoa don cong viec
          return {
            id: reception.receptionId,
            receptionId: reception.receptionId,
            customerName: reception.customerName,
            customerPhone: reception.customerPhone,
            vehicle: {
              model: reception.vehicleModel,
              plate: reception.licensePlate,
              mileage: reception.mileage || 0
            },
            
            packageName: reception.packageName || null,
            services: reception.services || [],
            priority: 'normal',
            status: reception.status === 'RECEIVED' ? 'pending' : 
                    reception.status === 'ASSIGNED' ? 'pending' :
                    reception.status === 'IN_PROGRESS' ? 'in-progress' : 'pending',
            scheduledDate: reception.createdAt ? new Date(reception.createdAt).toLocaleDateString('vi-VN') : '',
            scheduledTime: reception.createdAt ? new Date(reception.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'Chưa xác định',
            estimatedDuration: 60,
            notes: reception.notes || '',
            issuesDescription: reception.issueDescription || ''
          };
        });
         // set state
        setWorkOrders(transformedReceptions);
      } else {
        console.error('❌ Error fetching receptions');
        toast.error('Không thể tải danh sách công việc');
        setWorkOrders([]);
      }
      
    } catch (error) {
      console.error('❌ Error fetching work orders:', error);
      toast.error('Không thể tải danh sách công việc');
      setWorkOrders([]);
    } finally {
      setLoading(false);
    }
  };
  // load checklist
  const fetchChecklist = async (receptionId) => {
    try {
      setLoadingChecklist(true);
      console.log('🔄 Fetching inspection details for reception:', receptionId);
      
      const data = await getInspectionDetailsForReception(receptionId);
      console.log('✅ Inspection data:', data);
      setInspectionData(data);
      setLocalChanges({}); //   xoa thay doi local
    } catch (error) {
      console.error('❌ Error fetching inspection details:', error);
      setInspectionData(null);
    } finally {
      setLoadingChecklist(false);
    }
    
    // Luôn tải phụ tùng, ngay cả khi kiểm tra lỗi
    await fetchReceptionSpareParts(receptionId);
  };
  // load phu tung da su dung trong don tiep nhan
  const fetchReceptionSpareParts = async (receptionId) => {
    try {
      console.log('🔄 Fetching spare parts for reception:', receptionId);
      const result = await technicianService.getSpareParts(receptionId);
      
      if (result.success) {
        setReceptionSpareParts(result.data || []);
        console.log('✅ Reception spare parts:', result.data);
      } else {
        console.error('❌ Error fetching spare parts:', result.error);
        setReceptionSpareParts([]);
      }
    } catch (error) {
      console.error('❌ Error fetching reception spare parts:', error);
      setReceptionSpareParts([]);
    }
  };

  // xu ly chuyen trang thai cong viec
  const handleToggleTask = (recordId, newStatus) => {
    //  neu la thay the phu tung
    if (newStatus === 'REPLACE') {
      const record = inspectionData.records.find(r => r.recordId === recordId);
      setSelectedRecordForReplace({ recordId, taskDescription: record?.task?.description });
      setShowSparePartsModal(true);
      fetchSpareParts();
    } else {
      // Store changes locally for other statuses
      setLocalChanges(prev => ({
        ...prev,
        [recordId]: newStatus
      }));
    }
  };
  // load danh sach phu tung
  const fetchSpareParts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/spare-parts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ev_auth_token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSpareParts(data);
      }
    } catch (error) {
      console.error('Error fetching spare parts:', error);
      toast.error('Không thể tải danh sách phụ tùng');
    }
  };
  //  xu ly chon phu tung thay the
  const handleConfirmReplace = () => {
    if (!selectedSparePart) {
      toast.error('Vui lòng chọn phụ tùng thay thế');
      return;
    }
    
    //  Lưu thay đổi thay thế phụ tùng
    setLocalChanges(prev => ({
      ...prev,
      [selectedRecordForReplace.recordId]: 'REPLACE'
    }));
    
    toast.success(`Đã chọn phụ tùng: ${selectedSparePart.partName}`);
    setShowSparePartsModal(false);
    setSelectedRecordForReplace(null);
    setSelectedSparePart(null);
  };

  const handleSubmitChecklist = async () => {
    // Check if all tasks have been selected
    const totalTasks = inspectionData?.records.length || 0;
    const selectedTasks = Object.keys(localChanges).length;
    
    // Count tasks that already have status (not PENDING)
    const alreadyCompleted = inspectionData?.records.filter(r => r.actualStatus !== 'PENDING').length || 0;
    
    // Total selected = new selections + already completed
    const totalSelected = selectedTasks + alreadyCompleted;
    
    if (totalSelected < totalTasks) {
      toast.error(`Vui lòng chọn action cho tất cả ${totalTasks} hạng mục (đã chọn: ${totalSelected})`);
      return;
    }

    if (selectedTasks === 0) {
      toast.info('Không có thay đổi mới để lưu');
      return;
    }

    try {
      setUpdating(true);
      
      // Prepare batch update payload
      const updates = Object.entries(localChanges).map(([recordId, status]) => ({
        recordId: parseInt(recordId),
        status: status
      }));

      // Send batch update request
      await batchUpdateInspectionRecords(updates);

      // Clear local changes and refresh
      setLocalChanges({});
      await fetchChecklist(currentOrder.receptionId);
      toast.success(`Đã cập nhật ${selectedTasks} hạng mục!`);
    } catch (error) {
      console.error('Error updating records:', error);
      toast.error('Lỗi khi cập nhật');
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateRecords = async (receptionId) => {
    try {
      setLoadingChecklist(true);
      const response = await fetch(
        `http://localhost:8080/api/inspection-records/reception/${receptionId}/create`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('ev_auth_token')}`
          }
        }
      );

      if (response.ok) {
        toast.success('Đã tạo danh sách kiểm tra!');
        await fetchChecklist(receptionId);
      } else {
        const errorText = await response.text();
        toast.error(errorText || 'Không thể tạo danh sách kiểm tra');
      }
    } catch (error) {
      console.error('Error creating records:', error);
      toast.error('Lỗi khi tạo danh sách kiểm tra');
    } finally {
      setLoadingChecklist(false);
    }
  };

  // Fetch vehicle receptions assigned to this technician
  useEffect(() => {
    if (user && user.userId) {
      fetchWorkOrders();
    }
  }, [user?.userId]);

  // Get current work order (only one at a time)
  const currentOrder = workOrders.length > 0 ? workOrders[0] : null;

  // Fetch checklist when workOrders changes
  useEffect(() => {
    if (workOrders.length > 0 && workOrders[0].status === 'in-progress') {
      fetchChecklist(workOrders[0].receptionId);
    } else {
      setInspectionData(null);
      setLocalChanges({});
    }
  }, [workOrders]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'on-hold': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  // xu ly bat dau cong viec
  const handleStartWork = async (orderId) => {
    const order = workOrders.find(o => o.id === orderId);
    if (!order) return;

    try {
      const response = await fetch(`http://localhost:8080/api/receptions/${order.receptionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ev_auth_token')}`
        },
        body: JSON.stringify({ status: 'IN_PROGRESS' })
      });
      // cap nhat state
      if (response.ok) {
        setWorkOrders(prev => prev.map(o => 
          o.id === orderId 
            ? { ...o, status: 'in-progress', startTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) } 
            : o
        ));
        toast.success('Đã bắt đầu công việc');
      } else {
        toast.error('Không thể cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error starting work:', error);
      toast.error('Lỗi khi bắt đầu công việc');
    }
  };
  // xu ly hoan thanh cong viec
  const handleCompleteWork = async (orderId) => {
    const order = workOrders.find(o => o.id === orderId);
    if (!order) return;

    try {
      const response = await fetch(`http://localhost:8080/api/receptions/${order.receptionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ev_auth_token')}`
        },
        body: JSON.stringify({ status: 'COMPLETED' })
      });
      // cap nhat state
      if (response.ok) {
        // Remove from current work list (will appear in history)
        setWorkOrders(prev => prev.filter(o => o.id !== orderId));
        toast.success('Đã hoàn thành công việc!');
      } else {
        toast.error('Không thể cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error completing work:', error);
      toast.error('Lỗi khi hoàn thành công việc');
    }
  };
  // xu ly tam dung cong viec
  const handlePauseWork = async (orderId) => {
    const order = workOrders.find(o => o.id === orderId);
    if (!order) return;

    try {
      const response = await fetch(`http://localhost:8080/api/receptions/${order.receptionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ev_auth_token')}`
        },
        body: JSON.stringify({ status: 'PENDING' })
      });

      if (response.ok) {
        setWorkOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, status: 'pending' } : o
        ));
        toast.info('Đã tạm dừng công việc');
      } else {
        toast.error('Không thể cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error pausing work:', error);
      toast.error('Lỗi khi tạm dừng công việc');
    }
  };
  //  hien thi trang
  return (
    <div>
      {/* Header */}
      <div className="mb-4 pb-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Đơn tiếp nhận hiện tại</h1>
          <p className="text-gray-600 mt-1">Thông tin chi tiết đơn tiếp nhận được giao</p>
        </div>
        <Button
          onClick={fetchWorkOrders}
          disabled={loading}
          variant="outline"
          icon={<FiRefreshCw className={loading ? 'animate-spin' : ''} />}
        >
          Làm mới
        </Button>
      </div>

      {/* Start Work Card - Only show when pending */}
      {!loading && workOrders.length > 0 && currentOrder && currentOrder.status === 'pending' && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-3xl w-full border border-gray-300 shadow-lg">
            <Card.Content className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Đơn tiếp nhận #{currentOrder.id}</h2>
                <p className="text-gray-600 text-sm">Sẵn sàng bắt đầu công việc</p>
              </div>

              {/* Work Details */}
              <div className="space-y-4 mb-6">
                {/* Customer & Vehicle Info - At Top */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs font-semibold text-blue-900 uppercase mb-2">Khách hàng</p>
                    <p className="font-bold text-gray-900 mb-1">{currentOrder.customerName}</p>
                    <p className="text-sm text-gray-600">{currentOrder.customerPhone}</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-xs font-semibold text-green-900 uppercase mb-2">Phương tiện</p>
                    <p className="font-bold text-gray-900 mb-1">{currentOrder.vehicle.model}</p>
                    <p className="text-sm text-gray-600">{currentOrder.vehicle.plate} • {(currentOrder.vehicle.mileage || 0).toLocaleString()} km</p>
                  </div>
                </div>

                {/* Service Details & Notes - Full Width Below */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-xs font-semibold text-purple-900 uppercase mb-3 text-center">Thông tin dịch vụ</p>
                  
                  {/* Services Grid - Dynamic columns based on available data */}
                  <div className={`grid gap-4 mb-3 ${
                    currentOrder.packageName && currentOrder.services?.length > 0 ? 'grid-cols-2' :
                    'grid-cols-1'
                  }`}>
                    {/* Maintenance Package */}
                    {currentOrder.packageName && (
                      <div className="bg-white bg-opacity-60 rounded-lg p-3">
                        <p className="text-xs text-purple-700 font-medium mb-2">Gói bảo dưỡng</p>
                        <p className="font-bold text-gray-900">{currentOrder.packageName}</p>
                      </div>
                    )}

                    {/* Services List */}
                    {currentOrder.services && currentOrder.services.length > 0 && (
                      <div className="bg-white bg-opacity-60 rounded-lg p-3">
                        <p className="text-xs text-purple-700 font-medium mb-2">Dịch vụ đã chọn</p>
                        <ul className="space-y-1">
                          {currentOrder.services.map((service, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                              <FiCheckCircle className="text-purple-600 flex-shrink-0 mt-0.5" />
                              <span>{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Notes - Full Width Below */}
                  {currentOrder.notes && (
                    <div className="mt-3 pt-3 border-t border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FiMessageSquare className="text-purple-600" />
                        <p className="text-xs font-semibold text-purple-900">Ghi chú & vấn đề xe gặp phải</p>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{currentOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={() => handleStartWork(currentOrder.id)}
                className="w-full flex items-center justify-center gap-2 text-lg py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                <FiTool className="text-xl" />
                Bắt đầu công việc
              </button>
            </Card.Content>
          </Card>
        </div>
      )}

      {/* Sticky Info Bar - Only show when in-progress AND has data */}
      {!loading && workOrders.length > 0 && currentOrder && currentOrder.status === 'in-progress' && !loadingChecklist && (inspectionData || receptionSpareParts.length > 0) && (
        <div className="space-y-4">
          <div className="sticky top-0 z-10 bg-gray-50 pb-0">
            <div className="max-w-5xl mx-auto bg-white border border-gray-200 shadow-sm px-4 py-2">
            {/* Content Container */}
            <div className="flex items-center justify-between gap-4">
              {/* Left: Title and Info */}
              <div className="flex-1">
                {/* Title Row */}
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-lg font-bold text-gray-900">Đơn tiếp nhận #{currentOrder.id}</h2>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(currentOrder.status)}`}>
                    Đang xử lý
                  </span>
                </div>
                
                {/* Info Row */}
                <div className="flex items-center gap-4 text-sm">
                  {/* Customer Info */}
                  <div className="flex items-center gap-2">
                    <FiUser className="text-blue-600" />
                    <span className="font-semibold text-gray-900">{currentOrder.customerName}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{currentOrder.customerPhone}</span>
                  </div>
                  
                  <span className="text-gray-300">|</span>
                  
                  {/* Vehicle Info */}
                  <div className="flex items-center gap-2">
                    <FiTool className="text-green-600" />
                    <span className="font-semibold text-gray-900">{currentOrder.vehicle.model}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{currentOrder.vehicle.plate}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{(currentOrder.vehicle.mileage || 0).toLocaleString()} km</span>
                  </div>
                </div>
              </div>
              
              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowCompleteConfirmModal(true)}
                  disabled={(() => {
                    // Must save checklist first (no unsaved changes)
                    const hasUnsavedChanges = Object.keys(localChanges).length > 0;
                    if (hasUnsavedChanges) return true;
                    
                    // Check checklist progress (only from saved data)
                    const checklistCompleted = inspectionData?.records.filter(r => 
                      r.actualStatus !== 'PENDING'
                    ).length || 0;
                    const checklistTotal = inspectionData?.totalTasks || 0;
                    
                    // Check spare parts progress
                    const sparePartsReplaced = Object.values(replacedParts).filter(Boolean).length;
                    const sparePartsTotal = receptionSpareParts.length;
                    
                    // If has checklist, must complete it
                    if (checklistTotal > 0 && checklistCompleted < checklistTotal) {
                      return true;
                    }
                    
                    // If has spare parts, must replace all
                    if (sparePartsTotal > 0 && sparePartsReplaced < sparePartsTotal) {
                      return true;
                    }
                    
                    // Otherwise can complete
                    return false;
                  })()}
                >
                  <FiCheckCircle className="mr-2" />
                  Hoàn thành
                </Button>
              </div>
            </div>
            
            {/* Tabs - Inside Sticky Bar */}
            <div className="border-t border-gray-200 mt-2 -mx-4 px-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('checklist')}
                  className={`pb-2 pt-2 px-3 text-sm font-medium transition-colors relative ${
                    activeTab === 'checklist'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiCheckSquare className="inline mr-1.5 text-sm" />
                  Checklist bảo dưỡng
                  {inspectionData?.records && (
                    <span className="ml-1.5 text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full font-semibold">
                      {inspectionData.records.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('spare-parts')}
                  className={`pb-2 pt-2 px-3 text-sm font-medium transition-colors relative ${
                    activeTab === 'spare-parts'
                      ? 'text-orange-600 border-b-2 border-orange-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiTool className="inline mr-1.5 text-sm" />
                  Yêu cầu thay thế
                  {receptionSpareParts.length > 0 && (
                    <span className="ml-1.5 text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full font-semibold">
                      {receptionSpareParts.length}
                    </span>
                  )}
                </button>
                </div>
                
                {/* Action Buttons - Right side of tabs */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNotesModal(true)}
                    className="pb-2 pt-2 px-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5"
                  >
                    <FiFileText className="text-sm" />
                    Ghi chú / Vấn đề
                  </button>
                  <button
                    onClick={() => setShowRequestPartsModal(true)}
                    className="pb-2 pt-2 px-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5"
                  >
                    <FiPlus className="text-sm" />
                    Yêu cầu phụ tùng
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'checklist' && (
            <>
          {/* Checklist Section */}
          {loadingChecklist ? (
            <Card>
              <Card.Content className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Đang tải danh sách kiểm tra...</p>
              </Card.Content>
            </Card>
          ) : !inspectionData ? (
            <Card className="max-w-5xl mx-auto">
              <Card.Content className="p-8 text-center">
                <FiPackage className="mx-auto text-5xl text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không tìm thấy danh sách kiểm tra
                </h3>
                <p className="text-gray-500 mb-4">
                  Reception này chưa có danh sách kiểm tra.
                </p>
                <Button onClick={() => handleCreateRecords(currentOrder.receptionId)} variant="primary">
                  Tạo danh sách kiểm tra
                </Button>
              </Card.Content>
            </Card>
          ) : (
            <>
              {/* Progress Bar - Sticky */}
              {(() => {
                // Calculate completed tasks including local changes
                const completedCount = inspectionData.records.filter(r => {
                  const currentStatus = localChanges[r.recordId] || r.actualStatus;
                  return currentStatus !== 'PENDING';
                }).length;
                const progressPercentage = Math.round((completedCount / inspectionData.totalTasks) * 100);

                return (
                  <div className="sticky top-[86px] z-10 mb-4 bg-gray-50">
                    <div className="max-w-5xl mx-auto">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Checklist Table by Category */}
              <div className="max-w-5xl mx-auto">
                {(() => {
                  const groupedRecords = inspectionData.records.reduce((acc, record) => {
                    const category = record.task.categoryDisplayName || record.task.category;
                    if (!acc[category]) {
                      acc[category] = [];
                    }
                    acc[category].push(record);
                    return acc;
                  }, {});

                  return Object.entries(groupedRecords).map(([category, records]) => (
                    <Card key={category} className="mb-4 border border-blue-200">
                    <Card.Content className="p-0">
                      <div className="p-3 bg-gray-50 border-b">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <FiCheckSquare className="text-blue-600" />
                          {category}
                        </h3>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hạng mục
                              </th>
                              <th className="px-2 py-2 text-center text-xs font-medium text-green-600 uppercase tracking-wider w-20 whitespace-nowrap">
                                Bình thường
                              </th>
                              <th className="px-2 py-2 text-center text-xs font-medium text-blue-600 uppercase tracking-wider w-20 whitespace-nowrap">
                                Điều chỉnh
                              </th>
                              <th className="px-2 py-2 text-center text-xs font-medium text-orange-600 uppercase tracking-wider w-20 whitespace-nowrap">
                                Vệ sinh
                              </th>
                              <th className="px-2 py-2 text-center text-xs font-medium text-yellow-600 uppercase tracking-wider w-20 whitespace-nowrap">
                                Bôi trơn
                              </th>
                              <th className="px-2 py-2 text-center text-xs font-medium text-red-600 uppercase tracking-wider w-20 whitespace-nowrap">
                                Thay thế
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {records.map((record) => (
                              <tr key={record.recordId} className="hover:bg-gray-50">
                                <td className="px-3 py-3">
                                  <p className="text-sm text-gray-900">{record.task.description}</p>
                                </td>
                                <td className="px-2 py-3 text-center">
                                  <input
                                    type="radio"
                                    name={`action-${record.recordId}`}
                                    checked={(localChanges[record.recordId] || record.actualStatus) === 'NORMAL'}
                                    onChange={() => handleToggleTask(record.recordId, 'NORMAL')}
                                    disabled={updating}
                                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                                  />
                                </td>
                                <td className="px-2 py-3 text-center">
                                  <input
                                    type="radio"
                                    name={`action-${record.recordId}`}
                                    checked={(localChanges[record.recordId] || record.actualStatus) === 'ADJUST'}
                                    onChange={() => handleToggleTask(record.recordId, 'ADJUST')}
                                    disabled={updating}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                  />
                                </td>
                                <td className="px-2 py-3 text-center">
                                  <input
                                    type="radio"
                                    name={`action-${record.recordId}`}
                                    checked={(localChanges[record.recordId] || record.actualStatus) === 'CLEAN'}
                                    onChange={() => handleToggleTask(record.recordId, 'CLEAN')}
                                    disabled={updating}
                                    className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                                  />
                                </td>
                                <td className="px-2 py-3 text-center">
                                  <input
                                    type="radio"
                                    name={`action-${record.recordId}`}
                                    checked={(localChanges[record.recordId] || record.actualStatus) === 'LUBRICATE'}
                                    onChange={() => handleToggleTask(record.recordId, 'LUBRICATE')}
                                    disabled={updating}
                                    className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                                  />
                                </td>
                                <td className="px-2 py-3 text-center">
                                  <input
                                    type="radio"
                                    name={`action-${record.recordId}`}
                                    checked={(localChanges[record.recordId] || record.actualStatus) === 'REPLACE'}
                                    onChange={() => handleToggleTask(record.recordId, 'REPLACE')}
                                    disabled={updating}
                                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card.Content>
                  </Card>
                  ));
                })()}
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 max-w-5xl mx-auto">
                <Button
                  onClick={handleSubmitChecklist}
                  disabled={updating}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                >
                  <FiCheckSquare className="mr-2" />
                  {updating ? 'Đang lưu...' : 'Lưu checklist'}
                </Button>
              </div>
            </>
          )}
          </>
          )}

          {/* Spare Parts Tab */}
          {activeTab === 'spare-parts' && (
            <>
              {/* Progress Bar for Spare Parts */}
              {receptionSpareParts.length > 0 && (() => {
                const replacedCount = Object.values(replacedParts).filter(Boolean).length;
                const totalParts = receptionSpareParts.length;
                const progressPercentage = Math.round((replacedCount / totalParts) * 100);

                return (
                  <div className="sticky top-[86px] z-10 mb-4 bg-gray-50">
                    <div className="max-w-5xl mx-auto">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="max-w-5xl mx-auto">
                {receptionSpareParts.length > 0 ? (
                  <Card className="border border-orange-200">
                    <Card.Content className="p-0">
                      <div className="p-3 bg-gray-50 border-b">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <FiPackage className="text-orange-600" />
                          Yêu cầu thay thế phụ tùng
                        </h3>
                      </div>
                      <div className="p-3 space-y-2">
                      {receptionSpareParts.map((part, index) => {
                        const partId = part.sparePartId || index;
                        const isReplaced = replacedParts[partId] || false;
                        
                        return (
                          <div
                            key={partId}
                            className={`p-3 border rounded-lg transition-colors ${
                              isReplaced 
                                ? 'border-green-300 bg-green-50' 
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1">
                                <h3 className={`font-medium text-sm ${
                                  isReplaced ? 'text-gray-500 line-through' : 'text-gray-900'
                                }`}>
                                  {part.partName || part.sparePartName}
                                </h3>
                                <div className="flex items-center gap-3 mt-1">
                                  {part.partNumber && (
                                    <span className="text-xs text-gray-600">Mã: {part.partNumber}</span>
                                  )}
                                  {part.category && (
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                      {part.category}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <input
                                type="checkbox"
                                checked={isReplaced}
                                onChange={(e) => {
                                  setReplacedParts(prev => ({
                                    ...prev,
                                    [partId]: e.target.checked
                                  }));
                                }}
                                className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer flex-shrink-0"
                              />
                            </div>
                          </div>
                        );
                      })}
                      </div>
                    </Card.Content>
                  </Card>
                ) : (
                  <Card>
                    <Card.Content className="p-8 text-center">
                      <FiTool className="mx-auto text-5xl text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có phụ tùng cần thay thế</h3>
                      <p className="text-gray-500">Đơn này chưa có yêu cầu thay thế phụ tùng nào</p>
                    </Card.Content>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* No Package/Spare Parts Message - Show when in-progress but no data */}
      {/* Repair Mode - No checklist/spare parts */}
      {!loading && !loadingChecklist && workOrders.length > 0 && currentOrder && currentOrder.status === 'in-progress' && !inspectionData && receptionSpareParts.length === 0 && (
        <div className="space-y-4">
          {/* Info Bar for Repair Mode */}
          <div className="sticky top-0 z-10 bg-gray-50 pb-0">
            <div className="max-w-5xl mx-auto bg-white border border-gray-200 shadow-sm px-4 py-2">
            {/* Content Container */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-bold text-gray-900">Đơn tiếp nhận #{currentOrder.id}</h2>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
                      Đang xử lý
                    </span>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                      Sửa chữa
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-blue-600" />
                      <span className="font-semibold text-gray-900">{currentOrder.customerName}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">{currentOrder.customerPhone}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center gap-2">
                      <FiTool className="text-green-600" />
                      <span className="font-semibold text-gray-900">{currentOrder.vehicle.model}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">{currentOrder.vehicle.plate}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">{(currentOrder.vehicle.mileage || 0).toLocaleString()} km</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowCompleteConfirmModal(true)}
                  >
                    <FiCheckCircle className="mr-2" />
                    Hoàn thành
                  </Button>
                </div>
              </div>
              
              {/* Tabs Section - Same as normal mode */}
              <div className="border-t border-gray-200 mt-2 -mx-4 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="pb-2 pt-2 px-3 text-sm font-medium text-gray-400 cursor-not-allowed">
                      <FiCheckSquare className="inline mr-1.5 text-sm" />
                      Checklist bảo dưỡng
                      <span className="ml-1.5 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-semibold">
                        0
                      </span>
                    </div>
                    <div className="pb-2 pt-2 px-3 text-sm font-medium text-gray-400 cursor-not-allowed">
                      <FiTool className="inline mr-1.5 text-sm" />
                      Yêu cầu thay thế
                      <span className="ml-1.5 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-semibold">
                        0
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowNotesModal(true)}
                      className="pb-2 pt-2 px-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5"
                    >
                      <FiFileText className="text-sm" />
                      Ghi chú / Vấn đề
                    </button>
                    <button
                      onClick={() => setShowRequestPartsModal(true)}
                      className="pb-2 pt-2 px-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5"
                    >
                      <FiPlus className="text-sm" />
                      Yêu cầu phụ tùng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Work Area */}
          <Card className="max-w-5xl mx-auto">
            <Card.Content className="p-8 text-center">
              <FiTool className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chế độ sửa chữa
              </h3>
              <p className="text-gray-500 mb-4">
                Đơn này không có gói bảo dưỡng. Bạn có thể xem ghi chú/vấn đề và yêu cầu phụ tùng khi cần.
              </p>
            </Card.Content>
          </Card>
        </div>
      )}

      {loading ? (
        <Card>
          <Card.Content className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải danh sách công việc...</p>
          </Card.Content>
        </Card>
      ) : workOrders.length === 0 ? (
        <Card>
          <Card.Content className="p-12 text-center">
            <FiTool className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có đơn tiếp nhận nào</h3>
            <p className="text-gray-500 mb-2">
              Chưa có đơn tiếp nhận nào được Staff giao cho bạn
            </p>
            <p className="text-sm text-gray-400">
              Staff cần tạo đơn tiếp nhận và assign cho bạn trước
            </p>
          </Card.Content>
        </Card>
      ) : null}

      {/* Spare Parts Selection Modal */}
      {showSparePartsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Chọn phụ tùng thay thế</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedRecordForReplace?.taskDescription}</p>
                </div>
                <button
                  onClick={() => {
                    setShowSparePartsModal(false);
                    setSelectedRecordForReplace(null);
                    setSelectedSparePart(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {spareParts.length === 0 ? (
                <div className="text-center py-8">
                  <FiPackage className="mx-auto text-4xl text-gray-300 mb-3" />
                  <p className="text-gray-500">Không có phụ tùng nào</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {spareParts.map((part) => (
                    <div
                      key={part.partId}
                      onClick={() => setSelectedSparePart(part)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedSparePart?.partId === part.partId
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{part.partName}</h3>
                          <p className="text-sm text-gray-600 mt-1">{part.description || 'Không có mô tả'}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-500">Mã: {part.partNumber}</span>
                            <span className="text-sm font-medium text-green-600">
                              {part.price?.toLocaleString()}đ
                            </span>
                            <span className={`text-sm ${part.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              Tồn kho: {part.stockQuantity}
                            </span>
                          </div>
                        </div>
                        {selectedSparePart?.partId === part.partId && (
                          <FiCheckCircle className="text-blue-600 text-xl flex-shrink-0 ml-3" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSparePartsModal(false);
                  setSelectedRecordForReplace(null);
                  setSelectedSparePart(null);
                }}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmReplace}
                disabled={!selectedSparePart}
                className="flex-1"
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && currentOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Ghi chú & Vấn đề xe</h2>
              <button
                onClick={() => setShowNotesModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {currentOrder.issuesDescription ? (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap">{currentOrder.issuesDescription}</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiFileText className="mx-auto text-4xl mb-2 text-gray-300" />
                  <p>Không có ghi chú hoặc vấn đề</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowNotesModal(false)}
                className="w-full"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Request Parts Modal */}
      {showRequestPartsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Yêu cầu phụ tùng</h2>
              <button
                onClick={() => setShowRequestPartsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-gray-600 mb-4">Chức năng yêu cầu phụ tùng đang được phát triển...</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 Tính năng này sẽ cho phép bạn yêu cầu thêm phụ tùng từ kho trong quá trình bảo dưỡng.
                </p>
              </div>
            </div>

            <div className="p-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowRequestPartsModal(false)}
                className="w-full"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Confirmation Modal */}
      {showCompleteConfirmModal && currentOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Xác nhận hoàn thành</h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Bạn có chắc chắn muốn hoàn thành công việc cho đơn tiếp nhận <span className="font-semibold">#{currentOrder.id}</span>?
              </p>
              
              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Khách hàng:</span>
                  <span className="font-medium text-gray-900">{currentOrder.customerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Phương tiện:</span>
                  <span className="font-medium text-gray-900">{currentOrder.vehicle.model} - {currentOrder.vehicle.plate}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => setShowCompleteConfirmModal(false)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  handleCompleteWork(currentOrder.id);
                  setShowCompleteConfirmModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TechnicianWorkOrders;







