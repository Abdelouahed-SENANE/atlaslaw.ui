import { Button } from "@/components/ui/button";
import i18n from "@/config/i18n.ts";
import { paths } from "@/config/paths";
import { useLogout, useUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Power, Settings, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown/index.ts";
import { RouterLink } from "../link/index.ts";
import { Lang } from "@/types/api.ts";

type UserNavItem = {
  title: string;
  items: any[];
};

export const UserNavgation = () => {
  const user = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lang = i18n.language;
  const logout = useLogout({
    onSuccess: () => {
      navigate(paths.login.root, { replace: true });
    },
  });


  const navigation = [
    {
      title: t("user_navigation.label_account"),
      items: [
        {
          name: t("user_navigation.profile"),
          to: paths.profile.route(),
          icon: User,
        },
      ],
    },
    {
      title: t("user_navigation.label_settings"),
      items: [
        {
          name: t("user_navigation.settings"),
          to: paths.settings.route(),
          icon: Settings,
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
            <AvatarImage src="/assets/avatar-fallback.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={6}
        align="end"
        className="min-w-40 bg-card rounded-none border p-0"
      >
        <DropdownMenuItem className="flex items-center bg-primary/5 px-6 py-3 focus:bg-transparent">
          <Avatar className="size-9">
            <AvatarImage src="/assets/avatar-fallback.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="">
            <h6 className="font-medium text-sm">
              {}{user?.data?.name[lang as Lang]}
            </h6>
            <small className="text- mb-0 text-xs">{user?.data?.email}</small>
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
              nav.items.map((item, index) => (
                <RouterLink
                  key={index}
                  to={item.to}
                  className="flex w-full text-card-foreground  px-6 py-2 hover:bg-border/50   hover:text-card-foreground/95 text-xs font-medium gap-2 cursor-pointer duration-300 ease-in-out items-center"
                >
                  <item.icon
                    className={cn("size-4 shrink-0 text-card-foreground")}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </RouterLink>
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
            <span>{t("user_navigation.logout")}</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
