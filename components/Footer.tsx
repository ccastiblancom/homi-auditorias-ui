import { Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 py-6 px-8 mt-auto z-10 print:hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Izquierda: Derechos de autor */}
        <div className="flex items-center space-x-2 text-sm text-slate-500 font-medium">
          <ShieldCheck size={18} className="text-blue-600" />
          <span>
            &copy; {anioActual} <strong className="text-blue-900">Hospital de la Misericordia</strong>. Todos los derechos reservados.
          </span>
        </div>

        {/* Derecha: Firma de desarrollo */}
        <div className="flex items-center text-sm font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 shadow-sm">
          <span>Desarrollado con</span>
          <Heart size={14} className="mx-1.5 text-rose-500 animate-pulse" />
          <span className="text-slate-700 tracking-wide">ByHOMI</span>
        </div>
        
      </div>
    </footer>
  );
}