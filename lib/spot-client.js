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
exports.SpotClient = void 0;
const BaseRestClient_1 = __importDefault(require("./util/BaseRestClient"));
const requestUtils_1 = require("./util/requestUtils");
class SpotClient extends BaseRestClient_1.default {
    /**
     * @public Creates an instance of the Spot REST API client.
     *
     * @param {string} key - your API key
     * @param {string} secret - your API secret
     * @param {boolean} [useLivenet=false]
     * @param {RestClientOptions} [restClientOptions={}] options to configure REST API connectivity
     * @param {AxiosRequestConfig} [requestOptions={}] HTTP networking options for axios
     */
    constructor(key, secret, useLivenet = false, restClientOptions = {}, requestOptions = {}) {
        super(key, secret, (0, requestUtils_1.getRestBaseUrl)(useLivenet, restClientOptions), restClientOptions, requestOptions);
        // this.requestWrapper = new RequestWrapper(
        //   key,
        //   secret,
        //   getRestBaseUrl(useLivenet, restClientOptions),
        //   restClientOptions,
        //   requestOptions
        // );
        return this;
    }
    getServerTime(urlKeyOverride) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.get('/spot/v1/time');
            return result.serverTime;
        });
    }
    /**
     *
     * Market Data Endpoints
     *
    **/
    getSymbols() {
        return this.get('/spot/v1/symbols');
    }
    getOrderBook(symbol, limit) {
        return this.get('/spot/quote/v1/depth', {
            symbol, limit
        });
    }
    getMergedOrderBook(symbol, scale, limit) {
        return this.get('/spot/quote/v1/depth/merged', {
            symbol,
            scale,
            limit,
        });
    }
    getTrades(symbol, limit) {
        return this.get('/spot/quote/v1/trades', {
            symbol,
            limit,
        });
    }
    getCandles(symbol, interval, limit, startTime, endTime) {
        return this.get('/spot/quote/v1/kline', {
            symbol,
            interval,
            limit,
            startTime,
            endTime,
        });
    }
    get24hrTicker(symbol) {
        return this.get('/spot/quote/v1/ticker/24hr', { symbol });
    }
    getLastTradedPrice(symbol) {
        return this.get('/spot/quote/v1/ticker/price', { symbol });
    }
    getBestBidAskPrice(symbol) {
        return this.get('/spot/quote/v1/ticker/book_ticker', { symbol });
    }
    /**
     * Account Data Endpoints
     */
    submitOrder(params) {
        return this.postPrivate('/spot/v1/order', params);
    }
    getOrder(params) {
        return this.getPrivate('/spot/v1/order', params);
    }
    cancelOrder(params) {
        return this.deletePrivate('/spot/v1/order', params);
    }
    cancelOrderBatch(params) {
        const orderTypes = params.orderTypes ? params.orderTypes.join(',') : undefined;
        return this.deletePrivate('/spot/order/batch-cancel', Object.assign(Object.assign({}, params), { orderTypes }));
    }
    getOpenOrders(symbol, orderId, limit) {
        return this.getPrivate('/spot/v1/open-orders', {
            symbol,
            orderId,
            limit,
        });
    }
    getPastOrders(symbol, orderId, limit) {
        return this.getPrivate('/spot/v1/history-orders', {
            symbol,
            orderId,
            limit,
        });
    }
    getMyTrades(symbol, limit, fromId, toId) {
        return this.getPrivate('/spot/v1/myTrades', {
            symbol,
            limit,
            fromId,
            toId,
        });
    }
    /**
     * Wallet Data Endpoints
     */
    getBalances() {
        return this.getPrivate('/spot/v1/account');
    }
}
exports.SpotClient = SpotClient;
//# sourceMappingURL=spot-client.js.map