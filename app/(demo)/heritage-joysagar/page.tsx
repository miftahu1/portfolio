import Header from '@/components/heritage-joysagar/Header'
import Hero from '@/components/heritage-joysagar/Hero'
import Highlights from '@/components/heritage-joysagar/Highlights'
import FeaturedMenu from '@/components/heritage-joysagar/FeaturedMenu'
import FeaturedFood from '@/components/heritage-joysagar/FeaturedFood'
import Gallery from '@/components/heritage-joysagar/Gallery'
import Testimonials from '@/components/heritage-joysagar/Testimonials'
import ReservationCTA from '@/components/heritage-joysagar/ReservationCTA'
import Footer from '@/components/heritage-joysagar/Footer'

export default function HeritageJoysagarPage() {
  return (
    <>
      <Header />
      <section id="home">
        <Hero />
      </section>
      <section id="highlights">
        <Highlights />
      </section>
      <section id="menu">
        <FeaturedMenu />
        <FeaturedFood />
      </section>
      <section id="gallery">
        <Gallery />
      </section>
      <section id="testimonials">
        <Testimonials />
      </section>
      <section id="reservations">
        <ReservationCTA />
      </section>
      <Footer />
    </>
  )
}