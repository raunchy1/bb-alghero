'use client'

import Link from 'next/link'

export default function CancelPage() {
  return (
    <main className="min-h-screen bg-[#f5f4ef] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-[#9e9790] rounded-full flex items-center justify-center mx-auto mb-8">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-normal tracking-tighter text-[#1a1716] mb-4 leading-tight">
          Pagamento annullato
        </h1>
        <p className="text-lg text-[#9e9790] mb-10">
          Il pagamento non è stato completato. Puoi riprovare o contattarci via WhatsApp.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-[#1a1716] text-[#f5f4ef] text-sm tracking-[0.15em] uppercase rounded-lg hover:bg-[#272220] transition-colors"
          >
            Torna alla home
          </Link>
          <a
            href="https://wa.me/393478327243"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-[#25D366] text-white text-sm tracking-[0.15em] uppercase rounded-lg hover:bg-[#20bd5a] transition-colors"
          >
            Contattaci
          </a>
        </div>
      </div>
    </main>
  )
}
