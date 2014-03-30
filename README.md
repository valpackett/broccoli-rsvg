# broccoli-rsvg

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

var outputTree = compileSass(inputTree, fileOptions);
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
      }
    ]
  }
});

return [svg, png];
```

**Note**: do not pass [broccoli-svgo][] output to rsvg, it might get screwed up.

[broccoli-svgo]: https://github.com/sindresorhus/broccoli-svgo

## License

```
Copyright 2014 Greg V <floatboth@me.com>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
```

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

```
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
