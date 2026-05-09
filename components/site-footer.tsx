import Link from "next/link";

const footerLinks = {
  categories: {
    title: "Thể loại",
    links: [
      { label: "Phim lẻ", href: "/danh-sach/phim-le" },
      { label: "Phim bộ", href: "/danh-sach/phim-bo" },
      { label: "Hoạt hình", href: "/danh-sach/hoat-hinh" },
      { label: "TV Shows", href: "/danh-sach/tv-shows" },
    ],
  },
  browse: {
    title: "Khám phá",
    links: [
      { label: "Phim mới cập nhật", href: "/danh-sach/phim-moi-cap-nhat" },
      { label: "Phim lẻ nổi bật", href: "/danh-sach/phim-le" },
      { label: "Phim bộ mới", href: "/danh-sach/phim-bo" },
      { label: "Tìm kiếm", href: "/tim-kiem" },
    ],
  },
};

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-8 px-3">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      target={
                        link.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        link.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border bg-background py-4 px-3">
        <div className="container text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 TruongLX-Movie. Powered by
          </p>
        </div>
      </div>
    </footer>
  );
}
