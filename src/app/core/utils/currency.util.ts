export function formatCurrencyBR(value: number | null | undefined): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'Sob consulta';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}
