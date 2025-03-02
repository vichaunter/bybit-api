import { AxiosRequestConfig } from 'axios';
import { RestClientOptions, GenericAPIResponse } from './requestUtils';
export default abstract class BaseRestClient {
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
    getPrivate(endpoint: string, params?: any): GenericAPIResponse;
    postPrivate(endpoint: string, params?: any): GenericAPIResponse;
    deletePrivate(endpoint: string, params?: any): GenericAPIResponse;
    filterUndefined(params: any): {};
    /**
     * @private Make a HTTP request to a specific endpoint. Private endpoints are automatically signed.
     */
    private _call;
    /**
     * @private generic handler to parse request exceptions
     */
    parseException(e: any): unknown;
    /**
     * @private sign request and set recv window
     */
    signRequest(data: any): Promise<any>;
    /**
     * Trigger time sync and store promise
     */
    private syncTime;
    abstract getServerTime(baseUrlKeyOverride?: string): Promise<number>;
    /**
     * Estimate drift based on client<->server latency
     */
    fetchTimeOffset(): Promise<number>;
}
