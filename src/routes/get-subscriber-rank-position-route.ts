import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getSubscriberRankingPosition } from "../functions/get-subscriber-ranking-position";

export const getSubscriberRankingPositionRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.get(
    "/subscribers/:subscriberId/ranking/position",
    {
      schema: {
        summary: "Get subscriber ranking position",
        tags: ["Referral"],
        description: "Get subscriber ranking position",
        params: z.object({
          subscriberId: z.string(),
        }),
        response: {
          200: z.object({
            position: z.number().nullable(),
          }),
        },
      },
    },
    async (request) => {
      // Obtendo o subscriberId fornecido no params
      const { subscriberId } = request.params;

      // Obtendo a posição do subscriberId fornecido no ranking
      const { position } = await getSubscriberRankingPosition({ subscriberId });

      // Retornando a posição
      return { position };
    }
  );
};
