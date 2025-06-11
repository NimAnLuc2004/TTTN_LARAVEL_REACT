import React from "react";

const PaymentGuide = () => {
  return (
    <div className="container mx-auto p-5 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-orange-500">
          Hướng dẫn thanh toán
        </h1>

        {/* Video hướng dẫn thanh toán */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">
            Video hướng dẫn thanh toán
          </h2>
          <div
            className="relative"
            style={{ paddingBottom: "56.25%", height: 0, overflow: "hidden" }}
          >
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/JlFBOiHZGeU?cc_lang_pref=vi&cc_load_policy=1"
              title="Hướng dẫn thanh toán qua VNPay và PayPal"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-gray-700 mt-3">
            Lưu ý: Video trên là ví dụ. Vui lòng liên hệ đội ngũ hỗ trợ để nhận
            video hướng dẫn chính thức.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">
            1. Thanh toán qua VNPay
          </h2>
          <p className="text-gray-700 mb-3">
            VNPay là phương thức thanh toán phổ biến tại Việt Nam, cho phép bạn
            thanh toán nhanh chóng qua mã QR, thẻ ngân hàng hoặc ứng dụng VNPay.
          </p>
          <h3 className="text-lg font-medium mb-2 text-gray-800">
            Các bước thực hiện:
          </h3>
          <ul className="list-decimal pl-5 text-gray-700 mb-3">
            <li>Chọn sản phẩm và tiến hành thanh toán trên website Shop.</li>
            <li>Tại trang thanh toán, chọn phương thức "VNPay".</li>
            <li>
              Quét mã QR bằng ứng dụng VNPay hoặc ứng dụng ngân hàng hỗ trợ
              VNPay (VPBank, Vietcombank, Techcombank...).
            </li>
            <li>Xác nhận giao dịch trên ứng dụng bằng mật khẩu hoặc OTP.</li>
            <li>
              Sau khi thanh toán thành công, bạn sẽ nhận được xác nhận đơn hàng
              từ Shop.
            </li>
          </ul>
          <p className="text-gray-700">
            <strong>Lưu ý:</strong> Đảm bảo bạn đã cài đặt ứng dụng VNPay hoặc
            ứng dụng ngân hàng hỗ trợ VNPay trước khi thanh toán.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">
            2. Thanh toán qua PayPal
          </h2>
          <p className="text-gray-700 mb-3">
            PayPal là phương thức thanh toán quốc tế an toàn, phù hợp cho khách
            hàng muốn sử dụng thẻ quốc tế hoặc tài khoản PayPal.
          </p>
          <h3 className="text-lg font-medium mb-2 text-gray-800">
            Các bước thực hiện:
          </h3>
          <ul className="list-decimal pl-5 text-gray-700 mb-3">
            <li>Chọn sản phẩm và tiến hành thanh toán trên website Shop.</li>
            <li>Tại trang thanh toán, chọn phương thức "PayPal".</li>
            <li>
              Bạn sẽ được chuyển hướng đến trang đăng nhập PayPal. Đăng nhập
              bằng tài khoản PayPal của bạn.
            </li>
            <li>
              Xác nhận số tiền thanh toán và chọn nguồn thanh toán (thẻ hoặc số
              dư PayPal).
            </li>
            <li>
              Hoàn tất thanh toán và chờ xác nhận đơn hàng từ Shop trong vòng
              vài phút.
            </li>
          </ul>
          <p className="text-gray-700">
            <strong>Lưu ý:</strong> Đảm bảo tài khoản PayPal của bạn có đủ số dư
            hoặc đã liên kết với thẻ tín dụng/thẻ ghi nợ hợp lệ.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">
            3. Lợi ích của thanh toán qua VNPay và PayPal
          </h2>
          <p className="text-gray-700 mb-3">
            Cả hai phương thức thanh toán đều mang lại trải nghiệm tiện lợi và
            an toàn:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>
              <strong>An toàn:</strong> Giao dịch được mã hóa và bảo mật cao.
            </li>
            <li>
              <strong>Nhanh chóng:</strong> Thanh toán chỉ mất vài giây.
            </li>
            <li>
              <strong>Tiện lợi:</strong> Hỗ trợ nhiều ngân hàng (VNPay) và giao
              dịch quốc tế (PayPal).
            </li>
            <li>
              <strong>Minh bạch:</strong> Nhận biên nhận giao dịch ngay sau khi
              thanh toán.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">
            4. Các câu hỏi thường gặp
          </h2>
          <p className="text-gray-700 mb-3">
            Dưới đây là một số câu hỏi phổ biến về thanh toán qua VNPay và
            PayPal:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>
              <strong>Tôi có mất phí khi thanh toán qua VNPay/PayPal?</strong>{" "}
              Shop không thu thêm phí thanh toán. Tuy nhiên, PayPal có thể áp
              dụng phí chuyển đổi ngoại tệ nếu áp dụng.
            </li>
            <li>
              <strong>Thanh toán không thành công, tôi phải làm gì?</strong>{" "}
              Kiểm tra số dư tài khoản/thẻ, kết nối internet, hoặc liên hệ hỗ
              trợ qua hotline 1900-1234.
            </li>
            <li>
              <strong>Tôi có thể hoàn tiền nếu hủy đơn hàng?</strong> Có, hoàn
              tiền sẽ được xử lý trong 3-7 ngày làm việc tùy thuộc vào phương
              thức thanh toán.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">
            5. Tài khoản test cho thanh toán
          </h2>
          <p className="text-gray-700 mb-3">
            Vì đây là website thử nghiệm, bạn có thể sử dụng các tài khoản test
            sau để kiểm tra thanh toán qua VNPay và PayPal:
          </p>
          <h3 className="text-lg font-medium mb-2 text-gray-800">
            Tài khoản test VNPay:
          </h3>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>
              <strong>Ngân hàng:</strong> NCB
            </li>
            <li>
              <strong>Số thẻ:</strong> 9704198526191432198
            </li>
            <li>
              <strong>Tên chủ thẻ:</strong> NGUYEN VAN A
            </li>
            <li>
              <strong>Ngày phát hành:</strong> 07/15
            </li>
            <li>
              <strong>Mật khẩu OTP:</strong> 123456
            </li>
          </ul>
          <h3 className="text-lg font-medium mb-2 text-gray-800">
            Tài khoản test PayPal:
          </h3>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>
              <strong>Tài Khoản:</strong> test16112004@gmail.com
            </li>
            <li>
              <strong>Mật khẩu:</strong> 123456789
            </li>
            <li>
              <strong>Lưu ý:</strong> Sử dụng môi trường sandbox của PayPal để
              thử nghiệm.
            </li>
          </ul>
          <p className="text-gray-700">
            <strong>Lưu ý:</strong> Các tài khoản trên chỉ sử dụng trong môi
            trường thử nghiệm. Không sử dụng cho các giao dịch thực tế.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-orange-500">
            6. Liên hệ hỗ trợ
          </h2>
          <p className="text-gray-700 mb-3">
            Nếu bạn gặp khó khăn khi thanh toán, vui lòng liên hệ đội ngũ hỗ trợ
            của chúng tôi:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Hotline: 1900-1234 (8:00 - 21:00, tất cả các ngày).</li>
            <li>Email: support@shop.com (phản hồi trong 24 giờ).</li>
            <li>Chat trực tiếp trên website (phản hồi trong 5 phút).</li>
            <li>Địa chỉ: 123 Đường Shopee, Quận 1, TP.HCM.</li>
          </ul>
          <p className="text-gray-700">
            Shop cam kết hỗ trợ bạn để đảm bảo quá trình thanh toán diễn ra suôn
            sẻ!
          </p>
        </section>
      </div>
    </div>
  );
};

export default PaymentGuide;
