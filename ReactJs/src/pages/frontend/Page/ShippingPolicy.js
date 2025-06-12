import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="container mx-auto p-5 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-orange-500">Chính sách vận chuyển</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">1. Phạm vi áp dụng</h2>
          <p className="text-gray-700 mb-3">
            Chính sách vận chuyển được áp dụng cho tất cả các đơn hàng đặt mua trên nền tảng của Shop tại Việt Nam. Chúng tôi cam kết mang đến dịch vụ giao hàng nhanh chóng, an toàn và thuận tiện cho khách hàng trên toàn quốc. Hiện tại, chúng tôi hợp tác với các đơn vị vận chuyển uy tín như:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Giao Hàng Nhanh (GHN)</li>
            <li>Giao Hàng Tiết Kiệm (GHTK)</li>
            <li>Viettel Post</li>
            <li>J&T Express</li>
            <li>Shopee Express</li>
          </ul>
          <p className="text-gray-700">
            Ngoài ra, chúng tôi đang mở rộng dịch vụ giao hàng quốc tế cho một số quốc gia như Mỹ, Nhật Bản, và Singapore. Vui lòng liên hệ để biết thêm chi tiết.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">2. Thời gian giao hàng</h2>
          <p className="text-gray-700 mb-3">
            Thời gian giao hàng phụ thuộc vào khu vực nhận hàng và thời điểm đặt hàng. Dưới đây là thời gian giao hàng dự kiến:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Nội thành Hà Nội và TP.HCM: 1-2 ngày làm việc.</li>
            <li>Các tỉnh thành lân cận: 2-3 ngày làm việc.</li>
            <li>Các tỉnh thành xa hoặc vùng sâu vùng xa: 3-5 ngày làm việc.</li>
            <li>Đơn hàng đặt vào cuối tuần (thứ Bảy, Chủ Nhật) hoặc ngày lễ: Có thể chậm hơn 1-2 ngày.</li>
            <li>Đơn hàng quốc tế: 7-14 ngày làm việc (tùy quốc gia).</li>
          </ul>
          <p className="text-gray-700">
            Lưu ý: Thời gian giao hàng có thể thay đổi do các yếu tố khách quan như thời tiết, tình hình giao thông, hoặc chính sách kiểm soát dịch bệnh.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">3. Phí vận chuyển</h2>
          <p className="text-gray-700 mb-3">
            Phí vận chuyển được tính dựa trên nhiều yếu tố, bao gồm:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Khoảng cách từ kho hàng đến địa chỉ giao hàng.</li>
            <li>Khối lượng và kích thước của đơn hàng.</li>
            <li>Phương thức giao hàng (giao tiêu chuẩn, giao nhanh, giao quốc tế).</li>
          </ul>
          <p className="text-gray-700 mb-3">
            Bảng phí vận chuyển tham khảo:
          </p>
          <table className="w-full text-left border-collapse mb-3">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border border-gray-300">Khu vực</th>
                <th className="p-3 border border-gray-300">Phí vận chuyển (₫)</th>
                <th className="p-3 border border-gray-300">Miễn phí vận chuyển</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-gray-300">Nội thành Hà Nội/TP.HCM</td>
                <td className="p-3 border border-gray-300">20.000</td>
                <td className="p-3 border border-gray-300">Đơn hàng từ 500.000</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-300">Các tỉnh thành khác</td>
                <td className="p-3 border border-gray-300">30.000 - 50.000</td>
                <td className="p-3 border border-gray-300">Đơn hàng từ 1.000.000</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-300">Quốc tế</td>
                <td className="p-3 border border-gray-300">Tùy quốc gia</td>
                <td className="p-3 border border-gray-300">Không áp dụng</td>
              </tr>
            </tbody>
          </table>
          <p className="text-gray-700">
            Lưu ý: Phí vận chuyển có thể thay đổi trong các chương trình khuyến mãi hoặc sự kiện đặc biệt.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">4. Theo dõi đơn hàng</h2>
          <p className="text-gray-700 mb-3">
            Sau khi đơn hàng được giao cho đơn vị vận chuyển, bạn sẽ nhận được thông tin theo dõi qua:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Email thông báo với mã vận đơn.</li>
            <li>Tin nhắn SMS (nếu bạn cung cấp số điện thoại).</li>
            <li>Truy cập mục "Đơn hàng của tôi" trên trang web của chúng tôi để xem trạng thái.</li>
          </ul>
          <p className="text-gray-700">
            Bạn có thể sử dụng mã vận đơn để kiểm tra trạng thái giao hàng trên trang web của đơn vị vận chuyển (GHN, GHTK, v.v.) hoặc liên hệ trực tiếp với chúng tôi để được hỗ trợ.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">5. Các trường hợp đặc biệt</h2>
          <p className="text-gray-700 mb-3">
            Trong một số trường hợp, quá trình giao hàng có thể gặp trục trặc. Dưới đây là cách chúng tôi xử lý:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li><strong>Đơn hàng giao không thành công:</strong> Nếu không liên hệ được với bạn sau 3 lần giao hàng, đơn hàng sẽ được hoàn về kho. Bạn có thể yêu cầu giao lại (có thể chịu thêm phí).</li>
            <li><strong>Hàng hóa hư hỏng:</strong> Nếu sản phẩm bị hư hỏng trong quá trình vận chuyển, chúng tôi sẽ hoàn tiền hoặc gửi lại sản phẩm mới miễn phí.</li>
            <li><strong>Giao sai sản phẩm:</strong> Liên hệ ngay với chúng tôi để đổi sản phẩm đúng, miễn phí vận chuyển.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">6. Hỗ trợ giao hàng</h2>
          <p className="text-gray-700 mb-3">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn trong mọi vấn đề liên quan đến giao hàng. Bạn có thể liên hệ qua các kênh sau:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Hotline: 1900-1234 (8:00 - 21:00, tất cả các ngày trong tuần).</li>
            <li>Email: support@shop.com (phản hồi trong 24 giờ).</li>
            <li>Chat trực tiếp trên website (thời gian phản hồi trung bình: 5 phút).</li>
          </ul>
          <p className="text-gray-700">
            Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc và hỗ trợ bạn trong thời gian nhanh nhất.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-orange-500">7. Chính sách giao hàng quốc tế</h2>
          <p className="text-gray-700 mb-3">
            Đối với đơn hàng quốc tế, chúng tôi hợp tác với các đối tác vận chuyển quốc tế như DHL, FedEx. Một số lưu ý:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Thời gian giao hàng: 7-14 ngày làm việc.</li>
            <li>Phí vận chuyển: Tính theo khối lượng và quốc gia (sẽ thông báo trước khi xác nhận đơn hàng).</li>
            <li>Thuế và phí hải quan: Khách hàng chịu trách nhiệm thanh toán (nếu có).</li>
            <li>Hỗ trợ: Liên hệ qua email international@shop.com để được hỗ trợ.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;