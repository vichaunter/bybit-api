"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinearClient = void 0;
const requestUtils_1 = require("./util/requestUtils");
const requestWrapper_1 = __importDefault(require("./util/requestWrapper"));
const shared_endpoints_1 = __importDefault(require("./shared-endpoints"));
class LinearClient extends shared_endpoints_1.default {
    /**
     * @public Creates an instance of the linear REST API client.
     *
     * @param {string} key - your API key
     * @param {string} secret - your API secret
     * @param {boolean} [useLivenet=false]
     * @param {RestClientOptions} [restClientOptions={}] options to configure REST API connectivity
     * @param {AxiosRequestConfig} [requestOptions={}] HTTP networking options for axios
     */
    constructor(key, secret, useLivenet = false, restClientOptions = {}, requestOptions = {}) {
        super();
        this.requestWrapper = new requestWrapper_1.default(key, secret, (0, requestUtils_1.getRestBaseUrl)(useLivenet, restClientOptions), restClientOptions, requestOptions);
        return this;
    }
    /**
     *
     * Market Data Endpoints
     *
     */
    getKline(params) {
        return this.requestWrapper.get('public/linear/kline', params);
    }
    getTrades(params) {
        return this.requestWrapper.get('public/linear/recent-trading-records', params);
    }
    getLastFundingRate(params) {
        return this.requestWrapper.get('public/linear/funding/prev-funding-rate', params);
    }
    getMarkPriceKline(params) {
        return this.requestWrapper.get('public/linear/mark-price-kline', params);
    }
    getIndexPriceKline(params) {
        return this.requestWrapper.get('public/linear/index-price-kline', params);
    }
    getPremiumIndexKline(params) {
        return this.requestWrapper.get('public/linear/premium-index-kline', params);
    }
    /**
     *
     * Account Data Endpoints
     *
     */
    placeActiveOrder(params) {
        return this.requestWrapper.post('private/linear/order/create', params);
    }
    getActiveOrderList(params) {
        return this.requestWrapper.get('private/linear/order/list', params);
    }
    cancelActiveOrder(params) {
        return this.requestWrapper.post('private/linear/order/cancel', params);
    }
    cancelAllActiveOrders(params) {
        return this.requestWrapper.post('private/linear/order/cancel-all', params);
    }
    replaceActiveOrder(params) {
        return this.requestWrapper.post('private/linear/order/replace', params);
    }
    queryActiveOrder(params) {
        return this.requestWrapper.get('private/linear/order/search', params);
    }
    /**
    * Conditional orders
    */
    placeConditionalOrder(params) {
        return this.requestWrapper.post('private/linear/stop-order/create', params);
    }
    getConditionalOrder(params) {
        return this.requestWrapper.get('private/linear/stop-order/list', params);
    }
    cancelConditionalOrder(params) {
        return this.requestWrapper.post('private/linear/stop-order/cancel', params);
    }
    cancelAllConditionalOrders(params) {
        return this.requestWrapper.post('private/linear/stop-order/cancel-all', params);
    }
    replaceConditionalOrder(params) {
        return this.requestWrapper.post('private/linear/stop-order/replace', params);
    }
    queryConditionalOrder(params) {
        return this.requestWrapper.get('private/linear/stop-order/search', params);
    }
    /**
     * Position
     */
    getPosition(params) {
        return this.requestWrapper.get('private/linear/position/list', params);
    }
    setAutoAddMargin(params) {
        return this.requestWrapper.post('private/linear/position/set-auto-add-margin', params);
    }
    setMarginSwitch(params) {
        return this.requestWrapper.post('private/linear/position/switch-isolated', params);
    }
    setSwitchMode(params) {
        return this.requestWrapper.post('private/linear/tpsl/switch-mode', params);
    }
    setAddReduceMargin(params) {
        return this.requestWrapper.post('private/linear/position/add-margin', params);
    }
    setUserLeverage(params) {
        return this.requestWrapper.post('private/linear/position/set-leverage', params);
    }
    setTradingStop(params) {
        return this.requestWrapper.post('private/linear/position/trading-stop', params);
    }
    getTradeRecords(params) {
        return this.requestWrapper.get('private/linear/trade/execution/list', params);
    }
    getClosedPnl(params) {
        return this.requestWrapper.get('private/linear/trade/closed-pnl/list', params);
    }
    /**
    * Risk Limit
    */
    getRiskLimitList(params) {
        return this.requestWrapper.get('public/linear/risk-limit', params);
    }
    setRiskLimit(params) {
        return this.requestWrapper.get('private/linear/position/set-risk', params);
    }
    /**
    * Funding
    */
    getPredictedFundingFee(params) {
        return this.requestWrapper.get('private/linear/funding/predicted-funding', params);
    }
    getLastFundingFee(params) {
        return this.requestWrapper.get('private/linear/funding/prev-funding', params);
    }
}
exports.LinearClient = LinearClient;
//# sourceMappingURL=linear-client.js.map