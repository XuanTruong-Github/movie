export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-card py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Movie App</h3>
            <p className="text-sm text-muted-foreground">
              Xem phim online chất lượng HD, Vietsub, Lồng tiếng miễn phí
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Danh mục</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/danh-sach/phim-le" className="hover:text-foreground transition">Phim lẻ</a></li>
              <li><a href="/danh-sach/phim-bo" className="hover:text-foreground transition">Phim bộ</a></li>
              <li><a href="/danh-sach/hoat-hinh" className="hover:text-foreground transition">Hoạt hình</a></li>
              <li><a href="/danh-sach/tv-shows" className="hover:text-foreground transition">TV Shows</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Liên hệ</h4>
            <p className="text-sm text-muted-foreground">
              Email: support@movieapp.local
            </p>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Movie App. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
