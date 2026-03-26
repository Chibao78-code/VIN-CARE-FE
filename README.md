# 🚗 VIN-CARE — Hệ thống Quản lý Dịch vụ Bảo dưỡng Xe

<div align="center">

![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.0-orange?style=for-the-badge)

**VIN-CARE** là ứng dụng web quản lý dịch vụ bảo dưỡng & sửa chữa xe ô tô, hỗ trợ đa vai trò: Khách hàng, Nhân viên tiếp nhận, Kỹ thuật viên và Quản trị viên.

</div>

---

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
- [Biến môi trường](#-biến-môi-trường)
- [Phân quyền & Vai trò](#-phân-quyền--vai-trò)
- [API Services](#-api-services)
- [Đóng góp](#-đóng-góp)

---

## 🌟 Tổng quan

VIN-CARE là hệ thống quản lý dịch vụ bảo dưỡng xe toàn diện, cho phép khách hàng đặt lịch hẹn trực tuyến, theo dõi tiến trình sửa chữa, quản lý phương tiện cá nhân và thanh toán qua VNPay. Hệ thống cũng cung cấp giao diện riêng biệt cho nhân viên tiếp nhận, kỹ thuật viên và quản trị viên để vận hành trung tâm dịch vụ hiệu quả.

---

## ✨ Tính năng

### 👤 Khách hàng (Customer)
| Tính năng | Mô tả |
|-----------|-------|
| 🏠 Landing Page | Trang giới thiệu dịch vụ |
| 📊 Dashboard | Tổng quan trạng thái lịch hẹn & phương tiện |
| 📅 Đặt lịch hẹn | Đặt lịch bảo dưỡng/sửa chữa trực tuyến |
| 🚘 Quản lý xe | Thêm, sửa, xóa phương tiện cá nhân |
| 📜 Lịch sử bảo dưỡng | Xem toàn bộ lịch sử sửa chữa theo xe |
| 🔍 Kiểm tra xe | Xem & phê duyệt kết quả kiểm tra từ kỹ thuật viên |
| 💳 Thanh toán VNPay | Thanh toán trực tuyến qua cổng VNPay |
| 👤 Hồ sơ cá nhân | Cập nhật thông tin cá nhân & cài đặt |
| 🔐 Xác thực OTP | Quên mật khẩu & đặt lại qua OTP |

### 👨‍💼 Nhân viên tiếp nhận (Staff)
| Tính năng | Mô tả |
|-----------|-------|
| 📊 Dashboard | Tổng quan công việc hàng ngày |
| 👥 Quản lý khách hàng | Tra cứu & quản lý thông tin khách hàng |
| 📋 Quản lý lịch hẹn | Xem, tạo & xử lý lịch hẹn |
| 🚗 Tiếp nhận xe | Quy trình tiếp nhận xe vào xưởng |
| 📡 Theo dõi tiếp nhận | Theo dõi trạng thái tiếp nhận xe realtime |
| 🔧 Phụ tùng | Quản lý phụ tùng thay thế |
| 💰 Thanh toán | Xử lý thanh toán & tạo hóa đơn |
| 🔎 Tìm kiếm Booking | Tra cứu nhanh booking theo mã |

### 🔧 Kỹ thuật viên (Technician)
| Tính năng | Mô tả |
|-----------|-------|
| 📊 Dashboard | Tổng quan công việc được phân công |
| 📝 Lệnh sửa chữa | Danh sách & chi tiết lệnh sửa chữa |
| 🔍 Kiểm tra xe | Thực hiện kiểm tra tổng quát xe |
| ✅ Checklist kiểm tra | Checklist kiểm tra chi tiết từng hạng mục |
| 📄 Chi tiết công việc | Xem chi tiết đầy đủ của từng phiếu tiếp nhận |
| 📚 Lịch sử công việc | Xem lại toàn bộ công việc đã hoàn thành |

### 🛡️ Quản trị viên (Admin)
| Tính năng | Mô tả |
|-----------|-------|
| 📊 Dashboard | Tổng quan hệ thống & KPIs |
| 📈 Phân tích & Báo cáo | Biểu đồ thống kê doanh thu, lịch hẹn |
| 📊 Phân tích nâng cao | Báo cáo chi tiết với nhiều chiều dữ liệu |
| 👥 Quản lý người dùng | Quản lý tài khoản nhân viên & khách hàng |
| 🔩 Quản lý phụ tùng | Quản lý kho phụ tùng toàn hệ thống |

---

## 🛠 Công nghệ sử dụng

### Frontend Core
| Công nghệ | Phiên bản | Mục đích |
|------------|-----------|----------|
| **React** | 19.1 | UI Library |
| **Vite** | 7.1 | Build tool & Dev server |
| **React Router DOM** | 7.9 | Routing & Navigation |
| **TailwindCSS** | 3.4 | Utility-first CSS Framework |

### State Management & Data
| Công nghệ | Phiên bản | Mục đích |
|------------|-----------|----------|
| **Zustand** | 5.0 | Global state management (Auth, App) |
| **Axios** | 1.12 | HTTP Client cho API calls |
| **React Hook Form** | 7.63 | Quản lý form & validation |

### UI & Visualization
| Công nghệ | Phiên bản | Mục đích |
|------------|-----------|----------|
| **Recharts** | 3.4 | Biểu đồ thống kê & analytics |
| **Lucide React** | 0.553 | Icon library |
| **React Icons** | 5.5 | Icon library bổ sung |
| **React Hot Toast** | 2.6 | Thông báo toast |
| **Canvas Confetti** | 1.9 | Hiệu ứng chúc mừng |

### Utilities
| Công nghệ | Mục đích |
|------------|----------|
| **date-fns** | Xử lý ngày tháng |
| **clsx** / **tailwind-merge** | Quản lý className |

---

## 📁 Cấu trúc dự án

```
VIN-CARE-FE/
├── public/                     # Tài nguyên tĩnh
├── src/
│   ├── components/             # Components tái sử dụng
│   │   ├── BookingModal.jsx    # Modal đặt lịch
│   │   ├── booking/            # Components liên quan booking
│   │   ├── layout/             # Header, Sidebar, Footer...
│   │   ├── reception/          # Components tiếp nhận xe
│   │   ├── technician/         # Components kỹ thuật viên
│   │   ├── ui/                 # UI components cơ bản (Button, Input...)
│   │   └── imgLangding/        # Hình ảnh landing page
│   │
│   ├── pages/                  # Trang theo vai trò
│   │   ├── Landing.jsx         # Trang chủ
│   │   ├── Login.jsx           # Đăng nhập
│   │   ├── Dashboard.jsx       # Dashboard khách hàng
│   │   ├── MyBookings.jsx      # Lịch hẹn của tôi
│   │   ├── MyVehicles.jsx      # Xe của tôi
│   │   ├── MaintenanceHistory.jsx  # Lịch sử bảo dưỡng
│   │   ├── VNPayReturn.jsx     # Callback thanh toán VNPay
│   │   ├── admin/              # 📁 Trang quản trị viên
│   │   ├── staff/              # 📁 Trang nhân viên tiếp nhận
│   │   └── technician/         # 📁 Trang kỹ thuật viên
│   │
│   ├── layouts/                # Layout theo vai trò
│   │   ├── MainLayout.jsx      # Layout khách hàng
│   │   ├── PublicLayout.jsx    # Layout trang công khai
│   │   ├── AdminLayout.jsx     # Layout admin
│   │   ├── StaffLayout.jsx     # Layout nhân viên
│   │   └── TechnicianLayout.jsx # Layout kỹ thuật viên
│   │
│   ├── services/               # API service layer
│   │   ├── api.js              # Axios instance & interceptors
│   │   ├── authService.js      # Xác thực (login, register, OTP)
│   │   ├── bookingService.js   # Quản lý lịch hẹn
│   │   ├── vehicleService.js   # Quản lý phương tiện
│   │   ├── paymentService.js   # Xử lý thanh toán
│   │   ├── vnpayService.js     # Tích hợp VNPay
│   │   ├── inspectionService.js # Kiểm tra xe
│   │   ├── receptionService.js # Tiếp nhận xe
│   │   ├── technicianService.js # API kỹ thuật viên
│   │   ├── adminService.js     # API quản trị
│   │   ├── customerService.js  # API khách hàng
│   │   ├── sparePartService.js # API phụ tùng
│   │   ├── userService.js      # API người dùng
│   │   ├── serviceCenterService.js # API trung tâm dịch vụ
│   │   └── maintenancePackageService.js # API gói bảo dưỡng
│   │
│   ├── store/                  # Zustand stores
│   │   ├── authStore.js        # Trạng thái xác thực
│   │   └── appStore.js         # Trạng thái ứng dụng
│   │
│   ├── constants/              # Hằng số & cấu hình
│   │   ├── config.js           # API URL, Storage keys, Pagination
│   │   └── routes.js           # Định nghĩa routes
│   │
│   ├── data/                   # Dữ liệu tĩnh
│   │   └── serviceCenters.js   # Danh sách trung tâm dịch vụ
│   │
│   ├── utils/                  # Hàm tiện ích
│   │   ├── cn.js               # className merger
│   │   ├── format.js           # Format tiền, ngày, số điện thoại
│   │   └── statusUtils.js      # Xử lý trạng thái booking
│   │
│   ├── App.jsx                 # Root component & Routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
│
├── index.html                  # HTML template
├── vite.config.js              # Cấu hình Vite
├── tailwind.config.js          # Cấu hình TailwindCSS
├── postcss.config.js           # Cấu hình PostCSS
├── eslint.config.js            # Cấu hình ESLint
├── package.json                # Dependencies & Scripts
└── README.md                   # Tài liệu dự án
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu hệ thống

- **Node.js** >= 18.x
- **npm** >= 9.x (hoặc **yarn** / **pnpm**)

### Cài đặt

```bash
# 1. Clone repository
git clone https://github.com/<your-username>/VIN-CARE-FE.git
cd VIN-CARE-FE

# 2. Cài đặt dependencies
npm install

# 3. Tạo file biến môi trường
cp .env.example .env
# (hoặc tạo file .env thủ công, xem mục Biến môi trường)

# 4. Chạy development server
npm run dev
```

Ứng dụng sẽ chạy tại **http://localhost:3000**

### Các lệnh có sẵn

| Lệnh | Mô tả |
|-------|-------|
| `npm run dev` | Chạy development server (port 3000) |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |
| `npm run lint` | Kiểm tra code với ESLint |

---

## 🔑 Biến môi trường

Tạo file `.env` ở thư mục gốc với các biến sau:

```env
# API Backend URL
VITE_API_BASE_URL=http://localhost:8080/api
```

> **Lưu ý:** Nếu không cấu hình `VITE_API_BASE_URL`, ứng dụng sẽ mặc định kết nối tới `http://localhost:8080/api`.

---

## 🔐 Phân quyền & Vai trò

Hệ thống sử dụng **role-based access control (RBAC)** với 4 vai trò chính:

```
┌──────────────────────────────────────────────────────┐
│                    VIN-CARE RBAC                     │
├──────────────┬───────────────────────────────────────┤
│   Vai trò    │           Đường dẫn                   │
├──────────────┼───────────────────────────────────────┤
│ Khách hàng   │ /app/*      (Dashboard, Booking...)   │
│ Admin        │ /admin/*    (Thống kê, Quản lý...)    │
│ Staff        │ /staff/*    (Tiếp nhận, Thanh toán...)│
│ Technician   │ /technician/* (Sửa chữa, Kiểm tra...)│
└──────────────┴───────────────────────────────────────┘
```

- **Public routes:** `/`, `/login`, `/forgot-password`, `/verify-otp`, `/reset-password/:token`, `/contact`
- **Protected routes:** Yêu cầu đăng nhập, được bảo vệ bởi `ProtectedRoute` component
- Hệ thống sử dụng **Zustand persist** để duy trì trạng thái xác thực sau khi reload trang

---

## 📡 API Services

Tầng service sử dụng **Axios** với interceptor tự động gắn token xác thực:

| Service | Mô tả |
|---------|-------|
| `authService` | Đăng nhập, đăng ký, quên/đặt lại mật khẩu, OTP |
| `bookingService` | CRUD lịch hẹn, cập nhật trạng thái |
| `vehicleService` | CRUD phương tiện khách hàng |
| `paymentService` | Tạo & xử lý thanh toán |
| `vnpayService` | Tích hợp cổng thanh toán VNPay |
| `inspectionService` | Kiểm tra tình trạng xe |
| `receptionService` | Tiếp nhận & theo dõi xe vào xưởng |
| `technicianService` | API cho kỹ thuật viên |
| `adminService` | API quản trị hệ thống |
| `userService` | Quản lý thông tin người dùng |
| `sparePartService` | Quản lý phụ tùng |
| `customerService` | API khách hàng |
| `serviceCenterService` | Quản lý trung tâm dịch vụ |
| `maintenancePackageService` | Gói bảo dưỡng |

---

## 🤝 Đóng góp

1. **Fork** repository
2. Tạo **feature branch**: `git checkout -b feature/ten-tinh-nang`
3. **Commit** thay đổi: `git commit -m "feat: thêm tính năng mới"`
4. **Push** lên branch: `git push origin feature/ten-tinh-nang`
5. Tạo **Pull Request**

### Quy ước Commit Message

```
feat:     Tính năng mới
fix:      Sửa lỗi
docs:     Cập nhật tài liệu
style:    Thay đổi style (không ảnh hưởng logic)
refactor: Tái cấu trúc code
test:     Thêm/sửa test
chore:    Cập nhật build, config...
```

---

## 📄 License

Dự án này được phát triển cho mục đích học tập và nghiên cứu.

---

<div align="center">

**Được phát triển với ❤️ bởi VIN-CARE Team**

</div>
