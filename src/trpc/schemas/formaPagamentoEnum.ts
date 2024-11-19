import EFormaPagamento from "@/interfaces/EFormaPagamento";
import { z } from "zod";

export default z.enum([
  EFormaPagamento.pix,
  EFormaPagamento.dinheiro,
  EFormaPagamento.credito,
  EFormaPagamento.debito,
  EFormaPagamento.boleto
]);
