"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const node_support_1 = require("./node-support");
const requestUtils_1 = require("./requestUtils");
class RequestUtil {
    constructor(key, secret, baseUrl, options = {}, requestOptions = {}) {
        this.timeOffset = null;
        this.syncTimePromise = null;
        this.options = Object.assign({ recv_window: 5000, 
            // how often to sync time drift with bybit servers
            sync_interval_ms: 3600000, 
            // if true, we'll throw errors if any params are undefined
            strict_param_validation: false }, options);
        this.globalRequestOptions = Object.assign(Object.assign({ 
            // in ms == 5 minutes by default
            timeout: 1000 * 60 * 5 }, requestOptions), { headers: {
                'x-referer': 'bybitapinode'
            } });
        this.baseUrl = baseUrl;
        if (key && !secret) {
            throw new Error('API Key & Secret are both required for private enpoints');
        }
        if (this.options.disable_time_sync !== true) {
            this.syncTime();
            setInterval(this.syncTime.bind(this), +this.options.sync_interval_ms);
        }
        this.key = key;
        this.secret = secret;
    }
    get(endpoint, params) {
        return this._call('GET', endpoint, params);
    }
    post(endpoint, params) {
        return this._call('POST', endpoint, params);
    }
    /**
     * @private Make a HTTP request to a specific endpoint. Private endpoints are automatically signed.
     */
    _call(method, endpoint, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, requestUtils_1.isPublicEndpoint)(endpoint)) {
                if (!this.key || !this.secret) {
                    throw new Error('Private endpoints require api and private keys set');
                }
                if (this.timeOffset === null) {
                    yield this.syncTime();
                }
                params = yield this.signRequest(params);
            }
            const options = Object.assign(Object.assign({}, this.globalRequestOptions), { url: [this.baseUrl, endpoint].join('/'), method: method, json: true });
            if (method === 'GET') {
                options.params = params;
            }
            else {
                options.data = params;
            }
            return (0, axios_1.default)(options).then(response => {
                if (response.status == 200) {
                    return response.data;
                }
                throw response;
            }).catch(e => this.parseException(e));
        });
    }
    /**
     * @private generic handler to parse request exceptions
     */
    parseException(e) {
        if (this.options.parse_exceptions === false) {
            throw e;
        }
        // Something happened in setting up the request that triggered an Error
        if (!e.response) {
            if (!e.request) {
                throw e.message;
            }
            // request made but no response received
            throw e;
        }
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const response = e.response;
        throw {
            code: response.status,
            message: response.statusText,
            body: response.data,
            headers: response.headers,
            requestOptions: this.options
        };
    }
    /**
     * @private sign request and set recv window
     */
    signRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = Object.assign(Object.assign({}, data), { api_key: this.key, timestamp: Date.now() + (this.timeOffset || 0) });
            // Optional, set to 5000 by default. Increase if timestamp/recv_window errors are seen.
            if (this.options.recv_window && !params.recv_window) {
                params.recv_window = this.options.recv_window;
            }
            if (this.key && this.secret) {
                const serializedParams = (0, requestUtils_1.serializeParams)(params, this.options.strict_param_validation);
                params.sign = yield (0, node_support_1.signMessage)(serializedParams, this.secret);
            }
            return params;
        });
    }
    /**
     * @private trigger time sync and store promise
     */
    syncTime() {
        if (this.options.disable_time_sync === true) {
            return Promise.resolve(false);
        }
        if (this.syncTimePromise !== null) {
            return this.syncTimePromise;
        }
        this.syncTimePromise = this.getTimeOffset().then(offset => {
            this.timeOffset = offset;
            this.syncTimePromise = null;
        });
        return this.syncTimePromise;
    }
    /**
     * @deprecated move this somewhere else, because v2/public/time shouldn't be hardcoded here
     *
     * @returns {Promise<number>}
     * @memberof RequestUtil
     */
    getTimeOffset() {
        return __awaiter(this, void 0, void 0, function* () {
            const start = Date.now();
            const result = yield this.get('v2/public/time');
            const end = Date.now();
            return Math.ceil((result.time_now * 1000) - end + ((end - start) / 2));
        });
    }
}
exports.default = RequestUtil;
;
//# sourceMappingURL=requestWrapper.js.map