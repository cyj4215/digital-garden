import SearchClient from "@/components/SearchClient";

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <SearchClient locale={locale} />;
}
