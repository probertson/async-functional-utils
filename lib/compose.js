"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compose = compose;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function compose() {
  for (var _len = arguments.length, reducers = new Array(_len), _key = 0; _key < _len; _key++) {
    reducers[_key] = arguments[_key];
  }

  return /*#__PURE__*/function () {
    var _composedFunctions = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee(valueGenerator) {
      var accumulators, _loop, _ret;

      return _regenerator["default"].wrap(function _callee$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              accumulators = reducers.map(function (reducer) {
                return reducer.initial;
              });
              _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
                var _yield$valueGenerator, done, value, nextValue;

                return _regenerator["default"].wrap(function _loop$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return valueGenerator.next();

                      case 2:
                        _yield$valueGenerator = _context.sent;
                        done = _yield$valueGenerator.done;
                        value = _yield$valueGenerator.value;

                        if (!done) {
                          _context.next = 7;
                          break;
                        }

                        return _context.abrupt("return", "break");

                      case 7:
                        nextValue = value;
                        reducers.some(function (reducer, index) {
                          var oldAccumulator = accumulators[index];

                          var _reducer = reducer(oldAccumulator, nextValue),
                              accumulator = _reducer.accumulator,
                              valueOut = _reducer.valueOut;

                          accumulators[index] = accumulator;
                          nextValue = valueOut;
                          return oldAccumulator === accumulator;
                        });

                      case 9:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _loop);
              });

            case 2:
              if (!true) {
                _context2.next = 9;
                break;
              }

              return _context2.delegateYield(_loop(), "t0", 4);

            case 4:
              _ret = _context2.t0;

              if (!(_ret === "break")) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt("break", 9);

            case 7:
              _context2.next = 2;
              break;

            case 9:
              return _context2.abrupt("return", accumulators[accumulators.length - 1]);

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee);
    }));

    function composedFunctions(_x) {
      return _composedFunctions.apply(this, arguments);
    }

    return composedFunctions;
  }();
}