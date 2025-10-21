import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiCalendar,
  FiMenu,
  FiX,
  FiLogOut,
  FiBell,
  FiTruck,
  FiBox,
  FiCreditCard,
} from "react-icons/fi";
import useAuthStore from "../store/authStore";

const StaffLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "/staff/dashboard", label: "Tổng quan", icon: FiGrid },
    { path: "/staff/customers", label: "Khách hàng", icon: FiUsers },
    { path: "/staff/appointments", label: "Lịch hẹn", icon: FiCalendar },
    { path: "/staff/checkin", label: "Tiếp nhận xe", icon: FiTruck },
    { path: "/staff/parts", label: "Quản lý phụ tùng", icon: FiBox },
    { path: "/staff/payments", label: "Thanh toán", icon: FiCreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar bên trái */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src="/images/Logo_Staff.png"
              alt="EV Service Logo"
              className="w-10 h-10 object-contain rounded-lg shadow"
            />
            {isSidebarOpen && (
              <div>
                <h2 className="font-bold text-gray-900">EV Service</h2>
                <p className="text-xs text-gray-500">Staff Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu chức năng */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-green-50 text-green-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <item.icon className="text-xl flex-shrink-0" />
                  {isSidebarOpen && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col">
        {/* Thanh topbar */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between relative">
          {/* Nút sidebar */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {isSidebarOpen ? (
              <FiX className="text-xl" />
            ) : (
              <FiMenu className="text-xl" />
            )}
          </button>

          {/* Phần bên phải: Thông báo + Avatar + Menu */}
          <div className="flex items-center gap-4">
            {/* Thông báo */}
            <button
              onClick={() => navigate("/staff/staff-notifications")}


              className="relative p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiBell className="text-xl text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
              

            {/* Avatar */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white text-lg font-semibold shadow-md"
              >
                {user?.name?.charAt(0)?.toUpperCase() || "S"}
              </button>

              {/* Menu dropdown */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b">
                    <p className="font-medium text-gray-900">
                      {user?.name || "DINH BAO"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email || "ddinhchibao@gmail.com"}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-green-600 hover:text-white transition"
                  >
                    <FiLogOut className="text-lg" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Nội dung trang con */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;