export const ROLES = { ADMIN: 'admin', SELLER: 'seller' } as const;
export type RoleConstant = typeof ROLES[keyof typeof ROLES];
