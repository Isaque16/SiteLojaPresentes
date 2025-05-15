import EStatus from '@/interfaces/EStatus';
import { z } from 'zod';

export default z.enum([
  EStatus.PENDENTE,
  EStatus.PREPARANDO,
  EStatus.A_CAMINHO,
  EStatus.ENTREGUE
]);
