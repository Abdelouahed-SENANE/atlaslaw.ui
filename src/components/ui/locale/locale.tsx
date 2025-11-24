import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Button } from "../button";
import i18n from "@/config/i18n";

const languages = [
  { code: "ar", label: "العربية", flag: "/assets/flags/ar.svg" },
  { code: "en", label: "English", flag: "/assets/flags/us.svg" },
  { code: "fr", label: "Français", flag: "/assets/flags/fr.svg" },
];

export function Locale() {
  const [selected, setSelected] = useState(() => {
    const current = i18n.language || "en";
    return languages.find((l) => l.code === current) || languages[1];
  });

  const handleChange = (lang: any) => {
    setSelected(lang);
    i18n.changeLanguage(lang.code);
    localStorage.setItem("lang", lang.code);
    document.documentElement.dir = lang.code === "ar" ? "rtl" : "ltr";
  };

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="plain"
          className="size-9 rounded-full cursor-pointer overflow-hidden"
        >
          <Avatar className="size-9 flex items-center justify-center">
            <AvatarImage src={selected.flag} className="size-5" />
            <AvatarFallback>
              <Globe className="size-5" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border rounded-xs">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChange(lang)}
            className={`flex items-center gap-2 cursor-pointer ${
              lang.code === selected.code ? "font-semibold" : ""
            }`}
          >
            <img src={lang.flag} alt={lang.code} className="h-4" />
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
