<template>
    <view style="padding: 30upx;">
		<view style="font-size: 18px; font-weight: bold; text-align: center;">分销商约定书</view>
		<view>甲方：郑州纤畅生物科技有限公司</view>
		<view>乙方：郑州纤畅生物科技有限公司</view>
		<view>1.乙方提交付款单后，依其取得优惠价格，分次提交订单提货，货品售出后不接受退、换货。</view>
		<view>2.帐户积分可抵扣货款或申请反现，提出反现申请后，按国家所得税规定扣除税金后，24小时以内汇款至代理商资料中指定帐户。</view>
		<view>3.在本约定书勾选同意后, 若欲终止经销权,按以下方式处理：</view>
		<view style="text-indent: 2em;">(1). 乙方若已有复购次数的：合规金没收，乙方可申请退还未出货金额。</view>
		<view style="text-indent: 2em;">(2). 乙方若未达成复购：合规金没收，乙方可申请退还未出货部份金额，但须依照实际出货对应晋升精英代理商之前级别，按该级别计算已提货金额，扣除差额后余额退还。</view>
		<view style="margin: 10px 0 0; font-size: 18px; font-weight: bold;">本人同意以上约定书之条款，并且履行本约定书之规定。</view>
    </view>
</template>

<script>
	import util from '@/common/util.js';
    export default {
        data() {
            return {
				img1Src: util.getImgUrl() + 'static/images/protocal_img1.jpg',
				img2Src: util.getImgUrl() + 'static/images/protocal_img2.png'
            }
        },
		onNavigationBarButtonTap(e) {
			// #ifdef APP-PLUS
			
			// #endif 
		},
        methods: {
			
        }
    }
</script>
