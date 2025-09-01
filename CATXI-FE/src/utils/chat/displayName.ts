import { maskName } from "./format";

export const getDisplayName = (
  email: string,
  nicknameMap: Record<string, string>
) => {
  return nicknameMap[email] || maskName(email);
};
