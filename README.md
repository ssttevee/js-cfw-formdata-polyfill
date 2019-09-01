# TL;DR

A polyfill for `Request.prototype.formData` on cloudflare workers because they're not compliant to the [whatwg spec](https://fetch.spec.whatwg.org/#dom-body-formdata) even though [their documentation suggests otherwise](https://developers.cloudflare.com/workers/reference/runtime/apis/fetch/#methods-1).

## Installation

```bash
npm install @ssttevee/cfw-formdata-polyfill
```

## Usage

```js
import `@ssttevee/cfw-formdata-polyfill`;

// get req from handler

const fd = await req.formData();
```

or if a [ponyfill](https://ponyfill.com/) is more preferrable

```js
import FormDataFromRequest from '@ssttevee/cfw-formdata-polyfill/ponyfill';

// get req from handler

const fd = await FormDataFromRequest.call(req);
```

## Examples

There are some full examples in the [examples directory](https://github.com/ssttevee/cfw-formdata-polyfill/tree/master/src).

# Native `Request.prototype.formData` on Cloudflare Workers

Since before the public launch of Cloudflare Workers until the time of writing, `Request.prototype.formData` has been able to handle `application/x-www-form-urlencoded` payloads as one would expect. However, their support for `multipart/form-data` has been... undocumented. 

## Native `multipart/form-data` support

The native `Request.prototype.formData` does technically support `multipart/form-data`. However, files are returned as binary strings rather than a Blob. That means the filename and content type metadata is lost. Though this is somewhat justified upon closer inspection of the environment.

## The FormData API

The FormData API, as long as no files are involved, seems to work as one would expect. However, advanced users will quickly realize that it cannot be used to construct `multipart/form-data` payloads to be used with `fetch`. It doesn't even accept any type other than strings. This is because the Blob API doesn't exist on Cloudflare Workers.

## The Blob API

The Blob API, as designed for the browser, is meant to be an abstraction for reading arbitrary data, outside of the browser sandbox, from the operating system. Meanwhile, there is no parallel in the Cloudflare Workers environment. This, I believe, is the primary reason that this halfway point for the FormData API exists on Cloudflare Workers.

## Polyfilling

This package was designed to be used in conjuction with a bundler -- I prefer rollup -- to fix `Request.prototype.formData` and to be able to use it for receiving `multipart/form-data` uploads.
