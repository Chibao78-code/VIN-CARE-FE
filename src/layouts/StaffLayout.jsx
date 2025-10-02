import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  FiGrid, FiUsers, FiCalendar, FiMenu, FiX, 
  FiLogOut, FiBell, FiPlus
} from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';

const StaffLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/staff/dashboard', label: 'Dashboard', icon: FiGrid },
    { path: '/staff/customers', label: 'Customers', icon: FiUsers },
    { path: '/staff/appointments', label: 'Appointments', icon: FiCalendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`${
        isSidebarOpen ? 'w-64' : 'w-20'
      } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
              EV
            </div>
            {isSidebarOpen && (
              <div>
                <h2 className="font-bold text-gray-900">EV Service</h2>
                <p className="text-xs text-gray-500">Staff Portal</p>
              </div>
            )}
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="text-xl flex-shrink-0" />
                  {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
              {user?.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            {isSidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'DINH BAO'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'ddinhchibao@gmail.com'}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiLogOut className="text-xl" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {isSidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <FiBell className="text-xl text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Button
              variant="primary"
              icon={<FiPlus />}
              onClick={() => navigate('/staff/appointments/new')}
              className="bg-gradient-to-r from-green-500 to-teal-600"
            >
              New Appointment
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;