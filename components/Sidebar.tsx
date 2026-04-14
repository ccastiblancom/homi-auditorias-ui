'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { 
  FileText, 
  BarChart2, 
  FileBarChart, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  PieChart,
  Target // <-- Añadimos el icono para Planes de Mejora
} from 'lucide-react'

export default function Sidebar() {
  // Estado para controlar si la barra está expandida o colapsada
  const [isExpanded, setIsExpanded] = useState(true)
  
  // Hooks para navegación y rutas
  const pathname = usePathname()
  const router = useRouter()

  // --- Estado para mostrar los datos del usuario real ---
  const [usuarioActual, setUsuarioActual] = useState({ nombre: 'Cargando...', rol: '', iniciales: '' })

  useEffect(() => {
    // Leer el usuario actual desde la sesión del navegador
    const userStr = localStorage.getItem('usuario_homi');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      // Generar las iniciales (Ej: "Juan Pérez" -> "JP")
      const iniciales = userObj.nombre.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
      
      setUsuarioActual({
        nombre: userObj.nombre,
        rol: userObj.rol,
        iniciales: iniciales
      });
    }
  }, []);

  // --- FUNCIÓN: Cerrar sesión ---
  const handleLogout = () => {
    // 1. Borramos los datos del usuario del navegador
    localStorage.removeItem('usuario_homi');
    // 2. Lo enviamos de regreso a la pantalla de login
    router.push('/login');
  };

  // --- LÓGICA DE PERMISOS (RBAC) ---
  // Estos módulos los ven TODOS los roles
  const baseNavItems = [
    { href: '/registro', icon: FileText, label: 'Registro auditoría' },
    { href: '/torre-control', icon: BarChart2, label: 'Torre de Control' },
    { href: '/dashboard', icon: PieChart, label: 'Dashboard Directivo' },
    // --- NUEVO ENLACE A PLANES DE MEJORA ---
    { href: '/planes-mejora', icon: Target, label: 'Planes de Mejora' },
    { href: '/informe', icon: FileBarChart, label: 'Informe Auditoría' },
  ]

  // Si el usuario es Administrador, le sumamos el módulo de Configuración.
  // Si no, se queda solo con los básicos.
  const navItems = usuarioActual.rol === 'Administrador' 
    ? [...baseNavItems, { href: '/configuracion', icon: Settings, label: 'Configuración' }]
    : baseNavItems;

  return (
    <aside 
      // Le subimos el z-index a 40 para que flote por encima de las sombras del header
      className={`bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 ease-in-out relative z-40 shadow-sm ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Botón Flotante para Colapsar/Expandir */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-4 top-28 bg-white border border-slate-200 text-slate-500 hover:text-blue-600 rounded-full p-1.5 shadow-md transition-colors z-50 flex items-center justify-center"
      >
        {isExpanded ? <ChevronLeft size={16} strokeWidth={3} /> : <ChevronRight size={16} strokeWidth={3} />}
      </button>

      <div>
        {/* Sección del Logo */}
        <div className={`p-6 flex items-center justify-center h-24 transition-all ${isExpanded ? 'px-6' : 'px-0'}`}>
          <Link href="/" className="block">
            {isExpanded ? (
              <Image 
                src="/HOMI_LOGO.png" 
                alt="Logo HOMI"
                width={140} 
                height={45} 
                priority 
                className="transition-opacity duration-300"
              />
            ) : (
              // Versión mini del logo cuando está colapsado (Solo la "H")
              <div className="w-10 h-10 bg-blue-900 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-sm">
                H
              </div>
            )}
          </Link>
        </div>
        
        {/* Navegación */}
        <nav className="mt-4 flex flex-col space-y-2 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-bold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-semibold'
                } ${!isExpanded && 'justify-center'}`}
                title={!isExpanded ? item.label : ''} // Muestra tooltip nativo si está colapsado
              >
                {/* Indicador visual lateral para el elemento activo */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                )}
                
                <Icon size={20} className={`flex-shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                
                {/* El texto desaparece suavemente al colapsar */}
                <span 
                  className={`whitespace-nowrap transition-all duration-300 ${
                    isExpanded ? 'opacity-100 w-auto translate-x-0' : 'opacity-0 w-0 -translate-x-4 overflow-hidden'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
      
      {/* Sección Perfil Inferior */}
      <div className={`p-4 border-t border-slate-100 transition-all ${!isExpanded && 'flex flex-col items-center'}`}>
        <div className={`flex items-center ${isExpanded ? 'space-x-3 mb-4' : 'justify-center mb-4'}`}>
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold flex-shrink-0 shadow-inner text-sm">
            {/* Muestra las iniciales reales */}
            {usuarioActual.iniciales || 'U'}
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
            {/* Muestra el nombre y rol reales truncados si son muy largos */}
            <p className="text-sm font-bold text-slate-800 whitespace-nowrap truncate w-36" title={usuarioActual.nombre}>{usuarioActual.nombre}</p>
            <p className="text-xs text-slate-500 whitespace-nowrap truncate w-36" title={usuarioActual.rol}>{usuarioActual.rol}</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className={`flex items-center justify-center space-x-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 text-slate-600 py-2.5 rounded-xl transition-all duration-200 w-full group ${
            !isExpanded && 'px-0'
          }`}
          title={!isExpanded ? "Salir" : ""}
        >
          <LogOut size={18} className="group-hover:scale-110 transition-transform flex-shrink-0" />
          <span className={`font-bold whitespace-nowrap transition-all duration-300 ${
            isExpanded ? 'opacity-100 w-auto inline' : 'opacity-0 w-0 hidden'
          }`}>
            Salir
          </span>
        </button>
      </div>
    </aside>
  )
}