import { TreeItem } from 'vscode';
import { fillString } from '../util';
import { FundInfo } from '../types';

export default class FundItem extends TreeItem { 
  info: FundInfo;

  constructor(info: FundInfo) { 
    const {name, changeRate,code,  now,changeAmount, lastClose} = info;
    const rate = Number(changeRate);
    const icon = rate >= 0 ? '📈' : '📉';
    const prev = rate >= 0 ? '+' : '-';
    const rage = `${prev}${Math.abs(rate)}%`;
    const _name = fillString(name, 25);

    super(`${icon}${_name} ${rage}`);

    let sliceName = name;
    if (sliceName.length > 8) { // 截断
      sliceName = `${sliceName.slice(0, 8)}...`;
    }

    const tips = [
      `代码:　${code}`,
      `名称:　${sliceName}`,
      `--------------------------`,
      `单位净值:　　　　${now}`,
      `涨跌幅:　　　　　${changeRate}%`,
      `涨跌额:　　　　　${changeAmount}`,
      `昨收:　　　　　　${lastClose}`,
    ];

    this.info = info;
    this.tooltip = tips.join('\r\n');

  }
}