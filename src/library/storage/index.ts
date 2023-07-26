import { GM_getValue, GM_setValue } from '$'
import defaultValues from './defaultValue'
import { IuiConfig, ImoduleConfig } from '../../types'
import _ from 'lodash'

class Storage {
  /**
   * 递归合并配置项。删除当前配置中不存在于默认配置的键，补上相对于默认配置缺少的键值，其它键值不变。
   *
   * 该方法会修改当前配置。
   *
   * @param current_config_item 当前配置
   * @param default_config_item 默认配置
   * @returns 修改后的当前配置
   * @example
   *
   * const current_config = { enabled: true, details: { type: 'efg', status: 'ok' }, msg: 'hi' };
   * const default_config = { enabled: false, details: { type: 'abc', num = 1 } };
   *
   * mergeConfig(current_config, default_config);
   * // => { enabled: true, details: { type: 'efg', num = 1 } }
   */
  private static mergeConfigs(current_config_item: any, default_config_item: any): any {
    // 获取仅在当前配置中存在的键
    const keysOnlyInCurrentConfigItem = _.difference(
      _.keys(current_config_item),
      _.keys(default_config_item)
    )
    // 删除当前配置中的这些键
    current_config_item = _.omit(current_config_item, keysOnlyInCurrentConfigItem)
    // 获取仅在默认配置中存在的键
    const keysOnlyInDefaultItem = _.difference(
      _.keys(default_config_item),
      _.keys(current_config_item)
    )
    // 把这些键值对分配给当前配置
    _.assign(current_config_item, _.pick(default_config_item, keysOnlyInDefaultItem))
    // 遍历当前配置的键值对，刚分配的那些键值对肯定是正确的所以不用遍历
    for (const [key, value] of Object.entries(current_config_item).filter(
      (keyValue) => !keysOnlyInDefaultItem.includes(keyValue[0])
    )) {
      // 只递归合并普通对象（过滤 number, string, Array, null 等）
      if (_.isPlainObject(value)) {
        current_config_item[key] = this.mergeConfigs(value, default_config_item[key])
      }
    }

    return current_config_item
  }

  public static setUiConfig(uiConfig: IuiConfig) {
    GM_setValue('ui', uiConfig)
  }

  public static getUiConfig(): IuiConfig {
    return this.mergeConfigs(GM_getValue('ui', {}), defaultValues.ui)
  }

  public static setModuleConfig(moduleConfig: ImoduleConfig) {
    GM_setValue('modules', moduleConfig)
  }

  public static getModuleConfig(): ImoduleConfig {
    return this.mergeConfigs(GM_getValue('modules', {}), defaultValues.modules)
  }
}

export default Storage
