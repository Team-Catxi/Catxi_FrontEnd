export const maskName = (identifier: string | null | undefined) => {
  if (!identifier) return "";
  const isEmail = identifier.includes("@");
  const base = isEmail ? identifier.split("@")[0] : identifier;
  if (base.length === 1) return base;
  if (base.length === 2) return `${base[0]}*`;
  return `${base[0]}*${base[2]}`;
};

export const formatTimestamp = (sentAt: string) => {
  const date = new Date(sentAt);

  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
