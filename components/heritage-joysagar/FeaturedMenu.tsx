// components/FeaturedMenu.tsx
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const featuredItems = [
  {
    category: 'Signature Dishes',
    items: [
      { name: 'Chicken Biryani', description: 'Aromatic basmati rice with tender chicken and spices', price: '₹450' },
      { name: 'Paneer Butter Masala', description: 'Cottage cheese in rich tomato-cream gravy', price: '₹380' },
      { name: 'Dal Makhani', description: 'Slow-cooked black lentils with butter and cream', price: '₹320' },
    ]
  },
  {
    category: 'Heritage Specials',
    items: [
      { name: 'Kasturi Paneer', description: 'Paneer infused with special herbs and spices', price: '₹420' },
      { name: 'Nizami Paneer', description: 'Royal Mughlai style paneer preparation', price: '₹410' },
      { name: 'Panchratna Dal', description: 'Five-lentil delicacy with traditional spices', price: '₹350' },
    ]
  },
  {
    category: 'Lakeside Favorites',
    items: [
      { name: 'Honey Chilli Paneer Dry', description: 'Crispy paneer with sweet-spicy glaze', price: '₹360' },
      { name: 'Chicken Momos', description: 'Steamed dumplings with chicken filling', price: '₹280' },
      { name: 'Veg Pakora', description: 'Seasonal vegetables in chickpea batter', price: '₹220' },
    ]
  }
]

export default function FeaturedMenu() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div>
            <h2 className="font-playfair text-4xl md:text-5xl text-emerald-900 mb-4">
              Our Culinary Heritage
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Each dish tells a story of tradition, crafted with locally sourced ingredients 
              and served with the warmth of Assamese hospitality.
            </p>
          </div>
          <Link
            href="/menu"
            className="group flex items-center text-emerald-700 font-medium mt-6 md:mt-0"
          >
            View Full Menu
            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {featuredItems.map((section, index) => (
            <div key={index} className="bg-amber-50 rounded-2xl p-6">
              <h3 className="font-playfair text-2xl text-emerald-800 mb-6 pb-4 border-b border-amber-200">
                {section.category}
              </h3>
              <div className="space-y-6">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="group hover:bg-white p-4 rounded-xl transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-emerald-900 group-hover:text-emerald-700">
                        {item.name}
                      </h4>
                      <span className="font-playfair text-lg text-amber-600">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-playfair text-3xl text-emerald-900 mb-6">
              Dining Experiences
            </h3>
            <div className="space-y-4">
              {[
                'Private Dining Rooms for intimate gatherings',
                'Lakeside Terrace with sunset views',
                'Family-friendly environment with kids menu',
                'Romantic evenings with candlelight dining',
                'Business lunches in our quiet zones',
                'Weekend brunch with live music'
              ].map((experience, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                  <span>{experience}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden">
            <Image
              src="/heritage-joysagar/ambience/dining-ambience.jpg"
              alt="Elegant dining ambience at Heritage Jaysagar"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}