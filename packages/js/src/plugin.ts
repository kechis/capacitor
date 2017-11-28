import { Avocado } from './avocado';
import { AvocadoPluginConfig, PluginCall, PluginCallback } from './definitions';

/**
 * Base class for all 3rd party plugins.
 */
export class Plugin {
  private avocado: Avocado;
  isNative: boolean;

  constructor() {
    this.avocado = Avocado.instance();
    this.isNative = this.avocado.isNative;
  }

  nativeCallback(methodName: string, callback?: PluginCallback)
  nativeCallback(methodName: string, callback?: Function)
  nativeCallback(methodName: string, options?: any)
  nativeCallback(methodName: string, options?: any, callback?: PluginCallback)
  nativeCallback(methodName: string, options?: any, callback?: Function)
  nativeCallback(methodName: string, options?: any, callback?: any) {
    if (typeof options === 'function') {
      // 2nd arg was a function
      // so it's the callback, not options
      callback = options;
      options = {};
    }

    this.avocado.toNative({
      pluginId: this.pluginId(),
      methodName: methodName,
      options: options,
      callbackFunction: callback
    });
  }

  nativePromise(methodName: string, options?: any) {
    return new Promise((resolve, reject) => {
      this.avocado.toNative({
        pluginId: this.pluginId(),
        methodName: methodName,
        options: options,
        callbackResolve: resolve,
        callbackReject: reject
      });
    });
  }

  pluginId() {
    const config: AvocadoPluginConfig = (this as any).constructor.getPluginInfo();
    return config.id;
  }

}

/**
 * Decorator for AvocadoPlugin's
 */
export function AvocadoPlugin(config: AvocadoPluginConfig) {
  return function(cls: any) {
    cls['_avocadoPlugin'] = Object.assign({}, config);
    cls['getPluginInfo'] = () => cls['_avocadoPlugin'];
    return cls;
  };
}
