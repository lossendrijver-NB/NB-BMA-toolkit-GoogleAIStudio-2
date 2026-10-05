import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const assetsDir = path.join(distDir, "assets");

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Find compiled JS and CSS
let jsFile = "index.js";
let cssFile = "styles.css";

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  const foundJs = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));
  const foundCss = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));
  if (foundJs) jsFile = foundJs;
  if (foundCss) cssFile = foundCss;
}

const htmlContent = `<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>NOBEARS Kennisbank</title>
    <meta name="description" content="Ambities, diensten en cases van NOBEARS Amersfoort." />
    <meta property="og:title" content="NOBEARS Kennisbank" />
    <meta property="og:description" content="Ambities, diensten en cases van NOBEARS Amersfoort." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" />
    <link rel="stylesheet" href="/assets/${cssFile}" />
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${jsFile}"></script>
  </body>
</html>
`;

fs.writeFileSync(path.join(distDir, "index.html"), htmlContent, "utf8");
fs.writeFileSync(path.join(distDir, "404.html"), htmlContent, "utf8");

console.log("Postbuild: successfully generated dist/index.html and dist/404.html referencing", {
  jsFile,
  cssFile,
});
