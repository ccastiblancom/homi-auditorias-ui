import './globals.css'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export const metadata = {
  title: 'Auditorías HOMI',
  description: 'Sistema de Gestión de Auditorías Core - Hospital de la Misericordia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="flex h-screen bg-slate-50 overflow-hidden font-sans">
        
        {/* Barra Lateral Izquierda */}
        <Sidebar />

        {/* Contenedor Principal Derecho */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto relative bg-slate-50">
          
          {/* Encabezado Superior */}
          <Header />

          {/* Área dinámica de contenido (donde cargan las pantallas) */}
          <div className="flex-1">
            {children}
          </div>

          {/* Pie de Página Inferior */}
          <Footer />
          
        </main>
        
      </body>
    </html>
  )
}