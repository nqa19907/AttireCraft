# AttireCraft 2 — Việt Phục Remix

Ứng dụng React/Vite để phối Việt phục truyền thống với bảng màu và phụ kiện hiện đại, đồng thời cảnh báo các kết hợp chưa phù hợp với chuẩn mực văn hóa.

## Chạy dự án

```bash
npm install
npm run dev
```

Các lệnh kiểm tra:

```bash
npm run lint
npm run build
npm run preview
```

## Cấu trúc mã nguồn

```text
src/
  app/
    App.jsx                         # Composition root và bố cục trang
  components/
    layout/
      Header.jsx                    # Thành phần layout dùng ở cấp ứng dụng
  features/
    heritage/
      components/
        CulturalCard.jsx            # Nội dung và cảnh báo di sản
    studio/
      components/
        tabs/                        # Nội dung riêng của từng tab điều khiển
        ControlTabs.jsx              # Điều hướng các tab
        OutfitIllustration.jsx       # Minh họa SVG trang phục
        StudioCanvas.jsx             # Khung preview và trạng thái
        LookbookModal.jsx
        LookbookPresets.jsx
      data/                          # Catalog tĩnh theo từng loại dữ liệu
      domain/
        culturalSafety.js            # Quy tắc nghiệp vụ văn hóa
      hooks/
        useAccessorySelection.js     # Quy tắc chọn/thay thế phụ kiện
        useOutfitStudio.js           # State và actions của studio
  assets/                            # Hình ảnh đóng gói cùng ứng dụng
  index.css                          # Tailwind và style toàn cục
  main.jsx                           # Điểm khởi động React
```

## Quy ước phát triển

- Logic nghiệp vụ của studio đặt trong `features/studio/domain` hoặc `features/studio/hooks`, không đặt trực tiếp trong `App.jsx`.
- Dữ liệu catalog mới được thêm vào file tương ứng trong `features/studio/data`.
- UI chỉ dùng trong studio đặt trong `features/studio/components`; thành phần layout hoặc dùng chung toàn ứng dụng đặt trong `components`.
- Các tab mới nên là component độc lập trong `features/studio/components/tabs`.
