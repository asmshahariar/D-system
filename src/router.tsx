import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// 🔥 Clean Error Component (no hooks needed)
function DefaultErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {error.message}
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-md bg-primary px-4 py-2 text-sm text-white"
          >
            Try again
          </button>

          <a
            href="/"
            className="rounded-md border px-4 py-2 text-sm"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

// ✅ IMPORTANT: export a getRouter function (as required by TanStack Start)
export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: DefaultErrorComponent,
  });
}

export const router = getRouter();