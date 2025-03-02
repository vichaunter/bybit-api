"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWsPong = exports.isPublicEndpoint = exports.getRestBaseUrl = exports.serializeParams = void 0;
function serializeParams(params = {}, strict_validation = false) {
    return Object.keys(params)
        .sort()
        .map(key => {
        const value = params[key];
        if (strict_validation === true && typeof value === 'undefined') {
            throw new Error('Failed to sign API request due to undefined parameter');
        }
        return `${key}=${value}`;
    })
        .join('&');
}
exports.serializeParams = serializeParams;
;
function getRestBaseUrl(useLivenet, restInverseOptions) {
    const baseUrlsInverse = {
        livenet: 'https://api.bybit.com',
        testnet: 'https://api-testnet.bybit.com'
    };
    if (restInverseOptions.baseUrl) {
        return restInverseOptions.baseUrl;
    }
    if (useLivenet === true) {
        return baseUrlsInverse.livenet;
    }
    return baseUrlsInverse.testnet;
}
exports.getRestBaseUrl = getRestBaseUrl;
function isPublicEndpoint(endpoint) {
    if (endpoint.startsWith('v2/public')) {
        return true;
    }
    if (endpoint.startsWith('public/linear')) {
        return true;
    }
    return false;
}
exports.isPublicEndpoint = isPublicEndpoint;
function isWsPong(response) {
    if (response.pong || response.ping) {
        return true;
    }
    return (response.request &&
        response.request.op === 'ping' &&
        response.ret_msg === 'pong' &&
        response.success === true);
}
exports.isWsPong = isWsPong;
//# sourceMappingURL=requestUtils.js.map