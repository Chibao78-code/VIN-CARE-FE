import React, { useState, useEffect } from 'react';
import { 
  FiSearch, FiFilter, FiClock, FiCheckCircle, FiAlertTriangle,
  FiUser, FiTool, FiCalendar, FiMapPin, FiMessageSquare,
  FiPaperclip, FiCamera, FiRefreshCw, FiChevronDown
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const TechnicianWorkOrders = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // lay cong viec tu apointment
  useEffect(() => {
    // call api de lay cong viec
    const fetchWorkOrders = () => {
      const mockOrders = [
        //fake data
        {
          id: 'WO-001',
          appointmentId: 'APT-001',
          customerName: 'Nguyễn Văn A',
          customerPhone: '0912345678',
          customerEmail: 'nguyenvana@email.com',
          vehicle: {
            make: 'VinFast',
            model: 'VF8',
            plate: '30A-12345',
            year: 2023,
            vin: 'VF8VN2023001234'
          },
          service: 'Bảo dưỡng định kỳ',
          serviceDetails: [
            'Kiểm tra hệ thống phanh',
            'Kiểm tra dung lượng pin',
            'Kiểm tra hệ thống làm mát',
            'Thay dầu động cơ'
          ],
          priority: 'normal',
          status: 'pending',
          scheduledDate: '2024-02-15',
          scheduledTime: '09:00',
          estimatedDuration: 60,
          location: 'Bay 3',
          assignedBy: 'Manager',
          notes: 'Khách hàng yêu cầu kiểm tra kỹ hệ thống phanh',
          parts: [],
          checklist: [
            { id: 1, task: 'Kiểm tra áp suất lốp', completed: false },
            { id: 2, task: 'Kiểm tra mức dầu phanh', completed: false },
            { id: 3, task: 'Kiểm tra đèn báo', completed: false },
            { id: 4, task: 'Test drive', completed: false }
          ]
        },
        {
          id: 'WO-002',
          appointmentId: 'APT-002',
          customerName: 'Trần Thị B',
          customerPhone: '0987654321',
          customerEmail: 'tranthib@email.com',
          vehicle: {
            make: 'Tesla',
            model: 'Model 3',
            plate: '51G-67890',
            year: 2022,
            vin: 'TM3US2022005678'
          },
          service: 'Kiểm tra pin',
          serviceDetails: [
            'Kiểm tra dung lượng pin',
            'Kiểm tra hiệu suất sạc',
            'Cân bằng cell pin',
            'Update firmware BMS'
          ],
          priority: 'urgent',
          status: 'in-progress',
          scheduledDate: '2024-02-15',
          scheduledTime: '10:30',
          estimatedDuration: 45,
          location: 'Bay 1',
          assignedBy: 'Manager',
          notes: 'Pin sụt nhanh, cần kiểm tra khẩn cấp',
          startTime: '10:35',
          parts: [
            { name: 'Coolant', quantity: 2, unit: 'liter' }
          ],
          checklist: [
            { id: 1, task: 'Kiểm tra voltage từng cell', completed: true },
            { id: 2, task: 'Kiểm tra nhiệt độ pin', completed: true },
            { id: 3, task: 'Kiểm tra BMS', completed: false },
            { id: 4, task: 'Test sạc nhanh', completed: false }
          ]
        },
        {
          id: 'WO-003',
          appointmentId: 'APT-003',
          customerName: 'Lê Văn C',
          customerPhone: '0901234567',
          customerEmail: 'levanc@email.com',
          vehicle: {
            make: 'BMW',
            model: 'iX3',
            plate: '92H-11111',
            year: 2023,
            vin: 'BMWIX32023999'
          },
          service: 'Sửa chữa hệ thống sạc',
          serviceDetails: [
            'Kiểm tra cổng sạc',
            'Kiểm tra module OBC',
            'Kiểm tra dây sạc',
            'Update software'
          ],
          priority: 'high',
          status: 'pending',
          scheduledDate: '2024-02-15',
          scheduledTime: '14:00',
          estimatedDuration: 120,
          location: 'Bay 2',
          assignedBy: 'Supervisor',
          notes: 'Không thể sạc DC fast charging',
          parts: [],
          checklist: [
            { id: 1, task: 'Kiểm tra cổng CCS2', completed: false },
            { id: 2, task: 'Test với sạc AC', completed: false },
            { id: 3, task: 'Kiểm tra fuse', completed: false },
            { id: 4, task: 'Diagnostic OBD', completed: false }
          ]
        }
      ];

      setWorkOrders(mockOrders);
    };

    fetchWorkOrders();
  }, []);

  // trang thai loc va tim kiem
  const filteredOrders = workOrders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'normal': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'on-hold': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleStartWork = (orderId) => {
    setWorkOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'in-progress', startTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) } 
        : order
    ));
    toast.success('Work order started');
  };

  const handleCompleteWork = (orderId) => {
    const order = workOrders.find(o => o.id === orderId);
    const incompleteTasks = order.checklist.filter(task => !task.completed);
    
    if (incompleteTasks.length > 0) {
      toast.error(`Please complete all checklist items (${incompleteTasks.length} remaining)`);
      return;
    }

    setWorkOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'completed', endTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) } 
        : order
    ));
    toast.success('Work order completed successfully');
  };

  const handlePauseWork = (orderId) => {
    setWorkOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'on-hold' } : order
    ));
    toast.info('Work order paused');
  };

  const handleChecklistToggle = (orderId, taskId) => {
    setWorkOrders(prev => prev.map(order => 
      order.id === orderId 
        ? {
            ...order,
            checklist: order.checklist.map(task =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            )
          }
        : order
    ));
  };

  const openDetailModal = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
        <p className="text-gray-600 mt-1">Manage your assigned work orders and track progress</p>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search work orders, vehicles, or customers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
        </select>
      </div>
      {filteredOrders.length === 0 ? (
        <Card>
          <Card.Content className="p-12 text-center">
            <FiTool className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No work orders found</h3>
            <p className="text-gray-500">
              No work orders have been assigned to you yet
            </p>
          </Card.Content>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className={`border-l-4 ${getPriorityColor(order.priority).split(' ')[2]}`}>
              <Card.Content className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(order.priority)}`}>
                        {order.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-base font-medium text-gray-800">{order.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      <FiClock className="inline mr-1" />
                      {order.scheduledTime}
                    </p>
                    <p className="text-xs text-gray-500">{order.estimatedDuration} min</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Customer</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      <FiUser className="inline mr-1 text-gray-400" />
                      {order.customerName}
                    </p>
                    <p className="text-xs text-gray-600">{order.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Vehicle</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {order.vehicle.make} {order.vehicle.model}
                    </p>
                    <p className="text-xs text-gray-600">{order.vehicle.plate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      <FiMapPin className="inline mr-1 text-gray-400" />
                      {order.location}
                    </p>
                  </div>
                </div>
                {order.status === 'in-progress' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">Checklist Progress</p>
                      <span className="text-sm text-gray-600">
                        {order.checklist.filter(t => t.completed).length}/{order.checklist.length} completed
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${(order.checklist.filter(t => t.completed).length / order.checklist.length) * 100}%` }}
                      />
                    </div>
                    <div className="mt-2 space-y-1">
                      {order.checklist.map(task => (
                        <label key={task.id} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleChecklistToggle(order.id, task.id)}
                            className="mr-2 rounded text-green-600"
                          />
                          <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                            {task.task}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {order.notes && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-700 font-medium mb-1">
                      <FiMessageSquare className="inline mr-1" />
                      Notes
                    </p>
                    <p className="text-sm text-gray-700">{order.notes}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStartWork(order.id)}
                    >
                      <FiTool className="mr-1" />
                      Start Work
                    </Button>
                  )}
                  {order.status === 'in-progress' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleCompleteWork(order.id)}
                      >
                        <FiCheckCircle className="mr-1" />
                        Complete
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePauseWork(order.id)}
                      >
                        Pause
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <FiRefreshCw className="mr-1" />
                        Request Parts
                      </Button>
                    </>
                  )}
                  {order.status === 'on-hold' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStartWork(order.id)}
                    >
                      Resume Work
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDetailModal(order)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <FiCamera className="mr-1" />
                    Add Photo
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Work Order Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Priority</p>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedOrder.priority)}`}>
                      {selectedOrder.priority.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Scheduled</p>
                    <p className="font-medium">{selectedOrder.scheduledDate} at {selectedOrder.scheduledTime}</p>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Service Details</h3>
                <p className="font-medium mb-2">{selectedOrder.service}</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {selectedOrder.serviceDetails.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Make & Model</p>
                    <p className="font-medium">{selectedOrder.vehicle.make} {selectedOrder.vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">License Plate</p>
                    <p className="font-medium">{selectedOrder.vehicle.plate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-medium">{selectedOrder.vehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">VIN</p>
                    <p className="font-medium text-xs">{selectedOrder.vehicle.vin}</p>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedOrder.customerEmail}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianWorkOrders;





