import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-5 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-orange-500">Chính sách bảo mật</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">1. Mục đích thu thập thông tin</h2>
          <p className="text-gray-700 mb-3">
            Shop thu thập thông tin cá nhân của khách hàng nhằm mục đích:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Xử lý đơn hàng và giao hàng (họ tên, số điện thoại, địa chỉ).</li>
            <li>Cung cấp dịch vụ chăm sóc khách hàng (email, số điện thoại).</li>
            <li>Gửi thông báo khuyến mãi, cập nhật đơn hàng (email, số điện thoại).</li>
            <li>Cải thiện trải nghiệm người dùng (dữ liệu duyệt web, lịch sử mua hàng).</li>
            <li>Đảm bảo an toàn giao dịch (thông tin thanh toán).</li>
          </ul>
          <p className="text-gray-700">
            Chúng tôi cam kết chỉ sử dụng thông tin cho các mục đích đã nêu và không sử dụng sai mục đích.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">2. Loại thông tin thu thập</h2>
          <p className="text-gray-700 mb-3">
            Các loại thông tin mà chúng tôi thu thập bao gồm:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li><strong>Thông tin cá nhân:</strong> Họ tên, số điện thoại, email, địa chỉ giao hàng.</li>
            <li><strong>Thông tin thanh toán:</strong> Số tài khoản ngân hàng, thông tin thẻ tín dụng (mã hóa an toàn).</li>
            <li><strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại thiết bị, trình duyệt, dữ liệu cookie.</li>
            <li><strong>Thông tin sử dụng:</strong> Lịch sử mua hàng, sản phẩm đã xem, tìm kiếm trên website.</li>
          </ul>
          <p className="text-gray-700">
            Bạn có quyền không cung cấp một số thông tin, nhưng điều này có thể ảnh hưởng đến trải nghiệm sử dụng dịch vụ.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">3. Phương thức thu thập</h2>
          <p className="text-gray-700 mb-3">
            Chúng tôi thu thập thông tin qua các phương thức sau:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Thông tin bạn cung cấp trực tiếp khi đăng ký tài khoản, đặt hàng, hoặc liên hệ hỗ trợ.</li>
            <li>Thông tin tự động thu thập qua cookie và công nghệ theo dõi khi bạn truy cập website.</li>
            <li>Thông tin từ bên thứ ba (đơn vị vận chuyển, cổng thanh toán) khi cần thiết để xử lý đơn hàng.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">4. Bảo mật thông tin</h2>
          <p className="text-gray-700 mb-3">
            Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt để bảo vệ thông tin của bạn:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Mã hóa dữ liệu cá nhân và thông tin thanh toán bằng công nghệ SSL.</li>
            <li>Hạn chế quyền truy cập thông tin chỉ với nhân viên cần thiết.</li>
            <li>Lưu trữ dữ liệu trên máy chủ bảo mật cao, tuân thủ tiêu chuẩn quốc tế.</li>
            <li>Kiểm tra bảo mật định kỳ để phát hiện và khắc phục lỗ hổng.</li>
          </ul>
          <p className="text-gray-700">
            Tuy nhiên, không có hệ thống nào an toàn tuyệt đối. Trong trường hợp xảy ra sự cố bảo mật, chúng tôi sẽ thông báo ngay lập tức và phối hợp để khắc phục.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">5. Chia sẻ thông tin</h2>
          <p className="text-gray-700 mb-3">
            Chúng tôi chỉ chia sẻ thông tin của bạn trong các trường hợp sau:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Chia sẻ với đơn vị vận chuyển để giao hàng (họ tên, số điện thoại, địa chỉ).</li>
            <li>Chia sẻ với cổng thanh toán để xử lý giao dịch (thông tin mã hóa).</li>
            <li>Chia sẻ với cơ quan pháp luật khi có yêu cầu hợp pháp.</li>
          </ul>
          <p className="text-gray-700">
            Chúng tôi không bán, trao đổi, hoặc chuyển giao thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào khác vì mục đích thương mại.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">6. Quyền của khách hàng</h2>
          <p className="text-gray-700 mb-3">
            Bạn có các quyền sau liên quan đến thông tin cá nhân của mình:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Quyền truy cập: Yêu cầu xem thông tin mà chúng tôi đã thu thập.</li>
            <li>Quyền chỉnh sửa: Yêu cầu sửa đổi thông tin nếu có sai sót.</li>
            <li>Quyền xóa: Yêu cầu xóa thông tin cá nhân (trừ trường hợp cần lưu trữ theo quy định pháp luật).</li>
            <li>Quyền từ chối: Từ chối nhận thông báo khuyến mãi hoặc quảng cáo.</li>
          </ul>
          <p className="text-gray-700">
            Để thực hiện các quyền này, vui lòng liên hệ qua email support@shop.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-orange-500">7. Sử dụng cookie</h2>
          <p className="text-gray-700 mb-3">
            Chúng tôi sử dụng cookie để:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Lưu trữ thông tin đăng nhập để bạn không cần đăng nhập lại.</li>
            <li>Gợi ý sản phẩm phù hợp dựa trên lịch sử duyệt web.</li>
            <li>Thu thập dữ liệu phân tích để cải thiện website.</li>
          </ul>
          <p className="text-gray-700">
            Bạn có thể tắt cookie trong cài đặt trình duyệt, nhưng điều này có thể ảnh hưởng đến một số tính năng của website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-orange-500">8. Liên hệ hỗ trợ</h2>
          <p className="text-gray-700 mb-3">
            Nếu bạn có câu hỏi về chính sách bảo mật, vui lòng liên hệ:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-3">
            <li>Hotline: 1900-1234 (8:00 - 21:00, tất cả các ngày).</li>
            <li>Email: privacy@shop.com (phản hồi trong 24 giờ).</li>
            <li>Chat trực tiếp trên website (phản hồi trong 5 phút).</li>
          </ul>
          <p className="text-gray-700">
            Shop cam kết bảo vệ quyền riêng tư của bạn và mang đến trải nghiệm an toàn nhất!
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;