const vscode = require('vscode');
const utils = require('./utils');
/**
 * 插件被激活时触发，所有代码总入口
 * @param {*} context 插件上下文
 */
exports.activate = function(context) {

		 async function provideCompletionItems(document, position) {
			const line        = document.lineAt(position);
			const projectUri = utils.getProjectPath(document) // 获取当前编辑项目目录路径
			// 只截取到光标位置为止，防止一些特殊情况
			const lineText = line.text.substring(0, position.character);
			// 简单匹配，只要当前光标前的字符串为`$api.` 就去查找接口文件目录
			const curLineText = String(lineText).trim()
			const keyworkList = curLineText.split('.')
			if(keyworkList.length > 1) {
				// 匹配api目录下的文件夹，排除非目录如fetch.js 和index.js
				if(/\$api\.\w?/.test(curLineText)) {
				const apiUri = vscode.Uri.joinPath(projectUri, './src/api')
				const folderList = await vscode.workspace.fs.readDirectory(apiUri) // return是个thenable
				//匹配接口文件夹
				if (keyworkList.length === 2) {
					return folderList.filter(item => {
						return !/\.js$/.test(item[0])
					}).map(item => {
						return new vscode.CompletionItem(item[0], vscode.CompletionItemKind.Field)
					})
				}
				//匹配文件夹下的请求函数名
			/* 	if (keyworkList.length === 3) {
					// 根据第二个关键字匹配接口目录下所有的接口函数
					if(keyworkList[1]) 
					{
						const targetFolder = folderList.filter(item => item[0].indexOf(keyworkList[1]) > -1)
						if (targetFolder.length) {
							//找到对应接口目录，获取下面文件的所有接口
							const apiDirUri = vscode.Uri.joinPath(projectUri, './src/api', `./${targetFolder[0][0]}`)
							const resFileList = await vscode.workspace.fs.readDirectory(apiDirUri) // return是个thenable
							// console.log(resFileList)
							const resTip = [] // 提示列表
							resFileList.forEach(async item => {
								const f = vscode.Uri.joinPath(apiDirUri, `./${item[0]}`)
								if(f.fsPath.indexOf(apiDirUri.fsPath) > -1)
								{
								const res = import(f.fsPath.replace(/\\/g, '/')).catch(err => console.log(err)) // TODO: 如何解决读取 es6模块代码的问题，require能读取但得保证所有写法都是commonjs
								console.log(res)
								}
							})
							return resTip
						}
					}
				} */
			}
			}
	}
	
	function resolveCompletionItem() {
			return null;
	}
	
			// 注册代码建议提示，只有当按下“.”时才触发
			context.subscriptions.push(vscode.languages.registerCompletionItemProvider(['javascript','vue'], {
					provideCompletionItems,
					resolveCompletionItem
			}, '.'));


};

/**
 * 插件被释放时触发
 */
exports.deactivate = function() {
    console.log('您的扩展“vscode-plugin-demo”已被释放！')
};