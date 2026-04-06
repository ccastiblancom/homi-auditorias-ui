'use client'
import './globals.css'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [verificando, setVerificando] = useState(true)

  useEffect(() => {
    // Verificar si hay sesión activa
    const usuario = localStorage.getItem('usuario_homi');
    
    if (!usuario && pathname !== '/login') {
      router.push('/login');
    } else if (usuario && pathname === '/login') {
      router.push('/torre-control');
    } else {
      setVerificando(false);
    }

    // Scroll arriba al cambiar de módulo
    const mainContent = document.getElementById('main-content-scroll');
    if (mainContent) mainContent.scrollTo(0, 0);
  }, [pathname, router]);

  // Si está en la página de login o verificando sesión, no mostramos el layout completo
  if (pathname === '/login' || verificando) {
    return (
      <html lang="es">
        <body className="font-sans bg-slate-900">{children}</body>
      </html>
    )
  }

  // Layout normal para la aplicación protegida
  return (
    <html lang="es">
      <body className="flex h-screen bg-slate-50 overflow-hidden font-sans">
        <Sidebar />
        <main id="main-content-scroll" className="flex-1 flex flex-col h-screen overflow-y-auto relative scroll-smooth">
          <Header />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </body>
    </html>
  )
}