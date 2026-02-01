'use client'

import { useState } from 'react'
import { Calendar, Users, Clock, MessageCircle } from 'lucide-react'

export default function ReservationCTA() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create WhatsApp message
    const whatsappMessage = `*New Reservation Request*%0A%0A` +
      `*Name:* ${formData.name}%0A` +
      `*Phone:* ${formData.phone}%0A` +
      `*Date:* ${formData.date}%0A` +
      `*Time:* ${formData.time}%0A` +
      `*Guests:* ${formData.guests}%0A` +
      `*Special Request:* ${formData.message}%0A%0A` +
      `_Sent via Heritage Jaysagar Website_`
    
    // Open WhatsApp
    window.open(`https://wa.me/919864020240?text=${whatsappMessage}`, '_blank')
    
    // Reset form
    setFormData({
      name: '',
      phone: '',
      date: '',
      time: '',
      guests: '2',
      message: ''
    })
    
    alert('Opening WhatsApp to confirm your reservation!')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="reservations" className="py-20 bg-gradient-to-br from-emerald-900 to-emerald-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl md:text-5xl text-white mb-4">
              Reserve Your Table
            </h2>
            <p className="text-emerald-200 text-lg">
              Experience lakeside dining at its finest. Reservations are recommended, 
              especially for weekend brunches and dinners.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Calendar className="text-emerald-700" size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-emerald-900">Choose Date</h4>
                  <p className="text-sm text-gray-600">Plan ahead for weekends</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Users className="text-emerald-700" size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-emerald-900">Guests</h4>
                  <p className="text-sm text-gray-600">Up to 20 in private dining</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Clock className="text-emerald-700" size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-emerald-900">Timing</h4>
                  <p className="text-sm text-gray-600">8AM - 11PM daily</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="WhatsApp Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-400"
                />
                <select 
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-400"
                >
                  <option value="">Select Time</option>
                  <option value="08:00">08:00 AM</option>
                  <option value="10:00">10:00 AM (Brunch)</option>
                  <option value="12:00">12:00 PM (Lunch)</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="18:00">06:00 PM (Dinner)</option>
                  <option value="20:00">08:00 PM</option>
                  <option value="22:00">10:00 PM</option>
                </select>
                <select 
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-400"
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4 People</option>
                  <option value="5">5-6 People</option>
                  <option value="7">7-10 People</option>
                  <option value="11">10+ People</option>
                </select>
              </div>
              
              <textarea
                name="message"
                placeholder="Special requests (birthday, anniversary, dietary restrictions, etc.)"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-6 py-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              ></textarea>
              
              <button 
                type="submit"
                className="w-full bg-emerald-700 text-white py-4 rounded-xl font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="mr-2" size={20} />
                Confirm via WhatsApp
              </button>
              
              <p className="text-center text-gray-600 text-sm">
                Or call us directly at{' '}
                <a href="tel:+919864020240" className="text-emerald-700 font-medium">
                  +91 98640 20240
                </a>
              </p>
            </form>
          </div>

          <div className="mt-12 text-center">
            <h4 className="font-playfair text-2xl text-white mb-6">Other Ways to Enjoy</h4>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://www.swiggy.com/city/sivasagar/heritage-jaysagar-joysagar-sivasagar-rest248458"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-emerald-900 px-6 py-3 rounded-full font-medium hover:bg-amber-50 transition-colors"
              >
                Order via Swiggy
              </a>
              <a
                href="#contact"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                Catering Services
              </a>
              <a
                href="https://wa.me/919864020240"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-colors flex items-center"
              >
                <span className="mr-2">💬</span>
                Quick WhatsApp Order
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}