import { InnerPageTransition } from "@/components/transition/inner-page-transition";

export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  return <InnerPageTransition>{children}</InnerPageTransition>;
}
