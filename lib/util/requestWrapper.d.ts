import { AxiosRequestConfig, Method } from 'axios';
import { RestClientOptions, GenericAPIResponse } from './requestUtils';
export default class RequestUtil {
    private timeOffset;
    private syncTimePromise;
    private options;
    private baseUrl;
    private globalRequestOptions;
    private key;
    private secret;
    constructor(key: string | undefined, secret: string | undefined, baseUrl: string, options?: RestClientOptions, requestOptions?: AxiosRequestConfig);
    get(endpoint: string, params?: any): GenericAPIResponse;
    post(endpoint: string, params?: any): GenericAPIResponse;
    /**
     * @private Make a HTTP request to a specific endpoint. Private endpoints are automatically signed.
     */
    _call(method: Method, endpoint: string, params?: any): GenericAPIResponse;
    /**
     * @private generic handler to parse request exceptions
     */
    parseException(e: any): unknown;
    /**
     * @private sign request and set recv window
     */
    signRequest(data: any): Promise<any>;
    /**
     * @private trigger time sync and store promise
     */
    syncTime(): GenericAPIResponse;
    /**
     * @deprecated move this somewhere else, because v2/public/time shouldn't be hardcoded here
     *
     * @returns {Promise<number>}
     * @memberof RequestUtil
     */
    getTimeOffset(): Promise<number>;
}
