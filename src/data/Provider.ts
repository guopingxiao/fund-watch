import { window, Event, EventEmitter, TreeDataProvider } from 'vscode';
import { fundApi } from '../util';
import FunderHandler from './Handler';
import FundItem from './FundItem';
import { FundInfo } from '../types';

export default class DataProvider implements TreeDataProvider<FundInfo> { 

  public refreshEvent: EventEmitter<FundInfo | null> = new EventEmitter();

  readonly onDidChangeTreeData: Event<FundInfo | null> = this.refreshEvent.event;

  private order: number;

  constructor() {
    this.order = -1; // 排序
  }

  refresh() {
    setTimeout(() => {
      this.refreshEvent.fire(null);
    }, 200);
  }

  getTreeItem(info: FundInfo): FundItem {
    return new FundItem(info);
  }

  getChildren(): Promise<FundInfo[]> {
    const { order } = this;
    return FunderHandler.getFavorites().then((infos) =>
      infos.sort(({ changeRate: a = 0 }, { changeRate: b = 0 }) => {
        return (+a >= +b ? 1 : -1) * order;
      })
    );
  }

  // 调整排序
  changeOrder() {
    this.order *= -1;
    this.refresh();
  }

  // 增加自选
  async addFund() {
    const res = await window.showInputBox({
      value: '',
      valueSelection: [5, -1],
      prompt: '添加基金到自选',
      placeHolder: 'Add Fund To Favorite',
      validateInput: (inputCode: string) => {
        const codeArray = inputCode.split(/[\W]/);
        const hasError = codeArray.some((code) => {
          return code !== '' && !/^\d+$/.test(code);
        });
        return hasError ? '基金代码输入有误' : null;
      },
    });
    if (res !== undefined) {
      const codeArray = res.split(/[\W]/) || [];
      const newFunds: string[] = codeArray;
      const result = await fundApi(newFunds);
      if (result && result.length > 0) {
        // 只更新能正常请求的代码
        const codes = result.map((i) => i.code);
        FunderHandler.updateConfig(codes);
        this.refresh();
      } else {
        window.showWarningMessage('stocks not found');
      }
    }
  }

}