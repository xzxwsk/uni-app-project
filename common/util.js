let baseUrlGlobal
const miniProgram = uni.getAccountInfoSync().miniProgram
console.log('miniProgram: ', miniProgram)
if (miniProgram.envVersion !== 'release') {
	baseUrlGlobal = 'http://47.104.226.115/qcdm/'; // 开发 测试帐号：A0000002 密码：1234  15883670960 1234 appId: wxba5d4722564f6a06
// const baseUrlGlobal = 'http://118.163.201.227/qcdm/'; // 生产环境
} else {
	baseUrlGlobal = 'https://www.zzxianchang.cn/qcdm/'; // 小程序 测试帐号：A0000002 密码：000000 appId: wxaf376d36626cae3a 
}
const updateUrl = 'http://www.zzxianchang.cn/appdownload/updatedata.json'; // 更新地址
const imgUrl = 'http://rxfs.rtrh.net/qianchangyewu'; // 图片地址
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
let baseUrl = '';

let setBaseUrl = function(url) {
	baseUrl = url;
};
let getBaseUrl = function() {
	return baseUrl || baseUrlGlobal;
};
let getUpdateUrl = function() {
	return updateUrl;
};
let getImgUrl = function() {
	return imgUrl;
}
function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	let hour = parseInt(time / 3600)
	time = time % 3600
	let minute = parseInt(time / 60)
	time = time % 60
	let second = time

	return ([hour, minute, second]).map(function (n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}
function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
let dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function (milliseconds) {
		let humanize = '';
		for (let key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function (dateStr) {
		let date = this.parse(dateStr)
		let diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		let _format = function (number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		let a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};
let getMonthDays = function (year, month) {
	var stratDate = new Date(year,month-1,1),
		endData = new Date(year,month,1);
	var days = (endData -stratDate)/(1000*60*60*24);
	return days;
};
let getType = function(obj){
    //tostring会返回对应不同的标签的构造函数
	let type = Object.prototype.toString.call(obj);
    let map = {
	    '[object Boolean]'  : 'boolean', 
	    '[object Number]'   : 'number', 
	    '[object String]'   : 'string', 
	    '[object Function]' : 'function', 
	    '[object Array]'    : 'array', 
	    '[object Date]'     : 'date', 
	    '[object RegExp]'   : 'regExp', 
	    '[object Undefined]': 'undefined',
	    '[object Null]'     : 'null', 
	    '[object Object]'   : 'object'
    };
	let isElement = false;
	if (typeof Element != 'undefined') {
		isElement = obj instanceof Element;
	}
    if(isElement) {
	    return 'element';
    }
    return map[type];
};
let formatDate = function (dateStr, formatStr) {
	var fmt = null;
	if (!dateStr) {
		return '';
	}
	var date = dateStr;
	if (getType(dateStr) === 'date') {
		
	} else {
		date = new Date(dateStr);
	}
	var reg = {
		"M+": date.getMonth() + 1,                   //月份
		"d+": date.getDate(),                        //日
		"h+": date.getHours(),                       //小时
		"m+": date.getMinutes(),                     //分
		"s+": date.getSeconds(),                     //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds(),                 //毫秒
		'w+': date.getDay()                          //周几
	};
	var arr = [], arr1 = [], arr2 = [];
	if(getType(dateStr) === 'string') {
		if(dateStr.indexOf('T') != -1) {
			arr = dateStr.split('T');
			arr1 = arr[0].split('-');
			arr2 = arr[1].split('.');
			arr2 = arr2[0].split(':');
			reg["M+"] = arr1[1];                        //月份
			reg["d+"] = arr1[2];                        //日
			reg["h+"] = arr2[0];                        //小时
			reg["m+"] = arr2[1];                        //分
			reg["s+"] = arr2[2];                        //秒
		}
	}
	if (/(y+)/.test(formatStr)) {
		fmt = formatStr.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in reg) {
		if (!fmt) {
			fmt = formatStr;
		}
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (reg[k]) : (("00" + reg[k]).substr(("" + reg[k]).length)));
		}
	}
	return fmt;
}

let random = function(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1, 10); 
			break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum, 10); 
			break; 
        default: 
            return 0;
    }
};
let stringReplace = function (string, character, replace) {
	var data = string;
	var reg;
	var setReplace = function (character, index) {
		var newCharacter;
		reg = null;
		reg = new RegExp(character, "g");
		if (typeof replace == "object") {
			for (var i = 0; i < replace.length; i++) {
				if (i == index) {
					newCharacter = replace[i];
				}
			}
		} else if (typeof replace == "string") {
			newCharacter = replace;
		}
		data = data.replace(reg, newCharacter);
	}
	if (typeof character == "object") {
		for (var i = 0; i < character.length; i++) {
			setReplace(character[i], i)
		}
	} else {
		setReplace(character)
	}
	return data;
};
let jsonReplace = function (json, character, replace) {
	var str = JSON.stringify(json);
	return JSON.parse(stringReplace(str, character, replace));
};
let deepCopy = function(data) {
    var type = getType(data);
    var obj;
    if(type === 'array'){
	    obj = [];
    } else if(type === 'object'){
	    obj = {};
    } else {
	    //不再具有下一层次
	    return data;
    }
    if(type === 'array'){
	    for(var i = 0, len = data.length; i < len; i++){
		    obj.push(deepCopy(data[i]));
	    }
    } else if(type === 'object'){
	    for(var key in data){
		    obj[key] = deepCopy(data[key]);
	    }
    }
    return obj;
};
let extend = function(destination,source) {
    if(typeof destination == "object"){//destination是一个json对象
        if(typeof source == "object"){//source是一个json对象
            //把source中的每一个key,value值赋值给destination
            for(let i in source){
                destination[i] = source[i];
            }
        }
    }
    
    if(typeof destination == "function"){
        if(typeof source == "object"){
            for(var i in source){
                destination.prototype[i] = source[i];
            }
        }
        if(typeof source == "function"){
            destination.prototype = source.prototype;
        }
    }
    return destination;
};
let goUrl = function(prompt) {
	let option = {
		url: '',
		animationType: 'pop-in',
		animationDuration: 300,
		success: function() {},
		fail: function() {},
		complete: function() {}
	};
	extend(option, prompt);
	uni.navigateTo(option);
};
let redirectUrl = function(prompt) {
	let option = {
		url: '',
		success: function() {},
		fail: function() {},
		complete: function() {}
	};
	extend(option, prompt);
	uni.reLaunch(option);
};
let goTab = function(prompt) {
	let option = {
		url: '',
		success: function() {},
		fail: function() {},
		complete: function() {}
	};
	extend(option, prompt);
	uni.switchTab(option);
};
let dialog = function(prompt) {
	let option = {
		title: '提示',
		content: '',
		showCancel: true,
		cancelText: '取消',
		cancelColor: '#000',
		confirmText: '确定',
		confirmColor: '#e64340',
		success: function() {},
		fail: function() {},
		complete: function() {}
	};
	extend(option, prompt);
	uni.showModal(option)
};
let showLoading = function(prompt) {
	let option = {
		title: '加载中...',
		mask: false,
		success: function() {},
		fail: function() {},
		complete: function() {}
	};
	extend(option, prompt);
	uni.showLoading(option);
};
let hideLoading = function(text) {
	uni.hideLoading();
};
let showToast = function(prompt) {
	let option = {
		title: '提示信息',
		icon: 'none', // success loading none
		image: '',
		mask: false,
		duration: 1500,
		position: '', // top center bottom
		success: function() {},
		fail: function() {},
		complete: function() {}
	};
	extend(option, prompt);
	uni.showToast(option);
};
let hideToast = function(text) {
	uni.hideToast();
};

let setStorageSync = function(prompt) {
	uni.setStorageSync(prompt.key, prompt.data);
};
let getStorageSync = function(key) {
	return uni.getStorageSync(key);
};
let clearStorageSync = function() {
	uni.clearStorageSync();
};

let getAjax = function(prompt) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: getBaseUrl() + prompt.method,
			data: prompt.params,
			header: {},
			method: 'GET',
			dataType: prompt.dataType || 'json',
			responseType: prompt.responseType || 'text',
			success: function(res) {
				// console.log({
				// 	data: res.data,
				// 	statusCode: res.statusCode,
				// 	header: res.header,
				// });
				if (res.statusCode !== 200) {
					reject({
						message: '网络错误',
						data: '网络错误'
					});
					return;
				}
				resolve(res);
			},
			fail: function(err) {
				reject(err);
			},
			complete: function() {}
		});
	});
};
let postAjax = function(prompt) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: getBaseUrl() + 'json.rpc/webapi',
			data: JSON.stringify(prompt),
			header: {},
			method: 'POST',
			dataType: prompt.dataType || 'json',
			responseType: prompt.responseType || 'text',
			success: function(res) {
				// console.log({
				// 	data: res.data,
				// 	statusCode: res.statusCode,
				// 	header: res.header,
				// });
				if (res.statusCode !== 200) {
					reject({
						message: '网络错误',
						data: '网络错误'
					});
					return;
				} else if (res.data.hasOwnProperty('error')) {
					if (res.data.error.code === 30000 || (res.data.error.message && getType(res.data.error.message) === 'string' && res.data.error.message.indexOf('令牌错误或用户没有登录') != -1)) {
						setStorageSync({
							key: 'session_id',
							data: ''
						});
						redirectUrl({
							url: '/pages/login/login'
						});
						return;
					}
					reject(res.data.error);
					return;
				}
				resolve(res);
			},
			fail: function(err) {
				reject(err);
			}
		});
	});
};

let ajaxReturn = function(err, _prompt) {
	// let type = getType(err);
	// if (!(type === 'number' || type === 'string')) {
	// 	err = JSON.stringify(err);
	// }
	console.log('err: ', err);
	hideLoading();
	
	// 如果是小程序端
	// #ifdef MP-WEIXIN
	if (err.code === 31000) {
		dialog({
			title: '错误信息',
			content: err.message,
			success: function(data) {
				if(data.confirm) {
					console.log('确定')
					// 跳转绑定页
					goUrl({
						url: 'bind'
					})
				}
			}
		})
		return
	}
	// #endif
	
	dialog({
		title: '错误信息',
		content: err.message,
		cancelText: '确定',
		confirmText: '查看详情',
		success: function(data) {
			if(data.confirm) {
				dialog({
					title: '错误详情',
					content: err.data + '\n' + JSON.stringify(_prompt),
					showCancel: false
				});
			}
		}
	});
}
let ajax = function(prompt) {
	let _prompt = {
		jsonrpc: '2.0',
		method: '',
		params: {},
		id: 1,
		tags: {
			usertoken: ''
		}
	};
	extend(_prompt, prompt);
	if (!_prompt.tags.usertoken || _prompt.tags.usertoken === '' || _prompt.tags.usertoken === 'null') {
		_prompt.tags.usertoken = getStorageSync('session_id');
	}
	return new Promise((resolve, reject) => {
		if(prompt.get) {
			return getAjax(_prompt)
			.then(data => resolve(data))
			.catch(err => {
				if (err.hasOwnProperty('errMsg')) {
					err.message = '网络超时',
					err.data = err.errMsg;
				}
				ajaxReturn(err, _prompt);
				reject(err);
			});
		} else {
			return postAjax(_prompt)
			.then(data => resolve(data))
			.catch(err => {
				if (err.hasOwnProperty('errMsg')) {
					err.message = '网络超时',
					err.data = err.errMsg;
				}
				ajaxReturn(err, _prompt);
				reject(err);
			})
		}
	});
}

module.exports = {
	timeout: timeout,
	getBaseUrl: getBaseUrl,
	setBaseUrl: setBaseUrl,
	getUpdateUrl,
	getImgUrl,
	formatTime: formatTime,
	formatLocation: formatLocation,
	dateUtils: dateUtils,
	formatDate: formatDate,
	getMonthDays: getMonthDays,
	getType: getType,
	jsonReplace: jsonReplace,
	deepCopy: deepCopy,
	extend: extend,
	goUrl: goUrl,
	redirectUrl: redirectUrl,
	goTab: goTab,
	dialog: dialog,
	showLoading: showLoading,
	hideLoading: hideLoading,
	showToast: showToast,
	hideToast: hideToast,
	random: random,
	setStorageSync: setStorageSync,
	getStorageSync: getStorageSync,
	clearStorageSync: clearStorageSync,
	ajax: ajax
}
