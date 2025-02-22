import { redis } from "../redis/client";

interface GetSubscriberRankingPositionParams {
  subscriberId: string;
}

export async function getSubscriberRankingPosition({
  subscriberId,
}: GetSubscriberRankingPositionParams) {
  // Obtendo a posição do subscriberId no ranking
  const rank = await redis.zrevrank("referral:ranking", subscriberId);

  // Se o subscriberId não estiver no ranking, retornar null
  if (rank === null) {
    return { position: null };
  }

  // Retornando a posição do subscriberId no ranking
  return { position: rank + 1 };
}
