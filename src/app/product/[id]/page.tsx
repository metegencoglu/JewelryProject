'use client'

import { ProductDetail } from '../../../components/ProductDetail'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <ProductDetail productId={params.id} />
    </div>
  )
}