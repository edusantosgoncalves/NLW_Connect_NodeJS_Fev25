import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getSubscriberInviteClicks } from "../functions/get-subscriber-invite-clicks";

export const getSubscriberInviteClicksRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.get(
    "/subscribers/:subscriberId/ranking/clicks",
    {
      schema: {
        summary: "Get subscriber invite clicks count",
        tags: ["Referral"],
        description: "Get subscriber invite clicks count",
        params: z.object({
          subscriberId: z.string(),
        }),
        response: {
          200: z.object({
            count: z.number(),
          }),
        },
      },
    },
    async (request) => {
      // Obtendo o subscriberId fornecido no params
      const { subscriberId } = request.params;

      // Obtendo a contagem de acessos ao link do subscriberId fornecido
      const { count } = await getSubscriberInviteClicks({ subscriberId });

      // Retornando a contagem
      return { count };
    }
  );
};
