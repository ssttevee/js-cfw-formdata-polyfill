import FormDataFromRequest from '@ssttevee/cfw-formdata-polyfill/ponyfill';

addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event.request));
});

/**
 * Fetch and log a given request object
 * @param {Request} request
 */
async function handleRequest(request) {
    const res = { files: undefined, form: undefined };
    if (request.method === 'POST') {
        try {
            const fd = await FormDataFromRequest.call(request);
            for (const [name, value] of fd.entries()) {
                if (value instanceof Blob) {
                    if (!res.files) {
                        res.files = {};
                    }

                    res.files[name] = btoa(new FileReaderSync().readAsBinaryString(value));
                } else {
                    if (!res.form) {
                        res.form = {};
                    }

                    res.form[name] = value;
                }
            }
        } catch (err) {
            return new Response(err.stack, { status: 500 });
        }
    }

    return new Response(JSON.stringify(res));
}
