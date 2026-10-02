# AttireCraft — Việt phục Remix

Website tương tác giúp học sinh, sinh viên khám phá và phối trang phục truyền thống Việt Nam theo dịp, thời tiết và phong cách cá nhân.

## Chạy dự án

Dự án không cần cài thư viện npm. Dùng Node.js 20 trở lên để chạy máy chủ web cục bộ:

```powershell
cd D:\AttireCraft
node server.cjs
```

Sau đó truy cập `http://127.0.0.1:4173`.

Máy chủ chạy trên địa chỉ IPv4 `127.0.0.1`. Dùng đúng địa chỉ này để tránh trường hợp `localhost` chuyển đến một máy chủ khác trên IPv6 và hiện danh sách thư mục hoặc lỗi tải tài nguyên.

Giữ terminal đang chạy; nhấn `Ctrl+C` để dừng máy chủ. Bạn cũng có thể dùng `npm start` hoặc `npm run dev`.

Trên Windows PowerShell, nếu `npm` báo `running scripts is disabled`, dùng `npm.cmd`:

```powershell
npm.cmd run dev
```

Không cần chạy `npm install` vì dự án không có thư viện npm bên ngoài. Nếu cổng 4173 đã có máy chủ chạy, mở địa chỉ ở trên hoặc dừng terminal cũ trước khi khởi động lại.

Bạn cũng có thể mở trực tiếp `frontend/index.html`, nhưng nên dùng máy chủ cục bộ để việc chia sẻ liên kết và tải tài nguyên hoạt động ổn định.

## Tính năng

- Chọn 4 dòng trang phục: áo dài, áo tứ thân, áo ngũ thân và áo bà ba.
- Chọn sự kiện, thời tiết, bảng màu, phong cách và tối đa 2 phụ kiện.
- Bản phối minh họa cập nhật tức thì theo lựa chọn.
- Có 200 biến thể phụ kiện dựng sẵn từ 20 ảnh trang phục gốc: 4 kiểu áo × 5 màu × 10 cách chọn một hoặc hai phụ kiện.
- Chấm điểm hài hòa và đưa ra lưu ý theo bối cảnh vùng miền, văn hóa.
- Lưu tối đa 12 bản phối vào lookbook bằng `localStorage`.
- So sánh hai phương án, chia sẻ liên kết và tải ảnh PNG của bản phối hoặc lookbook.
- Xuất và nhập lookbook bằng JSON.
- Câu chuyện chi tiết cho bốn trang phục, kèm liên kết nguồn bảo tàng và du lịch.
- Giao diện responsive cho desktop, tablet và điện thoại.

## Cấu trúc

```text
frontend/
├── assets/                     # Ảnh gốc và ảnh WebP tối ưu
├── index.html
├── styles.css
├── image-variants.js           # Danh sách biến thể phụ kiện
├── core.js                     # Quy tắc dữ liệu và phối đồ
├── stories.js                  # Nội dung và nguồn tham khảo
├── download.js                 # Xuất ảnh PNG/lookbook
└── app.js                      # Tương tác giao diện
server.cjs                      # Máy chủ web tĩnh cục bộ
```

Sau khi thêm hoặc cập nhật ảnh nguồn, dùng các script trong `scripts/` để tối ưu WebP, thumbnail và kiểm tra bộ ảnh:

```powershell
.venv/Scripts/python.exe scripts/optimize-assets.py
.venv/Scripts/python.exe scripts/optimize-accessories.py
.venv/Scripts/python.exe scripts/build-accessory-gallery.py
.venv/Scripts/python.exe scripts/check-accessory-art.py
```

Các script chỉ xử lý ảnh có sẵn trên máy. Danh mục biến thể nằm trong `scripts/accessory_catalog.py`; trang đối chiếu và báo cáo kiểm tra nằm trong `artifacts/accessory-review/`.

## Kiểm tra

```powershell
node --test tests/core.test.cjs tests/server.test.cjs
node tests/browser-smoke.cjs
```

Kiểm thử trình duyệt dùng Playwright/Chrome đã có trên máy. Có thể chỉ định `PLAYWRIGHT_MODULE`, `BROWSER_EXECUTABLE`, `TEST_FILTER` và `TEST_SCREENSHOTS` khi cần.
