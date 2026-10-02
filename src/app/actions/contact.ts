'use server'

import nodemailer from 'nodemailer'

export async function sendContactMessage(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  if (!name || !email || !message) {
    return { success: false, error: 'All fields are required.' }
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'thejewelershub@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || ''
      }
    })

    const adminEmails = ['olaniyisuccessoluwatobi@gmail.com', 'femiadeleke2020@gmail.com', 'thejewelershub@gmail.com']

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0D0D0D;">New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <div style="background-color: #F5F4F0; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; white-space: pre-wrap; color: #333;">${message}</p>
        </div>
      </div>
    `

    await transporter.sendMail({
      from: `"The Jeweller's Hub Contact" <thejewelershub@gmail.com>`,
      to: adminEmails,
      replyTo: email,
      subject: `New Message from ${name} via Contact Form`,
      html: htmlContent,
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error sending contact email:', error)
    return { success: false, error: 'Failed to send message. Please try again later.' }
  }
}
