import { BackToTop } from "@/components/layout/back-to-top";
import { ReadingProgress } from "@/components/layout/reading-progress";

export function PostPageEnhancements({
  slug: _slug,
  targetId: _targetId,
}: {
  slug: string;
  targetId: string;
}) {
  return (
    <>
      <ReadingProgress />
      <BackToTop />
    </>
  );
}
