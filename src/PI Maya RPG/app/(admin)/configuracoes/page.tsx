'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Mail, Save, Shield, User, Smartphone } from 'lucide-react';

export default function ConfiguracoesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [prefs, setPrefs] = useState({
    notificarEmail: true,
    notificarPush: true,
    resumoSemanal: true,
  });

  useEffect(() => {
    const savedPrefs = localStorage.getItem('maya_prefs');
    if (savedPrefs) {
      setPrefs(JSON.parse(savedPrefs));
    }
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    
    // Simula tempo de rede para dar feedback visual
    setTimeout(() => {
      localStorage.setItem('maya_prefs', JSON.stringify(prefs));
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold text-maya-teal-dark">Configurações</h1>
        <p className="text-maya-gray-soft mt-1">Ajustes da conta e preferências de notificação</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Perfil Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-maya-teal/10 rounded-full mx-auto flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-maya-teal" />
              </div>
              <h3 className="font-semibold text-lg text-maya-dark">{user?.nome || 'Profissional'}</h3>
              <p className="text-sm text-maya-gray-soft">{user?.email || 'profissional@maya.com'}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                <Shield className="w-3.5 h-3.5" /> Conta Verificada
              </div>
            </div>
          </Card>
        </div>

        {/* Formulário Principal */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Preferências do Sistema" />
            <form onSubmit={handleSave} className="p-6 pt-0 space-y-6">
              
              <div className="space-y-4">
                <h4 className="font-medium text-maya-dark flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Bell className="w-4 h-4 text-maya-teal" /> Notificações de Pacientes
                </h4>
                
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="flex items-center h-5">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-maya-teal border-gray-300 rounded focus:ring-maya-teal"
                      checked={prefs.notificarEmail}
                      onChange={(e) => setPrefs({...prefs, notificarEmail: e.target.checked})}
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 group-hover:text-maya-teal transition-colors">Alertas por E-mail</span>
                    <span className="block text-xs text-gray-500">Receber e-mail quando um paciente relatar dor intensa no app mobile.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="flex items-center h-5">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-maya-teal border-gray-300 rounded focus:ring-maya-teal"
                      checked={prefs.notificarPush}
                      onChange={(e) => setPrefs({...prefs, notificarPush: e.target.checked})}
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 group-hover:text-maya-teal transition-colors">Alertas no Painel (Push)</span>
                    <span className="block text-xs text-gray-500">Exibir notificações em tempo real na tela do sistema quando paciente faz check-in.</span>
                  </div>
                </label>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="font-medium text-maya-dark flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Mail className="w-4 h-4 text-maya-teal" /> Relatórios
                </h4>
                
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="flex items-center h-5">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-maya-teal border-gray-300 rounded focus:ring-maya-teal"
                      checked={prefs.resumoSemanal}
                      onChange={(e) => setPrefs({...prefs, resumoSemanal: e.target.checked})}
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 group-hover:text-maya-teal transition-colors">Resumo Semanal</span>
                    <span className="block text-xs text-gray-500">Receber um relatório com a taxa de adesão de todos os pacientes da clínica.</span>
                  </div>
                </label>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  {saved && <span className="text-sm text-green-600 font-medium">Preferências salvas com sucesso!</span>}
                </div>
                <Button type="submit" loading={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
