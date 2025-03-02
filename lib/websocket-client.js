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
exports.WebsocketClient = exports.wsKeySpotPublic = exports.wsKeySpotPrivate = exports.wsKeyLinearPublic = exports.wsKeyLinearPrivate = exports.wsKeyInverse = exports.WsConnectionState = void 0;
const events_1 = require("events");
const isomorphic_ws_1 = __importDefault(require("isomorphic-ws"));
const inverse_client_1 = require("./inverse-client");
const linear_client_1 = require("./linear-client");
const logger_1 = require("./logger");
const node_support_1 = require("./util/node-support");
const requestUtils_1 = require("./util/requestUtils");
const WsStore_1 = __importDefault(require("./util/WsStore"));
const inverseEndpoints = {
    livenet: 'wss://stream.bybit.com/realtime',
    testnet: 'wss://stream-testnet.bybit.com/realtime'
};
const linearEndpoints = {
    private: {
        livenet: 'wss://stream.bybit.com/realtime_private',
        livenet2: 'wss://stream.bytick.com/realtime_private',
        testnet: 'wss://stream-testnet.bybit.com/realtime_private'
    },
    public: {
        livenet: 'wss://stream.bybit.com/realtime_public',
        livenet2: 'wss://stream.bytick.com/realtime_public',
        testnet: 'wss://stream-testnet.bybit.com/realtime_public'
    }
};
const spotEndpoints = {
    private: {
        livenet: 'wss://stream.bybit.com/spot/ws',
        testnet: 'wss://stream-testnet.bybit.com/spot/ws',
    },
    public: {
        livenet: 'wss://stream.bybit.com/spot/quote/ws/v1',
        livenet2: 'wss://stream.bybit.com/spot/quote/ws/v2',
        testnet: 'wss://stream-testnet.bybit.com/spot/quote/ws/v1',
        testnet2: 'wss://stream-testnet.bybit.com/spot/quote/ws/v2',
    }
};
const loggerCategory = { category: 'bybit-ws' };
const READY_STATE_INITIAL = 0;
const READY_STATE_CONNECTING = 1;
const READY_STATE_CONNECTED = 2;
const READY_STATE_CLOSING = 3;
const READY_STATE_RECONNECTING = 4;
var WsConnectionState;
(function (WsConnectionState) {
    WsConnectionState[WsConnectionState["READY_STATE_INITIAL"] = 0] = "READY_STATE_INITIAL";
    WsConnectionState[WsConnectionState["READY_STATE_CONNECTING"] = 1] = "READY_STATE_CONNECTING";
    WsConnectionState[WsConnectionState["READY_STATE_CONNECTED"] = 2] = "READY_STATE_CONNECTED";
    WsConnectionState[WsConnectionState["READY_STATE_CLOSING"] = 3] = "READY_STATE_CLOSING";
    WsConnectionState[WsConnectionState["READY_STATE_RECONNECTING"] = 4] = "READY_STATE_RECONNECTING";
})(WsConnectionState = exports.WsConnectionState || (exports.WsConnectionState = {}));
;
;
;
exports.wsKeyInverse = 'inverse';
exports.wsKeyLinearPrivate = 'linearPrivate';
exports.wsKeyLinearPublic = 'linearPublic';
exports.wsKeySpotPrivate = 'spotPrivate';
exports.wsKeySpotPublic = 'spotPublic';
const getLinearWsKeyForTopic = (topic) => {
    const privateLinearTopics = ['position', 'execution', 'order', 'stop_order', 'wallet'];
    if (privateLinearTopics.includes(topic)) {
        return exports.wsKeyLinearPrivate;
    }
    return exports.wsKeyLinearPublic;
};
const getSpotWsKeyForTopic = (topic) => {
    const privateLinearTopics = ['position', 'execution', 'order', 'stop_order', 'outboundAccountInfo', 'executionReport', 'ticketInfo'];
    if (privateLinearTopics.includes(topic)) {
        return exports.wsKeySpotPrivate;
    }
    return exports.wsKeySpotPublic;
};
function resolveMarket(options) {
    if (options.linear) {
        return 'linear';
    }
    return 'inverse';
}
class WebsocketClient extends events_1.EventEmitter {
    constructor(options, logger) {
        super();
        this.logger = logger || logger_1.DefaultLogger;
        this.wsStore = new WsStore_1.default(this.logger);
        this.options = Object.assign({ livenet: false, pongTimeout: 1000, pingInterval: 10000, reconnectTimeout: 500 }, options);
        if (!this.options.market) {
            this.options.market = resolveMarket(this.options);
        }
        if (this.isLinear()) {
            this.restClient = new linear_client_1.LinearClient(undefined, undefined, this.isLivenet(), this.options.restOptions, this.options.requestOptions);
        }
        else if (this.isSpot()) {
            // TODO: spot client
            this.restClient = new linear_client_1.LinearClient(undefined, undefined, this.isLivenet(), this.options.restOptions, this.options.requestOptions);
        }
        else {
            this.restClient = new inverse_client_1.InverseClient(undefined, undefined, this.isLivenet(), this.options.restOptions, this.options.requestOptions);
        }
    }
    isLivenet() {
        return this.options.livenet === true;
    }
    isLinear() {
        return this.options.market === 'linear';
    }
    isSpot() {
        return this.options.market === 'spot';
    }
    isInverse() {
        return !this.isLinear() && !this.isSpot();
    }
    /**
     * Add topic/topics to WS subscription list
     */
    subscribe(wsTopics) {
        const topics = Array.isArray(wsTopics) ? wsTopics : [wsTopics];
        topics.forEach(topic => this.wsStore.addTopic(this.getWsKeyForTopic(topic), topic));
        // attempt to send subscription topic per websocket
        this.wsStore.getKeys().forEach((wsKey) => {
            // if connected, send subscription request
            if (this.wsStore.isConnectionState(wsKey, READY_STATE_CONNECTED)) {
                return this.requestSubscribeTopics(wsKey, topics);
            }
            // start connection process if it hasn't yet begun. Topics are automatically subscribed to on-connect
            if (!this.wsStore.isConnectionState(wsKey, READY_STATE_CONNECTING) &&
                !this.wsStore.isConnectionState(wsKey, READY_STATE_RECONNECTING)) {
                return this.connect(wsKey);
            }
        });
    }
    /**
     * Remove topic/topics from WS subscription list
     */
    unsubscribe(wsTopics) {
        const topics = Array.isArray(wsTopics) ? wsTopics : [wsTopics];
        topics.forEach(topic => this.wsStore.deleteTopic(this.getWsKeyForTopic(topic), topic));
        this.wsStore.getKeys().forEach((wsKey) => {
            // unsubscribe request only necessary if active connection exists
            if (this.wsStore.isConnectionState(wsKey, READY_STATE_CONNECTED)) {
                this.requestUnsubscribeTopics(wsKey, topics);
            }
        });
    }
    close(wsKey) {
        var _a;
        this.logger.info('Closing connection', Object.assign(Object.assign({}, loggerCategory), { wsKey }));
        this.setWsState(wsKey, READY_STATE_CLOSING);
        this.clearTimers(wsKey);
        (_a = this.getWs(wsKey)) === null || _a === void 0 ? void 0 : _a.close();
    }
    /**
     * Request connection of all dependent websockets, instead of waiting for automatic connection by library
     */
    connectAll() {
        if (this.isInverse()) {
            return [this.connect(exports.wsKeyInverse)];
        }
        if (this.isLinear()) {
            return [this.connect(exports.wsKeyLinearPublic), this.connect(exports.wsKeyLinearPrivate)];
        }
        if (this.isSpot()) {
            return [this.connect(exports.wsKeySpotPublic), this.connect(exports.wsKeySpotPrivate)];
        }
    }
    connectPublic() {
        if (this.isInverse()) {
            return this.connect(exports.wsKeyInverse);
        }
        if (this.isLinear()) {
            return this.connect(exports.wsKeyLinearPublic);
        }
        if (this.isSpot()) {
            return this.connect(exports.wsKeySpotPublic);
        }
    }
    connectPrivate() {
        if (this.isInverse()) {
            return this.connect(exports.wsKeyInverse);
        }
        if (this.isLinear()) {
            return this.connect(exports.wsKeyLinearPrivate);
        }
        if (this.isSpot()) {
            return this.connect(exports.wsKeySpotPrivate);
        }
    }
    connect(wsKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.wsStore.isWsOpen(wsKey)) {
                    this.logger.error('Refused to connect to ws with existing active connection', Object.assign(Object.assign({}, loggerCategory), { wsKey }));
                    return this.wsStore.getWs(wsKey);
                }
                if (this.wsStore.isConnectionState(wsKey, READY_STATE_CONNECTING)) {
                    this.logger.error('Refused to connect to ws, connection attempt already active', Object.assign(Object.assign({}, loggerCategory), { wsKey }));
                    return;
                }
                if (!this.wsStore.getConnectionState(wsKey) ||
                    this.wsStore.isConnectionState(wsKey, READY_STATE_INITIAL)) {
                    this.setWsState(wsKey, READY_STATE_CONNECTING);
                }
                const authParams = yield this.getAuthParams(wsKey);
                const url = this.getWsUrl(wsKey) + authParams;
                const ws = this.connectToWsUrl(url, wsKey);
                return this.wsStore.setWs(wsKey, ws);
            }
            catch (err) {
                this.parseWsError('Connection failed', err, wsKey);
                this.reconnectWithDelay(wsKey, this.options.reconnectTimeout);
            }
        });
    }
    parseWsError(context, error, wsKey) {
        if (!error.message) {
            this.logger.error(`${context} due to unexpected error: `, error);
            return;
        }
        switch (error.message) {
            case 'Unexpected server response: 401':
                this.logger.error(`${context} due to 401 authorization failure.`, Object.assign(Object.assign({}, loggerCategory), { wsKey }));
                break;
            default:
                this.logger.error(`{context} due to unexpected response error: ${error.msg}`, Object.assign(Object.assign({}, loggerCategory), { wsKey }));
                break;
        }
    }
    /**
     * Return params required to make authorized request
     */
    getAuthParams(wsKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, secret } = this.options;
            if (key && secret && wsKey !== exports.wsKeyLinearPublic && wsKey !== exports.wsKeySpotPublic) {
                this.logger.debug('Getting auth\'d request params', Object.assign(Object.assign({}, loggerCategory), { wsKey }));
                const timeOffset = yield this.restClient.getTimeOffset();
                const expires = Date.now() + timeOffset + 5000;
                const signature = yield (0, node_support_1.signMessage)('GET/realtime' + expires, secret);
                const params = {
                    api_key: this.options.key,
                    expires: expires,
                    signature: signature
                };
                return '?' + (0, requestUtils_1.serializeParams)(params);
            }
            else if (!key || !secret) {
                this.logger.warning('Connot authenticate websocket, either api or private keys missing.', Object.assign(Object.assign({}, loggerCategory), { wsKey }));
            }
            else {
                this.logger.debug('Starting public only websocket client.', Object.assign(Object.assign({}, loggerCategory), { wsKey }));
            }
            return '';
        });
    }
    reconnectWithDelay(wsKey, connectionDelayMs) {
        this.clearTimers(wsKey);
        if (this.wsStore.getConnectionState(wsKey) !== READY_STATE_CONNECTING) {
            this.setWsState(wsKey, READY_STATE_RECONNECTING);
        }
        setTimeout(() => {
            this.logger.info('Reconnecting to websocket', Object.assign(Object.assign({}, loggerCategory), { wsKey }));
            this.connect(wsKey);
        }, connectionDelayMs);
    }
    ping(wsKey) {
        this.clearPongTimer(wsKey);
        this.logger.silly('Sending ping', Object.assign(Object.assign({}, loggerCategory), { wsKey }));
        this.tryWsSend(wsKey, JSON.stringify({ op: 'ping' }));
        this.wsStore.get(wsKey, true).activePongTimer = setTimeout(() => {
            var _a;
            this.logger.info('Pong timeout - closing socket to reconnect', Object.assign(Object.assign({}, loggerCategory), { wsKey }));
            (_a = this.getWs(wsKey)) === null || _a === void 0 ? void 0 : _a.close();
        }, this.options.pongTimeout);
    }
    clearTimers(wsKey) {
        this.clearPingTimer(wsKey);
        this.clearPongTimer(wsKey);
    }
    // Send a ping at intervals
    clearPingTimer(wsKey) {
        const wsState = this.wsStore.get(wsKey);
        if (wsState === null || wsState === void 0 ? void 0 : wsState.activePingTimer) {
            clearInterval(wsState.activePingTimer);
            wsState.activePingTimer = undefined;
        }
    }
    // Expect a pong within a time limit
    clearPongTimer(wsKey) {
        const wsState = this.wsStore.get(wsKey);
        if (wsState === null || wsState === void 0 ? void 0 : wsState.activePongTimer) {
            clearTimeout(wsState.activePongTimer);
            wsState.activePongTimer = undefined;
        }
    }
    /**
     * Send WS message to subscribe to topics.
     */
    requestSubscribeTopics(wsKey, topics) {
        if (!topics.length) {
            return;
        }
        const wsMessage = JSON.stringify({
            op: 'subscribe',
            args: topics
        });
        this.tryWsSend(wsKey, wsMessage);
    }
    /**
     * Send WS message to unsubscribe from topics.
     */
    requestUnsubscribeTopics(wsKey, topics) {
        if (!topics.length) {
            return;
        }
        const wsMessage = JSON.stringify({
            op: 'unsubscribe',
            args: topics
        });
        this.tryWsSend(wsKey, wsMessage);
    }
    tryWsSend(wsKey, wsMessage) {
        try {
            this.logger.silly(`Sending upstream ws message: `, Object.assign(Object.assign({}, loggerCategory), { wsMessage, wsKey }));
            if (!wsKey) {
                throw new Error('Cannot send message due to no known websocket for this wsKey');
            }
            const ws = this.getWs(wsKey);
            if (!ws) {
                throw new Error(`${wsKey} socket not connected yet, call "connect(${wsKey}) first then try again when the "open" event arrives`);
            }
            ws.send(wsMessage);
        }
        catch (e) {
            this.logger.error(`Failed to send WS message`, Object.assign(Object.assign({}, loggerCategory), { wsMessage, wsKey, exception: e }));
        }
    }
    connectToWsUrl(url, wsKey) {
        var _a;
        this.logger.silly(`Opening WS connection to URL: ${url}`, Object.assign(Object.assign({}, loggerCategory), { wsKey }));
        const agent = (_a = this.options.requestOptions) === null || _a === void 0 ? void 0 : _a.agent;
        const ws = new isomorphic_ws_1.default(url, undefined, agent ? { agent } : undefined);
        ws.onopen = event => this.onWsOpen(event, wsKey);
        ws.onmessage = event => this.onWsMessage(event, wsKey);
        ws.onerror = event => this.onWsError(event, wsKey);
        ws.onclose = event => this.onWsClose(event, wsKey);
        return ws;
    }
    onWsOpen(event, wsKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.wsStore.isConnectionState(wsKey, READY_STATE_CONNECTING)) {
                this.logger.info('Websocket connected', Object.assign(Object.assign({}, loggerCategory), { wsKey, livenet: this.isLivenet(), linear: this.isLinear(), spot: this.isSpot() }));
                this.emit('open', { wsKey, event });
            }
            else if (this.wsStore.isConnectionState(wsKey, READY_STATE_RECONNECTING)) {
                this.logger.info('Websocket reconnected', Object.assign(Object.assign({}, loggerCategory), { wsKey }));
                this.emit('reconnected', { wsKey, event });
            }
            this.setWsState(wsKey, READY_STATE_CONNECTED);
            // TODO: persistence not working yet for spot topics
            if (wsKey !== 'spotPublic' && wsKey !== 'spotPrivate') {
                this.requestSubscribeTopics(wsKey, [...this.wsStore.getTopics(wsKey)]);
            }
            if (wsKey === 'spotPrivate') {
                yield this.authenticatePrivateSpot();
            }
            this.wsStore.get(wsKey, true).activePingTimer = setInterval(() => this.ping(wsKey), this.options.pingInterval);
        });
    }
    onWsMessage(event, wsKey) {
        try {
            const msg = JSON.parse(event && event.data || event);
            if ('success' in msg || (msg === null || msg === void 0 ? void 0 : msg.pong) || (msg === null || msg === void 0 ? void 0 : msg.ping)) {
                this.onWsMessageResponse(msg, wsKey);
            }
            else if (msg === null || msg === void 0 ? void 0 : msg.auth) {
                if ((msg === null || msg === void 0 ? void 0 : msg.auth) === 'success') {
                    this.logger.info('Authenticated', Object.assign(Object.assign({}, loggerCategory), { wsKey }));
                }
                else {
                    this.logger.warning('Fail to authenticated', Object.assign(Object.assign({}, loggerCategory), { message: msg, event, wsKey }));
                }
            }
            else if (msg.topic) {
                this.onWsMessageUpdate(msg);
            }
            else if (Array.isArray(msg)) {
                for (const item of msg) {
                    if (['outboundAccountInfo', 'executionReport', 'ticketInfo'].includes(item.e)) {
                        this.onWsMessageUpdate(msg);
                    }
                }
            }
            else {
                this.logger.warning('Got unhandled ws message', Object.assign(Object.assign({}, loggerCategory), { message: msg, event, wsKey }));
            }
        }
        catch (e) {
            this.logger.error('Failed to parse ws event message', Object.assign(Object.assign({}, loggerCategory), { error: e, event, wsKey }));
        }
    }
    onWsError(error, wsKey) {
        this.parseWsError('Websocket error', error, wsKey);
        if (this.wsStore.isConnectionState(wsKey, READY_STATE_CONNECTED)) {
            this.emit('error', error);
        }
    }
    onWsClose(event, wsKey) {
        this.logger.info('Websocket connection closed', Object.assign(Object.assign({}, loggerCategory), { wsKey }));
        if (this.wsStore.getConnectionState(wsKey) !== READY_STATE_CLOSING) {
            this.reconnectWithDelay(wsKey, this.options.reconnectTimeout);
            this.emit('reconnect', { wsKey });
        }
        else {
            this.setWsState(wsKey, READY_STATE_INITIAL);
            this.emit('close', { wsKey });
        }
    }
    onWsMessageResponse(response, wsKey) {
        if ((0, requestUtils_1.isWsPong)(response)) {
            this.logger.silly('Received pong', Object.assign(Object.assign({}, loggerCategory), { wsKey }));
            this.clearPongTimer(wsKey);
        }
        else {
            this.emit('response', response);
        }
    }
    onWsMessageUpdate(message) {
        this.emit('update', message);
    }
    getWs(wsKey) {
        return this.wsStore.getWs(wsKey);
    }
    setWsState(wsKey, state) {
        this.wsStore.setConnectionState(wsKey, state);
    }
    getWsUrl(wsKey) {
        if (this.options.wsUrl) {
            return this.options.wsUrl;
        }
        const networkKey = this.isLivenet() ? 'livenet' : 'testnet';
        // TODO: reptitive
        if (this.isLinear() || wsKey.startsWith('linear')) {
            if (wsKey === exports.wsKeyLinearPublic) {
                return linearEndpoints.public[networkKey];
            }
            if (wsKey === exports.wsKeyLinearPrivate) {
                return linearEndpoints.private[networkKey];
            }
            this.logger.error('Unhandled linear wsKey: ', Object.assign(Object.assign({}, loggerCategory), { wsKey }));
            return linearEndpoints[networkKey];
        }
        if (this.isSpot() || wsKey.startsWith('spot')) {
            if (wsKey === exports.wsKeySpotPublic) {
                return spotEndpoints.public[networkKey];
            }
            if (wsKey === exports.wsKeySpotPrivate) {
                return spotEndpoints.private[networkKey];
            }
            this.logger.error('Unhandled spot wsKey: ', Object.assign(Object.assign({}, loggerCategory), { wsKey }));
            return spotEndpoints[networkKey];
        }
        // fallback to inverse
        return inverseEndpoints[networkKey];
    }
    getWsKeyForTopic(topic) {
        if (this.isInverse()) {
            return exports.wsKeyInverse;
        }
        if (this.isLinear()) {
            return getLinearWsKeyForTopic(topic);
        }
        return getSpotWsKeyForTopic(topic);
    }
    wrongMarketError(market) {
        return new Error(`This WS client was instanced for the ${this.options.market} market. Make another WebsocketClient instance with "market: '${market}' to listen to spot topics`);
    }
    authenticatePrivateSpot() {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, secret } = this.options;
            if (key && secret) {
                const timeOffset = yield this.restClient.getTimeOffset();
                const expires = Date.now() + timeOffset + 5000;
                const signature = yield (0, node_support_1.signMessage)('GET/realtime' + expires, secret);
                this.tryWsSend(exports.wsKeySpotPrivate, JSON.stringify({
                    op: 'auth',
                    args: [key, expires, signature]
                }));
            }
        });
    }
    // TODO: persistance for subbed topics. Look at ftx-api implementation.
    subscribePublicSpotTrades(symbol, binary) {
        if (!this.isSpot()) {
            throw this.wrongMarketError('spot');
        }
        return this.tryWsSend(exports.wsKeySpotPublic, JSON.stringify({
            topic: 'trade',
            event: 'sub',
            symbol,
            params: {
                binary: !!binary,
            }
        }));
    }
    subscribePublicSpotTradingPair(symbol, binary) {
        if (!this.isSpot()) {
            throw this.wrongMarketError('spot');
        }
        return this.tryWsSend(exports.wsKeySpotPublic, JSON.stringify({
            symbol,
            topic: 'realtimes',
            event: 'sub',
            params: {
                binary: !!binary,
            },
        }));
    }
    subscribePublicSpotV1Kline(symbol, candleSize, binary) {
        if (!this.isSpot()) {
            throw this.wrongMarketError('spot');
        }
        return this.tryWsSend(exports.wsKeySpotPublic, JSON.stringify({
            symbol,
            topic: 'kline_' + candleSize,
            event: 'sub',
            params: {
                binary: !!binary,
            },
        }));
    }
    //ws.send('{"symbol":"BTCUSDT","topic":"depth","event":"sub","params":{"binary":false}}');
    //ws.send('{"symbol":"BTCUSDT","topic":"mergedDepth","event":"sub","params":{"binary":false,"dumpScale":1}}');
    //ws.send('{"symbol":"BTCUSDT","topic":"diffDepth","event":"sub","params":{"binary":false}}');
    subscribePublicSpotOrderbook(symbol, depth, dumpScale, binary) {
        if (!this.isSpot()) {
            throw this.wrongMarketError('spot');
        }
        let topic;
        switch (depth) {
            case 'full':
                {
                    topic = 'depth';
                    break;
                }
                ;
            case 'merge': {
                topic = 'mergedDepth';
                if (!dumpScale) {
                    throw new Error(`Dumpscale must be provided for merged orderbooks`);
                }
                break;
            }
            case 'delta': {
                topic = 'diffDepth';
                break;
            }
        }
        const msg = {
            symbol,
            topic,
            event: 'sub',
            params: {
                binary: !!binary,
            },
        };
        if (dumpScale) {
            msg.params.dumpScale = dumpScale;
        }
        return this.tryWsSend(exports.wsKeySpotPublic, JSON.stringify(msg));
    }
}
exports.WebsocketClient = WebsocketClient;
;
//# sourceMappingURL=websocket-client.js.map