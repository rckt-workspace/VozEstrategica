import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
  beforeLoad: () => {
    throw redirect({ to: "/masterclass-de-clientes-a-fans" });
  },
  component: () => null,
});
