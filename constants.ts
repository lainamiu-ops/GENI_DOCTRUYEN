import { Story, NewsPost } from './types';

export const SAMPLE_STORIES: Story[] = [
  {
    id: '1',
    uploaderId: 'user1',
    uploaderName: 'Người Lữ Hành',
    title: 'Hành Trình Về Phương Đông',
    author: 'Người Lữ Hành',
    coverUrl: 'https://picsum.photos/300/450?random=1',
    description: 'Một câu chuyện huyền bí về những vùng đất xa xôi, nơi phép thuật và công nghệ giao thoa.',
    tags: ['Phiêu lưu', 'Huyền huyễn', 'Hành động'],
    status: 'Ongoing',
    views: 12500,
    likes: 1240,
    thanks: 50,
    chapters: [
      {
        id: 'c1',
        order: 1,
        title: 'Chương 1: Khởi đầu mới',
        content: `Mặt trời vừa ló dạng sau rặng núi phía đông, chiếu những tia nắng vàng óng ả xuống thung lũng sương mù.\n\nLâm đứng trên mỏm đá cao, hít một hơi thật sâu không khí trong lành của buổi sớm mai. Hôm nay là ngày cậu chính thức rời khỏi ngôi làng nhỏ bé này để bước vào thế giới rộng lớn. Trong tay cậu chỉ có một thanh kiếm cũ kỹ của cha để lại và một tấm bản đồ da dê đã ố vàng.\n\n"Con đã sẵn sàng chưa?" Tiếng mẹ cậu vọng lại từ phía sau.\n\nLâm quay lại, mỉm cười: "Con đã đợi ngày này từ rất lâu rồi mẹ ạ."`
      },
      {
        id: 'c2',
        order: 2,
        title: 'Chương 2: Rừng Tinh Linh',
        content: `Khu rừng phía trước âm u và tĩnh mịch đến lạ thường. Những thân cây cổ thụ cao vút che khuất cả bầu trời.\n\nTruyền thuyết kể rằng, nơi đây là nơi trú ngụ của những tinh linh cổ xưa, những người nắm giữ bí mật của thế giới.`
      }
    ],
    comments: [
        { id: '1', userId: 'user1', userName: 'Đạo Hữu A', content: 'Truyện hay quá, mong ra chương mới sớm!', timestamp: '2 giờ trước' },
        { id: '2', userId: 'user2', userName: 'Tiên Tử B', content: 'Văn phong mượt mà, rất cuốn hút.', timestamp: '1 ngày trước' }
    ]
  },
  {
    id: '2',
    uploaderId: 'owner-id', // Owned by admin
    uploaderName: 'Vô Danh',
    title: 'Đại Đạo Tranh Phong',
    author: 'Vô Danh',
    coverUrl: 'https://picsum.photos/300/450?random=2',
    description: 'Con đường tu tiên đầy chông gai trắc trở, kẻ thắng làm vua, kẻ thua làm giặc.',
    tags: ['Tiên hiệp', 'Kiếm hiệp', 'Tu chân'],
    status: 'Completed',
    views: 45000,
    likes: 5600,
    thanks: 120,
    chapters: [
      {
        id: 'c1',
        order: 1,
        title: 'Chương 1: Nhập môn',
        content: 'Thiên địa bất nhân, dĩ vạn vật vi sô cẩu...'
      }
    ],
    comments: []
  },
  {
    id: '3',
    uploaderId: 'user3',
    uploaderName: 'Khoa Huyễn Gia',
    title: 'Bí Mật Không Gian',
    author: 'Khoa Huyễn Gia',
    coverUrl: 'https://picsum.photos/300/450?random=3',
    description: 'Khi nhân loại tìm thấy cánh cổng dẫn đến chiều không gian thứ 4.',
    tags: ['Khoa học viễn tưởng', 'Trinh thám'],
    status: 'Ongoing',
    views: 8900,
    likes: 300,
    thanks: 10,
    chapters: [],
    comments: []
  }
];

export const SAMPLE_NEWS: NewsPost[] = [
    {
        id: 'n1',
        title: 'Bảo trì hệ thống ngày 25/10',
        content: 'Chúng tôi sẽ tiến hành bảo trì nâng cấp server vào lúc 00:00 ngày 25/10. Thời gian dự kiến: 2 tiếng.',
        type: 'announcement',
        author: 'Chủ Sở Hữu',
        timestamp: '1 ngày trước'
    },
    {
        id: 'n2',
        title: 'Tìm truyện main bá đạo, hậu cung',
        content: 'Chào các đạo hữu, mình cần tìm truyện thể loại main giấu nghề, sau này lập tông môn, có hậu cung đông đảo. Ai biết giới thiệu giúp!',
        type: 'find-story',
        author: 'Thành viên mới',
        timestamp: '3 giờ trước'
    }
];