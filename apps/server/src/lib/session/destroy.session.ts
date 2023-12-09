import { client } from "~/config";

type DestroySession = (sid: string) => Promise<void>;

export const destroySession: DestroySession = async (sid) => {
  try {
    await client.del(`sessions:${sid}`);
    return;
  } catch (error) {
    throw new Error("Failed to destroy session");
  }
};
