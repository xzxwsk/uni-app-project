<template>
	<view class="create_order">			
		<view class="uni-list-cell-navigate uni-navigate-right">
			<view class="menu_txt">
				<text class="title">{{ addr.PersonName + ' ' + addr.Mobile }}</text>
				<text class="title sub_txt" @click="selectAddr">{{ addr.Address }}</text>
			</view>
		</view>
		<scroll-view class="box" scroll-y :scroll-top="scrolltop">
			<view class="uni-list">
				<view class="uni-list-cell" v-for="(value,key) in billObj.Items" :key="key">
					<view class="uni-media-list">
						<!-- <view class="uni-media-list-logo">
							<image v-if="showImg" mode="aspectFit" @error="imageError" :src="value.img"></image>
						</view> -->
						<view class="uni-media-list-body">
							<view>
								<view class="uni-media-list-text-top">{{value.ProductName}}</view>
								<view class="uni-media-list-text-top sub_txt">计量单位: {{value.UnitName}}</view>
								<view class="uni-media-list-text-top sub_txt">数量: {{value.Qty}}件</view>
							</view>
							<view class="uni-media-list-text-bottom uni-ellipsis">单价：<text class="price">￥{{value.Price}}</text><text style="margin: 0 10px 0 0;">元</text> 共计：<text class="price">￥{{value.Amount}}</text>元</view>
							<view class="uni-media-list-text-bottom uni-ellipsis remark">备注：<textarea @blur="bindTextAreaBlurItem(key)" placeholder="请输入备注说明" v-model="value.Remark" auto-height /></view>
						</view>
					</view>
				</view>
			</view>
			<view class="uni-list count" style="margin-bottom: 0;">
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="item-title"><text>提货方式</text></text>
						<radio-group class="dilivery_mode" name="diliveryMode" @change="changeDiliveryMode">
							<label class="label"><radio value="0" :checked="billObj.DiliveryMode === 0" color="#f23030" />快递</label>
							<label class="label"><radio value="1" :checked="billObj.DiliveryMode === 1" color="#f23030" />自提</label>
						</radio-group>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="item-title"><text>订单编号</text></text>
						<text class="item-content"><text>{{billObj.BillCode}}</text></text>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="item-title"><text>订货日期</text></text>
						<text class="item-content"><text>{{billObj.BillDateStr}}</text></text>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="item-title"><text>商品金额</text></text>
						<text class="item-content"><text class="price">{{billObj.AdvanceTitle ? '本订单使用晋级后的单价' : '本订单使用未晋级的单价'}} <text style="font-size: 40rpx; vertical-align: bottom;">￥{{billObj.Amount}}</text></text></text>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="item-title"><text>备注</text></text>
						<textarea @blur="bindTextAreaBlur" placeholder="请输入备注说明" v-model="billObj.Remark" style="height: 25px; line-height: 25px;" />
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="item-title"><text>是否付款(不勾选表示使用帐户余额)</text></text>
						<radio @tap="onIsPayChange" color="#f23030" :value="billObj.IsPay ? 'true' : 'false'" :checked="billObj.IsPay" />
					</view>
				</view>
				<view class="uni-list-cell" v-if="billObj.IsPay">
					<view class="uni-list-cell-navigate">
						<text class="item-title"><text>是否使用积分抵扣(可用积分{{billObj.CanUseBonus}}分)</text></text>
						<radio @click="onIsBonus" color="#f23030" :value="billObj.IsBonus ? 'true' : 'false'" :checked="billObj.IsBonus" />
					</view>
				</view>
				<view class="input-row" v-if="billObj.ShowDeposit">
					<text class="title">合规金金额：</text>
					<input-box ref="depositRef" type="number" disabled :clearShow="false" :inputValue="billObj.DepositAmount ? String(billObj.DepositAmount) : '0'"></input-box>
				</view>
				<view class="uni-list-cell" v-if="billObj.IsPay && billObj.IsBonus">
					<view class="uni-list-cell-navigate">
						<text class="item-title"><text>实际抵扣积分</text></text>
						<input-box type="number" ref="FactUseBonus" placeholder="请输入实际抵扣积分" 
							v-model="billObj.FactUseBonus"
							@input="onBlurBonus"
						></input-box>
					</view>
				</view>
				<view class="uni-list-cell" v-if="billObj.IsPay">
					<view class="uni-list-cell-navigate">
						<text class="item-title"><text>实际支付金额</text></text>
						<text class="price" style="font-size: 40rpx;">{{actualAmount}}</text>
					</view>
				</view>
				<block v-if="billObj.IsPay">
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<text class="item-title"><text>付款方式</text></text>
							<radio-group class="pay_type" name="payType" @change="changeMoneyType">
								<label class="label"><radio value="3" :checked="billObj.PayType === 3" color="#f23030" />微信</label>
								<label class="label"><radio value="2" :checked="billObj.PayType === 2" color="#f23030" />支付宝</label>
								<label class="label"><radio value="1" :checked="billObj.PayType === 1" color="#f23030" />银行转账</label>
								<label class="label"><radio value="0" :checked="billObj.PayType === 0" color="#f23030" />现金</label>
							</radio-group>
						</view>
					</view>
					<block v-if="billObj.PayType === 1">
						<view class="uni-list-cell">
							<view class="uni-list-cell-navigate">
								<text class="item-title"><text>付款银行</text><text style="color: #f33;">*</text></text>
								<input-box v-model="billObj.PayBank" ref="PayBank" placeholder="请输入付款银行"></input-box>
							</view>
						</view>
						<view class="uni-list-cell">
							<view class="uni-list-cell-navigate">
								<text class="item-title"><text>付款户名</text><text style="color: #f33;">*</text></text>
								<input-box v-model="billObj.PayAccountName" ref="PayAccountName" placeholder="请输入付款方户名"></input-box>
							</view>
						</view>
					</block>
					<block v-if="billObj.PayType !== 0">
						<view class="uni-list-cell">
							<view class="uni-list-cell-navigate">
								<text class="item-title"><text>付款方账户</text><text style="color: #f33;">*</text></text>
								<input-box v-model="billObj.PayAccountNo" ref="PayAccountNo" :placeholder="placeholder"></input-box>
							</view>
						</view>
						<view class="uni-list-cell">
							<view class="uni-list-cell-navigate">
								<text class="item-title"><text>收款方账户</text></text>
								<text>{{billObj.ReceiveAccountInfo}}</text>
							</view>
						</view>
					</block>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<text class="item-title"><text>收款方联系方式</text></text>
							<text>{{billObj.ReceivorInfo}}</text>
						</view>
					</view>
					<view class="uni-list-cell" v-if="billObj.PayType === 2 || billObj.PayType === 3">
						<view class="uni-list-cell-navigate">
							<text class="item-title"><text>收款码</text></text>
							<image mode="aspectFit" class="uni-uploader__img" :src="qrcode" :data-src="qrcode" @tap="previewImage"></image>
						</view>
					</view>
				</block>
				<view class="input-row protocal_row_radio" style="flex-direction: column;" v-if="billObj.ShowDeposit">
					<view style="padding: 10px 0 0;">
						<text class="title"></text>
						<label @click="bindProtocal"><radio class="protocal" value="0" color="#f23030" :checked="protocal" />是否同意经销商约定书条款</label>
					</view>
					<view class="protocal_row">
						<label class="a protocal_a" style="display: block; padding: 0 0 5px;" @click="bindToProtocal">经销商约定书条款</label>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="result">
			<view class="count b"><!-- <text class="price">￥{{(count+freight).toFixed(2)}}</text> --></view>
			<button class="btn" type="warn" @click="goMyOrder">生成订单</button>
		</view>
	</view>
</template>

<script>
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			inputBox
		},
		computed: mapState(['openid', 'userInfo']),
		data() {
			return {
				addr: {
					PersonName: '',
					Mobile: '',
					Address: '请选择收获地址'
				},
				scrolltop: 0,
				showImg: false,
				placeholder: '请输入收款人微信账号',
				orderLs: [],
				qrcode: '',
				actualAmount: 0,
				protocal: false,
				billObj: {
					"Items": []  /*订单明细*/,
					"RecordId": ""  /*单据Id*/,
					"BillCode": ""  /*单据编号*/,
					"BillDate": "2020-02-07T19:04:14.174898+08:00"  /*单据日期*/,
					"DealerId": ""  /*订货分销商Id*/,
					"DealerCode": ""  /*订货分销商编号*/,
					"DealerName": ""  /*订货分销商姓名*/,
					"Remark": ""  /*备注*/,
					"Address": ""  /*收货地址*/,
					"LinkMan": ""  /*收货联系人*/,
					"Mobile": ""  /*收货联系电话*/,
					"Amount": 0.0  /*合计金额*/,
					"DepositAmount": 0.0 /*合规金金额*/,
					"ShowDeposit": false /*是否显示合规金*/,
					"Creator": ""  /*录入人*/,
					"CreatorName": ""  /*录入人姓名*/,
					"CreateTime": "2020-02-07T19:04:14.2061478+08:00"  /*录入时间*/,
					"LastModifier": ""  /*最后修改人*/,
					"LastModifierName": ""  /*最后修改人姓名*/,
					"LastModifyTime": "2020-02-07T19:04:14.2061478+08:00"  /*最后修改时间*/,
					"StateChanged": false  /*状态是否发生过改变*/,
					"DealerIdSend": ""  /*发货分销商Id*/,
					"DealerCodeSend": ""  /*发货分销商编号*/,
					"DealerNameSend": ""  /*发货分销商姓名*/,
					"FreightInfo": ""  /*发货货运信息*/,
					"ReturnTime": "2020-02-07T19:04:14.2061478+08:00"  /*退货发起时间*/,
					"ReturnReason": ""  /*退货原因*/,
					"ReturnFreightInfo": ""  /*退货货运信息*/,
					"ReturnConfirmTime": "2020-02-07T19:04:14.2061478+08:00"  /*退货确认时间*/,
					"SendTime": "2020-02-07T19:04:14.2061478+08:00"  /*发货时间*/,
					"ReceiveConfirmTime": "2020-02-07T19:04:14.2061478+08:00"  /*收货确认时间*/,
					"IsPay": false  /*是否付款*/,
					"IsPayReturn": false  /*是否退款*/,
					"PayType": 0  /*付款方式*/,
					"ReceiveAccountInfo": ""  /*收款方账户信息*/,
					"PayBank": ""  /*付款银行*/,
					"PayAccountNo": ""  /*付款账户*/,
					"PayAccountName": ""  /*付款户名*/,
					"PayAccountInfo": ""  /*付款方账户信息*/,
					"TimeStamp": ""  /*时间戳*/,
					"State": 1  /*单据状态*/,
					"LevelId": ""  /*当前订单满足的上级分销商等级*/,
					"ChangeType": 0,
					"IsBonus": true, // 是否积分抵扣
					"CanUseBonus": 0, // 可用积分
					"FactUseBonus": 0, // 实际抵扣积分
					"AdvanceTitle": 0, // 是否晋级
					"IdValues": [
					  ""
					],
					"iState": 1
				} /*订单 [Order]*/
			}
		},
		onLoad(option) {
			// 获取商品详情
			if (option.hasOwnProperty('obj')) {
				// 购物车进入结算
				this.orderLs = JSON.parse(option.obj);
				this.init();
			} else if (option.hasOwnProperty('id')) {
				// 商品详情进入结算
				this.init(option.id, option.num);
			}
		},
		methods: {
			async init(id, num) {
				util.showLoading();
				await this.getDefaultAddr();
				if(id) {
					// 商品详情进入结算
					await util.ajax({
						method: 'Businese.OrderDAL.CreateDefaultByProductId',
						params: {
							ProductIds: [id]
						},
						tags: {
							usertoken: this.openid
						}
					}).then(res => {
						util.hideLoading();
						let data = res.data.result;
						// 把输入的数量带入，并计划金额
						data.Items[0].Qty = num
						data.Items[0].Amount = parseInt(data.Items[0].Price * data.Items[0].Qty * 100) / 100
						data.Amount = data.Items[0].Amount
						this.actualAmount = data.Amount - data.FactUseBonus
						console.log('订单详情：', data);
						this.billObj = data;
					});
				} else {
					console.log('购买商品列表：', this.orderLs);
					// 生成默认订单
					let CartItemIds = this.orderLs.map(item => item.Id);
					await util.ajax({
						method: 'Businese.OrderDAL.CreateDefault',
						params: {
							CartItemIds
						},
						tags: {
							usertoken: this.openid
						}
					}).then(res => {
						util.hideLoading();
						let data = res.data.result;
						console.log('生成默认订单：', data);
						if (data.CanUseBonus > 0) {
							data.IsBonus = true
							if (data.Amount > data.CanUseBonus) {
								data.FactUseBonus = data.CanUseBonus
							} else {
								data.FactUseBonus = data.Amount
							}
						}
						this.actualAmount = data.Amount - data.FactUseBonus
						this.billObj = data;
						console.log('actualAmount: ', this.actualAmount, data.FactUseBonus, this.billObj.FactUseBonus)
					});
				}
				this.billObj.BillDateStr = util.formatDate(this.billObj.BillDate, 'yyyy-MM-dd');;
				setTimeout(() => {
					this.showImg = true;
				}, 400);
			},
			getDefaultAddr() {
				util.ajax({
					method: 'Basic.DealerAddressDAL.QueryList',
					params: {
						filter: {
							PageIndex: 1,
							PageSize: 20
						}
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					let addr = res.data.result.data.find(item => {
						return item.IsDefault;
					});
					if (addr) {
						this.addr = addr;
					}
				});
			},
			selectAddr() {
				util.goUrl({
					url: '../addr/addr?mode=select'
				});
			},
			async goMyOrder() {
				if (this.addr.PersonName === '' && this.addr.Mobile === '') {
					util.showToast({
						title: '请选择收货地址'
					});
					return;
				}
				console.log(this.addr);
				this.billObj.Address = this.addr.Address;
				this.billObj.LinkMan = this.addr.PersonName;
				this.billObj.Mobile = this.addr.Mobile;
				if (this.$refs.FactUseBonus) {
					this.billObj.FactUseBonus = this.$refs.FactUseBonus.getValue()
				} else {
					this.billObj.FactUseBonus = ''
				}
				const FactUseBonus = isNaN(Number(this.billObj.FactUseBonus)) ? 0 : Number(this.billObj.FactUseBonus)
				if (this.billObj.PayType === 1) {
					if (this.billObj.PayBank === '' || this.billObj.PayAccountName === '') {
						util.showToast({
							title: '请输入付款银行和付款户名'
						});
						return;
					}
				}
				if (this.billObj.PayType !== 0) {
					if (this.billObj.PayAccountNo === '') {
						util.showToast({
							title: '请输入付款账户'
						});
						return;
					}
				}
				if (FactUseBonus > this.billObj.CanUseBonus) {
					util.showToast({
						title: `您的可用积分为${this.billObj.CanUseBonus}, 抵扣金额不能大于可用积分`
					})
					return
				} else if (FactUseBonus > this.billObj.Amount) {
					// 如果金额大于可用积分(抵扣金额不能大于可用积分)
					util.showToast({
						title: `抵扣积分不能大于商品金额`
					})
					return
				}
				if (this.billObj.ShowDeposit) {
					// 如果 显示合规金，则必须勾选同意经销商约定书条款
					if (!this.protocal) {
						util.dialog({
							content: '请勾选同意经销商约定书条款',
						})
						return
					}
				}
				// 先验证
				const checkRes = await util.ajax({
					method: 'Businese.OrderDAL.CreateCheck',
					params: {
						order: {
							...this.billObj,
							FactUseBonus
						}
					}
				})
				const { data } = checkRes
				let me = this
				console.log('checkRes: ', data)
				if (data.result) {
					util.hideLoading();
					// 如果验证要显示信息，则提示，并点击确认后才提交
					util.dialog({
						content: data.result,
						success: e => {
							if (e.confirm) {
								me.saveFn(FactUseBonus)
							} else {
								console.log('不同意')
							}
						},
						fail: () => {
							console.log('不同意')
						}
					})
				} else {
					me.saveFn(FactUseBonus)
				}
			},
			saveFn(FactUseBonus) {
				// 生成订单
				util.showLoading();
				util.ajax({
					method: 'Businese.OrderDAL.Create',
					params: {
						Bill: {
							...this.billObj,
							FactUseBonus
						}
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					// util.goUrl({
					// 	url: './myOrder'
					// });
					util.showToast({
						title: '订单创建成功',
						success() {
							setTimeout(() => {
								util.goUrl({
									url: './myOrder'
								})
							}, 1000);
						}
					});
				}).finally(() => {
					util.hideLoading();
				})
			},
			async onIsPayChange(e){
				this.$set(this.billObj, 'IsPay', !this.billObj.IsPay);
				this.getDefaultPayInfo();
				
				if (this.billObj.CanUseBonus > 0) {
					this.billObj.IsBonus = true
				}
				this.$nextTick(() => {
					console.log('IsPay: ', this.billObj.IsPay)
					if (this.billObj.IsPay) {
						this.setFactUseBonus()
					}
					this.scrolltop = util.random(600, 1000);
				})
			},
			// 设置抵扣积分
			setFactUseBonus() {
				if (this.billObj.Amount > this.billObj.CanUseBonus) {
					this.billObj.FactUseBonus = this.billObj.CanUseBonus
				} else {
					this.billObj.FactUseBonus = this.billObj.Amount
				}
				this.actualAmount = this.billObj.Amount - this.billObj.FactUseBonus
				this.actualAmount = Math.max(this.actualAmount, 0)
				if (this.billObj.IsBonus) {
					this.$refs.FactUseBonus.setValue(this.billObj.FactUseBonus);
				}
			},
			// 是否使用积分抵扣
			onIsBonus(e) {
				this.$set(this.billObj, 'IsBonus', !this.billObj.IsBonus);
				this.$nextTick(() => {
					console.log(this.$refs.FactUseBonus, this.billObj.FactUseBonus)
					if (this.billObj.IsPay && this.billObj.IsBonus) {
						this.setFactUseBonus()
					} else {
						this.actualAmount = this.billObj.Amount
					}
					this.scrolltop = util.random(600, 1000);
				})
			},
			// 填写积分后
			onBlurBonus(e) {
				console.log('blurBouns: ', e, typeof e)
				const val = Number(e)
				this.FactUseBonus = val
				if (val > this.billObj.CanUseBonus) {
					util.showToast({
						title: `您的可用积分为${this.billObj.CanUseBonus}, 抵扣积分不能大于可用积分`
					})
				} else if (val > 0 && val > this.billObj.Amount) {
					util.showToast({
						title: `抵扣积分不能大于商品金额`
					})
				} else {
					this.actualAmount = this.billObj.Amount - this.billObj.FactUseBonus
				}
			},
			bindTextAreaBlurItem(e) {
				this.$set(this.billObj.Items[e], 'Remark', this.billObj.Items[e].Remark);
			},
			bindTextAreaBlur(e) {
				this.$set(this.billObj, 'Remark', this.billObj.Remark);
			},
			async changeMoneyType(e) {
				// 付款方式
				this.billObj.PayType = Number(e.target.value);
				if (e.target.value === '3') {
					this.placeholder = '请输入付款人微信账号';
				} else if (e.target.value === '2') {
					this.placeholder = '请输入付款人支付宝账号';
				} else if (e.target.value === '1') {
					this.placeholder = '请输入付款人银行账号';
				}
				
				await this.getDefaultPayInfo();
				this.$nextTick(() => {
					this.scrolltop = util.random(500, 1000);
				})
			},
			changeDiliveryMode(e) {
				// 提货方式
				this.billObj.DiliveryMode = Number(e.target.value);
			},
			getDefaultPayInfo() {
				// 生成默认支付信息
				if (this.billObj.IsPay) {
					util.showLoading();
					return util.ajax({
						method: 'Businese.OrderDAL.GetDefaultPayInfo',
						params: {
							PayType: this.billObj.PayType,
							DealerIdSend: this.billObj.DealerIdSend
						},
						tags: {
							usertoken: this.openid
						}
					}).then(res => {
						util.hideLoading();
						console.log('默认支付信息: ', res.data.result);
						// me.billObj.PayType = res.data.result.PayType === 0 ? res.data.result.PayType : (res.data.result.PayType || 1);
						// me.billObj.ReceiveAccountInfo = res.data.result.ReceiveAccountInfo || '';
						// me.billObj.PayBank = res.data.result.PayBank || '';
						// me.billObj.PayAccountNo = res.data.result.PayAccountNo || '';
						// me.billObj.PayAccountName = res.data.result.PayAccountName || '';
						this.billObj = util.extend(this.billObj, res.data.result);
						// this.$set(this.billObj, 'PayType', (res.data.result.PayType === 0 ? res.data.result.PayType : (res.data.result.PayType || 1)));
						this.$set(this.billObj, 'ReceiveAccountInfo', (res.data.result.ReceiveAccountInfo || ''));
						this.$set(this.billObj, 'ReceivorInfo', (res.data.result.ReceivorInfo || ''));
						this.$set(this.billObj, 'PayBank', (res.data.result.PayBank || ''));
						this.$set(this.billObj, 'FactUseBonus', (res.data.result.FactUseBonus || ''));
						if(res.data.result.PayBank) {
							this.$refs.PayBank.setValue(res.data.result.PayBank);
						}
						this.$set(this.billObj, 'PayAccountNo', (res.data.result.PayAccountNo || ''));
						if(res.data.result.PayAccountNo) {
							this.$refs.PayAccountNo.setValue(res.data.result.PayAccountNo);
						}
						this.$set(this.billObj, 'PayAccountName', (res.data.result.PayAccountName || ''));
						if(res.data.result.PayAccountName) {
							this.$refs.PayAccountName.setValue(res.data.result.PayAccountName);
						}
						// 是否显示合规金
						if (res.data.result.ShowDeposit) {
							this.$refs.depositRef.setValue(res.data.result.DepositAmount)
							// 实际付款金额 = 申请金额 + 合规金金额
							this.actualAmount = this.actualAmount + res.data.result.DepositAmount
						}
						this.qrcode = util.getBaseUrl() + 'files/downloadfile?filename=' + res.data.result.PayCodeFileName;
					})
				}
			},
			previewImage(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: 0,
					urls: [current]
				})
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>

<style scoped>
	/deep/.count .input-box-center-text{text-align: right;}
</style>