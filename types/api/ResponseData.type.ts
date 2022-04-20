/**
 * @deprecated
 */
export type ResponseData = {
    error?: string | 500 | 401 | 404 | 403 | 405 | 400; //we will need to add HTTP status codes as we need them
    result?: Object | Array<any> | string; //The server should never respond with both an error and result.
};

/**
 * @deprecated in favor of ResponseDataUni
 */
export type ResponseDataT<T> =
    | ApiError
    | { result: T };

import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";

export class ResponseDataUni<T> {
    data?: T;
    errors: Array<ApiError>;
    req_id: string;
    path: string;
    timestamp: string;

    constructor(path: string, errors: Array<ApiError>, data?: T,) {
        this.req_id = uuidv4();
        this.data = data;
        this.errors = errors;
        this.path = path;
        this.timestamp = DateTime.now().toISO();
    }
}

export class ApiError {
    error: string;
    message: string;
    detail: string;
    docs?: string;

    constructor(
        err: string, msg: string, detail: string, docsURL?: string
    ) {
        this.error = err;
        this.message = msg;
        this.detail = detail;
        this.docs = docsURL
    }
}
