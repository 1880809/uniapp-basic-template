// 接口服务地址
let baseURL = "https://js.0292.net" //https://robot.qwoo.cc
// 图片服务地址
let imgURL = 'https://js.0292.net'
// 获取行情socket地址(火币网)
// let marketWebSocketURL = 'ws://api.huobiasia.vip/ws'
let marketWebSocketURL = 'wss://api-aws.huobi.pro/ws'

if (process.env.NODE_ENV === 'development') {
	// 开发环境
	baseURL = "https://js.0292.net"
	imgURL = ''
} else {
	// 生产环境
	baseURL = 'https://js.0292.net'
}

export {
	baseURL,// 接口API地址
	imgURL,// 接口图片API地址
	marketWebSocketURL,// 获取行情socket地址
};
