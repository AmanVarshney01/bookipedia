import { Toaster } from "@/components/ui/sonner";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import {
  AlertTriangleIcon,
  CheckIcon,
  InfoIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import { ThemeProvider } from "./components/theme-provider";
import { trpc } from "./utils/trpc";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "bg-background items-center w-full border border-border rounded-lg shadow-lg p-4 flex gap-3",
              title: "text-foreground font-medium",
              description: "text-muted-foreground text-sm",
              actionButton:
                "bg-primary text-primary-foreground px-3 py-2 text-sm rounded-md hover:opacity-90 transition-opacity",
              cancelButton:
                "bg-muted text-muted-foreground px-3 py-2 text-sm rounded-md hover:opacity-90 transition-opacity",
              closeButton:
                "text-muted-foreground hover:text-foreground transition-colors",
              success: "border-l-4 border-l-[hsl(var(--gold-leaf))]",
              error: "border-l-4 border-l-[hsl(var(--burgundy))]",
              warning: "border-l-4 border-l-[hsl(var(--leather))]",
              info: "border-l-4 border-l-[hsl(var(--ink))]",
            },
          }}
          icons={{
            success: (
              <CheckIcon className="h-5 w-5 text-[hsl(var(--gold-leaf))]" />
            ),
            error: <XIcon className="h-5 w-5 text-[hsl(var(--burgundy))]" />,
            warning: (
              <AlertTriangleIcon className="h-5 w-5 text-[hsl(var(--leather))]" />
            ),
            info: <InfoIcon className="h-5 w-5 text-[hsl(var(--ink))]" />,
            loading: (
              <Loader2Icon className="h-5 w-5 animate-spin text-[hsl(var(--ink))]" />
            ),
          }}
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        toast.error(error.message, {
          action: {
            label: "retry",
            onClick: () => {
              queryClient.invalidateQueries();
            },
          },
        });
      },
    }),
  });

  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: `${import.meta.env.VITE_SERVER_URL}/trpc`,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
          });
        },
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <NuqsAdapter>
            <Outlet />
          </NuqsAdapter>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
