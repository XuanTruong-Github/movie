import Link from "next/link";
import { getCategories, getCountries } from "@/configs/api";
import HeaderShell from "./header-shell";

export default async function Header() {
  const [categories, countries] = await Promise.all([
    getCategories(),
    getCountries(),
  ]);

  return (
    <HeaderShell categories={categories} countries={countries} />
  );
}
