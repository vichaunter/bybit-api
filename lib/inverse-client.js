"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InverseClient = void 0;
const requestUtils_1 = require("./util/requestUtils");
const requestWrapper_1 = __importDefault(require("./util/requestWrapper"));
const shared_endpoints_1 = __importDefault(require("./shared-endpoints"));
class InverseClient extends shared_endpoints_1.default {
    /**
     * @public Creates an instance of the inverse REST API client.
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
        return this.requestWrapper.get('v2/public/kline/list', params);
    }
    /**
     * @deprecated use getTickers() instead
     */
    getLatestInformation(params) {
        return this.getTickers(params);
    }
    /**
     * @deprecated use getTrades() instead
     */
    getPublicTradingRecords(params) {
        return this.getTrades(params);
    }
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
        return this.requestWrapper.post('v2/private/order/create', orderRequest);
    }
    getActiveOrderList(params) {
        return this.requestWrapper.get('v2/private/order/list', params);
    }
    cancelActiveOrder(params) {
        return this.requestWrapper.post('v2/private/order/cancel', params);
    }
    cancelAllActiveOrders(params) {
        return this.requestWrapper.post('v2/private/order/cancelAll', params);
    }
    replaceActiveOrder(params) {
        return this.requestWrapper.post('v2/private/order/replace', params);
    }
    queryActiveOrder(params) {
        return this.requestWrapper.get('v2/private/order', params);
    }
    /**
     * Conditional orders
     */
    placeConditionalOrder(params) {
        return this.requestWrapper.post('v2/private/stop-order/create', params);
    }
    getConditionalOrder(params) {
        return this.requestWrapper.get('v2/private/stop-order/list', params);
    }
    cancelConditionalOrder(params) {
        return this.requestWrapper.post('v2/private/stop-order/cancel', params);
    }
    cancelAllConditionalOrders(params) {
        return this.requestWrapper.post('v2/private/stop-order/cancelAll', params);
    }
    replaceConditionalOrder(params) {
        return this.requestWrapper.post('v2/private/stop-order/replace', params);
    }
    queryConditionalOrder(params) {
        return this.requestWrapper.get('v2/private/stop-order', params);
    }
    /**
     * Position
     */
    /**
     * @deprecated use getPosition() instead
     */
    getUserLeverage() {
        return this.requestWrapper.get('user/leverage');
    }
    getPosition(params) {
        return this.requestWrapper.get('v2/private/position/list', params);
    }
    /**
     * @deprecated use getPosition() instead
     */
    getPositions() {
        return this.requestWrapper.get('position/list');
    }
    changePositionMargin(params) {
        return this.requestWrapper.post('position/change-position-margin', params);
    }
    setTradingStop(params) {
        return this.requestWrapper.post('v2/private/position/trading-stop', params);
    }
    setUserLeverage(params) {
        return this.requestWrapper.post('v2/private/position/leverage/save', params);
    }
    /**
     * @deprecated use setUserLeverage() instead
     */
    changeUserLeverage(params) {
        return this.setUserLeverage(params);
    }
    getTradeRecords(params) {
        return this.requestWrapper.get('v2/private/execution/list', params);
    }
    getClosedPnl(params) {
        return this.requestWrapper.get('v2/private/trade/closed-pnl/list', params);
    }
    setPositionMode(params) {
        return this.requestWrapper.post('v2/private/position/switch-mode', params);
    }
    setSlTpPositionMode(params) {
        return this.requestWrapper.post('v2/private/tpsl/switch-mode', params);
    }
    setMarginType(params) {
        return this.requestWrapper.post('v2/private/position/switch-isolated', params);
    }
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
exports.InverseClient = InverseClient;
;
//# sourceMappingURL=inverse-client.js.map