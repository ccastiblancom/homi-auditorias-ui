'use client'
import './globals.css'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // EFECTO CRÍTICO: Resetea el scroll del contenedor principal al cambiar de página
  useEffect(() => {
    const mainContent = document.getElementById('main-content-scroll');
    if (mainContent) {
      mainContent.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <html lang="es">
      <body className="flex h-screen bg-slate-50 overflow-hidden font-sans">
        
        {/* Barra Lateral Izquierda */}
        <Sidebar />

        {/* Contenedor Principal */}
        <main 
          id="main-content-scroll" 
          className="flex-1 flex flex-col h-screen overflow-y-auto relative scroll-smooth"
        >
          
          {/* Encabezado Superior */}
          <Header />

          {/* Área de Contenido */}
          <div className="flex-1">
            {children}
          </div>

          {/* Pie de Página */}
          <Footer />
          
        </main>
        
      </body>
    </html>
  )
}