import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { useLogout } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useTokenStore } from "@/store/token-store.ts";
import { Lock, Power, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown/index.ts";
import { Link } from "../link/index.ts";

type UserNavItem = {
  title: string;
  items: any[];
};

export const UserNavgation = () => {
  // const user  = useUser();
  const navigate = useNavigate();
  const logout = useLogout({
    onSuccess: () => {
      useTokenStore.getState().clearAccessToken();
      navigate(paths.login.root, { replace: true });
    },
  });

  const navigation = [
    {
      title: "My Account",
      items: [
        {
          name: "Profile",
          to: paths.profile.route(),
          icon: User,
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          name: "Account Settings",
          to: paths.profile.route(),
          icon: Settings,
        },
        {
          name: "Security",
          to: paths.profile.route(),
          icon: Lock,
        },
      ],
    },
  ].filter(Boolean) as UserNavItem[];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={"icon"}
          className=" shadow-none  text-primary-foreground hover:text-primary-foreground hover:bg-primary hover:outline-primary  duration-300 transition-colors bg-primary  cursor-pointer size-8  overflow-hidden rounded-full"
        >
          <span className="sr-only">Open user menu</span>
          <Avatar className="size-9">
            <AvatarImage src="https://github.com/shadcnx.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={6}
        align="end"
        className="min-w-[10rem] bg-card rounded-none border p-0"
      >
        <DropdownMenuItem className="flex items-center bg-primary/5 px-6 py-3 focus:bg-transparent">
          <Avatar className="size-9">
            <AvatarImage src="https://github.com/shadcnx.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="">
            <h6 className="font-medium text-sm">Abdelouahed SENANE</h6>
            <small className="text- mb-0 text-xs">Fullstack-Developper</small>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {navigation.map((nav, index) => (
          <DropdownMenuItem
            key={index}
            className="rounded-none focus:bg-transparent flex flex-col p-0 "
          >
            <small className="pb-1 px-2 text-left text- w-full">
              {nav.title}
            </small>
            {nav.items &&
              nav.items.map((item) => (
                <Link
                  to={item.to}
                  className="flex w-full text-card-foreground  px-6 py-2 hover:bg-border/50   hover:text-card-foreground/95 text-xs font-medium gap-2 cursor-pointer duration-300 ease-in-out items-center"
                >
                  <item.icon
                    className={cn("size-4 shrink-0 text-card-foreground")}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </Link>
              ))}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="border-b border-b-border" />
        <DropdownMenuItem className="rounded-none p-0 flex items-start">
          <Button
            onClick={() => {
              logout.mutate({});
            }}
            variant={"plain"}
            className="p-0 rounded-none px-6 py-2  h-full cursor-pointer text-destructive space-x-2  w-full text-left  items-start  transition-colors"
          >
            <Power className="text-destructive" />
            <span>Logout</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
