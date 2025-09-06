import type { SystemMessage } from "../../types/systemMessage/systemMessage";

export const isSystemMessage = (msg: any): msg is SystemMessage => {
  const email = (msg as any).email;
  const message = (msg as any).message;

  return (
    (typeof email === "string" &&
      email.replace(/\[|\]/g, "").toUpperCase() === "SYSTEM") ||
    message?.startsWith("[SYSTEM]")
  );
};
