import { useState, useEffect } from "react";

// Mảng chứa đường dẫn ảnh
const images = [
  "/images/Technician_1.png",
  "/images/Technician.png",
  "/images/ky-thuat-xe-dien.png",
  "/images/Technician_2.png",
  "/images/gioi-thieu-ev.png",
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);

  // Chuyển về ảnh trước
  const prevSlide = () =>
    setCurrent((current - 1 + images.length) % images.length);

  // Chuyển sang ảnh tiếp theo
  const nextSlide = () =>
    setCurrent((current + 1) % images.length);

  // Tự động chuyển ảnh mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // 3000ms = 3 giây

    return () => clearInterval(interval); // Clear khi component unmount
  }, []);

  return (
    <div className="relative max-w-screen-xl mx-auto h-[400px] overflow-hidden shadow-xl rounded-xl">
      {/* Ảnh hiện tại */}
      <img
        src={images[current]}
        alt={`Kỹ thuật viên ${current + 1}`}
        className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
      />

      {/* Nút chuyển về ảnh trước */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full hover:bg-black/60 transition"
      >
        ‹
      </button>

      {/* Nút chuyển sang ảnh tiếp theo */}
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full hover:bg-black/60 transition"
      >
        ›
      </button>
    </div>
  );
}

