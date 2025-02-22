import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { env } from "../env";
import { accessInviteLink } from "../functions/access-invite-link";

export const accessInviteLinkRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/invites/:subscriberId",
    {
      schema: {
        summary: "Access invite link and redirects user",
        tags: ["Referral"],
        description: "Access invite link and redirects user",
        params: z.object({
          subscriberId: z.string(),
        }),
        response: {
          302: z.null(),
        },
      },
    },
    async (request, reply) => {
      // Obtendo o subscriberId fornecido no params
      const { subscriberId } = request.params;

      // Incrementando a contagem de acessos ao link de convite
      await accessInviteLink({ subscriberId });

      // Redirecionando o usuário para a URL da aplicação web
      const redirectURL = new URL(env.WEB_URL);
      redirectURL.searchParams.set("referrer", subscriberId);
      return reply.redirect(redirectURL.toString(), 302);
    }
  );
};
