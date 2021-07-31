<template>
	<view class="order_detail">
		<view class="top">
			<image :src="bg" style="width: 100%;" mode="widthFix"></image>
			<view class="con">
				<text class="state">{{billObj.stateStr}}</text>
				<view class="menu_txt">
					<text class="title">{{ billObj.Address }}</text>
					<text class="title">{{ billObj.LinkMan + ' ' + billObj.Mobile }}</text>
					<text class="title sub_txt">{{ billObj.Remark }}</text>
				</view>
			</view>
		</view>
		<view class="center">
			<scroll-view scroll-y="true" style="width: 100%; height: 100%;">
				<view class="uni-list">
					<view class="uni-list-cell" v-for="(value,key) in billObj.Items" :key="key">
						<view class="uni-media-list">
							<!-- <view class="uni-media-list-logo">
								<image v-if="showImg" mode="aspectFit" @error="imageError" :src="value.img"></image>
							</view> -->
							<view class="uni-media-list-body">
								<view>
									<view class="uni-media-list-text-top">{{value.ProductName}}</view>
									<view class="uni-media-list-text-top sub_txt">计量单位: {{value.UnitName}} &nbsp; &nbsp; 数量: {{value.Qty}}件</view>
									<view class="uni-media-list-text-top sub_txt">商品编号: {{value.ProductCode}}</view>
									<view class="uni-media-list-text-top sub_txt">商品备注: {{value.Remark}}</view>
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
							<text class="item-content"><text class="price">￥{{billObj.Amount}}</text></text>
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
					<block v-if="billObj.State === 1 || billObj.State === 2">
						<view class="uni-list-cell">
							<view class="uni-list-cell-navigate">
								<text class="item-title"><text>货运信息</text></text>
								<text class="item-content"><text>{{billObj.FreightInfo}}</text></text>
							</view>
						</view>
					</block>
					<block v-if="billObj.State === 4 || billObj.State === 5 || billObj.State === 6">
						<view class="uni-list-cell">
							<view class="uni-list-cell-navigate">
								<text class="item-title"><text>退货货运信息</text></text>
								<text class="item-content"><text>{{billObj.ReturnFreightInfo}}</text></text>
							</view>
						</view>
						<view class="uni-list-cell">
							<view class="uni-list-cell-navigate">
								<text class="item-title"><text>退货原因</text></text>
								<text class="item-content"><text>{{billObj.ReturnReason}}</text></text>
							</view>
						</view>
					</block>
				</view>
				<view class="empty"></view>
			</scroll-view>
		</view>
		<view class="result">
			<!-- 填写的订单 -->
			<block v-if="orderType === 'my'">
				<button class="btn" v-if="billObj.State === 0" @click="bindClose">关闭</button>
				<button class="btn" v-if="billObj.State === 1" type="warn" @click="bindConfirmReceive">确认收货</button>
				<button class="btn" v-if="isReturn && billObj.State === 1" type="warn" @click="bindReturn">退货</button>
				<button class="btn" v-if="billObj.State === 4" type="warn" @click="bindCancelReturn">取消退货</button>
				<button class="btn" v-if="billObj.State === 5 && billObj.IsPay" type="warn" @click="bindConfirmReturn">确认退款</button>
			</block>

			<!-- 收到的订单 -->
			<block v-else>
				<button class="btn" type="warn" v-if="billObj.State === 0" @click="bindSend">发货</button>
				<button class="btn" type="warn" v-if="billObj.State === 4" @click="bindReturnConfirm">确认退货</button>
			</block>
		</view>

		<uni-popup ref="popup" type="bottom">
			<!-- 我收到的订单 发货 -->
			<!--对于付款的订单，需要弹出窗口，显示付款方式、付款方账户信息、收款方账户信息，付款金额(等于订单金额)，确认收款和取消按钮。
		        必须确认收款才能发货。
				{
				    "OrderId" : "" /*订单Id [String]*/,
				    "DiliveryInfo" : {
					    "Adress": ""  /*收货地址*/,
					    "LinkMan": ""  /*联系人*/,
					    "Mobile": ""  /*手机号*/,
					    "TransportCompany": ""  /*货运公司*/,
					    "TrackingNo": ""  /*运单号*/
				    } /*货运信息 [DiliveryInfo]*/
				}
			-->
			<view class="pop">
				<button class="uni-icon uni-icon-closeempty close_btn" @click="closePopup"></button>
				<view class="con" style="padding: 30px 0 0; min-height: 100px;">
					<view class="input-group">
						<view class="input-row border">
							<text class="title">收货联系人：</text>
							<input-box ref="linkManSend" type="text" class="input-box" :clearShow="false" disabled v-model="billObj.LinkMan"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">收货人手机号：</text>
							<input-box ref="mobileSend" type="text" class="input-box" :clearShow="false" disabled v-model="billObj.Mobile"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">收货地址：</text>
							<input-box ref="addressSend" type="text" class="input-box" :clearShow="false" disabled v-model="billObj.Address"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">货运单号：</text>
							<input-box ref="trackingNo" type="text" :verification="['isNull']" :verificationTip="['货运单号不能为空']" class="input-box" clearable focus v-model="trackingNo" placeholder="请输入货运单号"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">快递公司：</text>
							<input-box ref="transportCompany" type="text" class="input-box" clearable focus v-model="transportCompany" placeholder="请输入货运公司"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">退货的联系人：</text>
							<input-box ref="linkManReturn" type="text" class="input-box" v-model="addr.PersonName" placeholder="请输入联系人"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">退货的手机号：</text>
							<input-box ref="mobileReturn" type="number" class="input-box" v-model="addr.Mobile" placeholder="请输入手机号"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">退货的收货地址：</text>
							<view class="uni-list-cell-navigate uni-navigate-right" @click="selectAddr">{{addr.Address}}</view>
						</view>
						<block v-if="billObj.IsPay">
							<view class="input-row border">
								<text class="title">付款方式：</text>
								<input-box type="text" class="input-box" :clearShow="false" disabled :inputValue="['现金', '银行转账', '支付宝', '微信'][billObj.PayType]"></input-box>
							</view>
							<view class="input-row border">
								<text class="title">付款方账户信息：</text>
								<input-box type="text" class="input-box" :clearShow="false" disabled :inputValue="billObj.PayAccountInfo"></input-box>
							</view>
							<view class="input-row border">
								<text class="title">收款方账户信息：</text>
								<input-box type="text" class="input-box" :clearShow="false" disabled :inputValue="billObj.ReceiveAccountInfo"></input-box>
							</view>
							<view class="input-row border">
								<text class="title">付款金额：</text>
								<input-box type="text" class="input-box" :clearShow="false" disabled :inputValue="billObj.Amount"></input-box>
							</view>
						</block>
					</view>
				</view>
				<button type="warn" v-if="!billObj.IsPay" @click="closePopup('confirm')">确定</button>
				<view class="btn_group" v-else>
					<button type="warn" @click="closePopup('receiveConfirm')">确认收款</button>
					<button @click="closePopup()">取消</button>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popup2" type="bottom">
			<!-- 我收到的订单 退货确认 -->
			<!-- 如果是在订单上付款IsPay，这在退货确认时，需要弹出窗口录入退款信息。
		        包括是否退款（勾选）IsPayReturn，收款方信息(使用订单的付款账户信息，只读)、付款方信息(使用订单的收款方账户信息，只读)，退款金额(订单金额，只读)。
				未勾选是否退款，不能点击确定
				{
					"OrderId" : "" /*订单Id [String]*/,
				    "PayReturn" : false /*是否退款 [Boolean]*/
				}
			 -->
			<view class="pop">
				<button class="uni-icon uni-icon-closeempty close_btn" @click="closePopup2"></button>
				<view class="con" style="padding: 30px 0 0; min-height: 100px;">
					<view class="input-group">
						<view class="input-row border">
							<text class="title">退货货运信息：</text>
							<input-box ref="trackingNo2" type="text" class="input-box" :clearShow="false" v-model="billObj.FreightInfo" disabled></input-box>
						</view>
						<view class="input-row border">
							<text class="title">退货原因：</text>
							<textarea v-model="billObj.ReturnReason" class="text_area" disabled />
						</view>
						<block v-if="billObj.IsPay">
							<view class="input-row border">
								<text class="title">是否退款：</text>
								<radio @tap="onIsPayReturnChange" color="#f23030" :value="billObj.IsPayReturn ? 'true' : 'false'" :checked="billObj.IsPayReturn" />
							</view>
							<view class="input-row border">
								<text class="title">收款方账户信息：</text>
								<input-box type="text" class="input-box" :clearShow="false" disabled :inputValue="billObj.PayAccountInfo"></input-box>
							</view>
							<view class="input-row border">
								<text class="title">付款方账户信息：</text>
								<input-box type="text" class="input-box" :clearShow="false" disabled :inputValue="billObj.ReceiveAccountInfo"></input-box>
							</view>
							<view class="input-row border">
								<text class="title">退款金额：</text>
								<input-box type="text" class="input-box" :clearShow="false" disabled :inputValue="billObj.Amount"></input-box>
							</view>
						</block>
					</view>
				</view>
				<!-- 如果是在订单上付款，这在退货确认时，需要弹出窗口录入退款信息。未选中是否退款，不能点击确定 -->
				<button type="warn" :disabled="billObj.IsPay && !billObj.IsPayReturn" @click="closePopup2('confirm')">确定</button>
			</view>
		</uni-popup>
		<uni-popup ref="popup3" type="bottom">
			<!-- 我的订单 退货-->
			<!--
				{
					  "OrderId" : "" /*订单Id [String]*/,
					  "DiliveryInfo" : {
					  "Adress": ""  /*收货地址*/,
					  "LinkMan": ""  /*联系人*/,
					  "Mobile": ""  /*手机号*/,
					  "TransportCompany": ""  /*货运公司*/,
					  "TrackingNo": ""  /*运单号*/
					  } /*货运信息 [DiliveryInfo]*/,
					  "Reson" : "" /*退货原因 [String]*/
				  }
			-->
			<view class="pop">
				<button class="uni-icon uni-icon-closeempty close_btn" @click="closePopup3"></button>
				<view class="con" style="padding: 30px 0 0; min-height: 100px;">
					<view class="input-group">
						<!-- <view class="input-row border">
							<text class="title">退货货运信息：</text>
							<input-box ref="freightInfo" type="text" class="input-box" :clearShow="false" clearable focus v-model="billObj.FreightInfo" placeholder=""></input-box>
						</view> -->
						<view class="input-row border">
							<text class="title">退货货运公司：</text>
							<input-box ref="company" type="text" class="input-box" clearable v-model="company" placeholder="请输入退货货运公司"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">退货运单号：</text>
							<input-box ref="trackingNo3" type="text" class="input-box" :verification="['isNull']" :verificationTip="['运单号不能为空']" clearable  v-model="trackingNo3" placeholder="请输入退货运单号"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">联系人：</text>
							<input-box ref="linkMan" type="text" class="input-box" clearable v-model="addr.PersonName" placeholder="请输入退货联系人"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">手机号：</text>
							<input-box ref="mobile" type="number" class="input-box" clearable v-model="addr.Mobile" placeholder="请输入退货人手机号"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">收货地址：</text>
							<input-box ref="addr" type="text" class="input-box" :clearShow="false" disabled clearable v-model="addr.Address" placeholder="请输入收货地址" @click="selectAddr"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">退货原因：</text>
							<textarea v-model="billObj.ReturnReason" class="text_area" placeholder="请输入退货原因"/>
						</view>
					</view>
				</view>
				<button type="warn" @click="closePopup3('confirm')">确定</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			inputBox, uniPopup
		},
		computed: mapState(['openid', 'userInfo']),
		data() {
			return {
				bg: util.getImgUrl() + '/static/images/cargo.png',
				orderType: '',
				isReturn: false, // 是否可以退货
				trackingNo: '', // 发货单号
				trackingNo2: '', // 退货确认单号
				trackingNo3: '', // 退货单号
				transportCompany: '', // 货运公司
				addr: {
					PersonName: '',
					Mobile: '',
					Address: ''
				},
				company: '', // 退货货运公司
				billObj: {
					"Items": [
						// {
						// 	ProductCode: "sdfdsf",
						// 	ProductName: "sdfdsf",
						// 	Spec: "sdfdsf",
						// 	UnitName: "sdfdsf",
						// 	Qty: 5,
						// 	Price: 20,
						// 	Amount: 100
						// },
						// {
						// 	ProductCode: "sdfdsf",
						// 	ProductName: "sdfdsf",
						// 	Spec: "sdfdsf",
						// 	UnitName: "sdfdsf",
						// 	Qty: 5,
						// 	Price: 20,
						// 	Amount: 100
						// },
						// {
						// 	ProductCode: "sdfdsf",
						// 	ProductName: "sdfdsf",
						// 	Spec: "sdfdsf",
						// 	UnitName: "sdfdsf",
						// 	Qty: 5,
						// 	Price: 20,
						// 	Amount: 100
						// },
						// {
						// 	ProductCode: "sdfdsf",
						// 	ProductName: "sdfdsf",
						// 	Spec: "sdfdsf",
						// 	UnitName: "sdfdsf",
						// 	Qty: 5,
						// 	Price: 20,
						// 	Amount: 100
						// }
					]  /*订单明细*/,
					"RecordId": ""  /*单据Id*/,
					"BillCode": ""  /*单据编号*/,
					"BillDate": "2019-09-17T17:07:55.3032242+08:00"  /*单据日期*/,
					"DealerId": ""  /*订货分销商Id*/,
					"DealerCode": ""  /*订货分销商编号*/,
					"DealerName": ""  /*订货分销商姓名*/,
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
					"DealerIdSend": ""  /*发货分销商Id*/,
					"DealerCodeSend": ""  /*发货分销商编号*/,
					"DealerNameSend": ""  /*发货分销商姓名*/,
					"FreightInfo": ""  /*发货货运信息*/,
					"TimeStamp": ""  /*时间戳*/,
					"State": 1  /*单据状态*/,
					"ChangeType": 0,
					"IdValues": [
					  ""
					],
					"iState": 1
				},
				showImg: false,
				orderLs: [],
				freight: 212,
				orderNo: '2019073000000002',
				createOrder: '2019-07-30 10:59:03'
			}
		},
		onLoad(option) {
			util.showLoading();
			if (option.hasOwnProperty('id')){
				if (option.hasOwnProperty('type')){
					this.orderType = option.type;
				}
				let id = option.id;
				this.init(id)
			} else {
				this.billObj.billDateStr = util.formatDate(this.billObj.BillDate, 'yyyy-MM-dd');
				this.getIsReturn();
			}
		},
		mounted() {
			// this.$refs.popup3.open();
		},
		watch: {
			addr(oldVal, newVal) {
				console.log('addr');
				console.log(newVal);
				// 退货 收货人
				if(this.$refs.linkManReturn) {
					this.$refs.linkManReturn.setValue(this.addr.PersonName);
				}
				if(this.$refs.mobileReturn) {
					this.$refs.mobileReturn.setValue(this.addr.Mobile);
				}
				
				if(this.$refs.linkMan) {
					this.$refs.linkMan.setValue(this.addr.PersonName);
				}
				if(this.$refs.mobile) {
					this.$refs.mobile.setValue(this.addr.Mobile);
				}
				if(this.$refs.addr) {
					this.$refs.addr.setValue(this.addr.Address);
				}
			}
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
					this.billObj.billDateStr = util.formatDate(this.billObj.BillDate, 'yyyy-MM-dd');
					this.billObj.stateStr = ['已关闭', '未发货', '已发货', '已收货确认', '', '退货中', '退货确认'][this.billObj.State + 1];
					this.getIsReturn();
				});
			},
			getIsReturn() {
				// 是否可以退货
				util.ajax({
					method: 'Businese.OrderDAL.CanReturn',
					params: {
						OrderId: this.billObj.RecordId
					},
					tags: {
						usertoken: this.openid
					}
				}).then(resReturn => {
					util.hideLoading();
					this.isReturn = resReturn.data.result;
				});
			},
			bindClose() {
				// 关闭
				let me = this;
				util.dialog({
					content: '确定要关闭吗？',
					success (e) {
						if(e.confirm) {
							util.showLoading();
							util.ajax({
								method: 'Businese.OrderDAL.Close',
								params: {
									"OrderId" : me.billObj.RecordId /*订单Id [String]*/
								},
								tags: {
									usertoken: me.openid
								}
							}).then(res => {
								util.hideLoading();
								util.showToast({
									title: '关闭成功',
									success() {
										uni.navigateBack();
									}
								});
							});
						}
					}
				});
			},
			async bindSend(index) {
				// 发货
				// 先获取默认地址
				util.showLoading();
				this.$refs.popup.open();
				this.billObj.Amount = String(this.billObj.Amount);
				await this.getDefaultAddr();
				// 收货人
				if(this.$refs.linkManSend) {
					this.$refs.linkManSend.setValue(this.billObj.LinkMan);
				}
				if(this.$refs.mobileSend) {
					this.$refs.mobileSend.setValue(this.billObj.Mobile);
				}
				if(this.$refs.addressSend) {
					this.$refs.addressSend.setValue(this.billObj.Address);
				}
				// 退货 收货人
				if(this.$refs.linkManReturn) {
					this.$refs.linkManReturn.setValue(this.addr.PersonName);
				}
				if(this.$refs.mobileReturn) {
					this.$refs.mobileReturn.setValue(this.addr.Mobile);
				}
			},
			sendOrder() {
				// 发货
				util.ajax({
					method: 'Businese.OrderDAL.Send',
					params: {
						"OrderId" : this.billObj.RecordId /*订单Id [String]*/,
						"DiliveryInfo" : {
							"Adress": ''  /*收货地址*/,
							"LinkMan": ''  /*联系人*/,
							"Mobile": ''  /*手机号*/,
							"TransportCompany": this.transportCompany  /*货运公司*/,
							"TrackingNo": this.trackingNo  /*运单号*/
						} /*货运信息 [DiliveryInfo]*/,
						ReturnLinkInfo: { // 退货的收货人信息(必须填地址、收货人和电话)
							"Adress":  this.addr.Address /*收货地址*/,
							"LinkMan": this.addr.PersonName  /*联系人*/,
							"Mobile": this.addr.Mobile  /*手机号*/,
							"TransportCompany": ''  /*货运公司*/,
							"TrackingNo": ''  /*运单号*/
						}
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					util.showToast({
						title: '发货成功',
						success() {
							uni.navigateBack();
						}
					});
				});
			},
			closePopup(str){
				let me = this;
				// 对于付款的订单，需要弹出窗口，显示付款方式、付款方账户信息、收款方账户信息，付款金额(等于订单金额)，确认收款和取消按钮。必须确认收款才能发货。
				if (str === 'confirm') {
					// 发货点击确定
					if (this.$refs.trackingNo.getValue() && this.$refs.transportCompany.getValue()) {
						this.$refs.popup.close();
						util.dialog({
							content: '确定发货吗？',
							success (e) {
								if(e.confirm) {
									util.showLoading();
									me.sendOrder();
								}
							}
						});
					}
				} else if (str === 'receiveConfirm') {
					// 发货弹窗确认收款
					if (this.billObj.DiliveryMode !== 1) {
						if (!(this.$refs.trackingNo.getValue() && this.$refs.transportCompany.getValue())) {
							return;
						}
					}
					this.$refs.popup.close();
					util.dialog({
						content: '请确认收款？',
						success (e) {
							if(e.confirm) {
								util.showLoading();
								me.sendOrder();
							}
						}
					});
				} else {
					this.$refs.popup.close();
				}
			},
			bindConfirmReceive() {
				let me = this;
				util.dialog({
					content: '确定要收货确认吗？',
					success (e) {
						if(e.confirm) {
							// 收货确认
							util.showLoading();
							util.ajax({
								method: 'Businese.OrderDAL.ReceiveConfirm',
								params: {
									"OrderId" : me.billObj.RecordId /*订单Id [String]*/
								},
								tags: {
									usertoken: me.openid
								}
							}).then(res => {
								util.hideLoading();
								util.showToast({
									title: '收货确认成功',
									success() {
										uni.navigateBack();
									}
								});
							});
						}
					}
				});
			},
			bindReturnConfirm(index) {
				// 退货确认
				this.$refs.popup2.open();
				setTimeout(() => {
					if(this.$refs.trackingNo2) {
						this.$refs.trackingNo2.setValue(this.billObj.FreightInfo);
					}
				}, 500);
			},
			closePopup2(str){
				let me = this;
				let params = {
					"OrderId" : this.billObj.RecordId /*订单Id [String]*/,
					"PayReturn" : false /*是否退款 [Boolean]*/
				};
				if (this.billObj.IsPay) {
					params.PayReturn = this.billObj.IsPayReturn;
				}
				if (str === 'confirm') {
					// 退货点击确定
					this.$refs.popup2.close();
					util.showLoading();
					util.ajax({
						method: 'Businese.OrderDAL.ReturnConfirm',
						params: params,
						tags: {
							usertoken: this.openid
						}
					}).then(res => {
						util.hideLoading();
						util.showToast({
							title: '退货操作成功',
							success() {
								uni.navigateBack();
							}
						});
					});
				} else {
					this.$refs.popup2.close();
				}
			},
			bindCancelReturn() {
				// 撤销退货
				let me = this;
				util.dialog({
					content: '确定要关闭吗？',
					success (e) {
						if(e.confirm) {
							util.showLoading();
							util.ajax({
								method: 'Businese.OrderDAL.ReturnCancel',
								params: {
									"OrderId" : me.billObj.RecordId /*订单Id [String]*/
								},
								tags: {
									usertoken: me.openid
								}
							}).then(res => {
								util.hideLoading();
								util.showToast({
									title: '撤销退货成功',
									success() {
										uni.navigateBack();
									}
								});
							});
						}
					}
				});
			},
			bindConfirmReturn() {
				// 确认退款
				let me = this;
				util.dialog({
					content: '你确定收到退款了吗？',
					success (e) {
						if(e.confirm) {
							util.showLoading();
							util.ajax({
								method: 'Businese.OrderDAL.PayReturnConfirm',
								params: {
									"OrderId" : me.billObj.RecordId /*订单Id [String]*/
								},
								tags: {
									usertoken: me.openid
								}
							}).then(res => {
								util.hideLoading();
								util.showToast({
									title: '确认退款成功',
									success() {
										uni.navigateBack();
									}
								});
							});
						}
					}
				});
			},
			getDefaultAddr() {
				return util.ajax({
					method: 'Businese.OrderDAL.GetReturnLinkInfo',
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					this.addr.Address = res.data.result.Adress;
					this.addr.PersonName = res.data.result.LinkMan;
					this.addr.Mobile = res.data.result.Mobile;
				});
			},
			onIsPayReturnChange() {
				this.$set(this.billObj, 'IsPayReturn', this.billObj.IsPayReturn)
			},
			async bindReturn() {
				// 退货
				// 先获取默认地址
				util.showLoading();
				await this.getDefaultAddr();
				this.$refs.popup3.open();
				setTimeout(() => {
					if(this.$refs.linkMan) {
						this.$refs.linkMan.setValue(this.addr.PersonName);
					}
					if(this.$refs.mobile) {
						this.$refs.mobile.setValue(this.addr.Mobile);
					}
					if(this.$refs.addr) {
						this.$refs.addr.setValue(this.addr.Address);
					}
					// if(this.$refs.freightInfo) {
					// 	this.$refs.freightInfo.setValue(this.curSelected.FreightInfo);
					// }
				}, 500);
			},
			closePopup3(str){
				if (str === 'confirm') {
					// 退货点击确定
					if (this.$refs.trackingNo3.getValue()) {
						this.$refs.popup3.close();
						util.showLoading();
						util.ajax({
							method: 'Businese.OrderDAL.Return',
							params: {
								"OrderId" : this.billObj.RecordId /*订单Id [String]*/,
								"DiliveryInfo" : {
								  "Adress": this.addr.Address  /*收货地址*/,
								  "LinkMan": this.addr.PersonName  /*联系人*/,
								  "Mobile": this.addr.Mobile  /*手机号*/,
								  "TransportCompany": this.company  /*货运公司*/,
								  "TrackingNo": this.trackingNo3  /*运单号*/
								} /*货运信息 [DiliveryInfo]*/,
								"Reson" : this.billObj.ReturnReason /*退货原因 [String]*/
							},
							tags: {
								usertoken: this.openid
							}
						}).then(res => {
							util.hideLoading();
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
			selectAddr() {
				util.goUrl({
					url: '../addr/addr?mode=select'
				});
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
