import vue from 'rollup-plugin-vue';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import cssNest from 'postcss-nesting';

const extensions = ['.vue', '.ts', '.tsx', '.js', '.jsx'];

export default {
  input: './src/index.ts',
  plugins: [
    resolve(
      {
        extensions,
        browser: true,
      },
    ),
    vue({
      postcssPlugins: [
        cssNest,
      ],
    }),
    babel({
      extensions,
      babelHelpers: 'bundled',
      include: [
        'src/**/*',
      ],
      exclude: [
        'node_modules',
      ],
    }),
  ],
  output: {
    format: 'esm',
    file: 'dist/tetikus.esm.js',
  },
};
