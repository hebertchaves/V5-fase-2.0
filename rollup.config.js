// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/code.ts',
  output: {
    file: 'dist/code.js',
    format: 'iife',
    name: 'quasarToFigmaConverter'
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: false
    }),
    process.env.NODE_ENV === 'production' && terser()
  ]
};