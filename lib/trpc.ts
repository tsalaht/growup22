import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import { PROJECT_CONFIG } from "@/config";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  // Use the real API URL
  return 'https://api.growupe.com';
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api`,
      transformer: superjson,
    }),
  ],
});