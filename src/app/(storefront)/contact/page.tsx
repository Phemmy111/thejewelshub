'use client'

export default function ContactPage() {
  return (
    <div className="bg-[#F5F4F0] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <h1 className="font-display font-bold text-3xl md:text-5xl text-[#0D0D0D] mb-12">Contact Us</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 border border-[rgba(13,13,13,0.05)]">
          <div className="grid md:grid-cols-2 gap-12">
      <div>
        <h2 className="text-xl font-bold text-[#0D0D0D] mb-4">Get in Touch</h2>
        <p className="text-[#7A7069] mb-6">Have a question or need assistance? We're here to help.</p>
        <div className="space-y-4 text-[#7A7069]">
          <p><strong>Email:</strong> thejewelershub@gmail.com</p>
          <p><strong>WhatsApp:</strong> +234 913 311 5713</p>
          <p><strong>Hours:</strong> Mon - Fri, 9am - 6pm (WAT)</p>
        </div>
      </div>
      <div>
        <form className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-[rgba(13,13,13,0.05)]">
          <div>
            <label className="block text-sm font-semibold text-[#0D0D0D] mb-1">Name</label>
            <input type="text" className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#B8882C] focus:border-[#B8882C]" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0D0D0D] mb-1">Email</label>
            <input type="email" className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#B8882C] focus:border-[#B8882C]" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0D0D0D] mb-1">Message</label>
            <textarea rows={4} className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#B8882C] focus:border-[#B8882C]" required></textarea>
          </div>
          <button type="button" onClick={() => alert("Form submitted! We will get back to you shortly.")} className="w-full bg-[#0D0D0D] text-white font-bold py-3 rounded hover:bg-[#222] transition-colors">Send Message</button>
        </form>
      </div>
    </div>
        </div>
      </div>
    </div>
  )
}
