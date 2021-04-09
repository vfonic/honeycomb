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
})({"playground/render.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.highlightSelectedHex = exports.renderAll = void 0;
const mapWrapperEl = document.querySelector('.js-map');
if (!mapWrapperEl) throw new Error('Map element not found');

const renderAll = hexes => mapWrapperEl.innerHTML = `
    <svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='555px' height='494px'>
        ${hexes.map(hex => render(hex)).join('')}
    </svg>
  `;

exports.renderAll = renderAll;

const fillHexagon = hex => {
  let fill = 'none';

  if (hex.terrain.isForest()) {
    fill = '#63d6a3';
  } else if (hex.terrain.isWater()) {
    fill = '#2596be';
  } else if (hex.terrain.isDesert()) {
    fill = '#ffcc00';
  } else if (hex.terrain.isMountain()) {
    fill = 'gray';
  } else if (hex.terrain.isSwamp()) {
    fill = 'purple';
  }

  return ` 
    <polygon class='js-highlightHex' points='${hex.corners.map(({
    x,
    y
  }) => `${x},${y}`).join(',')}' fill='${fill}'></polygon>
  `;
};

const BORDER_DISTANCE = 3;
const DX = [-0.75, -1, -0.75, 0.75, 1, 0.75];
const DY = [0.75, 0, -0.75, -0.75, 0, 0.75];

const addBearsAndCougars = hex => {
  if (!hex.terrain.hasBears() && !hex.terrain.hasCougars()) return '';
  const color = hex.terrain.hasBears() ? '#000' : '#b00';
  return `
    <polygon points='${hex.corners.map(({
    x,
    y
  }, i) => {
    x += BORDER_DISTANCE * DX[i];
    y += BORDER_DISTANCE * DY[i];
    return `${x},${y}`;
  })}' fill='none' stroke-width='1.5' stroke='${color}' />
  `;
};

const addCoordinates = hex => {
  if (hex.terrain.hasSteppingStone() || hex.terrain.hasAbandonedShack()) return '';
  return `
    <text font-size='${hex.width * 0.25}' text-anchor='middle' dominant-baseline='central' transform='matrix(1,0,0,1,${hex.x},${hex.y})'>
      <tspan dy='0' x='0'>${hex.q},${hex.r}</tspan>
    </text>
  `;
};

const highlightSelectedHex = hex => {
  const graphicsEl = mapWrapperEl.querySelector(`g[data-hex="${hex.q},${hex.r}"]`);
  if (!graphicsEl) return '';
  const oldHighlightedEl = mapWrapperEl.querySelector('polygon[highlighted]');
  oldHighlightedEl && oldHighlightedEl.remove();
  graphicsEl.innerHTML += `
    <polygon highlighted points='${hex.corners.map(({
    x,
    y
  }, i) => {
    x += BORDER_DISTANCE * DX[i] / 3;
    y += BORDER_DISTANCE * DY[i] / 3;
    return `${x},${y}`;
  })}' fill='none' stroke-width='2' stroke='#fff' />
  `;
};

exports.highlightSelectedHex = highlightSelectedHex;

const addSteppingStone = hex => {
  if (!hex.terrain.hasSteppingStone()) return '';
  const width = hex.width / 9;
  return `
    <circle cx='${hex.x - width}' cy='${hex.y - width}' r='${width}' fill='${hex.terrain.steppingStoneColor}' />
  `;
};

const addAbandonedShack = hex => {
  if (!hex.terrain.hasAbandonedShack()) return '';
  const width = hex.width / 4;
  const topY = hex.corners[0].y + width * 1.5;
  const topX = (hex.corners[5].x + hex.corners[0].x) / 2;
  const points = [`${topX + width / 2},${topY}`, hex.corners[2].x, hex.corners[2].y - width, hex.corners[3].x + width, hex.corners[3].y - width];
  return `
    <polygon points='${points}' fill='${hex.terrain.abandonedShackColor}'/>
  `;
};

const render = hex => {
  let result = '';
  result += fillHexagon(hex);
  result += addBearsAndCougars(hex);
  result += addCoordinates(hex);
  result += addSteppingStone(hex);
  result += addAbandonedShack(hex);
  result += highlightSelectedHex(hex);
  return `<g data-hex='${hex.q},${hex.r}' style='opacity: ${hex.isActive ? '1' : '0.5'}'>${result}</g>`;
};

exports.render = render;
},{}],"playground/tiles.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tilesToArray = exports.TILES = exports.TILE_SIX = exports.TILE_FIVE = exports.TILE_FOUR = exports.TILE_THREE = exports.TILE_TWO = exports.TILE_ONE = exports.WC = exports.SC = exports.MC = exports.FC = exports.WB = exports.MB = exports.FB = exports.DB = exports.W = exports.S = exports.M = exports.F = exports.D = void 0;
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
const TILES = [TILE_ONE, TILE_TWO, TILE_THREE, TILE_FOUR, TILE_FIVE, TILE_SIX];
exports.TILES = TILES;

const tilesToArray = tilesOrder => {
  const tilesIndex = [];
  const tiles = [];
  tilesOrder.forEach(tile => {
    const tileIndex = Number(tile[0]) - 1; // convert to zero-based index

    tilesIndex.push(tileIndex);
    const isFlipped = !!tile[1];
    tiles.push(isFlipped ? [...TILES[tileIndex]].reverse() : TILES[tileIndex]);
  });
  const result = [];

  for (let pair = 0; pair < 3; pair++) {
    for (let j = 0; j < 3; j++) {
      for (let coordinate = 0; coordinate < 6; coordinate++) {
        const leftTiles = tiles[pair * 2];
        result.push(leftTiles[j * 6 + coordinate]);
      }

      for (let coordinate = 0; coordinate < 6; coordinate++) {
        const rightTiles = tiles[pair * 2 + 1];
        result.push(rightTiles[j * 6 + coordinate]);
      }
    }
  }

  return result;
};

exports.tilesToArray = tilesToArray;
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
},{}],"src/utils/signedModulo.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signedModulo = signedModulo;

function signedModulo(dividend, divisor) {
  return (dividend % divisor + divisor) % divisor;
}
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

var _signedModulo = require("./signedModulo");

Object.keys(_signedModulo).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _signedModulo[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _signedModulo[key];
    }
  });
});
},{"./isAxial":"src/utils/isAxial.ts","./isFunction":"src/utils/isFunction.ts","./isObject":"src/utils/isObject.ts","./isOffset":"src/utils/isOffset.ts","./isPoint":"src/utils/isPoint.ts","./offsetFromZero":"src/utils/offsetFromZero.ts","./signedModulo":"src/utils/signedModulo.ts"}],"src/compass/compass.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Compass = exports.CompassDirection = exports.OrdinalCompassDirection = exports.CardinalCompassDirection = void 0;

var _utils = require("../utils");

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
    return (0, _utils.signedModulo)(direction + steps, 8);
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
Compass.NW = CompassDirection.NW;
},{"../utils":"src/utils/index.ts"}],"src/compass/index.ts":[function(require,module,exports) {
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
},{}],"src/hex/functions/offsetToCube.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.offsetToCube = exports.offsetToCubeFlat = exports.offsetToCubePointy = void 0;

var _utils = require("../../utils");

const offsetToCubePointy = (col, row, offset) => {
  const q = col - (0, _utils.offsetFromZero)(offset, row);
  const r = row;
  const s = -q - r;
  return {
    q,
    r,
    s
  };
};

exports.offsetToCubePointy = offsetToCubePointy;

const offsetToCubeFlat = (col, row, offset) => {
  const q = col;
  const r = row - (0, _utils.offsetFromZero)(offset, col);
  const s = -q - r;
  return {
    q,
    r,
    s
  };
};

exports.offsetToCubeFlat = offsetToCubeFlat;

const offsetToCube = ({
  col,
  row
}, {
  offset,
  isPointy
}) => isPointy ? offsetToCubePointy(col, row, offset) : offsetToCubeFlat(col, row, offset);

exports.offsetToCube = offsetToCube;
},{"../../utils":"src/utils/index.ts"}],"src/hex/functions/cloneHex.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloneHex = void 0;

var _utils = require("../../utils");

var _offsetToCube = require("./offsetToCube");

const cloneHex = (hex, newProps = {}) => {
  if ((0, _utils.isOffset)(newProps)) {
    const {
      col,
      row,
      ...otherProps
    } = newProps;
    const coordinates = (0, _offsetToCube.offsetToCube)({
      col,
      row
    }, hex);
    return Object.assign(Object.create(Object.getPrototypeOf(hex)), hex, coordinates, otherProps);
  }

  return Object.assign(Object.create(Object.getPrototypeOf(hex)), hex, newProps);
};

exports.cloneHex = cloneHex;
},{"../../utils":"src/utils/index.ts","./offsetToCube":"src/hex/functions/offsetToCube.ts"}],"src/hex/types.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Orientation = void 0;
// todo: move types to single file in /src
// tried it and somehow typescript can't call origin as a function anymore in createHexPrototype.ts normalizeOrigin()
var Orientation;
exports.Orientation = Orientation;

(function (Orientation) {
  Orientation["FLAT"] = "FLAT";
  Orientation["POINTY"] = "POINTY";
})(Orientation || (exports.Orientation = Orientation = {}));
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
}) => orientation === _types.Orientation.POINTY ? heightPointy(yRadius) : heightFlat(yRadius);

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
}) => orientation === _types.Orientation.POINTY ? {
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
}) => orientation === _types.Orientation.POINTY ? widthPointy(xRadius) : widthFlat(xRadius);

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
  return orientation === _types.Orientation.POINTY ? cornersPointy((0, _width.widthPointy)(xRadius), (0, _height.heightPointy)(yRadius), point) : cornersFlat((0, _width.widthFlat)(xRadius), (0, _height.heightFlat)(yRadius), point);
}
},{"../types":"src/hex/types.ts","./height":"src/hex/functions/height.ts","./hexToPoint":"src/hex/functions/hexToPoint.ts","./isHex":"src/hex/functions/isHex.ts","./width":"src/hex/functions/width.ts"}],"src/hex/functions/createHex.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHex = void 0;

var _utils = require("../../utils");

var _isHex = require("./isHex");

var _offsetToCube = require("./offsetToCube");

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
    const coordinates = (0, _offsetToCube.offsetToCube)({
      col,
      row
    }, prototypeOrHex);
    return Object.assign(Object.create(prototypeOrHex), coordinates, otherProps);
  }

  return Object.assign(Object.create(prototypeOrHex), props);
};

exports.createHex = createHex;
},{"../../utils":"src/utils/index.ts","./isHex":"src/hex/functions/isHex.ts","./offsetToCube":"src/hex/functions/offsetToCube.ts"}],"src/hex/functions/equals.ts":[function(require,module,exports) {
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
}) => orientation === _types.Orientation.FLAT;

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
}) => orientation === _types.Orientation.POINTY;

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
  orientation: _types.Orientation.POINTY,
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
      return normalizeOrientation(prototype) === _types.Orientation.POINTY ? {
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
  orientation = orientation.toUpperCase();

  if (orientation === _types.Orientation.POINTY || orientation === _types.Orientation.FLAT) {
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
},{"../../utils":"src/utils/index.ts","../types":"src/hex/types.ts","./cloneHex":"src/hex/functions/cloneHex.ts","./corners":"src/hex/functions/corners.ts","./equals":"src/hex/functions/equals.ts","./height":"src/hex/functions/height.ts","./hexToOffset":"src/hex/functions/hexToOffset.ts","./hexToPoint":"src/hex/functions/hexToPoint.ts","./isFlat":"src/hex/functions/isFlat.ts","./isPointy":"src/hex/functions/isPointy.ts","./toString":"src/hex/functions/toString.ts","./width":"src/hex/functions/width.ts"}],"src/hex/functions/round.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.round = void 0;

const round = ({
  q,
  r,
  s = -q - r
}) => {
  let roundedQ = Math.round(q);
  let roundedR = Math.round(r);
  let roundedS = Math.round(s);
  const diffQ = Math.abs(q - roundedQ);
  const diffR = Math.abs(r - roundedR);
  const diffS = Math.abs(s - roundedS);

  if (diffQ > diffR && diffQ > diffS) {
    roundedQ = -roundedR - roundedS;
  } else if (diffR > diffS) {
    roundedR = -roundedQ - roundedS;
  } else {
    roundedS = -roundedQ - roundedR;
  }

  return {
    q: roundedQ,
    r: roundedR,
    s: roundedS
  };
};

exports.round = round;
},{}],"src/hex/functions/pointToCube.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pointToCube = void 0;

var _round = require("./round");

// inspired by https://github.com/gojuno/hexgrid-py
// and simplified by https://www.symbolab.com/solver/simplify-calculator/simplify
const pointToCube = ({
  x,
  y
}, {
  dimensions: {
    xRadius,
    yRadius
  },
  origin,
  isPointy
}) => {
  x += origin.x;
  y += origin.y;

  if (isPointy) {
    return (0, _round.round)({
      q: Math.sqrt(3) * x / (3 * xRadius) - y / (3 * yRadius),
      r: 2 / 3 * (y / yRadius)
    });
  }

  return (0, _round.round)({
    q: 2 / 3 * (x / xRadius),
    r: Math.sqrt(3) * y / (3 * yRadius) - x / (3 * xRadius)
  });
};

exports.pointToCube = pointToCube;
},{"./round":"src/hex/functions/round.ts"}],"src/hex/functions/index.ts":[function(require,module,exports) {
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

var _offsetToCube = require("./offsetToCube");

Object.keys(_offsetToCube).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _offsetToCube[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _offsetToCube[key];
    }
  });
});

var _pointToCube = require("./pointToCube");

Object.keys(_pointToCube).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _pointToCube[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _pointToCube[key];
    }
  });
});

var _round = require("./round");

Object.keys(_round).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _round[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _round[key];
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
},{"./cloneHex":"src/hex/functions/cloneHex.ts","./corners":"src/hex/functions/corners.ts","./createHex":"src/hex/functions/createHex.ts","./createHexPrototype":"src/hex/functions/createHexPrototype.ts","./equals":"src/hex/functions/equals.ts","./height":"src/hex/functions/height.ts","./hexToOffset":"src/hex/functions/hexToOffset.ts","./hexToPoint":"src/hex/functions/hexToPoint.ts","./isFlat":"src/hex/functions/isFlat.ts","./isHex":"src/hex/functions/isHex.ts","./isPointy":"src/hex/functions/isPointy.ts","./offsetToCube":"src/hex/functions/offsetToCube.ts","./pointToCube":"src/hex/functions/pointToCube.ts","./round":"src/hex/functions/round.ts","./toString":"src/hex/functions/toString.ts","./width":"src/hex/functions/width.ts"}],"src/hex/index.ts":[function(require,module,exports) {
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
    return (0, _hex.offsetToCubePointy)(col, nextRow, offset);
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
    return (0, _hex.offsetToCubeFlat)(nextCol, row, offset);
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

    this._getPrevHexes = () => [];

    if (traversersOrStore instanceof Map) {
      this._getPrevHexes = () => Array.from(traversersOrStore.values());

      this.store = new Map(traversersOrStore);
    } else if (traversersOrStore) {
      const hexes = (0, _functions.flatTraverse)(traversersOrStore)(this.getHex(), this.getHex);

      this._getPrevHexes = () => hexes;

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

  pointToHex(point) {
    return this.getHex((0, _hex.pointToCube)(point, this.hexPrototype));
  }

  update(callback) {
    let nextGrid = this._clone(this._getPrevHexes);

    nextGrid = callback(nextGrid) || nextGrid; // reset hex state to iterate over nextGrid's store (fixes issue #68)

    nextGrid._getPrevHexes = () => Array.from(nextGrid.store.values());

    return nextGrid;
  }

  each(callback) {
    const each = currentGrid => {
      const hexes = this._getPrevHexes(currentGrid);

      hexes.forEach(hex => callback(hex, currentGrid));
      return hexes;
    };

    return this._clone(each);
  }
  /**
   * @memberof Grid#
   * @instance
   * @see {@link https://www.redblobgames.com/grids/hexagons/#range-coordinate|redblobgames.com}
   *
   * @param {hex} centerHex                   A hex to get surrounding hexes from.
   * @param {number} [range=0]                The range (in hexes) surrounding the center hex.
   * @param {boolean} [includeCenterHex=true] Whether to include the center hex in the result
   *
   * @returns {hex[]}             An array with all hexes surrounding the passed center hex.
   *                              Only hexes that are present in the grid are returned.
   *
   * @throws {Error} When no valid hex is passed.
   *
   * @example
   * const Hex = Honeycomb.extendHex({ orientation: 'pointy' })
   * const Grid = Honeycomb.defineGrid(Hex)
   * const grid = Grid.rectangle({ width: 5, height: 5 })
   *
   * grid.hexesInRange(Hex(2, 2), 2)          // [
   *                                          //    { x: 0, y: 2 },
   *                                          //    { x: 0, y: 3 },
   *                                          //    { x: 1, y: 4 },
   *                                          //    ...
   *                                          //    { x: 3, y: 0 },
   *                                          //    { x: 3, y: 1 },
   *                                          //    { x: 4, y: 2 }
   *                                          // ]
   *
   * // only returns hexes that exist in the grid:
   * grid.hexesInRange(Hex(0, 0), 1)          // [
   *                                          //    { x: 0, y: 0 },
   *                                          //    { x: 0, y: 1 },
   *                                          //    { x: 1, y: 0 }
   *                                          // ]
   *
   * // exclude center hex:
   * grid.hexesInRange(Hex(2, 2), 1, false)   // [
   *                                          //    { x: 1, y: 2 },
   *                                          //    { x: 1, y: 3 },
   *                                          //    { x: 1, y: 1 },
   *                                          //    { x: 2, y: 3 },
   *                                          //    { x: 3, y: 2 }
   *                                          // ]
   */


  hexesInRange(centerHex, range = 0) {
    if (!this.store.get(centerHex.toString())) {
      throw new Error(`Center hex with coordinates ${centerHex} not present in grid.`);
    }

    const hexes = []; // const coordinates = []
    // const DIRECTIONS_FLAT = [
    //   // 2,3
    //   { q: 0, r: -1 }, // N // 2,2
    //   { q: 1, r: -1 }, // NE // 3,2
    //   null, // ambiguous
    //   { q: 1, r: 0 }, // SE // 3,3
    //   { q: 0, r: 1 }, // S // 2,4
    //   { q: -1, r: 1 }, // SW // 1,4
    //   null, // ambiguous
    //   { q: -1, r: 0 }, // NW // 1,3
    // ]
    // 2,3
    //
    // 1,3
    // 1,4
    // 2,2
    // 2,3
    // 2,4
    // 3,2
    // 3,3

    for (let q = -range; q <= range; q++) {
      for (let r = Math.max(-range, -q - range); r <= Math.min(range, -q + range); r++) {
        // const offsetCoordinates = hexToOffset({
        //   q: centerHex.q + q,
        //   r: centerHex.r + r,
        //   offset: centerHex.offset,
        //   isPointy: centerHex.isPointy,
        // })
        // const coordinate = `${offsetCoordinates.col},${offsetCoordinates.row}`
        const coordinate = `${centerHex.q + q},${centerHex.r + r}`; // if (coordinate === '2,1') {
        //   console.log({ q, r })
        // }
        // coordinates.push(coordinate)
        // coordinates.push(`${q},${r}`)

        const hex = this.store.get(coordinate);
        hexes.push(hex);
      }
    } // console.log(coordinates)


    return hexes.filter(Boolean);
  }

  map(callback) {
    const map = currentGrid => this._getPrevHexes(currentGrid).map(hex => {
      const cursor = hex.clone();
      return callback(cursor, currentGrid) || cursor;
    });

    return this._clone(map);
  }

  filter(predicate) {
    const filter = currentGrid => this._getPrevHexes(currentGrid).filter(hex => predicate(hex, currentGrid));

    return this._clone(filter);
  }

  takeWhile(predicate) {
    const takeWhile = currentGrid => {
      const hexes = [];

      for (const hex of this._getPrevHexes(currentGrid)) {
        if (!predicate(hex, currentGrid)) {
          return hexes;
        }

        hexes.push(hex);
      }

      return hexes;
    };

    return this._clone(takeWhile);
  }

  traverse(traversers) {
    const traverse = currentGrid => {
      // run any previous iterators
      this._getPrevHexes(currentGrid);

      return (0, _functions.flatTraverse)(traversers)(this.getHex(), this.getHex);
    };

    return this._clone(traverse);
  }

  hexes() {
    return this._getPrevHexes(this);
  }

  run(callback) {
    const hexes = this._getPrevHexes(this);

    hexes.forEach(hex => callback && callback(hex, this));
    return this._clone(() => hexes);
  }

  _clone(getHexState) {
    const newGrid = new Grid(this.hexPrototype, this.store);
    newGrid._getPrevHexes = getHexState;
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
},{"../functions":"src/grid/functions/index.ts"}],"src/grid/traversers/line.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.move = exports.line = void 0;

var _functions = require("../functions");

const line = (direction, length = 1) => {
  return (cursor, getHex) => {
    const result = [];
    let _cursor = cursor;

    for (let i = 1; i <= length; i++) {
      _cursor = getHex((0, _functions.neighborOf)(_cursor, direction));
      result.push(_cursor);
    }

    return result;
  };
};

exports.line = line;
const move = line;
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

var _line = require("./line");

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
    return (0, _branch.branch)([(0, _at.at)(start), (0, _line.line)(_compass.Compass.rotate(direction, 2), height - 1)], (0, _line.line)(direction, width - 1))(cursor, getHex);
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
},{"../../compass":"src/compass/index.ts","../../hex":"src/hex/index.ts","../../utils":"src/utils/index.ts","./at":"src/grid/traversers/at.ts","./branch":"src/grid/traversers/branch.ts","./line":"src/grid/traversers/line.ts"}],"src/grid/traversers/index.ts":[function(require,module,exports) {
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

var _line = require("./line");

Object.keys(_line).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _line[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _line[key];
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
},{"./at":"src/grid/traversers/at.ts","./branch":"src/grid/traversers/branch.ts","./line":"src/grid/traversers/line.ts","./rectangle":"src/grid/traversers/rectangle.ts"}],"src/grid/types.ts":[function(require,module,exports) {
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
},{"./compass":"src/compass/index.ts","./grid":"src/grid/index.ts","./hex":"src/hex/index.ts"}],"playground/hint.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Hint = exports.ALL_HINTS = void 0;
const ALL_HINTS = [{
  isPossibleOnHex: (grid, hex) => hex.terrain.isForest() || hex.terrain.isDesert(),
  name: 'On forest or desert'
}, {
  isPossibleOnHex: (grid, hex) => hex.terrain.isForest() || hex.terrain.isWater(),
  name: 'On forest or water'
}, {
  isPossibleOnHex: (grid, hex) => hex.terrain.isForest() || hex.terrain.isSwamp(),
  name: 'On forest or swamp'
}, {
  isPossibleOnHex: (grid, hex) => hex.terrain.isForest() || hex.terrain.isMountain(),
  name: 'On forest or mountain'
}, {
  isPossibleOnHex: (grid, hex) => hex.terrain.isDesert() || hex.terrain.isWater(),
  name: 'On desert or water'
}, {
  isPossibleOnHex: (grid, hex) => hex.terrain.isDesert() || hex.terrain.isSwamp(),
  name: 'On desert or swamp'
}, {
  isPossibleOnHex: (grid, hex) => hex.terrain.isDesert() || hex.terrain.isMountain(),
  name: 'On desert or mountain'
}, {
  isPossibleOnHex: (grid, hex) => hex.terrain.isWater() || hex.terrain.isSwamp(),
  name: 'On water or swamp'
}, {
  isPossibleOnHex: (grid, hex) => hex.terrain.isWater() || hex.terrain.isMountain(),
  name: 'On water or mountain'
}, {
  isPossibleOnHex: (grid, hex) => hex.terrain.isSwamp() || hex.terrain.isMountain(),
  name: 'On swamp or mountain'
}, {
  isPossibleOnHex: (grid, hex) => {
    const hexes = grid.hexesInRange(hex, 1);
    return hexes.some(hex => hex.terrain.isForest());
  },
  name: 'Within one space of forest'
}, {
  isPossibleOnHex: (grid, hex) => {
    const hexes = grid.hexesInRange(hex, 1);
    return hexes.some(hex => hex.terrain.isDesert());
  },
  name: 'Within one space of desert'
}, {
  isPossibleOnHex: (grid, hex) => {
    const hexes = grid.hexesInRange(hex, 1);
    return hexes.some(hex => hex.terrain.isSwamp());
  },
  name: 'Within one space of swamp'
}, {
  isPossibleOnHex: (grid, hex) => {
    const hexes = grid.hexesInRange(hex, 1);
    return hexes.some(hex => hex.terrain.isMountain());
  },
  name: 'Within one space of mountain'
}, {
  isPossibleOnHex: (grid, hex) => {
    const hexes = grid.hexesInRange(hex, 1);
    return hexes.some(hex => hex.terrain.isWater());
  },
  name: 'Within one space of water'
}, {
  isPossibleOnHex: (grid, hex) => {
    const hexes = grid.hexesInRange(hex, 1);
    return hexes.some(hex => hex.terrain.hasBears() || hex.terrain.hasCougars());
  },
  name: 'Within one space of either animal territory'
}, {
  isPossibleOnHex: (grid, hex) => {
    const hexes = grid.hexesInRange(hex, 2);
    return hexes.some(hex => hex.terrain.hasSteppingStone());
  },
  name: 'Within two spaces of a standing stone'
}, {
  isPossibleOnHex: (grid, hex) => {
    const hexes = grid.hexesInRange(hex, 2);
    return hexes.some(hex => hex.terrain.hasAbandonedShack());
  },
  name: 'Within two spaces of an abandoned shack'
}, {
  isPossibleOnHex: (grid, hex) => {
    const hexes = grid.hexesInRange(hex, 2);
    return hexes.some(hex => hex.terrain.hasBears());
  },
  name: 'Within two spaces of bear territory'
}, {
  isPossibleOnHex: (grid, hex) => {
    const hexes = grid.hexesInRange(hex, 2);
    return hexes.some(hex => hex.terrain.hasCougars());
  },
  name: 'Within two spaces of cougar territory'
}, {
  isPossibleOnHex: (grid, hex) => {
    const hexes = grid.hexesInRange(hex, 3);
    return hexes.some(hex => hex.terrain.hasBlueStructure());
  },
  name: 'Within three spaces of a blue structure'
}, {
  isPossibleOnHex: (grid, hex) => {
    const hexes = grid.hexesInRange(hex, 3);
    return hexes.some(hex => hex.terrain.hasWhiteStructure());
  },
  name: 'Within three spaces of a white structure'
}, {
  isPossibleOnHex: (grid, hex) => {
    const hexes = grid.hexesInRange(hex, 3);
    return hexes.some(hex => hex.terrain.hasGreenStructure());
  },
  name: 'Within three spaces of a green structure'
} // {
//   isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
//     const hexes = grid.hexesInRange(hex, 3)
//     return hexes.some((hex) => hex.terrain.hasBlackStructure())
//   },
//   name: 'Within three spaces of a black structure',
// },
];
exports.ALL_HINTS = ALL_HINTS;

class Hint {
  constructor(params) {
    this.isPossibleOnHex = params.isPossibleOnHex;
    this.isActive = true;
    this.name = params.name;
  }

  evaluate(grid, hex, isHabitat) {
    const isPossibleOnHex = this.isPossibleOnHex(grid, hex);

    if (isPossibleOnHex != isHabitat) {
      this.isActive = false;
    }
  }

}

exports.Hint = Hint;
},{}],"playground/player.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = void 0;

var _hint = require("./hint");

class Player {
  constructor() {
    this.hints = _hint.ALL_HINTS.map(hintParams => new _hint.Hint(hintParams));
  }

  get activeHints() {
    return this.hints.filter(hint => hint.isActive);
  }

}

exports.Player = Player;
},{"./hint":"playground/hint.ts"}],"playground/terrain.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tile = void 0;

var _tiles = require("./tiles");

class Tile {
  constructor(type) {
    this.type = type;
  }

  isForest() {
    return this.type.includes(_tiles.F);
  }

  isWater() {
    return this.type.includes(_tiles.W);
  }

  isDesert() {
    return this.type.includes(_tiles.D);
  }

  isMountain() {
    return this.type.includes(_tiles.M);
  }

  isSwamp() {
    return this.type.includes(_tiles.S);
  }

  hasBears() {
    return this.type.includes('bears');
  }

  hasCougars() {
    return this.type.includes('cougars');
  }

  hasSteppingStone() {
    return this.type.includes('stepping-stone');
  }

  get steppingStoneColor() {
    const types = this.type.split(' ');
    const steppingStone = types[types.length - 1];
    return steppingStone.split('-')[0];
  }

  hasAbandonedShack() {
    return this.type.includes('abandoned-shack');
  }

  get abandonedShackColor() {
    const types = this.type.split(' ');
    const abandonedShack = types[types.length - 1];
    return abandonedShack.split('-')[0];
  }

  hasBlueStructure() {
    return this.type.includes('Blue');
  }

  hasGreenStructure() {
    return this.type.includes('Green');
  }

  hasWhiteStructure() {
    return this.type.includes('White');
  }

}

exports.Tile = Tile;
},{"./tiles":"playground/tiles.ts"}],"playground/index.ts":[function(require,module,exports) {
"use strict";

var _render = require("./render");

var _tiles = require("./tiles");

var _src = require("../src");

var _player = require("./player");

var _terrain = require("./terrain");

var _document$querySelect;

const hexPrototype = (0, _src.createHexPrototype)({
  dimensions: {
    width: 60,
    height: 51.96
  },
  orientation: 'flat',
  origin: 'topLeft'
});
let grid = new _src.Grid(hexPrototype, (0, _src.rectangle)({
  width: 12,
  height: 9
}));
let selectedHexKey = '0,0';
let players = [];

const renderTiles = hexagonsOrdered => {
  (0, _render.renderAll)(hexagonsOrdered);
  (0, _render.highlightSelectedHex)(grid.store.get(selectedHexKey));
};

const printActiveHintsForPlayers = () => {
  players.forEach(player => console.log(player.activeHints.map(h => h.name).join(', ')));
};

const setIsActive = hexagonsOrdered => {
  hexagonsOrdered.forEach(hex => {
    const allPlayersHintsArrays = [];
    players.forEach(player => {
      let hintsArray = 0;
      player.hints.forEach(hint => {
        const isPossibleOnHex = hint.isActive && hint.isPossibleOnHex(grid, hex);
        hintsArray = hintsArray * 2 + (isPossibleOnHex ? 1 : 0);
      });
      allPlayersHintsArrays.push(hintsArray);
    }); // we have all hints for all players,
    // we need at least as many 1s as there are players

    const ones = allPlayersHintsArrays.reduce((accumulator, current) => accumulator | current, 0);
    const numberOfOnes = ones.toString(2).split('').reduce((accumulator, current) => accumulator + (current === '1' ? 1 : 0), 0);
    hex.isActive = numberOfOnes >= players.length;
  });
};

const printBestHexToAsk = hexagonsOrdered => {
  let maxNumberOfOnes = -1;
  let possibleHexes = [];
  hexagonsOrdered.forEach(hex => {
    const allPlayersHintsArrays = [];
    players.forEach(player => {
      let hintsArray = 0;
      player.hints.forEach(hint => {
        const isPossibleOnHex = hint.isActive && hint.isPossibleOnHex(grid, hex);
        hintsArray = hintsArray * 2 + (isPossibleOnHex ? 1 : 0);
      });
      allPlayersHintsArrays.push(hintsArray);
    });
    const ones = allPlayersHintsArrays.reduce((accumulator, current) => accumulator | current, 0);
    const numberOfOnes = ones.toString(2).split('').reduce((accumulator, current) => accumulator + (current === '1' ? 1 : 0), 0);

    if (numberOfOnes > maxNumberOfOnes) {
      maxNumberOfOnes = numberOfOnes;
      possibleHexes = [];
    }

    if (numberOfOnes === maxNumberOfOnes) {
      possibleHexes.push(hex);
    }
  });
  console.log('Possible hexes:', possibleHexes.length);
  const oneOfPossibleHexes = possibleHexes[Math.floor(Math.random() * possibleHexes.length)];
  console.log('Possible hex:', oneOfPossibleHexes);
};

const gatherAndRender = () => {
  const hexagonsOrdered = grid.hexes();
  printActiveHintsForPlayers();
  setIsActive(hexagonsOrdered);
  (0, _render.renderAll)(hexagonsOrdered);
  (0, _render.highlightSelectedHex)(grid.store.get(selectedHexKey));
  printBestHexToAsk(hexagonsOrdered);
};

document.addEventListener('click', e => {
  const clickEl = e.target;
  const hexEl = clickEl && clickEl.closest('[data-hex]');
  if (!hexEl) return;
  selectedHexKey = hexEl.dataset.hex || '0,0';
  const hex = grid.store.get(selectedHexKey);
  (0, _render.highlightSelectedHex)(hex);
});
(_document$querySelect = document.querySelector('.js-submit')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.addEventListener('click', () => {
  const gameplayEl = document.getElementById('gameplay');
  const playerName = document.querySelector('select[name="player"]').value;
  const habitat = document.querySelector('input[name="habitat"]');
  gameplayEl.value += `${playerName} ${selectedHexKey} ${habitat.checked ? '✅' : '⛔️'}\n`;
  gameplayEl.scrollTop = gameplayEl.scrollHeight;
  const player = players.find(player => player.name === playerName);
  player.activeHints.forEach(hint => hint.evaluate(grid, grid.store.get(selectedHexKey), habitat.checked));
  gatherAndRender();
});
document.querySelector('.js-placeStandingStone').addEventListener('click', () => {
  const stoneColor = document.getElementById('standing-stone-color').value;
  const hex = grid.store.get(selectedHexKey);
  const newHex = (0, _src.cloneHex)(hex);
  newHex.terrain = new _terrain.Tile(`${newHex.terrain.type} ${stoneColor}-stepping-stone`);
  grid = grid.update(grid => {
    grid.store.set(selectedHexKey, newHex);
  });
  gatherAndRender();
});
document.querySelector('.js-placeAbandonedShack').addEventListener('click', () => {
  const stoneColor = document.getElementById('abandoned-shack-color').value;
  const hex = grid.store.get(selectedHexKey);
  const newHex = (0, _src.cloneHex)(hex);
  newHex.terrain = new _terrain.Tile(`${newHex.terrain.type} ${stoneColor}-abandoned-shack`);
  grid = grid.update(grid => {
    grid.store.set(selectedHexKey, newHex);
  });
  gatherAndRender();
});

const renderMap = () => {
  const values = [];
  const forEach = Array.prototype.forEach;
  forEach.call(document.querySelectorAll('.js-tilesPosition'), (el, i) => values.push(el.value || i + 1));
  forEach.call(document.querySelectorAll('.js-tilesPositionCheckbox'), (el, i) => values[i] += el.checked ? 'r' : '');
  const tilesInArray = (0, _tiles.tilesToArray)(values);
  let index = 0;
  grid = grid.each(hex => {
    hex.terrain = new _terrain.Tile(tilesInArray[index++]);
  }).run();
  renderTiles(grid.hexes());
};

document.querySelectorAll('.js-tilesPosition').forEach(el => el.addEventListener('input', renderMap));
document.querySelectorAll('.js-tilesPositionCheckbox').forEach(el => el.addEventListener('change', renderMap));
renderMap();
document.querySelector('.js-startGame').addEventListener('click', () => {
  const numberOfPlayers = Number(document.querySelector('#number-of-players').value);
  players = [];

  for (let i = 0; i < numberOfPlayers; i++) {
    players.push(new _player.Player());
  }

  const hintSelected = document.querySelector('.js-initialHint').value;
  players.forEach(player => player.hints.forEach(hint => hint.isActive = hint.name !== hintSelected));
  players[0].hints.forEach(hint => hint.isActive = hint.name === hintSelected);
  const playerPlayingDropdown = document.querySelector('.js-playerPlaying');

  for (let i = 0; i < players.length; i++) {
    players[i].name = document.querySelector('input[name="player-' + i + '"]').value;
    playerPlayingDropdown.innerHTML += '<option value="' + players[i].name + '">' + players[i].name + '</option>';
  }

  document.querySelector('.js-gameSetup').setAttribute('hidden', '');
  document.querySelector('.js-gameplay').removeAttribute('hidden');
  printBestHexToAsk(grid.hexes());
});
},{"./render":"playground/render.ts","./tiles":"playground/tiles.ts","../src":"src/index.ts","./player":"playground/player.ts","./terrain":"playground/terrain.ts"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63223" + '/');

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