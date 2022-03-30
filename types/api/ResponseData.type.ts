
/**
 * @deprecated
 */
export type ResponseData = {
    error?: string | number;
    result?: Object | Array<any> | string;
};

export type ResponseDataT<T> = 
    {error?: string | number} |
    {result?: T};