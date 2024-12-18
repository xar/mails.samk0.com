export default defineNuxtRouteMiddleware(async (to, from) => {
  const { fetchSession } = useAuth();

  await fetchSession();
});
