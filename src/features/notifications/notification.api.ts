import { api } from "@/lib/api";

export type NotificationKind =
  | "order"
  | "comment"
  | "like"
  | "follow"
  | "wallet"
  | "reward"
  | "system";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

interface ApiNotification {
  id: string;
  userId: string;
  kind: string;
  title: string;
  body: string | null;
  href: string | null;
  read: boolean;
  createdAt: string;
}

function adapt(n: ApiNotification): AppNotification {
  return {
    id: n.id,
    kind: (n.kind as NotificationKind) ?? "system",
    title: n.title,
    body: n.body ?? "",
    createdAt: n.createdAt,
    read: n.read,
    link: n.href ?? undefined,
  };
}

export async function getNotifications(): Promise<AppNotification[]> {
  const list = await api.get<ApiNotification[]>("/api/notifications");
  return list.map(adapt);
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.post("/api/notifications/mark-all-read");
}
