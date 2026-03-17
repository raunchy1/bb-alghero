import {
  Wifi, Wind, Waves, Eye, Sun, UtensilsCrossed, Car, Coffee,
  Flame, ChefHat, Tv, BedDouble, Shirt, Lock, Zap, Leaf,
  Layers, Refrigerator, Building2, Bike, Mountain, TreePine,
  CheckCircle2
} from 'lucide-react'
import clsx from 'clsx'

const iconMap: Record<string, React.ElementType> = {
  Wifi, Wind, Waves, Eye, Sun, UtensilsCrossed, Car, Coffee,
  Flame, ChefHat, Tv, BedDouble, Shirt, Lock, Zap, Leaf,
  Layers, Refrigerator, Building2, Bike, Mountain, TreePine,
  WashingMachine: CheckCircle2,
}

interface Amenity {
  id: string
  name: string
  category: string
  icon: string
}

interface AmenityGridProps {
  amenities: Amenity[]
  variant?: 'grid' | 'compact'
  showAll?: boolean
}

const categoryLabels: Record<string, string> = {
  technology: 'Tecnologia',
  comfort: 'Comfort',
  outdoor: 'Esterni',
  view: 'Vista',
  kitchen: 'Cucina',
  transport: 'Trasporti',
  laundry: 'Lavanderia',
  bathroom: 'Bagno',
  security: 'Sicurezza',
}

export default function AmenityGrid({ amenities, variant = 'grid', showAll = true }: AmenityGridProps) {
  const displayAmenities = showAll ? amenities : amenities.slice(0, 8)

  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {displayAmenities.map((amenity) => {
          const Icon = iconMap[amenity.icon] || CheckCircle2
          return (
            <div key={amenity.id} className="flex items-center gap-3">
              <Icon size={16} className="text-sunset flex-shrink-0" />
              <span className="text-sm text-ocean">{amenity.name}</span>
            </div>
          )
        })}
      </div>
    )
  }

  // Group by category
  const grouped = amenities.reduce<Record<string, Amenity[]>>((acc, amenity) => {
    const cat = amenity.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(amenity)
    return acc
  }, {})

  return (
    <div className="space-y-12">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-xs font-medium tracking-widest uppercase text-stone mb-5">
            {categoryLabels[category] || category}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((amenity) => {
              const Icon = iconMap[amenity.icon] || CheckCircle2
              return (
                <div
                  key={amenity.id}
                  className={clsx(
                    'flex flex-col items-start gap-3 p-5 bg-white border border-sand-dark',
                    'transition-all duration-300 hover:border-ocean hover:shadow-card group'
                  )}
                >
                  <div className="w-10 h-10 bg-sand flex items-center justify-center group-hover:bg-ocean transition-colors duration-300">
                    <Icon size={18} className="text-ocean group-hover:text-sand transition-colors duration-300" />
                  </div>
                  <span className="text-sm text-ocean font-medium leading-tight">{amenity.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
