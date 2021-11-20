import { GenericAPIResponse } from './util/requestUtils';
import RequestWrapper from './util/requestWrapper';
export default class SharedEndpoints {
    protected requestWrapper: RequestWrapper;
    /**
     *
     * Market Data Endpoints
     *
     */
    getOrderBook(params: {
        symbol: string;
    }): GenericAPIResponse;
    /**
     * Get latest information for symbol
     */
    getTickers(params?: {
        symbol?: string;
    }): GenericAPIResponse;
    getSymbols(): GenericAPIResponse;
    /**
     *
     * Market Data : Advanced
     *
     */
    getOpenInterest(params: {
        symbol: string;
        period: string;
        limit?: number;
    }): GenericAPIResponse;
    getLatestBigDeal(params: {
        symbol: string;
        limit?: number;
    }): GenericAPIResponse;
    getLongShortRatio(params: {
        symbol: string;
        period: string;
        limit?: number;
    }): GenericAPIResponse;
    /**
     *
     * Account Data Endpoints
     *
     */
    getApiKeyInfo(): GenericAPIResponse;
    /**
     *
     * Wallet Data Endpoints
     *
     */
    getWalletBalance(params: {
        coin?: string;
    }): GenericAPIResponse;
    getWalletFundRecords(params?: {
        start_date?: string;
        end_date?: string;
        currency?: string;
        coin?: string;
        wallet_fund_type?: string;
        page?: number;
        limit?: number;
    }): GenericAPIResponse;
    getWithdrawRecords(params: {
        start_date?: string;
        end_date?: string;
        coin?: string;
        status?: string;
        page?: number;
        limit?: number;
    }): GenericAPIResponse;
    getAssetExchangeRecords(params?: {
        limit?: number;
        from?: number;
        direction?: string;
    }): GenericAPIResponse;
    /**
     *
     * API Data Endpoints
     *
     */
    getServerTime(): GenericAPIResponse;
    getApiAnnouncements(): GenericAPIResponse;
    getTimeOffset(): Promise<number>;
}
