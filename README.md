# Đồ Đồng Tiểu Phong — V0.5

Website tĩnh giới thiệu quà tặng bằng đồng, tối ưu cho thiết bị di động và triển khai miễn phí bằng GitHub Pages.

## Chạy và kiểm tra

Không cần cài dependency. Mở `index.html` bằng web server tĩnh hoặc chạy:

```bash
node scripts/validate-site.mjs
```

Workflow `.github/workflows/pages.yml` kiểm tra HTML, JavaScript, link nội bộ và asset trên Pull Request. Khi thay đổi được gộp vào `main`, workflow tự bật GitHub Pages (nếu chưa bật) và triển khai website.

## Phạm vi V0.5

- Trang chủ với bốn nhóm quà tặng mẫu: doanh nghiệp, mừng thọ, tân gia và lưu niệm.
- Trang chi tiết có thư viện ảnh/video, thumbnail, chuyển ảnh, phóng to, vuốt trên điện thoại và tùy chọn báo giá.
- Ảnh tư liệu được ghi nguồn và giấy phép; nội dung mẫu không được mô tả là hàng đang bán.
- Hoạt động hoàn toàn ở phía trình duyệt, không có backend hoặc thanh toán.
