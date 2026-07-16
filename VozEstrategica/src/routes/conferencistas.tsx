import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/conferencistas")({
  beforeLoad: () => {
    throw redirect({ to: "/speakers" });
  },
  component: () => null,
});
