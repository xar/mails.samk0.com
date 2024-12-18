import { betterAuth } from "better-auth";
import type { H3Event } from "h3";
import { LibsqlDialect } from "@libsql/kysely-libsql";
let _auth: ReturnType<typeof betterAuth>;

export function serverAuth() {
  const { dbFileName } = useRuntimeConfig();

  if (!_auth) {
    const dialect = new LibsqlDialect({
      url: dbFileName,
    });

    _auth = betterAuth({
      database: {
        dialect: dialect,
        type: "sqlite",
      },
      baseURL: getBaseURL(),
      emailAndPassword: {
        enabled: false,
      },
      socialProviders: {
        github: {
          clientId: useRuntimeConfig().githubClientId,
          clientSecret: useRuntimeConfig().githubClientSecret,
        },
      },
      account: {
        accountLinking: {
          enabled: true,
        },
      },
      plugins: [],
    });
  }
  return _auth;
}

export { serverAuth as auth };

function getBaseURL() {
  let baseURL = process.env.BETTER_AUTH_URL;
  if (!baseURL) {
    try {
      baseURL = getRequestURL(useEvent()).origin;
    } catch (e) {}
  }
  return baseURL;
}

export async function getUser(event: H3Event) {
  const result = await serverAuth(event).api.getSession({
    headers: event.headers,
  });

  if (!result || !result?.user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  return result;
}
