import React, { useState } from "react";
import {
  FiUser,
  FiTruck,
  FiClipboard,
  FiRepeat,
  FiCheckCircle,
  FiSearch,
} from "react-icons/fi";

// Danh sách kỹ thuật viên mặc định
const defaultTechnicians = [
  { id: "nv01", name: "Nguyễn Văn A" },
  { id: "nv02", name: "Trần Văn B" },
  { id: "nv03", name: "Lê Thị C" },
];

// Gói bảo dưỡng mẫu
const maintenancePackages = [
  {
    id: 1,
    name: "Gói tiêu chuẩn",
    code: "PKGSTD",
    price: 500000,
    desc: "Thay dầu, vệ sinh lọc gió, kiểm tra phanh",
  },
  {
    id: 2,
    name: "Gói nâng cao",
    code: "PKGADV",
    price: 1200000,
    desc: "Thay dầu, vệ sinh lọc gió, bảo dưỡng phanh, kiểm tra điện, kiểm tra acquy",
  },
  {
    id: 3,
    name: "Gói toàn diện",
    code: "PKGALL",
    price: 2500000,
    desc: "Bảo dưỡng toàn bộ các hạng mục, test động cơ, điện và thay toàn bộ vật tư hao mòn",
  },
];

// Danh sách phụ tùng mẫu
const availableParts = [
  {
    id: 1,
    name: "Ắc quy Lithium 60V",
    code: "AQ60V",
    price: 6800000,
    laborCost: 200000,
  },
  {
    id: 2,
    name: "Đèn pha LED",
    code: "DENLED",
    price: 850000,
    laborCost: 150000,
  },
  {
    id: 3,
    name: "Bộ thắng đĩa trước",
    code: "BTD01",
    price: 450000,
    laborCost: 300000,
  },
  {
    id: 4,
    name: "Cảm biến phanh ABS",
    code: "ABS01",
    price: 1200000,
    laborCost: 250000,
  },
  {
    id: 5,
    name: "Gương chiếu hậu",
    code: "GUONG01",
    price: 350000,
    laborCost: 100000,
  },
];

// Các loại dịch vụ
const serviceTypesList = [
  { key: "maintenance", label: "Bảo dưỡng định kỳ" },
  { key: "parts", label: "Thay thế phụ tùng" },
  { key: "repair", label: "Sửa chữa kỹ thuật" },
];

// Box dùng cho 1 card nhóm nội dung
const TableBox = ({ icon, title, children }) => (
  <div className="bg-white border border-blue-300 rounded-xl shadow p-6 mb-6">
    <div className="flex items-center gap-2 mb-3 text-blue-700">
      {icon}
      <span className="font-bold text-base md:text-lg">{title}</span>
    </div>
    {children}
  </div>
);

const InfoBox = ({ icon, title, children, className = "" }) => (
  <div
    className={`bg-white border border-blue-200 rounded-xl shadow-sm p-6 mb-6 ${className}`}
  >
    <div className="flex items-center gap-2 mb-3 text-blue-700">
      {icon}
      <span className="font-bold text-base md:text-lg">{title}</span>
    </div>
    {children}
  </div>
);

const StaffCheckin = () => {
  // State cho form: luôn rỗng, nhập tay, có gợi ý placeholder
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    vehicleModel: "",
    vehiclePlate: "",
    vehicleColor: "",
    vehicleVin: "",
    vehicleKm: "",
    notes: "",
    technician: "",
  });
  const [selectedServiceTypes, setSelectedServiceTypes] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedParts, setSelectedParts] = useState([]);
  const [partsSearch, setPartsSearch] = useState("");
  const [repairItems, setRepairItems] = useState([]);

  // Tính tổng tiền từng nhóm dịch vụ
  const totalMaintenance = selectedServiceTypes.includes("maintenance")
    ? selectedPackage?.price || 0
    : 0;
  const totalParts = selectedServiceTypes.includes("parts")
    ? selectedParts.reduce((sum, p) => sum + p.price * p.quantity, 0)
    : 0;
  const totalPartsLabor = selectedServiceTypes.includes("parts")
    ? selectedParts.reduce((sum, p) => sum + (p.laborCost || 0) , 0)
    : 0;
  const totalRepair = selectedServiceTypes.includes("repair")
    ? repairItems.reduce((sum, item) => sum + (item.labor || 0), 0)
    : 0;
  const totalAll =
    totalMaintenance + totalParts + totalPartsLabor + totalRepair;

  // Xử lý chọn loại dịch vụ
  const handleTypeToggle = (key) => {
    setSelectedServiceTypes((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
    if (key === "maintenance") setSelectedPackage(null);
    if (key === "parts") setSelectedParts([]);
    if (key === "repair") setRepairItems([]);
  };

  // Xử lý phụ tùng: khi check chọn thì điền tiền công mặc định luôn
  const handlePartToggle = (part) => {
    setSelectedParts((prev) => {
      const existing = prev.find((p) => p.id === part.id);
      if (existing) {
        return prev.filter((p) => p.id !== part.id);
      } else {
        return [...prev, { ...part, quantity: 1, laborCost: part.laborCost }];
      }
    });
  };
  // Đổi số lượng phụ tùng
  const handleQuantityChange = (id, value) => {
    setSelectedParts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, Number(value)) } : p
      )
    );
  };
  // Đổi tiền công
  const handleLaborCostChange = (id, value) => {
    setSelectedParts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, laborCost: Math.max(0, Number(value)) } : p
      )
    );
  };

  // Sửa chữa - nhiều dòng
  const addRepairItem = () =>
    setRepairItems([...repairItems, { name: "", labor: 0 }]);
  const handleRepairItemChange = (idx, field, value) => {
    setRepairItems((items) =>
      items.map((item, i) =>
        i === idx
          ? { ...item, [field]: field === "labor" ? Number(value) : value }
          : item
      )
    );
  };
  const removeRepairItem = (idx) =>
    setRepairItems((items) => items.filter((_, i) => i !== idx));
  // Xử lý thay đổi form chung
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Reset toàn bộ form
  const handleReset = () => {
    setFormData({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      vehicleModel: "",
      vehiclePlate: "",
      vehicleColor: "",
      vehicleVin: "",
      vehicleKm: "",
      notes: "",
      technician: "",
    });
    setSelectedServiceTypes([]);
    setSelectedPackage(null);
    setSelectedParts([]);
    setPartsSearch("");
    setRepairItems([]);
  };
  // Submit phiếu tiếp nhận
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.technician) {
      alert("⚠️ Vui lòng chọn kỹ thuật viên!");
      return;
    }
    if (selectedServiceTypes.length === 0) {
      alert("⚠️ Vui lòng chọn ít nhất một loại dịch vụ!");
      return;
    }
    if (selectedServiceTypes.includes("maintenance") && !selectedPackage) {
      alert("⚠️ Vui lòng chọn gói bảo dưỡng!");
      return;
    }
    if (selectedServiceTypes.includes("parts") && selectedParts.length === 0) {
      alert("⚠️ Vui lòng chọn phụ tùng!");
      return;
    }
    if (selectedServiceTypes.includes("repair") && repairItems.length === 0) {
      alert("⚠️ Vui lòng nhập ít nhất một hạng mục sửa chữa!");
      return;
    }
    alert(
      `✅ Đã tiếp nhận xe!\nTổng chi phí dự kiến: ${totalAll.toLocaleString()}₫`
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto bg-transparent my-10"
    >
      {/* TIÊU ĐỀ FORM */}
      <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
        <FiCheckCircle className="text-blue-500 text-3xl" /> Phiếu tiếp nhận xe
        khách
      </h2>

      {/* KHÁCH & XE  */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bảng khách hàng */}
        <TableBox icon={<FiUser />} title="Thông tin khách hàng">
          <table
            className="w-full text-sm bg-white border-separate border-spacing-0"
            style={{
              borderWidth: 1,
              borderColor: "#3182ce",
              borderStyle: "solid",
              borderRadius: 8,
            }}
          >
            <tbody>
              <tr>
                <td className="bg-blue-50 font-semibold px-3 py-2 border border-blue-300 min-w-[120px]">
                  Họ và tên *
                </td>
                <td className="px-3 py-2 border border-blue-300">
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="w-full border border-blue-300 rounded px-2 py-1"
                    placeholder="Họ và tên khách hàng"
                  />
                </td>
              </tr>
              <tr>
                <td className="bg-blue-50 font-semibold px-3 py-2 border border-blue-300">
                  Số điện thoại *
                </td>
                <td className="px-3 py-2 border border-blue-300">
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    required
                    className="w-full border border-blue-300 rounded px-2 py-1"
                    placeholder="VD: 0909123456"
                  />
                </td>
              </tr>
              <tr>
                <td className="bg-blue-50 font-semibold px-3 py-2 border border-blue-300">
                  Email
                </td>
                <td className="px-3 py-2 border border-blue-300">
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className="w-full border border-blue-300 rounded px-2 py-1"
                    placeholder="VD: ten@gmail.com"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </TableBox>
        {/* Bảng thông tin xe */}
        <TableBox icon={<FiTruck />} title="Thông tin xe">
          <table
            className="w-full text-sm bg-white border-separate border-spacing-0"
            style={{
              borderWidth: 1,
              borderColor: "#3182ce",
              borderStyle: "solid",
              borderRadius: 8,
            }}
          >
            <tbody>
              <tr>
                <td className="bg-blue-50 font-semibold px-3 py-2 border border-blue-300 min-w-[120px]">
                  Mẫu xe
                </td>
                <td className="px-3 py-2 border border-blue-300">
                  <input
                    type="text"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    className="w-full border border-blue-300 rounded px-2 py-1"
                    placeholder="VD: Feliz S, Evo, ..."
                  />
                </td>
              </tr>
              <tr>
                <td className="bg-blue-50 font-semibold px-3 py-2 border border-blue-300">
                  Biển số *
                </td>
                <td className="px-3 py-2 border border-blue-300">
                  <input
                    type="text"
                    name="vehiclePlate"
                    value={formData.vehiclePlate}
                    onChange={handleChange}
                    required
                    className="w-full border border-blue-300 rounded px-2 py-1"
                    placeholder="VD: 51H-123.45"
                  />
                </td>
              </tr>
              <tr>
                <td className="bg-blue-50 font-semibold px-3 py-2 border border-blue-300">
                  Màu xe
                </td>
                <td className="px-3 py-2 border border-blue-300">
                  <input
                    type="text"
                    name="vehicleColor"
                    value={formData.vehicleColor}
                    onChange={handleChange}
                    className="w-full border border-blue-300 rounded px-2 py-1"
                    placeholder="VD: Đen"
                  />
                </td>
              </tr>
              <tr>
                <td className="bg-blue-50 font-semibold px-3 py-2 border border-blue-300">
                  Số khung VIN
                </td>
                <td className="px-3 py-2 border border-blue-300">
                  <input
                    type="text"
                    name="vehicleVin"
                    value={formData.vehicleVin}
                    onChange={handleChange}
                    className="w-full border border-blue-300 rounded px-2 py-1"
                    placeholder="VD: VF123456789VN001"
                  />
                </td>
              </tr>
              <tr>
                <td className="bg-blue-50 font-semibold px-3 py-2 border border-blue-300">
                  Số km đã đi
                </td>
                <td className="px-3 py-2 border border-blue-300">
                  <input
                    type="number"
                    name="vehicleKm"
                    value={formData.vehicleKm}
                    onChange={handleChange}
                    className="w-full border border-blue-300 rounded px-2 py-1"
                    placeholder="VD: 12000"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </TableBox>
      </div>
      <InfoBox icon={<FiClipboard />} title="Chọn loại dịch vụ">
        <div className="flex flex-wrap gap-5 mb-2">
          {serviceTypesList.map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-1 cursor-pointer select-none px-4 py-2 rounded-lg border
                transition shadow-sm bg-white hover:border-blue-500 border-blue-200 font-semibold"
              style={{
                background: selectedServiceTypes.includes(key)
                  ? "#e0eaff"
                  : "#fff",
                borderWidth: selectedServiceTypes.includes(key) ? "2px" : "1px",
              }}
            >
              <input
                type="checkbox"
                checked={selectedServiceTypes.includes(key)}
                onChange={() => handleTypeToggle(key)}
              />
              {label}
            </label>
          ))}
        </div>
      </InfoBox>

      {selectedServiceTypes.includes("maintenance") && (
        <InfoBox icon={null} title="Chọn gói bảo dưỡng định kỳ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {maintenancePackages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  selectedPackage?.id === pkg.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-blue-200 hover:border-blue-400"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{pkg.name}</span>
                  <span className="font-bold text-blue-700">
                    {pkg.price.toLocaleString()}₫
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-1">Mã: {pkg.code}</div>
                <div className="text-xs text-gray-500">{pkg.desc}</div>
              </div>
            ))}
          </div>
          {selectedPackage && (
            <div className="mt-3 text-right text-blue-800 font-bold text-lg">
              Đã chọn: {selectedPackage.name} - Phí:{" "}
              {selectedPackage.price.toLocaleString()}₫
            </div>
          )}
        </InfoBox>
      )}

      {selectedServiceTypes.includes("parts") && (
        <InfoBox icon={null} title="Chọn phụ tùng & báo giá">
          <div className="flex items-center mb-4 max-w-xl">
            <input
              type="text"
              value={partsSearch}
              onChange={(e) => setPartsSearch(e.target.value)}
              placeholder="Tìm kiếm phụ tùng theo tên hoặc mã..."
              className="flex-1 border border-blue-300 rounded-l px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{ minWidth: 300, fontSize: 18 }}
            />
            <span className="bg-blue-200 px-3 py-3 rounded-r text-blue-700 flex items-center text-lg">
              <FiSearch />
            </span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-blue-400">
            <table className="min-w-[1000px] w-full bg-white text-base border border-blue-400">
              <thead>
                <tr>
                  <th className="border border-blue-400 bg-blue-50 text-center py-2">
                    STT
                  </th>
                  <th
                    className="border border-blue-400 bg-blue-50 text-center py-2"
                    style={{ width: 170 }}
                  >
                    Tên phụ tùng
                  </th>
                  <th className="border border-blue-400 bg-blue-50 text-center py-2">
                    Mã
                  </th>
                  <th className="border border-blue-400 bg-blue-50 text-center py-2">
                    Đơn giá
                  </th>
                  <th className="border border-blue-400 bg-blue-50 text-center py-2">
                    Tiền công
                  </th>
                  <th className="border border-blue-400 bg-blue-50 text-center py-2">
                    Số lượng
                  </th>
                  <th className="border border-blue-400 bg-blue-50 text-center py-2">
                    Thành tiền
                  </th>
                  <th className="border border-blue-400 bg-blue-50 text-center py-2">
                    Chọn
                  </th>
                </tr>
              </thead>
              <tbody>
                {availableParts
                  .filter(
                    (part) =>
                      part.name
                        .toLowerCase()
                        .includes(partsSearch.toLowerCase()) ||
                      part.code
                        .toLowerCase()
                        .includes(partsSearch.toLowerCase())
                  )
                  .map((part, idx) => {
                    const selected = selectedParts.find(
                      (p) => p.id === part.id
                    );
                    const quantity = selected?.quantity || 0;
                    const laborCost = selected
                      ? selected.laborCost
                      : part.laborCost;
                    const totalLineCost =
                      part.price * quantity + (laborCost || 0) * quantity;
                    return (
                      <tr
                        key={part.id}
                        className={selected ? "bg-blue-50" : ""}
                      >
                        <td className="border border-blue-400 text-center">
                          {idx + 1}
                        </td>
                        <td className="border border-blue-400">{part.name}</td>
                        <td className="border border-blue-400 text-center">
                          {part.code}
                        </td>
                        <td className="border border-blue-400 text-right">
                          {part.price.toLocaleString()}₫
                        </td>
                        <td className="border border-blue-400 text-right">
                          {selected ? (
                            <input
                              type="number"
                              min={0}
                              value={laborCost}
                              onChange={(e) =>
                                handleLaborCostChange(part.id, e.target.value)
                              }
                              className="w-24 border rounded px-1 py-1 text-right"
                            />
                          ) : (
                            (part.laborCost || 0).toLocaleString() + "₫"
                          )}
                        </td>
                        <td className="border border-blue-400 text-center">
                          {selected ? (
                            <input
                              type="number"
                              min="1"
                              value={selected.quantity}
                              onChange={(e) =>
                                handleQuantityChange(part.id, e.target.value)
                              }
                              className="w-16 border rounded px-1 py-1 text-center"
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="border border-blue-400 text-right">
                          {selected && quantity > 0
                            ? totalLineCost.toLocaleString() + "₫"
                            : "-"}
                        </td>
                        <td className="border border-blue-400 text-center">
                          <input
                            type="checkbox"
                            checked={!!selected}
                            onChange={() => handlePartToggle(part)}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <div className="text-right mt-4 space-y-1">
              <div className="text-blue-700 font-bold text-lg">
                Tổng tiền phụ tùng: {totalParts.toLocaleString()}₫
              </div>
              <div className="text-blue-700 font-bold text-lg">
               Tổng tiền công thay: {totalPartsLabor.toLocaleString()}₫
              </div>
              <div className="text-blue-800 font-extrabold text-xl border-t pt-2">
                Tổng phụ tùng + công:{" "}
                {(totalParts + totalPartsLabor).toLocaleString()}₫
              </div>
            </div>
          </div>
        </InfoBox>
      )}

      {selectedServiceTypes.includes("repair") && (
        <InfoBox icon={null} title="Bảng hạng mục sửa chữa kỹ thuật">
          <button
            type="button"
            onClick={addRepairItem}
            className="bg-blue-100 border border-blue-400 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 mb-3"
          >
            + Thêm hạng mục
          </button>
          <div className="overflow-x-auto rounded-lg border border-blue-400">
            <table className="min-w-[700px] w-full bg-white text-base border border-blue-400">
              <thead>
                <tr>
                  <th className="border border-blue-400 bg-blue-50 text-center py-2 w-16">
                    STT
                  </th>
                  <th
                    className="border border-blue-400 bg-blue-50 text-center py-2"
                    style={{ width: 350 }}
                  >
                    Tên hạng mục/vấn đề
                  </th>
                  <th className="border border-blue-400 bg-blue-50 text-center py-2 w-40">
                    Tiền công
                  </th>
                  <th className="border border-blue-400 bg-blue-50 text-center py-2 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {repairItems.length === 0 ? (
                  <tr>
                    <td
                      className="border border-blue-400 text-center text-gray-500"
                      colSpan={4}
                    >
                      (Chưa có hạng mục. Nhấn nút "Thêm hạng mục" để bắt đầu)
                    </td>
                  </tr>
                ) : (
                  repairItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border border-blue-400 text-center align-middle">
                        {idx + 1}
                      </td>
                      <td className="border border-blue-400 px-2 py-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            handleRepairItemChange(idx, "name", e.target.value)
                          }
                          className="w-full border rounded px-2 py-1"
                          placeholder="Mô tả hạng mục..."
                        />
                      </td>
                      <td className="border border-blue-400 px-2 py-2 text-right">
                        <input
                          type="number"
                          min={0}
                          value={item.labor}
                          onChange={(e) =>
                            handleRepairItemChange(idx, "labor", e.target.value)
                          }
                          className="w-28 border rounded px-2 py-1 text-right"
                          placeholder="0"
                        />
                      </td>
                      <td className="border border-blue-400 text-center align-middle">
                        <button
                          type="button"
                          onClick={() => removeRepairItem(idx)}
                          className="text-red-500 font-bold px-1 text-lg"
                          title="Xoá"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="text-right mt-3">
              <span className="text-blue-700 font-bold text-lg">
                Tổng tiền công sửa chữa: {totalRepair.toLocaleString()}₫
              </span>
            </div>
          </div>
        </InfoBox>
      )}
      <div className="text-right my-6">
        <span className="inline-block bg-blue-50 border-l-4 border-blue-400 py-2 px-6 rounded font-bold text-blue-800 text-xl">
          Tổng chi phí: {totalAll.toLocaleString()}₫
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InfoBox
          icon={<FiUser />}
          title="Chọn kỹ thuật viên phụ trách"
          className="mb-0"
        >
          <select
            className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
            value={formData.technician}
            onChange={handleChange}
            name="technician"
            required
          >
            <option value="">-- Chọn kỹ thuật viên --</option>
            {defaultTechnicians.map((nv) => (
              <option key={nv.id} value={nv.id}>
                {nv.name}
              </option>
            ))}
          </select>
        </InfoBox>
        <InfoBox icon={<FiClipboard />} title="Ghi chú thêm" className="mb-0">
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full border border-blue-200 rounded px-3 py-2"
            placeholder="Ghi chú về xe hoặc yêu cầu của khách"
          />
        </InfoBox>
      </div>

      <div className="flex justify-center gap-6 mt-4">
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded font-medium flex items-center gap-1"
        >
          <FiRepeat /> Đặt lại
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-2 rounded font-semibold shadow flex items-center gap-2"
        >
          <FiCheckCircle /> Xác nhận tiếp nhận
        </button>
      </div>
    </form>
  );
};

export default StaffCheckin;
