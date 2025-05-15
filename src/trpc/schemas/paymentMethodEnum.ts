import EPaymentMethod from '@/interfaces/EPaymentMethod';
import { z } from 'zod';

export default z.enum([
  EPaymentMethod.pix,
  EPaymentMethod.dinheiro,
  EPaymentMethod.credito,
  EPaymentMethod.debito,
  EPaymentMethod.boleto
]);
