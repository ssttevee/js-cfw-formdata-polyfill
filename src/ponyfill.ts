import Blob from '@ssttevee/blob-ponyfill/blob';
import FormData from '@ssttevee/formdata-ponyfill';
import { parseMultipart } from '@ssttevee/multipart-parser';
import { arrayToString } from '@ssttevee/u8-utils';

const RE_MULTIPART = /^multipart\/form-data(?:;\s*boundary=(?:"((?:[^"]|\\")+)"|([^\s;]+)))$/;
const RE_URLENCODED = /^application\/x-www-form-urlencoded(?:;|$|\s)/;

type Parser = (this: Request) => Promise<FormData>;

export function makeWrapper(fallbackParser: Parser): Parser {
    return async function(this: Request): Promise<FormData> {
        const contentType = this.headers.get('content-type');
        const matches = RE_MULTIPART.exec(contentType);
        if (matches && (matches[1] || matches[2])) {
            const parts = await parseMultipart(this.body, matches[1] || matches[2]);
            const fd = new FormData();
            for (const { name, data, filename, contentType } of parts) {
                fd.append(name, filename ? new Blob([data], { type: contentType }) : arrayToString(data), filename);
            }

            return fd;
        }

        if (contentType.match(RE_URLENCODED)) {
            return fallbackParser.call(this);
        }

        throw new TypeError('Unexpected Content-Type: ' + contentType);
    }
}

export default makeWrapper(Request.prototype.formData as any);
