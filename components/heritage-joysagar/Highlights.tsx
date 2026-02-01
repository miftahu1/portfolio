// components/Highlights.tsx
import { 
  Accessibility, 
  Coffee, 
  UtensilsCrossed, 
  Trees, 
  ShieldCheck, 
  Heart
} from 'lucide-react'

const highlights = [
  {
    icon: Accessibility,
    title: 'Fully Accessible',
    description: 'Wheelchair-friendly parking, entrance, seating, and restrooms'
  },
  {
    icon: Coffee,
    title: 'Premium Coffee & Tea',
    description: 'Artisanal coffee and wide selection of fine teas'
  },
  {
    icon: UtensilsCrossed,
    title: 'Diverse Menu',
    description: 'Vegetarian, vegan, organic dishes & all-you-can-eat options'
  },
  {
    icon: Trees,
    title: 'Lakeside Serenity',
    description: 'Peaceful outdoor seating with scenic lake views'
  },
  {
    icon: ShieldCheck,
    title: 'Safety First',
    description: 'Contactless delivery and hygienic dining protocols'
  },
  {
    icon: Heart,
    title: 'Inclusive Environment',
    description: 'Family, LGBTQ+, and pet-friendly (outdoor area)'
  }
]

export default function Highlights() {
  return (
    <section className="py-20 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl text-emerald-900 mb-4">
            The Heritage Jaysagar Experience
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Where every detail is crafted to provide a memorable dining experience 
            in the serene surroundings of Joysagar Lake.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <highlight.icon className="text-emerald-700" size={28} />
              </div>
              <h3 className="font-playfair text-2xl text-emerald-900 mb-3">
                {highlight.title}
              </h3>
              <p className="text-gray-600">{highlight.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">4.7★</div>
              <p className="text-emerald-200">Google Rating</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">6K+</div>
              <p className="text-emerald-200">Reviews</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">24/7</div>
              <p className="text-emerald-200">Free Parking Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}