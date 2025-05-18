import { router, publicProcedure, protectedProcedure } from "../trpc";
import { object, pipe, string , minLength } from "valibot";
import { TRPCError } from '@trpc/server';
import { uploadService } from '../services';

export default router({
  uploadImage: protectedProcedure
    .input(
      object({
        base64Data: pipe(string(), minLength(1, 'Dados da imagem são obrigatórios')),
        fileName: pipe(string(), minLength(1, 'Nome do arquivo é obrigatório'))
      })
    )
    .mutation(async ({ input }) => {
      const result = await uploadService.saveBase64Image(
        input.base64Data,
        input.fileName
      );

      if ('error' in result) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: result.error
        });
      }

      return result;
    }),

  deleteImage: protectedProcedure
    .input(
      object({
        fileName: pipe(string(), minLength(1, 'Nome do arquivo é obrigatório'))
      })
    )
    .mutation(async ({ input }) => {
      const success = await uploadService.deleteImage(input.fileName);

      if (!success) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Imagem não encontrada ou não pode ser excluída'
        });
      }

      return { success };
    }),

  listImages: publicProcedure.query(async () => {
    return await uploadService.listImages();
  })
});
