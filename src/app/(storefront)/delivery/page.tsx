'use client'

export default function DeliveryPage() {
  return (
    <div className="bg-[#F5F4F0] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <h1 className="font-display font-bold text-3xl md:text-5xl text-[#0D0D0D] mb-12">Delivery & Returns</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 border border-[rgba(13,13,13,0.05)]">
          <div className="prose prose-lg max-w-none text-[#7A7069]">
      <p>At The Jeweller's Hub, we strive to deliver your pieces as quickly and securely as possible.</p>
      <h2 className="text-xl font-bold text-[#0D0D0D] mt-8 mb-4">Delivery Options</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Standard Delivery:</strong> 3-5 business days within Nigeria.</li>
        <li><strong>Express Delivery:</strong> 1-2 business days (available in select locations).</li>
      </ul>
      <h2 className="text-xl font-bold text-[#0D0D0D] mt-8 mb-4">Returns & Exchanges</h2>
      <p>If you are not completely satisfied with your purchase, you may return it within 7 days of delivery for a full refund or exchange. Items must be unworn, in their original packaging, and accompanied by the receipt.</p>
      <p className="mt-4">Please note that custom or engraved pieces are final sale and cannot be returned.</p>
    </div>
        </div>
      </div>
    </div>
  )
}
