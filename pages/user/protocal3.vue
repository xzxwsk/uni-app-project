<template>
    <view style="padding: 30upx;">
		<view style="font-size: 18px; font-weight: bold; text-align: center;">奖励与福利制度</view>
		<view>1.奖励分为直推奖励、团体管理奖励、出国旅游。</view>
		<view>2.精英分销商及金钻总监享有直推奖励、团体管理奖励、出国旅游。</view>
		<view>3.直推奖励：</view>
		<view style="text-indent: 2em;">(1). 精英分销商(第一级)辅导一个新精英分销商(第二级），精英分销商(第一级)每盒(瓶)可会得5%奖励。</view>
		<view style="text-indent: 2em;">(2). 新精英分销商(第二级)辅导一个全新精英分销商(第三级)，精英分销商(第一级) 可获该全新精英分销商(第三级)得当月进货额的2.5%奖励。</view>
		<view style="text-indent: 2em;">(3). 当精英分销商(第一级)的跨级（第三……级）人员成为为新精英分销商，精英分销商(第一级) 可获得该新精英分销商当月进货额的5%奖励，另外则需提拨5%奖励的50%作为第三……级以外的上级创新分销商以下级别推荐奖励(一次性)。当第三……级以外的上级也成为为精英分销商时，奖励恢复原有奖励。</view>
		<view>※直推奖励计算以提货后金额计算，不以未提货金额计算。</view>
		<view>※计算时间为隔月最后一天00:00-02:00计算，奖励结算后，各有领取奖励分销商需在10日之前开立发票提交至金钻总监(发货中心)申请奖励，计算过后15日发放。</view>
		<view>4.直推奖励由精英分销商直接供货商金钻总监(发货中心)发放奖励(奖励播放为金钻总监播出)。</view>
		<view style="margin: 10px 0 0; font-size: 18px; font-weight: bold; text-align: center;">发货中心(金钻总监)</view>
		<view>1.直推奖金：</view>
		<view style="text-indent: 2em;">(1). 金钻总监 (第一级)辅导一个新金钻总监 (第二级)，金钻总监 (第一级) 可获得该新金钻总监(第二级)当月进货额的4%奖励。</view>
		<view style="text-indent: 2em;">(2). 新金钻总监 (第二级)辅导一个全新金钻总监 (第三级)，金钻总监 (第一级) 可获得该全新金钻总监(第三级)当月进货额的2%奖励。</view>
		<view style="text-indent: 2em;">(3). 当金钻总监 (第一级)的跨级（第三级）人员成为新金钻总监，金钻总监 (第一级) 可获得该新金钻总监(第三级)当月进货额的4%奖励，当第二级也成为为金钻总监时，奖励恢复原有奖励。</view>
		<view style="text-indent: 2em;">(4). 当金钻总监的跨级（第三级）人员成为新金钻总监，第二级为精英分销商，依然享受第三级团体管理奖励。</view>
		<view>※直推奖励计算以提货后金额计算，不以未提货金额计算。</view>
		<view>※计算时间为隔月最后一天00:00-02:00计算，计算过后，金钻总监需在10日之内开立发票向公司申请奖励，公司收到发票后，15日后发放。</view>
		<view style="margin: 10px 0 0; font-size: 18px; font-weight: bold; text-align: center;">团体管理奖励与出国旅游</view>
		<view>1.团对管理奖励表：</view>
		<view><image style="width: 680upx;" mode="widthFix" :src="img1Src" /></view>
		<view>2.成为精英分销商及金钻总监即可享受团体管理奖励。</view>
		<view>3.精英分销商及金钻总监的团体管理奖励，扣除下级应发放的团体管理奖励后，其馀奖金为该分销商奖励。</view>
		<view>※团体管理奖励计算以提货后金额计算，不以未提货金额计算。</view>
		<view>※计算时间为隔月最后一天00:00-02:00计算，计算过后，金钻总监需在10日之内开发票向公司申请奖金，公司收到发票后，15日后发放。</view>
		<view>4.出国旅游：</view>
		<view style="text-indent: 2em;">(1).金钻总监每季度三个月内累计60个精英分销商进货额(30,000) 即可获得公司招待出国旅游。</view>
		<view style="text-indent: 2em;">(2).精英分销商每季度三个月内个人出货满4次进货额(4次36,000元进货)即可获得公司招待出国旅游。</view>
		<view style="text-indent: 2em;"> (3).精英分销商及金钻总监按出国旅游规则，多1个倍数多一位名额，以此类推。</view>
		<view style="margin: 10px 0 0; font-size: 18px; font-weight: bold; text-align: center;">金钻/精英分销商重要补充</view>
		<view><image style="width: 680upx;" mode="widthFix" :src="img2Src" /></view>
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
