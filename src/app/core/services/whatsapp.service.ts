import { Injectable } from '@angular/core';
import { ProductVariation } from '../models/product-variation.model';
import { Product } from '../models/product.model';
import { BusinessSettings } from '../models/business-settings.model';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  buildProductMessage(params: {
    product: Product;
    variation?: ProductVariation;
    quantity?: number;
    notes?: string;
  }): string {
    const isQuote = params.product.priceType === 'quote' || params.product.availabilityStatus === 'quote';

    return [
      isQuote
        ? 'Olá, vim pelo cardápio online da Praticità e gostaria de solicitar um orçamento.'
        : 'Olá, vim pelo cardápio online da Praticità e gostaria de fazer um pedido.',
      '',
      `Produto: ${params.product.name}`,
      params.variation ? `Variação: ${params.variation.name}` : null,
      params.quantity ? `Quantidade: ${params.quantity}` : null,
      params.notes ? `Observações: ${params.notes}` : null
    ].filter(Boolean).join('\n');
  }

  buildUrl(settings: BusinessSettings, message: string): string {
    const cleanPhone = settings.whatsapp.replace(/\D/g, '');
    const phone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }
}
