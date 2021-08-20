一、付款单
二、定单支付，不能改成可以付款
三、“我的”查询时帐户类型增加积分，付款类型不动

登录：
一、需要增加一个获取微信openid的接口（前台传微信用户授权信息，后台通过调微信api获取对应openid）
二、绑定接口（前台传openid和所填用户帐号进行绑定）
三、登录接口（前台传openid进行微信一键登录，后台根据openid获取对应绑定用户，返回用户信息和token）

设置导航文字
uni.setNavigationBarTitle({
	title: '编辑地址'
});
设置导航按钮
webView.setTitleNViewButtonStyle(0, {
	text: text
});