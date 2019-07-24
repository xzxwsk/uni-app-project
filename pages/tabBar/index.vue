<template>
	<view>
		<view class="status_bar">
            <!-- 这里是状态栏 -->
        </view>
		<view class="uni-padding-wrap">
            <view class="page-section swiper">
                <view class="page-section-spacing">
                    <swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
                        <swiper-item>
                            <view class="swiper-item uni-bg-red">A</view>
                        </swiper-item>
                        <swiper-item>
                            <view class="swiper-item uni-bg-green">B</view>
                        </swiper-item>
                        <swiper-item>
                            <view class="swiper-item uni-bg-blue">C</view>
                        </swiper-item>
                    </swiper>
                </view>
            </view>
        </view>
		<view class="uni-padding-wrap uni-common-pb">
			<view class="index">
				<view v-html="sysInfo"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sysInfo: '',
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500
			}
		},
		onLoad() {
			this.getSystemInfo();
		},
		methods: {
			getSystemInfo() {
				let me = this;
				uni.getSystemInfo({
					success (res) {
						me.sysInfo = 'model: ' + res.model + '<br/>'
									+ 'pixelRatio: ' + res.pixelRatio + '<br/>'
									+ 'windowWidth: ' + res.windowWidth + '<br/>'
									+ 'windowHeight: ' + res.windowHeight + '<br/>'
									+ 'language: ' + res.language + '<br/>'
									+ 'version: ' + res.version + '<br/>'
									+ 'platform: ' + res.platform + '<br/>'
									+ 'SDKVersion: ' + res.SDKVersion + '<br/>'
									+ 'system: ' + res.system + '<br/>'
									+ 'statusBarHeight: ' + res.statusBarHeight;
					}
				})
			}
		}
	}
</script>
