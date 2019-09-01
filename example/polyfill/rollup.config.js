import inject from 'rollup-plugin-inject';
import resolve from 'rollup-plugin-node-resolve';

module.exports = {
    input: 'src/main.js',
    output: {
        file: 'build/main.js',
        format: 'esm',
    },
    plugins: [
        /* remove this */ { resolveId: (source) => source === '@ssttevee/cfw-formdata-polyfill' ? { id: require.resolve('../../index.js') } : undefined },
        resolve(),
        inject({
            modules: {
                Blob: '@ssttevee/blob-ponyfill/blob',
                File: '@ssttevee/blob-ponyfill/file',
                FileReaderSync: '@ssttevee/blob-ponyfill/filereadersync',
            },
        }),
    ],
};
