/**
 * 路径
 */
const Url = "https://iad-dev.lkimt.com";

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


const SelectDoctorInfoKey = '0x000';

const AppointmentDoctorKey = '0x001';

const LoadingIcon ='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY1ODQwM0Q2M0U0NjExRTk5ODUwRDQ5OEY0Rjc5RTA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY1ODQwM0Q3M0U0NjExRTk5ODUwRDQ5OEY0Rjc5RTA3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjU4NDAzRDQzRTQ2MTFFOTk4NTBENDk4RjRGNzlFMDciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjU4NDAzRDUzRTQ2MTFFOTk4NTBENDk4RjRGNzlFMDciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5fTWFNAAADbElEQVR42uxaTW9MURg+d0aZtkqLzshUg1FaJSKxExZiIRa6mF0jsbGRxtrPsLS0EMGChdipRCJRSUV9VUJItWi12qLqY0I79T6Zd+Q67vm4M/fOncq8yZNmzj3nnufe837fOiJ4yRBOGOa8IFwudYNYCKQPW8zpJLRWC+mVhI0+TqQkWWE5r4WwgbBEeE/4piEd9/GAoZBeQzhG2O4aWyA8JtzwmI+H+U5osNj7Y6mkdW8FG/d5HDdUKk3oIAwpTiVt2Bcndp2wGDTpXkLScAoOYVQaHyPsJazSrL3GaqaStYQewgE22BF+UC1p6O8Ri4duI9wj5F1jeHtPCCnCOmn+PKvVsEHXccKbCE38N+Veo9LpdsuTquMHnPTQ7YuEzWwPUKkZfpgFwz2xZrU01kVIEHI60nkfKqabO8bwI/OKPRZNfvqN5QY5foNBCk5tUBqD0f4y6XSODSBp2OAW4W0IUfUlk8cL6efff8Qx6GsfuzAvecV6W3GJG3R1iA1gvUv/vxAGFMGlIuJYzkuwl4AxTPk01Jr8V1JnmfCIatDpVo71HZw3fOYIdqdaSSPUHlfMQWJz3u3cI5aWOMf5U5pJTRxkhiMm28CZ51GE8X0WC7o0QaZS8eRksUSLWSTsRUlHSDrDAS60ajwMqZdLpwnLhRMRkn4tk35gseg54VOEpJFjX3Ur+E/COGGPxuVdqoJ84wPhKdLVZRlclmUYr0lNyqxcULV0i0J7DB7kXdR5iIk0sr+sHJHY/VwRZTQRLQTdqWbCHGHWljRqwtOa6z8IZ0NKWbNS3MDJov+3ZKrGs+LfXpzsGnGT0YAJI/3cJY0hNW7nuKFMmEBoq8UGnQETTmnuuU0UGp5K0vXCrqOfCJh0m811FWl0PXMWm8xZGlTSkvSMzXVV1xRNGXSX9htuMqi5hpbtIcIW/j1NuEt4pFmDxuek8P7YBMIjJkOEge3W5CFIV28rru0QhW+Jza6xRi7bYnJ+7HHfjPi7Rw0Xe4EzUqOfRrbXI1kzXNx9wk2NEZ/hvyo5x0R00s11KbLNZ34jouD6rPhJDhXMV4NH6TXcD2rSX6q12n5HnJWjkkYa/dZ8fiWMwnbKYs50tZEeZ6gESdfDcpsgYQj+y2Cnhxrk2QuU9Z3GEeEJXshBTgccVpuBIKr63wIMAF4YoXI23txxAAAAAElFTkSuQmCC'


module.exports = {
  Url: Url,
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
  SelectDoctorInfoKey: SelectDoctorInfoKey,
  AppointmentDoctorKey: AppointmentDoctorKey,
}