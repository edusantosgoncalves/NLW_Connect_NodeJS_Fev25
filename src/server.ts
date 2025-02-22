import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

// . Libs
import { fastify } from "fastify";
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

// . Variaveis de ambiente
import { env } from "./env";

// . Rotas
import { accessInviteLinkRoute } from "./routes/access-invite-link-route";
import { getRankingRoute } from "./routes/get-ranking-route";
import { getSubscriberInviteClicksRoute } from "./routes/get-subscriber-invite-clicks-route";
import { getSubscriberInvitesCountRoute } from "./routes/get-subscriber-invites-count-route";
import { getSubscriberRankingPositionRoute } from "./routes/get-subscriber-rank-position-route";
import { subscribeToEventRoute } from "./routes/subscribe-to-event-route";

// . Configuração do servidor
const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors);
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "NLW Connect - NodeJS (Fev-2025)",
      version: "0.0.1",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

// . Importação de rotas
app.register(subscribeToEventRoute);
app.register(accessInviteLinkRoute);
app.register(getSubscriberInviteClicksRoute);
app.register(getSubscriberInvitesCountRoute);
app.register(getSubscriberRankingPositionRoute);
app.register(getRankingRoute);

// . Inicialização do servidor
app.listen({ port: env.PORT }).then(() => {
  console.log("Server is running on port 3333");
});
