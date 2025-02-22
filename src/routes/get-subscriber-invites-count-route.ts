import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getSubscriberInvitesCount } from "../functions/get-subscriber-invites-count";

export const getSubscriberInvitesCountRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.get(
    "/subscribers/:subscriberId/ranking/count",
    {
      schema: {
        summary: "Get subscriber invitations use count",
        tags: ["Referral"],
        description: "Get subscriber invitations use count",
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

      // Obtendo a contagem de convites utilizados feitos pelo subscriberId fornecido
      const { count } = await getSubscriberInvitesCount({ subscriberId });

      // Retornando a contagem
      return { count };
    }
  );
};
