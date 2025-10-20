import React, { useState } from 'react';

const StaffCheckin = () => {
  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    vehicleMake: '',
    vehicleModel: '',
    vehiclePlate: '',
    notes: '',
  });

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    //  xử lý hoặc gọi API lưu thông tin xe tiếp nhận
    alert('Tiếp nhận xe thành công');
    setFormData({
      customerName: '',
      customerPhone: '',
      vehicleMake: '',
      vehicleModel: '',
      vehiclePlate: '',
      notes: '',
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-6">Tiếp nhận xe mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Tên khách hàng</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Nhập tên khách hàng"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Số điện thoại</label>
          <input
            type="tel"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Hãng xe</label>
            <input
              type="text"
              name="vehicleMake"
              value={formData.vehicleMake}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Ví dụ: Vinfast"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Mẫu xe</label>
            <input
              type="text"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Ví dụ: Feliz S"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Biển số xe</label>
            <input
              type="text"
              name="vehiclePlate"
              value={formData.vehiclePlate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Ví dụ: ABC-1234"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Ghi chú (nếu có)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Nhập ghi chú về xe hoặc yêu cầu của khách"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white rounded px-6 py-2 font-medium transition"
        >
          Xác nhận tiếp nhận
        </button>
      </form>
    </div>
  );
};

export default StaffCheckin;
