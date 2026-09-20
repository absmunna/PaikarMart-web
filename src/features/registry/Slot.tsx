import { Suspense, useMemo, useSyncExternalStore } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { loadSlot, type SlotId } from "./componentRegistry";

function subscribe(cb: () => void) {
  const handler = () => cb();
  window.addEventListener("pm:registry:changed", handler);
  return () => window.removeEventListener("pm:registry:changed", handler);
}

let version = 0;
function getSnapshot() { return version; }

export function Slot<Props extends Record<string, unknown>>({
  id, fallback, ...props
}: { id: SlotId; fallback?: React.ReactNode } & Props) {
  // re-render when registry changes
  useSyncExternalStore((cb) => subscribe(() => { version++; cb(); }), getSnapshot, () => 0);

  const Comp = useMemo(() => loadSlot(id), [id, version]);
  return (
    <Suspense fallback={fallback ?? <Skeleton className="h-32 w-full rounded-lg" />}>
      <Comp {...(props as any)} />
    </Suspense>
  );
}
