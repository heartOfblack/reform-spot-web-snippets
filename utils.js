const vscode = require( 'vscode' )
// 获取当前项目的接口目录，reform-spot-web/src/api
/**
 * 
 * @param {*} document 当前提示的文件对象 
 */
const getProjectPath = function ( document ) {
    const curActiveFilePath = document.uri.fsPath
    if ( vscode.workspace.workspaceFolders ) {
        const workspaceFolders = vscode.workspace.workspaceFolders.filter( item => {
            return curActiveFilePath.indexOf( item.uri.fsPath ) > -1
        } )[0]
        return workspaceFolders.uri // 返回当前工作区路径
    } else {
        vscode.window.showErrorMessage( '没有找到对应工作区' )
    }
}


module.exports = {
    getProjectPath
}