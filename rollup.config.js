import pkg from './package.json' assert { type: 'json' };

export default [
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs', exports: 'auto' },
      { file: pkg.module, format: 'es' },
    ],
    external: [],
    plugins: [],
  },
];
