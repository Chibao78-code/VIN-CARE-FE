import React, { useState } from "react";
import BookingModal from "../components/BookingModal";
import Button from "../components/ui/Button";
import { FiSearch, FiTool, FiShield, FiZap } from "react-icons/fi";

const packages = [
  {
    id: "basic",
    name: "Cơ bản",
    icon: <FiTool />,
    description: "Kiểm tra tổng quát, vệ sinh xe",
    image: "/images/goi-co-ban.png",
    color: "#027C9D",
    hover: "#02617A",
  },
  {
    id: "standard",
    name: "Tiêu chuẩn",
    icon: <FiShield />,
    description: "Kiểm tra động cơ, điện, khung xe",
    image: "/images/goi-tieu-chuan.png",
    color: "#027C9D",
    hover: "#02617A",
  },
  {
    id: "full",
    name: "Toàn diện",
    icon: <FiZap />,
    description: "Kiểm tra sâu, cập nhật phần mềm, thay dầu",
    image: "/images/goi-toan-dien.png",
    color: "#027C9D",
    hover: "#02617A",
  },
];

const vehicles = ["Feliz", "Klara", "Vento", "Theon", "Evo"];

const serviceData = {
  basic: vehicles.map((v) => ({
    vehicle: v,
    code: `BD01-${v[0]}`,
    price: "250.000 - 400.000 VNĐ",
    time: "30 - 40 phút",
    tasks: "Pin & sạc, Lốp & vành, Phanh, Dàn & còi, Vệ sinh xe.",
    image: `/images/${v.toLowerCase()}.jpg`,
  })),
  standard: vehicles.map((v) => ({
    vehicle: v,
    code: `BD02-${v[0]}`,
    price: "600.000 - 850.000 VNĐ",
    time: "65 - 85 phút",
    tasks: "Gói cơ bản + Động cơ, Dây điện, Treo, Khung & thân xe.",
    image: `/images/${v.toLowerCase()}.jpg`,
  })),
  full: vehicles.map((v) => ({
    vehicle: v,
    code: `BD03-${v[0]}`,
    price: "1.000.000 - 1.500.000 VNĐ",
    time: "130 - 150 phút",
    tasks:
      "Gói tiêu chuẩn + Cập nhật phần mềm, Thay dầu phanh/giảm xóc, Kiểm tra hệ thống điện sâu.",
    image: `/images/${v.toLowerCase()}.jpg`,
  })),
};

const Service = () => {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredVehicles = selectedPackage
    ? serviceData[selectedPackage].filter((v) =>
        v.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const openModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  return (
    <div className="px-6 lg:px-20 py-12 bg-gray-50">
      {/* Tiêu đề */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#027C9D]">
          Dịch vụ sửa chữa xe điện
        </h1>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          Chọn gói dịch vụ phù hợp, sau đó chọn dòng xe để xem chi tiết và đặt
          lịch.
        </p>
      </div>

      {/* Gói dịch vụ */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition ${
              selectedPackage === pkg.id ? "ring-2 ring-[#027C9D]" : ""
            }`}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            {/* Ảnh gói dịch vụ */}
            <div className="flex justify-center mb-4">
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-20 h-20 object-cover rounded-md"
              />
            </div>

            {/* Tên gói dịch vụ */}
            <h3 className="text-xl font-semibold text-[#027C9D] flex items-center justify-center mb-2">
              {pkg.icon}
              <span className="ml-2">{pkg.name}</span>
            </h3>

            {/* Mô tả gói */}
            <p className="text-gray-700 text-sm text-center">
              {pkg.description}
            </p>
          </div>
        ))}
      </div>

      {/* Tìm kiếm xe */}
      {selectedPackage && (
        <div className="mb-6 max-w-md mx-auto flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Tìm xe theo tên..."
            className="w-full outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Danh sách xe */}
      {selectedPackage && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.code}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition flex flex-col justify-between"
            >
              <img
                src={vehicle.image}
                alt={vehicle.vehicle}
                className="w-full h-32 object-cover rounded-md mb-4"
              />
              <h4 className="text-lg font-semibold text-gray-800 mb-1">
                {vehicle.vehicle}
              </h4>
              <p className="text-sm text-gray-600 mb-1">
                Mã gói: {vehicle.code}
              </p>
              <p className="text-sm text-gray-600 mb-1">Giá: {vehicle.price}</p>
              <p className="text-sm text-gray-600 mb-1">
                Thời gian: {vehicle.time}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Công việc: {vehicle.tasks}
              </p>
              <button
                className="text-white px-4 py-2 rounded-lg w-full"
                style={{ backgroundColor: "#027C9D" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#02617A")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#027C9D")
                }
                onClick={() => openModal(vehicle)}
              >
                Đặt lịch
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal đặt lịch */}
      {selectedVehicle && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={closeModal}
          defaultService={selectedVehicle.vehicle}
          defaultPackage={selectedVehicle.code}
        />
      )}
    </div>
  );
};

export default Service;
