import inject from 'rollup-plugin-inject';
import resolve from 'rollup-plugin-node-resolve';

module.exports = {
    input: 'src/main.js',
    output: {
        file: 'build/main.js',
        format: 'esm',
    },
    plugins: [
        /* remove this */ { resolveId: (source) => source === '@ssttevee/cfw-formdata-polyfill/ponyfill' ? { id: require.resolve('../../ponyfill.js') } : undefined },
        resolve(),
    ],
};
