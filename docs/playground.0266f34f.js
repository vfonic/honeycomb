// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"playground/tiles.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TILES = exports.TILE_SIX = exports.TILE_FIVE = exports.TILE_FOUR = exports.TILE_THREE = exports.TILE_TWO = exports.TILE_ONE = exports.WC = exports.SC = exports.MC = exports.FC = exports.WB = exports.MB = exports.FB = exports.DB = exports.W = exports.S = exports.M = exports.F = exports.D = void 0;
const D = 'desert',
      F = 'forest',
      M = 'mountain',
      S = 'swamp',
      W = 'water',
      DB = 'desert bears',
      FB = 'forest bears',
      MB = 'mountain bears',
      WB = 'water bears',
      FC = 'forest cougars',
      MC = 'mountain cougars',
      SC = 'swamp cougars',
      WC = 'water cougars';
exports.WC = WC;
exports.SC = SC;
exports.MC = MC;
exports.FC = FC;
exports.WB = WB;
exports.MB = MB;
exports.FB = FB;
exports.DB = DB;
exports.W = W;
exports.S = S;
exports.M = M;
exports.F = F;
exports.D = D;
const TILE_ONE = [W, W, W, W, F, F, S, S, W, D, F, F, S, S, D, DB, DB, FB];
exports.TILE_ONE = TILE_ONE;
const TILE_TWO = [SC, FC, FC, F, F, F, S, S, F, D, D, D, S, M, M, M, M, D];
exports.TILE_TWO = TILE_TWO;
const TILE_THREE = [S, S, F, F, F, W, SC, SC, F, M, W, W, MC, M, M, M, W, W];
exports.TILE_THREE = TILE_THREE;
const TILE_FOUR = [D, D, M, M, M, M, D, D, M, W, W, WC, D, D, D, F, F, FC];
exports.TILE_FOUR = TILE_FOUR;
const TILE_FIVE = [S, S, S, M, M, M, S, D, D, W, M, MB, D, D, W, W, WB, WB];
exports.TILE_FIVE = TILE_FIVE;
const TILE_SIX = [DB, D, S, S, S, F, MB, M, S, S, F, F, M, W, W, W, W, F];
exports.TILE_SIX = TILE_SIX;
const TILES = [TILE_ONE, TILE_TWO, TILE_THREE, TILE_FOUR, TILE_FIVE, TILE_SIX]; // def upside_down(tile_number)
//   TILES[tile_number].reverse
// end

exports.TILES = TILES;
},{}],"playground/render.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.renderAll = void 0;

var _tiles = require("./tiles");

// declare const SVG: any
// const draw = SVG().addTo('.js-map').size('100%', '100%')
const mapWrapperEl = document.querySelector('.js-map');

if (!mapWrapperEl) {
  throw new Error('Map element not found');
}

const renderAll = hexes => {
  mapWrapperEl.innerHTML = `
    <svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='555px' height='494px'>
      <g>
        ${hexes.map(hex => render(hex)).join('')}
      </g>
    </svg>
  `;
};

exports.renderAll = renderAll;

const fillHexagon = hex => {
  var _hex$terrain, _hex$terrain2, _hex$terrain3, _hex$terrain4, _hex$terrain5;

  let fill = 'none';

  if ((_hex$terrain = hex.terrain) !== null && _hex$terrain !== void 0 && _hex$terrain.includes(_tiles.F)) {
    fill = '#009900';
  } else if ((_hex$terrain2 = hex.terrain) !== null && _hex$terrain2 !== void 0 && _hex$terrain2.includes(_tiles.W)) {
    fill = '#2596be';
  } else if ((_hex$terrain3 = hex.terrain) !== null && _hex$terrain3 !== void 0 && _hex$terrain3.includes(_tiles.D)) {
    fill = '#ffcc00';
  } else if ((_hex$terrain4 = hex.terrain) !== null && _hex$terrain4 !== void 0 && _hex$terrain4.includes(_tiles.M)) {
    fill = 'gray';
  } else if ((_hex$terrain5 = hex.terrain) !== null && _hex$terrain5 !== void 0 && _hex$terrain5.includes(_tiles.S)) {
    fill = 'purple';
  } // const polygon = draw.polygon(hex.corners.map(({ x, y }) => `${x},${y}`)).fill(fill)
  // draw.group().add(polygon)


  return ` 
    <polygon points='${hex.corners.map(({
    x,
    y
  }) => `${x},${y}`).join(',')}' fill='${fill}'></polygon>
  `;
};

const BORDER_DISTANCE = 3;
const DX = [-0.75, -1, -0.75, 0.75, 1, 0.75];
const DY = [0.75, 0, -0.75, -0.75, 0, 0.75];

const addBearsAndCougars = hex => {
  var _hex$terrain6, _hex$terrain7, _hex$terrain8, _hex$terrain9;

  if (!((_hex$terrain6 = hex.terrain) !== null && _hex$terrain6 !== void 0 && _hex$terrain6.includes('bears')) && !((_hex$terrain7 = hex.terrain) !== null && _hex$terrain7 !== void 0 && _hex$terrain7.includes('cougars'))) {
    return;
  }

  const stroke = {
    width: 1.5
  };

  if ((_hex$terrain8 = hex.terrain) !== null && _hex$terrain8 !== void 0 && _hex$terrain8.includes('bears')) {
    stroke.color = '#000';
    stroke.dasharray = 4;
  } else if ((_hex$terrain9 = hex.terrain) !== null && _hex$terrain9 !== void 0 && _hex$terrain9.includes('cougars')) {
    stroke.color = '#c00';
  } // const polygon2 = draw
  //   .polygon(
  //     hex.corners.map(({ x, y }, i) => {
  //       x += BORDER_DISTANCE * DX[i]
  //       y += BORDER_DISTANCE * DY[i]
  //       return `${x},${y}`
  //     }),
  //   )
  //   .fill('none')
  //   .stroke(stroke)
  // draw.group().add(polygon2)


  return `
    <polygon points='${hex.corners.map(({
    x,
    y
  }, i) => {
    x += BORDER_DISTANCE * DX[i];
    y += BORDER_DISTANCE * DY[i];
    return `${x},${y}`;
  })}' fill='none' stroke-width='1.5' stroke='${stroke.color}' />
  `;
};

const addCoordinates = hex => {
  // const text = draw
  //   .text(`${hex.q},${hex.r}`)
  //   // .text(`${hex.col},${hex.row}`)
  //   .font({
  //     size: hex.width * 0.25,
  //     anchor: 'middle',
  //     'dominant-baseline': 'central',
  //     leading: 0,
  //   })
  //   .translate(hex.x, hex.y)
  // draw.add(text)
  return `
    <text font-size='${hex.width * 0.25}' text-anchor='middle' dominant-baseline='central' transform='matrix(1,0,0,1,${hex.x},${hex.y})'>
      <tspan dy='0' x='0'>${hex.q},${hex.r}</tspan>
    </text>
  `;
};

const render = hex => {
  let result = '';
  result += fillHexagon(hex);
  result += addBearsAndCougars(hex);
  result += addCoordinates(hex);
  return result;
};

exports.render = render;
},{"./tiles":"playground/tiles.ts"}],"src/compass/compass.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Compass = exports.CompassDirection = exports.OrdinalCompassDirection = exports.CardinalCompassDirection = void 0;
var CardinalCompassDirection;
exports.CardinalCompassDirection = CardinalCompassDirection;

(function (CardinalCompassDirection) {
  CardinalCompassDirection[CardinalCompassDirection["N"] = 0] = "N";
  CardinalCompassDirection[CardinalCompassDirection["E"] = 2] = "E";
  CardinalCompassDirection[CardinalCompassDirection["S"] = 4] = "S";
  CardinalCompassDirection[CardinalCompassDirection["W"] = 6] = "W";
})(CardinalCompassDirection || (exports.CardinalCompassDirection = CardinalCompassDirection = {}));

var OrdinalCompassDirection;
exports.OrdinalCompassDirection = OrdinalCompassDirection;

(function (OrdinalCompassDirection) {
  OrdinalCompassDirection[OrdinalCompassDirection["NE"] = 1] = "NE";
  OrdinalCompassDirection[OrdinalCompassDirection["SE"] = 3] = "SE";
  OrdinalCompassDirection[OrdinalCompassDirection["SW"] = 5] = "SW";
  OrdinalCompassDirection[OrdinalCompassDirection["NW"] = 7] = "NW";
})(OrdinalCompassDirection || (exports.OrdinalCompassDirection = OrdinalCompassDirection = {}));

var CompassDirection;
exports.CompassDirection = CompassDirection;

(function (CompassDirection) {
  CompassDirection[CompassDirection["N"] = 0] = "N";
  CompassDirection[CompassDirection["NE"] = 1] = "NE";
  CompassDirection[CompassDirection["E"] = 2] = "E";
  CompassDirection[CompassDirection["SE"] = 3] = "SE";
  CompassDirection[CompassDirection["S"] = 4] = "S";
  CompassDirection[CompassDirection["SW"] = 5] = "SW";
  CompassDirection[CompassDirection["W"] = 6] = "W";
  CompassDirection[CompassDirection["NW"] = 7] = "NW";
})(CompassDirection || (exports.CompassDirection = CompassDirection = {}));

class Compass {
  constructor(direction = CompassDirection.N) {
    this.direction = typeof direction === 'number' ? direction : CompassDirection[direction];
  }

  static of(direction = CompassDirection.N) {
    return new Compass(direction);
  }

  static isCardinal(direction) {
    return !!CardinalCompassDirection[direction];
  }

  static isOrdinal(direction) {
    return !!OrdinalCompassDirection[direction];
  }

  static rotate(direction, steps) {
    return signedModulo(direction + steps, 8);
  }

  isCardinal() {
    return Compass.isCardinal(this.direction);
  }

  isOrdinal() {
    return Compass.isOrdinal(this.direction);
  }

  rotate(steps) {
    return Compass.rotate(this.direction, steps);
  }

}

exports.Compass = Compass;
Compass.N = CompassDirection.N;
Compass.NE = CompassDirection.NE;
Compass.E = CompassDirection.E;
Compass.SE = CompassDirection.SE;
Compass.S = CompassDirection.S;
Compass.SW = CompassDirection.SW;
Compass.W = CompassDirection.W;
Compass.NW = CompassDirection.NW; // todo: move to utils?

function signedModulo(dividend, divisor) {
  return (dividend % divisor + divisor) % divisor;
}
},{}],"src/compass/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _compass = require("./compass");

Object.keys(_compass).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _compass[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _compass[key];
    }
  });
});
},{"./compass":"src/compass/compass.ts"}],"src/grid/functions/flatTraverse.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flatTraverse = void 0;

// todo: rename?
const flatTraverse = traversers => (cursor, getHex) => {
  if (!Array.isArray(traversers)) {
    return Array.from(traversers(cursor, getHex));
  }

  const nextHexes = [];

  for (const traverser of traversers) {
    for (const nextCursor of traverser(cursor, getHex)) {
      cursor = nextCursor;
      nextHexes.push(cursor);
    }
  }

  return nextHexes;
};

exports.flatTraverse = flatTraverse;
},{}],"src/grid/functions/inStore.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inStore = void 0;

const inStore = (hex, grid) => grid.store.has(hex.toString());

exports.inStore = inStore;
},{}],"src/utils/isObject.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isObject = void 0;

/**
 * In TypeScript: pass a type variable to isObject() for best result. E.g.: `isObject<MyObject>(value)`
 */
const isObject = value => typeof value === 'object' && value !== null;

exports.isObject = isObject;
},{}],"src/utils/isAxial.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAxial = void 0;

var _isObject = require("./isObject");

const isAxial = value => (0, _isObject.isObject)(value) && Number.isFinite(value.q) && Number.isFinite(value.r);

exports.isAxial = isAxial;
},{"./isObject":"src/utils/isObject.ts"}],"src/utils/isFunction.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFunction = void 0;

const isFunction = value => typeof value === 'function';

exports.isFunction = isFunction;
},{}],"src/utils/isOffset.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isOffset = void 0;

var _isObject = require("./isObject");

const isOffset = value => (0, _isObject.isObject)(value) && Number.isFinite(value.col) && Number.isFinite(value.row);

exports.isOffset = isOffset;
},{"./isObject":"src/utils/isObject.ts"}],"src/utils/isPoint.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPoint = void 0;

var _isObject = require("./isObject");

const isPoint = value => (0, _isObject.isObject)(value) && Number.isFinite(value.x) && Number.isFinite(value.y);

exports.isPoint = isPoint;
},{"./isObject":"src/utils/isObject.ts"}],"src/utils/offsetFromZero.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.offsetFromZero = void 0;

// todo: rename (also rename offset)?
// todo: change to https://www.redblobgames.com/grids/hexagons/#conversions-offset
const offsetFromZero = (offset, distance) => distance + offset * (distance & 1) >> 1;

exports.offsetFromZero = offsetFromZero;
},{}],"src/utils/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isAxial = require("./isAxial");

Object.keys(_isAxial).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _isAxial[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _isAxial[key];
    }
  });
});

var _isFunction = require("./isFunction");

Object.keys(_isFunction).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _isFunction[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _isFunction[key];
    }
  });
});

var _isObject = require("./isObject");

Object.keys(_isObject).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _isObject[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _isObject[key];
    }
  });
});

var _isOffset = require("./isOffset");

Object.keys(_isOffset).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _isOffset[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _isOffset[key];
    }
  });
});

var _isPoint = require("./isPoint");

Object.keys(_isPoint).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _isPoint[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _isPoint[key];
    }
  });
});

var _offsetFromZero = require("./offsetFromZero");

Object.keys(_offsetFromZero).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _offsetFromZero[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _offsetFromZero[key];
    }
  });
});
},{"./isAxial":"src/utils/isAxial.ts","./isFunction":"src/utils/isFunction.ts","./isObject":"src/utils/isObject.ts","./isOffset":"src/utils/isOffset.ts","./isPoint":"src/utils/isPoint.ts","./offsetFromZero":"src/utils/offsetFromZero.ts"}],"src/hex/functions/offsetToAxial.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.offsetToAxial = exports.offsetToAxialFlat = exports.offsetToAxialPointy = void 0;

var _utils = require("../../utils");

const offsetToAxialPointy = (col, row, offset) => ({
  q: col - (0, _utils.offsetFromZero)(offset, row),
  r: row
});

exports.offsetToAxialPointy = offsetToAxialPointy;

const offsetToAxialFlat = (col, row, offset) => ({
  q: col,
  r: row - (0, _utils.offsetFromZero)(offset, col)
});

exports.offsetToAxialFlat = offsetToAxialFlat;

const offsetToAxial = ({
  col,
  row
}, {
  offset,
  isPointy
}) => isPointy ? offsetToAxialPointy(col, row, offset) : offsetToAxialFlat(col, row, offset);

exports.offsetToAxial = offsetToAxial;
},{"../../utils":"src/utils/index.ts"}],"src/hex/functions/cloneHex.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloneHex = void 0;

var _utils = require("../../utils");

var _offsetToAxial = require("./offsetToAxial");

const cloneHex = (hex, newProps = {}) => {
  if ((0, _utils.isOffset)(newProps)) {
    const {
      col,
      row,
      ...otherProps
    } = newProps;
    const coordinates = (0, _offsetToAxial.offsetToAxial)({
      col,
      row
    }, hex);
    return Object.assign(Object.create(Object.getPrototypeOf(hex)), hex, coordinates, otherProps);
  }

  return Object.assign(Object.create(Object.getPrototypeOf(hex)), hex, newProps);
};

exports.cloneHex = cloneHex;
},{"../../utils":"src/utils/index.ts","./offsetToAxial":"src/hex/functions/offsetToAxial.ts"}],"src/hex/types.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Orientations = void 0;
// todo: move types to single file in /src
// tried it and somehow typescript can't call origin as a function anymore in createHexPrototype.ts normalizeOrigin()
const Orientations = {
  FLAT: 'FLAT',
  POINTY: 'POINTY'
};
exports.Orientations = Orientations;
},{}],"src/hex/functions/height.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.height = exports.heightFlat = exports.heightPointy = void 0;

var _types = require("../types");

const heightPointy = yRadius => yRadius * 2;

exports.heightPointy = heightPointy;

const heightFlat = yRadius => yRadius * Math.sqrt(3);

exports.heightFlat = heightFlat;

const height = ({
  orientation,
  dimensions: {
    yRadius
  }
}) => orientation === _types.Orientations.POINTY ? heightPointy(yRadius) : heightFlat(yRadius);

exports.height = height;
},{"../types":"src/hex/types.ts"}],"src/hex/functions/hexToPoint.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hexToPoint = void 0;

var _types = require("../types");

const hexToPoint = ({
  orientation,
  dimensions: {
    xRadius,
    yRadius
  },
  origin: {
    x,
    y
  },
  q,
  r
}) => orientation === _types.Orientations.POINTY ? {
  x: xRadius * Math.sqrt(3) * (q + r / 2) - x,
  y: yRadius * 3 / 2 * r - y
} : {
  x: xRadius * 3 / 2 * q - x,
  y: yRadius * Math.sqrt(3) * (r + q / 2) - y
};

exports.hexToPoint = hexToPoint;
},{"../types":"src/hex/types.ts"}],"src/hex/functions/isHex.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isHex = void 0;

var _utils = require("../../utils");

const isHex = value => (0, _utils.isObject)(value) && !!Object.getPrototypeOf(value).__isHoneycombHex;

exports.isHex = isHex;
},{"../../utils":"src/utils/index.ts"}],"src/hex/functions/width.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.width = exports.widthFlat = exports.widthPointy = void 0;

var _types = require("../types");

const widthPointy = xRadius => xRadius * Math.sqrt(3);

exports.widthPointy = widthPointy;

const widthFlat = xRadius => xRadius * 2;

exports.widthFlat = widthFlat;

const width = ({
  orientation,
  dimensions: {
    xRadius
  }
}) => orientation === _types.Orientations.POINTY ? widthPointy(xRadius) : widthFlat(xRadius);

exports.width = width;
},{"../types":"src/hex/types.ts"}],"src/hex/functions/corners.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.corners = corners;
exports.cornersFlat = exports.cornersPointy = void 0;

var _types = require("../types");

var _height = require("./height");

var _hexToPoint = require("./hexToPoint");

var _isHex = require("./isHex");

var _width = require("./width");

const cornersPointy = (width, height, {
  x,
  y
}) => [{
  x: x + width * 0.5,
  y: y - height * 0.25
}, {
  x: x + width * 0.5,
  y: y + height * 0.25
}, {
  x,
  y: y + height * 0.5
}, {
  x: x - width * 0.5,
  y: y + height * 0.25
}, {
  x: x - width * 0.5,
  y: y - height * 0.25
}, {
  x,
  y: y - height * 0.5
}];

exports.cornersPointy = cornersPointy;

const cornersFlat = (width, height, {
  x,
  y
}) => [{
  x: x + width * 0.25,
  y: y - height * 0.5
}, {
  x: x + width * 0.5,
  y
}, {
  x: x + width * 0.25,
  y: y + height * 0.5
}, {
  x: x - width * 0.25,
  y: y + height * 0.5
}, {
  x: x - width * 0.5,
  y
}, {
  x: x - width * 0.25,
  y: y - height * 0.5
}];

exports.cornersFlat = cornersFlat;

function corners(hexOrHexSettings) {
  const {
    orientation,
    dimensions: {
      xRadius,
      yRadius
    }
  } = hexOrHexSettings;
  const point = (0, _isHex.isHex)(hexOrHexSettings) ? (0, _hexToPoint.hexToPoint)(hexOrHexSettings) : hexOrHexSettings.origin;
  return orientation === _types.Orientations.POINTY ? cornersPointy((0, _width.widthPointy)(xRadius), (0, _height.heightPointy)(yRadius), point) : cornersFlat((0, _width.widthFlat)(xRadius), (0, _height.heightFlat)(yRadius), point);
}
},{"../types":"src/hex/types.ts","./height":"src/hex/functions/height.ts","./hexToPoint":"src/hex/functions/hexToPoint.ts","./isHex":"src/hex/functions/isHex.ts","./width":"src/hex/functions/width.ts"}],"src/hex/functions/createHex.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHex = void 0;

var _utils = require("../../utils");

var _isHex = require("./isHex");

var _offsetToAxial = require("./offsetToAxial");

const createHex = (prototypeOrHex, props = {
  q: 0,
  r: 0
}) => {
  if ((0, _isHex.isHex)(prototypeOrHex)) {
    return prototypeOrHex.clone(props);
  }

  if ((0, _utils.isOffset)(props)) {
    const {
      col,
      row,
      ...otherProps
    } = props;
    const coordinates = (0, _offsetToAxial.offsetToAxial)({
      col,
      row
    }, prototypeOrHex);
    return Object.assign(Object.create(prototypeOrHex), coordinates, otherProps);
  }

  return Object.assign(Object.create(prototypeOrHex), props);
};

exports.createHex = createHex;
},{"../../utils":"src/utils/index.ts","./isHex":"src/hex/functions/isHex.ts","./offsetToAxial":"src/hex/functions/offsetToAxial.ts"}],"src/hex/functions/equals.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.equals = void 0;

var _utils = require("../../utils");

const equals = (a, b) => // when the 2nd coordinates is axial, assume the first is too
// when equals() is used as a hex method, the 1st coordinates is that of the hex itself which is always axial
(0, _utils.isAxial)(b) ? equalsAxial(a, b) : equalsOffset(a, b);

exports.equals = equals;

function equalsAxial(a, b) {
  return a.q === b.q && a.r === b.r;
}

function equalsOffset(a, b) {
  return a.col === b.col && a.row === b.row;
}
},{"../../utils":"src/utils/index.ts"}],"src/hex/functions/hexToOffset.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hexToOffset = exports.hexToOffsetFlat = exports.hexToOffsetPointy = void 0;

var _utils = require("../../utils");

const hexToOffsetPointy = (q, r, offset) => ({
  col: q + (0, _utils.offsetFromZero)(offset, r),
  row: r
});

exports.hexToOffsetPointy = hexToOffsetPointy;

const hexToOffsetFlat = (q, r, offset) => ({
  col: q,
  row: r + (0, _utils.offsetFromZero)(offset, q)
});

exports.hexToOffsetFlat = hexToOffsetFlat;

const hexToOffset = ({
  q,
  r,
  offset,
  isPointy
}) => isPointy ? hexToOffsetPointy(q, r, offset) : hexToOffsetFlat(q, r, offset);

exports.hexToOffset = hexToOffset;
},{"../../utils":"src/utils/index.ts"}],"src/hex/functions/isFlat.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFlat = void 0;

var _types = require("../types");

const isFlat = ({
  orientation
}) => orientation === _types.Orientations.FLAT;

exports.isFlat = isFlat;
},{"../types":"src/hex/types.ts"}],"src/hex/functions/isPointy.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPointy = void 0;

var _types = require("../types");

const isPointy = ({
  orientation
}) => orientation === _types.Orientations.POINTY;

exports.isPointy = isPointy;
},{"../types":"src/hex/types.ts"}],"src/hex/functions/toString.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toString = void 0;

const toString = ({
  q,
  r
}) => `${q},${r}`;

exports.toString = toString;
},{}],"src/hex/functions/createHexPrototype.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHexPrototype = exports.defaultHexSettings = void 0;

var _utils = require("../../utils");

var _types = require("../types");

var _cloneHex = require("./cloneHex");

var _corners = require("./corners");

var _equals = require("./equals");

var _height = require("./height");

var _hexToOffset = require("./hexToOffset");

var _hexToPoint = require("./hexToPoint");

var _isFlat = require("./isFlat");

var _isPointy = require("./isPointy");

var _toString = require("./toString");

var _width = require("./width");

const defaultHexSettings = {
  dimensions: {
    xRadius: 1,
    yRadius: 1
  },
  orientation: _types.Orientations.POINTY,
  origin: {
    x: 0,
    y: 0
  },
  offset: -1
};
exports.defaultHexSettings = defaultHexSettings;

const createHexPrototype = options => {
  // pseudo private property
  const s = new WeakMap();
  const prototype = { ...defaultHexSettings,

    clone(newProps) {
      return (0, _cloneHex.cloneHex)(this, newProps);
    },

    equals(coordinates) {
      return (0, _equals.equals)(this, coordinates);
    },

    toString() {
      return (0, _toString.toString)(this);
    },

    // todo: add to docs that any of the above methods will be overwritten when present in customPrototype
    ...options
  }; // use Object.defineProperties() to create readonly properties
  // origin is set in the final "step"

  Object.defineProperties(prototype, {
    [Symbol.toStringTag]: {
      value: 'Hex'
    },
    __isHoneycombHex: {
      value: true,
      writable: false
    },
    // todo: all props set with `value` are writable (somehow the default `writable: false` doesn't apply). Not sure if this is a problem though
    // see: Object.getOwnPropertyDescriptors(hexPrototype)
    col: {
      get() {
        return (0, _hexToOffset.hexToOffset)(this).col;
      }

    },
    corners: {
      get() {
        return (0, _corners.corners)(this);
      }

    },
    dimensions: {
      value: normalizeDimensions(prototype)
    },
    height: {
      get() {
        return (0, _height.height)(this);
      }

    },
    isFlat: {
      get() {
        return (0, _isFlat.isFlat)(this);
      }

    },
    isPointy: {
      get() {
        return (0, _isPointy.isPointy)(this);
      }

    },
    orientation: {
      value: normalizeOrientation(prototype)
    },
    offset: {
      value: assertOffset(prototype)
    },
    row: {
      get() {
        return (0, _hexToOffset.hexToOffset)(this).row;
      }

    },
    s: {
      get() {
        return Number.isFinite(s.get(this)) ? s.get(this) : -this.q - this.r;
      },

      set(_s) {
        s.set(this, _s);
      }

    },
    width: {
      get() {
        return (0, _width.width)(this);
      }

    },
    x: {
      get() {
        return (0, _hexToPoint.hexToPoint)(this).x;
      }

    },
    y: {
      get() {
        return (0, _hexToPoint.hexToPoint)(this).y;
      }

    }
  });
  return Object.defineProperties(prototype, {
    origin: {
      value: normalizeOrigin(prototype)
    }
  });
};

exports.createHexPrototype = createHexPrototype;

function normalizeDimensions(prototype) {
  const {
    dimensions
  } = prototype;

  if ((0, _utils.isObject)(dimensions)) {
    if (dimensions.xRadius > 0 && dimensions.yRadius > 0) {
      return { ...dimensions
      };
    }

    const {
      width,
      height
    } = dimensions;

    if (width > 0 && height > 0) {
      return normalizeOrientation(prototype) === _types.Orientations.POINTY ? {
        xRadius: width / Math.sqrt(3),
        yRadius: height / 2
      } : {
        xRadius: width / 2,
        yRadius: height / Math.sqrt(3)
      };
    }
  }

  if (dimensions > 0) {
    return {
      xRadius: dimensions,
      yRadius: dimensions
    };
  }

  throw new TypeError(`Invalid dimensions: ${dimensions}. Dimensions must be expressed as an Ellipse ({ xRadius: number, yRadius: number }), a Rectangle ({ width: number, height: number }) or a number.`);
}

function normalizeOrientation({
  orientation
}) {
  orientation = orientation;

  if (orientation === _types.Orientations.POINTY || orientation === _types.Orientations.FLAT) {
    return orientation;
  }

  throw new TypeError(`Invalid orientation: ${orientation}. Orientation must be either 'POINTY' or 'FLAT'.`);
}

function assertOffset({
  offset
}) {
  if (!Number.isFinite(offset)) {
    throw new TypeError(`Invalid offset: ${offset}. Offset must be a number.`);
  }

  return offset;
} // origin can be a function that will be called with the almost-complete hex prototype (complete except for origin)


function normalizeOrigin(prototype) {
  const {
    origin
  } = prototype;

  if ((0, _utils.isPoint)(origin)) {
    return { ...origin
    };
  }

  if (origin === 'topLeft') {
    return {
      x: prototype.width * -0.5,
      y: prototype.height * -0.5
    };
  }

  if ((0, _utils.isFunction)(origin)) {
    return origin(prototype);
  }

  throw new TypeError(`Invalid origin: ${origin}. Origin must be expressed as a Point ({ x: number, y: number }), 'topLeft' or a function that returns a Point.`);
}
},{"../../utils":"src/utils/index.ts","../types":"src/hex/types.ts","./cloneHex":"src/hex/functions/cloneHex.ts","./corners":"src/hex/functions/corners.ts","./equals":"src/hex/functions/equals.ts","./height":"src/hex/functions/height.ts","./hexToOffset":"src/hex/functions/hexToOffset.ts","./hexToPoint":"src/hex/functions/hexToPoint.ts","./isFlat":"src/hex/functions/isFlat.ts","./isPointy":"src/hex/functions/isPointy.ts","./toString":"src/hex/functions/toString.ts","./width":"src/hex/functions/width.ts"}],"src/hex/functions/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cloneHex = require("./cloneHex");

Object.keys(_cloneHex).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _cloneHex[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _cloneHex[key];
    }
  });
});

var _corners = require("./corners");

Object.keys(_corners).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _corners[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _corners[key];
    }
  });
});

var _createHex = require("./createHex");

Object.keys(_createHex).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _createHex[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _createHex[key];
    }
  });
});

var _createHexPrototype = require("./createHexPrototype");

Object.keys(_createHexPrototype).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _createHexPrototype[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _createHexPrototype[key];
    }
  });
});

var _equals = require("./equals");

Object.keys(_equals).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _equals[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _equals[key];
    }
  });
});

var _height = require("./height");

Object.keys(_height).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _height[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _height[key];
    }
  });
});

var _hexToOffset = require("./hexToOffset");

Object.keys(_hexToOffset).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _hexToOffset[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _hexToOffset[key];
    }
  });
});

var _hexToPoint = require("./hexToPoint");

Object.keys(_hexToPoint).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _hexToPoint[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _hexToPoint[key];
    }
  });
});

var _isFlat = require("./isFlat");

Object.keys(_isFlat).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _isFlat[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _isFlat[key];
    }
  });
});

var _isHex = require("./isHex");

Object.keys(_isHex).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _isHex[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _isHex[key];
    }
  });
});

var _isPointy = require("./isPointy");

Object.keys(_isPointy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _isPointy[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _isPointy[key];
    }
  });
});

var _offsetToAxial = require("./offsetToAxial");

Object.keys(_offsetToAxial).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _offsetToAxial[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _offsetToAxial[key];
    }
  });
});

var _toString = require("./toString");

Object.keys(_toString).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _toString[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _toString[key];
    }
  });
});

var _width = require("./width");

Object.keys(_width).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _width[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _width[key];
    }
  });
});
},{"./cloneHex":"src/hex/functions/cloneHex.ts","./corners":"src/hex/functions/corners.ts","./createHex":"src/hex/functions/createHex.ts","./createHexPrototype":"src/hex/functions/createHexPrototype.ts","./equals":"src/hex/functions/equals.ts","./height":"src/hex/functions/height.ts","./hexToOffset":"src/hex/functions/hexToOffset.ts","./hexToPoint":"src/hex/functions/hexToPoint.ts","./isFlat":"src/hex/functions/isFlat.ts","./isHex":"src/hex/functions/isHex.ts","./isPointy":"src/hex/functions/isPointy.ts","./offsetToAxial":"src/hex/functions/offsetToAxial.ts","./toString":"src/hex/functions/toString.ts","./width":"src/hex/functions/width.ts"}],"src/hex/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _functions = require("./functions");

Object.keys(_functions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _functions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _functions[key];
    }
  });
});

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
},{"./functions":"src/hex/functions/index.ts","./types":"src/hex/types.ts"}],"src/grid/functions/neighborOf.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.neighborOf = exports.neighborOfFlat = exports.neighborOfPointy = void 0;

var _compass = require("../../compass");

var _hex = require("../../hex");

const DIRECTIONS_POINTY = [null, {
  q: 1,
  r: -1
}, {
  q: 1,
  r: 0
}, {
  q: 0,
  r: 1
}, null, {
  q: -1,
  r: 1
}, {
  q: -1,
  r: 0
}, {
  q: 0,
  r: -1
} // NW
];
const DIRECTIONS_FLAT = [{
  q: 0,
  r: -1
}, {
  q: 1,
  r: -1
}, null, {
  q: 1,
  r: 0
}, {
  q: 0,
  r: 1
}, {
  q: -1,
  r: 1
}, null, {
  q: -1,
  r: 0
} // NW
];

const neighborOfPointy = ({
  offset,
  q,
  r,
  col,
  row
}, direction) => {
  if (direction === _compass.CompassDirection.S || direction === _compass.CompassDirection.N) {
    const nextRow = direction === _compass.CompassDirection.S ? row + 1 : row - 1;
    return (0, _hex.offsetToAxialPointy)(col, nextRow, offset);
  }

  const neighbor = DIRECTIONS_POINTY[direction];
  return {
    q: q + neighbor.q,
    r: r + neighbor.r
  };
};

exports.neighborOfPointy = neighborOfPointy;

const neighborOfFlat = ({
  offset,
  q,
  r,
  col,
  row
}, direction) => {
  if (direction === _compass.CompassDirection.E || direction === _compass.CompassDirection.W) {
    const nextCol = direction === _compass.CompassDirection.E ? col + 1 : col - 1;
    return (0, _hex.offsetToAxialFlat)(nextCol, row, offset);
  }

  const neighbor = DIRECTIONS_FLAT[direction];
  return {
    q: q + neighbor.q,
    r: r + neighbor.r
  };
};

exports.neighborOfFlat = neighborOfFlat;

const neighborOf = (hex, direction) => hex.isPointy ? neighborOfPointy(hex, direction) : neighborOfFlat(hex, direction);

exports.neighborOf = neighborOf;
},{"../../compass":"src/compass/index.ts","../../hex":"src/hex/index.ts"}],"src/grid/functions/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _flatTraverse = require("./flatTraverse");

Object.keys(_flatTraverse).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _flatTraverse[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _flatTraverse[key];
    }
  });
});

var _inStore = require("./inStore");

Object.keys(_inStore).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _inStore[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _inStore[key];
    }
  });
});

var _neighborOf = require("./neighborOf");

Object.keys(_neighborOf).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _neighborOf[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _neighborOf[key];
    }
  });
});
},{"./flatTraverse":"src/grid/functions/flatTraverse.ts","./inStore":"src/grid/functions/inStore.ts","./neighborOf":"src/grid/functions/neighborOf.ts"}],"src/grid/grid.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Grid = void 0;

var _hex = require("../hex");

var _functions = require("./functions");

class Grid {
  constructor(hexPrototype, traversersOrStore) {
    this.hexPrototype = hexPrototype;
    this.store = new Map();

    this.getHex = coordinates => {
      const hex = (0, _hex.createHex)(this.hexPrototype).clone(coordinates); // clone to enable users to make custom hexes

      return this.store.get(hex.toString()) ?? hex;
    };

    this._getPrevHexState = () => ({
      hexes: [],
      cursor: null
    });

    if (traversersOrStore instanceof Map) {
      this._getPrevHexState = () => {
        const hexes = Array.from(traversersOrStore.values());
        return {
          hexes,
          cursor: hexes[hexes.length - 1]
        };
      };

      this.store = new Map(traversersOrStore);
    } else if (traversersOrStore) {
      const hexes = (0, _functions.flatTraverse)(traversersOrStore)(this.getHex(), this.getHex);

      this._getPrevHexState = () => ({
        hexes,
        cursor: hexes[hexes.length - 1]
      });

      this.store = new Map(hexes.map(hex => [hex.toString(), hex]));
    }
  }

  static from(iterable) {
    let firstHex;
    let store;

    if (iterable instanceof Map) {
      firstHex = iterable.values()[Symbol.iterator]().next().value;
      store = iterable;
    } else {
      const array = Array.from(iterable);
      firstHex = array[0];
      store = new Map(array.map(hex => [hex.toString(), hex]));
    }

    if (!firstHex) {
      throw new Error(`Can't create grid from empty iterable: ${iterable}`);
    }

    return new Grid(Object.getPrototypeOf(firstHex), store);
  }

  get [Symbol.toStringTag]() {
    return 'Grid';
  }

  *[Symbol.iterator]() {
    for (const hex of this._getPrevHexState(this).hexes) {
      yield hex;
    }
  }

  each(callback) {
    const each = currentGrid => {
      const prevHexState = this._getPrevHexState(currentGrid);

      for (const hex of prevHexState.hexes) {
        callback(hex, currentGrid);
      }

      return prevHexState;
    };

    return this._clone(each);
  }

  filter(predicate) {
    const filter = currentGrid => {
      const nextHexes = [];

      const prevHexState = this._getPrevHexState(currentGrid);

      let cursor = prevHexState.cursor;

      for (const hex of prevHexState.hexes) {
        if (predicate(hex, currentGrid)) {
          cursor = hex;
          nextHexes.push(cursor);
        }
      }

      return {
        hexes: nextHexes,
        cursor
      };
    };

    return this._clone(filter);
  }

  takeWhile(predicate) {
    const takeWhile = currentGrid => {
      const nextHexes = [];

      const prevHexState = this._getPrevHexState(currentGrid);

      let cursor = prevHexState.cursor;

      for (const hex of prevHexState.hexes) {
        if (!predicate(hex, currentGrid)) {
          return {
            hexes: nextHexes,
            cursor
          };
        }

        cursor = hex;
        nextHexes.push(cursor);
      }

      return {
        hexes: nextHexes,
        cursor
      };
    };

    return this._clone(takeWhile);
  }

  traverse(traversers) {
    const traverse = currentGrid => {
      const nextHexes = [];
      let cursor = this._getPrevHexState(currentGrid).cursor ?? this.getHex();

      for (const nextCursor of (0, _functions.flatTraverse)(traversers)(cursor, this.getHex)) {
        cursor = nextCursor;
        nextHexes.push(cursor);
      }

      return {
        hexes: nextHexes,
        cursor
      };
    };

    return this._clone(traverse);
  }

  run(callback) {
    for (const hex of this._getPrevHexState(this).hexes) {
      callback && callback(hex, this);
    }

    return this;
  }

  _clone(getHexState) {
    const newGrid = new Grid(this.hexPrototype, this.store);
    newGrid._getPrevHexState = getHexState;
    return newGrid;
  }

}

exports.Grid = Grid;
},{"../hex":"src/hex/index.ts","./functions":"src/grid/functions/index.ts"}],"src/grid/traversers/at.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = exports.at = void 0;

const at = coordinates => (_, getHex) => [getHex(coordinates)];

exports.at = at;
const start = at;
exports.start = start;
},{}],"src/grid/traversers/branch.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.branch = void 0;

var _functions = require("../functions");

/**
 * For each hex from `source` traverses over hex coordinates from `traverser`
 * @param source    Each hex in the source is passed one-by-one as a cursor to the traverser
 * @param branch Receives each hex coordinates from source as the start cursor
 */
const branch = (source, branch) => (cursor, getHex) => {
  const flatBranch = (0, _functions.flatTraverse)(branch);
  const result = [];
  let _cursor = cursor;

  for (const sourceCursor of (0, _functions.flatTraverse)(source)(_cursor, getHex)) {
    _cursor = sourceCursor;
    result.push(_cursor);

    for (const branchCursor of flatBranch(_cursor, getHex)) {
      result.push(branchCursor);
    }
  }

  return result;
};

exports.branch = branch;
},{"../functions":"src/grid/functions/index.ts"}],"src/grid/traversers/move.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.move = void 0;

var _functions = require("../functions");

const move = (direction, times = 1) => {
  return (cursor, getHex) => {
    const result = [];
    let _cursor = cursor;

    for (let i = 1; i <= times; i++) {
      _cursor = getHex((0, _functions.neighborOf)(_cursor, direction));
      result.push(_cursor);
    }

    return result;
  };
};

exports.move = move;
},{"../functions":"src/grid/functions/index.ts"}],"src/grid/traversers/rectangle.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rectangle = rectangle;

var _compass = require("../../compass");

var _hex = require("../../hex");

var _utils = require("../../utils");

var _at = require("./at");

var _branch = require("./branch");

var _move = require("./move");

function rectangle(optionsOrCornerA, cornerB) {
  return (cursor, getHex) => {
    const {
      width,
      height,
      start = {
        q: 0,
        r: 0
      },
      direction = _compass.CompassDirection.E
    } = cornerB ? optionsFromOpposingCorners(optionsOrCornerA, cornerB, cursor.isPointy, cursor.offset) : optionsOrCornerA;
    return (0, _branch.branch)([(0, _at.at)(start), (0, _move.move)(_compass.Compass.rotate(direction, 2), height - 1)], (0, _move.move)(direction, width - 1))(cursor, getHex);
  };
}

function optionsFromOpposingCorners(cornerA, cornerB, isPointy, offset) {
  const {
    col: cornerACol,
    row: cornerARow
  } = assertOffsetCoordinates(cornerA, isPointy, offset);
  const {
    col: cornerBCol,
    row: cornerBRow
  } = assertOffsetCoordinates(cornerB, isPointy, offset);
  const smallestCol = cornerACol < cornerBCol ? 'A' : 'B';
  const smallestRow = cornerARow < cornerBRow ? 'A' : 'B';
  const smallestColRow = smallestCol + smallestRow;
  const {
    swapWidthHeight,
    direction
  } = RULES_FOR_SMALLEST_COL_ROW[smallestColRow];
  const width = Math.abs(cornerACol - cornerBCol) + 1;
  const height = Math.abs(cornerARow - cornerBRow) + 1;
  return {
    width: swapWidthHeight ? height : width,
    height: swapWidthHeight ? width : height,
    start: cornerA,
    direction
  };
}

function assertOffsetCoordinates(cornerA, isPointy, offset) {
  return (0, _utils.isOffset)(cornerA) ? cornerA : (0, _hex.hexToOffset)({
    q: cornerA.q,
    r: cornerA.r,
    isPointy,
    offset
  });
}

const RULES_FOR_SMALLEST_COL_ROW = {
  AA: {
    swapWidthHeight: false,
    direction: _compass.CompassDirection.E
  },
  AB: {
    swapWidthHeight: true,
    direction: _compass.CompassDirection.N
  },
  BA: {
    swapWidthHeight: true,
    direction: _compass.CompassDirection.S
  },
  BB: {
    swapWidthHeight: false,
    direction: _compass.CompassDirection.W
  }
};
/**
 * This is the "old way" of creating rectangles. It's less performant (up until ~40x slower with 200x200 rectangles), but it's able to create
 * actual rectangles (with 90° corners) for the ordinal directions. But because I assume people mostly need rectangles in the cardinal directions,
 * I've decided to drop "true ordinal rectangle" support for now.
 */
// export const RECTANGLE_DIRECTIONS_POINTY = [
//   null, // ambiguous
//   ['q', 's', 'r'], // NE
//   ['q', 'r', 's'], // E
//   ['r', 'q', 's'], // SE
//   null, // ambiguous
//   ['r', 's', 'q'], // SW
//   ['s', 'r', 'q'], // W
//   ['s', 'q', 'r'], // NW
// ] as [keyof CubeCoordinates, keyof CubeCoordinates, keyof CubeCoordinates][]
// export const RECTANGLE_DIRECTIONS_FLAT = [
//   ['s', 'q', 'r'], // N
//   ['q', 's', 'r'], // NE
//   null,
//   ['q', 'r', 's'], // SE
//   ['r', 'q', 's'], // S
//   ['r', 's', 'q'], // SW
//   null,
//   ['s', 'r', 'q'], // NW
// ] as [keyof CubeCoordinates, keyof CubeCoordinates, keyof CubeCoordinates][]
// export const rectangle = <T extends Hex>(
//   hexPrototype: T,
//   {
//     width,
//     height,
//     start = { q: 0, r: 0 },
//     direction = hexPrototype.isPointy ? CompassDirection.E : CompassDirection.SE,
//   }: RectangleOptions,
// ) => {
//   const result: T[] = []
//   const _start: CubeCoordinates = { q: start.q, r: start.r, s: -start.q - start.r }
//   const [firstCoordinate, secondCoordinate, thirdCoordinate] = (hexPrototype.isPointy
//     ? RECTANGLE_DIRECTIONS_POINTY
//     : RECTANGLE_DIRECTIONS_FLAT)[direction]
//   const [firstStop, secondStop] = hexPrototype.isPointy ? [width, height] : [height, width]
//   for (let second = 0; second < secondStop; second++) {
//     // for (let second = 0; second > -secondStop; second--) {
//     const secondOffset = offsetFromZero(hexPrototype.offset, second)
//     for (let first = -secondOffset; first < firstStop - secondOffset; first++) {
//       const nextCoordinates = {
//         [firstCoordinate]: first + _start[firstCoordinate],
//         [secondCoordinate]: second + _start[secondCoordinate],
//         [thirdCoordinate]: -first - second + _start[thirdCoordinate],
//       } as unknown
//       result.push(createHex<T>(hexPrototype, nextCoordinates as CubeCoordinates))
//     }
//   }
//   return result
// }
},{"../../compass":"src/compass/index.ts","../../hex":"src/hex/index.ts","../../utils":"src/utils/index.ts","./at":"src/grid/traversers/at.ts","./branch":"src/grid/traversers/branch.ts","./move":"src/grid/traversers/move.ts"}],"src/grid/traversers/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _at = require("./at");

Object.keys(_at).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _at[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _at[key];
    }
  });
});

var _branch = require("./branch");

Object.keys(_branch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _branch[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _branch[key];
    }
  });
});

var _move = require("./move");

Object.keys(_move).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _move[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _move[key];
    }
  });
});

var _rectangle = require("./rectangle");

Object.keys(_rectangle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _rectangle[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rectangle[key];
    }
  });
});
},{"./at":"src/grid/traversers/at.ts","./branch":"src/grid/traversers/branch.ts","./move":"src/grid/traversers/move.ts","./rectangle":"src/grid/traversers/rectangle.ts"}],"src/grid/types.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"src/grid/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _functions = require("./functions");

Object.keys(_functions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _functions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _functions[key];
    }
  });
});

var _grid = require("./grid");

Object.keys(_grid).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _grid[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _grid[key];
    }
  });
});

var _traversers = require("./traversers");

Object.keys(_traversers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _traversers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _traversers[key];
    }
  });
});

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
},{"./functions":"src/grid/functions/index.ts","./grid":"src/grid/grid.ts","./traversers":"src/grid/traversers/index.ts","./types":"src/grid/types.ts"}],"src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _compass = require("./compass");

Object.keys(_compass).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _compass[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _compass[key];
    }
  });
});

var _grid = require("./grid");

Object.keys(_grid).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _grid[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _grid[key];
    }
  });
});

var _hex = require("./hex");

Object.keys(_hex).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _hex[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _hex[key];
    }
  });
});
},{"./compass":"src/compass/index.ts","./grid":"src/grid/index.ts","./hex":"src/hex/index.ts"}],"playground/index.ts":[function(require,module,exports) {
"use strict";

var _render = require("./render");

var _tiles = require("./tiles");

var _src = require("../src");

const hexPrototype = (0, _src.createHexPrototype)({
  dimensions: {
    width: 60,
    height: 51.96
  },
  orientation: 'FLAT',
  origin: 'topLeft'
});
const grid = new _src.Grid(hexPrototype, (0, _src.rectangle)({
  width: 12,
  height: 9
})); // .traverse([at({ q: 0, r: 0 }), move(Compass.SE), move(Compass.NE)])
// .filter(inStore)
// .each(render)
// .run()
// console.log(grid.store)

const tilesToArray = tilesOrder => {
  const tilesIndex = [];
  const tiles = [];
  tilesOrder.forEach(tile => {
    const tileIndex = Number(tile[0]) - 1; // convert to zero-based index

    tilesIndex.push(tileIndex);
    const isFlipped = !!tile[1];
    tiles.push(isFlipped ? [..._tiles.TILES[tileIndex]].reverse() : _tiles.TILES[tileIndex]);
  });
  const result = [];

  for (let pair = 0; pair < 3; pair++) {
    for (let j = 0; j < 3; j++) {
      for (let coordinate = 0; coordinate < 6; coordinate++) {
        const leftTiles = tiles[tilesIndex[pair * 2]];
        result.push(leftTiles[j * 6 + coordinate]);
      }

      for (let coordinate = 0; coordinate < 6; coordinate++) {
        const rightTiles = tiles[tilesIndex[pair * 2 + 1]];
        result.push(rightTiles[j * 6 + coordinate]);
      }
    }
  }

  return result;
};

const renderTiles = tilesOrder => {
  const hexagonsOrdered = [];
  const tilesInArray = tilesToArray(tilesOrder); // grid.each(render)

  let index = 0;
  grid.each((hex, grid) => {
    hex.terrain = tilesInArray[index];
    hexagonsOrdered.push(hex); // grid.store.set(`${hex.q},${hex.r}`, hex)
    // console.log('tilesInArray[' + index + ']:', tilesInArray[index])

    index++; // render(hex)
  }).run();
  (0, _render.renderAll)(hexagonsOrdered);
};

const gatherAndRender = () => {
  const values = [];
  Array.prototype.forEach.call(document.querySelectorAll('.js-tilesPosition'), (el, i) => values.push(el.value || i + 1));
  document.querySelectorAll('.js-tilesPositionCheckbox').forEach((el, i) => {
    const element = el;
    values[i] += element.checked ? 'r' : '';
  });
  renderTiles(values);
};

document.querySelectorAll('.js-tilesPosition').forEach(el => el.addEventListener('input', gatherAndRender));
document.querySelectorAll('.js-tilesPositionCheckbox').forEach(el => {
  el.addEventListener('change', gatherAndRender);
});
gatherAndRender();
},{"./render":"playground/render.ts","./tiles":"playground/tiles.ts","../src":"src/index.ts"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52475" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","playground/index.ts"], null)
//# sourceMappingURL=/honeycomb/playground.0266f34f.js.map