# broccoli-rsvg [![npm version](https://img.shields.io/npm/v/broccoli-rsvg.svg?style=flat)](https://www.npmjs.org/package/broccoli-rsvg) [![npm downloads](https://img.shields.io/npm/dm/broccoli-rsvg.svg?style=flat)](https://www.npmjs.org/package/broccoli-rsvg) [![Build Status](https://img.shields.io/travis/myfreeweb/broccoli-rsvg.svg?style=flat)](https://travis-ci.org/myfreeweb/broccoli-rsvg) [![Dependency Status](https://img.shields.io/gemnasium/myfreeweb/broccoli-rsvg.svg)](https://gemnasium.com/myfreeweb/broccoli-rsvg) [![unlicense](https://img.shields.io/badge/un-license-green.svg?style=flat)](http://unlicense.org) 

This [Broccoli] plugin renders SVG files to PNG using [node-rsvg].

[Broccoli]: https://github.com/joliss/broccoli
[node-rsvg]: https://github.com/2gis/node-rsvg

## Installation

First, get librsvg:

- OS X: `brew install librsvg`
- FreeBSD: `pkg install graphics/librsvg2`
- Ubuntu/Debian: `sudo apt-get install librsvg2-dev`
- Fedora/CentOS/OpenSUSE: `sudo yum install librsvg2-devel`

Second, install as any other broccoli plugin:

```bash
npm install --save-dev broccoli-rsvg
```

## Usage

```js
var renderSvg = require('broccoli-rsvg')

var outputTree = renderSvg(inputNodes, fileOptions)
```

- **`inputNodes`**: A list of nodes (trees) that contain the SVG files you want to render.
- **`fileOptions`**: A hash of rsvg options and alternative versions for each file; see the following example.

## Example

```js
var Rsvg = require('broccoli-rsvg')

var png = new Rsvg(['svg'], {
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
          return svg.replace('#000000', '#ffffff') // You can use elementtree or xmldom here...
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
})

return [svg, png]
```

**Note**: avoid passing [broccoli-svgo] output to rsvg, it might get screwed up.

[broccoli-svgo]: https://github.com/sindresorhus/broccoli-svgo

## Contributing

Please feel free to submit pull requests!

By participating in this project you agree to follow the [Contributor Code of Conduct](http://contributor-covenant.org/version/1/4/).

## License

This is free and unencumbered software released into the public domain.  
For more information, please refer to the `UNLICENSE` file or [unlicense.org](http://unlicense.org).
