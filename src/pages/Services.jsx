import React, { useState } from "react";
import MultiStepBooking from "../components/booking/MultiStepBooking";

const ServiceCard = ({ icon, title, desc, button, onButtonClick }) => (
  <div className="flex-1 min-w-[250px] bg-white m-3 rounded-xl shadow-lg flex flex-col items-center px-5 py-8">
    <div className="text-[2.7rem] mb-3">{icon}</div>
    <h3 className="text-[#265085] m-0 font-semibold text-lg text-center">
      {title}
    </h3>
    <p className="text-[#60788a] text-base my-2 text-center indent-6">{desc}</p>
    <button
      className="bg-[#027C9D] text-white rounded-md px-5 py-2 font-bold mt-3 hover:bg-[#176e86] transition"
      onClick={onButtonClick}
    >
      {button}
    </button>
  </div>
);

const Services = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const openBookingModal = () => setIsBookingOpen(true);
  const closeBookingModal = () => setIsBookingOpen(false);

  return (
    <div className="font-sans bg-[#f6fbff] text-[#1b2736] min-h-screen pb-12">
      <header className="text-center py-12">
        <h1 className="m-0 text-[#0a213d] text-2xl md:text-3xl font-bold animate-pulse">
          Dịch vụ bảo dưỡng toàn diện tại EV Service Center
        </h1>
        <p className="text-base md:text-lg text-[#6480a3]">
          Xe điện muốn vận hành bền bỉ, tiết kiệm và an toàn thì bảo dưỡng định
          kỳ là yếu tố không thể thiếu. Tại EV Service Center, chúng tôi mang
          đến quy trình kiểm tra – chăm sóc toàn diện cho từng bộ phận, giúp xe
          của bạn luôn trong trạng thái tốt nhất.
        </p>
      </header>
      <section className="flex justify-center flex-wrap gap-6 my-10 ">
        <ServiceCard
          icon="🛠️"
          title="Bảo dưỡng định kỳ"
          desc="Bảo dưỡng toàn diện xe máy điện theo tiêu chuẩn VinFast. Đảm bảo xe luôn vận hành ổn định."
          button="Đặt lịch ngay"
          onButtonClick={openBookingModal}
          className="animate-pulse"
        />
        <ServiceCard
          icon="📦"
          title="Thay thế phụ tùng"
          desc="Thay thế phụ tùng chính hãng VinFast, bảo đảm an toàn và hiệu suất. Linh kiện được kiểm định chất lượng."
          button="Đặt lịch ngay"
          onButtonClick={openBookingModal}
        />
        <ServiceCard
          icon="⚙️"
          title="Sửa chữa"
          desc="Sửa chữa các vấn đề kỹ thuật – kiểm tra, xử lý lỗi nhanh chóng, chính xác, minh bạch giá dịch vụ."
          button="Đặt lịch ngay"
          onButtonClick={openBookingModal}
        />
      </section>
      <section>
        <div className="flex justify-center mb-6 animate-pulse">
          <img
            src="/images_service/Xedien.png"
            alt="Dịch vụ bảo dưỡng xe điện"
          />
        </div>
        <p className="mt-2 text-blue-500 text-base leading-relaxed indent-6">
          Xe điện muốn vận hành bền bỉ, tiết kiệm và an toàn thì bảo dưỡng định
          kỳ là yếu tố không thể thiếu. Tại EV Service Center, chúng tôi mang
          đến quy trình kiểm tra – chăm sóc toàn diện cho từng bộ phận, giúp xe
          của bạn luôn trong trạng thái tốt nhất.
        </p>
        <h3 className="text-[#265085] text-lg font-semibold mt-6">
          1. Kéo dài tuổi thọ pin & động cơ
        </h3>
        <p className="mt-2 text-[#253246] text-base leading-relaxed indent-6">
          Pin và động cơ là “trái tim” của xe điện – quyết định trực tiếp đến
          hiệu suất, quãng đường di chuyển và trải nghiệm lái. Trong quá trình
          sử dụng, pin thường xuyên phải đối mặt với nguy cơ bị chai do chu kỳ
          sạc/xả lặp lại, đặc biệt với những người di chuyển nhiều hoặc sử dụng
          xe trong điều kiện nhiệt độ khắc nghiệt. Điều này khiến pin sạc không
          còn đầy như ban đầu và quãng đường di chuyển của xe bị rút ngắn đáng
          kể. Động cơ điện, tương tự, nếu không được thường xuyên kiểm tra, vệ
          sinh và bôi trơn, có thể gây ra tiếng ồn bất thường hoặc giảm hiệu
          suất kéo, ảnh hưởng tới sự mượt mà và an toàn khi vận hành xe.
        </p>
        <img
          src="/images_service/Xedien3.png"
          alt="Bảo dưỡng pin & động cơ"
          className="block mx-auto my-4 w-[900px] h-400px] object-contain"
        />
        <p>
          Để duy trì hiệu quả hoạt động lâu dài, bảo dưỡng định kỳ là giải pháp
          tối ưu giúp phát hiện sớm, xử lý kịp thời các dấu hiệu suy giảm của
          pin và động cơ. Công việc bảo dưỡng không chỉ gồm việc kiểm tra trạng
          thái viên pin, làm sạch các đầu cực mà còn bao gồm kiểm soát hệ thống
          mạch sạc, các dây dẫn điện để phát hiện và xử lý kịp thời các điểm
          tiếp xúc kém hoặc dấu hiệu oxy hóa. Động cơ cũng được căn chỉnh, siết
          lại các chi tiết lắp ghép và bôi trơn những bộ phận chuyển động, đảm
          bảo xe luôn đạt công suất tối ưu. Nhờ vậy, tuổi thọ của cả pin lẫn
          động cơ được kéo dài tối đa, xe vận hành ổn định, bền bỉ và giữ được
          sức mạnh cũng như độ êm ái như lúc mới mua. Ngoài ra, bảo dưỡng định
          kỳ còn giúp ngăn ngừa các sự cố bất ngờ, mang lại sự an tâm tuyệt đối
          cho người sử dụng trên mọi cung đường.
        </p>
        <div className="flex flex-col md:flex-row items-center my-8">
          <div className="w-full md:w-1/2 order-2 md:order-1 px-4">
            <h3 className="text-[#265085] text-lg font-semibold mb-3">
              2. Bộ điều khiển – Bộ não của xe điện
            </h3>
            <p className="mt-2 text-[#253246] text-base leading-relaxed indent-6">
              Bộ điều khiển là “bộ não” của xe điện, điều phối dòng điện và tốc
              độ xe một cách chính xác. Nó nhận dữ liệu từ cảm biến về tốc độ,
              lực đạp và trạng thái xe, xử lý và điều chỉnh dòng điện qua các
              mạch điều khiển. Việc bảo dưỡng định kỳ giúp làm sạch linh kiện,
              kiểm tra các kết nối điện, tránh oxy hóa và lỏng lẻo, giúp xe tăng
              tốc mượt mà, tiết kiệm pin và vận hành an toàn. Bộ điều khiển còn
              hỗ trợ phanh tái tạo, bảo vệ quá tải cho pin và động cơ, cùng kết
              nối với các thiết bị IoT và màn hình xe, giúp người lái dễ dàng
              quản lý và vận hành.
            </p>
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-center">
            <img
              src="/images_service/Xedien4.png"
              alt="Bảo dưỡng bộ điều khiển"
              className="w-[320px] h-[200px] object-contain"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center my-8">
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="/images_service/Xedien5.png"
              alt="Bảo dưỡng phanh"
              className="w-[320px] h-[200px] object-contain"
            />
          </div>
          <div className="w-full md:w-1/2 px-4">
            <h3 className="text-[#265085] text-lg font-semibold mb-3">
              3. Hệ thống phanh
            </h3>
            <p className="mt-2 text-[#253246] text-base leading-relaxed indent-6">
              Hệ thống phanh là yếu tố then chốt đảm bảo an toàn tuyệt đối cho
              xe điện. Má phanh, dầu phanh và các cơ cấu phanh được kiểm tra,
              bảo dưỡng định kỳ nhằm duy trì hiệu quả phanh chính xác, giúp kiểm
              soát tốc độ xe linh hoạt và giảm thiểu nguy cơ tai nạn. Ngoài ra,
              hệ thống còn tích hợp công nghệ phanh tái sinh giúp thu hồi năng
              lượng khi giảm tốc, góp phần tăng tuổi thọ phanh và tiết kiệm năng
              lượng cho xe. Việc bảo dưỡng định kỳ không chỉ giữ cho hệ thống
              hoạt động ổn định mà còn đảm bảo an toàn tối đa khi vận hành trong
              mọi điều kiện giao thông.
            </p>
          </div>
        </div>
        <h3 className="text-[#265085] text-xl font-semibold mb-4">
          4. Hệ thống treo – Ổn định và êm ái trên mọi cung đường
        </h3>
        <p className="mt-2 text-[#253246] text-base leading-relaxed indent-6">
          Hệ thống treo giúp xe vận hành ổn định, êm ái trên nhiều loại địa hình
          khác nhau bằng cách hấp thụ các chấn động và rung lắc từ mặt đường.
          Các bộ phận như giảm xóc, lò xo và tay đòn cần được kiểm tra và bảo
          dưỡng định kỳ để duy trì hiệu suất tối ưu, đảm bảo sự an toàn và thoải
          mái cho người lái. Ngoài việc giảm xóc hiệu quả, hệ thống treo còn
          giúp phân phối lực tác động đồng đều lên các bánh xe, hạn chế tình
          trạng mòn lốp không đều và cải thiện khả năng kiểm soát khi phanh hay
          vào cua. Việc bảo dưỡng đúng cách sẽ góp phần kéo dài tuổi thọ của các
          linh kiện, đồng thời giảm thiểu các lỗi hỏng hóc phát sinh gây tốn kém
          chi phí sửa chữa.
        </p>
        <img src="/images_service/Xedien6.png" alt="Bảo dưỡng hệ thống treo" />
        <h3 className="text-[#265085] text-lg font-semibold mt-10">
          5. Khung sườn & Thân xe
        </h3>
        <p className="mt-2 text-[#253246] text-base leading-relaxed indent-6">
          Khung sườn và thân xe là bộ khung chịu lực chính, giữ sự ổn định và
          bền bỉ cho toàn bộ cấu trúc xe. Việc siết chặt bulong, ốc vít cùng
          kiểm tra và bảo dưỡng các mối hàn và chống gỉ thường xuyên là điều cần
          thiết để tránh các vấn đề về rung lắc hoặc hư hao nhanh chóng do thời
          tiết và va đập trong quá trình sử dụng.
        </p>
        <h3 className="text-[#265085] text-lg font-semibold mt-10">
          6. Dây điện & Giắc cắm
        </h3>
        <p className="mt-2 text-[#253246] text-base leading-relaxed indent-6">
          Hệ thống điện đóng vai trò quan trọng trong toàn bộ hoạt động của xe.
          Các dây điện và giắc cắm cần được kiểm tra kỹ lưỡng để bảo đảm kín
          khít, không bị oxy hóa hay bị đứt gãy do chuột cắn hay va đập. Bảo
          dưỡng định kỳ giúp duy trì sự ổn định và an toàn của hệ thống điện,
          tránh các nguy cơ chập cháy và hư hỏng không đáng có.
        </p>
        <div className="flex justify-center my-8">
          <img
            src="/images_service/Xedien7.png"
            alt="Bảo dưỡng dây điện & giắc cắm"
            className="max-w-[600px] w-full h-auto object-contain rounded-lg"
          />
        </div>
        <h3 className="text-[#265085] text-lg font-semibold mt-10">
          7. Khóa & Hệ thống điện tử
        </h3>
        <p className="mt-2 text-[#253246] text-base leading-relaxed indent-6">
          Các hệ thống khóa điện tử và remote Smart Key ngày càng trở nên phổ
          biến trên các dòng xe điện hiện đại, giúp nâng cao tính an toàn và
          tiện lợi cho người dùng. Khóa điện tử không chỉ bảo vệ chống mất trộm
          mà còn tích hợp nhiều công nghệ thông minh như mở khóa không cần chìa,
          điều khiển từ xa, và kết nối với ứng dụng trên điện thoại.{" "}
        </p>
        <p className="mt-2 text-[#253246] text-base leading-relaxed indent-6">
          Cấu tạo hệ thống khóa bao gồm bộ vi xử lý trung tâm (ECU), remote
          Smart Key, mạch điều khiển và các thiết bị thu-phát tín hiệu không
          dây. Khi người dùng sử dụng remote hoặc ứng dụng điện thoại để mở
          khóa, các tín hiệu được mã hóa và truyền tới bộ điều khiển trung tâm,
          đảm bảo chỉ những mã hợp lệ mới kích hoạt khóa mở.{" "}
        </p>
        <p className="mt-2 text-[#253246] text-base leading-relaxed indent-6">
          Việc bảo dưỡng định kỳ hệ thống khóa điện tử bao gồm kiểm tra, thay
          pin remote, làm sạch các tiếp điểm và cáp kết nối, kiểm tra tín hiệu
          truyền nhận, và cập nhật phần mềm điều khiển nếu có. Điều này giúp
          tránh các lỗi mất kết nối hay trục trặc do hư hại linh kiện, đồng thời
          đảm bảo khóa hoạt động linh hoạt và an toàn trong mọi điều kiện.{" "}
        </p>
        <p className="mt-2 text-[#253246] text-base leading-relaxed indent-6">
          Ngoài ra, các hệ thống khóa hiện đại còn trang bị thêm tính năng cảnh
          báo chống trộm, cảnh báo quên khóa xe, và các chế độ bảo vệ nâng cao
          giúp người dùng yên tâm hơn khi sử dụng xe điện. Việc bảo trì đúng
          cách sẽ giúp duy trì và kéo dài tuổi thọ của hệ thống, giảm thiểu chi
          phí sửa chữa và tăng hiệu suất vận hành.
        </p>
        <p className="mt-8 text-blue-500 text-base leading-relaxed indent-6">
          Với đội ngũ kỹ thuật viên chuyên nghiệp, giàu kinh nghiệm và trang
          thiết bị hiện đại, EV Service Center cam kết mang đến dịch vụ bảo
          dưỡng – sửa chữa uy tín, tận tâm và tối ưu chi phí nhất cho khách
          hàng. Trung tâm luôn áp dụng các quy trình bảo dưỡng chuẩn xác theo
          tiêu chuẩn nhà sản xuất cùng công nghệ tiên tiến nhất giúp phát hiện
          sớm các lỗi tiềm ẩn, từ đó xử lý kịp thời, giữ xe vận hành bền bỉ, ổn
          định và tiết kiệm năng lượng. Bên cạnh đó, dịch vụ còn bao gồm tư vấn
          chi tiết và hướng dẫn khách hàng cách sử dụng, bảo quản xe đúng cách
          để kéo dài tuổi thọ từng bộ phận, giảm thiểu chi phí phát sinh không
          cần thiết. Cam kết của EV Service Center là đảm bảo mỗi chuyến đi của
          bạn luôn an toàn, trọn vẹn và thoải mái, đồng thời mang lại trải
          nghiệm dịch vụ chuyên nghiệp và thân thiện nhất.
        </p>
      </section>
      <section className="max-w-3xl mx-auto bg-[#eaf5fc] p-10 rounded-xl shadow-sm mb-10">
        <h2 className="text-[#0a213d] text-xl font-bold text-center mt-0">
          Quy trình &amp; giá trị nổi bật
        </h2>
        <ul className="list-disc pl-6 text-base m-2 space-y-2">
          <li>
            Ứng dụng tiêu chuẩn bảo dưỡng hiện đại, kỹ thuật viên giàu kinh
            nghiệm.
          </li>
          <li>
            Kiểm tra và bảo dưỡng pin, động cơ, bộ điều khiển, phanh, hệ thống
            treo… bảo vệ mọi bộ phận quan trọng.
          </li>
          <li>Linh kiện, phụ tùng đảm bảo chính hãng – bảo hành lâu dài.</li>
          <li>
            Báo giá minh bạch, đặt lịch online, tiện bề theo dõi tiến trình bảo
            dưỡng.
          </li>
        </ul>
      </section>
      <MultiStepBooking isOpen={isBookingOpen} onClose={closeBookingModal} />
    </div>
  );
};

export default Services;
