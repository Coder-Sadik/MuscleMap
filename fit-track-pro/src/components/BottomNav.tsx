"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, Activity, Flame, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { dict } = useLanguage();

  const navItems = [
    { href: "/", label: dict.nav.home, icon: Home },
    { href: "/workout", label: dict.nav.workout, icon: Dumbbell },
    { href: "/muscles", label: dict.nav.muscles, icon: Activity },
    { href: "/progress", label: dict.nav.progress, icon: Flame },
    { href: "/profile", label: dict.nav.profile, icon: User },
  ];

  // P4 fix: the active workout is a full-screen experience.
  // Showing the bottom nav there wastes space and is visually confusing.
  if (pathname === "/workout/active") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/50 pb-safe">
      <div className="max-w-[430px] mx-auto w-full flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          // B12 fix: use startsWith for sub-routes (e.g. /workout/builder stays
          // highlighted), but use exact match for "/" to avoid it always matching.
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
