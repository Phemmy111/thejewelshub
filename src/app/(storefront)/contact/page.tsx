'use client'

import { useState } from 'react'
import { sendContactMessage } from '@/app/actions/contact'

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const formData = new FormData(e.currentTarget)
    
    const result = await sendContactMessage(formData)
    if (result.success) {
      setStatus('success')
      ;(e.target as HTMLFormElement).reset()
    } else {
      setStatus('error')
      setErrorMessage(result.error || 'Failed to send message.')
    }
  }

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
              <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-[rgba(13,13,13,0.05)]">
                {status === 'success' && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-md mb-4 text-sm font-medium">
                    Thank you! Your message has been sent successfully. We will get back to you shortly.
                  </div>
                )}
                {status === 'error' && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4 text-sm font-medium">
                    {errorMessage}
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#0D0D0D] mb-1">Name</label>
                  <input type="text" id="name" name="name" className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#B8882C] focus:border-[#B8882C]" required disabled={status === 'loading'} />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#0D0D0D] mb-1">Email</label>
                  <input type="email" id="email" name="email" className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#B8882C] focus:border-[#B8882C]" required disabled={status === 'loading'} />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-[#0D0D0D] mb-1">Message</label>
                  <textarea id="message" name="message" rows={4} className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#B8882C] focus:border-[#B8882C]" required disabled={status === 'loading'}></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full bg-[#0D0D0D] text-white font-bold py-3 rounded hover:bg-[#222] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
