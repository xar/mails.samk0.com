import { createAuthClient } from "better-auth/client";

export function useAuth() {
  const url = useRequestURL();
  const headers = import.meta.server ? useRequestHeaders() : undefined;
  const sessionFetching = import.meta.server
    ? ref(false)
    : useState("auth:sessionFetching", () => false);

  const client = createAuthClient({
    fetchOptions: {
      headers,
    },
  });
  const user = useState<ReturnType<typeof client.getSession>["user"] | null>(
    "user",
    () => null
  );
  const session = useState<
    ReturnType<typeof client.getSession>["session"] | null
  >("session", () => null);

  function signInWithGithub() {
    return client.signIn.social({
      provider: "github",
    });
  }

  function signOut() {
    return client.signOut();
  }

  async function fetchSession() {
    if (sessionFetching.value) {
      return;
    }
    sessionFetching.value = true;
    const { data } = await client.getSession({
      fetchOptions: {
        headers,
      },
    });

    session.value = data?.session || null;
    user.value = data?.user || null;
    sessionFetching.value = false;

    return data;
  }

  return {
    user,
    session,
    client,
    signInWithGithub,
    fetchSession,
    signOut,
  };
}
