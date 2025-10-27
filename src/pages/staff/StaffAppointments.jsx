import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const initialAppointments = [
  { code: 'DL01', name: 'Nguyên', vehicle: 'Feliz', package: 'Thay Thế phụ tùng', time: '08:00', date: '29/09/2025', contact: '0978385620', status: 'Đã đặt' },
  { code: 'DL02', name: 'Phương', vehicle: 'Klara', package: 'Bảo dưỡng định kỳ', time: '09:00', date: '29/09/2025', contact: '0933532981', status: 'Đã đặt' },
  { code: 'DL03', name: 'Minh', vehicle: 'Vento', package: 'Thay Thế phụ tùng', time: '09:30', date: '29/09/2025', contact: '0395573462', status: 'Hoàn thành' },
  { code: 'DL04', name: 'Giáp', vehicle: 'Feliz', package: 'Bảo dưỡng định kỳ', time: '10:00', date: '29/09/2025', contact: '0365348171', status: 'Đang thực hiện' },
  { code: 'DL05', name: 'Khôi', vehicle: 'Klara', package: 'Bảo dưỡng định kỳ', time: '10:30', date: '29/09/2025', contact: '0245756899', status: 'Hoàn thành' },
  { code: 'DL06', name: 'Vy', vehicle: 'Klara', package: 'Bảo dưỡng định kỳ', time: '11:00', date: '29/09/2025', contact: '0965486877', status: 'Đã đặt' },
  { code: 'DL07', name: 'Kiệt', vehicle: 'Evo', package: 'Thay Thế phụ tùng', time: '13:00', date: '29/09/2025', contact: '0978585643', status: 'Đã đặt' },
  { code: 'DL08', name: 'Phú', vehicle: 'Klara', package: 'Sửa chữa', time: '13:30', date: '29/09/2025', contact: '0346789847', status: 'Hoàn thành' },
  { code: 'DL09', name: 'Thành', vehicle: 'Vento', package: 'Thay Thế phụ tùng', time: '14:00', date: '29/09/2025', contact: '0945581236', status: 'Đang thực hiện' },
  { code: 'DL10', name: 'Nam', vehicle: 'Feliz', package: 'Sửa chữa', time: '15:00', date: '29/09/2025', contact: '0389657482', status: 'Đã đặt' },
  { code: 'DL11', name: 'Duy', vehicle: 'Klara', package: 'Bảo dưỡng định kỳ', time: '15:30', date: '29/09/2025', contact: '0366789123', status: 'Hoàn thành' },
  { code: 'DL12', name: 'Tú', vehicle: 'Evo', package: 'Bảo dưỡng định kỳ', time: '16:00', date: '29/09/2025', contact: '0987412356', status: 'Đã hủy' },
  { code: 'DL13', name: 'Bình', vehicle: 'Vento', package: 'Thay Thế phụ tùng', time: '16:30', date: '29/09/2025', contact: '0912354789', status: 'Đã đặt' }
];

const statusColors = {
  'Đã đặt': 'bg-blue-100 text-blue-700',
  'Đặt thành công': 'bg-teal-100 text-teal-700',
  'Đang thực hiện': 'bg-yellow-100 text-yellow-700',
  'Hoàn thành': 'bg-green-100 text-green-700',
  'Đã hủy': 'bg-red-100 text-red-700'
};

function StaffAppointments() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Lọc theo search
  const filteredData = appointments.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.package.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Phân trang
  const total = filteredData.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const viewData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  // Hàm xác nhận
  const handleConfirm = code => {
    setAppointments(prev =>
      prev.map(item =>
        item.code === code && item.status === 'Đã đặt'
          ? { ...item, status: 'Đặt thành công' }
          : item
      )
    );
  };

  // Thống kê động
  const stats = {
    scheduled: appointments.filter(i => i.status === 'Đã đặt').length,
    confirmed: appointments.filter(i => i.status === 'Đặt thành công').length,
    inprogress: appointments.filter(i => i.status === 'Đang thực hiện').length,
    completed: appointments.filter(i => i.status === 'Hoàn thành').length,
    cancelled: appointments.filter(i => i.status === 'Đã hủy').length
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tiêu đề */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch hẹn chăm sóc, bảo dưỡng xe</h1>
          <p className="text-gray-500 mt-1">Quản lý lịch hẹn - theo dõi tiến trình</p>
        </div>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Đã đặt', value: stats.scheduled, color: 'text-blue-600' },
          { label: 'Đặt thành công', value: stats.confirmed, color: 'text-teal-600' },
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

      {/* Tìm kiếm */}
      <div className="flex items-center gap-3 mb-4">
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
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Hiển thị:</span>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="border border-gray-300 rounded px-2 py-1 w-24"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
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
              <th className="border border-gray-300 px-3 py-2 text-center">Tiếp nhận</th>
            </tr>
          </thead>
          <tbody>
            {viewData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-6 text-gray-500 text-center">
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
                    <span className={`inline-block px-2 py-1 rounded ${statusColors[item.status] || 'bg-gray-200 text-gray-800'} text-xs font-medium`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    {item.status === 'Đã đặt' ? (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        onClick={() => handleConfirm(item.code)}
                      >
                        Xác nhận
                      </button>
                    ) : (
                      <button
                        className="bg-gray-300 text-gray-600 px-3 py-1 rounded text-sm cursor-not-allowed"
                        disabled
                      >
                        Đã xác nhận
                      </button>
                    )}
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
    </div>
  );
}

export default StaffAppointments;
