"use client";

import { useTheme } from "next-themes";
import { type User } from "@supabase/supabase-js";
import { Moon, Sun, Bell, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface TopBarProps {
  user: User;
}

export function TopBar({ user }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="h-14 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks... (Ctrl+K)"
            className="w-full h-8 pl-9 pr-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            readOnly
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="w-4 h-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-transform" />
          <Moon className="absolute w-4 h-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-transform" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="ml-1">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs bg-muted">
                    {user.user_metadata?.display_name?.[0]?.toUpperCase() ||
                      user.email?.[0]?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-sm font-medium">
              {user.user_metadata?.display_name || "User"}
            </div>
            <div className="px-2 pb-1.5 text-xs text-muted-foreground truncate">
              {user.email}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a href="/settings" className="w-full">
                Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
