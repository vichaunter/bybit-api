"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InverseFuturesClient = void 0;
const requestUtils_1 = require("./util/requestUtils");
const requestWrapper_1 = __importDefault(require("./util/requestWrapper"));
const shared_endpoints_1 = __importDefault(require("./shared-endpoints"));
class InverseFuturesClient extends shared_endpoints_1.default {
    /**
     * @public Creates an instance of the inverse futures REST API client.
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
     *    Note: These are currently the same as the inverse client
     */
    getKline(params) {
        return this.requestWrapper.get('v2/public/kline/list', params);
    }
    /**
     * Public trading records
     */
    getTrades(params) {
        return this.requestWrapper.get('v2/public/trading-records', params);
    }
    getMarkPriceKline(params) {
        return this.requestWrapper.get('v2/public/mark-price-kline', params);
    }
    getIndexPriceKline(params) {
        return this.requestWrapper.get('v2/public/index-price-kline', params);
    }
    getPremiumIndexKline(params) {
        return this.requestWrapper.get('v2/public/premium-index-kline', params);
    }
    /**
     *
     * Account Data Endpoints
     *
     */
    /**
   * Active orders
   */
    placeActiveOrder(orderRequest) {
        return this.requestWrapper.post('futures/private/order/create', orderRequest);
    }
    getActiveOrderList(params) {
        return this.requestWrapper.get('futures/private/order/list', params);
    }
    cancelActiveOrder(params) {
        return this.requestWrapper.post('futures/private/order/cancel', params);
    }
    cancelAllActiveOrders(params) {
        return this.requestWrapper.post('futures/private/order/cancelAll', params);
    }
    replaceActiveOrder(params) {
        return this.requestWrapper.post('futures/private/order/replace', params);
    }
    queryActiveOrder(params) {
        return this.requestWrapper.get('futures/private/order', params);
    }
    /**
   * Conditional orders
   */
    placeConditionalOrder(params) {
        return this.requestWrapper.post('futures/private/stop-order/create', params);
    }
    getConditionalOrder(params) {
        return this.requestWrapper.get('futures/private/stop-order/list', params);
    }
    cancelConditionalOrder(params) {
        return this.requestWrapper.post('futures/private/stop-order/cancel', params);
    }
    cancelAllConditionalOrders(params) {
        return this.requestWrapper.post('futures/private/stop-order/cancelAll', params);
    }
    replaceConditionalOrder(params) {
        return this.requestWrapper.post('futures/private/stop-order/replace', params);
    }
    queryConditionalOrder(params) {
        return this.requestWrapper.get('futures/private/stop-order', params);
    }
    /**
   * Position
   */
    /**
     * Get position list
     */
    getPosition(params) {
        return this.requestWrapper.get('futures/private/position/list', params);
    }
    changePositionMargin(params) {
        return this.requestWrapper.post('futures/private/position/change-position-margin', params);
    }
    setTradingStop(params) {
        return this.requestWrapper.post('futures/private/position/trading-stop', params);
    }
    setUserLeverage(params) {
        return this.requestWrapper.post('futures/private/position/leverage/save', params);
    }
    /**
     * Position mode switch
     */
    setPositionMode(params) {
        return this.requestWrapper.post('futures/private/position/switch-mode', params);
    }
    /**
     * Cross/Isolated margin switch. Must set leverage value when switching.
     */
    setMarginType(params) {
        return this.requestWrapper.post('futures/private/position/switch-isolated', params);
    }
    getTradeRecords(params) {
        return this.requestWrapper.get('futures/private/execution/list', params);
    }
    getClosedPnl(params) {
        return this.requestWrapper.get('futures/private/trade/closed-pnl/list', params);
    }
    /**
     **** The following are all the same as the inverse client ****
     */
    /**
   * Risk Limit
   */
    getRiskLimitList() {
        return this.requestWrapper.get('open-api/wallet/risk-limit/list');
    }
    setRiskLimit(params) {
        return this.requestWrapper.post('open-api/wallet/risk-limit', params);
    }
    /**
   * Funding
   */
    getLastFundingRate(params) {
        return this.requestWrapper.get('v2/public/funding/prev-funding-rate', params);
    }
    getMyLastFundingFee(params) {
        return this.requestWrapper.get('v2/private/funding/prev-funding', params);
    }
    getPredictedFunding(params) {
        return this.requestWrapper.get('v2/private/funding/predicted-funding', params);
    }
    /**
   * LCP Info
   */
    getLcpInfo(params) {
        return this.requestWrapper.get('v2/private/account/lcp', params);
    }
}
exports.InverseFuturesClient = InverseFuturesClient;
;
//# sourceMappingURL=inverse-futures-client.js.map