import React, { useState, useEffect } from "react";

// Dữ liệu mẫu cho thông báo của nhân viên
const sampleStaffNotifications = [
  {
    id: 1,
    title: "Xe VinFast VF8 đã hoàn tất kiểm tra hệ thống điện",
    message: "Kỹ thuật viên đã xác nhận tình trạng hệ thống điện hoạt động bình thường.",
    time: "30 phút trước",
    status: "new",
  },
  {
    id: 2,
    title: "Khách hàng Trần Văn B đã hủy lịch bảo dưỡng",
    message: "Lịch bảo dưỡng ngày 22/10/2025 đã bị hủy. Vui lòng cập nhật lại lịch làm việc.",
    time: "2 giờ trước",
    status: "read",
  },
  {
    id: 3,
    title: "Yêu cầu kiểm tra hệ thống phanh xe VF9",
    message: "Khách hàng phản ánh tiếng ồn khi phanh. Cần kiểm tra gấp trong hôm nay.",
    time: "5 giờ trước",
    status: "important",
  },
];

// Màu sắc tương ứng với trạng thái thông báo
const statusStyles = {
  new: "bg-green-500",
  read: "bg-gray-300",
  important: "bg-yellow-500",
};

const StaffNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(sampleStaffNotifications);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Tiêu đề và nút đánh dấu đã đọc */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-800">
          Thông báo kỹ thuật viên
        </h1>

        {/* Nút HTML thay thế cho Button component */}
        <button
          onClick={() =>
            setNotifications((prev) =>
              prev.map((n) => ({ ...n, status: "read" }))
            )
          }
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      {/* Hiển thị danh sách thông báo hoặc thông báo trống */}
      {notifications.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">
          Không có thông báo nào dành cho bạn.
        </p>
      ) : (
        <div className="space-y-4">
          {notifications.map(({ id, title, message, time, status }) => (
            <div
              key={id}
              className={`p-5 rounded-lg border shadow-sm ${
                status === "important"
                  ? "border-yellow-500"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${statusStyles[status]}`}
                ></div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {title}
                </h2>
                <span className="ml-auto text-xs text-gray-500 italic">
                  {time}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffNotifications;