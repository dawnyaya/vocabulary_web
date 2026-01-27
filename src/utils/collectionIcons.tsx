import {
  BookOpen,
  Sparkles,
  Target,
  Rocket,
  Lightbulb,
  Palette,
  Star,
  Flame,
  Briefcase,
  GraduationCap,
  Heart,
  Zap,
  Globe,
  Music,
  Trophy,
  Gamepad2,
  Brain,
  Diamond,
  Flower2,
  Clover,
  FileText,
  Coffee,
  Bookmark,
  Tag,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface IconOption {
  name: string;
  component: LucideIcon;
  label: string;
}

// Available icons for collections
export const COLLECTION_ICONS: IconOption[] = [
  { name: 'book-open', component: BookOpen, label: 'Book' },
  { name: 'sparkles', component: Sparkles, label: 'Sparkles' },
  { name: 'target', component: Target, label: 'Target' },
  { name: 'rocket', component: Rocket, label: 'Rocket' },
  { name: 'lightbulb', component: Lightbulb, label: 'Lightbulb' },
  { name: 'palette', component: Palette, label: 'Palette' },
  { name: 'star', component: Star, label: 'Star' },
  { name: 'flame', component: Flame, label: 'Flame' },
  { name: 'briefcase', component: Briefcase, label: 'Briefcase' },
  { name: 'graduation-cap', component: GraduationCap, label: 'Education' },
  { name: 'heart', component: Heart, label: 'Heart' },
  { name: 'zap', component: Zap, label: 'Lightning' },
  { name: 'globe', component: Globe, label: 'Globe' },
  { name: 'music', component: Music, label: 'Music' },
  { name: 'trophy', component: Trophy, label: 'Trophy' },
  { name: 'gamepad', component: Gamepad2, label: 'Gaming' },
  { name: 'brain', component: Brain, label: 'Brain' },
  { name: 'diamond', component: Diamond, label: 'Diamond' },
  { name: 'flower', component: Flower2, label: 'Flower' },
  { name: 'clover', component: Clover, label: 'Clover' },
  { name: 'file-text', component: FileText, label: 'Document' },
  { name: 'coffee', component: Coffee, label: 'Coffee' },
  { name: 'bookmark', component: Bookmark, label: 'Bookmark' },
  { name: 'tag', component: Tag, label: 'Tag' },
];

// Get icon component by name (with fallback for emoji)
export const getIconComponent = (iconOrEmoji: string): LucideIcon => {
  // Try to find by icon name first
  const iconOption = COLLECTION_ICONS.find((icon) => icon.name === iconOrEmoji);

  if (iconOption) {
    return iconOption.component;
  }

  // Fallback: if it's an emoji (old data), default to FileText
  return FileText;
};
