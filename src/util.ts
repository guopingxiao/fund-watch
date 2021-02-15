import * as https from 'https';
import * as stringWidth from 'string-width';
import { FundInfo  } from './types';



/**
 * 请求方法
 * @param url 
 */
const request = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let chunks = '';
      if (!res || res.statusCode !== 200) {
        reject(new Error('网络请求错误!'));
        return;
      }
      res.on('data', (chunk) => {
        chunks += chunk.toString('utf8'); // chunk接收
      });
      res.on('end', () => {
        resolve(chunks);
      });
    });
  });
};

/**
 * request FundApi
 * @param fundConfig 
 */
export function fundApi(fundConfig: string[]): Promise<FundInfo[]> {
  console.log('~~~开始发送请求了');
  const time = Date.now();
  const promises: Promise<string>[] = [];

  fundConfig.forEach((code) => {
    const url = `https://fundgz.1234567.com.cn/js/${code}.js?rt=${time}`;
    promises.push(request(url));
  });
  return Promise.all(promises).then((results) => {
    const resultArr: FundInfo[] = [];
    results.forEach((rsp: string) => {
      const match = rsp.match(/jsonpgz\((.+)\)/);
      if (!match || !match[1]) {
        return;
      }
      const str = match[1];
      const obj = JSON.parse(str);
      const info: FundInfo = {
        now: obj.gsz,
        name: obj.name,
        code: obj.fundcode,
        lastClose: obj.dwjz,
        changeRate: obj.gszzl,
        changeAmount: (obj.gsz - obj.dwjz).toFixed(4),
      };
      resultArr.push(info);
    });
    return resultArr;
  });
}

/**
 * 返回数组去重
 * @param arr 
 */
export function uniqueArr(arr: string []): any { 
  return Array.from(new Array(arr));
}

/**
 * 字符串长度拼接
 * @param source 原字符串长度
 * @param length 修改后的字符串长度
 * @param left 原字符串是否靠左边
 */
export function fillString(
  source: string,
  length: number,
  left = true
): string {
  let rest = source;
  while (stringWidth(rest) >= length) {
    rest = rest.slice(0, rest.length - 1);
  }
  const addString = '  '.repeat(length - stringWidth(rest));
  return left ? `${rest}${addString}` : `${addString}${rest}`;
}