import { Button } from "@/components/ui/button";

import { TransitionLink } from "@/components/transition/transition-link";

interface NotFoundStateProps {
  title: string;
  description: string;
  href: string;
  actionLabel: string;
}

export function NotFoundState({
  title,
  description,
  href,
  actionLabel,
}: NotFoundStateProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">404</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
        <p className="max-w-xl text-sm leading-7 text-muted-foreground md:text-base">{description}</p>
      </div>

      <Button asChild className="rounded-full px-6">
        <TransitionLink href={href}>{actionLabel}</TransitionLink>
      </Button>
    </div>
  );
}
