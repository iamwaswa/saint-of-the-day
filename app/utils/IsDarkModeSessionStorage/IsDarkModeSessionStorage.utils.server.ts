import { createCookieSessionStorage } from '@remix-run/node';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error(`SESSION_SECRET must be set`);
}

const isDarkModeSessionStorage = createCookieSessionStorage({
  cookie: {
    httpOnly: true,
    name: `isDarkMode`,
    path: `/`,
    sameSite: `lax`,
    secrets: [sessionSecret],
    secure: true,
  },
});

export async function getIsDarkModeSessionAsync(request: Request) {
  const session = await isDarkModeSessionStorage.getSession(
    request.headers.get(`Cookie`)
  );

  return {
    commitAsync(): Promise<string> {
      return isDarkModeSessionStorage.commitSession(session);
    },
    get(): boolean | undefined {
      return session.get(`isDarkMode`);
    },
    set(isDarkMode: boolean): void {
      session.set(`isDarkMode`, isDarkMode);
    },
  };
}
