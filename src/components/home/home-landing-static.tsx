import Image from "next/image";

import { TransitionLink } from "@/components/transition/transition-link";
import { siteConfig } from "@/config/site";

interface HomeLandingStaticProps {
  clickToEnterLabel: string;
  menuItems: Array<{
    href: string;
    label: string;
  }>;
}

export function HomeLandingStatic({ clickToEnterLabel, menuItems }: HomeLandingStaticProps) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out group-data-[state=menu]:pointer-events-none group-data-[state=menu]:scale-105 group-data-[state=menu]:opacity-0 group-data-[state=menu]:blur-sm">
        <button type="button" data-enter-trigger="true" className="pointer-events-auto cursor-pointer text-center touch-manipulation">
          <div className="relative h-48 w-48 transition-transform duration-300 hover:scale-105 active:scale-95 md:h-64 md:w-64">
            <Image
              src="/logo.png"
              alt="Black201 Logo"
              fill
              className="object-contain invert dark:invert-0"
              priority
            />
          </div>
          <p className="mt-8 animate-pulse text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {clickToEnterLabel}
          </p>
        </button>
      </div>

      <div className="flex flex-col items-center space-y-12 text-center transition-all duration-500 ease-out group-data-[state=intro]:pointer-events-none group-data-[state=intro]:translate-y-6 group-data-[state=intro]:opacity-0 group-data-[state=menu]:translate-y-0 group-data-[state=menu]:opacity-100">
        <div className="space-y-4 transition-all duration-500 ease-out">
          <h1 className="text-5xl font-bold tracking-tighter sm:text-7xl">{siteConfig.name}</h1>
        </div>

        <nav className="flex flex-col space-y-4">
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              className="flex justify-center translate-x-[-16px] opacity-0 transition-[opacity,transform] duration-500 ease-out group-data-[state=menu]:translate-x-0 group-data-[state=menu]:opacity-100"
              style={{ transitionDelay: `${150 + index * 70}ms` }}
            >
              <TransitionLink
                href={item.href}
                className="group/menu-item relative inline-flex w-fit items-center justify-center text-2xl font-bold tracking-widest text-foreground transition-colors duration-300 hover:text-primary focus-visible:text-primary sm:text-4xl"
                transitionGroup="page"
              >
                <span className="relative inline-block pb-1">
                  <span className="relative z-10 inline-block">{item.label}</span>
                  <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover/menu-item:scale-x-100 group-focus-visible/menu-item:scale-x-100" />
                </span>
              </TransitionLink>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
