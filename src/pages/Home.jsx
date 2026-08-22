import { useEffect, useState } from 'react'
import Hero from '../components/home/Hero.jsx'
import CategoryGrid from '../components/home/CategoryGrid.jsx'
import ProductCarousel from '../components/home/ProductCarousel.jsx'
import DealOfTheDay from '../components/home/DealOfTheDay.jsx'
import TrustStrip from '../components/home/TrustStrip.jsx'
import Newsletter from '../components/home/Newsletter.jsx'
import ProductCardSkeleton from '../components/ui/ProductCardSkeleton.jsx'
import { fetchProducts, fetchProductById, fetchProductsByTag } from '../api/productsApi'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [bestsellers, setBestsellers] = useState([])
  const [deals, setDeals] = useState([])
  const [dealOfDay, setDealOfDay] = useState(null)
  const [recommended, setRecommended] = useState([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const [bestsellerList, dealList, dealPick, allProducts] = await Promise.all([
        fetchProductsByTag('bestseller'),
        fetchProductsByTag('deal'),
        fetchProductById('p2'),
        fetchProducts(),
      ])
      if (cancelled) return
      setBestsellers(bestsellerList)
      setDeals(dealList)
      setDealOfDay(dealPick)
      setRecommended([...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 10))
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <Hero />
      <CategoryGrid />

      {loading ? (
        <div className="container-page py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <ProductCarousel title="Bestsellers" subtitle="Loved by thousands of Cartly shoppers" products={bestsellers} />
          <DealOfTheDay product={dealOfDay} />
          <ProductCarousel
            title="Today's deals"
            subtitle="Limited-time price drops"
            products={deals}
            viewAllTo="/products?deal=true"
          />
          <TrustStrip />
          <ProductCarousel title="Recommended for you" subtitle="Top-rated picks across categories" products={recommended} />
        </>
      )}

      <Newsletter />
    </div>
  )
}
