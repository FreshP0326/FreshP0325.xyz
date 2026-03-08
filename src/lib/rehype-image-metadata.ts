import { visit } from "unist-util-visit";
import { getPublicImageDimensions } from "@/lib/image-dimensions";

export function rehypeImageMetadata() {
  return (tree: unknown) => {
    visit(tree, "element", (node: any) => {
      if (node?.tagName !== "img") {
        return;
      }

      const src = node.properties?.src;

      if (typeof src !== "string" || !src.startsWith("/")) {
        return;
      }

      if (node.properties?.width && node.properties?.height) {
        return;
      }

      const dimensions = getPublicImageDimensions(src);

      if (!dimensions) {
        return;
      }

      node.properties = {
        ...node.properties,
        width: dimensions.width,
        height: dimensions.height,
      };
    });
  };
}
