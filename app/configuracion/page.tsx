'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // <-- Conexión a Supabase
import { 
  Settings, Shield, Users, Plus, Edit2, Trash2, 
  UserPlus, Mail, Briefcase, X, Loader2, Lock, Edit
} from 'lucide-react';

export default function ConfiguracionPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados para el Modal
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false); // <-- NUEVO: Para saber si estamos editando
  
  // Se unificó el estado a 'formData' para usarlo tanto en Crear como en Editar
  const [formData, setFormData] = useState({ id: '', nombre: '', email: '', contrasena: '', rol: '', estado: 'Activo' });

  // 1. LEER USUARIOS DE SUPABASE AL CARGAR LA PÁGINA
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from('usuarios_sistema')
        .select('*')
        .order('fecha_creacion', { ascending: false });

      if (error) throw error;
      if (data) setUsuarios(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setCargando(false);
    }
  };

  // --- FUNCIONES PARA ABRIR EL MODAL ---
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setFormData({ id: '', nombre: '', email: '', contrasena: '', rol: '', estado: 'Activo' });
    setMostrarModal(true);
  };

  const abrirModalEditar = (usuario: any) => {
    setModoEdicion(true);
    setFormData({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      contrasena: usuario.contrasena,
      rol: usuario.rol,
      estado: usuario.estado
    });
    setMostrarModal(true);
  };

  // 2. GUARDAR USUARIO (CREAR O ACTUALIZAR)
  const handleGuardarUsuario = async () => {
    if (!formData.nombre || !formData.email || !formData.contrasena || !formData.rol) {
      alert('Por favor complete todos los campos, incluyendo la contraseña');
      return;
    }

    try {
      if (modoEdicion) {
        // ACTUALIZAR USUARIO EXISTENTE
        const { data, error } = await supabase
          .from('usuarios_sistema')
          .update({
            nombre: formData.nombre,
            email: formData.email,
            contrasena: formData.contrasena,
            rol: formData.rol,
            estado: formData.estado
          })
          .eq('id', formData.id)
          .select();

        if (error) throw error;

        if (data) {
          // Reemplazamos el usuario actualizado en la lista
          setUsuarios(usuarios.map(u => (u.id === formData.id ? data[0] : u)));
          setMostrarModal(false);
        }
      } else {
        // CREAR USUARIO NUEVO
        const { data, error } = await supabase
          .from('usuarios_sistema')
          .insert([
            { 
              nombre: formData.nombre, 
              email: formData.email, 
              contrasena: formData.contrasena, 
              rol: formData.rol, 
              estado: formData.estado 
            }
          ])
          .select();

        if (error) throw error;

        if (data) {
          setUsuarios([data[0], ...usuarios]);
          setMostrarModal(false);
        }
      }
    } catch (error: any) {
      console.error('Error al guardar usuario:', error);
      alert('Hubo un error al guardar el usuario. Verifica los datos.');
    }
  };

  // 3. ELIMINAR UN USUARIO EN SUPABASE
  const eliminarUsuario = async (id: string) => {
    if(!confirm('¿Está seguro de eliminar este usuario?')) return;

    try {
      const { error } = await supabase
        .from('usuarios_sistema')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Actualizar la interfaz borrando el que eliminamos
      setUsuarios(usuarios.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Hubo un error al eliminar el usuario.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="p-8 lg:p-12 max-w-7xl mx-auto">
        
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 flex items-center">
            <Settings className="mr-3 text-blue-600" size={32} />
            Configuración de Accesos
          </h2>
          <p className="text-slate-600 mt-2">Administre los usuarios y permisos del sistema hospitalario.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center">
                  <Users className="mr-2 text-blue-500" size={20} />
                  Usuarios con Acceso
                </h3>
                <button 
                  onClick={abrirModalCrear}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-all"
                >
                  <Plus size={18} className="mr-1" /> Nuevo Usuario
                </button>
              </div>

              <div className="overflow-x-auto">
                {cargando ? (
                  <div className="flex justify-center items-center p-10 text-slate-400">
                    <Loader2 className="animate-spin mr-2" /> Cargando base de datos...
                  </div>
                ) : usuarios.length === 0 ? (
                  <div className="text-center p-10 text-slate-500">
                    No hay usuarios registrados aún. Crea el primero.
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                        <th className="px-6 py-4">Usuario</th>
                        <th className="px-6 py-4">Rol</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {usuarios.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800">{u.nombre}</p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                              {u.rol}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.estado === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                              {u.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {/* AQUÍ SE CONECTÓ LA FUNCIÓN DE EDITAR AL LÁPIZ */}
                            <button 
                              onClick={() => abrirModalEditar(u)} 
                              className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                              title="Editar Usuario"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => eliminarUsuario(u.id)} 
                              className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Eliminar Usuario"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold flex items-center mb-4">
                <Shield className="mr-2 text-blue-400" size={20} /> Permisos por Rol
              </h3>
              <div className="space-y-4 text-sm">
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="font-bold text-blue-400">Administrador</p>
                  <p className="text-slate-400 text-xs">Acceso total, gestión de usuarios y borrado de registros.</p>
                </div>
                <div className="border-l-2 border-slate-600 pl-4 opacity-70">
                  <p className="font-bold text-white">Auditor / Coordinador</p>
                  <p className="text-slate-400 text-xs">Registro de auditorías, gestión de hallazgos y visualización de informes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL CREAR / EDITAR USUARIO */}
        {mostrarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                <h3 className="text-lg font-bold flex items-center">
                  {modoEdicion ? <Edit className="mr-2" size={20} /> : <UserPlus className="mr-2" size={20} />}
                  {modoEdicion ? 'Editar Acceso' : 'Nuevo Acceso'}
                </h3>
                <button onClick={() => setMostrarModal(false)} className="text-slate-400 hover:text-white"><X /></button>
              </div>
              
              <div className="p-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nombre Completo</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white" 
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Correo Institucional</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white" 
                      placeholder="usuario@homi.org.co"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="password" 
                      value={formData.contrasena}
                      onChange={(e) => setFormData({...formData, contrasena: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white" 
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Rol</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                      <select 
                        value={formData.rol}
                        onChange={(e) => setFormData({...formData, rol: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white appearance-none"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Coordinador">Coordinador</option>
                        <option value="Ingeniero">Ingeniero</option>
                        <option value="Auditor Concurrente">Auditor Concurrente</option>
                      </select>
                    </div>
                  </div>

                  {/* NUEVO: Permite cambiar el estado solo cuando se está editando */}
                  {modoEdicion && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Estado</label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 text-slate-400" size={18} />
                        <select 
                          value={formData.estado}
                          onChange={(e) => setFormData({...formData, estado: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white appearance-none"
                        >
                          <option value="Activo">Activo</option>
                          <option value="Inactivo">Inactivo</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-6 border-t border-slate-100 flex gap-3">
                <button onClick={() => setMostrarModal(false)} className="flex-1 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-all">Cancelar</button>
                <button onClick={handleGuardarUsuario} className="flex-1 py-2.5 bg-blue-800 text-white font-bold rounded-xl hover:bg-blue-900 shadow-md transition-all">
                  {modoEdicion ? 'Actualizar Usuario' : 'Guardar Usuario'}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}