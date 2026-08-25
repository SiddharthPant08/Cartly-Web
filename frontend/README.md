# Cartly

A premium, fully responsive e-commerce frontend built with React, Vite, Tailwind CSS, React Router, Axios, React Icons, React Hot Toast, Framer Motion, and Swiper.

## Setup

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

## Build status — Stage 1 complete

- ✅ Project scaffold (Vite + Tailwind + design tokens)
- ✅ Global providers: Cart, Wishlist, Auth (all localStorage-backed dummy state)
- ✅ Layout: Navbar (search, categories, account menu, mobile drawer), animated Deal Ticker, Footer
- ✅ Home page: Hero carousel, category grid, product carousels, Deal of the Day countdown, trust stats, promo banner
- ✅ Reusable UI: Button, Badge, Rating, ProductCard, ProductCardSkeleton

### Coming in the next stages
- Products listing page with filters/sort + skeleton loading state
- Product details page (gallery, variants, related products)
- Cart, Wishlist pages
- Login, Register, Profile, Orders
- Checkout + Success flow
- 404 and info pages (About, Contact, FAQ)

Routes for pages not yet built are linked from the nav but not yet registered in `App.jsx` — they'll be wired up as each page is added.
