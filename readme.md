# react-native-add-font

This is a command-line utility for installing custom fonts in a React Native project.

## Features

- Rename font files to their PostScript name so it's consistent across platforms
- Create `./assets/fonts` and `./react-native.config.js` if they don't exist
- Use [react-native-assets](https://github.com/unimonkiez/react-native-asset) for easier unlinking later-on

## Usage

```
npx react-native-add-font
```

It will prompt you to provide a `ttf` font file.

## Example

```bash
$ npx react-native-add-font

What is the path to the font file? (You can drag and drop it here) /path/to/my/font.ttf

📁 Ensuring font directory exists: ./assets/fonts
🖨️ Extracted PostScript name for font: MyFont-Regular
✅ Copied font to ./assets/fonts/MyFont-Regular.ttf
📦 Running react-native-asset

After building, you can use the font like this:
{ fontFamily: "MyFont-Regular"}
Or if you use styled-components:
font-family: MyFont-Regular;
```
