import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSlider from "@/components/home/hero-slider";
import SectionMovies from "@/components/home/section-movies";
import SectionNew from "@/components/home/section-new";
import { getNewMovies } from "@/configs/api";

export default async function Home() {
  const data = await getNewMovies(1);
  const heroItems = data?.items?.slice(0, 6) ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Slider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <HeroSlider items={heroItems} />
        </div>

        {/* Sections */}
        <SectionNew className="py-12" />
        <SectionMovies type="phim-le" className="py-12 bg-card/50" />
        <SectionMovies type="phim-bo" className="py-12" />
        <SectionMovies type="hoat-hinh" className="py-12 bg-card/50" />
      </main>

      <Footer />
    </div>
  );
}
