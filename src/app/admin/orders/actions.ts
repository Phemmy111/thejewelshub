'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: string, status: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
      }
    }
  )

  // Fetch the order to get customer email and name
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('customer_name, customer_email, paystack_reference')
    .eq('id', orderId)
    .single()

  if (fetchError) return { success: false, error: 'Order not found' }

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) {
    return { success: false, error: error.message }
  }

  // Send email notification
  try {
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'thejewelershub@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || ''
      }
    })

    const statusMessages: Record<string, string> = {
      'processing': 'Your order is currently being processed and prepared for shipment.',
      'shipped': 'Great news! Your order has shipped and is on its way to you.',
      'delivered': 'Your order has been delivered! We hope you love your new pieces.',
      'cancelled': 'Your order has been cancelled.'
    }

    const message = statusMessages[status] || `Your order status has been updated to: ${status}.`

    const html = `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fff;color:#0D0D0D;border:1px solid #E8E5DF;">
        <div style="background:#0D0D0D;padding:32px 40px;text-align:center">
          <h1 style="color:#B8882C;font-size:22px;margin:0;letter-spacing:0.06em">The Jeweller's Hub</h1>
        </div>
        <div style="padding:40px">
          <h2 style="font-size:20px;font-weight:700;margin:0 0 16px">Order Update</h2>
          <p style="color:#7A7069;margin:0 0 16px;font-size:16px;">Hi ${order.customer_name},</p>
          <p style="color:#0D0D0D;margin:0 0 24px;font-size:16px;font-weight:bold;">${message}</p>
          <div style="background:#F5F4F0;border-radius:6px;padding:16px 20px;margin-bottom:24px">
            <p style="margin:0;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#B8882C;font-weight:600">Order Reference</p>
            <p style="margin:4px 0 0;font-family:monospace;font-size:14px;color:#0D0D0D">${order.paystack_reference}</p>
          </div>
          <p style="margin:32px 0 0;font-size:13px;color:#7A7069">For any enquiries, reply to this email or WhatsApp us at +234 913 311 5713.</p>
        </div>
      </div>
    `

    await transporter.sendMail({
      from: '"The Jeweller\'s Hub" <thejewelershub@gmail.com>',
      to: order.customer_email,
      subject: `Order Update (${status.toUpperCase()}) — The Jeweller's Hub`,
      html,
    })
  } catch (err) {
    console.error('Failed to send status update email:', err)
  }

  revalidatePath('/admin/orders')
  return { success: true }
}
