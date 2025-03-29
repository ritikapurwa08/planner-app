import React from "react";
import Link from "next/link";
import {
  Home,
  ListChecks,
  Calendar,
  QuoteIcon,
  StickyNote,
  Target,
  Settings,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Tasks", href: "/dashboard/tasks", icon: ListChecks },
  { label: "Quotes", href: "/dashboard/quotes", icon: QuoteIcon },
  { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { label: "Notes", href: "/dashboard/notes", icon: StickyNote },
  { label: "Goals", href: "/dashboard/goals", icon: Target },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const DashBoardSidebar = () => {
  return (
    <div className="w-64 sticky top-0 min-h-screen max-h-screen overflow-y-auto h-screen border-r-2 border-[var(--color-sidebar-border)] bg-[var(--color-sidebar)] text-[var(--color-sidebar-foreground)]">
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-6 text-[var(--color-sidebar-primary-foreground)]">
          Study Planner
        </h1>
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-sidebar-accent-foreground)] transition-colors"
            >
              {item.icon && (
                <item.icon className="mr-2 h-4 w-4 text-[var(--color-sidebar-primary-foreground)]" />
              )}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default DashBoardSidebar;
