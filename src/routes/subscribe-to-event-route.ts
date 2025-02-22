import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { subscribeToEvent } from "../functions/subscribe-to-event";

export const subscribeToEventRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/subscriptions",
    {
      schema: {
        summary: "Subscribe someone to the event",
        tags: ["Subscriptions"],
        description: "Subscribe someone to the event",
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
        response: {
          201: z.object({
            subscriberId: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      // Obtendo os dados fornecidos no body
      const { name, email } = request.body;

      // Criação da inscrição no BD
      const { subscriberId } = await subscribeToEvent({ name, email });

      // Retornando o subscriberId gerado
      return reply.status(201).send({ subscriberId });
    }
  );
};
