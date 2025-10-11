import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiTruck,
  FiCalendar,
  FiMapPin,
  FiSettings,
  FiUsers,
  FiBarChart2,
  FiPackage,
  FiBattery,
  FiClipboard,
  FiX,  // Thêm icon đóng
} from 'react-icons/fi';
import useAppStore from '../../store/appStore';
import useAuthStore from '../../store/authStore';
import { cn } from '../../utils/cn';

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const { user } = useAuthStore();

  const navigation = [
    { name: 'Tổng quan', href: '/app/dashboard', icon: FiHome },
    { name: 'Xe của tôi', href: '/app/vehicles', icon: FiTruck },
    { name: 'Dịch vụ', href: '/app/services', icon: FiPackage },
    { name: 'Lịch hẹn', href: '/app/my-bookings', icon: FiCalendar },
    { name: 'Lịch sử bảo dưỡng', href:'/app/vehicle-history', icon: FiClipboard },
  ];

  const adminNavigation = [
    { name: 'Quản lý người dùng', href: '/app/admin/users', icon: FiUsers },
    { name: 'Quản lý dịch vụ', href: '/app/admin/services', icon: FiPackage },
    { name: 'Báo cáo', href: '/app/admin/reports', icon: FiBarChart2 },
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Close button (mobile) */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
            {/* Main menu */}
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Menu chính
              </h3>
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                      'group-hover:text-gray-900'
                    )}
                  />
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Admin menu */}
            {isAdmin && (
              <div className="mt-8 space-y-1">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Quản trị
                </h3>
                {adminNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      )
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                        'group-hover:text-gray-900'
                      )}
                    />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            )}
          </nav>

          {/* User Info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary-700 font-medium">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
