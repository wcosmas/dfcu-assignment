"use client";

import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, UserProfile } from "@/types";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

interface NavUserProps {
  user: User | UserProfile | null;
  logout: () => void;
}

export function NavUser({ user, logout }: NavUserProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [fallbackUser, setFallbackUser] = useState<User | null>(null);

  // Get user from cookies as fallback
  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      const userId = Cookies.get("userId");
      const username = Cookies.get("username");
      const email = Cookies.get("userEmail");

      if (userId && username) {
        setFallbackUser({
          userId,
          username,
          email,
        });
      }
    }
  }, [user]);

  // Use provided user or fallback to cookie values
  const activeUser = user || fallbackUser;

  // Handle fallback for display values
  const userName = activeUser?.fullName || activeUser?.username || "Guest";
  const userEmail = activeUser?.email || "Not available";
  const userInitials =
    userName
      .split(" ")
      .map((n) => n?.[0] || "")
      .join("")
      .toUpperCase()
      .substring(0, 2) || "??";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 p-2 w-full relative"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${userInitials}`}
              alt={userName}
            />
            <AvatarFallback className="rounded-lg">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{userName}</span>
          </div>
          <MoreVerticalIcon className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${userInitials}`}
                alt={userName}
              />
              <AvatarFallback className="rounded-lg">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{userName}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <UserCircleIcon className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/payment/initiate")}>
            <CreditCardIcon className="mr-2 h-4 w-4" />
            Make Payment
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/transactions")}>
            <BellIcon className="mr-2 h-4 w-4" />
            Transactions
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
