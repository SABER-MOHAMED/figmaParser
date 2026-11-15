# Figma `.fig` File Parser — Format Study & Data-Template Prototype

A local, browser-based viewer for Figma's binary `.fig` files, plus a prototype that maps parsed Figma nodes into a structured data template. I built this in 2024 while studying how Figma stores design documents on disk.

## Credits

The parser and interactive viewer (`parser.js`, `script.js`, `style.css`, `index.html`) are the work of **[Evan Wallace](https://madebyevan.com/)**, co-founder and former CTO of Figma, published at [madebyevan.com/figma/fig-file-parser](https://madebyevan.com/figma/fig-file-parser/). He also created [kiwi](https://github.com/evanw/kiwi), the schema-based binary encoding that `.fig` files use. All credit for the parser and viewer goes to him. This repository is a study of that work, not a replacement for it.

## My work

- **Analyzing the `.fig` format.** I took apart the parser and test files to understand how a design document is laid out on disk, from the raw bytes to the full node tree (summarized in [How the format works](#how-the-format-works) below).
- **Data-template prototype (`convertFigmaToStructure.js`).** I wrote a converter that turns a parsed Figma `TEXT` node into a structured, CMS-style data template. It derives:
  - a content `path` and `key` from the layer name
  - a `size` (`small` / `medium` / `large`) from the font size
  - a typographic `variant` (`h1` / `h2` / `p`) from layer-naming conventions
  - the text `value` from the node's `textData`

  The idea is to go from a designer's Figma file straight to app-ready content structure.
- **Test material.** I included a real-world sample file, `Templates.canvas.fig`, for exercising the parser.

## How the format works

What I learned from studying the parser:

1. **Header.** The first 8 bytes are a magic string: `fig-kiwi` for Figma design files or `fig-jam.` for FigJam. A little-endian `uint32` version number follows.
2. **Chunks.** The rest of the file is a sequence of length-prefixed chunks (a `uint32` length, then that many bytes). Each chunk is compressed with raw DEFLATE or, in newer files, Zstandard.
3. **Self-describing schema.** Chunk 0 is a binary [kiwi](https://github.com/evanw/kiwi) schema. Chunk 1 is the document data encoded with that schema. Because every file carries its own schema, it can be decoded without knowing Figma's internal types ahead of time.
4. **Flat node list to tree.** The decoded message holds a flat `nodeChanges` array. Each node has a `guid` (`sessionID:localID`) and a `parentIndex` that references its parent's guid plus a sort `position`. Rebuilding the document means linking children to parents and sorting siblings by position. The root node is `0:0`.
5. **Binary blobs.** Geometry is stored out-of-line in a `blobs` array and referenced by fields ending in `Blob`:
   - `commands`: a byte-coded path (`0`=Z, `1`=M, `2`=L, `3`=Q, `4`=C) followed by `float32` coordinates
   - `vectorNetwork`: vertex, segment, and region tables with Bézier tangents, style IDs, and winding rules

Since this is an undocumented internal format, Figma can change it at any time.

## Running locally

```bash
npm i -g http-server
http-server
```

Then open the printed URL and drop a `.fig` file onto the page. To get one, use **File → Save local copy…** in Figma.

Do **not** run `npm install`. The dependencies are vendored in `node_modules/` and loaded directly by `index.html`.

To try the data-template prototype:

```bash
node convertFigmaToStructure.js
```

## Known issues

`index.html` no longer includes the original "Load an example" button, but `script.js` still looks for it (`#example`). As a result the script stops with an error on load and upload doesn't work. Restoring the button or removing its handler in `script.js` fixes this.

## Project structure

| File | Description |
| --- | --- |
| `parser.js` | `.fig` decoder (Evan Wallace) |
| `script.js` | Interactive viewer and JSON export (Evan Wallace) |
| `index.html`, `style.css` | Viewer UI (Evan Wallace) |
| `convertFigmaToStructure.js` | Figma node to data-template converter (my work) |
| `Templates.canvas.fig` | Sample Figma file |
| `node_modules/` | Vendored browser dependencies |
