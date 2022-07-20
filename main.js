import App from './App'
import http from './http/request';
import { baseURL, imgURL, marketWebSocketURL } from './http/config.js'
import { copy, tabBarChange, message, JumpPage, uploadImg, saveImg, dataFormat, isSb} from './lib/unit.js';

let locale = ''
if (!locale) locale = 'zh' //zh-CN

// #ifndef VUE3
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Store from './store/index'
import uView from '@/uni_modules/uview-ui'

Vue.config.productionTip = false

Vue.use(VueI18n)
Vue.use(uView)

const i18n = new VueI18n({
    locale: localStorage.getItem('locale') || locale,
    messages: {
        "zh": require("./lib/lang/zh.json"),
        // "en": require("./static/i18n/en-US.js").lang,
        // "zh-TW": require("./static/i18n/zh-TW.js").lang,
    }
})

Object.assign(Vue.prototype, {
    // 复制
    $copy: copy,
    // tabbar语言切换
    tabBarChange,
    // 消息提示框
    $message: message,
    dataFormat,
    isSb,
    // 路由跳转
    JumpPage,
    // 国际化
    _i18n: i18n,
    // 网络请求
    $http: http.mainRequest,
    // 上传图片
    $uploadImg: uploadImg,
    // 保存图片到本地
    $saveImg: saveImg,
    // 图片资源地址
    $imgURL: imgURL,
    // 接口资源地址
    $baseURL: baseURL,
    // 首页获取行情socket地址
    $marketWebSocketURL: marketWebSocketURL,
    $store: Store
});

uni.$u.setConfig({
    // 修改$u.config对象的属性
    config: {
        // 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
        unit: 'rpx'
    },
    // 修改$u.props对象的属性
    props: {
        // 修改radio组件的size参数的默认值，相当于执行 uni.$u.props.radio.size = 30
        radio: {
            size: 14
        }
        // 其他组件属性配置
        // ......
    }
})
// uni.$u.config.unit = 'rpx'

App.mpType = 'app'
const app = new Vue({
    i18n,
    Store,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
