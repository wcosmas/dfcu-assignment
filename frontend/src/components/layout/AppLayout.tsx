import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiHome, FiCreditCard, FiSearch, FiMenu, FiList } from "react-icons/fi";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavUser } from "./NavUser";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: FiHome },
    { name: "Make Payment", href: "/payment/initiate", icon: FiCreditCard },
    { name: "Check Status", href: "/payment/status", icon: FiSearch },
    { name: "My Payments", href: "/transactions", icon: FiList },
  ];

  const NavItems = () => (
    <>
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
            pathname === item.href
              ? "bg-primary text-primary-foreground font-medium"
              : "text-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </Link>
      ))}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile navigation */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-40"
          >
            <FiMenu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full max-w-xs p-0">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-center border-b px-6 py-4 bg-primary">
              <Image
                src="/logo.svg"
                alt="DFCU Bank"
                width={120}
                height={30}
                className="h-12 w-auto"
                priority
              />
            </div>
            <div className="flex-1 overflow-auto py-4">
              <div className="px-3 py-2">
                <div className="space-y-1">
                  <NavItems />
                </div>
              </div>
            </div>
            <div className="border-t p-4">
              <NavUser user={user} logout={logout} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop navigation */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col border-r border-border h-full bg-card">
          <div className="flex h-16 items-center justify-center border-b bg-primary">
            <Image
              src="/logo.svg"
              alt="DFCU Bank"
              width={150}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </div>
          <div className="flex-1 overflow-auto py-6">
            <nav className="grid items-start px-3 py-2 gap-2">
              <NavItems />
            </nav>
          </div>
          <div className="border-t p-4">
            <NavUser user={user} logout={logout} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-10 h-16 items-center bg-card border-b hidden lg:flex px-6">
          <div className="flex-1">
            <h2 className="text-lg font-medium">DFCU Bank Payment Gateway</h2>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
