import React from "react";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";

function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen bg-gray-50">
        {/* Banner */}
        <div className="relative">
          <img
            src="/images/Lien_he.png"
            alt="Banner"
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#6BBFD4]/40 to-[#027C9D]/60 flex flex-col justify-center items-center text-white text-center px-4">
            <h1 className="text-5xl font-bold mb-2">Liên hệ với EV Service</h1>
            <p className="text-lg max-w-xl text-white/80">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông
              tin để được tư vấn nhanh chóng.
            </p>
          </div>
        </div>

        {/* Form */}
        <section className="-mt-20 relative z-10 px-6 lg:px-20">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl border border-[#6BBFD4]/30">
            <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
              VUI LÒNG ĐỂ LẠI THÔNG TIN
            </h2>
            <form className="space-y-6">
              <input
                type="text"
                placeholder="Tên của bạn"
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <select
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="" disabled selected>
                  Chọn chủ đề
                </option>
                <option>Hỗ trợ kỹ thuật</option>
                <option>Tư vấn dịch vụ</option>
                <option>Góp ý & phản hồi</option>
              </select>

              <textarea
                rows={5}
                placeholder="Nội dung"
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-[#027C9D] text-white py-3 rounded-lg font-semibold hover:bg-[#026a85] transition"
              >
                Gửi liên hệ
              </button>
            </form>
          </div>
        </section>

        {/* Thông tin liên hệ */}
        <section className="py-20 px-6 lg:px-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">
              Thông tin liên hệ
            </h2>
            <p className="text-gray-600 mt-2">
              Bạn cũng có thể liên hệ trực tiếp qua các kênh dưới đây
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Bản đồ rộng hơn */}
            <div className="lg:pr-4">
              <iframe
                title="EV Service Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.133123456789!2d106.700000!3d10.776000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3f3f3f3f3f%3A0x123456789abcdef!2sBitexco%20Financial%20Tower!5e0!3m2!1sen!2s!4v1600000000000"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="rounded-xl shadow-lg"
              ></iframe>
            </div>

            {/* Thông tin liên hệ  */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-sm">
              {/* Địa chỉ */}
              <div className="flex items-start gap-3">
                <FiMapPin className="text-[#027C9D] mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Địa chỉ</h3>
                  <p>123 Tòa Nhà Bitexco, Quận 1, TP.HCM</p>
                </div>
              </div>

              {/* Điện thoại */}
              <div className="flex items-start gap-3">
                <FiPhone className="text-[#027C9D] mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Điện thoại</h3>
                  <p>(084) 123-456-789</p>
                  <p>(084) 987-654-321</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <FiMail className="text-[#027C9D] mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p>support@evservice.com</p>
                </div>
              </div>

              {/* Giờ làm việc */}
              <div className="flex items-start gap-3">
                <FiClock className="text-[#027C9D] mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Giờ làm việc</h3>
                  <p>Thứ 2 - Thứ 7: 09:00 - 20:00</p>
                  <p>Chủ nhật: 09:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact;
