
/**
 * @deprecated
 */
export type ResponseData = {
    error?: string | 500 | 401 | 404 | 403 | 405 | 400; //we will need to add HTTP status codes as we need them
    result?: Object | Array<any> | string; //The server should never respond with both an error and result.
};

export type ResponseDataT<T> = 
    {error: string | 500 | 401 | 404 | 403 | 405 | 400} |
    {result: T};