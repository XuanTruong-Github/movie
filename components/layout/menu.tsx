"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { MenuIcon } from "../ui/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { MenuItem } from "@/lib/types";

type Props = {
  categories: MenuItem[];
  countries: MenuItem[];
};
export default function Menu({ categories, countries }: Props) {
  return (
    <>
      <NavigationMenu className="max-lg:hidden lg:order-2">
        <NavigationMenuList>
          {categories.length ? (
            <NavigationMenuItem>
              <NavigationMenuTrigger>Thể loại</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-80 grid grid-cols-3">
                  {categories.map((item: MenuItem, index: number) => (
                    <NavigationMenuLink key={index} asChild>
                      <li>
                        <Link href={`/the-loai/${item.slug}`}>{item.name}</Link>
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
                  {countries.map((item: MenuItem, index: number) => (
                    <NavigationMenuLink key={index} asChild>
                      <li>
                        <Link href={`/quoc-gia/${item.slug}`}>{item.name}</Link>
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
      <Sheet>
        <SheetTrigger asChild>
          <Button variant={"outline"} className="lg:hidden order-3" size={"lg"}>
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent className="gap-0">
          <SheetHeader>
            <SheetTitle className="font-black text-2xl text-primary">
              TruongLX
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
                      {categories.map((item: MenuItem, index: number) => (
                        <Link
                          key={index}
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
              {countries.length ? (
                <AccordionItem value="quoc-gia">
                  <AccordionTrigger className="justify-start text-base py-0">
                    Quốc gia
                  </AccordionTrigger>
                  <AccordionContent className="w-full mt-4 pl-2 pb-0">
                    <div className="w-full grid grid-cols-2 gap-4">
                      {countries.map((item: MenuItem, index: number) => (
                        <Link
                          key={index}
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
    </>
  );
}
