import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ops Ninja",
    short_name: "Ops Ninja",
    description:
      "A project operations workspace for chats, meeting summaries, and integrations.",
    start_url: "/home",
    scope: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#047857",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/logo.png",
        sizes: "874x874",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "874x874",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Projects",
        short_name: "Projects",
        description: "Open project workspace",
        url: "/project",
      },
      {
        name: "Integrations",
        short_name: "Integrations",
        description: "Review connected services",
        url: "/integrations",
      },
    ],
  };
}
