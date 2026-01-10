import { defineMarkdocConfig, component } from "@astrojs/markdoc/config";

export default defineMarkdocConfig({
  tags: {
    slide: {
      render: component("./src/components/slides/Slide.astro"),
      attributes: {
        type: { type: String },
        title: { type: String },
      },
    },
  },
});
