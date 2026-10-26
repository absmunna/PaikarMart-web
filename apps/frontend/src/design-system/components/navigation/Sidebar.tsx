import React from 'react';
import { LayoutDashboard, ShoppingBag, Users, ShieldAlert, BarChart } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', path: '/dashboard/products', icon: ShoppingBag },
  { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-[var(--pm-border)] h-screen fixed left-0 top-16 p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg ${
                isActive ? 'bg-[var(--pm-accent)] text-white' : 'hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
