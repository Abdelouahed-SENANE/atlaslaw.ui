import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown/dropdown-menu";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Button } from "../button";
import { useTranslation } from "react-i18next";

type Language = {
  code: string;
  label: string;
  flag: string;
};

const languages: Language[] = [
  { code: "fr", label: "Français", flag: "/assets/flags/fr.svg" },
  { code: "ar", label: "العربية", flag: "/assets/flags/ar.svg" },
];

export function SwitchLanguage() {
  const [selected, setSelected] = useState<Language>(languages[0]);
  const { i18n } = useTranslation(); // Add this hook

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "fr";
    const langObj = languages.find((l) => l.code === savedLang) || languages[0];
    setSelected(langObj);

    if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }

    document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = savedLang;
  }, [i18n]); // Add i18n to dependencies

  const handleChange = (lang: Language) => {
    if (i18n.language === lang.code) return;
    setSelected(lang);
    i18n.changeLanguage(lang.code);
    localStorage.setItem("lang", lang.code);
    document.documentElement.dir = lang.code === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang.code;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="plain"
          className="size-9 rounded-full cursor-pointer overflow-hidden flex items-center justify-center"
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
            onClick={() => handleChange(lang)} // Fixed: call handleChange instead of i18n.changeLanguage directly
            className={`flex items-center gap-2 cursor-pointer ${
              lang.code === selected.code ? "font-semibold" : ""
            }`}
          >
            <img src={lang.flag} alt={lang.label} className="h-4 w-4" />
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
