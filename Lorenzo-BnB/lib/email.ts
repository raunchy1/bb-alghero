import nodemailer from 'nodemailer'
import { prisma } from './prisma'

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

// Get SMTP settings from database
async function getTransporter() {
  const settings = await prisma.settings.findFirst()
  
  if (!settings?.smtpHost || !settings?.smtpUser) {
    console.warn('SMTP not configured')
    return null
  }

  return nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort,
    secure: settings.smtpPort === 465,
    auth: {
      user: settings.smtpUser,
      pass: settings.smtpPassword,
    },
  })
}

// Email Templates
export function getBookingConfirmationTemplate(
  guestName: string,
  roomName: string,
  checkIn: string,
  checkOut: string,
  nights: number,
  totalPrice: number,
  bookingId: number
): EmailTemplate {
  const checkInDate = new Date(checkIn).toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const checkOutDate = new Date(checkOut).toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return {
    subject: `Conferma Prenotazione - La Suite N°4 Alghero (#${bookingId})`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; color: #1A2B3C;">
        <div style="background: #1A2B3C; padding: 40px; text-align: center;">
          <h1 style="color: #C4935A; margin: 0; font-style: italic;">La Suite N°4</h1>
          <p style="color: #fff; margin: 10px 0 0 0; font-size: 14px;">Alghero, Sardegna</p>
        </div>
        
        <div style="padding: 40px; background: #FAF8F4;">
          <h2 style="color: #1A2B3C; font-style: italic; margin-bottom: 24px;">Grazie per la tua prenotazione, ${guestName}!</h2>
          
          <div style="background: #fff; padding: 24px; border-left: 3px solid #C4935A; margin-bottom: 24px;">
            <h3 style="margin: 0 0 16px 0; color: #1A2B3C; font-size: 16px;">Dettagli Prenotazione #${bookingId}</h3>
            <p style="margin: 8px 0; font-size: 15px;"><strong>Camera:</strong> ${roomName}</p>
            <p style="margin: 8px 0; font-size: 15px;"><strong>Check-in:</strong> ${checkInDate} (dalle 15:00)</p>
            <p style="margin: 8px 0; font-size: 15px;"><strong>Check-out:</strong> ${checkOutDate} (entro le 11:00)</p>
            <p style="margin: 8px 0; font-size: 15px;"><strong>Notti:</strong> ${nights}</p>
            <p style="margin: 8px 0; font-size: 15px;"><strong>Totale:</strong> €${totalPrice.toFixed(2)}</p>
          </div>
          
          <div style="background: #fff; padding: 24px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 16px 0; color: #1A2B3C; font-size: 16px;">Informazioni Utili</h3>
            <ul style="padding-left: 20px; line-height: 1.8; font-size: 14px; color: #555;">
              <li>Indirizzo: Via XX Settembre 4, Alghero</li>
              <li>WiFi: Network "LaSuiteN4" - Password nella camera</li>
              <li>Check-in digitale disponibile <a href="${process.env.NEXT_PUBLIC_URL}/checkin/${bookingId}" style="color: #C4935A;">qui</a></li>
              <li>Per assistenza: WhatsApp +39 347 832 7243</li>
            </ul>
          </div>
          
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            Ti aspettiamo! Per qualsiasi domanda, non esitare a contattarci.
          </p>
          
          <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #999;">
              La Suite N°4 - Via XX Settembre 4, 07041 Alghero SS<br>
              Tel: +39 347 832 7243 | Email: info@lasuiten4.it
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
Grazie per la tua prenotazione, ${guestName}!

Dettagli Prenotazione #${bookingId}:
- Camera: ${roomName}
- Check-in: ${checkInDate} (dalle 15:00)
- Check-out: ${checkOutDate} (entro le 11:00)
- Notti: ${nights}
- Totale: €${totalPrice.toFixed(2)}

Informazioni Utili:
- Indirizzo: Via XX Settembre 4, Alghero
- WiFi: Network "LaSuiteN4" - Password nella camera
- Check-in digitale: ${process.env.NEXT_PUBLIC_URL}/checkin/${bookingId}
- Per assistenza: WhatsApp +39 347 832 7243

Ti aspettiamo!
La Suite N°4
    `.trim()
  }
}

export function getCheckInReminderTemplate(
  guestName: string,
  roomName: string,
  checkIn: string,
  bookingId: number
): EmailTemplate {
  const checkInDate = new Date(checkIn).toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  return {
    subject: `Reminder Check-in Domani - La Suite N°4`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; color: #1A2B3C;">
        <div style="background: #1A2B3C; padding: 40px; text-align: center;">
          <h1 style="color: #C4935A; margin: 0; font-style: italic;">La Suite N°4</h1>
        </div>
        <div style="padding: 40px; background: #FAF8F4;">
          <h2 style="color: #1A2B3C; font-style: italic;">Ci vediamo domani, ${guestName}!</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Questo è un promemoria per il tuo check-in domani, <strong>${checkInDate}</strong>.
          </p>
          <div style="background: #C4935A; color: #fff; padding: 20px; text-align: center; margin: 24px 0;">
            <p style="margin: 0; font-size: 18px;">Check-in disponibile dalle 15:00</p>
          </div>
          <p style="font-size: 14px;">
            <a href="${process.env.NEXT_PUBLIC_URL}/checkin/${bookingId}" style="color: #C4935A; text-decoration: underline;">
              Completa il check-in digitale →
            </a>
          </p>
        </div>
      </div>
    `,
    text: `Ci vediamo domani, ${guestName}! Check-in: ${checkInDate} dalle 15:00. Completa il check-in digitale: ${process.env.NEXT_PUBLIC_URL}/checkin/${bookingId}`
  }
}

export function getReviewRequestTemplate(
  guestName: string,
  roomName: string,
  bookingId: number
): EmailTemplate {
  return {
    subject: `Come è andato il tuo soggiorno? - La Suite N°4`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; color: #1A2B3C;">
        <div style="background: #1A2B3C; padding: 40px; text-align: center;">
          <h1 style="color: #C4935A; margin: 0; font-style: italic;">La Suite N°4</h1>
        </div>
        <div style="padding: 40px; background: #FAF8F4; text-align: center;">
          <h2 style="color: #1A2B3C; font-style: italic;">Grazie per averci scelto, ${guestName}!</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Speriamo che il tuo soggiorno nella ${roomName} sia stato indimenticabile.
          </p>
          <p style="font-size: 14px; color: #666; margin: 24px 0;">
            Potresti dedicare un momento per condividere la tua esperienza?
            Il tuo feedback ci aiuta a migliorare.
          </p>
          <a href="${process.env.NEXT_PUBLIC_URL}/reviews/write?booking=${bookingId}" 
             style="display: inline-block; background: #C4935A; color: #fff; padding: 16px 32px; text-decoration: none; font-size: 16px; margin: 16px 0;">
            Lascia una Recensione
          </a>
        </div>
      </div>
    `,
    text: `Grazie ${guestName}! Lascia una recensione qui: ${process.env.NEXT_PUBLIC_URL}/reviews/write?booking=${bookingId}`
  }
}

// Main send function
export async function sendEmail(
  to: string,
  template: EmailTemplate,
  from?: string
): Promise<boolean> {
  try {
    const transporter = await getTransporter()
    if (!transporter) {
      console.error('Email transporter not configured')
      return false
    }

    const settings = await prisma.settings.findFirst()
    const fromAddress = from || settings?.smtpFrom || 'booking@lasuiten4.it'

    await transporter.sendMail({
      from: `"La Suite N°4" <${fromAddress}>`,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    console.log(`Email sent to ${to}: ${template.subject}`)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

// Send booking confirmation
export async function sendBookingConfirmation(booking: {
  id: number
  guestName: string
  guestEmail: string
  checkIn: Date
  checkOut: Date
  nights: number
  totalPrice: number
  room: { name: string }
}): Promise<boolean> {
  if (!booking.guestEmail) return false
  
  const template = getBookingConfirmationTemplate(
    booking.guestName,
    booking.room.name,
    booking.checkIn.toISOString(),
    booking.checkOut.toISOString(),
    booking.nights,
    booking.totalPrice,
    booking.id
  )
  
  return sendEmail(booking.guestEmail, template)
}

// Send admin notification
export async function sendAdminNotification(subject: string, message: string): Promise<boolean> {
  const settings = await prisma.settings.findFirst()
  if (!settings?.adminEmail) return false
  
  return sendEmail(settings.adminEmail, {
    subject: `[La Suite N°4] ${subject}`,
    html: `<div style="font-family: sans-serif; padding: 20px;"><h2>${subject}</h2><p>${message}</p></div>`,
    text: `${subject}\n\n${message}`
  })
}
