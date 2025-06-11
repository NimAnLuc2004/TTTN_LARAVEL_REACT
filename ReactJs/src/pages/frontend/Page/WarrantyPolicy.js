import React from 'react';

const WarrantyPolicy = () => {
  return (
    <div className="container mx-auto p-5 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-orange-500">Chính sách bảo hành</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">1. Điều kiện bảo hành</h2>
          <p className="text-gray-700 mb-3">
            Sản phẩm được bảo hành nếu đáp ứng đầy đủ các điều kiện sau:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Trong thời gian bảo hành (tùy sản phẩm: 3 tháng, 6 tháng, 12 tháng, hoặc lâu hơn).</li>
            <li>Lỗi kỹ thuật do nhà sản xuất (hư hỏng phần cứng, không hoạt động, lỗi phần mềm).</li>
            <li>Có phiếu bảo hành hoặc hóa đơn mua hàng hợp lệ (có thể tra cứu qua mã đơn hàng).</li>
            <li>Sản phẩm không bị hư hỏng do người dùng (rơi vỡ, vào nước, tự ý sửa chữa).</li>
            <li>Tem bảo hành còn nguyên vẹn, không bị rách hoặc chỉnh sửa.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">2. Sản phẩm không được bảo hành</h2>
          <p className="text-gray-700 mb-3">
            Chúng tôi không áp dụng bảo hành trong các trường hợp sau:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Sản phẩm đã hết thời gian bảo hành.</li>
            <li>Hư hỏng do người dùng: rơi vỡ, vào nước, sử dụng sai cách, tự ý tháo lắp.</li>
            <li>Không có tem bảo hành hoặc tem bị rách, chỉnh sửa.</li>
            <li>Sản phẩm thuộc danh mục không bảo hành: phụ kiện (cáp sạc, tai nghe), hàng tiêu dùng.</li>
            <li>Hư hỏng do thiên tai, hỏa hoạn, hoặc các yếu tố khách quan khác.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">3. Thời gian bảo hành</h2>
          <p className="text-gray-700 mb-3">
            Thời gian bảo hành phụ thuộc vào từng loại sản phẩm. Dưới đây là bảng tham khảo:
          </p>
          <table className="w-full text-left border-collapse mb-3">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border border-gray-300">Loại sản phẩm</th>
                <th className="p-3 border border-gray-300">Thời gian bảo hành</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-gray-300">Điện tử (điện thoại, laptop)</td>
                <td className="p-3 border border-gray-300">12 tháng</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-300">Gia dụng (máy xay, nồi chiên)</td>
                <td className="p-3 border border-gray-300">6 tháng</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-300">Thời trang, phụ kiện</td>
                <td className="p-3 border border-gray-300">Không bảo hành</td>
              </tr>
            </tbody>
          </table>
          <p className="text-gray-700">
            Thời gian bảo hành được tính từ ngày nhận hàng (dựa trên thông tin giao hàng thành công).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">4. Quy trình bảo hành</h2>
          <p className="text-gray-700 mb-3">
            Để yêu cầu bảo hành, bạn vui lòng thực hiện theo các bước sau:
          </p>
          <ul className="list-decimal pl-5 text-gray-700 mb-3">
            <li>Liên hệ với chúng tôi qua hotline 1900-1234 hoặc email support@shop.com để thông báo yêu cầu bảo hành.</li>
            <li>Chuẩn bị sản phẩm, phiếu bảo hành (hoặc mã đơn hàng), và các phụ kiện đi kèm (nếu có).</li>
            <li>Gửi sản phẩm về trung tâm bảo hành tại: 123 Đường Shopee, Quận 1, TP.HCM.</li>
            <li>Chúng tôi sẽ kiểm tra sản phẩm và phản hồi trong vòng 7-14 ngày làm việc.</li>
            <li>Nếu sản phẩm hợp lệ, chúng tôi sẽ sửa chữa hoặc thay thế sản phẩm mới.</li>
          </ul>
          <p className="text-gray-700">
            Lưu ý: Thời gian xử lý có thể kéo dài hơn trong các dịp cao điểm.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">5. Chi phí bảo hành</h2>
          <p className="text-gray-700 mb-3">
            Chi phí bảo hành được quy định như sau:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li><strong>Miễn phí:</strong> Nếu sản phẩm thuộc diện bảo hành hợp lệ.</li>
            <li><strong>Khách hàng chịu phí:</strong> Nếu sản phẩm không thuộc diện bảo hành (chi phí sửa chữa sẽ được thông báo trước).</li>
            <li><strong>Phí vận chuyển:</strong> Khách hàng chịu phí gửi sản phẩm đến trung tâm bảo hành (trừ trường hợp đặc biệt).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">6. Các trường hợp đặc biệt</h2>
          <p className="text-gray-700 mb-3">
            Trong một số trường hợp, chúng tôi sẽ xử lý linh hoạt để đảm bảo quyền lợi khách hàng:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Nếu sản phẩm lỗi nhưng không còn hàng để thay thế, bạn có thể nhận sản phẩm tương đương hoặc hoàn tiền.</li>
            <li>Nếu sản phẩm lỗi sau khi bảo hành, chúng tôi sẽ hỗ trợ bảo hành lần hai (trong vòng 30 ngày kể từ ngày bảo hành đầu tiên).</li>
            <li>Nếu bạn không thể gửi sản phẩm đến trung tâm, chúng tôi có thể hỗ trợ lấy hàng tận nơi (áp dụng tại một số khu vực).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-orange-500">7. Hỗ trợ bảo hành</h2>
          <p className="text-gray-700 mb-3">
            Nếu bạn cần hỗ trợ trong quá trình bảo hành, vui lòng liên hệ:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Hotline: 1900-1234 (8:00 - 21:00, tất cả các ngày).</li>
            <li>Email: support@shop.com (phản hồi trong 24 giờ).</li>
            <li>Chat trực tiếp trên website (phản hồi trong 5 phút).</li>
          </ul>
          <p className="text-gray-700">
            Chúng tôi cam kết mang đến dịch vụ bảo hành chuyên nghiệp và nhanh chóng nhất!
          </p>
        </section>
      </div>
    </div>
  );
};

export default WarrantyPolicy;