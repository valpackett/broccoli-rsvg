# broccoli-rsvg [![npm version](https://img.shields.io/npm/v/broccoli-rsvg.svg?style=flat)](https://www.npmjs.org/package/broccoli-rsvg) [![npm downloads](https://img.shields.io/npm/dm/broccoli-rsvg.svg?style=flat)](https://www.npmjs.org/package/broccoli-rsvg) [![WTFPL](https://img.shields.io/badge/license-WTFPL-brightgreen.svg?style=flat)](https://www.tldrlegal.com/l/wtfpl)

This [Broccoli][] plugin renders SVG files to PNG using [node-rsvg][].

[Broccoli]: https://github.com/joliss/broccoli
[node-rsvg]: https://github.com/walling/node-rsvg

## Installation

First, get librsvg:

- OS X: `brew install librsvg`
- FreeBSD: `pkg install graphics/librsvg2`
- Ubuntu/Debian: `sudo apt-get install librsvg2-dev`
- Fedora/CentOS/OpenSUSE: `sudo yum install librsvg2-devel`

Second, install as any other broccoli plugin:

```bash
export PKG_CONFIG_PATH=/opt/X11/lib/pkgconfig # on OS X
npm install --save-dev broccoli-rsvg
```

## Usage

```js
var renderSvg = require('broccoli-rsvg');

var outputTree = renderSvg(inputTree, fileOptions);
```

- **`inputTree`**: A tree that contains the SVG files you want to render.
- **`fileOptions`**: A hash of rsvg options and alternative versions for each file; see the following example.

## Example

```js
var renderSvg = require('broccoli-rsvg');

var png = renderSvg("svg", {
  'logo.svg': {
    width: 600,
    height: 500, // optional override, values from the svg file itself are used by default
    versions: [
      { // Retina version example
        path: 'logo@2x.png',
        width: 1200,
        height: 1000
      },
      { // Transformed version example
        transformer: function(svg) {
          return svg.replace('#000000', '#ffffff'); // You can use elementtree or xmldom here...
        },
        path: 'logo-black.png',
        versions: [
          { // Nested example: transformed + retina
            path: 'logo-black@2x.png',
            width: 1200,
            height: 1000
          }
        ]
      }
    ]
  }
});

return [svg, png];
```

**Note**: do not pass [broccoli-svgo][] output to rsvg, it might get screwed up.

[broccoli-svgo]: https://github.com/sindresorhus/broccoli-svgo

## License

Copyright © 2014 [myfreeweb](https://github.com/myfreeweb)
This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the COPYING file for more details.
