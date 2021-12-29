import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/async-functional-utils.min.js',
    format: 'esm',
  },
  external: [],
  plugins: [
    resolve(),
    commonjs({
      include: 'node_modules/**',
    }),
    replace({
      'process.env.NODE_ENV': '"production"',
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    terser(),
  ],
};
