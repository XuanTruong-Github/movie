# OPhim18 API Documentation

## Base URL

```txt
https://ophim1.com
```

---

# 1. Lấy danh sách phim mới cập nhật

## Endpoint

```http
GET /danh-sach/phim-moi-cap-nhat?page={page}
```

## Example

```bash
curl "https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=1"
```

## Response

```json
{
  "status": true,
  "items": [
    {
      "_id": "string",
      "name": "Movie Name",
      "slug": "movie-slug",
      "origin_name": "Original Name",
      "thumb_url": "thumb.jpg",
      "poster_url": "poster.jpg",
      "year": 2025
    }
  ],
  "pagination": {
    "totalItems": 1000,
    "totalItemsPerPage": 24,
    "currentPage": 1,
    "totalPages": 42
  }
}
```

---

# 2. Lấy chi tiết phim theo slug

## Endpoint

```http
GET /phim/{slug}
```

## Example

```bash
curl "https://ophim1.com/phim/ten-phim"
```

## Response

```json
{
  "status": true,
  "movie": {
    "_id": "id",
    "name": "Movie Name",
    "slug": "movie-slug",
    "origin_name": "Original Name",
    "content": "Movie description",
    "type": "series",
    "status": "completed",
    "thumb_url": "thumb.jpg",
    "poster_url": "poster.jpg",
    "year": 2025,
    "time": "24 phút/tập",
    "episode_current": "Tập 12",
    "episode_total": "12 tập",
    "quality": "FHD",
    "lang": "Vietsub",
    "category": [],
    "country": [],
    "actor": [],
    "director": []
  },
  "episodes": [
    {
      "server_name": "Vietsub",
      "server_data": [
        {
          "name": "1",
          "slug": "tap-1",
          "filename": "tap1.mp4",
          "link_embed": "https://...",
          "link_m3u8": "https://..."
        }
      ]
    }
  ]
}
```

---

# 3. Lấy danh sách phim theo thể loại

## Endpoint

```http
GET /v1/api/the-loai/{slug}?page={page}
```

## Example

```bash
curl "https://ophim1.com/v1/api/the-loai/hanh-dong?page=1"
```

---

# 4. Lấy danh sách phim theo quốc gia

## Endpoint

```http
GET /v1/api/quoc-gia/{slug}?page={page}
```

## Example

```bash
curl "https://ophim1.com/v1/api/quoc-gia/han-quoc?page=1"
```

---

# 5. Tìm kiếm phim

## Endpoint

```http
GET /v1/api/tim-kiem?keyword={keyword}&page={page}
```

## Example

```bash
curl "https://ophim1.com/v1/api/tim-kiem?keyword=naruto&page=1"
```

---

# 6. Danh sách phim theo năm

## Endpoint

```http
GET /v1/api/nam/{year}?page={page}
```

## Example

```bash
curl "https://ophim1.com/v1/api/nam/2025?page=1"
```

---

# 7. Danh sách phim bộ

## Endpoint

```http
GET /v1/api/danh-sach/phim-bo?page={page}
```

---

# 8. Danh sách phim lẻ

## Endpoint

```http
GET /v1/api/danh-sach/phim-le?page={page}
```

---

# 9. Danh sách TV Shows

## Endpoint

```http
GET /v1/api/danh-sach/tv-shows?page={page}
```

---

# 10. Danh sách hoạt hình

## Endpoint

```http
GET /v1/api/danh-sach/hoat-hinh?page={page}
```

---

# 11. Danh sách phim sắp chiếu

## Endpoint

```http
GET /v1/api/danh-sach/phim-sap-chieu?page={page}
```

---

# 12. Danh sách categories

## Endpoint

```http
GET /the-loai
```

## Response

```json
[
  {
    "name": "Hành Động",
    "slug": "hanh-dong"
  }
]
```

---

# 13. Danh sách quốc gia

## Endpoint

```http
GET /quoc-gia
```

---

# 14. Cấu trúc image URL

## Thumbnail

```txt
https://img.ophim.live/uploads/movies/{thumb_url}
```

## Poster

```txt
https://img.ophim.live/uploads/movies/{poster_url}
```

---

# 15. Notes

* API không yêu cầu API key
* Public API
* Có phân trang
* Dữ liệu trả về dạng JSON
* Có hỗ trợ link embed + m3u8
* Một số phim có thể thiếu `link_m3u8`
* Nên cache dữ liệu phía server để tránh phụ thuộc nguồn

---

# 16. Example Fetch JavaScript

```javascript
async function getMovie(slug) {
  const response = await fetch(
    `https://ophim1.com/phim/${slug}`
  );

  return await response.json();
}

getMovie("naruto").then(console.log);
```

---

# 17. Example NextJS API Wrapper

```javascript
export async function fetchMovie(slug) {
  const res = await fetch(
    `https://ophim1.com/phim/${slug}`,
    {
      next: { revalidate: 3600 }
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return res.json();
}
```

---

# 18. Recommended Architecture

```txt
Frontend
   ↓
Your Backend Cache Layer
   ↓
OPhim18 API
```

Không nên gọi trực tiếp từ frontend production để tránh:

* Rate limit
* API downtime
* CORS issues
* Dependency risk

---

# 19. Suggested TypeScript Interfaces

```typescript
export interface MovieItem {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  year: number;
}

export interface Episode {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}
```

---

# 20. Suggested Features

* Search movie
* Watch online
* Episode navigation
* Infinite scroll
* Genre filtering
* Country filtering
* SEO movie detail pages
* Streaming with HLS player

---

# References

* https://ophim1.com/api-document
* https://forum.ophim.cc/

```
```
