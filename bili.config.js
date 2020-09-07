export default {
  banner: true,
  env: 'production',
  input: 'src/index.ts',
  plugins: {
    vue: true,
  },
  output: {
    format: ['cjs', 'esm', 'umd', 'iife'],
    moduleName: 'tetikus',
  },
};
