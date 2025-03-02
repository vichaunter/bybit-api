/// <reference types="node" />
import { EventEmitter } from 'events';
import WebSocket from 'isomorphic-ws';
import { DefaultLogger } from './logger';
import { KlineInterval } from './types/shared';
export declare enum WsConnectionState {
    READY_STATE_INITIAL = 0,
    READY_STATE_CONNECTING = 1,
    READY_STATE_CONNECTED = 2,
    READY_STATE_CLOSING = 3,
    READY_STATE_RECONNECTING = 4
}
export declare type APIMarket = 'inverse' | 'linear' | 'spot';
export declare type WsPublicInverseTopic = 'orderBookL2_25' | 'orderBookL2_200' | 'trade' | 'insurance' | 'instrument_info' | 'klineV2';
export declare type WsPublicUSDTPerpTopic = 'orderBookL2_25' | 'orderBookL2_200' | 'trade' | 'insurance' | 'instrument_info' | 'kline';
export declare type WsPublicSpotV1Topic = 'trade' | 'realtimes' | 'kline' | 'depth' | 'mergedDepth' | 'diffDepth';
export declare type WsPublicSpotV2Topic = 'depth' | 'kline' | 'trade' | 'bookTicker' | 'realtimes';
export declare type WsPublicTopics = WsPublicInverseTopic | WsPublicUSDTPerpTopic | WsPublicSpotV1Topic | WsPublicSpotV2Topic | string;
export declare type WsPrivateInverseTopic = 'position' | 'execution' | 'order' | 'stop_order';
export declare type WsPrivateUSDTPerpTopic = 'position' | 'execution' | 'order' | 'stop_order' | 'wallet';
export declare type WsPrivateSpotTopic = 'outboundAccountInfo' | 'executionReport' | 'ticketInfo';
export declare type WsPrivateTopic = WsPrivateInverseTopic | WsPrivateUSDTPerpTopic | WsPrivateSpotTopic | string;
export declare type WsTopic = WsPublicTopics | WsPrivateTopic;
export interface WSClientConfigurableOptions {
    key?: string;
    secret?: string;
    livenet?: boolean;
    /**
     * @deprecated Use the property { market: 'linear' } instead
     */
    linear?: boolean;
    market?: APIMarket;
    pongTimeout?: number;
    pingInterval?: number;
    reconnectTimeout?: number;
    restOptions?: any;
    requestOptions?: any;
    wsUrl?: string;
}
export interface WebsocketClientOptions extends WSClientConfigurableOptions {
    livenet: boolean;
    /**
     * @deprecated Use the property { market: 'linear' } instead
     */
    linear?: boolean;
    market?: APIMarket;
    pongTimeout: number;
    pingInterval: number;
    reconnectTimeout: number;
}
export declare const wsKeyInverse = "inverse";
export declare const wsKeyLinearPrivate = "linearPrivate";
export declare const wsKeyLinearPublic = "linearPublic";
export declare const wsKeySpotPrivate = "spotPrivate";
export declare const wsKeySpotPublic = "spotPublic";
export declare type WsKey = 'inverse' | 'linearPrivate' | 'linearPublic' | 'spotPrivate' | 'spotPublic';
export declare interface WebsocketClient {
    on(event: 'open' | 'reconnected', listener: ({ wsKey: WsKey, event: any }: {
        wsKey: any;
        event: any;
    }) => void): this;
    on(event: 'response' | 'update' | 'error', listener: (response: any) => void): this;
    on(event: 'reconnect' | 'close', listener: ({ wsKey: WsKey }: {
        wsKey: any;
    }) => void): this;
}
export declare class WebsocketClient extends EventEmitter {
    private logger;
    private restClient;
    private options;
    private wsStore;
    constructor(options: WSClientConfigurableOptions, logger?: typeof DefaultLogger);
    isLivenet(): boolean;
    isLinear(): boolean;
    isSpot(): boolean;
    isInverse(): boolean;
    /**
     * Add topic/topics to WS subscription list
     */
    subscribe(wsTopics: WsTopic[] | WsTopic): void;
    /**
     * Remove topic/topics from WS subscription list
     */
    unsubscribe(wsTopics: WsTopic[] | WsTopic): void;
    close(wsKey: WsKey): void;
    /**
     * Request connection of all dependent websockets, instead of waiting for automatic connection by library
     */
    connectAll(): Promise<WebSocket | undefined>[] | undefined;
    connectPublic(): Promise<WebSocket | undefined> | undefined;
    connectPrivate(): Promise<WebSocket | undefined> | undefined;
    private connect;
    private parseWsError;
    /**
     * Return params required to make authorized request
     */
    private getAuthParams;
    private reconnectWithDelay;
    private ping;
    private clearTimers;
    private clearPingTimer;
    private clearPongTimer;
    /**
     * Send WS message to subscribe to topics.
     */
    private requestSubscribeTopics;
    /**
     * Send WS message to unsubscribe from topics.
     */
    private requestUnsubscribeTopics;
    private tryWsSend;
    private connectToWsUrl;
    private onWsOpen;
    private onWsMessage;
    private onWsError;
    private onWsClose;
    private onWsMessageResponse;
    private onWsMessageUpdate;
    private getWs;
    private setWsState;
    private getWsUrl;
    private getWsKeyForTopic;
    private wrongMarketError;
    private authenticatePrivateSpot;
    subscribePublicSpotTrades(symbol: string, binary?: boolean): void;
    subscribePublicSpotTradingPair(symbol: string, binary?: boolean): void;
    subscribePublicSpotV1Kline(symbol: string, candleSize: KlineInterval, binary?: boolean): void;
    subscribePublicSpotOrderbook(symbol: string, depth: 'full' | 'merge' | 'delta', dumpScale?: number, binary?: boolean): void;
}
