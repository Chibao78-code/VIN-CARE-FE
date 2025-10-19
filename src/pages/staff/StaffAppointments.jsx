import React, { useState } from 'react';
import { FiPlus, FiSearch, FiX } from 'react-icons/fi';

const appointmentTableData = [
  { code: 'DL01', name: 'Nguyên', vehicle: 'Feliz', package: 'Gói cơ bản', time: '08:00', date: '29/09/2025', contact: '0978385620', status: 'Đã đặt' },
  { code: 'DL02', name: 'Phương', vehicle: 'Klara', package: 'Gói tiêu chuẩn', time: '09:00', date: '29/09/2025', contact: '0933532981', status: 'Đã đặt' },
  { code: 'DL03', name: 'Minh', vehicle: 'Vento', package: 'Gói cơ bản', time: '09:30', date: '29/09/2025', contact: '0395573462', status: 'Hoàn thành' },
  { code: 'DL04', name: 'Giáp', vehicle: 'Feliz', package: 'Gói toàn diện', time: '10:00', date: '29/09/2025', contact: '0365348171', status: 'Đang thực hiện' },
  { code: 'DL05', name: 'Khôi', vehicle: 'Klara', package: 'Gói tiêu chuẩn', time: '10:30', date: '29/09/2025', contact: '0245756899', status: 'Hoàn thành' },
  { code: 'DL06', name: 'Vy', vehicle: 'Klara', package: 'Gói toàn diện', time: '11:00', date: '29/09/2025', contact: '0965486877', status: 'Đã đặt' },
  { code: 'DL07', name: 'Kiệt', vehicle: 'Evo', package: 'Gói cơ bản', time: '13:00', date: '29/09/2025', contact: '0978585643', status: 'Đã đặt' },
  { code: 'DL08', name: 'Phú', vehicle: 'Klara', package: 'Gói cơ bản', time: '13:30', date: '29/09/2025', contact: '0346789847', status: 'Hoàn thành' },
  { code: 'DL09', name: 'Thành', vehicle: 'Vento', package: 'Gói tiêu chuẩn', time: '14:00', date: '29/09/2025', contact: '0945581236', status: 'Đang thực hiện' },
  { code: 'DL10', name: 'Nam', vehicle: 'Feliz', package: 'Gói cơ bản', time: '15:00', date: '29/09/2025', contact: '0389657482', status: 'Đã đặt' },
  { code: 'DL11', name: 'Duy', vehicle: 'Klara', package: 'Gói cơ bản', time: '15:30', date: '29/09/2025', contact: '0366789123', status: 'Hoàn thành' },
  { code: 'DL12', name: 'Tú', vehicle: 'Evo', package: 'Gói toàn diện', time: '16:00', date: '29/09/2025', contact: '0987412356', status: 'Hủy' },
  { code: 'DL13', name: 'Bình', vehicle: 'Vento', package: 'Gói cơ bản', time: '16:30', date: '29/09/2025', contact: '0912354789', status: 'Đã đặt' }
];

const statusColors = {
  'Đã đặt': 'bg-blue-100 text-blue-700',
  'Đang thực hiện': 'bg-yellow-100 text-yellow-700',
  'Hoàn thành': 'bg-green-100 text-green-700',
  'Hủy': 'bg-red-100 text-red-700'
};

function StaffAppointments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  // Lọc
  const filteredData = appointmentTableData.filter(item => (
    (statusFilter === 'all' || item.status === statusFilter) &&
    (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.package.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ));

  // Phân trang
  const total = filteredData.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const viewData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  // Thống kê
  const stats = {
    scheduled: appointmentTableData.filter(i => i.status === 'Đã đặt').length,
    inprogress: appointmentTableData.filter(i => i.status === 'Đang thực hiện').length,
    completed: appointmentTableData.filter(i => i.status === 'Hoàn thành').length,
    cancelled: appointmentTableData.filter(i => i.status === 'Hủy').length
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tiêu đề */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch hẹn chăm sóc, bảo dưỡng xe</h1>
          <p className="text-gray-500 mt-1">Quản lý lịch hẹn - theo dõi tiến trình</p>
        </div>
        <button
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 font-medium shadow"
          onClick={() => setShowModal(true)}
        >
          <FiPlus /> Tạo lịch hẹn mới
        </button>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Đã đặt', value: stats.scheduled, color: 'text-blue-600' },
          { label: 'Đang thực hiện', value: stats.inprogress, color: 'text-yellow-600' },
          { label: 'Hoàn thành', value: stats.completed, color: 'text-green-600' },
          { label: 'Đã hủy', value: stats.cancelled, color: 'text-red-600' }
        ].map((s, idx) => (
          <div key={idx} className="bg-white rounded-lg p-4 border shadow text-center">
            <p className="text-sm text-gray-700">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-center">
        <div className="relative w-full sm:w-2/5">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm khách, xe, gói DV..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-8 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">Tất cả</option>
          <option value="Đã đặt">Đã đặt</option>
          <option value="Đang thực hiện">Đang thực hiện</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Hủy">Hủy</option>
        </select>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Hiển thị:</span>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="border border-gray-300 rounded px-2 py-1 w-24"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Bảng lịch hẹn */}
      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-green-100 text-gray-800 border-b border-gray-300">
            <tr>
              <th className="border border-gray-300 px-3 py-2">Mã</th>
              <th className="border border-gray-300 px-3 py-2">Tên KH</th>
              <th className="border border-gray-300 px-3 py-2">Dòng xe</th>
              <th className="border border-gray-300 px-3 py-2">Gói DV</th>
              <th className="border border-gray-300 px-3 py-2">Giờ</th>
              <th className="border border-gray-300 px-3 py-2">Ngày</th>
              <th className="border border-gray-300 px-3 py-2">Liên hệ</th>
              <th className="border border-gray-300 px-3 py-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {viewData.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-gray-500 text-center">
                  Không có lịch hẹn nào phù hợp
                </td>
              </tr>
            ) : (
              viewData.map(item => (
                <tr key={item.code} className="even:bg-gray-50 hover:bg-green-50 transition border-b border-gray-200">
                  <td className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">{item.code}</td>
                  <td className="border border-gray-300 px-3 py-2">{item.name}</td>
                  <td className="border border-gray-300 px-3 py-2">{item.vehicle}</td>
                  <td className="border border-gray-300 px-3 py-2">{item.package}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">{item.time}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">{item.date}</td>
                  <td className="border border-gray-300 px-3 py-2">{item.contact}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded ${statusColors[item.status]} text-xs font-medium`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="flex justify-end items-center gap-2 mt-4">
        <button
          className="px-3 py-1 rounded bg-gray-100 border hover:bg-gray-200"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Trang trước
        </button>
        <span className="text-sm text-gray-700">Trang {page}/{maxPage}</span>
        <button
          className="px-3 py-1 rounded bg-gray-100 border hover:bg-gray-200"
          onClick={() => setPage(Math.min(maxPage, page + 1))}
          disabled={page === maxPage}
        >
          Trang sau
        </button>
      </div>

      {/* Modal demo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative shadow-lg">
            <button
              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
              onClick={() => setShowModal(false)}
            >
              <FiX />
            </button>
            <h2 className="text-lg font-semibold mb-4">Tạo lịch hẹn mới</h2>
            <div className="text-gray-400 text-center py-10">(Demo: Form thêm lịch ở đây)</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffAppointments;
