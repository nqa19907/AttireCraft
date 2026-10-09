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

## Deploy lên Vercel

Dự án là website HTML/CSS/JS tĩnh; trang chủ nằm ở `frontend/index.html`. File `vercel.json` tại thư mục gốc cấu hình Vercel phục vụ nội dung trong `frontend` và bỏ qua bước cài thư viện, build.

Trong **Settings → Build and Deployment**, dùng các giá trị sau:

| Thiết lập | Giá trị |
| --- | --- |
| Root Directory | `./` (thư mục gốc repository) |
| Framework Preset | `Other` |
| Build Command | Bật Override, để trống |
| Output Directory | `frontend` |
| Install Command | Bật Override, để trống |

Giữ Root Directory là thư mục gốc để Vercel đọc được `vercel.json`. Nếu Output Directory là `.` thì đường dẫn `/` không có `index.html` và có thể báo 404.

Đưa `vercel.json` lên repository đã kết nối với Vercel, rồi deploy phiên bản có file này. Nếu chỉnh thiết lập trên dashboard, cần tạo deployment mới để áp dụng. `server.cjs` chỉ phục vụ việc chạy cục bộ; Vercel phục vụ trực tiếp các file tĩnh, không cần chạy `npm start`.

Tham khảo [cấu hình build của Vercel](https://vercel.com/docs/builds/configure-a-build).

## Tính năng

- Chọn 4 dòng trang phục: áo dài, áo tứ thân, áo ngũ thân và áo bà ba.
- Chọn sự kiện, thời tiết, bảng màu, phong cách và tối đa 2 phụ kiện.
- Bản phối minh họa cập nhật tức thì theo lựa chọn.
- Có 200 biến thể phụ kiện dựng sẵn từ 20 ảnh trang phục gốc: 4 kiểu áo × 5 màu × 10 cách chọn một hoặc hai phụ kiện.
- “Thêm chút cá tính” chọn ảnh theo phong cách: Gen Z thêm kính râm, Cổ điển thêm một vòng cổ ngọc trai, Tối giản giữ bộ ảnh cũ. Danh mục cần 200 tổ hợp phụ kiện và 20 ảnh chưa chọn phụ kiện cho mỗi phong cách mới; phụ kiện theo phong cách không chiếm hai ô phụ kiện tự chọn.
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
├── style-image-variants.js     # Danh sách ảnh Gen Z và Cổ điển đã có
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
.venv/Scripts/python.exe scripts/style_catalog.py
.venv/Scripts/python.exe scripts/optimize-styles.py
.venv/Scripts/python.exe scripts/build-style-gallery.py
.venv/Scripts/python.exe scripts/check-style-art.py
```

Các script chỉ xử lý ảnh có sẵn trên máy. Danh mục biến thể nằm trong `scripts/accessory_catalog.py`; trang đối chiếu và báo cáo kiểm tra nằm trong `artifacts/accessory-review/`.

Ảnh phong cách được sửa riêng bằng công cụ ImageGen tích hợp, giữ trang phục và các phụ kiện của ảnh nguồn. PNG nằm trong `frontend/assets/outfits/styles/{genz,classic}/`; WebP và thumbnail nằm trong `frontend/assets/optimized/styles/`. Danh mục 440 ảnh và bộ prompt ở `scripts/style_catalog.py` và `artifacts/style-review/generation-jobs.json`; trang đối chiếu, ảnh chụp giao diện và báo cáo kiểm tra ở `artifacts/style-review/`. Script tối ưu chỉ công bố ảnh đã có đủ bản WebP và thumbnail; khi chưa có ảnh phong cách, giao diện dùng ảnh cũ tương ứng.

Trạng thái ngày 6/10/2026: đã công bố 352/440 ảnh (202 Gen Z, 150 Cổ điển), còn 88 ảnh chờ hạn mức ImageGen. Tổ hợp áo ngũ thân + Cổ điển + khuyên ngọc + khăn vấn đã đủ cả năm màu. Danh sách tiếp tục tạo nằm trong `artifacts/style-review/pending-jobs.json`. Kiểm tra `check-style-art.py` trả mã lỗi khi danh mục chưa đủ; các kiểm thử giao diện xác nhận ảnh đã công bố và việc dùng ảnh cũ cho tổ hợp còn thiếu.

## Kiểm tra

```powershell
node --test tests/core.test.cjs tests/server.test.cjs
node tests/browser-smoke.cjs
```

Kiểm thử trình duyệt dùng Playwright/Chrome đã có trên máy. Có thể chỉ định `PLAYWRIGHT_MODULE`, `BROWSER_EXECUTABLE`, `TEST_FILTER` và `TEST_SCREENSHOTS` khi cần.
