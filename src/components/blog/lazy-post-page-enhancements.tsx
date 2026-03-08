"use client";

import dynamic from "next/dynamic";
import * as React from "react";

const PostPageEnhancements = dynamic(
  () => import("@/components/blog/post-page-enhancements").then((mod) => mod.PostPageEnhancements),
  {
    ssr: false,
  },
);

export function LazyPostPageEnhancements({
  slug,
  targetId,
}: {
  slug: string;
  targetId: string;
}) {
  const [shouldLoad, setShouldLoad] = React.useState(false);

  React.useEffect(() => {
    const schedule = window.requestIdleCallback
      ? window.requestIdleCallback(() => setShouldLoad(true), { timeout: 1200 })
      : window.setTimeout(() => setShouldLoad(true), 800);

    return () => {
      if (typeof schedule === "number") {
        window.clearTimeout(schedule);
        return;
      }

      window.cancelIdleCallback?.(schedule);
    };
  }, []);

  if (!shouldLoad) {
    return null;
  }

  return <PostPageEnhancements slug={slug} targetId={targetId} />;
}
