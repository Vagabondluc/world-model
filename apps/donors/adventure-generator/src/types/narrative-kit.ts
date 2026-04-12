import { z } from "zod";
import { ReactNode } from "react";

export type TacticalIconType = 'check' | 'attack' | 'defense' | 'info';

export const TacticalItemSchema = z.object({
    id: z.string(),
    text: z.string(),
    icon: z.enum(['check', 'attack', 'defense', 'info']).optional(),
});

export type TacticalItem = z.infer<typeof TacticalItemSchema>;

/**
 * UI-specific item that allows ReactNode for icons.
 */
export interface UITacticalItem extends Omit<TacticalItem, 'icon'> {
    icon?: TacticalIconType | ReactNode;
}
