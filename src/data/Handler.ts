import { workspace, WorkspaceConfiguration } from 'vscode';
import { fundApi, uniqueArr } from '../util';
import { FundInfo } from '../types';


class Handler {
  config: WorkspaceConfiguration; 
  favorList: string[];
  fundWatchKey: string;

  constructor() { 
    this.config = workspace.getConfiguration();
    this.favorList = [];
    this.fundWatchKey = 'fund-watch.favorites';
  }

  /**
   * 更新自选列表
   * @param funds 
   */
  updateConfig(funds: string[]) { 
    const favorList  = this.getFundList();
    this.favorList = uniqueArr([...this.favorList, ...funds]);
    this.config.update(this.fundWatchKey, favorList, true);
  }

  /**
   * 获取自选列表
   */
  getFundList(): string[] { 
    const favorList: any =this.config.get('fund-watch.favorites');
    return favorList[0] || [];
  }
  /**
   * 获取自选列表
   */
  getRefreshTime(): number { 
    return this.config.get('fund-watch.interval', 5);
  }

  /**
   * 删除自选
   * @param code 
   */
  removeConfig(code: string) { 
    const favorList = this.getFundList();
    const index = favorList.indexOf(code);
    if (index > -1) { 
      favorList.splice(index, 1);
      this.config.update(this.fundWatchKey, favorList, true);
    }
  }

  /**
   * 获取基金的数据
   */
  async getFavorites(): Promise<FundInfo[]> {
    const favorList = this.getFundList();
    const infos = await fundApi(favorList);
    return infos;
  }
}

export default new Handler();

