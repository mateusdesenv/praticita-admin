import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrencyBR } from '../../core/utils/currency.util';

@Pipe({ name: 'currencyBr', standalone: true })
export class CurrencyBrPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return formatCurrencyBR(value);
  }
}
