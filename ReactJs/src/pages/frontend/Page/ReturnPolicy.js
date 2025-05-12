import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="container mx-auto p-5 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-orange-500">Chính sách đổi trả</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">1. Điều kiện đổi trả</h2>
          <p className="text-gray-700 mb-3">
            Chúng tôi hỗ trợ đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng với các điều kiện sau:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Sản phẩm chưa qua sử dụng, còn nguyên tem mác, bao bì, và phụ kiện đi kèm.</li>
            <li>Sản phẩm bị lỗi do nhà sản xuất (hư hỏng, không đúng mô tả, không hoạt động).</li>
            <li>Có hóa đơn mua hàng hoặc mã đơn hàng hợp lệ.</li>
            <li>Sản phẩm không thuộc danh mục không hỗ trợ đổi trả (xem mục 2).</li>
            <li>Đơn hàng phải được giao trong vòng 7 ngày trước đó (dựa trên ngày giao hàng thành công).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">2. Sản phẩm không được đổi trả</h2>
          <p className="text-gray-700 mb-3">
            Một số sản phẩm không được áp dụng chính sách đổi trả, bao gồm:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Sản phẩm đã qua sử dụng, không còn nguyên vẹn hoặc thiếu bao bì, phụ kiện.</li>
            <li>Sản phẩm thuộc danh mục hàng hóa đặc biệt: nội y, đồ dùng cá nhân, mỹ phẩm đã mở nắp.</li>
            <li>Sản phẩm không có lý do đổi trả hợp lệ (ví dụ: không thích, đổi ý, đặt nhầm).</li>
            <li>Sản phẩm mua trong các chương trình khuyến mãi đặc biệt (nếu được thông báo trước).</li>
            <li>Sản phẩm đã hết hạn đổi trả (quá 7 ngày kể từ ngày nhận hàng).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">3. Quy trình đổi trả</h2>
          <p className="text-gray-700 mb-3">
            Để đảm bảo quá trình đổi trả diễn ra nhanh chóng, bạn vui lòng thực hiện theo các bước sau:
          </p>
          <ul className="list-decimal pl-5 text-gray-700 mb-3">
            <li>Liên hệ với chúng tôi qua hotline 1900-1234 hoặc email support@shop.com để thông báo yêu cầu đổi trả. Vui lòng cung cấp mã đơn hàng và lý do đổi trả.</li>
            <li>Đóng gói sản phẩm kèm hóa đơn (hoặc mã đơn hàng in trên bao bì), đảm bảo sản phẩm còn nguyên vẹn.</li>
            <li>Gửi sản phẩm về địa chỉ: Trung tâm xử lý đổi trả Shop, 123 Đường Shopee, Quận 1, TP.HCM.</li>
            <li>Chúng tôi sẽ kiểm tra sản phẩm và phản hồi trong vòng 3-5 ngày làm việc.</li>
            <li>Nếu yêu cầu hợp lệ, bạn sẽ nhận được sản phẩm thay thế hoặc hoàn tiền (tùy theo yêu cầu).</li>
          </ul>
          <p className="text-gray-700">
            Lưu ý: Thời gian xử lý có thể kéo dài hơn trong các dịp cao điểm (lễ, Tết).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">4. Chi phí đổi trả</h2>
          <p className="text-gray-700 mb-3">
            Chi phí đổi trả được quy định như sau:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li><strong>Miễn phí:</strong> Nếu sản phẩm lỗi do nhà sản xuất hoặc giao sai sản phẩm.</li>
            <li><strong>Khách hàng chịu phí:</strong> Nếu đổi trả vì lý do cá nhân (phí vận chuyển: 20.000 ₫ - 50.000 ₫ tùy khu vực).</li>
            <li><strong>Đơn hàng quốc tế:</strong> Khách hàng chịu toàn bộ phí vận chuyển (bao gồm phí gửi trả và phí giao hàng mới).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">5. Phương thức hoàn tiền</h2>
          <p className="text-gray-700 mb-3">
            Nếu bạn yêu cầu hoàn tiền, chúng tôi sẽ xử lý theo các phương thức sau:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li><strong>Chuyển khoản ngân hàng:</strong> Hoàn tiền trong vòng 5-7 ngày làm việc (vui lòng cung cấp thông tin tài khoản).</li>
            <li><strong>Ví điện tử:</strong> Hoàn tiền trong vòng 24-48 giờ (ShopeePay, Momo, ZaloPay).</li>
            <li><strong>Hoàn vào tài khoản Shop:</strong> Hoàn tiền ngay lập tức dưới dạng điểm thưởng (1 điểm = 1.000 ₫).</li>
          </ul>
          <p className="text-gray-700">
            Lưu ý: Thời gian hoàn tiền có thể kéo dài hơn nếu ngân hàng hoặc ví điện tử gặp sự cố.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">6. Các trường hợp đặc biệt</h2>
          <p className="text-gray-700 mb-3">
            Trong một số trường hợp đặc biệt, chúng tôi sẽ xử lý linh hoạt để đảm bảo quyền lợi khách hàng:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Nếu sản phẩm lỗi nhưng không còn hàng để đổi, bạn có thể chọn sản phẩm tương đương hoặc nhận hoàn tiền.</li>
            <li>Nếu sản phẩm lỗi sau khi đổi trả lần đầu, chúng tôi sẽ hỗ trợ bảo hành hoặc hoàn tiền thêm.</li>
            <li>Nếu bạn gặp khó khăn trong việc gửi trả hàng, chúng tôi có thể hỗ trợ lấy hàng tận nơi (áp dụng tại một số khu vực).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-orange-500">7. Hỗ trợ đổi trả</h2>
          <p className="text-gray-700 mb-3">
            Nếu bạn cần hỗ trợ trong quá trình đổi trả, vui lòng liên hệ:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Hotline: 1900-1234 (8:00 - 21:00, tất cả các ngày).</li>
            <li>Email: support@shop.com (phản hồi trong 24 giờ).</li>
            <li>Chat trực tiếp trên website (phản hồi trong 5 phút).</li>
          </ul>
          <p className="text-gray-700">
            Chúng tôi cam kết mang đến trải nghiệm đổi trả dễ dàng và nhanh chóng nhất cho bạn!
          </p>
        </section>
      </div>
    </div>
  );
};

export default ReturnPolicy;