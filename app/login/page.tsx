'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, Activity, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsj, setErrorMsj] = useState('');
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setErrorMsj('');

    try {
      // Buscar usuario en la tabla
      const { data, error } = await supabase
        .from('usuarios_sistema')
        .select('*')
        .eq('email', email)
        .eq('contrasena', password)
        .eq('estado', 'Activo')
        .single();

      if (error || !data) {
        setErrorMsj('Correo o contraseña incorrectos, o usuario inactivo.');
      } else {
        // Guardar sesión y redirigir
        localStorage.setItem('usuario_homi', JSON.stringify(data));
        router.push('/torre-control');
      }
    } catch (err) {
      setErrorMsj('Ocurrió un error de conexión.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-center text-white">
          <Activity size={48} className="mx-auto mb-3" />
          <h2 className="text-2xl font-black tracking-tight">Sistema de Auditorías</h2>
          <p className="text-blue-100 mt-1 font-medium">Hospital de la Misericordia (HOMI)</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {errorMsj && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm font-bold flex items-center">
                <ShieldCheck className="mr-2" size={18} /> {errorMsj}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Correo Institucional</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 bg-slate-50" 
                  placeholder="usuario@homi.org.co"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 bg-slate-50" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={cargando}
              className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg mt-4"
            >
              {cargando ? 'Verificando credenciales...' : 'Ingresar al Sistema'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}