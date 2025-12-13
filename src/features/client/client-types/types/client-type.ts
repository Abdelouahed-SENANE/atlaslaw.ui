import { Entity } from "@/types/api";



export type ClientType = Entity<{
    name: string
    description: string
    is_active: boolean
}>