import { api } from "@/configs/api";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import Link from "next/link";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Menu, Search } from "@/components/ui/icons";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion,
} from "../ui/accordion";

async function getMenu(type: string) {
  try {
    const response = await api(type);
    if (!response.ok) throw new Error(response.statusText);
    const { data } = await response.json();
    return data?.items || [];
  } catch (error) {
    console.log("error: ", error);
    return [];
  }
}
export default async function Header() {
  const categories = await getMenu("/the-loai");
  const countries = await getMenu("/quoc-gia");
  return (
    <header className="shadow">
      <section className="flex items-center py-4 gap-x-4 container">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Movie"
            width={40}
            height={40}
            loading="eager"
          />
        </Link>
        <NavigationMenu className="max-md:hidden">
          <NavigationMenuList>
            {categories.length ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger>Thể loại</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-80 grid grid-cols-3">
                    {categories.map((item: any) => (
                      <NavigationMenuLink key={item._id} asChild>
                        <li>
                          <Link href={`/the-loai/${item.slug}`}>
                            {item.name}
                          </Link>
                        </li>
                      </NavigationMenuLink>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : null}
            {countries.length ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger>Quốc gia</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-96 grid grid-cols-3">
                    {countries.map((item: any) => (
                      <NavigationMenuLink key={item._id} asChild>
                        <li>
                          <Link href={`/quoc-gia/${item.slug}`}>
                            {item.name}
                          </Link>
                        </li>
                      </NavigationMenuLink>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : null}

            <NavigationMenuItem className="px-2">
              <NavigationMenuLink
                href="/danh-sach/phim-lẻ"
                className="text-nowrap"
              >
                Phim lẻ
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="px-2">
              <NavigationMenuLink
                href="/danh-sach/phim-bo"
                className="text-nowrap"
              >
                Phim bộ
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="px-2">
              <NavigationMenuLink
                href="/danh-sach/phim-chieu-rap"
                className="text-nowrap"
              >
                Phim chiếu rạp
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <form action="/search" className="ml-auto flex-1 max-w-sm">
          <InputGroup className="h-10">
            <InputGroupInput placeholder="Tìm kiếm..." name="q" />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </form>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"outline"} className="md:hidden" size={"lg"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                <Image
                  src="/logo.png"
                  alt="Movie"
                  width={48}
                  height={48}
                  loading="eager"
                />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col items-start gap-5 px-4 pb-6 max-h-screen overflow-y-scroll">
              <Accordion type="single" collapsible className="w-full space-y-5">
                {categories.length ? (
                  <AccordionItem value="the-loai">
                    <AccordionTrigger className="justify-start text-base py-0">
                      Thể loại
                    </AccordionTrigger>
                    <AccordionContent className="w-full mt-4 pl-2 pb-0">
                      <div className="w-full grid grid-cols-2 gap-4">
                        {categories.map((item: any) => (
                          <Link
                            key={item._id}
                            href={`/the-loai/${item.slug}`}
                            className="text-foreground/70 hover:text-primary"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ) : null}
                {categories.length ? (
                  <AccordionItem value="quoc-gia">
                    <AccordionTrigger className="justify-start text-base py-0">
                      Quốc gia
                    </AccordionTrigger>
                    <AccordionContent className="w-full mt-4 pl-2 pb-0">
                      <div className="w-full grid grid-cols-2 gap-4">
                        {countries.map((item: any) => (
                          <Link
                            key={item._id}
                            href={`/quoc-gia/${item.slug}`}
                            className="text-foreground/70 hover:text-primary"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ) : null}
              </Accordion>
              <Link
                href="/danh-sach/phim-chieu-rap"
                className="hover:text-primary"
              >
                Phim chiếu rạp
              </Link>
              <Link href="/danh-sach/phim-le" className="hover:text-primary">
                Phim lẻ
              </Link>
              <Link href="/danh-sach/phim-bo" className="hover:text-primary">
                Phim bộ
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </section>
    </header>
  );
}
