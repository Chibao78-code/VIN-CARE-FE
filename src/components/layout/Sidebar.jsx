import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiTruck,
  FiCalendar,
  FiUsers,
  FiBarChart2,
  FiPackage,
  FiX,
  
} from "react-icons/fi";
import useAppStore from "../../store/appStore";
import useAuthStore from "../../store/authStore";
import { cn } from "../../utils/cn";

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const { user } = useAuthStore();

  const navigation = [
    { name: "Tổng quan", href: "/app/dashboard", icon: FiHome },
    { name: "Xe của tôi", href: "/app/vehicles", icon: FiTruck },
    { name: "Dịch vụ", href: "/app/services", icon: FiPackage },
    { name: "Lịch hẹn", href: "/app/my-bookings", icon: FiCalendar },
    
  ];

  const adminNavigation = [
    { name: "Quản lý người dùng", href: "/app/admin/users", icon: FiUsers },
    { name: "Quản lý dịch vụ", href: "/app/admin/services", icon: FiPackage },
    { name: "Báo cáo", href: "/app/admin/reports", icon: FiBarChart2 },
  ];

  const isAdmin = user?.role === "admin";

  return (
    <>
      {/* mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "bg-[#F0FAFF] border-r border-gray-200"
        )}
      >
        <div className="h-full flex flex-col">
          {/* nút đóng sidebar trên mobile */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-[#015C7A] px-4 py-6 text-center">
            <p className="text-sm font-semibold text-white uppercase tracking-wide">
              Trang khách hàng
            </p>
          </div>

          {/* menu chính */}
          <nav className="flex-1 px-4 pb-4 space-y-6 overflow-y-auto">
            <div className="space-y-2">
              {/* Tiêu đề danh mục */}
              <div className="bg-[#F0FAFF] px-3 py-2 rounded-md">
                <h3 className="text-base font-semibold text-[#0094c6] uppercase tracking-wider text-center">
                  Danh mục
                </h3>
              </div>

              {/* Danh sách menu */}
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center px-3 py-2 text-[15px] font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-white text-[#027C9D] shadow"
                        : "text-gray-900 hover:text-[#027C9D] hover:bg-white"
                    )
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                      "group-hover:text-[#027C9D]"
                    )}
                  />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              ))}
            </div>

            {/* trang admin */}
            {isAdmin && (
              <div className="space-y-2">
                <div className="bg-[#F0FAFF] px-3 py-2 rounded-md">
                  <h3 className="text-base font-semibold text-gray-900 uppercase tracking-wider text-center">
                    Quản trị
                  </h3>
                </div>
                {adminNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center px-3 py-2 text-[15px] font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-white text-[#027C9D] shadow"
                          : "text-gray-900 hover:text-[#027C9D] hover:bg-white"
                      )
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                        "group-hover:text-[#027C9D]"
                      )}
                    />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
