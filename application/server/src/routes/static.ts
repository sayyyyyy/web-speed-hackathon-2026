import history from "connect-history-api-fallback";
import { Router } from "express";
import serveStatic from "serve-static";

import {
  CLIENT_DIST_PATH,
  PUBLIC_PATH,
  UPLOAD_PATH,
} from "@web-speed-hackathon-2026/server/src/paths";

export const staticRouter = Router();

// 1. UPLOAD_PATH (Uploaded images/videos)
staticRouter.use(
  serveStatic(UPLOAD_PATH, {
    setHeaders: (res, path) => {
      if (path.includes("/images/") || path.includes("/movies/") || path.includes("/sounds/")) {
        res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
      }
    },
  }),
);

// 2. PUBLIC_PATH (Static assets like profile images)
staticRouter.use(
  serveStatic(PUBLIC_PATH, {
    setHeaders: (res, path) => {
      if (path.includes("/images/")) {
        res.setHeader("Cache-Control", "public, max-age=86400");
      }
    },
  }),
);

// 3. CLIENT_DIST_PATH (Compiled JS/CSS)
staticRouter.use(
  serveStatic(CLIENT_DIST_PATH, {
    index: false,
    setHeaders: (res, path) => {
      // Hashed assets (scripts and styles)
      if (path.match(/\.[a-f0-9]{20}\.(js|css)$/)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else {
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      }
    },
  }),
);

// 4. SPA 対応のため、最後に index.html を返す
staticRouter.use(history());
