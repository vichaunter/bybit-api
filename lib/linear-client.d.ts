import { AxiosRequestConfig } from 'axios';
import { GenericAPIResponse, RestClientOptions } from './util/requestUtils';
import RequestWrapper from './util/requestWrapper';
import SharedEndpoints from './shared-endpoints';
export declare class LinearClient extends SharedEndpoints {
    protected requestWrapper: RequestWrapper;
    /**
     * @public Creates an instance of the linear REST API client.
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
    getTrades(params: {
        symbol: string;
        limit?: number;
    }): GenericAPIResponse;
    getLastFundingRate(params: {
        symbol: string;
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
    placeActiveOrder(params: {
        side: string;
        symbol: string;
        order_type: string;
        qty: number;
        price?: number;
        time_in_force: string;
        take_profit?: number;
        stop_loss?: number;
        tp_trigger_by?: string;
        sl_trigger_by?: string;
        reduce_only?: boolean;
        close_on_trigger?: boolean;
        order_link_id?: string;
    }): GenericAPIResponse;
    getActiveOrderList(params: {
        order_id?: string;
        order_link_id?: string;
        symbol: string;
        order?: string;
        page?: number;
        limit?: number;
        order_status?: string;
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
        p_r_qty?: number;
        p_r_price?: number;
        take_profit?: number;
        stop_loss?: number;
        tp_trigger_by?: string;
        sl_trigger_by?: string;
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
        qty: number;
        price?: number;
        base_price: number;
        stop_px: number;
        time_in_force: string;
        trigger_by?: string;
        close_on_trigger?: boolean;
        order_link_id?: string;
        reduce_only: boolean;
        take_profit?: number;
        stop_loss?: number;
        tp_trigger_by?: string;
        sl_trigger_by?: string;
    }): GenericAPIResponse;
    getConditionalOrder(params: {
        stop_order_id?: string;
        order_link_id?: string;
        symbol: string;
        stop_order_status?: string;
        order?: string;
        page?: number;
        limit?: number;
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
        p_r_price?: number;
        p_r_trigger_price?: number;
        take_profit?: number;
        stop_loss?: number;
        tp_trigger_by?: string;
        sl_trigger_by?: string;
    }): GenericAPIResponse;
    queryConditionalOrder(params: {
        symbol: string;
        stop_order_id?: string;
        order_link_id?: string;
    }): GenericAPIResponse;
    /**
     * Position
     */
    getPosition(params?: {
        symbol?: string;
    }): GenericAPIResponse;
    setAutoAddMargin(params?: {
        symbol: string;
        side: string;
        auto_add_margin: boolean;
    }): GenericAPIResponse;
    setMarginSwitch(params?: {
        symbol: string;
        is_isolated: boolean;
        buy_leverage: number;
        sell_leverage: number;
    }): GenericAPIResponse;
    setSwitchMode(params?: {
        symbol: string;
        tp_sl_mode: string;
    }): GenericAPIResponse;
    setAddReduceMargin(params?: {
        symbol: string;
        side: string;
        margin: number;
    }): GenericAPIResponse;
    setUserLeverage(params: {
        symbol: string;
        buy_leverage: number;
        sell_leverage: number;
    }): GenericAPIResponse;
    setTradingStop(params: {
        symbol: string;
        side: string;
        take_profit?: number;
        stop_loss?: number;
        trailing_stop?: number;
        tp_trigger_by?: string;
        sl_trigger_by?: string;
        sl_size?: number;
        tp_size?: number;
    }): GenericAPIResponse;
    getTradeRecords(params: {
        symbol: string;
        start_time?: number;
        end_time?: number;
        exec_type?: string;
        page?: number;
        limit?: number;
    }): GenericAPIResponse;
    getClosedPnl(params: {
        symbol: string;
        start_time?: number;
        end_time?: number;
        exec_type?: string;
        page?: number;
        limit?: number;
    }): GenericAPIResponse;
    /**
    * Risk Limit
    */
    getRiskLimitList(params: {
        symbol: string;
    }): GenericAPIResponse;
    setRiskLimit(params: {
        symbol: string;
        side: string;
        risk_id: string;
    }): GenericAPIResponse;
    /**
    * Funding
    */
    getPredictedFundingFee(params: {
        symbol: string;
    }): GenericAPIResponse;
    getLastFundingFee(params: {
        symbol: string;
    }): GenericAPIResponse;
}
