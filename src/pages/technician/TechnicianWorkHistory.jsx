import { useState, useEffect } from 'react';
import { 
  FiSearch, FiClock, FiCheckCircle, FiCalendar,
  FiUser, FiTool, FiMapPin, FiEye
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import technicianService from '../../services/technicianService';
// trang lich su lam viec cua ky thuat vien
const TechnicianWorkHistory = () => {
  const { user } = useAuthStore();
  const [workHistory, setWorkHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedWork, setSelectedWork] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  // load du lieu khi user thay doi
  useEffect(() => {
    if (user && user.userId) {
      fetchWorkHistory();
    }
  }, [user]);
  // lay lich su lam viec
  const fetchWorkHistory = async () => {
    try {
      setLoading(true);
      
      if (!user || !user.userId) {
        console.error('❌ No user logged in');
        toast.error('Vui lòng đăng nhập lại');
        setLoading(false);
        return;
      }
      
      console.log('🔄 Fetching my work history...');
      
      //  Lấy tất cả đơn tiếp nhận của kỹ thuật viên
      const result = await technicianService.getMyReceptions();
      
      if (result.success) {
        const receptions = result.data;
        console.log('✅ Fetched receptions:', receptions);
        
        // Chuyển đổi và lọc chỉ các công việc đã hoàn thành
        const transformedHistory = receptions
          .filter(work => work.status === 'COMPLETED')
          .map((work) => {
            console.log(`📋 Processing history #${work.receptionId}:`, work);
            // Chuyển đổi dữ liệu
            return {
              id: `#${work.receptionId}`,
              receptionId: work.receptionId,
              customerName: work.customerName,
              customerPhone: work.customerPhone,
              vehicle: {
                make: 'EV',
                model: work.vehicleModel,
                plate: work.licensePlate
              },
              service: work.services?.join(', ') || work.packageName || 'Dịch vụ',
              serviceDetails: work.services || [],
              // Thời gian tiếp nhận
              receivedDate: work.createdAt ? new Date(work.createdAt).toLocaleDateString('vi-VN') : '',
              receivedTime: work.createdAt ? new Date(work.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) : '',
              // Thời gian hoàn thành
              completedDate: work.completedAt ? new Date(work.completedAt).toLocaleDateString('vi-VN') : '',
              completedTime: work.completedAt ? new Date(work.completedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'Chưa xác định',
              duration: 60,
              notes: work.notes || '',
              totalCost: work.totalCost || 0
            };
          });
        // Lưu lịch sử làm việc
        setWorkHistory(transformedHistory);
      } else {
        console.error('❌ Error fetching history');
        toast.error('Không thể tải lịch sử làm việc');
        setWorkHistory([]);
      }
      
    } catch (error) {
      console.error('❌ Error fetching work history:', error);
      toast.error('Không thể tải lịch sử làm việc');
      setWorkHistory([]);
    } finally {
      setLoading(false);
    }
  };
  // lọc lich su lam viec
  const filteredHistory = workHistory.filter(work => {
    const matchesSearch = 
      work.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.id.toLowerCase().includes(searchQuery.toLowerCase());
     // lọc theo ngay thang
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const workDate = new Date(work.completedDate);
      const today = new Date();
      
      if (dateFilter === 'today') {
        matchesDate = workDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = workDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = workDate >= monthAgo;
      }
    }
    
    return matchesSearch && matchesDate;
  });
  // mo modal chi tiet
  const openDetailModal = (work) => {
    setSelectedWork(work);
    setShowDetailModal(true);
  };
  // hien thi trang
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Lịch sử làm việc</h1>
        <p className="text-gray-600 mt-1">Xem lại các đơn tiếp nhận đã hoàn thành</p>
      </div>

      <Card className="mb-6">
        <Card.Content className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo khách hàng, biển số xe..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
            </select>
          </div>
        </Card.Content>
      </Card>

      {loading ? (
        <Card>
          <Card.Content className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải lịch sử làm việc...</p>
          </Card.Content>
        </Card>
      ) : filteredHistory.length === 0 ? (
        <Card>
          <Card.Content className="p-12 text-center">
            <FiCheckCircle className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có lịch sử làm việc</h3>
            <p className="text-gray-500">
              Các đơn tiếp nhận đã hoàn thành sẽ hiển thị ở đây
            </p>
          </Card.Content>
        </Card>
      ) : (
        <Card>
          <Card.Content className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đơn
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Xe
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dịch vụ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian tiếp nhận
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian hoàn thành
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHistory.map((work) => (
                    <tr key={work.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-semibold text-gray-900">{work.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{work.customerName}</p>
                          <p className="text-xs text-gray-500">{work.customerPhone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{work.vehicle.model}</p>
                          <p className="text-xs text-gray-500">{work.vehicle.plate}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">{work.service}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{work.receivedDate}</p>
                          <p className="text-xs text-gray-500">{work.receivedTime}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{work.completedDate}</p>
                          <p className="text-xs text-gray-500">{work.completedTime}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Content>
        </Card>
      )}

      {showDetailModal && selectedWork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Chi tiết công việc</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Thông tin công việc</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Mã đơn</p>
                    <p className="font-medium">{selectedWork.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full text-green-600 bg-green-100">
                      ĐÃ HOÀN THÀNH
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày hoàn thành</p>
                    <p className="font-medium">{selectedWork.completedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Thời gian</p>
                    <p className="font-medium">{selectedWork.completedTime} ({selectedWork.duration} phút)</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Chi tiết dịch vụ</h3>
                <p className="font-medium mb-2">{selectedWork.service}</p>
                {selectedWork.serviceDetails.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {selectedWork.serviceDetails.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Thông tin xe</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Hãng & Model</p>
                    <p className="font-medium">{selectedWork.vehicle.make} {selectedWork.vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Biển số</p>
                    <p className="font-medium">{selectedWork.vehicle.plate}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tên</p>
                    <p className="font-medium">{selectedWork.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{selectedWork.customerPhone}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Chi phí</h3>
                <p className="text-2xl font-bold text-gray-900">{selectedWork.totalCost.toLocaleString()}đ</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailModal(false)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianWorkHistory;
