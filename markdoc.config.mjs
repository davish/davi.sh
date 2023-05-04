import { defineMarkdocConfig } from "@astrojs/markdoc/config";
import Slide from "./src/components/slides/Slide.astro";

export default defineMarkdocConfig({
  tags: {
    slide: {
      render: Slide,
      attributes: {
        type: { type: String },
        title: { type: String },
      },
    },
  },
});
