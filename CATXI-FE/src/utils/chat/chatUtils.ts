export function buildNicknameMap(
  emails: (string | null | undefined)[] = [],
  nicknames: (string | null | undefined)[] = []
): Record<string, string> {
  return emails.reduce((acc, rawEmail, i) => {
    const email = rawEmail?.trim();
    const nickname = nicknames[i]?.trim();

    if (email && nickname) {
      acc[email] = nickname;
    }
    return acc;
  }, {} as Record<string, string>);
}

export function getHostNickname(
  hostEmail: string,
  emails: (string | null | undefined)[] = [],
  nicknames: (string | null | undefined)[] = []
): string {
  const idx = emails.findIndex((e) => e?.trim() === hostEmail);
  if (idx === -1) return hostEmail;

  const nickname = nicknames[idx]?.trim();
  return nickname || hostEmail; 
}
