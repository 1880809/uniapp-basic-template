import {
	baseURL
} from './config.js';
const request = {}
const headers = {}
let mode = '-1'
// jwt时间戳
let timer;
/**
 * 主请求
 * url:请求地址
 * method:请求方式
 * params:请求参数
 * contentType:内容类型
 * mode:请求类型（已登录：1 / 未登录(默认)：-1）
 * requestedWith:同步/异步(默认) null / XMLHttpRequest
 * */
request.mainRequest = (url, method, params, contentType = "application/x-www-form-urlencoded", requestedWith =
	"XMLHttpRequest") => {
	// 获取超时时间
	let overtime = uni.getStorageSync('overtime') || 300;
	let language = uni.getStorageSync('locale') || 'zh-CN';

	if(false){
		// 超时踢出
		clearTimeout(timer)
		timer = setTimeout(() => {
			uni.removeStorageSync('token');
			if(language == 'zh-CN'){
				uni.showToast({
					title: '登录超时，请重新登陆',
					icon: 'none',
					position: 'center'
				})
			}else if(language == 'en-US'){
				uni.showToast({
					title: 'Login timeout, please relog in',
					icon: 'none',
					position: 'center'
				})
			}else{
				uni.showToast({
					title: '登錄超時，請重新登錄',
					icon: 'none',
					position: 'center'
				})
			}

			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/login/login',
				})
			}, 540)
		}, overtime * 1000)
	}

	let token = uni.getStorageSync('token') || '';
	if (token) mode = "1";
	headers["X-Requested-With"] = requestedWith;
	headers['Content-Type'] = contentType;
	headers['Content-Language'] = localStorage.getItem('locale') || 'en';
	switch (mode) {
		// 未登录
		case "-1":
			// headers['Authori-zation'] = ''
			break;
			// 已登录
		case "1":
			headers['Authorization'] = token
			break;
			//
		default:
			break;
	}
	return new Promise((resolve, reject) => {
		uni.request({
				url: baseURL + url,
				method: method,
				data: params,
				dataType: 'json',
				header: headers
			})
			.then(data => {
				let [error, res] = data;
				if (res.data.code == 4003) {
					uni.removeStorageSync('token')
					if (res.data.message != '非法访问') {
						uni.showToast({
							title: res.data.message||res.data.msg,
							icon: 'none',
							duration: 500
						})
					}
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/login/login',
						})
					}, 530)
				} else if (res.data.code == 4000) {
					resolve(res)
				} else {
					// uni.showToast({
					// 	title: res.data.message||res.data.msg,
					// 	icon: 'none',
					// 	position: 'center'
					// })
					if(res.data.message || res.data.msg) {
						uni.showToast({
							title: res.data.message||res.data.msg,
							icon: 'none',
							position: 'center'
						})
					} else {
						resolve(res)
					}

				}
			})
			.catch((err) => {
				reject(err)
			})

	})

}

// 处理 谷歌验证绑定后 登录
request.mainLogin = (url, method, params, contentType = "application/x-www-form-urlencoded", requestedWith =
	"XMLHttpRequest") => {
	// 获取超时时间
	let overtime = uni.getStorageSync('overtime') || 300;
	let language = uni.getStorageSync('locale') || 'zh-CN';
	clearTimeout(timer)
	timer = setTimeout(() => {
		uni.removeStorageSync('token');
		if(language == 'zh-CN'){
			uni.showToast({
				title: '登录超时，请重新登陆',
				icon: 'none',
				position: 'center'
			})
		}else{
			uni.showToast({
				title: 'Login timeout, please relog in',
				icon: 'none',
				position: 'center'
			})
		}

		setTimeout(() => {
			uni.reLaunch({
				url: '/pages/login/login',
			})
		}, 540)
	}, overtime * 1000)

	let token = uni.getStorageSync('token') || '';
	if (token) mode = "1";
	headers["X-Requested-With"] = requestedWith;
	headers['Content-type'] = contentType;
	switch (mode) {
		// 未登录
		case "-1":
			headers['token'] = ''
			break;
			// 已登录
		case "1":
			headers['token'] = token
			break;
			//
		default:
			break;
	}

	return new Promise((resolve, reject) => {
		uni.request({
				url: baseURL + url,
				method: method,
				data: params,
				dataType: 'json',
				header: headers
			})
			.then(data => {
				let [error, res] = data;
				if (res.data.code == -2000) {
					uni.removeStorageSync('token')
					if (res.data.message != '非法访问') {
						uni.showToast({
							title: res.data.message||res.data.msg,
							icon: 'none',
							duration: 500
						})
					}
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/login/login',
						})
					}, 530)
				} else if (res.data.code == 200 || res.data.code == 201) {
					resolve(res)
				} else {
					uni.showToast({
						title: res.data.message||res.data.msg,
						icon: 'none',
						position: 'center'
					})
				}
			})
			.catch((err) => {
				reject(err)
			})

	})

}


export default request;
