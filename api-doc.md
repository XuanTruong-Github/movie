# KKPhim API Documentation (Unofficial Structured)

Base URL:
https://phimapi.com

---

## 1. Lấy danh sách phim mới cập nhật

GET /danh-sach/phim-moi-cap-nhat?page={page}

### Query params:
- page (number): trang (default = 1)

### Response:
{
  "status": true,
  "items": [
    {
      "name": "Tên phim",
      "slug": "ten-phim",
      "origin_name": "Tên gốc",
      "thumb_url": "url",
      "poster_url": "url",
      "year": 2024
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 100
  }
}

---

## 2. Lấy danh sách phim theo loại

GET /v1/api/danh-sach/{type}?page={page}

### type:
- phim-le
- phim-bo
- hoat-hinh
- tv-shows

---

## 3. Lấy chi tiết phim

GET /phim/{slug}

### Example:
GET /phim/avengers-endgame

### Response:
{
  "status": true,
  "movie": {
    "name": "...",
    "origin_name": "...",
    "content": "...",
    "type": "phim-le",
    "status": "completed",
    "year": 2024,
    "time": "120 phút",
    "episode_total": 1,
    "quality": "HD",
    "lang": "Vietsub",
    "actor": [],
    "director": [],
    "category": [],
    "country": []
  },
  "episodes": [
    {
      "server_name": "Server 1",
      "server_data": [
        {
          "name": "Full",
          "slug": "full",
          "link_embed": "url",
          "link_m3u8": "url"
        }
      ]
    }
  ]
}

---

## 4. Tìm kiếm phim

GET /v1/api/tim-kiem?keyword={keyword}&page={page}

---

## 5. Lấy phim theo quốc gia

GET /v1/api/quoc-gia/{country}?page={page}

---

## 6. Lấy phim theo thể loại

GET /v1/api/the-loai/{category}?page={page}

---

## 7. Lấy danh sách thể loại

GET /the-loai

---

## 8. Lấy danh sách quốc gia

GET /quoc-gia

---

## Ghi chú

- Tất cả API trả về JSON
- Không cần API key
- Dữ liệu được tổng hợp từ nhiều nguồn Internet
- Không host video trực tiếp (chỉ embed/m3u8)

---

## Use cases

- Build web phim
- App mobile xem phim
- Crawling metadata phim

---

## Warning

- Nội dung không thuộc quyền sở hữu KKPhim
- Cần kiểm tra bản quyền trước khi sử dụng production