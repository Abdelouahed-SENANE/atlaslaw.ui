import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import React, { forwardRef, HTMLAttributes } from "react";
import { Button } from "../button";
import { Link as RouterLink, useLocation, matchPath, useResolvedPath } from "react-router-dom";

import { create } from "zustand";
import { useTheme } from "../theme";

type SidebarStore = {
  isCollapsed: boolean;
  openKey: string | null; // 👈 track which dropdown is open
  toggle: () => void;
  setCollapsed: (isCollapsed: boolean) => void;
  setOpenKey: (key: string | null) => void; // 👈 open/close specific dropdown
};

export const useSidebar = create<SidebarStore>((set, get) => ({
  isCollapsed: false,
  openKey: null,
  toggle: () => set({ isCollapsed: !get().isCollapsed }),
  setCollapsed: (isCollapsed: boolean) => set({ isCollapsed }),
  setOpenKey: (key) =>
    set((state) => ({
      openKey: state.openKey === key ? null : key,
    })),
}));

const Root = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isCollapsed } = useSidebar();
    return (
      <aside
        ref={ref}
        data-collapsed={isCollapsed}
        className={cn(
          "fixed h-screen flex flex-col z-10 group top-0 left-0 bg-card ease-in-out transition-[width] duration-300",
          className,
          isCollapsed ? "w-[var(--sidebar-collapsed)]" : "w-[var(--sidebar-expended)]"
        )}
        {...props}
      >
        {children}
      </aside>
    );
  }
);

const Separator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ children, className, ...props }, ref) => {
  return (
    <hr
      ref={ref}
      className={cn("w-full h-px bg-sidebar", className)}
      {...props}
    />
  );
});

Separator.displayName = "SidebarSeparator";

export const Label = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, title, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "text-xs text-sidebar-foreground/60 uppercase  block mb-4 mt-3 tracking-wider w-full group-data-[collapsed=false]:block group-data-[collapsed=true]:hidden",
        className
      )}
      {...props}
    >
      {title}
    </span>
  );
});

Label.displayName = "SidebarLabel";


const Brand = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    lightLogo?: React.ReactNode;
    darkLogo?: React.ReactNode;
    smallLogo?: React.ReactNode;
  }
>(({ className, darkLogo, lightLogo, smallLogo, ...props }, ref) => {
  const { isCollapsed } = useSidebar();
  const { theme } = useTheme();

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex items-center px-4 h-14 relative",
        className,
        isCollapsed ? "justify-center" : "justify-start"
      )}
    >
      <div
        className={cn(
          "transition-all duration-200",
          isCollapsed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          "absolute"
        )}
      >
        {smallLogo}
      </div>

      <div
        className={cn(
          "flex items-center transition-all duration-200",
          isCollapsed ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}
      >
        <div
          className={cn(
            "transition-opacity duration-200",
            theme === "dark" ? "opacity-0" : "opacity-100"
          )}
        >
          {darkLogo}
        </div>

        <div
          className={cn(
            "transition-opacity duration-200",
            theme === "dark" ? "opacity-100" : "opacity-0",
            "absolute"
          )}
        >
          {lightLogo}
        </div>
      </div>
    </div>
  );
});

Brand.displayName = "SidebarBrand";

const Body = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn("flex-1 px-4", className)}
      role="sidebar-body"
    >
      {children}
    </div>
  );
});

Body.displayName = "SidebarBody";

const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
  const { isCollapsed, toggle } = useSidebar();
  return (
    <Button
      ref={ref}
      onClick={toggle}
      className={cn(
        "absolute top-4 z-50 px-0.5 text-card-foreground  bg-card border-card  hover:text-white rounded-none   py-1.5 cursor-pointer ",
        className,
        isCollapsed
          ? "left-[100%] rounded-br-sm rounded-tr-sm  border-border border border-l-0"
          : "right-0 rounded-bl-sm rounded-tl-sm border-border border border-r-0"
      )}
      {...props}
    >
      {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
    </Button>
  );
});

Trigger.displayName = "SidebarTrigger";

const Menu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ children, className, ...props }, ref) => {
  return (
    <ul className={cn("mb-8", className)} ref={ref} role="list" {...props}>
      {children}
    </ul>
  );
});

Menu.displayName = "SidebarMenu";

const Item = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ children, className, ...props }, ref) => {
  return (
    <li ref={ref} role="item" {...props}>
      {children}
    </li>
  );
});
Item.displayName = "SidebarItem";

interface SubLink {
  title: string;
  to: string;
  icon?: React.ReactNode;
}

interface LinkProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
  icon?: React.ReactNode;
  to: string;
  items?: SubLink[];
}

// ...

export const Link = React.forwardRef<HTMLDivElement, LinkProps>(
  ({ title, icon, to, items = [], className, ...props }, ref) => {
    const { isCollapsed, setOpenKey, openKey } = useSidebar();
    const hasChildren = items.length > 0;

    const resolved = useResolvedPath(to);
    const { pathname } = useLocation();

    const activeSelf    = !!matchPath({ path: resolved.pathname, end: true }, pathname);
    const activeNested  = !!matchPath({ path: resolved.pathname + "/*", end: false }, pathname);
    const isActive      = activeSelf || activeNested;

    const isOpen = openKey === to  || isActive;

    const toggle = (e: React.MouseEvent) => {
      if (hasChildren) {
        e.preventDefault();
        setOpenKey(to);
      }
    };

    return (
      <div ref={ref} className="w-full">
        <RouterLink
          to={to}
          onClick={toggle}
          className={cn(
            "flex items-center mb-1 relative py-1.5 px-2 w-full gap-2 leading-[20px] text-[13px] border border-transparent rounded-xs cursor-pointer duration-200 text-sidebar-foreground/70 hover:text-sidebar-foreground",
            isCollapsed ? "justify-center" : "justify-start",
            "before:content-[''] before:absolute before:left-[-16px] before:top-0 before:bottom-0 before:w-[4px] before:rounded-[5px] before:border-[2px] before:border-transparent before:bg-transparent",
            className,
            (isActive || isOpen) &&
              "bg-primary/5 text-primary before:border-primary before:bg-primary hover:text-primary"
          )}
          {...props}
        >
          {icon && <span className="size-4">{icon}</span>}
          {!isCollapsed && (
            <>
              <span className="font-semibold flex-1">{title}</span>
              {hasChildren && (
                <span
                  className={cn(
                    "transition-transform duration-300",
                    isOpen && "rotate-180"
                  )}
                >
                  {isOpen ? (
                    <ChevronDown size={14} className="opacity-70" />
                  ) : (
                    <ChevronRight size={14} className="opacity-70" />
                  )}
                </span>
              )}
            </>
          )}
        </RouterLink>

        {hasChildren && (
          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <ul
              className="mt-1 overflow-hidden transition-all duration-300 transform"
              style={{ transform: isOpen ? "translateY(0)" : "translateY(-4px)" }}
            >
              {items.map((item) => {
                // ❌ don't call hooks in a loop — use matchPath with pathname
                const subActive = !!matchPath({ path: item.to, end: true }, pathname);
                return (
                  <li key={item.to} className="mb-0.5">
                    <RouterLink
                      to={item.to}
                      className={cn(
                        "flex items-center text-[13px] font-semibold gap-2 py-1.5 pr-2 pl-8 text-sidebar-foreground/70 hover:text-sidebar-foreground rounded-sm transition-colors",
                        "relative before:content-[''] before:absolute before:w-[4px] before:h-[4px] before:border before:border-[var(--bs-nav-link-disc-color)] before:rounded-full before:bg-[rgba(137,151,189,0.2)] before:left-[16px]",
                        subActive && "text-primary"
                      )}
                    >
                      <span>{item.title}</span>
                    </RouterLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }
);


Link.displayName = "SidebarLink";

const Footer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} aria-description="sidebar footer" {...props}>
      {children}
    </div>
  );
});

export const Sidebar = {
  Root,
  Separator,
  Label,
  Menu,
  Item,
  Link,
  Footer,
  Brand,
  Trigger,
  Body,
};
