import path from "path";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import vue from "@vitejs/plugin-vue";
import istanbul from "vite-plugin-istanbul";
import svgLoader from "vite-svg-loader";
import { createHtmlPlugin } from 'vite-plugin-html'
import config from "./src/mm.config.json";

import Components from "unplugin-vue-components/vite";

const pathSrc: string = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: {
        "~/": `${pathSrc}/`,
      },
    },
    server: {
      port: 5172,
      fs: {
        allow: [
          searchForWorkspaceRoot(process.cwd()),
          "/node_modules/@mdi/font/fonts",
        ],
      },
    },
    build: {
      sourcemap: false,
      target: "esnext",
      chunkSizeWarningLimit: 1000,
    },
    plugins: [
      vue(),
      svgLoader(),
      istanbul({
        cypress: true,
        requireEnv: false,
      }),
      Components({
        dirs: ["src/common", "src/mm_ui_kit/src/components"],
        // allow to autoload markdown components under `./src/components/`
        extensions: ["vue", "md"],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: "src/components.d.ts",
      }),
      createHtmlPlugin({
        minify: true,
        /**
         * After writing entry here, you will not need to add script tags in `index.html`, the original tags need to be deleted
         * @default src/main.ts
         */
        entry: 'src/main.ts',
        /**
         * If you want to store `index.html` in the specified folder, you can modify it, otherwise no configuration is required
         * @default index.html
         */
        template: 'index.html',

        /**
         * Data that needs to be injected into the index.html ejs template
         */
        inject: {
          data: {
            title: config.app.name,
            injectScript: `<script src="./inject.js"></script>`,
            robotsMeta: mode === 'development' || mode === 'staging' 
              ? `<meta name="robots" content="noindex">`
              : `<meta name="robots" content="index, follow">`,
          },
        },
      }),
    ],
    optimizeDeps: {
      include: ['dayjs', 'dayjs/plugin/utc', 'vuedraggable'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          additionalData: `
          @use "${path.resolve(__dirname, 'src/assets/scss/global.scss')}" as *;
          @use "${path.resolve(__dirname, 'src/mm_ui_kit/src/assets/scss/breakpoints.scss')}" as *;
          @use "${path.resolve(__dirname, 'src/assets/scss/tokens.scss')}" as *;
          `,
        }
      }
    },
    extract: {
      ignoreOrder: true,
    },
  }
});
