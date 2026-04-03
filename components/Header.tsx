'use client'
import { useState, useEffect } from 'react';
import { Search, Bell, Activity } from 'lucide-react';

export default function Header() {
  const [fecha, setFecha] = useState('');

  // Usamos useEffect para evitar errores de hidratación en Next.js con la fecha
  useEffect(() => {
    const opciones: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    // Capitalizamos la primera letra de la fecha para que se vea más elegante
    const fechaFormateada = new Date().toLocaleDateString('es-CO', opciones);
    setFecha(fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1));
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm print:hidden">
      
      {/* Sección Izquierda: Saludo y Contexto */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
          ¡Hola, Cristian! 👋
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">
          {fecha ? fecha : 'Cargando fecha...'}
        </p>
      </div>

      {/* Sección Derecha: Búsqueda, Notificaciones y Estatus */}
      <div className="flex items-center space-x-6">
        
        {/* Barra de búsqueda global */}
        <div className="relative hidden md:block group">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar auditoría, paciente o ID..." 
            className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-72 text-slate-800 placeholder-slate-400" 
          />
        </div>

        {/* Campana de Notificaciones */}
        <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 rounded-full transition-colors">
          <Bell size={22} />
          {/* Alerta roja de notificación no leída */}
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>

        {/* Estatus del Sistema Hospitalario */}
        <div className="flex items-center pl-6 border-l border-slate-200">
          <div className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold flex items-center border border-emerald-100 shadow-sm">
            <span className="relative flex h-2.5 w-2.5 mr-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Sistema Online
          </div>
        </div>

      </div>
    </header>
  );
}