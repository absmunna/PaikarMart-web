import { lazy, Suspense, useEffect, useState } from "react";

// The PaikarMart app is a client-side SPA (it owns its own history via the
// react-router-dom shim), so it mounts only after hydration in the browser.
// It must mount inside its own providers (QueryProvider, ThemeProvider,
// AuthProvider, RouterProvider/BrowserRouter, ...), exactly like its original
// entry file did.
const PaikarMartProviders = lazy(() =>
  import("@/app/providers/AppProviders").then((m) => ({ default: m.AppProviders }))
);
const PaikarMartApp = lazy(() => import("@/app/App"));

const PLACEHOLDER_STYLE = { backgroundColor: "var(--pm-bg, #fcfbf8)" };

export function PaikarMartMount() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen" style={PLACEHOLDER_STYLE} />;
  }

  return (
    <PaikarMartProviders>
      <Suspense fallback={<div className="min-h-screen" style={PLACEHOLDER_STYLE} />}>
        <PaikarMartApp />
      </Suspense>
    </PaikarMartProviders>
  );
}
