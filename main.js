#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const FontName = require("fontname");
const color = require("cli-color");
const { spawnSync } = require("child_process");
const highlight = require("cli-highlight").highlight;
const prompts = require("prompts");

main();

const fontDirectory = "./assets/fonts";

async function main() {
  let { fontPath } = await prompts({
    type: "text",
    name: "fontPath",
    message:
      "What is the path to the font file? (You can drag and drop it here)",
  });
  fontPath = fontPath.replace(/\\/g, "");

  ensureConfigFile();

  console.log(
    "📁 Ensuring font directory exists:",
    color.cyanBright(fontDirectory)
  );
  fs.mkdirSync(fontDirectory, { recursive: true });

  const { postScriptName } = FontName.parse(fs.readFileSync(fontPath))[0];
  console.log(
    "🖨️  Extracted PostScript name for font:",
    color.red(postScriptName)
  );
  const targetFile = `${fontDirectory}/${postScriptName}.ttf`;
  fs.cpSync(fontPath, targetFile);
  console.log(`✅ Copied font to ${color.cyanBright(targetFile)}`);

  console.log("📦 Running react-native-asset");
  spawnSync("npx", ["react-native-asset"], { stdio: "inherit" });

  console.log();

  console.log(`After building, you can use the font like this:
    ${highlightJs(`{ fontFamily: "${postScriptName}"}`)}
    Or if you use styled-components:
    ${color.cyanBright("font-family:")} ${color.red(postScriptName)};
    `);
}

function ensureConfigFile() {
  try {
    const reactNativeConfig = require(path.join(
      process.cwd(),
      "react-native.config.js"
    ));
    if (!includesDirectory(reactNativeConfig.assets, fontDirectory)) {
      console.log(
        `🛑 react-native.config.js does not include ${fontDirectory}. Add it and run again.`
      );
      process.exit(1);
    }
  } catch (e) {
    console.log("👀 react-native.config.js not found");
    const reactNativeConfig = `module.exports = {
        assets: ["${fontDirectory}"],
      };
      `;
    fs.writeFileSync("react-native.config.js", reactNativeConfig);
    console.log("✅ Created react-native.config.js");
  }
}

function highlightJs(code) {
  return highlight(code, { language: "js" });
}

function includesDirectory(listOfDirectories, directory) {
  return listOfDirectories
    .map((directory) => directory.replace(/\/$/, ""))
    .includes(directory.replace(/\/$/, ""));
}
