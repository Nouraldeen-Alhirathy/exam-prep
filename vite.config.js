import { defineConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import { ViteMinifyPlugin } from "vite-plugin-minify";

export default defineConfig({
  plugins: [topLevelAwait(), ViteMinifyPlugin()],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: "./index.html",
        practice_quiz: "./practice_quiz.html",
        question_bank: "./question_bank.html",
        quiz_generator: "./quiz_generator.html"
      },
    },
  },
});
