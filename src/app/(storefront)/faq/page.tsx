'use client'

export default function FaqPage() {
  return (
    <div className="bg-[#F5F4F0] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <h1 className="font-display font-bold text-3xl md:text-5xl text-[#0D0D0D] mb-12">Frequently Asked Questions</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 border border-[rgba(13,13,13,0.05)]">
          <div className="space-y-6">
      {[
        { q: "How do I care for my jewellery?", a: "Keep your pieces away from harsh chemicals, perfumes, and excessive moisture. Store them in the provided pouch or box when not in use." },
        { q: "Do you offer international shipping?", a: "Currently, we only ship within Nigeria. We are working on expanding our delivery network soon." },
        { q: "Can I cancel my order?", a: "Orders can be cancelled within 2 hours of placement. After that, they enter processing and cannot be cancelled." },
        { q: "Are your diamonds ethically sourced?", a: "Yes, all our stones and materials are ethically sourced from certified suppliers." }
      ].map((faq, i) => (
        <div key={i} className="border-b border-[rgba(13,13,13,0.1)] pb-4">
          <h3 className="font-bold text-lg text-[#0D0D0D] mb-2">{faq.q}</h3>
          <p className="text-[#7A7069]">{faq.a}</p>
        </div>
      ))}
    </div>
        </div>
      </div>
    </div>
  )
}
