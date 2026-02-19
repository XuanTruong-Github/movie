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
import { Input } from "../ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Search } from "lucide-react";
import Image from "next/image";

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
          </NavigationMenuList>
        </NavigationMenu>
        <form action="/search" className="ml-auto flex-1 max-w-sm">
          <InputGroup className="">
            <InputGroupInput placeholder="Tìm kiếm..." name="q" />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </form>
      </section>
    </header>
  );
}
