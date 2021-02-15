import { commands, ExtensionContext, window, workspace } from 'vscode';
import Provider from './data/Provider';
import Handler from './data/Handler';


// 插件被激活时触发，所有代码的入口, context 为插件上下文
export function activate(context: ExtensionContext) {

	console.log('Congratulations, your extension "fund-watch" is now active!');
	let refreshTime = Handler.getRefreshTime();
	if (refreshTime < 5) { 
		refreshTime = 5;
	}

	// 基金类
	const fundProvider = new Provider();
	
	// 数据注册
	window.registerTreeDataProvider('fund-list', fundProvider);
	
	// 定时任务
  setInterval(() => {
    fundProvider.refresh();
	}, refreshTime * 1000);
	
	  // menu 事件
		context.subscriptions.push(
			commands.registerCommand(`fund.add`, () => {
				fundProvider.addFund();
			}),
			commands.registerCommand(`fund.order`, () => {
				fundProvider.changeOrder();
			}),
			commands.registerCommand(`fund.refresh`, () => {
				fundProvider.refresh();
			}),
			commands.registerCommand('fund.item.remove', (fund) => {
				const { code } = fund;
				Handler.removeConfig(code);
				fundProvider.refresh();
			})
		);
}

//  插件被释放时触发
export function deactivate() {}
