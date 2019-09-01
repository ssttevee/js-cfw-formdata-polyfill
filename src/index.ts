import FormDataFromRequest from './ponyfill';

Request.prototype.formData = FormDataFromRequest;
