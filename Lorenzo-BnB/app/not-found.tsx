import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sand flex items-center justify-center">
      <div className="container-luxury py-24 text-center max-w-lg">
        <p className="font-serif text-8xl text-ocean/10 mb-4">404</p>
        <h1 className="font-serif text-display-sm text-ocean mb-4">Pagina non trovata</h1>
        <p className="text-stone text-sm mb-8">
          La pagina che cerchi non esiste. Forse vorresti esplorare la villa invece.
        </p>
        <Link href="/" className="btn-primary">
          Torna alla home
        </Link>
      </div>
    </div>
  )
}
