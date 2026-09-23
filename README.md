# AttireCraft 2 — Việt Phục Remix

AttireCraft 2 là xưởng phối đồ Việt phục chạy trên trình duyệt. Người dùng có thể kết hợp trang phục truyền thống, bảng màu Ngũ hành và phụ kiện hiện đại; xem thay đổi trực tiếp trên ma-nơ-canh SVG; đồng thời nhận cảnh báo khi một bản phối chưa phù hợp với chuẩn mực văn hóa.

Ứng dụng hiện là frontend thuần, không cần backend, cơ sở dữ liệu hoặc biến môi trường.

## Tính năng chính

- Chọn 5 dòng Việt phục: Áo ngũ thân tay chẽn, Áo tấc, Áo tứ thân, Áo giao lĩnh và Áo bà ba.
- Phối quần/chân váy, bảng màu Ngũ hành, phụ kiện truyền thống và phụ kiện hiện đại.
- Chuyển đổi nhanh giữa bản **Remix Gen Z** và bản **Nguyên bản**.
- Đổi ma-nơ-canh nam/nữ và tạo bản phối ngẫu nhiên.
- Áp dụng các preset lookbook có sẵn chỉ với một lần nhấn.
- Hiển thị thông tin lịch sử, ý nghĩa biểu tượng và gợi ý hoàn cảnh sử dụng của từng trang phục.
- Cảnh báo các kết hợp có nguy cơ làm sai lệch phom dáng hoặc tính trang nghiêm của Việt phục.
- Xuất thẻ lookbook thành ảnh PNG và sao chép caption để chia sẻ.

## Công nghệ sử dụng

- [React 19](https://react.dev/) — xây dựng giao diện theo component.
- [Vite 8](https://vite.dev/) — dev server và đóng gói ứng dụng.
- [Tailwind CSS 3](https://tailwindcss.com/) — hệ thống style và responsive layout.
- [Lucide React](https://lucide.dev/) — icon giao diện.
- `html-to-image` — xuất thẻ lookbook thành PNG.
- `canvas-confetti` — hiệu ứng khi tải lookbook.
- `oxlint` — kiểm tra chất lượng mã nguồn.

## Yêu cầu môi trường

- Node.js `^20.19.0` hoặc `>=22.12.0`.
- npm (được cài kèm Node.js).

Kiểm tra phiên bản đang dùng:

```bash
node --version
npm --version
```

## Cài đặt và chạy

Tại thư mục gốc của dự án:

```bash
npm install
npm run dev
```

Mở địa chỉ mà Vite hiển thị trong terminal, mặc định là `http://localhost:5173`.

Nếu muốn cài đúng phiên bản dependency trong `package-lock.json`, có thể thay `npm install` bằng:

```bash
npm ci
```

## Các lệnh có sẵn

| Lệnh | Mục đích |
| --- | --- |
| `npm run dev` | Khởi động môi trường phát triển có hot reload. |
| `npm run lint` | Kiểm tra mã nguồn bằng oxlint. |
| `npm run build` | Tạo bản production trong thư mục `dist/`. |
| `npm run preview` | Chạy thử bản production đã build ở máy local. |

Quy trình kiểm tra nhanh trước khi gửi thay đổi:

```bash
npm run lint
npm run build
npm run preview
```

## Cách sử dụng

1. Chọn ma-nơ-canh nam hoặc nữ trên thanh công cụ.
2. Trong khu vực điều khiển, chọn trang phục, quần/chân váy, màu sắc và phụ kiện.
3. Theo dõi bản phối trên khung preview; chuyển sang **Nguyên bản** để so sánh khi cần.
4. Đọc thẻ thông tin văn hóa và xử lý cảnh báo nếu bản phối chưa phù hợp.
5. Chọn một preset ở phần Lookbook để áp dụng nhanh một phong cách hoàn chỉnh.
6. Nhấn **Chụp Lookbook**, đặt tên bản phối và stylist, sau đó tải ảnh PNG hoặc sao chép caption.

> Cảnh báo văn hóa trong ứng dụng là gợi ý được mã hóa từ bộ quy tắc nội bộ của dự án, không thay thế ý kiến thẩm định của chuyên gia lịch sử hoặc văn hóa.

## Cấu trúc mã nguồn

```text
.
├── public/                         # Tài nguyên tĩnh
├── src/
│   ├── app/
│   │   └── App.jsx                # Composition root và bố cục trang
│   ├── assets/                    # Hình ảnh được đóng gói cùng ứng dụng
│   ├── components/
│   │   └── layout/
│   │       └── Header.jsx         # Thanh công cụ cấp ứng dụng
│   ├── features/
│   │   ├── heritage/
│   │   │   └── components/
│   │   │       └── CulturalCard.jsx
│   │   └── studio/
│   │       ├── components/        # Canvas, lookbook và các tab điều khiển
│   │       │   └── tabs/          # Nội dung riêng của từng tab
│   │       ├── data/              # Catalog và preset tĩnh
│   │       ├── domain/
│   │       │   └── culturalSafety.js
│   │       └── hooks/             # State và quy tắc tương tác của studio
│   ├── index.css                  # Tailwind và style toàn cục
│   └── main.jsx                   # Điểm khởi động React
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

Luồng dữ liệu chính:

```text
data/*.js
   ↓
useOutfitStudio + culturalSafety
   ↓
App.jsx
   ├── Header
   ├── StudioCanvas → OutfitIllustration
   ├── ControlTabs
   ├── CulturalCard
   └── LookbookModal
```

## Hướng dẫn mở rộng

### Thêm trang phục hoặc lựa chọn phối đồ

Chỉnh sửa file dữ liệu tương ứng trong `src/features/studio/data/`:

- `outfits.js`: trang phục chính và thông tin văn hóa.
- `bottoms.js`: quần/chân váy.
- `palettes.js`: bảng màu và điểm hòa sắc.
- `accessories.js`: phụ kiện truyền thống và hiện đại.
- `presets.js`: bản phối lookbook dựng sẵn.
- `filters.js`: lựa chọn bối cảnh trên thanh công cụ.

Mỗi mục cần có `id` duy nhất. Nếu thêm loại trang phục hoặc phụ kiện có hình dáng mới, cập nhật phần minh họa tương ứng trong `OutfitIllustration.jsx`.

### Thêm quy tắc cảnh báo văn hóa

Thêm một rule vào `CULTURAL_SAFETY_RULES` trong `src/features/studio/domain/culturalSafety.js`. Một rule gồm:

- `id`: định danh duy nhất.
- `check`: hàm xác định tổ hợp cần cảnh báo.
- `level`: mức độ `danger`, `warning` hoặc `info`.
- `title`, `message`, `solution`: nội dung giải thích và hướng xử lý.

### Thêm tab điều khiển

1. Tạo component mới trong `src/features/studio/components/tabs/`.
2. Khai báo tab và render component trong `ControlTabs.jsx`.
3. Đặt state/logic dùng chung trong `useOutfitStudio.js` hoặc một hook riêng, thay vì đưa logic nghiệp vụ trực tiếp vào `App.jsx`.

## Quy ước phát triển

- Logic nghiệp vụ của studio đặt trong `features/studio/domain` hoặc `features/studio/hooks`.
- Catalog tĩnh đặt trong `features/studio/data`; không khai báo lẫn trong component giao diện.
- Component chỉ dùng cho studio đặt trong `features/studio/components`.
- Component layout hoặc dùng chung toàn ứng dụng đặt trong `src/components`.
- Chạy `npm run lint` và `npm run build` trước khi tạo commit hoặc pull request.

## Build và triển khai

Tạo bản production:

```bash
npm run build
```

Toàn bộ file cần triển khai nằm trong `dist/`. Có thể đưa thư mục này lên bất kỳ dịch vụ static hosting nào. Vì ứng dụng hiện không dùng router phía client, không cần cấu hình rewrite URL đặc biệt.
