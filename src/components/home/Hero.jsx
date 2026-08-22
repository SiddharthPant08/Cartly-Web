import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import 'swiper/css'
import 'swiper/css/pagination'

const slides = [
  {
    id: 1,
    eyebrow: 'New season',
    title: 'Upgrade your everyday tech',
    subtitle: 'Up to 40% off on headphones, smartwatches & more',
    cta: 'Shop electronics',
    to: '/products?category=electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
    bg: 'from-primary-700 to-primary-950',
  },
  {
    id: 2,
    eyebrow: 'Wardrobe refresh',
    title: 'Fashion that fits your story',
    subtitle: 'New arrivals across men, women & accessories',
    cta: 'Explore fashion',
    to: '/products?category=fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80',
    bg: 'from-accent-600 to-accent-900',
  },
  {
    id: 3,
    eyebrow: 'Home refresh',
    title: 'Make your space feel like home',
    subtitle: 'Cookware, decor & essentials for every room',
    cta: 'Shop home & living',
    to: '/products?category=home-living',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
    bg: 'from-primary-900 to-ink-900',
  },
]

export default function Hero() {
  return (
    <section className="container-page pt-6">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="rounded-3xl overflow-hidden shadow-soft [&_.swiper-pagination-bullet-active]:bg-accent-500"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={`relative bg-gradient-to-br ${slide.bg} min-h-[320px] sm:min-h-[400px] flex items-center overflow-hidden`}>
              <img
                src={slide.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-overlay"
              />
              <div className="relative z-10 px-6 sm:px-14 py-10 max-w-xl">
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white mb-4"
                >
                  {slide.eyebrow}
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white text-balance leading-tight"
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-4 text-white/85 text-sm sm:text-base"
                >
                  {slide.subtitle}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Link
                    to={slide.to}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600 transition-colors"
                  >
                    {slide.cta}
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
