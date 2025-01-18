import { ThemeToggle } from "@/components/theme-toggle";
import UserMenu from "@/components/user-menu";
import { authClient } from "@/lib/auth-client";
import { Book } from "lucide-react";
import { Link, Outlet } from "react-router";

export default function Dashboard() {
  return (
    <div className="min-h-svh bg-background">
      <header className="border-b-2 border-primary bg-primary text-primary-foreground shadow-lg">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-row items-center justify-between p-4">
            <Link to="/" className="flex flex-row items-center gap-3">
              <Book className="h-6 w-6" />
              <h1 className="font-serif text-2xl font-bold">Bookipedia</h1>
            </Link>
            <div className="flex flex-row items-center gap-2">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-6">
        <Outlet />
      </main>
    </div>
  );
}
