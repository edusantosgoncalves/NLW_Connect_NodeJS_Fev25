import { inArray } from "drizzle-orm";
import { db } from "../drizzle/client";
import { subscriptions } from "../drizzle/schema/subscriptions";
import { redis } from "../redis/client";

export async function getRanking() {
  // Obtendo o ranking dos 3 primeiros colocados
  const ranking = await redis.zrevrange("referral:ranking", 0, 2, "WITHSCORES"); // 0 = 1º lugar, 2 = 3º lugar, ou seja, do 1º ao 3º lugar

  // Convertendo o ranking em um objeto do tipo Chave-Valor
  const subscriberIdAndScore: Record<string, number> = {};

  for (let i = 0; i < ranking.length; i += 2) {
    subscriberIdAndScore[ranking[i]] = Number.parseInt(ranking[i + 1]);
  }

  // Obtendo os usuários que estão no ranking
  const subscribers = await db
    .select()
    .from(subscriptions)
    .where(inArray(subscriptions.id, Object.keys(subscriberIdAndScore)));

  // Mapeando os usuários a partir do resultado do banco e ordenando pelo score para retornar
  const rankingWithScore = subscribers
    .map((subscriber) => {
      return {
        id: subscriber.id,
        name: subscriber.name,
        score: subscriberIdAndScore[subscriber.id],
      };
    })
    .sort((subscriber1, subscriber2) => subscriber2.score - subscriber1.score);

  return { rankingWithScore };
}
