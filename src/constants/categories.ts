import {
  HomeIcon,
  UserIcon,
  HeartIcon,
  TicketIcon,
  TruckIcon,
  TvIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

export const CATEGORIES = [
  { icon: HomeIcon, label: "생활용품", href: "/category/lifestyle" },
  { icon: UserIcon, label: "의류/잡화", href: "/category/beauty" },
  { icon: HeartIcon, label: "육아", href: "/category/childcare" },
  { icon: TicketIcon, label: "레저/취미", href: "/category/leisure" },
  { icon: HeartIcon, label: "반려동물", href: "/category/pet" },
  { icon: TruckIcon, label: "자동차/정비", href: "/category/car" },
  { icon: TvIcon, label: "전자기기", href: "/category/electronics" },
  { icon: WrenchScrewdriverIcon, label: "수리/공구", href: "/category/repair" },
] as const;