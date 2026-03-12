import { Card } from '@/components/shared/Card';

export default function AvaliacoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-maya-teal-dark">Avaliações Posturais</h1>
        <p className="text-maya-gray-soft mt-1">Histórico de fotos e evolução (Em breve na Entrega 2)</p>
      </div>
      <Card>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-maya-dark">Módulo em Desenvolvimento</h3>
          <p className="text-sm text-maya-gray-soft mt-2">
            O módulo de avaliações fotográficas fará parte da próxima entrega do sistema.
          </p>
        </div>
      </Card>
    </div>
  );
}
