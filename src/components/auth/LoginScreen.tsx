import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { motion } from 'motion/react';

export const LoginScreen: React.FC = () => {
  const { loginAsClient, setIsAuthenticated, setRole, clients } = useStudio();
  const [tab, setTab] = useState<'client' | 'admin'>('client');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Por favor ingresa un n�mero de tel�fono v�lido (10 d�gitos).');
      return;
    }
    const fullPhone = '+52' + phone;
    const existing = clients.find((c) => c.phone === fullPhone);
    
    if (existing) {
       const expectedPwd = existing.name.split(' ')[0].toLowerCase() + phone.slice(-4);
       if (password !== expectedPwd) {
         setError('Contrase�a incorrecta. Si eres nueva, inventa una.');
         return;
       }
    } else {
       if (!name) {
         setError('Como eres nueva, necesitamos tu nombre.');
         return;
       }
    }
    setError('');
    loginAsClient(fullPhone, name);
  };
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple mock password
      setRole('admin');
      setIsAuthenticated(true);
    } else {
      setError('Contraseña incorrecta. Pista: admin123');
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#cec5bd]/40 shadow-2xl relative overflow-hidden">
        
        {/* Decoración */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#fedeb2]/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#fedeb2]/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          <h1 className="font-serif text-3xl font-bold text-[#1c1b1a] mb-2 text-center">L'Atelier Vernis</h1>
          <p className="text-xs text-[#725b38] uppercase tracking-[0.2em] font-bold mb-8 text-center">Haute Beauté & Studio</p>

          <div className="flex w-full bg-[#f2edea] p-1 rounded-full mb-6">
            <button
              onClick={() => { setTab('client'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
                tab === 'client' ? 'bg-[#1e1b18] text-white shadow-md' : 'text-[#4c4640] hover:text-[#1c1b1a]'
              }`}
            >
              Soy Clienta
            </button>
            <button
              onClick={() => { setTab('admin'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
                tab === 'admin' ? 'bg-[#1e1b18] text-white shadow-md' : 'text-[#4c4640] hover:text-[#1c1b1a]'
              }`}
            >
              Staff
            </button>
          </div>

          {error && (
            <div className="w-full p-3 bg-red-50 text-red-700 text-xs text-center rounded-lg mb-4 border border-red-100">
              {error}
            </div>
          )}

          {tab === 'client' ? (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full space-y-4"
              onSubmit={handleClientLogin}
            >
              <div>
                <label className="block text-[10px] font-bold text-[#4c4640] uppercase tracking-wider mb-1.5">
                  N�mero de Tel�fono
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#cec5bd]/50 bg-[#f2edea] text-[#4c4640] text-sm font-semibold">
                    +52
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10 d�gitos"
                    maxLength={10}
                    className="flex-1 w-full h-11 px-3 bg-[#f8f3f0] border border-[#cec5bd]/50 rounded-r-xl text-sm focus:outline-none focus:border-[#725b38] focus:ring-1 focus:ring-[#725b38] transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#4c4640] uppercase tracking-wider mb-1.5">
                  Nombre (Si eres nueva)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. María Pérez"
                  className="w-full h-11 px-4 bg-[#f8f3f0] border border-[#cec5bd]/50 rounded-xl text-sm focus:outline-none focus:border-[#725b38] focus:ring-1 focus:ring-[#725b38] transition-all"
                />
              <div>
                <label className="block text-[10px] font-bold text-[#4c4640] uppercase tracking-wider mb-1.5">
                  Contrase�a (Obligatoria si ya tienes cuenta)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contrase�a"
                  className="w-full h-11 px-4 bg-[#f8f3f0] border border-[#cec5bd]/50 rounded-xl text-sm focus:outline-none focus:border-[#725b38] focus:ring-1 focus:ring-[#725b38] transition-all"
                />
              </div>
              </div>
              <button
                type="submit"
                className="w-full h-12 bg-[#725b38] hover:bg-[#584323] text-white font-bold rounded-xl shadow-lg shadow-[#725b38]/30 transition-all active:scale-[0.98]"
              >
                Ingresar / Registrarme
              </button>
            </motion.form>
          ) : (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full space-y-4"
              onSubmit={handleAdminLogin}
            >
              <div>
                <label className="block text-[10px] font-bold text-[#4c4640] uppercase tracking-wider mb-1.5">
                  Código de Acceso
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 bg-[#f8f3f0] border border-[#cec5bd]/50 rounded-xl text-sm focus:outline-none focus:border-[#725b38] focus:ring-1 focus:ring-[#725b38] transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 bg-[#1e1b18] hover:bg-[#32302e] text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
              >
                Acceder al Panel
              </button>
            </motion.form>
          )}

        </div>
      </div>
    </div>
  );
};
