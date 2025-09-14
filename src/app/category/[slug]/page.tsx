import { CategoryPage } from '@/components/CategoryPage'
import { notFound } from 'next/navigation'

// Valid categories
const validCategories = ['rings', 'necklaces', 'earrings', 'bracelets', 'collections']

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  
  if (!validCategories.includes(slug)) {
    notFound()
  }

  return <CategoryPage category={slug} />
}

export async function generateStaticParams() {
  return validCategories.map((category) => ({
    slug: category,
  }))
}

// Generate metadata for each category
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  
  const categoryNames = {
    rings: 'Yüzükler',
    necklaces: 'Kolyeler', 
    earrings: 'Küpeler',
    bracelets: 'Bilezikler',
    collections: 'Koleksiyonlar'
  }

  const categoryName = categoryNames[slug as keyof typeof categoryNames]

  return {
    title: `${categoryName} | Jewelry Site`,
    description: `${categoryName} koleksiyonumuzdan en özel tasarımları keşfedin.`
  }
}