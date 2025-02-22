import { eq } from "drizzle-orm";
import { db } from "../drizzle/client";
import { subscriptions } from "../drizzle/schema/subscriptions";
import { redis } from "../redis/client";

interface SubscribeToEventParams {
  name: string;
  email: string;
  referrerId?: string | null;
}

export async function subscribeToEvent({
  name,
  email,
  referrerId,
}: SubscribeToEventParams) {
  // Verificando se o usuário já está inscrito
  const existingSubscriber = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.email, email));

  // Se o usuário já estiver inscrito, retornar o id deste
  if (existingSubscriber.length > 0) {
    return { subscriberId: existingSubscriber[0].id };
  }

  // Caso contrário, inscrever o usuário
  const result = await db
    .insert(subscriptions)
    .values({
      name,
      email,
    })
    .returning();

  // Retornar o id do usuário inscrito
  const subscriber = result[0];

  // Se houver um referrerId, incrementar o ranking de convites para o referrer (usuário que convidou)
  if (referrerId) await redis.zincrby("referral:ranking", 1, referrerId);

  return {
    subscriberId: subscriber.id,
  };
}
