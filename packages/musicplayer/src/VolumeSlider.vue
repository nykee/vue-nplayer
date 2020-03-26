<template>
    <div class="volume-slider-box">
        <i class="fa  volume-btn ctrlIcons "
           :class="{'fa-volume-off':isMute,'fa-volume-up':!isMute}"></i>
        <input type="range" name="range" id="range" max="100" min="0" step="1"
               v-model="volumeNum2" @change="setVolumeChange"
        class="volume-slider-range "/>
    </div>
</template>
<script>
    export default {
        props:['volumeNum'],
        data() {
            return {
                volumeNum2:this.volumeNum
            }
        },
        methods:{
            setVolumeChange(){
                this.$emit('volumeChange',this.volumeNum2);
//                console.log(this.volumeNum2)
            }
        },
        components: {},
        computed:{
            isMute(){
                /*音量为零返回计算属性isMute*/
                return Math.floor(this.volumeNum2) === 0
            },
        },
    }
</script>
<style>
    .volume-slider-box{
        display: flex;
    }
    .volume-slider-range{
        width: 4rem;
    }

</style>
