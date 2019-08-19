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
		title: '提示信息',
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

module.exports = {
	formatTime: formatTime,
	formatLocation: formatLocation,
	dateUtils: dateUtils,
	getType: getType,
	deepCopy: deepCopy,
	extend: extend,
	goUrl: goUrl,
	goTab: goTab,
	dialog: dialog,
	showLoading: showLoading,
	hideLoading: hideLoading,
	showToast: showToast,
	hideToast: hideToast,
	random: random
}
