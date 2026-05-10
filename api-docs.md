# KKPhim API Documentation

Nguồn tài liệu:
- https://kkphim.com/tai-lieu-api
- https://phimapi.com/

---

# Base URL

```bash
https://phimapi.com
```

---

# Tổng Quan

KKPhim cung cấp API phim miễn phí với dữ liệu:
- Danh sách phim
- Chi tiết phim
- Danh mục
- Quốc gia
- Thể loại
- Tập phim
- Streaming links
- Search phim
- Phim mới cập nhật

Response trả về dạng JSON.

---

# API Endpoints

## 1. Danh sách phim mới cập nhật

### Endpoint

```http
GET /danh-sach/phim-moi-cap-nhat
```

### Ví dụ

```bash
https://phimapi.com/danh-sach/phim-moi-cap-nhat
```

### Query Parameters

| Param | Type | Description |
|---|---|---|
| page | number | Trang hiện tại |

### Example

```bash
https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1
```

---

## 2. Danh sách phim theo loại

### Endpoint

```http
GET /v1/api/danh-sach/{type}
```

### Types

| Type | Description |
|---|---|
| phim-le | Phim lẻ |
| phim-bo | Phim bộ |
| tv-shows | TV Shows |
| hoat-hinh | Hoạt hình |
| phim-vietsub | Vietsub |
| phim-thuyet-minh | Thuyết minh |

### Example

```bash
https://phimapi.com/v1/api/danh-sach/phim-le?page=1
```

---

## 3. Chi tiết phim

### Endpoint

```http
GET /phim/{slug}
```

### Example

```bash
https://phimapi.com/phim/ten-phim
```

### Response Structure

```json
{
  "status": true,
  "msg": "success",
  "movie": {
    "name": "Tên phim",
    "slug": "ten-phim",
    "origin_name": "Original Name",
    "content": "...",
    "type": "series",
    "status": "completed",
    "poster_url": "...",
    "thumb_url": "...",
    "year": 2025,
    "time": "45 phút/tập",
    "episode_current": "Hoàn Tất",
    "episode_total": "24",
    "quality": "FHD",
    "lang": "Vietsub",
    "category": [],
    "country": []
  },
  "episodes": []
}
```

---

# Episodes Structure

```json
[
  {
    "server_name": "Vietsub #1",
    "server_data": [
      {
        "name": "1",
        "slug": "tap-1",
        "filename": "tap1.mp4",
        "link_embed": "...",
        "link_m3u8": "..."
      }
    ]
  }
]
```

---

# Streaming URLs

Có 2 dạng stream:

| Type | Description |
|---|---|
| link_embed | URL iframe embed |
| link_m3u8 | URL HLS stream |

---

# 4. Tìm kiếm phim

### Endpoint

```http
GET /v1/api/tim-kiem
```

### Query Parameters

| Param | Description |
|---|---|
| keyword | Từ khóa tìm kiếm |
| page | Trang |

### Example

```bash
https://phimapi.com/v1/api/tim-kiem?keyword=naruto&page=1
```

---

# 5. Danh sách thể loại

### Endpoint

```http
GET /the-loai
```

---

# 6. Phim theo thể loại

### Endpoint

```http
GET /v1/api/the-loai/{slug}
```

### Example

```bash
https://phimapi.com/v1/api/the-loai/hanh-dong?page=1
```

---

# 7. Danh sách quốc gia

### Endpoint

```http
GET /quoc-gia
```

---

# 8. Phim theo quốc gia

### Endpoint

```http
GET /v1/api/quoc-gia/{slug}
```

### Example

```bash
https://phimapi.com/v1/api/quoc-gia/han-quoc?page=1
```

---

# Pagination Response

```json
{
  "status": true,
  "items": [],
  "pagination": {
    "totalItems": 1000,
    "totalItemsPerPage": 24,
    "currentPage": 1,
    "totalPages": 42
  }
}
```

---

# Ví dụ Fetch API

```javascript
const res = await fetch(
  "https://phimapi.com/phim/ten-phim"
);

const data = await res.json();

console.log(data);
```

---

# Ví dụ Axios

```javascript
import axios from "axios";

const response = await axios.get(
  "https://phimapi.com/phim/ten-phim"
);

console.log(response.data);
```

---

# Example Player with HLS.js

```html
<video id="video" controls></video>

<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>

<script>
const video = document.getElementById("video");
const videoSrc = "https://example.com/playlist.m3u8";

if (Hls.isSupported()) {
  const hls = new Hls();
  hls.loadSource(videoSrc);
  hls.attachMedia(video);
}
</script>
```

---

# Notes

- API miễn phí
- Không cần API Key
- Response JSON UTF-8
- Hỗ trợ pagination
- Có thể thay đổi domain
- Một số nguồn video có thể timeout hoặc die

---

# Suggested Architecture

Frontend:
- Next.js
- Nuxt.js
- React
- Vue

Backend:
- Node.js
- NestJS
- Laravel

Player:
- HLS.js
- JWPlayer
- Video.js

---

# Common Workflow

1. Lấy danh sách phim
2. User click phim
3. Fetch chi tiết phim
4. Parse episodes
5. Play `link_m3u8`

---

# Disclaimer

Dữ liệu được tổng hợp từ Internet.
Cần tự kiểm tra bản quyền trước khi sử dụng thương mại.
