import React, { useState } from "react";

/*
 
    -  tìm kiếm, lọc theo dòng xe, thêm mới phụ tùng, hiển thị status kho.
*/

/* Dữ liệu mẫu  */
const initialParts = [
  { id: 1, ma_phu_tung: "VF001", name: "Ắc quy Lithium 60V", loai: "VinFast Feliz S", model_id: "VF-FS", price: 6800000, status: "Đủ kho" },
  { id: 2, ma_phu_tung: "VF002", name: "Bộ sạc tiêu chuẩn 60V", loai: "VinFast Klara A2", model_id: "VF-KA2", price: 1250000, status: "Cần nhập" },
  { id: 3, ma_phu_tung: "VF003", name: "Đèn pha LED", loai: "VinFast Evo200", model_id: "VF-EV", price: 950000, status: "Đủ kho" },
  { id: 4, ma_phu_tung: "VF004", name: "Cụm phanh đĩa trước", loai: "VinFast Theon S", model_id: "VF-TS", price: 2150000, status: "Sắp hết" },
  { id: 5, ma_phu_tung: "VF005", name: "Gương chiếu hậu", loai: "VinFast Impes", model_id: "VF-IP", price: 450000, status: "Đủ kho" },
];


const statusColors = {
  "Đủ kho": "bg-green-100 text-green-700",
  "Sắp hết": "bg-yellow-100 text-yellow-700",
  "Cần nhập": "bg-red-100 text-red-700",
};

const StaffParts = () => {

  // parts danh sách phụ tùng 
  const [parts, setParts] = useState(initialParts);

  // search từ khóa tìm kiếm
  const [search, setSearch] = useState("");

  // filterType lọc theo dòng xe VinFast (loai)
  const [filterType, setFilterType] = useState("");

  // showForm bật/tắt form thêm mới
  const [showForm, setShowForm] = useState(false);

  // newPart state tạm để chứa dữ liệu form thêm mới
  const [newPart, setNewPart] = useState({
    ma_phu_tung: "",
    name: "",
    loai: "",
    model_id: "",
    price: "",
    status: "Đủ kho", // mặc định trạng thái khi thêm mới
  });

  /* Hàm xử lý  */

  // Cập nhật giá trị ô tìm kiếm
  const handleSearchChange = (e) => setSearch(e.target.value);

  // Cập nhật giá trị filter (dòng xe)
  const handleFilterChange = (e) => setFilterType(e.target.value);

  // Cập nhật giá trị từng input trong form thêm mới
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Lưu vào newPart, nếu muốn validate (ví dụ price >= 0) thì kiểm tra ở đây
    setNewPart((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý submit form thêm phần tử mới vào danh sách
  const handleAddPart = (e) => {
    e.preventDefault();

    // Validate : bắt buộc các trường quan trọng
    if (!newPart.ma_phu_tung || !newPart.name || !newPart.loai || !newPart.model_id || !newPart.price) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Thêm vào state local
    setParts((prev) => [
      ...prev,
      {
        id: prev.length + 1, 
        ...newPart,
        price: parseFloat(newPart.price),
      },
    ]);

    // Reset form
    setNewPart({ ma_phu_tung: "", name: "", loai: "", model_id: "", price: "", status: "Đủ kho" });
    setShowForm(false);
  };

  
  /*  Lọc + tìm kiếm hiển thị */
  const filteredParts = parts.filter((item) => {
    // Tìm theo mã, tên, model (không phân biệt hoa thường)
    const matchSearch =
      item.ma_phu_tung.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.model_id.toLowerCase().includes(search.toLowerCase());

    // Lọc theo dòng xe nếu người dùng chọn
    const matchType = filterType ? item.loai === filterType : true;

    return matchSearch && matchType;
  });


  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header: tiêu đề + nút thêm */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          🧰 Quản lý phụ tùng xe máy điện VinFast
        </h1>

        {/* Nút form thêm mới */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          {showForm ? "Thu gọn" : "+ Thêm phụ tùng"}
        </button>
      </div>

      {/* Bộ lọc, tìm kiếm */}
      <div className="flex gap-4 mb-6">
        {/* Input tìm kiếm */}
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="🔍 Tìm theo mã, tên, model..."
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        {/* Dropdown lọc theo dòng xe VinFast */}
        <select
          value={filterType}
          onChange={handleFilterChange}
          className="border px-7 py-2 rounded-lg"
        >
          <option value="">Tất cả dòng xe</option>
          {/* DB  map từ API */}
          <option value="VinFast Feliz S">VinFast Feliz S</option>
          <option value="VinFast Klara A2">VinFast Klara A2</option>
          <option value="VinFast Evo200">VinFast Evo200</option>
          <option value="VinFast Theon S">VinFast Theon S</option>
          <option value="VinFast Impes">VinFast Impes</option>
        </select>
      </div>

      {/* Form thêm mới (hiện khi showForm === true) */}
      {showForm && (
        <form
          onSubmit={handleAddPart}
          className="mb-6 grid grid-cols-2 gap-4 bg-gray-50 p-5 rounded-lg border border-gray-200"
        >
          {/* Mã phụ tùng */}
          <input
            name="ma_phu_tung"
            value={newPart.ma_phu_tung}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Mã phụ tùng (unique)"
          />

          {/* Tên phụ tùng */}
          <input
            name="name"
            value={newPart.name}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Tên phụ tùng"
          />

          {/* Dòng xe VinFast  */}
          <select
            name="loai"
            value={newPart.loai}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="">-- Chọn dòng xe VinFast --</option>
            <option value="VinFast Feliz S">VinFast Feliz S</option>
            <option value="VinFast Klara A2">VinFast Klara A2</option>
            <option value="VinFast Evo200">VinFast Evo200</option>
            <option value="VinFast Theon S">VinFast Theon S</option>
            <option value="VinFast Impes">VinFast Impes</option>
          </select>

          {/* Model ID */}
          <input
            name="model_id"
            value={newPart.model_id}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Mã model (VD: VF-TS)"
          />

          {/* Giá bán */}
          <input
            name="price"
            value={newPart.price}
            onChange={handleInputChange}
            type="number"
            step="0.01"
            className="border p-2 rounded"
            placeholder="Giá bán (VNĐ)"
          />

          {/* Trạng thái kho: Đủ kho / Sắp hết / Cần nhập */}
          <select
            name="status"
            value={newPart.status}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="Đủ kho">Đủ kho</option>
            <option value="Sắp hết">Sắp hết</option>
            <option value="Cần nhập">Cần nhập</option>
          </select>

          {/* Nút submit */}
          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            ✅ Thêm phụ tùng
          </button>
        </form>
      )}

      {/* ---------- Bảng danh sách ---------- */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-4 py-2 border">STT</th>
              <th className="px-4 py-2 border">Mã phụ tùng</th>
              <th className="px-4 py-2 border">Tên phụ tùng</th>
              <th className="px-4 py-2 border">Dòng xe VinFast</th>
              <th className="px-4 py-2 border">Model ID</th>
              <th className="px-4 py-2 border text-right">Giá bán (VNĐ)</th>
              <th className="px-4 py-2 border text-center">Trạng thái kho</th>
            </tr>
          </thead>
          <tbody>
            {filteredParts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">
                  Không tìm thấy phụ tùng phù hợp
                </td>
              </tr>
            ) : (
              filteredParts.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                
                  <td className="border px-4 py-2 text-gray-500">{item.id}</td>

                  {/* Mã phụ tùng */}
                  <td className="border px-4 py-2 font-medium">{item.ma_phu_tung}</td>

                  {/* Tên phụ tùng */}
                  <td className="border px-4 py-2">{item.name}</td>

                  {/* Dòng xe (loai) */}
                  <td className="border px-4 py-2">{item.loai}</td>

                  {/* Model ID */}
                  <td className="border px-4 py-2">{item.model_id}</td>

                  {/* Giá bán: format tiền VNĐ */}
                  <td className="border px-4 py-2 text-right font-semibold text-green-700">
                    {Number(item.price).toLocaleString("vi-VN")} ₫
                  </td>

                  {/* Trạng thái kho */}
                  <td className="border px-4 py-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[item.status] || "bg-gray-100 text-gray-700"}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tổng số phần tử hiển thị */}
      <p className="text-sm text-gray-500 mt-3">
        Tổng cộng: <span className="font-semibold">{filteredParts.length}</span> phụ tùng hiển thị
      </p>

    </div>
  );
};

export default StaffParts;
