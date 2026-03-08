type WindowWithRouteTransition = Window & {
  __routeTransitionFrame?: number;
};

function clearSnapshot() {
  const snapshotHost = document.getElementById("route-transition-snapshot");

  if (!snapshotHost) {
    return;
  }

  snapshotHost.replaceChildren();
  document.documentElement.dataset.routeTransitionHasSnapshot = "false";
}

function mountSnapshot(activePageShell: HTMLElement) {
  const snapshotHost = document.getElementById("route-transition-snapshot");

  if (!snapshotHost) {
    return false;
  }

  const frame = activePageShell.querySelector<HTMLElement>('[data-transition-layer="frame"]') ?? activePageShell;
  const rect = frame.getBoundingClientRect();
  const clone = frame.cloneNode(true) as HTMLElement;

  clone.classList.add("route-transition-snapshot-node");
  clone.setAttribute("aria-hidden", "true");
  clone.querySelectorAll("[id]").forEach((node) => {
    node.removeAttribute("id");
  });
  clone.querySelectorAll("[data-transition-stagger], [data-transition-layer]").forEach((node) => {
    node.removeAttribute("data-transition-stagger");
    node.removeAttribute("data-transition-layer");
  });

  clone.style.setProperty("--snapshot-top", `${rect.top}px`);
  clone.style.setProperty("--snapshot-left", `${rect.left}px`);
  clone.style.setProperty("--snapshot-width", `${rect.width}px`);
  clone.style.setProperty("--snapshot-height", `${rect.height}px`);

  snapshotHost.replaceChildren(clone);
  document.documentElement.dataset.routeTransitionHasSnapshot = "true";

  return true;
}

export function startRouteTransition(navigate: () => void) {
  if (typeof window === "undefined") {
    navigate();
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.dataset.routeTransitionState = "idle";
    navigate();
    return;
  }

  const activePageShell = document.querySelector<HTMLElement>('[data-page-shell="true"]');
  const root = document.documentElement;
  const windowWithRouteTransition = window as WindowWithRouteTransition;

  if (windowWithRouteTransition.__routeTransitionFrame) {
    window.cancelAnimationFrame(windowWithRouteTransition.__routeTransitionFrame);
    delete windowWithRouteTransition.__routeTransitionFrame;
  }

  if (!activePageShell) {
    clearSnapshot();
    root.dataset.routeTransitionState = "loading";
    windowWithRouteTransition.__routeTransitionFrame = window.requestAnimationFrame(() => {
      delete windowWithRouteTransition.__routeTransitionFrame;
      navigate();
    });
    return;
  }

  const hasSnapshot = mountSnapshot(activePageShell);

  root.dataset.routeTransitionState = "leaving";
  activePageShell.setAttribute("data-transition-stage", hasSnapshot ? "snapshot" : "leaving");

  windowWithRouteTransition.__routeTransitionFrame = window.requestAnimationFrame(() => {
    root.dataset.routeTransitionState = "loading";
    windowWithRouteTransition.__routeTransitionFrame = window.requestAnimationFrame(() => {
      delete windowWithRouteTransition.__routeTransitionFrame;
      navigate();
    });
  });
}
