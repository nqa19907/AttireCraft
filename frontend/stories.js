(function (root, factory) {
  'use strict';
  const stories = factory();
  if (typeof module === 'object' && module.exports) module.exports = stories;
  else root.AttireStories = stories;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const museumFashion = {
    title: 'Bảo tàng Phụ nữ Việt Nam · Thời trang và nghệ thuật tạo hoa văn',
    url: 'https://baotangphunu.org.vn/thoi-trang-va-nghe-thuat-tao-hoa-van/'
  };
  const tourismClothing = {
    title: 'Cục Du lịch Quốc gia Việt Nam · Trang phục',
    url: 'https://vietnamtourism.vn/index.php/about/items/2258'
  };

  const stories = {
    'ao-dai': {
      title: 'Áo dài — một tà áo, nhiều thế hệ',
      subtitle: 'Dòng chảy Việt phục',
      intro: 'Có người nhớ áo dài qua buổi tựu trường, có người qua ngày cưới hay một lần về quê ăn Tết. Tà áo quen thuộc ấy vừa lưu giữ ký ức, vừa tiếp tục thay đổi cùng người mặc.',
      sections: [
        {
          heading: 'Nhận ra qua hai tà áo',
          paragraphs: [
            'Áo dài hiện đại thường có thân áo liền phía trên, xẻ hai bên để tạo tà trước và tà sau, mặc cùng quần dài. Cổ áo, tay áo và độ dài tà có nhiều biến thể; không có một kiểu duy nhất đại diện cho mọi thời kỳ.'
          ]
        },
        {
          heading: 'Từ áo xưa đến phom dáng hiện đại',
          paragraphs: [
            'Bảo tàng Phụ nữ Việt Nam đặt áo tứ thân và áo ngũ thân trong quá trình phát triển của áo dài. Những đổi mới của họa sĩ Nguyễn Cát Tường vào thập niên 1930 là một dấu mốc trong quá trình ấy.',
            'Trang Du lịch Việt Nam giới thiệu các cách tân như cổ thuyền, tay ngắn và tà lửng. Vì vậy, câu chuyện áo dài nên được nhìn như một quá trình biến đổi, thay vì chỉ gắn với một mẫu áo cố định.'
          ]
        },
        {
          heading: 'Trang phục đi cùng những dấu mốc',
          paragraphs: [
            'Áo dài xuất hiện trong dịp Tết, lễ cưới, các buổi lễ và đời sống học đường. Khi chọn áo cho một sự kiện cụ thể, hãy xem hướng dẫn của nơi tổ chức, đồng thời chọn phom cho phép bạn ngồi, bước đi và hoạt động thoải mái.'
          ]
        }
      ],
      facts: [
        { label: 'Nhận diện', value: 'Hai tà áo, thường mặc cùng quần dài' },
        { label: 'Dấu mốc', value: 'Các cách tân của Nguyễn Cát Tường trong thập niên 1930' },
        { label: 'Bối cảnh', value: 'Lễ cưới, Tết, học đường và các buổi lễ' }
      ],
      styling: [
        'Để tà áo dễ nổi bật, thử giày và túi nhỏ có màu gần với áo hoặc quần.',
        'Chọn khuyên ngọc, khăn vấn hoặc nón theo sở thích và bối cảnh; không cần dùng tất cả cùng lúc.',
        'Ảnh phối trong studio là gợi ý sáng tạo. Khi may áo thật, hãy kiểm tra độ vừa và chất liệu.'
      ],
      sources: [
        {
          title: 'Du lịch Việt Nam · Tất cả về áo dài',
          url: 'https://vietnam.travel/vi/things-to-do/all-about-ao-dai-vietnams-national-dress'
        },
        museumFashion,
        tourismClothing
      ]
    },
    'tu-than': {
      title: 'Áo tứ thân — câu chuyện những lớp áo',
      subtitle: 'Hơi thở Bắc Bộ',
      intro: 'Một bộ áo tứ thân được cảm nhận qua cả tổng thể: áo khoác ngoài, yếm, váy và dải thắt lưng. Các lớp áo tạo nên nhịp màu riêng, gợi nhớ một phần đời sống và phục sức của phụ nữ Bắc Bộ.',
      sections: [
        {
          heading: 'Chiếc áo trong một bộ phục sức',
          paragraphs: [
            'Tư liệu của Cục Du lịch Quốc gia Việt Nam giới thiệu áo tứ thân cùng váy, yếm, thắt lưng và khăn đội đầu. Những thành phần đi kèm quan trọng không kém chiếc áo ngoài khi tìm hiểu một bộ trang phục truyền thống.'
          ]
        },
        {
          heading: 'Từ đời sống đến ký ức văn hóa',
          paragraphs: [
            'Theo Bảo tàng Phụ nữ Việt Nam, váy và áo tứ thân từng phổ biến trong trang phục phụ nữ Bắc Bộ đến đầu thế kỷ XX. Đây là một lớp ký ức trang phục của vùng, không đại diện cho toàn bộ phụ nữ Việt Nam ở mọi thời kỳ.'
          ]
        },
        {
          heading: 'Màu sắc được kể bằng nhiều lớp',
          paragraphs: [
            'Tư liệu du lịch mô tả những bộ lễ phục có nhiều lớp áo với màu khác nhau, để lộ màu áo trong và chiếc yếm. Chi tiết ấy gợi một cách quan sát thú vị: nhìn sự kết hợp giữa các lớp, thay vì chỉ nhìn màu của chiếc áo ngoài.',
            'Bản phối của AttireCraft diễn giải tinh thần này bằng bảng màu và phụ kiện hiện đại. Nếu chuẩn bị phục trang cho biểu diễn hoặc tái hiện lịch sử, nên đối chiếu thêm tư liệu của địa phương và thời kỳ cần thể hiện.'
          ]
        }
      ],
      facts: [
        { label: 'Không gian văn hóa', value: 'Gắn với phục sức phụ nữ Bắc Bộ' },
        { label: 'Thành phần đi kèm', value: 'Yếm, váy, thắt lưng và khăn đội đầu' },
        { label: 'Điểm quan sát', value: 'Cách phối và để lộ màu của nhiều lớp áo' }
      ],
      styling: [
        'Thử một màu áo ngoài trầm với điểm màu ở yếm hoặc dải thắt lưng.',
        'Trong studio, khăn vấn giúp bạn thử thêm một điểm nhấn ở phần đầu.',
        'Các phụ kiện hiện có là lựa chọn sáng tạo, chưa phải một bộ phục sức phục dựng đầy đủ.'
      ],
      sources: [museumFashion, tourismClothing]
    },
    'ngu-than': {
      title: 'Áo ngũ thân — dấu ấn của đường may',
      subtitle: 'Nét áo xưa, sức sống hôm nay',
      intro: 'Nhìn áo ngũ thân, hãy dành một chút thời gian cho cổ áo, đường khuy và cách các thân vải gặp nhau. Điều đáng kể không chỉ là phom áo, mà còn là công sức của người may và những người tiếp tục gìn giữ nghề.',
      sections: [
        {
          heading: 'Năm thân tạo nên phom áo',
          paragraphs: [
            'Trang Khám Phá Huế giới thiệu cấu trúc gồm hai thân trước, hai thân sau và một thân nằm phía trong. Cổ đứng, hàng khuy và các đường ghép vải là những chi tiết giúp nhận diện áo ngũ thân; kiểu tay áo có thể khác nhau.'
          ]
        },
        {
          heading: 'Một truyền thống được trao lại',
          paragraphs: [
            'Tháng 11 năm 2021, các nghệ nhân và Trung tâm Hỗ trợ phát triển Áo dài ngũ thân truyền thống trao tặng 12 bộ áo cho bảy bảo tàng. Bảo tàng Lịch sử quốc gia tiếp nhận một bộ áo nam do nghệ nhân Trần Nguyễn Trung Hiếu may bằng lụa La Khê.',
            'Bảo tàng mô tả sự tỉ mỉ ở việc ghép hoa văn, giấu đường chỉ và định hình tà áo. Câu chuyện này cho thấy việc giữ gìn trang phục còn nằm ở kỹ thuật và bàn tay người thợ.'
          ]
        },
        {
          heading: 'Cấu trúc và cách diễn giải',
          paragraphs: [
            'Một cách diễn giải được lưu truyền tại Huế liên hệ năm thân áo với cha mẹ hai bên và người mặc, năm khuy với các giá trị đạo đức Nho giáo. Đây là cách hiểu biểu tượng được truyền lại, không phải quy tắc để đánh giá người mặc.',
            'Nếu muốn tìm hiểu sâu hơn, hãy xem hiện vật và tư liệu may mặc bên cạnh ảnh minh họa. Hình ảnh gợi phom dáng nhưng không đủ để xác nhận số thân vải hay kỹ thuật may thật.'
          ]
        }
      ],
      facts: [
        { label: 'Cấu trúc', value: 'Năm thân vải, gồm một thân phía trong' },
        { label: 'Nhận diện', value: 'Cổ đứng, hàng khuy và đường ghép thân áo' },
        { label: 'Biến thể', value: 'Có kiểu tay chẽn và tay rộng' }
      ],
      styling: [
        'Thử bảng màu đơn giản để dễ quan sát cổ áo và đường khuy.',
        'Khăn vấn và một phụ kiện nhỏ là một cách thử tạo điểm nhấn trong studio.',
        'Khi mặc thật, ưu tiên độ thoải mái ở cổ, vai và tay áo; hỏi người may về cấu trúc của mẫu đã chọn.'
      ],
      sources: [
        {
          title: 'Bảo tàng Lịch sử quốc gia · Tiếp nhận áo dài ngũ thân truyền thống',
          url: 'https://baotanglichsu.vn/vi/Articles/3090/72685/bao-tang-lich-su-quoc-gia-tiep-nhan-ao-dai-ngu-than-truyen-thong.html'
        },
        {
          title: 'Khám Phá Huế · Ý nghĩa của áo ngũ thân',
          url: 'https://khamphahue.com.vn/Van-hoa/Hue-Kinh-%C4%91o-ao-dai-Viet-Nam/Chi-tiet/tid/Y-nghia-cua-Ao-ngu-than.html/pid/2964/cid/303'
        }
      ]
    },
    'ba-ba': {
      title: 'Áo bà ba — ký ức trong chiếc áo gần gũi',
      subtitle: 'Thương mến Nam Bộ',
      intro: 'Áo bà ba thường được nhắc cùng đời sống Nam Bộ. Một chiếc áo gọn, quen thuộc có thể chứa cả câu chuyện về công việc, gia đình và những người đã mặc nó qua nhiều năm tháng.',
      sections: [
        {
          heading: 'Phom áo dễ nhận ra',
          paragraphs: [
            'Bảo tàng Phụ nữ Nam Bộ mô tả một chiếc áo bà ba cổ tròn, có khuy phía trước và hai bên hông xẻ vừa phải. Đó là những chi tiết dễ quan sát ở nhiều mẫu áo bà ba; mẫu may thực tế vẫn có thể khác nhau.'
          ]
        },
        {
          heading: 'Một hiện vật, một người mẹ',
          paragraphs: [
            'Tại Bảo tàng Phụ nữ Nam Bộ, chiếc áo bà ba tím của Mẹ Việt Nam Anh hùng Đặng Thị Bìa được người con gái Phan Thị Rẻn trao tặng cùng các kỷ vật của mẹ. Với gia đình, chiếc áo gợi lại cảm giác gần gũi và những ngày ở bên mẹ.',
            'Câu chuyện của một hiện vật giúp ta nhìn trang phục như một phần đời sống con người: chiếc áo có ý nghĩa vì người đã mặc nó, chứ không chỉ vì màu hay kiểu dáng.'
          ]
        },
        {
          heading: 'Đời sống và những cách làm mới',
          paragraphs: [
            'Bảo tàng Phụ nữ Việt Nam ghi nhận quần áo bà ba phổ biến ở Nam Bộ từ cuối thế kỷ XIX. Về nguồn gốc, bài giới thiệu của Ủy ban Nhà nước về người Việt Nam ở nước ngoài nêu nhiều cách giải thích; không nên coi một giả thuyết là kết luận duy nhất.',
            'Các bản phối trên website mở rộng màu sắc và phụ kiện để bạn thử theo sở thích. Muốn tìm hiểu trang phục lao động hay một giai đoạn lịch sử cụ thể, hãy phân biệt mẫu sáng tạo hôm nay với hiện vật và ảnh tư liệu.'
          ]
        }
      ],
      facts: [
        { label: 'Không gian văn hóa', value: 'Gắn với đời sống Nam Bộ' },
        { label: 'Nhận diện thường gặp', value: 'Áo ngắn, khuy trước, xẻ hai bên hông' },
        { label: 'Ký ức hiện vật', value: 'Áo bà ba tím của Mẹ Đặng Thị Bìa tại Bảo tàng Phụ nữ Nam Bộ' }
      ],
      styling: [
        'Thử chất liệu nhẹ và phom cho phép vận động thoải mái khi chọn áo thật.',
        'Túi nhỏ hoặc nón lá là những lựa chọn có thể thử trong studio theo bối cảnh sử dụng.',
        'Bạn có thể bắt đầu từ một gam màu yêu thích rồi thêm phụ kiện vừa đủ cho nhu cầu của mình.'
      ],
      sources: [
        {
          title: 'Bảo tàng Phụ nữ Nam Bộ · Mẹ Việt Nam Anh hùng Đặng Thị Bìa',
          url: 'https://baotangphunu.com/me-viet-nam-anh-hung-dang-thi-bia/'
        },
        museumFashion,
        {
          title: 'Ủy ban Nhà nước về người Việt Nam ở nước ngoài · Áo bà ba',
          url: 'https://scov.gov.vn/ban-sac-van-hoa/huong-vi-que-nha/ao-ba-ba-trang-phuc-cua-phu-nu-nam-bo.html'
        }
      ]
    }
  };

  function freeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  return freeze(stories);
});
