export type ID = string;

export type PriceType =
  | 'fixed'
  | 'variation'
  | 'unit'
  | 'hundred'
  | 'kg'
  | 'package'
  | 'quote';

export type AvailabilityStatus =
  | 'available'
  | 'unavailable'
  | 'on_request'
  | 'quote';
