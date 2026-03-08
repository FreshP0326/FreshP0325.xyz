import { HomeLandingGate } from "@/components/home/home-landing-gate";
import { HomeLandingStatic } from "@/components/home/home-landing-static";

interface HomeLandingProps {
  clickToEnterLabel: string;
  menuItems: Array<{
    href: string;
    label: string;
  }>;
}

export function HomeLanding({ clickToEnterLabel, menuItems }: HomeLandingProps) {
  return (
    <HomeLandingGate>
      <HomeLandingStatic clickToEnterLabel={clickToEnterLabel} menuItems={menuItems} />
    </HomeLandingGate>
  );
}
