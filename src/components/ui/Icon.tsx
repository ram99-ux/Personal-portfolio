import {
  House,
  CircleHelp,
  Layers,
  Zap,
  UserRound,
  BriefcaseBusiness,
  Code2,
  Sparkles,
  Heart,
  Globe2,
  ArrowUpRight,
  Plug,
  Search,
  Gauge,
  Grid2X2,
  Circle,
} from "lucide-react";
const icons = {
  home: House,
  help: CircleHelp,
  layers: Layers,
  bolt: Zap,
  user: UserRound,
  work: BriefcaseBusiness,
  code: Code2,
  spark: Sparkles,
  heart: Heart,
  globe: Globe2,
  arrow: ArrowUpRight,
  plug: Plug,
  search: Search,
  gauge: Gauge,
  grid: Grid2X2,
  about: Circle,
};
export function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Component = icons[name as keyof typeof icons] || Code2;
  return (
    <Component
      aria-hidden="true"
      size={size}
      strokeWidth={2.4}
      className={className}
    />
  );
}
