export const translations = {
  it: {
    nav: {
      home: 'Home',
      rooms: 'Camere',
      gallery: 'Galleria',
      amenities: 'Servizi',
      contact: 'Contatti',
      book: 'Prenota',
    },
    common: {
      from: 'da',
      perNight: 'a notte',
      bookNow: 'Prenota Ora',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      guests: 'Ospiti',
      send: 'Invia',
      cancel: 'Annulla',
      save: 'Salva',
      edit: 'Modifica',
      delete: 'Elimina',
    },
    booking: {
      title: 'Prenota il tuo soggiorno',
      dates: 'Seleziona le date',
      guestInfo: 'Informazioni ospite',
      name: 'Nome completo',
      email: 'Email',
      phone: 'Telefono',
      notes: 'Note speciali',
      total: 'Totale',
      nights: 'notti',
      confirm: 'Conferma Prenotazione',
      success: 'Prenotazione confermata!',
    },
    home: {
      hero: {
        title: 'La Suite N°4',
        subtitle: 'Il tuo rifugio nel cuore di Alghero',
        cta: 'Scopri le Camere',
      },
      features: {
        location: 'Centro Storico',
        comfort: 'Design Moderno',
        service: 'Accoglienza',
      },
    },
  },
  en: {
    nav: {
      home: 'Home',
      rooms: 'Rooms',
      gallery: 'Gallery',
      amenities: 'Amenities',
      contact: 'Contact',
      book: 'Book',
    },
    common: {
      from: 'from',
      perNight: 'per night',
      bookNow: 'Book Now',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      guests: 'Guests',
      send: 'Send',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
    },
    booking: {
      title: 'Book Your Stay',
      dates: 'Select Dates',
      guestInfo: 'Guest Information',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      notes: 'Special Requests',
      total: 'Total',
      nights: 'nights',
      confirm: 'Confirm Booking',
      success: 'Booking confirmed!',
    },
    home: {
      hero: {
        title: 'La Suite N°4',
        subtitle: 'Your retreat in the heart of Alghero',
        cta: 'Discover Rooms',
      },
      features: {
        location: 'Old Town',
        comfort: 'Modern Design',
        service: 'Hospitality',
      },
    },
  },
  de: {
    nav: {
      home: 'Startseite',
      rooms: 'Zimmer',
      gallery: 'Galerie',
      amenities: 'Ausstattung',
      contact: 'Kontakt',
      book: 'Buchen',
    },
    common: {
      from: 'ab',
      perNight: 'pro Nacht',
      bookNow: 'Jetzt Buchen',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      guests: 'Gäste',
      send: 'Senden',
      cancel: 'Abbrechen',
      save: 'Speichern',
      edit: 'Bearbeiten',
      delete: 'Löschen',
    },
    booking: {
      title: 'Ihren Aufenthalt Buchen',
      dates: 'Datum Wählen',
      guestInfo: 'Gastinformationen',
      name: 'Vollständiger Name',
      email: 'E-Mail',
      phone: 'Telefon',
      notes: 'Besondere Wünsche',
      total: 'Gesamt',
      nights: 'Nächte',
      confirm: 'Buchung Bestätigen',
      success: 'Buchung bestätigt!',
    },
    home: {
      hero: {
        title: 'La Suite N°4',
        subtitle: 'Ihr Rückzugsort im Herzen von Alghero',
        cta: 'Zimmer Entdecken',
      },
      features: {
        location: 'Altstadt',
        comfort: 'Modernes Design',
        service: 'Gastfreundschaft',
      },
    },
  },
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.it

export function getTranslation(lang: Language, key: string) {
  const keys = key.split('.')
  let value: any = translations[lang]
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value || key
}
