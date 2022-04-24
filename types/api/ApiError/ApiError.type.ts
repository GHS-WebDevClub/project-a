import errors from "./ApiErrors.json";

/**
 * Errors with status code 200 OK should be non-blocking client-side
 */
export class ApiError {
  //Internal Error Code
  code: string;
  //Public-facing
  message: string;
  //Internal Debugging
  detail: string;
  //Optional documentation URL
  docs?: string;

  constructor(errCode: string, msg: string, detail?: string, docsURL?: string) {
    this.code = errCode;
    this.message = msg;
    this.detail = detail || msg;
    this.docs = docsURL;
  }

  /**
   *
   * @param errCode Must be a valid internal API error code found in ApiErrors.json following the format of "err_subset-err_number" eg. auth-001
   * @param userMsg Overrides default message that can be shown to an end user
   * @returns new ApiError
   */
  static fromCode(errCode: string, userMsg?: string) {
    const [set, num] = errCode.split("-");

    const e: ErrData = (errors as ErrJson)[set][num];

    const res = new ApiError(errCode, userMsg || e.message, e.detail, e.docs);

    return res;
  }
}

interface IIndexable<T> {
  [key: string]: T;
}

type ErrJson = IIndexable<ErrInJson> & {
  req: ErrInJson;
  srv: ErrInJson;
  dat: ErrInJson;
  auth: ErrInJson;
};

type ErrInJson = IIndexable<ErrData>;

type ErrData = {
  httpCode: number;
  message: string;
  detail: string;
  docs?: string;
};
