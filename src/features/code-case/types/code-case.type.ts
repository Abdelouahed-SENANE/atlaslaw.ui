import { CourtType } from "@/features/court/types/court.type";
import { Translation } from "@/types/api";



export type CodeCase = {
    id: string;
    code: string;
    label: Translation;
    court_type : CourtType;
};