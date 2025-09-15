import { CategoryPage } from '@/components/CategoryPage'
import { notFound } from 'next/navigation'

const categories = {
  'yuzukler': 'Yüzükler',
  'kolyeler': 'Kolyeler',
  'kupeler': 'Küpeler',
  'bilezikler': 'Bilezikler',
  'alyanslar': 'Alyanslar',
  'altin-takilar': 'Altın Takılar',
  'gumus-takilar': 'Gümüş Takılar',
  'pirlanta-takilar': 'Pırlanta Takılar',
  'koleksiyonlar': 'Koleksiyonlar'
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params

  if (!Object.keys(categories).includes(slug)) {
    notFound()
  }

  return <CategoryPage category={slug} />
}

export function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const categoryName = categories[slug as keyof typeof categories] || 'Takılar'

  return {
    title: `${categoryName} | Jewelry Site`,
    description: `${categoryName} koleksiyonumuzdan en özel tasarımları keşfedin. Kaliteli ve şık ${categoryName.toLowerCase()} modelleri.`,
    keywords: `${categoryName}, takı, jewelry, ${slug}, mücevher`
  }
}
