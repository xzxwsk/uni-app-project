<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title">单据编号：</text>
				<input-box ref="billCode" v-model="billObj.BillCode" disabled :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">单据日期：</text>
				<view class="date_picker_box">
					<customDatePicker class="date_picker"
						fields="day"
						:start="startDate"
						:end="endDate"
						:value="billObj.BillDate"
						@change="bindBillDateChange"
					></customDatePicker>
				</view>
			</view>
			<view class="input-row">
				<text class="title">单据状态：</text>
				<radio-group class="uni-flex" name="gender" @change="changeState">
					<label>
						<radio value="0" :checked="billObj.State === 0" color="#f23030" />申请</label>
					<label>
						<radio value="2" :checked="billObj.State === 2" color="#f23030" />已审核</label>
				</radio-group>
			</view>
			<view class="input-row">
				<text class="title">经销商编号：</text>
				<input-box ref="dealerCode" v-model="billObj.DealerCode" :verification="['isNull']" :verificationTip="['经销商编号为空']"
				 placeholder="经销商编号" @input="getNameOfCode"></input-box>
			</view>
			<view class="input-row">
				<text class="title">经销商姓名：</text>
				<input-box ref="dealerName" v-model="billObj.DealerName" placeholder="" disabled :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">处罚类别：</text>
				<radio-group class="uni-flex" name="gender" @change="changePenaliztionClass">
					<!-- penaliztionClass 处罚类别设置中维护的类别 -->
					<label v-for="(item, index) in penaliztionClass" :key="index">
						<radio :value="item.RecordId" :checked="item.RecordId === billObj.PenaliztionClassId" color="#f23030" />{{item.Name}}</label>
				</radio-group>
			</view>
			<view class="input-row">
				<text class="title">处罚说明：</text>
				<textarea style="padding: 10px 11px; height: 60px;" v-model="billObj.Description" placeholder="请输入处罚说明" />
			</view>
			<view class="input-row">
				<text class="title">备注：</text>
				<textarea style="padding: 10px 11px; height: 60px;" v-model="billObj.Remark" placeholder="请输入备注"/>
			</view>
		</view>
		<view class="result">
			<button class="btn" type="warn" @click="saveOrder">保存</button>
		</view>
	</view>
</template>

<script>
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	import customDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker';
	import util from '@/common/util.js';
	export default {
		components: {
			inputBox, customDatePicker
		},
		data() {
			return {
				penaliztionClass: [], // 处罚类别设置中维护的类别
				startDate: '2010-01-01',
				endDate: '2199-12-31',
				billObj: {
				  "RecordId": ""  /*单据Id*/,
				  "BillCode": ""  /*单据编号*/,
				  "BillDate": ""  /*单据日期*/,
				  "DealerId": ""  /*经销商Id*/,
				  "DealerCode": ""  /*经销商编号*/,
				  "DealerName": ""  /*经销商姓名*/,
				  "Remark": ""  /*备注*/,
				  "PenaliztionClassId": ""  /*处罚类别*/,
				  "Description": ""  /*处罚说明*/,
				  "State": 1  /*State*/,
				  "Creator": ""  /*录入人*/,
				  "CreatorName": ""  /*录入人姓名*/,
				  "CreateTime": ""  /*录入时间*/,
				  "LastModifier": ""  /*最后修改人*/,
				  "LastModifierName": ""  /*最后修改人姓名*/,
				  "LastModifyTime": ""  /*最后修改时间*/,
				  "Auditor": ""  /*审核人*/,
				  "AuditorName": ""  /*审核人姓名*/,
				  "AuditTime": ""  /*审核时间*/,
				  "StateChanged": false  /*状态是否发生过改变*/,
				  "TimeStamp": ""  /*时间戳*/,
				  "ChangeType": 0,
				  "IdValues": [
					""
				  ],
				  "iState": 1
				}
			}
		},
		onLoad(option) {
			console.log(option)
			if (option.hasOwnProperty('item')) {
				let item = JSON.parse(option.item);
				if (option.hasOwnProperty('detail')) {
					uni.setNavigationBarTitle({
						title: '查看处罚申请单'
					});
				} else {
					uni.setNavigationBarTitle({
						title: '编辑处罚申请单'
					});
				}
				this.edit(option);
			} else {
				this.init();
			}
		},
		methods: {
			init() {
				// 获取处罚类别
				util.ajax({
					method: 'Businese.BillPenalizationDAL.QueryAllPenalizationClass',
					tags: {
						usertoken: this.openid
					}
				})
				.then(res => {
					this.penaliztionClass = res.data.result.filter(item => {
						return item.State === 0;
					})
				});
				// 获取初始单据
				util.showLoading();
				util.ajax({
					method: 'Businese.BillPenalizationDAL.CreateDefault',
					tags: {
						usertoken: this.openid
					}
				})
				.then(res => {
					util.hideLoading();
					res.data.result = util.jsonReplace(res.data.result, 'null', '""');
					res.data.result.BillDate = util.formatDate(res.data.result.BillDate, 'yyyy-MM-dd');
					this.billObj = res.data.result;
					this.initDefault();
				})
			},
			initDefault() {
				let obj = this.billObj;
				this.$refs.billCode.setValue(obj.BillCode);
				this.$refs.dealerCode.setValue(obj.DealerCode);
				this.$refs.dealerName.setValue(obj.DealerName);
			},
			edit(obj) {
				for(let key in this.billObj) {
					this.billObj[key] = obj[key];
				}
				this.initDefault();
			},
			changeState(e) {
				// 状态 申请/已审核 默认申请
				let value = Number(e.target.value);
				console.log(value);
			},
			getNameOfCode(e) {
				// 通过经销商编号获取姓名
				util.ajax({
					method: 'SYS.DealerDAL.GetByCode',
					params: {
						Code: e
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					if (res.data.hasOwnProperty('result')) {
						this.billObj.DealerName = res.data.result.DealerName;
						this.$refs.dealerName.setValue(res.data.result.DealerName);
					} else {
						this.billObj.DealerName = '';
						this.$refs.dealerName.setValue('');
					}
				});
			},
			changePenaliztionClass(e) {
				// 处罚类别设置中维护的类别
				let value = e.target.value;
				console.log(value);
				this.billObj.PenaliztionClassId = value;
				let curPenaliztionClass = this.penaliztionClass.find(item => {
					return this.billObj.PenaliztionClassId === value;
				});
				this.billObj.PenaliztionClass = curPenaliztionClass.Name
			},
			bindBillDateChange(value) {
				this.billObj.BillDate = value;
			},
			saveOrder() {
				if(this.$refs.dealerCode.getValue()) {
					// 新增
					let title = '新增';
					let method = 'Businese.BillPenalizationDAL.Create';
					if (this.billObj.RecordId !== '') {
						// 编辑
						title = '修改';
						method = 'Businese.BillPenalizationDAL.Update'
					}
					util.showLoading();
					util.ajax({
						method: method,
						params: {
							Bill: this.billObj
						},
						tags: {
							usertoken: this.openid
						}
					}.then(res => {
						util.hideLoading();
						util.showToast({
							title: title + '处罚申请单成功',
							success() {
								setTimeout(() => {
									util.goUrl({
										url: '../user/punishOrder'
									});
								}, 1000);
							}
						});
					}));
				}
			}
		}
	}
</script>
