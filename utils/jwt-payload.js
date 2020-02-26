/**
 * @author ShinChven Zhang
 * 解jwt中的payload，并进行有效验证。
 * 用法：
 * let jwt = new JWTPayload(token);
 * if (jwt.isValid()){
 *   console.log(jwt.payload);
 * }
 */
class JWTPayload {

  constructor(encoded) {
    this.payload = this.decodePayload(encoded);
    if (this.isValid()){
      this.token = encoded; // 绑定有效token
    }
  }

  /**
   * 解token
   * token JSONWebToken
   * return payload object
   */
  decodePayload(token) {
    try {
      if (token && typeof(token) === 'string') {
        let split = token.split('.');
        if (split.length === 3) {
          let payloadEncoded = token.split('.')[1];
          let buffer = wx.base64ToArrayBuffer(payloadEncoded);
          let payloadDecoded = String.fromCharCode.apply(null, new Uint8Array(buffer));
          return JSON.parse(payloadDecoded)
        }
      }
      console.error(new Error('invalid token'));
    } catch (err) {
      console.error(err);
    }
    return null
  }

  /**
   * 验证是否有效
   * return boolean
   */
  isValid() {
    try {
      if (this.payload && this.payload.exp) {
        let timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        return this.payload.exp > timestamp;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  }
}

module.exports = JWTPayload