import { AxiosRequestConfig } from 'axios';
import { GenericAPIResponse, RestClientOptions } from './util/requestUtils';
import RequestWrapper from './util/requestWrapper';
import SharedEndpoints from './shared-endpoints';
export declare class InverseClient extends SharedEndpoints {
    protected requestWrapper: RequestWrapper;
    /**
     * @public Creates an instance of the inverse REST API client.
     *
     * @param {string} key - your API key
     * @param {string} secret - your API secret
     * @param {boolean} [useLivenet=false]
     * @param {RestClientOptions} [restClientOptions={}] options to configure REST API connectivity
     * @param {AxiosRequestConfig} [requestOptions={}] HTTP networking options for axios
     */
    constructor(key?: string | undefined, secret?: string | undefined, useLivenet?: boolean, restClientOptions?: RestClientOptions, requestOptions?: AxiosRequestConfig);
    /**
     *
     * Market Data Endpoints
     *
     */
    getKline(params: {
        symbol: string;
        interval: string;
        from: number;
        limit?: number;
    }): GenericAPIResponse;
    /**
     * @deprecated use getTickers() instead
     */
    getLatestInformation(params?: {
        symbol?: string;
    }): GenericAPIResponse;
    /**
     * @deprecated use getTrades() instead
     */
    getPublicTradingRecords(params: {
        symbol: string;
        from?: number;
        limit?: number;
    }): GenericAPIResponse;
    getTrades(params: {
        symbol: string;
        from?: number;
        limit?: number;
    }): GenericAPIResponse;
    getMarkPriceKline(params: {
        symbol: string;
        interval: string;
        from: number;
        limit?: number;
    }): GenericAPIResponse;
    getIndexPriceKline(params: {
        symbol: string;
        interval: string;
        from: number;
        limit?: number;
    }): GenericAPIResponse;
    getPremiumIndexKline(params: {
        symbol: string;
        interval: string;
        from: number;
        limit?: number;
    }): GenericAPIResponse;
    /**
     *
     * Account Data Endpoints
     *
     */
    /**
     * Active orders
     */
    placeActiveOrder(orderRequest: {
        side: string;
        symbol: string;
        order_type: string;
        qty: number;
        price?: number;
        time_in_force: string;
        take_profit?: number;
        stop_loss?: number;
        reduce_only?: boolean;
        tp_trigger_by?: 'LastPrice' | 'MarkPrice' | 'IndexPrice';
        sl_trigger_by?: 'LastPrice' | 'MarkPrice' | 'IndexPrice';
        close_on_trigger?: boolean;
        order_link_id?: string;
    }): GenericAPIResponse;
    getActiveOrderList(params: {
        symbol: string;
        order_status?: string;
        direction?: string;
        limit?: number;
        cursor?: string;
    }): GenericAPIResponse;
    cancelActiveOrder(params: {
        symbol: string;
        order_id?: string;
        order_link_id?: string;
    }): GenericAPIResponse;
    cancelAllActiveOrders(params: {
        symbol: string;
    }): GenericAPIResponse;
    replaceActiveOrder(params: {
        order_id?: string;
        order_link_id?: string;
        symbol: string;
        p_r_qty?: string;
        p_r_price?: string;
    }): GenericAPIResponse;
    queryActiveOrder(params: {
        order_id?: string;
        order_link_id?: string;
        symbol: string;
    }): GenericAPIResponse;
    /**
     * Conditional orders
     */
    placeConditionalOrder(params: {
        side: string;
        symbol: string;
        order_type: string;
        qty: string;
        price?: string;
        base_price: string;
        stop_px: string;
        time_in_force: string;
        trigger_by?: string;
        close_on_trigger?: boolean;
        order_link_id?: string;
    }): GenericAPIResponse;
    getConditionalOrder(params: {
        symbol: string;
        stop_order_status?: string;
        direction?: string;
        limit?: number;
        cursor?: string;
    }): GenericAPIResponse;
    cancelConditionalOrder(params: {
        symbol: string;
        stop_order_id?: string;
        order_link_id?: string;
    }): GenericAPIResponse;
    cancelAllConditionalOrders(params: {
        symbol: string;
    }): GenericAPIResponse;
    replaceConditionalOrder(params: {
        stop_order_id?: string;
        order_link_id?: string;
        symbol: string;
        p_r_qty?: number;
        p_r_price?: string;
        p_r_trigger_price?: string;
    }): GenericAPIResponse;
    queryConditionalOrder(params: {
        symbol: string;
        stop_order_id?: string;
        order_link_id?: string;
    }): GenericAPIResponse;
    /**
     * Position
     */
    /**
     * @deprecated use getPosition() instead
     */
    getUserLeverage(): GenericAPIResponse;
    getPosition(params?: {
        symbol?: string;
    }): GenericAPIResponse;
    /**
     * @deprecated use getPosition() instead
     */
    getPositions(): GenericAPIResponse;
    changePositionMargin(params: {
        symbol: string;
        margin: string;
    }): GenericAPIResponse;
    setTradingStop(params: {
        symbol: string;
        take_profit?: number;
        stop_loss?: number;
        trailing_stop?: number;
        tp_trigger_by?: string;
        sl_trigger_by?: string;
        new_trailing_active?: number;
    }): GenericAPIResponse;
    setUserLeverage(params: {
        symbol: string;
        leverage: number;
        leverage_only?: boolean;
    }): GenericAPIResponse;
    /**
     * @deprecated use setUserLeverage() instead
     */
    changeUserLeverage(params: any): GenericAPIResponse;
    getTradeRecords(params: {
        order_id?: string;
        symbol: string;
        start_time?: number;
        page?: number;
        limit?: number;
        order?: string;
    }): GenericAPIResponse;
    getClosedPnl(params: {
        symbol: string;
        start_time?: number;
        end_time?: number;
        exec_type?: string;
        page?: number;
        limit?: number;
    }): GenericAPIResponse;
    setPositionMode(params: {
        symbol: string;
        mode: 0 | 3;
    }): GenericAPIResponse;
    setSlTpPositionMode(params: {
        symbol: string;
        tp_sl_mode: 'Full' | 'Partial';
    }): GenericAPIResponse;
    setMarginType(params: {
        symbol: string;
        is_isolated: boolean;
        buy_leverage: number;
        sell_leverage: number;
    }): GenericAPIResponse;
    /**
     * Risk Limit
     */
    getRiskLimitList(): GenericAPIResponse;
    setRiskLimit(params: {
        symbol: string;
        risk_id: string;
    }): GenericAPIResponse;
    /**
     * Funding
     */
    getLastFundingRate(params: {
        symbol: string;
    }): GenericAPIResponse;
    getMyLastFundingFee(params: {
        symbol: string;
    }): GenericAPIResponse;
    getPredictedFunding(params: {
        symbol: string;
    }): GenericAPIResponse;
    /**
     * LCP Info
     */
    getLcpInfo(params: {
        symbol: string;
    }): GenericAPIResponse;
}
