import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import ProductCard from '../ui/ProductCard.jsx'
import 'swiper/css'
import 'swiper/css/navigation'

export default function ProductCarousel({ title, subtitle, products, viewAllTo = '/products' }) {
  const prevRef = useRef(null)
  const nextRef = useRef(null)

  if (!products?.length) return null

  return (
    <section className="container-page py-8 sm:py-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-ink-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Link to={viewAllTo} className="hidden sm:inline text-sm font-semibold text-primary-600 hover:text-primary-700 mr-1">
            View all →
          </Link>
          <button
            ref={prevRef}
            aria-label="Previous"
            className="h-9 w-9 rounded-full border border-ink-200 flex items-center justify-center text-ink-600 hover:bg-ink-100 disabled:opacity-30"
          >
            <HiChevronLeft />
          </button>
          <button
            ref={nextRef}
            aria-label="Next"
            className="h-9 w-9 rounded-full border border-ink-200 flex items-center justify-center text-ink-600 hover:bg-ink-100 disabled:opacity-30"
          >
            <HiChevronRight />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current
          swiper.params.navigation.nextEl = nextRef.current
        }}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        spaceBetween={16}
        slidesPerView={2.2}
        breakpoints={{
          480: { slidesPerView: 2.4 },
          640: { slidesPerView: 3.2 },
          1024: { slidesPerView: 4.2 },
          1280: { slidesPerView: 5 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="h-auto pb-1">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
