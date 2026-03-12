import { Card } from '@/components/shared/Card';

export default function PerfilPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-maya-teal-dark">Meu Perfil</h1>
        <p className="text-maya-gray-soft mt-1">Seus dados e preferências</p>
      </div>
      <Card>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-maya-dark">Módulo em Desenvolvimento</h3>
          <p className="text-sm text-maya-gray-soft mt-2">
            A edição de perfil estará disponível na próxima atualização.
          </p>
        </div>
      </Card>
    </div>
  );
}
