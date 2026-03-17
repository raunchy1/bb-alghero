export interface Room {
  slug: string
  name: { it: string; en: string }
  tagline: { it: string; en: string }
  description: { it: string; en: string }
  capacity: { guests: number; beds: string; bedType: { it: string; en: string }; bathrooms: number }
  size: number
  amenities: string[]
  images: string[]
  hero: string
}

export interface PropertyData {
  name: string
  brandName: string
  tagline: { it: string; en: string }
  description: { it: string; en: string }
  location: {
    city: string
    region: string
    country: string
    coordinates: { lat: number; lng: number }
    distanceToSea: string
  }
  contact: {
    phone: string
    email: string
    whatsapp: string
    cin: string
    airbnbUrl: string
  }
  host: { name: string; rating: number; reviewCount: number; superhost: boolean }
  amenities: { icon: string; label: { it: string; en: string } }[]
  rooms: Room[]
  commonImages: {
    terrace: string[]
    balcony: string[]
    bathroom: string[]
    common: string[]
  }
}

export const property: PropertyData = {
  name: "Il B&B di Lorenzo",
  brandName: "Il B&B di Lorenzo — Exclusive Rooms",
  tagline: {
    it: "Camere esclusive nel cuore di Alghero",
    en: "Exclusive rooms in the heart of Alghero"
  },
  description: {
    it: "Il B&B di Lorenzo offre camere esclusive di lusso nel cuore di Alghero, a soli 150 metri dalla spiaggia. Ogni camera è arredata con design moderno, materiali pregiati e attenzione ai dettagli. Terrazza panoramica, colazione inclusa e tutti i comfort per un soggiorno indimenticabile in Sardegna.",
    en: "Il B&B di Lorenzo offers exclusive luxury rooms in the heart of Alghero, just 150 meters from the beach. Each room features modern design, premium materials and attention to detail. Panoramic terrace, breakfast included and all comforts for an unforgettable stay in Sardinia."
  },
  location: {
    city: "Alghero",
    region: "Sardegna",
    country: "Italia",
    coordinates: { lat: 40.57446, lng: 8.31983 },
    distanceToSea: "150 m"
  },
  contact: {
    phone: "+393478327243",
    email: "info@lasuiten4.it",
    whatsapp: "393478327243",
    cin: "IT090003B4000F4256",
    airbnbUrl: "https://www.airbnb.it/rooms/1610343576481869093"
  },
  host: { name: "Lorenzo", rating: 0, reviewCount: 0, superhost: false },
  amenities: [
    { icon: "Wifi", label: { it: "WiFi gratuito", en: "Free WiFi" } },
    { icon: "Snowflake", label: { it: "Aria condizionata", en: "Air conditioning" } },
    { icon: "Tv", label: { it: "Televisore", en: "Television" } },
    { icon: "Coffee", label: { it: "Colazione inclusa", en: "Breakfast included" } },
    { icon: "Briefcase", label: { it: "Spazio di lavoro dedicato", en: "Dedicated workspace" } },
    { icon: "ShieldCheck", label: { it: "Detector monossido di carbonio", en: "Carbon monoxide detector" } },
    { icon: "Flame", label: { it: "Estintore", en: "Fire extinguisher" } },
    { icon: "Refrigerator", label: { it: "Minibar", en: "Minibar" } },
    { icon: "Bath", label: { it: "Bagno privato", en: "Private bathroom" } },
    { icon: "Sun", label: { it: "Terrazza panoramica", en: "Panoramic terrace" } },
    { icon: "Usb", label: { it: "Prese USB al letto", en: "USB outlets at bed" } },
    { icon: "Heater", label: { it: "Riscaldamento", en: "Heating" } },
  ],
  rooms: [
    {
      slug: "suite-luxury-tripla",
      name: {
        it: "Suite Luxury Vicinanze Mare Tripla",
        en: "Luxury Suite by the Sea, Triple"
      },
      tagline: {
        it: "Stile minimalist elegante per tre ospiti",
        en: "Elegant minimalist style for three guests"
      },
      description: {
        it: "Una camera doppia contemporanea caratterizzata da uno stile minimalista elegante, giocato su tonalità neutre e materiali morbidi. Il letto è basso e centrale, rivestito con lenzuola di colore chiaro, con una coperta beige testurizzata e asciugamani arrotolati che ricordano l'estetica di un hotel boutique. La testiera imbottita in tonalità taupe/rosa cipria aggiunge calore e comfort, mentre la parete posteriore è decorata con strisce verticali bianche che danno ritmo, altezza visiva e un tocco architettonico.",
        en: "A contemporary double room characterized by an elegant minimalist style, played on neutral tones and soft materials. The bed is low and central, dressed in light-colored sheets, with a textured beige blanket and rolled towels reminiscent of a boutique hotel aesthetic. The upholstered headboard in taupe/powder pink adds warmth and comfort, while the back wall is decorated with white vertical stripes that give rhythm, visual height and an architectural touch."
      },
      capacity: {
        guests: 3,
        beds: "1 Queen + 1 sofa bed",
        bedType: { it: "1 pat matrimonial Queen + 1 canapea extensibilă", en: "1 Queen bed + 1 sofa bed" },
        bathrooms: 1
      },
      size: 28,
      amenities: ["WiFi", "Aria condizionata", "Televisore", "Detector monossido", "Estintore"],
      images: [
        "/images/rooms/suite-luxury-tripla/room-01.jpeg",
        "/images/rooms/suite-luxury-tripla/room-02.jpeg",
        "/images/rooms/suite-luxury-tripla/room-03.jpeg",
        "/images/rooms/suite-luxury-tripla/room-04.jpeg",
        "/images/rooms/suite-luxury-tripla/room-05.jpeg",
      ],
      hero: "/images/rooms/suite-luxury-tripla/room-01.jpeg"
    },
    {
      slug: "suite-luxury-4-pax",
      name: {
        it: "Suite Luxury 4 Pax Vicinanze Mare",
        en: "Luxury Suite for 4 Guests by the Sea"
      },
      tagline: {
        it: "Spazio, arte e comfort per quattro",
        en: "Space, art and comfort for four"
      },
      description: {
        it: "La camera è spaziosa e confortevole, ha due letti matrimoniali comodi con biancheria di qualità, mobili contemporanei e dettagli artistici. Il pavimento in legno chiaro e il balcone privato garantiscono luce naturale e relax.",
        en: "The room is spacious and comfortable, with two comfortable double beds with quality linen, contemporary furniture and artistic details. The light wood floor and private balcony provide natural light and relaxation."
      },
      capacity: {
        guests: 4,
        beds: "2 beds",
        bedType: { it: "2 paturi duble", en: "2 double beds" },
        bathrooms: 1
      },
      size: 35,
      amenities: ["WiFi", "Aria condizionata", "Televisore", "Spazio lavoro", "Detector monossido", "Estintore"],
      images: [
        "/images/rooms/suite-luxury-4-pax/room-01.jpeg",
        "/images/rooms/suite-luxury-4-pax/room-02.jpeg",
        "/images/rooms/suite-luxury-4-pax/room-03.jpeg",
        "/images/rooms/suite-luxury-4-pax/room-04.jpeg",
        "/images/rooms/suite-luxury-4-pax/room-05.jpeg",
        "/images/rooms/suite-luxury-4-pax/room-06.jpeg",
      ],
      hero: "/images/rooms/suite-luxury-4-pax/room-01.jpeg"
    },
    {
      slug: "stanza-luxury-3-pax",
      name: {
        it: "Stanza Luxury Vicino Mare 3 Pax",
        en: "Luxury Room by the Sea 3 Pax"
      },
      tagline: {
        it: "Design dorato e atmosfera calda",
        en: "Golden design and warm atmosphere"
      },
      description: {
        it: "Il mobilio elegante, un letto matrimoniale confortevole, l'illuminazione di design e i dettagli raffinati creano un'atmosfera calda e rilassante nella camera.",
        en: "Elegant furniture, a comfortable double bed, designer lighting and refined details create a warm and relaxing atmosphere in the room."
      },
      capacity: {
        guests: 3,
        beds: "1 Queen + 1 sofa bed",
        bedType: { it: "1 pat matrimonial Queen + 1 canapea extensibilă", en: "1 Queen bed + 1 sofa bed" },
        bathrooms: 1
      },
      size: 25,
      amenities: ["WiFi", "Aria condizionata", "Televisore", "Spazio lavoro", "Detector monossido", "Estintore"],
      images: [
        "/images/rooms/stanza-luxury-3-pax/room-01.jpeg",
        "/images/rooms/stanza-luxury-3-pax/room-02.jpeg",
        "/images/rooms/stanza-luxury-3-pax/room-03.jpeg",
        "/images/rooms/stanza-luxury-3-pax/room-04.jpeg",
        "/images/rooms/stanza-luxury-3-pax/room-05.jpeg",
        "/images/rooms/stanza-luxury-3-pax/room-06.jpeg",
        "/images/rooms/stanza-luxury-3-pax/room-07.jpeg",
      ],
      hero: "/images/rooms/stanza-luxury-3-pax/room-01.jpeg"
    },
    {
      slug: "stanza-luxury-2-pax",
      name: {
        it: "Stanza Luxury 2 Pax Vicinanze Mare",
        en: "Luxury Room for 2 Guests by the Sea"
      },
      tagline: {
        it: "Design moderno e luce naturale per due",
        en: "Modern design and natural light for two"
      },
      description: {
        it: "Arredata in stile moderno, la camera ha un comodo letto matrimoniale con biancheria di qualità, aria condizionata e dettagli di design. Le grandi finestre e il balcone offrono luce naturale e relax.",
        en: "Furnished in a modern style, the room has a comfortable double bed with quality linen, air conditioning and design details. Large windows and the balcony offer natural light and relaxation."
      },
      capacity: {
        guests: 2,
        beds: "1 bed",
        bedType: { it: "1 pat dublu", en: "1 double bed" },
        bathrooms: 1
      },
      size: 25,
      amenities: ["WiFi", "Aria condizionata", "Televisore", "Spazio lavoro", "Detector monossido", "Estintore"],
      images: [
        "/images/rooms/stanza-luxury-2-pax/room-01.jpeg",
        "/images/rooms/stanza-luxury-2-pax/room-02.jpeg",
        "/images/rooms/stanza-luxury-2-pax/room-03.jpeg",
        "/images/rooms/stanza-luxury-2-pax/room-04.jpeg",
      ],
      hero: "/images/rooms/stanza-luxury-2-pax/room-03.jpeg"
    }
  ],
  commonImages: {
    terrace: [
      "/images/terrace/terrace-01.jpeg",
      "/images/terrace/terrace-02.jpeg",
      "/images/terrace/terrace-03.jpeg",
      "/images/terrace/terrace-04.jpeg",
      "/images/terrace/terrace-05.jpeg",
      "/images/terrace/terrace-06.jpeg",
    ],
    balcony: [
      "/images/balcony/balcony-01.jpeg",
      "/images/balcony/balcony-02.jpeg",
      "/images/balcony/balcony-03.jpeg",
    ],
    bathroom: [
      "/images/bathroom/bathroom-01.jpeg",
      "/images/bathroom/bathroom-02.jpeg",
      "/images/bathroom/bathroom-03.jpeg",
      "/images/bathroom/bathroom-04.jpeg",
      "/images/bathroom/bathroom-05.jpeg",
      "/images/bathroom/bathroom-06.jpeg",
    ],
    common: [
      "/images/common/hallway-01.jpeg",
      "/images/common/hallway-02.jpeg",
      "/images/common/breakfast-01.jpeg",
      "/images/common/breakfast-02.jpeg",
      "/images/common/entrance-01.jpeg",
    ],
  }
}

export function getRoomBySlug(slug: string): Room | undefined {
  return property.rooms.find(r => r.slug === slug)
}

export function getAllImages(): { url: string; alt: string; category: string }[] {
  const all: { url: string; alt: string; category: string }[] = []
  for (const room of property.rooms) {
    for (let i = 0; i < room.images.length; i++) {
      all.push({ url: room.images[i], alt: `${room.name.en} - ${i + 1}`, category: room.slug })
    }
  }
  for (let i = 0; i < property.commonImages.bathroom.length; i++) {
    all.push({ url: property.commonImages.bathroom[i], alt: `Bathroom ${i + 1}`, category: 'bathroom' })
  }
  for (let i = 0; i < property.commonImages.terrace.length; i++) {
    all.push({ url: property.commonImages.terrace[i], alt: `Terrace ${i + 1}`, category: 'terrace' })
  }
  for (let i = 0; i < property.commonImages.balcony.length; i++) {
    all.push({ url: property.commonImages.balcony[i], alt: `Balcony ${i + 1}`, category: 'balcony' })
  }
  for (let i = 0; i < property.commonImages.common.length; i++) {
    all.push({ url: property.commonImages.common[i], alt: `Common area ${i + 1}`, category: 'common' })
  }
  return all
}
