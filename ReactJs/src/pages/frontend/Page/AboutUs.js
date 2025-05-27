import React from "react";

const AboutUs = () => {
  return (
    <div className="container mx-auto p-5 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-orange-500">
          Về chúng tôi
        </h1>
        {/* Video YouTube nhúng */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">
            Giới thiệu qua video
          </h2>
          <div
            className="relative"
            style={{ paddingBottom: "56.25%", height: 0, overflow: "hidden" }}
          >
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/-A-ZBxvtZ24"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">
            1. Chúng tôi là ai?
          </h2>
          <p className="text-gray-700 mb-3">
            Shop là nền tảng thương mại điện tử hàng đầu tại Việt Nam, được
            thành lập vào năm 2020. Với sứ mệnh mang đến trải nghiệm mua sắm
            trực tuyến tiện lợi và an toàn, chúng tôi đã phục vụ hàng triệu
            khách hàng trên toàn quốc. Shop cung cấp đa dạng sản phẩm từ thời
            trang, điện tử, gia dụng, đến mỹ phẩm và thực phẩm.
          </p>
          <p className="text-gray-700">
            Chúng tôi tự hào là đối tác của hàng nghìn nhà bán hàng uy tín, đảm
            bảo mang đến sản phẩm chính hãng với giá cả cạnh tranh nhất.
          </p>
        </section>


        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">
            2. Sứ mệnh của chúng tôi
          </h2>
          <p className="text-gray-700 mb-3">
            Sứ mệnh của Shop là kết nối người mua và người bán, tạo ra một cộng
            đồng mua sắm trực tuyến đáng tin cậy. Chúng tôi không ngừng cải tiến
            công nghệ và dịch vụ để:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Cung cấp trải nghiệm mua sắm nhanh chóng, tiện lợi.</li>
            <li>Đảm bảo chất lượng sản phẩm và dịch vụ khách hàng tốt nhất.</li>
            <li>
              Hỗ trợ các nhà bán hàng nhỏ lẻ phát triển kinh doanh trực tuyến.
            </li>
            <li>
              Đóng góp vào sự phát triển của thương mại điện tử tại Việt Nam.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">
            3. Giá trị cốt lõi
          </h2>
          <p className="text-gray-700 mb-3">
            Chúng tôi hoạt động dựa trên các giá trị cốt lõi sau:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>
              <strong>Chất lượng:</strong> Cam kết cung cấp sản phẩm chính hãng,
              chất lượng cao.
            </li>
            <li>
              <strong>Uy tín:</strong> Đảm bảo dịch vụ minh bạch, đáng tin cậy.
            </li>
            <li>
              <strong>Khách hàng là trung tâm:</strong> Luôn lắng nghe và hỗ trợ
              khách hàng 24/7.
            </li>
            <li>
              <strong>Đổi mới:</strong> Không ngừng cải tiến công nghệ và dịch
              vụ.
            </li>
            <li>
              <strong>Cộng đồng:</strong> Xây dựng một cộng đồng mua sắm tích
              cực và bền vững.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">
            4. Thành tựu của chúng tôi
          </h2>
          <p className="text-gray-700 mb-3">
            Sau hơn 5 năm hoạt động, Shop đã đạt được nhiều thành tựu đáng tự
            hào:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Phục vụ hơn 10 triệu khách hàng trên toàn quốc.</li>
            <li>Hợp tác với hơn 50.000 nhà bán hàng uy tín.</li>
            <li>
              Đạt giải thưởng "Nền tảng thương mại điện tử tốt nhất 2024" do
              Hiệp hội TMĐT Việt Nam bình chọn.
            </li>
            <li>
              Xử lý hơn 1 triệu đơn hàng mỗi tháng với tỷ lệ hài lòng 98%.
            </li>
            <li>Mở rộng dịch vụ ra 5 quốc gia trong khu vực Đông Nam Á.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">
            5. Đội ngũ của chúng tôi
          </h2>
          <p className="text-gray-700 mb-3">
            Shop được vận hành bởi đội ngũ hơn 1.000 nhân viên trên toàn quốc,
            bao gồm:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Đội ngũ công nghệ: Phát triển và duy trì nền tảng.</li>
            <li>
              Đội ngũ chăm sóc khách hàng: Hỗ trợ 24/7 qua hotline, email, và
              chat.
            </li>
            <li>Đội ngũ vận hành: Quản lý kho bãi và giao hàng.</li>
            <li>
              Đội ngũ marketing: Đưa các chương trình khuyến mãi hấp dẫn đến
              khách hàng.
            </li>
          </ul>
          <p className="text-gray-700">
            Chúng tôi luôn chào đón những tài năng mới gia nhập để cùng xây dựng
            một Shop ngày càng tốt hơn.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">
            6. Tầm nhìn tương lai
          </h2>
          <p className="text-gray-700 mb-3">
            Trong 5 năm tới, Shop đặt mục tiêu:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Trở thành nền tảng thương mại điện tử số 1 tại Đông Nam Á.</li>
            <li>Mở rộng dịch vụ ra 10 quốc gia trên thế giới.</li>
            <li>
              Phát triển các tính năng công nghệ mới như AI gợi ý sản phẩm,
              thanh toán không tiếp xúc.
            </li>
            <li>Hỗ trợ 100.000 nhà bán hàng nhỏ lẻ đạt doanh thu bền vững.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-orange-500">
            7. Liên hệ với chúng tôi
          </h2>
          <p className="text-gray-700 mb-3">
            Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ qua:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Hotline: 1900-1234 (8:00 - 21:00, tất cả các ngày).</li>
            <li>Email: support@shop.com (phản hồi trong 24 giờ).</li>
            <li>Chat trực tiếp trên website (phản hồi trong 5 phút).</li>
            <li>Địa chỉ: 123 Đường Shopee, Quận 1, TP.HCM.</li>
            <li>
              Mạng xã hội: Theo dõi chúng tôi trên Facebook, Instagram, và
              TikTok để cập nhật tin tức mới nhất.
            </li>
          </ul>
          <p className="text-gray-700">
            Shop luôn sẵn sàng đồng hành cùng bạn trong mọi hành trình mua sắm!
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
