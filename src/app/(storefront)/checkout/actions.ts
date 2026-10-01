'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { formatPrice } from '@/lib/utils'

// ─── Supabase (service role for trusted writes) ───────────────────────────────
async function createServiceClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch { }
        },
      },
    },
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface OrderItem {
  productId: string
  name: string
  priceKobo: number
  quantity: number
  image?: string
  size?: string
  color?: string
}

export interface CheckoutPayload {
  reference: string
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string
  items: OrderItem[]
  totalKobo: number
}

// ─── Verify Paystack payment then save order + send emails ───────────────────
export async function verifyAndSaveOrder(payload: CheckoutPayload): Promise<{
  success: boolean
  orderId?: string
  error?: string
}> {
  try {
    // 1. Verify with Paystack
    const paystackRes = await fetch(
      'https://api.paystack.co/transaction/verify/' + payload.reference,
      {
        headers: {
          Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      },
    )

    const paystackData = await paystackRes.json()

    if (!paystackData.status || paystackData.data?.status !== 'success') {
      return { success: false, error: 'Payment verification failed: ' + (paystackData.message || 'Unknown error') }
    }

    const paidAmountKobo = paystackData.data.amount // Paystack returns in kobo
    if (paidAmountKobo < payload.totalKobo) {
      return { success: false, error: 'Paid amount does not match order total.' }
    }

    // 2. Save order to Supabase
    const supabase = await createServiceClient()
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert({
        paystack_reference: payload.reference,
        customer_name: payload.customerName,
        customer_email: payload.customerEmail,
        customer_phone: payload.customerPhone,
        delivery_address: payload.deliveryAddress,
        items: payload.items,
        total_kobo: payload.totalKobo,
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (dbError) throw new Error('DB error: ' + dbError.message)

    // 3. Send emails (non-blocking — don't fail order if email fails)
    await sendOrderEmails(payload, order.id).catch(err =>
      console.error('Email send failed (non-fatal):', err),
    )

    return { success: true, orderId: order.id }
  } catch (err: any) {
    console.error('verifyAndSaveOrder error:', err)
    return { success: false, error: err.message || 'Unexpected error' }
  }
}

// ─── Email sender ─────────────────────────────────────────────────────────────
async function sendOrderEmails(payload: CheckoutPayload, orderId: string) {
  const nodemailer = await import('nodemailer')
  const adminEmails = ['olaniyisuccessoluwatobi@gmail.com', 'femiadeleke2020@gmail.com']

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thejewelershub@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || ''
    }
  })

  const itemRows = payload.items
    .map(item => {
      const variants: string[] = []
      if (item.size) variants.push('Size: ' + item.size)
      if (item.color) variants.push('Colour: ' + item.color)
      const variantStr = variants.length > 0 ? ' (' + variants.join(', ') + ')' : ''
      return (
        '<tr style="border-bottom:1px solid #E8E5DF">' +
        '<td style="padding:12px 8px;font-size:14px;color:#0D0D0D">' + item.name + variantStr + '</td>' +
        '<td style="padding:12px 8px;text-align:center;font-size:14px;color:#7A7069">' + item.quantity + '</td>' +
        '<td style="padding:12px 8px;text-align:right;font-size:14px;font-weight:600;color:#0D0D0D">' + formatPrice(item.priceKobo * item.quantity) + '</td>' +
        '</tr>'
      )
    })
    .join('')

  const totalLine = '<tr><td colspan="2" style="padding:16px 8px;font-weight:700;font-size:15px">Total</td><td style="padding:16px 8px;text-align:right;font-weight:700;font-size:15px;color:#B8882C">' + formatPrice(payload.totalKobo) + '</td></tr>'

  const tableHtml =
    '<table style="width:100%;border-collapse:collapse;margin:16px 0">' +
    '<thead><tr style="background:#F5F4F0"><th style="padding:10px 8px;text-align:left;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#7A7069">Item</th><th style="padding:10px 8px;text-align:center;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#7A7069">Qty</th><th style="padding:10px 8px;text-align:right;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#7A7069">Price</th></tr></thead>' +
    '<tbody>' + itemRows + '</tbody>' +
    '<tfoot>' + totalLine + '</tfoot>' +
    '</table>'

  const baseStyle = 'font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fff;color:#0D0D0D'
  const headerHtml = '<div style="background:#0D0D0D;padding:32px 40px;text-align:center"><h1 style="font-family:Georgia,serif;color:#B8882C;font-size:22px;margin:0;letter-spacing:0.06em">The Jeweller\'s Hub</h1></div>'
  const footerHtml = '<div style="background:#F5F4F0;padding:24px 40px;text-align:center;font-size:12px;color:#7A7069;margin-top:40px"><p style="margin:0">The Jeweller\'s Hub · Lagos, Nigeria</p><p style="margin:6px 0 0">Questions? WhatsApp: +234 913 311 5713</p></div>'

  // ── Customer confirmation ──────────────────────────────────────────────────
  const customerHtml =
    '<div style="' + baseStyle + '">' +
    headerHtml +
    '<div style="padding:40px">' +
    '<h2 style="font-size:20px;font-weight:700;margin:0 0 8px">Order Confirmed!</h2>' +
    '<p style="color:#7A7069;margin:0 0 24px">Hi ' + payload.customerName + ', thank you for your order. We\'re preparing it now and will be in touch shortly.</p>' +
    '<div style="background:#F5F4F0;border-radius:6px;padding:16px 20px;margin-bottom:24px">' +
    '<p style="margin:0;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#B8882C;font-weight:600">Order Reference</p>' +
    '<p style="margin:4px 0 0;font-family:monospace;font-size:14px;color:#0D0D0D">' + payload.reference + '</p>' +
    '</div>' +
    tableHtml +
    '<div style="background:#F5F4F0;border-radius:6px;padding:16px 20px;margin-top:24px">' +
    '<p style="margin:0;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#B8882C;font-weight:600">Delivery Address</p>' +
    '<p style="margin:4px 0 0;font-size:14px;color:#0D0D0D">' + payload.deliveryAddress + '</p>' +
    '</div>' +
    '<p style="margin:32px 0 0;font-size:13px;color:#7A7069">For any enquiries, reply to this email or WhatsApp us at +234 913 311 5713.</p>' +
    '</div>' +
    footerHtml +
    '</div>'

  // ── Admin notification ────────────────────────────────────────────────────
  const adminHtml =
    '<div style="' + baseStyle + '">' +
    headerHtml +
    '<div style="padding:40px">' +
    '<h2 style="font-size:20px;font-weight:700;margin:0 0 8px;color:#059669">New Order Received!</h2>' +
    '<p style="color:#7A7069;margin:0 0 24px">A new order has been placed and payment verified on Paystack.</p>' +
    '<div style="background:#F5F4F0;border-radius:6px;padding:16px 20px;margin-bottom:24px">' +
    '<p style="margin:0;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#B8882C;font-weight:600">Customer Details</p>' +
    '<p style="margin:8px 0 0;font-size:14px"><strong>Name:</strong> ' + payload.customerName + '</p>' +
    '<p style="margin:4px 0 0;font-size:14px"><strong>Email:</strong> ' + payload.customerEmail + '</p>' +
    '<p style="margin:4px 0 0;font-size:14px"><strong>Phone:</strong> ' + payload.customerPhone + '</p>' +
    '<p style="margin:4px 0 0;font-size:14px"><strong>Address:</strong> ' + payload.deliveryAddress + '</p>' +
    '<p style="margin:4px 0 0;font-size:14px"><strong>Reference:</strong> <span style="font-family:monospace">' + payload.reference + '</span></p>' +
    '<p style="margin:4px 0 0;font-size:14px"><strong>Order ID:</strong> <span style="font-family:monospace">' + orderId + '</span></p>' +
    '</div>' +
    tableHtml +
    '</div>' +
    footerHtml +
    '</div>'

  await Promise.all([
    transporter.sendMail({
      from: '"The Jeweller\'s Hub" <thejewelershub@gmail.com>',
      to: payload.customerEmail,
      subject: 'Your order is confirmed — The Jeweller\'s Hub',
      html: customerHtml,
    }),
    transporter.sendMail({
      from: '"The Jeweller\'s Hub" <thejewelershub@gmail.com>',
      to: adminEmails,
      subject: 'New order: ' + formatPrice(payload.totalKobo) + ' from ' + payload.customerName,
      html: adminHtml,
    }),
  ])
}
