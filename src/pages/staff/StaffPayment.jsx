import React, { useState } from 'react';

//dữ liệu mẫu
const initialPayments = [
  {
    id: 'HD001',
    customer: 'Nguyên',
    phone: '0978385620',
    vehicle: 'Feliz',
    plate: '51A-123.45',
    bookingDate: '19/10/2025',
    parts: [
      { name: 'Ắc Quy Lithium', qty: 1, price: 3500000 },
      { name: 'Kiểm tra điện', qty: 1, price: 400000 },
    ],
    total: 3900000,
    status: 'Chờ thanh toán',
    method: '',
    note: 'Bảo dưỡng tổng thể, kiểm tra hệ thống phanh.',
  },
  {
    id: 'HD002',
    customer: 'Vy',
    phone: '0965486877',
    vehicle: 'Klara',
    plate: '29B1-321.88',
    bookingDate: '18/10/2025',
    parts: [
      { name: 'Bánh xe EV', qty: 2, price: 1450000 },
    ],
    total: 2900000,
    status: 'Đã thanh toán',
    method: 'Chuyển khoản',
    note: 'Thay lốp trước, sau',
  },
];



function formatCurrency(val) {
  if (val === null || val === undefined) return '0 đ';
  return val.toLocaleString('vi-VN') + ' đ';
}

// Component hiển thị chi tiết hóa đơn (Giữ nguyên)
const PaymentDetails = ({ item }) => (
  <tr className="bg-gray-50 border-t border-teal-200">
    <td colSpan="7" className="px-4 py-4">
      <div className="flex flex-col md:flex-row justify-between text-xs">
        {/* Cột Chi tiết Khách hàng & Xe */}
        <div className="md:w-1/3 p-2 border-r border-gray-200 mb-4 md:mb-0">
          <p className="font-semibold text-gray-700 mb-2">Thông tin Khách hàng:</p>
          <p>
            <span className="font-medium text-gray-500">SĐT:</span> {item.phone}
          </p>
          <p>
            <span className="font-medium text-gray-500">Ngày đặt:</span> {item.bookingDate}
          </p>
          <p>
            <span className="font-medium text-gray-500">Biển số:</span> <span className='font-mono text-gray-800'>{item.plate}</span>
          </p>
        </div>

        {/* Cột Chi tiết Dịch vụ */}
        <div className="md:w-1/3 p-2 border-r border-gray-200 mb-4 md:mb-0">
          <p className="font-semibold text-gray-700 mb-2">Dịch vụ & Linh kiện:</p>
          <ul className="space-y-1">
            {item.parts.map((part, index) => (
              <li key={index} className="flex justify-between items-start">
                <span className="text-gray-700 truncate mr-2 flex-1">
                  • {part.name}
                </span>
                <span className="text-gray-500 font-medium whitespace-nowrap">
                  x{part.qty} | {formatCurrency(part.price)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột Ghi chú & Phương thức TT */}
        <div className="md:w-1/3 p-2">
          <p className="font-semibold text-gray-700 mb-2">Ghi chú & Thanh toán:</p>
          <p className="text-gray-600 italic mb-2">"{item.note || "Không có ghi chú."}"</p>
          <p className='mt-2 border-t border-dashed pt-2'>
            <span className="font-medium text-gray-500">Phương thức TT:</span> 
            <span className={`font-bold ml-1 ${item.status === 'Đã thanh toán' ? 'text-teal-600' : 'text-gray-400'}`}>
                {item.status === 'Đã thanh toán' ? item.method : 'N/A'}
            </span>
          </p>
        </div>
      </div>
    </td>
  </tr>
);


const StaffPayment = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [payments, setPayments] = useState(initialPayments);
  const [openDetailsId, setOpenDetailsId] = useState(null); 

  const filtered = payments.filter(
    i =>
      (filter === 'all' || i.status === filter) &&
      (
        i.customer.toLowerCase().includes(search.toLowerCase()) ||
        i.vehicle.toLowerCase().includes(search.toLowerCase()) ||
        i.plate.toLowerCase().includes(search.toLowerCase()) ||
        i.id.toLowerCase().includes(search.toLowerCase())
      )
  );

  const handlePaid = id => {
    if (window.confirm('Xác nhận thanh toán TIỀN MẶT cho hóa đơn ' + id + '?')) {
      setPayments(ps =>
        ps.map(item =>
          item.id === id ? { ...item, status: 'Đã thanh toán', method: 'Tiền mặt' } : item
        )
      );
    }
  };

  const toggleDetails = (id) => {
    setOpenDetailsId(openDetailsId === id ? null : id);
  };

  const getStatusClasses = (status) => {
    const baseClasses = "italic text-sm";
    if (status === 'Chờ thanh toán') {
      return `${baseClasses} text-amber-600`; 
    }
    if (status === 'Đã thanh toán') {
      return `${baseClasses} text-teal-600`; 
    }
    return `${baseClasses} text-gray-500`;
  };

  // ------------------------------------------------------------------
  // Giao diện chính
  // ------------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200">
        
        {/* Tiêu đề & Mô tả */}
        <h1 className="text-3xl font-extrabold mb-2 text-gray-900 flex items-center">
          <span className="text-teal-600 mr-3">🧾</span> Quản lý thanh toán Dịch vụ
        </h1>
        <p className="text-gray-500 mb-8">Theo dõi, cập nhật và xem chi tiết các hóa đơn sửa chữa.</p>

        {/* Bộ lọc và tìm kiếm */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="relative w-full sm:w-80">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-500 transition duration-150"
              placeholder="Tìm khách, xe, biển số, mã HĐ..."
            />
          </div>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="px-6 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-500 transition duration-150 cursor-pointer text-gray-700 font-medium"
          >
            <option value="all">📊 Tất cả hóa đơn</option>
            <option value="Chờ thanh toán">⏳ Chờ thanh toán</option>
            <option value="Đã thanh toán">✅ Đã thanh toán</option>
          </select>
        </div>

        {/* Bảng hóa đơn */}
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-800 text-white sticky top-0">
              <tr>
                <th className="px-4 py-4 text-left font-semibold w-20">Mã HĐ</th>
                <th className="px-4 py-4 text-left font-semibold">Khách hàng</th>
                <th className="px-4 py-4 text-left font-semibold">Xe</th>
                <th className="px-4 py-4 text-right font-semibold">Tổng tiền</th>
                <th className="px-4 py-4 text-center font-semibold">Trạng thái</th>
                <th className="px-4 py-4 text-center font-semibold w-40">Thao tác</th>
                <th className="px-4 py-4 text-center font-semibold w-16">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-lg text-gray-400 italic">
                    Không tìm thấy hóa đơn nào phù hợp.
                  </td>
                </tr>
              ) : (
                filtered.map(item => (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-gray-50 transition duration-150">
                      <td className="px-4 py-4 font-medium text-gray-700">{item.id}</td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{item.customer}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.phone}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{item.vehicle}</div>
                        <div className="text-xs text-gray-500 mt-0.5 font-mono">{item.plate}</div>
                      </td>
                      <td className="px-4 py-4 font-extrabold text-right text-lg text-teal-700">
                        {formatCurrency(item.total)}
                      </td>
                      {/* Cập nhật Trạng thái theo yêu cầu */}
                      <td className="px-4 py-4 text-center">
                        <span className={getStatusClasses(item.status)}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {item.status === "Chờ thanh toán" ? (
                          <button
                            onClick={() => handlePaid(item.id)}
                            className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white text-sm font-semibold shadow-md transition duration-150 transform hover:scale-105"
                          >
                            💸 Xác nhận thu tiền
                          </button>
                        ) : (
                          <span className="text-teal-600 text-sm font-bold flex items-center justify-center">
                              Hoàn tất ({item.method})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => toggleDetails(item.id)}
                          className="text-gray-500 hover:text-teal-600 transition"
                        >
                          <svg className={`w-5 h-5 transition-transform ${openDetailsId === item.id ? 'rotate-180 text-teal-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                    
                    {/* Hàng chi tiết */}
                    {openDetailsId === item.id && <PaymentDetails item={item} />}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffPayment;