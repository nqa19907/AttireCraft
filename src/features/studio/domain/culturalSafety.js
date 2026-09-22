export const CULTURAL_SAFETY_RULES = [
  {
    id: 'rule_ao_tac_shorts',
    check: (outfit, bottom) => outfit.id === 'ao_tac' && bottom.id === 'quan_short_ngan',
    level: 'danger', // danger | warning | info
    title: 'CẢNH BÁO DI SẢN: Phá vỡ chuẩn mực Lễ phục Cung đình!',
    message: 'Áo Tấc là quốc phục trang trọng bậc nhất thời Nguyễn dùng trong đại lễ tế tổ, miếu đường và nghi lễ gia tộc thiêng liêng. Việc kết hợp với quần short/váy ngắn làm mất đi tính trang nghiêm, tôn kính của nghi thức.',
    solution: 'Khuyên dùng: Phối với Quần Lụa Trắng Thụng Cổ Điển hoặc Quần Đũi Suông để giữ đúng khí chất đài các uy phong.'
  },
  {
    id: 'rule_ngu_than_shorts',
    check: (outfit, bottom) => outfit.id === 'ngu_than_chen' && bottom.id === 'quan_short_ngan',
    level: 'warning',
    title: 'LƯU Ý THẨM MỸ: Phom dáng Ngũ thân mất cân đối!',
    message: 'Áo ngũ thân có độ dài tà qua gối. Khi mặc với quần ngắn lộ chân không đúng cách sẽ gây cảm giác "mặc nhầm váy lửng" hoặc hở hang phản cảm nơi công cộng.',
    solution: 'Gợi ý Gen Z: Hãy thử Quần Jeans Baggy hoặc Chân Váy Xếp Ly dài hiện đại nếu muốn phá cách street-style.'
  },
  {
    id: 'rule_giao_linh_shorts',
    check: (outfit, bottom) => outfit.id === 'ao_giao_linh' && bottom.id === 'quan_short_ngan',
    level: 'warning',
    title: 'LƯU Ý CỔ PHỤC: Mất phom dáng Tràng Vạt uy nghi',
    message: 'Áo giao linh vạt chéo có nguồn gốc hàng ngàn năm, phom dáng bay bổng thanh tao cần có quần thụng hoặc thường (váy dài) che kín chân để tạo cảm giác thoát tục.',
    solution: 'Khuyên dùng: Phối cùng Quần lụa trắng hoặc Quần đũi đen.'
  }
];

export function findCulturalAlert(outfit, bottom) {
  return CULTURAL_SAFETY_RULES.find((rule) => rule.check(outfit, bottom)) ?? null;
}

// Presets sẵn để người dùng click là đổi style tức thì
