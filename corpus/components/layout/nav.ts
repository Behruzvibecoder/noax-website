/** Single source of truth for navigation, used by the header, overlay and footer. */

export interface NavItem {
  href: string;
  label: string;
  /** Short descriptor shown in the full-screen overlay. */
  blurb?: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", blurb: "Your progress at a glance" },
  { href: "/learn/les-heart-chambers", label: "Lessons", blurb: "Structured anatomy courses" },
  { href: "/anatomy/st-heart", label: "Atlas", blurb: "Interactive structures" },
  { href: "/tutor", label: "AI Tutor", blurb: "Grounded, cited answers" },
];

export const ACCOUNT_NAV: NavItem[] = [
  { href: "/login", label: "Sign in" },
  { href: "/signup", label: "Create account" },
];
