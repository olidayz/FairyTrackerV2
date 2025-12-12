import { LucideIcon } from 'lucide-react';

export type ButtonColor = 'yellow' | 'magenta' | 'cyan' | 'white';

export interface StageButtonProps {
  id: string;
  icon: LucideIcon;
  label?: string;
  isActive: boolean;
  isLocked: boolean;
  color: ButtonColor;
  onClick?: () => void;
}

export interface StarProps {
  top: string;
  left: string;
  size: number;
  delay: string;
  color?: string;
}