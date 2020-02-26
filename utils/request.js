// import { query } from 'qs' // 测试
import help from './help.js';
import enumVal from './enum.js';
// import authenticationHelp from './authentication.js';

const app = getApp();

/**
 * 处理路径
 */
const makeUrl = (service, params, id) => {
  params = params || {};
  let url = getApp().globalData.domain + service;

  if (typeof id !== 'undefined' && id !== null) {
    url += `/${encodeURIComponent(id)}`;
  }
  //  console.log('16',params);
  // 处理参数
  if (Object.keys(params).length !== 0) {
    // 返回的路径参数
    let queryString;
    Object.keys(params).map(data => {
      if (Object.keys(params[data]).length !== 0) {
        // 条件内的对象值
        const whereData = params[data];
        if (data === "$or") { // $or
          if (Object.keys(whereData).length !== 0) {
            Object.keys(whereData).map(orData => {
              let paramUrl = data + "[" + orData + "]";
              if (Object.keys(whereData[orData]).length !== 0) {
                Object.keys(whereData[orData]).map(valData => {
                  const val = makeWhere(valData, whereData[orData][valData], false);
                  if (queryString) {
                    queryString += "&" + paramUrl + val;
                  } else {
                    queryString = paramUrl + val;
                  }
                })
              }
            })
          }
        } else { // $sort $select $in, $nin $lt, $lte,$gt, $gte,$ne
          const val = makeWhere(data, whereData, true);
          if (queryString) {
            queryString += "&" + val;
          } else {
            queryString = val;
          }
        }
      } else if (queryString) {
        queryString += "&" + data + "=" + params[data];
      } else {
        queryString = data + "=" + params[data];
      }
    })
    url += `?${queryString}`;
  }
  return url;
}

/**
 * 处理条件
 */
const makeWhere = (data, whereData, isShow) => {
  let queryString;
  if (data === "$sort") { // $sort
    if (Object.keys(whereData).length !== 0) {
      Object.keys(whereData).map(sortData => {
        if (queryString) {
          queryString += isShow ? "&" : "";
          if (isShow) {
            queryString += data + "[" + sortData + "]" + "=" + whereData[sortData];
          } else {
            queryString += "[" + data + "][" + sortData + "]" + "=" + whereData[sortData];
          }
        } else {
          if (isShow) {
            queryString = data + "[" + sortData + "]" + "=" + whereData[sortData];
          } else {
            queryString = "[" + data + "][" + sortData + "]" + "=" + whereData[sortData];
          }
        }
      })
    }
  } else if (data === "$select") { // $select
    if (Object.keys(whereData).length !== 0) {
      Object.keys(whereData).map(selectData => {
        if (queryString) {
          queryString += isShow ? "&" : "";
          if (isShow) {
            queryString += data + "[]" + "=" + whereData[selectData];
          } else {
            queryString += "[" + data + "[]" + "=" + whereData[selectData];
          }
        } else {
          if (isShow) {
            queryString = data + "[]" + "=" + whereData[selectData];
          } else {
            queryString = "[" + data + "[]" + "=" + whereData[selectData];
          }
        }
      })
    }
  } else {
    if (Object.keys(whereData).length !== 0) {
      let flag = false; // 用作类型区分
      Object.keys(whereData).map(inWhereData => {
        if (inWhereData === "$in" || inWhereData === "$nin") { // $in, $nin
          if (Object.keys(whereData[inWhereData]).length !== 0) {
            const inOrninVal = whereData[inWhereData]
            Object.keys(inOrninVal).map(inOrninData => {
              if (queryString) {
                queryString += isShow ? "&" : "";
                if (isShow) {
                  queryString += data + "[" + inWhereData + "]" + "=" + whereData[inWhereData][inOrninData];
                } else {
                  queryString += "[" + data + "][" + inWhereData + "]" + "=" + whereData[inWhereData][inOrninData];
                }
              } else {
                if (isShow) {
                  queryString = data + "[" + inWhereData + "]" + "=" + whereData[inWhereData][inOrninData];
                } else {
                  queryString = "[" + data + "][" + inWhereData + "]" + "=" + whereData[inWhereData][inOrninData];
                }
              }
            })
          }
          flag = true;
        } else if (inWhereData === "$lt" || inWhereData === "$lte" || inWhereData === "$gt" || inWhereData === "$gte" || inWhereData === "$ne") {
          // $lt, $lte,$gt, $gte,$ne
          if (queryString) {
            queryString += isShow ? "&" : "";
            if (isShow) {
              queryString += data + "[" + inWhereData + "]" + "=" + whereData[inWhereData];
            } else {
              queryString += "[" + data + "][" + inWhereData + "]" + "=" + whereData[inWhereData];
            }
          } else {
            if (isShow) {
              queryString = data + "[" + inWhereData + "]" + "=" + whereData[inWhereData];
            } else {
              queryString = "[" + data + "][" + inWhereData + "]" + "=" + whereData[inWhereData];
            }
          }
          flag = true;
        }
      })
      // 排除以上的可能最后一种单个字段查询
      if (!flag) {
        if (queryString) {
          queryString += isShow ? "&" : "";
          if (isShow) {
            queryString += data + "=" + whereData;
          } else {
            queryString += "[" + data + "]=" + whereData;
          }
        } else {
          if (isShow) {
            queryString = data + "=" + whereData;
          } else {
            queryString = "[" + data + "]=" + whereData;
          }
        }
      }
    }
  }
  return queryString;
}

/**
 * 登陆
 */
// const login = (param) => {
//   return new Promise(function(resolve, reject) {
//     const result = {
//       data: {}
//     };
//     authenticationHelp.authentication(param).then(data => {
//       if (data) {
//         console.log(data);
//         result.code = enumVal.Success;
//         result.msg = "登陆成功";
//         resolve(result);
//       }
//     }).catch(err => {
//       console.error(err);
//       result.code = enumVal.AuthenticationError;
//       result.msg = "未授权，登陆失败";
//       reject(result);
//     });
//   });
// }

/**
 * get 请求(根据ID查询)
 */
const httpGet = (service, id, params = {}) => {
  return new Promise(function(resolve, reject) {
    const result = {
      data: {}
    };
    if (!service) {
      result.code = enumVal.LengthRequired;
      result.msg = "参数 service 异常";
      return reject(result);
    }
    // 参数异常
    if (typeof id === 'undefined') {
      result.code = enumVal.LengthRequired;
      result.msg = "参数 ID 异常";
      return reject(result);
    }
    let jwt = app.globalData.jwt;
    if (jwt && jwt.isValid(jwt.token)) {
      let token = jwt.token;
      wx.request({
        url: makeUrl(service, params, id),
        data: {
          "id": id
        },
        method: 'GET',
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": token
        },
        success: function(res) {
          result.code = enumVal.Success;
          result.msg = "查询成功";
          result.data = res.data;
          resolve(result);
        },
        fail: function(e) {
          result.code = enumVal.InternalServerError;
          result.msg = "查询失败";
          result.data = {};
          resolve(result);
        },
      })
    } else {
      result.code = enumVal.AuthenticationError;
      result.msg = "Token失效,重新登陆";
      app.globalData.logout();
      return reject(new Error(JSON.stringify(result)));
    }
  })
}
/**
 * get 请求(根据ID查询)
 */
const httpOpenGet = (service, id, params = {}) => {
  return new Promise(function (resolve, reject) {
    const result = {
      data: {}
    };
    if (!service) {
      result.code = enumVal.LengthRequired;
      result.msg = "参数 service 异常";
      return reject(result);
    }
    // 参数异常
    if (typeof id === 'undefined') {
      result.code = enumVal.LengthRequired;
      result.msg = "参数 ID 异常";
      return reject(result);
    }
    wx.request({
      url: makeUrl(service, params, id),
      data: {
        "id": id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
      },
      success: function (res) {
        result.code = enumVal.Success;
        result.msg = "查询成功";
        result.data = res.data;
        resolve(result);
      },
      fail: function (e) {
        result.code = enumVal.InternalServerError;
        result.msg = "查询失败";
        result.data = {};
        resolve(result);
      },
    })
  })
}
/**
 * find 请求（带条件查询）
 */
const httpFind = (service, params = {}) => {
  return new Promise(function(resolve, reject) {
      const result = {
        data: {}
      };
      if (!service) {
        result.code = enumVal.LengthRequired;
        result.msg = "参数 service 异常";
        return reject(result);
      }
      // 参数异常
      if (!params && Object.keys(params).length === 0) {
        result.code = enumVal.LengthRequired;
        result.msg = "参数 params 异常";
        return reject(result);
      }
      const url = makeUrl(service, params);
      // console.log(url);
    let jwt = app.globalData.jwt;
    if (jwt && jwt.isValid(jwt.token)) {
      let token = jwt.token;
        wx.request({
          url: url,
          method: 'GET',
          header: {
            'content-type': 'application/json', // 默认值
            "Authorization": token
          },
          success: function(res) {
            result.code = enumVal.Success;
            result.msg = "查询成功";
            result.data = res.data;
            resolve(result);
          },
          fail: function(e) {
            result.code = enumVal.InternalServerError;
            result.msg = "查询失败";
            result.data = {};
            resolve(result);
          },
        })
      } else {
        result.code = enumVal.AuthenticationError;
        result.msg = "Token失效,重新登陆";
        app.globalData.logout();
        return reject(new Error(JSON.stringify(result)));
      }

    })
    // .catch(err => {
    //   console.error(err);
    //   return err;
    // });
};
/**
 * find 请求（带条件查询）
 */
const httpOpenFind = (service, params = {}) => {
  return new Promise(function (resolve, reject) {
    const result = {
      data: {}
    };
    if (!service) {
      result.code = enumVal.LengthRequired;
      result.msg = "参数 service 异常";
      return reject(result);
    }
    // 参数异常
    if (!params && Object.keys(params).length === 0) {
      result.code = enumVal.LengthRequired;
      result.msg = "参数 params 异常";
      return reject(result);
    }
    const url = makeUrl(service, params);
    // console.log(url);
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
      },
      success: function (res) {
        result.code = enumVal.Success;
        result.msg = "查询成功";
        result.data = res.data;
        resolve(result);
      },
      fail: function (e) {
        result.code = enumVal.InternalServerError;
        result.msg = "查询失败";
        result.data = {};
        resolve(result);
      },
    })
  })
};
/**
 * 获取文章
 */
const getArticle = (service, params = {}) => {
  return new Promise(function (resolve, reject) {
    const result = {
      data: {}
    };
    if (!service) {
      result.code = enumVal.LengthRequired;
      result.msg = "参数 service 异常";
      return reject(result);
    }
    // 参数异常
    if (!params && Object.keys(params).length === 0) {
      result.code = enumVal.LengthRequired;
      result.msg = "参数 params 异常";
      return reject(result);
    }
    const url = makeUrl(service, params);
    // console.log(url);
    wx.request({
      url: url,
      success: function (res) {
        result.code = enumVal.Success;
        result.msg = "查询成功";
        result.data = res.data;
        resolve(result);
      },
      fail: function (e) {
        result.code = enumVal.InternalServerError;
        result.msg = "查询失败";
        result.data = {};
        resolve(result);
      },
    })
  })
};

/**
 * create 请求
 */
const httpCreate = (service, params = {}) => {
  return new Promise(function(resolve, reject) {
    const result = {
      data: {},
    };
    // 参数异常
    if (!service) {
      result.code = enumVal.LengthRequired;
      result.msg = "参数 service 异常";
      return reject(result);
    }
    if (!params || Object.keys(params).length === 0) {
      result.code = enumVal.LengthRequired;
      result.msg = "参数 params 异常";
      return reject(result);
    }
    let jwt = app.globalData.jwt;
    if (jwt && jwt.isValid(jwt.token)) {
      let token = jwt.token;
      wx.request({
        url: makeUrl(service),
        data: JSON.stringify(params),
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": token
        },
        success: function(res) {
          result.code = enumVal.Success;
          result.msg = "新增成功";
          result.data = res.data;
          resolve(result);
        },
        fail: function(e) {
          result.code = enumVal.InternalServerError;
          result.msg = "新增失败";
          resolve(result);
        },
      })
    } else {
      result.code = enumVal.AuthenticationError;
      result.msg = "Token失效,重新登陆";
      app.globalData.logout();
      return reject(new Error(result));
    }
  })
}

/**
 * patch 请求
 * service : api路径
 * id:修改的ID
 * setVal:修改的内容
 * param:修改的条件
 */
const httpPatch = (service, id, setVal = {}, param = {}) => {
  // console.log(id);
  // console.log(setVal);
  // console.log(param);
  return new Promise(function(resolve, reject) {
    const result = {
      data: {},
    };
    // 参数异常
    if (!service) {
      result.code = enumVal.LengthRequired;
      result.msg = "参数 service 异常";
      return reject(result);
    }
    if ((typeof id === 'undefined') && (!param || Object.keys(param).length === 0)) {
      result.code = enumVal.LengthRequired;
      result.msg = "参数异常";
      return reject(result);
    }
    if (!setVal || Object.keys(setVal).length === 0) {
      result.code = enumVal.LengthRequired;
      result.msg = "参数 setVal 异常";
      return reject(result);
    }
    // console.log(makeUrl(service, param, id));
    let jwt = app.globalData.jwt;
    if (jwt && jwt.isValid(jwt.token)) {
      let token = jwt.token;
      wx.request({
        url: makeUrl(service, param, id),
        data: JSON.stringify(setVal),
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": token
        },
        success: function(res) {
          // console.log(res);
          result.code = enumVal.Success;
          result.msg = "修改成功";
          result.data = res.data;
          resolve(result);
        },
        fail: function(e) {
          console.error(e);
          result.code = enumVal.InternalServerError;
          result.msg = "修改失败";
          resolve(result);
        },
      })
    } else {
      result.code = enumVal.AuthenticationError;
      result.msg = "Token失效,重新登陆";
      app.globalData.logout();
      return reject(new Error(result));
    }

  })

}
/**
 * update 请求
 *
 */
const httpUpdate = (service, id, setVal = {}, param = {}) => {  //param 里放where条件 setVal里传修改完的对象
  return new Promise(function(resolve, reject) {
    const result = {
      data: {},
    };
    // 参数异常
    if (!service) {
      result.code = enumVal.LengthRequired;
      result.msg = "参数 service 异常";
      return reject(result);
    }
    if (typeof id === 'undefined') {
      result.code = enumVal.LengthRequired;
      result.msg = "参数 ID 异常";
      return reject(result);
    }
    if (!setVal || Object.keys(setVal).length === 0) {
      result.code = enumVal.LengthRequired;
      result.msg = "参数 setVal 异常";
      return reject(result);
    }
    if (!param || Object.keys(param).length === 0) {
      result.code = enumVal.LengthRequired;
      result.msg = "参数 param 异常";
      return reject(result);
    }
    // console.log(makeUrl(service, param, id));
    let jwt = app.globalData.jwt;
    if (jwt && jwt.isValid(jwt.token)) {
      let token = jwt.token;
      // console.log("JSON.stringify(setVal)", JSON.stringify(setVal))
      wx.request({
        url: makeUrl(service, param, id),
        data: JSON.stringify(setVal),
        method: 'PUT',
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": token
        },
        success: function(res) {
          // console.log(res);
          result.code = enumVal.Success;
          result.msg = "修改成功";
          result.data = res.data;
          resolve(result);
        },
        fail: function(e) {
          console.error(e);
          result.code = enumVal.InternalServerError;
          result.msg = "修改失败";
          resolve(result);
        },
      })
    } else {
      result.code = enumVal.AuthenticationError;
      result.msg = "Token失效,重新登陆";
      app.globalData.logout();
      return reject(new Error(result));
    }
  })
}

/**
 * Remove 请求
 *
 */
const httpRemove = (service, id, params = {}) => {
  return new Promise(function(resolve, reject) {
    const result = {
      data: {},
    };
    // 参数异常
    if ((typeof id === 'undefined') && (!params || Object.keys(params).length === 0)) {
      result.code = enumVal.LengthRequired;
      result.msg = "参数异常";
      return reject(result);
    }
    // console.log(makeUrl(service, params, id));
    let jwt = app.globalData.jwt;
    if (jwt && jwt.isValid(jwt.token)) {
      let token = jwt.token;
      wx.request({
        url: makeUrl(service, params, id),
        method: 'DELETE',
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": token
        },
        success: function(res) {
          result.code = enumVal.Success;
          result.msg = "删除成功";
          result.data = res.data;
          resolve(result);
        },
        fail: function(e) {
          console.error(e);
          result.code = enumVal.InternalServerError;
          result.msg = "删除失败";
          resolve(result);
        },
      })
    } else {
      result.code = enumVal.AuthenticationError;
      result.msg = "Token失效,重新登陆";
      app.globalData.logout();
      return reject(new Error(result));
    }
  })
}
const pass = function(reqobj) {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: reqobj.url,
      data:reqobj.data,
      method: reqobj.method,
      header: reqobj.header,
      success: function(res) {
        resolve(res)
      }
    })
  })

}


module.exports = {
  httpFind: httpFind,
  httpGet: httpGet,
  // login: login,
  httpCreate: httpCreate,
  httpPatch: httpPatch,
  httpRemove: httpRemove,
  httpUpdate: httpUpdate,
  pass: pass,
  getArticle: getArticle,
  httpOpenFind: httpOpenFind,
  httpOpenGet: httpOpenGet
}
