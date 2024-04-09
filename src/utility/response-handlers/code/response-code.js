const HttpStatusCodes = {
    statusContinue: 100, // RFC 9110, 15.2.1
    statusSwitchingProtocols: 101, // RFC 9110, 15.2.2
    statusProcessing: 102, // RFC 2518, 10.1
    statusEarlyHints: 103, // RFC 8297
    statusOK: 200, // RFC 9110, 15.3.1
    statusCreated: 201, // RFC 9110, 15.3.2
    statusAccepted: 202, // RFC 9110, 15.3.3
    statusNonAuthoritativeInfo: 203, // RFC 9110, 15.3.4
    statusNoContent: 204, // RFC 9110, 15.3.5
    statusResetContent: 205, // RFC 9110, 15.3.6
    statusPartialContent: 206, // RFC 9110, 15.3.7
    statusMultiStatus: 207, // RFC 4918, 11.1
    statusAlreadyReported: 208, // RFC 5842, 7.1
    statusIMUsed: 226, // RFC 3229, 10.4.1
    statusMultipleChoices: 300, // RFC 9110, 15.4.1
    statusMovedPermanently: 301, // RFC 9110, 15.4.2
    statusFound: 302, // RFC 9110, 15.4.3
    statusSeeOther: 303, // RFC 9110, 15.4.4
    statusNotModified: 304, // RFC 9110, 15.4.5
    statusUseProxy: 305, // RFC 9110, 15.4.6
    _: 306, // RFC 9110, 15.4.7 (Unused)
    statusTemporaryRedirect: 307, // RFC 9110, 15.4.8
    statusPermanentRedirect: 308, // RFC 9110, 15.4.9
    statusBadRequest: 400, // RFC 9110, 15.5.1
    statusUnauthorized: 401, // RFC 9110, 15.5.2
    statusPaymentRequired: 402, // RFC 9110, 15.5.3
    statusForbidden: 403, // RFC 9110, 15.5.4
    statusNotFound: 404, // RFC 9110, 15.5.5
    statusMethodNotAllowed: 405, // RFC 9110, 15.5.6
    statusNotAcceptable: 406, // RFC 9110, 15.5.7
    statusProxyAuthRequired: 407, // RFC 9110, 15.5.8
    statusRequestTimeout: 408, // RFC 9110, 15.5.9
    statusConflict: 409, // RFC 9110, 15.5.10
    statusGone: 410, // RFC 9110, 15.5.11
    statusLengthRequired: 411, // RFC 9110, 15.5.12
    statusPreconditionFailed: 412, // RFC 9110, 15.5.13
    statusRequestEntityTooLarge: 413, // RFC 9110, 15.5.14
    statusRequestURITooLong: 414, // RFC 9110, 15.5.15
    statusUnsupportedMediaType: 415, // RFC 9110, 15.5.16
    statusRequestedRangeNotSatisfiable: 416, // RFC 9110, 15.5.17
    statusExpectationFailed: 417, // RFC 9110, 15.5.18
    statusTeapot: 418, // RFC 9110, 15.5.19 (Unused)
    statusMisdirectedRequest: 421, // RFC 9110, 15.5.20
    statusUnprocessableEntity: 422, // RFC 9110, 15.5.21
    statusLocked: 423, // RFC 4918, 11.3
    statusFailedDependency: 424, // RFC 4918, 11.4
    statusTooEarly: 425, // RFC 8470, 5.2.
    statusUpgradeRequired: 426, // RFC 9110, 15.5.22
    statusPreconditionRequired: 428, // RFC 6585, 3
    statusTooManyRequests: 429, // RFC 6585, 4
    statusRequestHeaderFieldsTooLarge: 431, // RFC 6585, 5
    statusUnavailableForLegalReasons: 451, // RFC 7725, 3
    statusInternalServerError: 500, // RFC 9110, 15.6.1
    statusNotImplemented: 501, // RFC 9110, 15.6.2
    statusBadGateway: 502, // RFC 9110, 15.6.3
    statusServiceUnavailable: 503, // RFC 9110, 15.6.4
    statusGatewayTimeout: 504, // RFC 9110, 15.6.5
    statusHTTPVersionNotSupported: 505, // RFC 9110, 15.6.6
    statusVariantAlsoNegotiates: 506, // RFC 2295, 8.1
    statusInsufficientStorage: 507, // RFC 4918, 11.5
    statusLoopDetected: 508, // RFC 5842, 7.2
    statusNotExtended: 510, // RFC 2774, 7
    statusNetworkAuthenticationRequired: 511, // RFC 6585, 6
};

module.exports = { HttpStatusCodes };
