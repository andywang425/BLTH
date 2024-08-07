// 输出日志时会根据此处导出的命名来计算日志标题，按下划线分割，如 [DailyTask][MainSiteTask][LoginTask]
// 不同文件夹下各个模块的文件名和类名都可以重复，但此处导出的命名必须是全局唯一的
// （只要按照 Folder1_Folder2_..._ModuleName 这样的格式命名就不可能重名）
export { default as DailyTask_MainSiteTask_LoginTask } from './loginTask'
export { default as DailyTask_MainSiteTask_WatchTask } from './watchTask'
export { default as DailyTask_MainSiteTask_ShareTask } from './shareTask'
export { default as DailyTask_MainSiteTask_CoinTask } from './coinTask'
