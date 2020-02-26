
/**
 * 路径
 */
// const Url = "https://iad-dev.lkimt.com";

/**
 * 服务器已成功处理了请求
 */
const Success = 200;
/**
 * 身份验证错误
 */
const AuthenticationError = 401;
/**
 * 服务器拒绝请求
 */
const ServerRfusedToRequest = 403;
/**
 * 未找到
 */
const NotFound = 404;
/**
 * 请求超时
 */
const RequestTimeout = 408;
/**
 * 需要有效长度
 */
const LengthRequired = 411;
/**
 * 服务器内部错误
 */
const InternalServerError = 500;
/**
 * 错误网关
 */
const BadGateway = 502;
/**
 * 服务不可用
 */
const ServiceNotAvailable = 503;
/**
 * 网关超时
 */
const GatewayTimeout = 504;
/**
 * HTTP 版本不受支持
 */
const HTTPVersionIsNotSupported = 505;



module.exports = {
  // Url: Url,
  Success: Success,
  AuthenticationError: AuthenticationError,
  ServerRfusedToRequest: ServerRfusedToRequest,
  NotFound: NotFound,
  RequestTimeout: RequestTimeout,
  LengthRequired: LengthRequired,
  InternalServerError: InternalServerError,
  BadGateway: BadGateway,
  ServiceNotAvailable: ServiceNotAvailable,
  GatewayTimeout: GatewayTimeout,
  HTTPVersionIsNotSupported: HTTPVersionIsNotSupported,
}