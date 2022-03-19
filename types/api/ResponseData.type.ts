export type ResponseData = {
    //Assume strings passed for error may be displayed to end users
    error?: string | 500 | 401 | 404 | 403 | 405;  //we will need to add HTTP status codes as we need them
    //The existence of this property indicates the request succeeded
    result?: Object | Array<any> | string; //The server should never respond with both an error and result.
}