"use client";

import { useState, useEffect } from "react";
import { signOut } from "@/action/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { LogOutIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Skeleton } from "./ui/skeleton";

export function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    getUser();
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center">
        <Skeleton className="h-8 mr-2 w-8 rounded-full" />
        <Skeleton className="h-6 w-[134px] rounded-md" />
      </div>
    );
  }

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="cursor-pointer rounded-xl px-3 py-2 hover:bg-accent transition-colors duration-200"
        role="button"
      >
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 select-none">
            <AvatarImage
              src="https://api.dicebear.com/9.x/shapes/svg?seed=Kitty"
              alt="Profile Image"
            />
            <AvatarFallback className="h-7 w-7">
              {user.user_metadata.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="select-none">{user.user_metadata.full_name}</span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        forceMount
        className="w-[375px] rounded-2xl bg-background px-0 py-5 overflow-hidden"
      >
        <div className="flex flex-col items-stretch justify-start">
          <div className="mb-2 flex w-full flex-row items-center justify-start gap-4 px-5">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="https://api.dicebear.com/9.x/shapes/svg?seed=Kitty"
                alt="Profile Image"
              />
              <AvatarFallback className="h-10 w-10">
                {user.user_metadata.full_name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="text-inherit">
                {user.user_metadata.full_name}
              </span>
              <p className="text-sm text-muted-foreground">
                {user.user_metadata.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator className="mb-2 bg-gray-800" />
          <div className="flex flex-col items-stretch justify-start">
            {/* <DropdownMenuItem
              className="flex cursor-pointer items-center gap-6 rounded-none px-7 py-3 focus:bg-accent/50 transition-colors duration-200"
              asChild
            >
              <Link href="/account">
                <SettingsIcon className="size-[1.3rem]" />
                <p className="text-[0.91rem]">Manage Account</p>
              </Link>
            </DropdownMenuItem> */}

            <DropdownMenuItem
              className="flex cursor-pointer items-center rounded-none px-0 py-0 focus:bg-accent/50 transition-colors duration-200 w-full"
              onClick={handleSignOut}
            >
              <div className="flex items-center gap-6 w-full px-7 py-2.5">
                <LogOutIcon className="size-[1.3rem]" />
                <p className="text-[0.91rem]">Logout</p>
              </div>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
