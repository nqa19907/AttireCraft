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
- Tìm bản phối qua 3 câu hỏi về dịp, thời tiết và phong cách; nhận 3 phương án có lý do, mở vào phòng phối để chỉnh và lưu.
- Điểm hài hòa là tổng Màu sắc /30, Bối cảnh /40 và Thoải mái /30; xem lý do từng tiêu chí, áp dụng gợi ý tăng điểm và hoàn tác. Lưu ý văn hóa được trình bày riêng.
- Lưu tối đa 12 bản phối vào lookbook bằng `localStorage`.
- So sánh hai phương án, chia sẻ liên kết và tải ảnh PNG của bản phối hoặc lookbook.
- Xuất và nhập lookbook bằng JSON.
- Câu chuyện chi tiết cho bốn trang phục, kèm liên kết nguồn bảo tàng và du lịch.
- Giao diện responsive cho desktop, tablet và điện thoại.

## Cách tính điểm và tìm bản phối

Các quy tắc mang tính gợi ý của studio, không đánh giá tính xác thực văn hóa hay đo độ thoải mái thực tế. Màu sắc bắt đầu ở 28/30, thêm 2 điểm cho đỏ/hồng ở lễ cưới, giảm 4 điểm khi chọn hai phụ kiện ở phong cách tối giản (2 điểm với phong cách khác). Bối cảnh được 40/40 nếu trang phục thuộc nhóm ưu tiên cho dịp đã chọn, ngoài nhóm là 24/40. Thoải mái bắt đầu ở 30/30, giảm 8 điểm cho màu đen khi nắng ấm, giảm 5 điểm cho áo dài/tứ thân khi có mưa. Tổng điểm được tính lại từ cấu hình khi mở dữ liệu đã lưu, nhập JSON hoặc mở liên kết chia sẻ.

Luồng tìm bản phối giữ nguyên ba câu trả lời, chọn trong nhóm trang phục gợi ý của dịp đó và ưu tiên đa dạng phom áo rồi màu sắc. Các nút điều chỉnh giữ dịp, thời tiết và phong cách; hiển thị mức tăng điểm thật trước khi áp dụng. Có thể hoàn tác lần áp dụng gần nhất, cho đến khi bạn đổi lựa chọn khác. Chọn một kết quả tìm bản phối sẽ mở bản nháp mới, không cập nhật bản đã lưu trước đó.

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

Trạng thái ngày 9/10/2026: đã công bố đủ 440/440 ảnh (220 Gen Z, 220 Cổ điển), gồm toàn bộ 400 tổ hợp phụ kiện và 40 ảnh chưa chọn phụ kiện. Đợt bổ sung hoàn tất 88 ảnh còn thiếu bằng ImageGen tích hợp; mỗi ảnh có PNG nguồn, WebP và thumbnail. `artifacts/style-review/pending-jobs.json` hiện rỗng. Kiểm tra `check-style-art.py` xác nhận danh mục đầy đủ, không có ảnh trùng, sai tỷ lệ hoặc nền cần xem xét thêm; các kiểm thử kiểm tra đường dẫn và file ảnh cho mọi tổ hợp.

## Kiểm tra

```powershell
node --test tests/core.test.cjs tests/server.test.cjs
node tests/browser-smoke.cjs
```

Kiểm thử trình duyệt dùng Playwright/Chrome đã có trên máy. Có thể chỉ định `PLAYWRIGHT_MODULE`, `BROWSER_EXECUTABLE`, `TEST_FILTER` và `TEST_SCREENSHOTS` khi cần.
