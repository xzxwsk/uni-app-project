<template>
	<view class="order_detail">
		<view class="top">
			<image :src="bg" style="width: 100%;" mode="widthFix"></image>
			<view class="con">
				<text class="state">{{billObj.stateStr}}</text>
				<view class="menu_txt">
					<text class="title">{{ billObj.Address }}</text>
					<text class="title sub_txt">{{ billObj.Remark }}</text>
				</view>
			</view>
		</view>
		<view class="center">
			<scroll-view scroll-y="true" style="width: 100%; height: 100%;">
				<view class="uni-list">
					<view class="uni-list-cell" v-for="(value,key) in billObj.Items" :key="key">
						<view class="uni-media-list">
							<view class="uni-media-list-logo">
								<image v-if="showImg" mode="aspectFit" @error="imageError" :src="value.img"></image>
							</view>
							<view class="uni-media-list-body">
								<view>
									<view class="uni-media-list-text-top">{{value.ProductName}}</view>
									<view class="uni-media-list-text-top sub_txt">计量单位: {{value.UnitName}} &nbsp; &nbsp; 数量: {{value.Qty}}件</view>
									<view class="uni-media-list-text-top sub_txt">商品编号: {{value.ProductCode}}</view>
								</view>
								<view class="uni-media-list-text-bottom uni-ellipsis price">￥{{value.Amount}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-list count">
					<!-- <view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<text class="item-title"><text>商品金额</text></text>
							<text class="item-content"><text>￥{{count.toFixed(2)}}</text></text>
						</view>
					</view> -->
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<text class="item-title"><text class="b">合计金额</text></text>
							<text class="item-content"><text class="price">￥{{(count).toFixed(2)}}</text></text>
						</view>
					</view>
				</view>
				<view class="uni-list count">
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<text class="item-title"><text>订单编号</text></text>
							<text class="item-content"><text>{{billObj.BillCode}}</text></text>
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<text class="item-title"><text>订货日期</text></text>
							<text class="item-content"><text>{{billObj.billDateStr}}</text></text>
						</view>
					</view>
				</view>
				<view class="empty"></view>
			</scroll-view>
		</view>
		<view class="result">
			<!-- 填写的订单 -->
			<button class="btn" @click="bindClose">关闭</button>
			<button class="btn" type="warn" @click="bindConfirmReceive">确认收货</button>
			<!-- <button class="btn" type="warn" v-if="isReturn" @click="bindReturn">退货</button> -->
			<button class="btn" type="warn" @click="bindReturn">退货</button>
			<button class="btn" type="warn" @click="bindCancelReturn">取消退货</button>
			
			<!-- 收到的订单 -->
			<button class="btn" type="warn" @click="bindSend">发货</button>
			<button class="btn" type="warn" @click="bindReturnConfirm">确认退货</button>
		</view>
		
		<uni-popup ref="popup" type="bottom">
			<view class="pop">
				<button class="uni-icon uni-icon-closeempty close_btn" @click="closePopup"></button>
				<view class="con" style="padding: 30px 0 0; min-height: 100px;">
					<view class="input-group">
						<view class="input-row border">
							<text class="title">货运单号：</text>
							<input-box ref="trackingNo" type="text" :verification="['isNull']" :verificationTip="['货运单号不能为空']" class="input-box" clearable focus v-model="trackingNo" placeholder="请输入收货人"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">快递公司：</text>
							<input-box ref="transportCompany" type="text" class="input-box" clearable focus v-model="transportCompany" placeholder="请输入货运公司"></input-box>
						</view>
					</view>
				</view>
				<button type="warn" @click="closePopup('confirm')">确定</button>
			</view>
		</uni-popup>
		<uni-popup ref="popup2" type="bottom">
			<view class="pop">
				<button class="uni-icon uni-icon-closeempty close_btn" @click="closePopup2"></button>
				<view class="con" style="padding: 30px 0 0; min-height: 100px;">
					<view class="input-group">
						<view class="input-row border">
							<text class="title">退货货运信息：</text>
							<input-box ref="trackingNo2" type="text" class="input-box" clearable v-model="trackingNo2" disabled></input-box>
						</view>
						<view class="input-row border">
							<text class="title">退货原因：</text>
							<textarea v-model="reson" style="padding: 10px 11px; height: 60px;" disabled />
						</view>
					</view>
				</view>
				<button type="warn" @click="closePopup2('confirm')">确定</button>
			</view>
		</uni-popup>
		<uni-popup ref="popup3" type="bottom">
			<view class="pop">
				<button class="uni-icon uni-icon-closeempty close_btn" @click="closePopup3"></button>
				<view class="con" style="padding: 30px 0 0; min-height: 100px;">
					<view class="input-group">
						<view class="input-row border">
							<text class="title">退货货运单号：</text>
							<input-box ref="trackingNo3" type="text" :verification="['isNull']" :verificationTip="['货运单号不能为空']" class="input-box" clearable focus v-model="trackingNo3" placeholder="请输入货运单号"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">退货原因：</text>
							<textarea v-model="reson" style="padding: 10px 11px; height: 60px;" placeholder="请输入退货原因"/>
						</view>
					</view>
				</view>
				<button type="warn" @click="closePopup3('confirm')">确定</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	const tpl = [{
		selected: false,
		img: '/static/img/H_9X10_1.jpg',
		title: '春·明前茶·4月5日  ,碧螺春,四品002,218g',
		price: 130.00,
		num: 1,
		hoverClass: ''
	},{
		selected: false,
		img: '/static/img/H_027_1.jpg',
		title: '飘雪·五品·027  54 * 4g/袋（共54袋）',
		price: 148.00,
		num: 1,
		hoverClass: ''
	},{
		selected: false,
		img: '/static/img/H_023_180@200.JPG',
		title: '绿·碧螺春·五品·023  54 * 4g/袋（共54袋）',
		price: 139.00,
		num: 1,
		hoverClass: ''
	},{
		selected: false,
		img: '/static/img/H_9X10_1.jpg',
		title: '春·明前茶·4月5日  ,碧螺春,四品002,218g',
		price: 130.00,
		num: 1,
		hoverClass: ''
	},{
		selected: false,
		img: '/static/img/H_027_1.jpg',
		title: '飘雪·五品·027  54 * 4g/袋（共54袋）',
		price: 148.00,
		num: 1,
		hoverClass: ''
	},{
		selected: false,
		img: '/static/img/H_023_180@200.JPG',
		title: '绿·碧螺春·五品·023  54 * 4g/袋（共54袋）',
		price: 139.00,
		num: 1,
		hoverClass: ''
	}];	
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import bg from "@/static/images/cargo.png";
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			inputBox, uniPopup
		},
		computed: mapState(['openid', 'userInfo']),
		data() {
			return {
				bg: bg,
				isReturn: false, // 是否可以退货
				trackingNo: '', // 发货单号
				trackingNo2: '', // 退货确认单号
				trackingNo3: '', // 退货单号
				transportCompany: '', // 货运公司
				reson: '', // 退货原因
				billObj: {
					"Items": []  /*订单明细*/,
					"RecordId": ""  /*单据Id*/,
					"BillCode": ""  /*单据编号*/,
					"BillDate": "2019-09-17T17:07:55.3032242+08:00"  /*单据日期*/,
					"DealerId": ""  /*订货经销商Id*/,
					"DealerCode": ""  /*订货经销商编号*/,
					"DealerName": ""  /*订货经销商姓名*/,
					"Remark": ""  /*备注*/,
					"Address": ""  /*收货地址*/,
					"Amount": 0.0  /*合计金额*/,
					"Creator": ""  /*录入人*/,
					"CreatorName": ""  /*录入人姓名*/,
					"CreateTime": ""  /*录入时间*/,
					"LastModifier": ""  /*最后修改人*/,
					"LastModifierName": ""  /*最后修改人姓名*/,
					"LastModifyTime": ""  /*最后修改时间*/,
					"StateChanged": false  /*状态是否发生过改变*/,
					"DealerIdSend": ""  /*发货经销商Id*/,
					"DealerCodeSend": ""  /*发货经销商编号*/,
					"DealerNameSend": ""  /*发货经销商姓名*/,
					"FreightInfo": ""  /*发货货运信息*/,
					"TimeStamp": ""  /*时间戳*/,
					"State": 1  /*单据状态*/,
					"ChangeType": 0,
					"IdValues": [
					  ""
					],
					"iState": 1
				},
				state: '待确认收货',
				addr: {
					name: 'wsk',
					phone: '17341303920',
					detail: '北京北京市东城区北京北京市东城区北京北京市东城区北京北京市东城区sdafdsafd'
				},
				showImg: false,
				orderLs: [],
				count: 278,
				freight: 212,
				orderNo: '2019073000000002',
				createOrder: '2019-07-30 10:59:03'
			}
		},
		onLoad(option) {
			if (option.hasOwnProperty('id')){
				let id = option.id;
				this.init(id)
			}
			this.billObj.billDateStr = util.formatDate(this.billObj.BillDate, 'yyyy-MM-dd');
			// this.orderLs = tpl.slice(0, 2);
			// setTimeout(() => {
			// 	this.showImg = true;
			// }, 400)
		},
		methods: {
			init(id) {
				// 获取详情
				util.ajax({
					method: 'Businese.OrderDAL.GetById',
					params: {
						RecordId: id
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					this.billObj = res.data.result;
					this.billObj.stateStr = ['已关闭', '未发货', '已发货', '已收货确认', '', '退货中', '退货确认'][this.billObj.State + 1];
					
					// 是否可以退货
					util.ajax({
						method: 'Businese.OrderDAL.CanReturn',
						params: {
							OrderId: res.data.result.RecordId
						},
						tags: {
							usertoken: this.openid
						}
					}).then(resReturn => {
						this.isReturn = resReturn.data.result;
					});
				});
			},
			bindClose() {
				// 关闭
				util.ajax({
					method: 'Businese.OrderDAL.Close',
					params: {
						"BillId" : this.billObj.RecordId /*订单Id [String]*/
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.showToast({
						title: '收货确认成功',
						success() {
							uni.navigateBack();
						}
					});
				});
			},
			bindSend(index) {
				// 发货
				this.$refs.popup.open();
			},
			closePopup(str){
				let me = this;
				if (str === 'confirm') {
					// 发货点击确定
					if (this.$refs.trackingNo.getValue() && this.$refs.transportCompany.getValue()) {
						this.$refs.popup.close();
						util.ajax({
							method: 'Businese.OrderDAL.Send',
							params: {
								"OrderId" : this.billObj.RecordId /*订单Id [String]*/,
								"DiliveryInfo" : {
								  "Adress": this.billObj.Address  /*收货地址*/,
								  "LinkMan": this.billObj.DealerName  /*联系人*/,
								  "Mobile": this.userInfo.Mobile  /*手机号*/,
								  "TransportCompany": this.billObj.FreightInfo  /*货运公司*/,
								  "TrackingNo": this.trackingNo  /*运单号*/
								} /*货运信息 [DiliveryInfo]*/,
								"Reson" : this.reson /*退货原因 [String]*/
							},
							tags: {
								usertoken: this.openid
							}
						}).then(res => {
							util.showToast({
								title: '发货成功',
								success() {
									me.init();
								}
							});
						});
					}
				} else {
					this.$refs.popup.close();
				}
			},
			bindConfirmReceive() {
				// 收货确认
				util.ajax({
					method: 'Businese.OrderDAL.ReceiveConfirm',
					params: {
						"OrderId" : this.billObj.RecordId /*订单Id [String]*/
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.showToast({
						title: '收货确认成功',
						success() {
							uni.navigateBack();
						}
					});
				});
			},
			bindReturnConfirm(index) {
				// 退货确认
				this.$refs.popup2.open();
			},
			closePopup2(str){
				let me = this;
				if (str === 'confirm') {
					// 退货点击确定
					this.$refs.popup2.close();
					util.ajax({
						method: 'Businese.OrderDAL.ReturnConfirm',
						params: {
							"OrderId" : this.billObj.RecordId /*订单Id [String]*/,
						},
						tags: {
							usertoken: this.openid
						}
					}).then(res => {
						util.showToast({
							title: '退货操作成功',
							success() {
								me.init();
							}
						});
					});
				} else {
					this.$refs.popup2.close();
				}
			},
			bindCancelReturn() {
				// 撤销退货
				util.ajax({
					method: 'Businese.OrderDAL.ReturnCancel',
					params: {
						"OrderId" : this.billObj.RecordId /*订单Id [String]*/
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.showToast({
						title: '撤销退货操作成功',
						success() {
							uni.navigateBack();
						}
					});
				});
			},
			bindReturn() {
				// 退货
				this.$refs.popup2.open();
			},
			closePopup3(str){
				let me = this;
				if (str === 'confirm') {
					// 退货点击确定
					if (this.$refs.trackingNo3.getValue()) {
						this.$refs.popup3.close();
						util.ajax({
							method: 'Businese.OrderDAL.Return',
							params: {
								"OrderId" : this.billObj.RecordId /*订单Id [String]*/,
								"DiliveryInfo" : {
								  "Adress": this.billObj.Address  /*收货地址*/,
								  "LinkMan": this.billObj.DealerName  /*联系人*/,
								  "Mobile": this.userInfo.Mobile  /*手机号*/,
								  "TransportCompany": this.billObj.FreightInfo  /*货运公司*/,
								  "TrackingNo": this.trackingNo3  /*运单号*/
								} /*货运信息 [DiliveryInfo]*/,
								"Reson" : this.reson /*退货原因 [String]*/
							},
							tags: {
								usertoken: this.openid
							}
						}).then(res => {
							util.showToast({
								title: '退货操作成功',
								success() {
									uni.navigateBack();
								}
							});
						});
					}
				} else {
					this.$refs.popup3.close();
				}
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
