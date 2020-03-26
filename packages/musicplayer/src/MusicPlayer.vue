<template>
    <div >
        <!--正常模式播放器-->
        <keep-alive>
            <div v-if="!isMini" :class="{'msc-player-box':!isToggle,'msc-player-hide':isToggle}"
                 style="top:84%;"
                 ref="mPlayer">
                <div class="clearfix position-relative">
                    <div id="msc-player" class="row-flex-center-middle mPlayer-main-board fl" >
                        <div  class="mPlayer-main-board-block playCtrl col-span-6">
                            <i class="fa  fa-2x playBtn ctrlIcons"
                               :class="{'fa-pause':playStatus==='playing',
               'fa-play':playStatus==='paused'}" @click="changePlayStatus"></i>
                            <i class="fa fa-step-backward ctrlIcons" @click="playPrev"></i>
                            <i class="fa fa-step-forward ctrlIcons" @click="playNext"></i>
                        </div>
                        <div  class="mPlayer-main-board-block col-span-9">
                            <ul>

                                <li class="mPlayer-song-name">
                                        {{currentSong.title}}
                                </li>

                                <li class="mPlayer-artist">
                                        {{currentSong.author}}
                                </li>
                            </ul>
                        </div>
                        <div  class="mPlayer-main-board-block col-span-7">
                            <img :src="currentSong.pic" alt="" class="mPlayer-album" :class="{'picSpin':playStatus==='playing'}">
                        </div>
                        <div  class="mPlayer-main-board-block col-span-2">
                            <ul>
                                <li @click="toggleSongListShow" class="ctrlIcons toggleListBtn">
                                    <i class="fa " :class="{'fa-toggle-up':!isSongListShow,'fa-toggle-down':isSongListShow}"></i>
                                </li>
                                <li @click="changePlayMode" class="ctrlIcons">
                                    <i class="fa " :class="{'fa-random':isRandom,'fa-reorder':!isRandom}"></i>
                                </li>
                                <li  class="ctrlIcons" @click="toggleMobileMini">
                                    <i class="fa fa-compress"></i>
                                </li>
                                <!--<li class="ctrlIcons" @click="toggleLyrics">-->
                                    <!--<i class="fa fa-newspaper-o"></i>-->
                                <!--</li>-->
                            </ul>
                        </div>
                    </div>
                    <div class="time-ctrl">
                        <ul class="clearfix d-flex" >
                            <li class="fl progress-bar" @click="handleProgressClick">

                                <div
                                     class="np-progress-bar np-progress np-progress-normal">
                                    <div  class="np-progress-outer">
                                        <div  class="np-progress-inner">
                                            <div  class="np-progress-bg"
                                                 :style="loadingBarStyle"></div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li class="fl timeDuration">
                                <span>{{cur_song_duration}}</span><span>/</span><span>{{cur_song_time_count}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="vol-ctrl" @mouseover="toggleVSlider" @mouseout="toggleVSlider">

                        <VolumeSlider :volumeNum="volumeNum" @volumeChange="handelVolumeChange"></VolumeSlider>
                        <!--<Slider v-model="volumeNum" :step="5" class="my-slider" v-if="isVolumeSliderShow"></Slider>-->
                    </div>
                    <div class="miniBtn-container" v-if="!isMobile">
                        <i class="fa   miniBtn ctrlIcons" :class="{'fa-chevron-left':!isToggle,'fa-chevron-right':isToggle}"
                           @click="toggleSide"></i>
                    </div>
                </div>
                <!--播放列表-->
                <keep-alive>
                    <div id="mPlayer-playlist" ref="mPlayerPlaylist" class="mPlayer-playlist" v-show="isSongListShow">

                        <div v-for="song in songLists" class="mPlayer-playlist-items row-flex-center-middle"
                             :key="song.index" @click="clickToPlay(song.index)">
                            <!--<div >-->
                                <div    class=" playlist-cur col-span-1 ta-left"     :class="{'curIdx':song.index === isPlayingIndex}"></div>
                                <div    class="playlist-index "    :class="{'playing-color':song.index === isPlayingIndex}">{{song.index}}</div>
                                <div   class=" playlist-songname col-span-10 ta-left" :class="{'playing-color':song.index === isPlayingIndex}">{{song.title}}</div>
                                <div   class=" playlist-artist col-span-10 ta-left"   :class="{'playing-color':song.index === isPlayingIndex}">{{song.author}}</div>
                            <!--</div>-->

                        </div>
                    </div>
                </keep-alive>
            </div>
        </keep-alive>

        <!--迷你播放器模式-->
        <keep-alive>
            <div id="mini-player" v-if="isMini" >

                <div class="mini-player-box"   draggable="true" ref="miniPlayer" @mousedown="move">
                    <i class="fa  fa-2x playBtn-mini ctrlIcons"
                       :class="{'fa-pause':playStatus==='playing',
               'fa-play':playStatus==='paused'}" @click="changePlayStatus"></i>
                    <i class="fa fa-expand toggle-mini-btn" @click="toggleMobileMini"></i>
                    <img :src="currentSong.pic" alt="" class="mPlayer-album-mini" :class="{'picSpin':playStatus==='playing'}"/>
                </div>
            </div>
        </keep-alive>


        <audio :src="currentSong.url" class="mscAudio"  ref="mscAudio">
            您的浏览器不支持 audio 标签。请使用Chrome,Firefox等现代浏览器
        </audio>
        <!--歌词组件-->
        <div class="lyric-box"   v-show="isLyricsShow">
            <div class="lyric-mask">
                <p class="lyric-items" >{{lyric}}</p>
            </div>
        </div>
        <!--<Lyrics ></Lyrics>-->
    </div>
</template>
<script >
    import VolumeSlider from './VolumeSlider.vue'

    export default  {
        name:'vueNplayer',
        props:['songLists'],
        data(){
            return{
            loadingBarStyle:{
                width:"0%",
                height:'5px'
            },
            isSongListShow:false, //播放列表显示标志位
            isToggle: true,         //播放器侧边显示标志位
//            songLists: [], //全部歌曲
            playStatus:  'paused', //播放状态
            currentSong:  {},      //当前播放歌曲
            isMobile :  false,     //是否为手机标志位
            isMini : true,      //是否为Mini标志位
            isPlayingIndex:1, //当前播放歌曲的索引
            volumeNum: 20,     //音量
            isVolumeSliderShow :  false, //音量条显示标志位
            isRandom :  false, //随机播放flag
            cur_song_duration: "00:00", //当前歌曲播放进度分秒
            cur_song_time_count: "00:00", //当前歌曲总分秒
            playPercent:0, //进度条百分比
            lyric:'',//传给歌词组件的歌词字符串
            lyrics:[],//歌词数组
            isLyricsShow : false,//歌词是否显示 
            }
        },

        
        methods:{
            handelVolumeChange(payload){
                this.volumeNum =payload;
            },
            toggleSongListShow(){
                /**
                 * @file: MusicPlayer.vue
                 * @method toggleSongListShow
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @return {type} argName - description
                 * @description: 播放列表显示标志位
                 * @author: admin
                 * @date: 2020/3/1
                 */
                this.isSongListShow = !this.isSongListShow;
            },
            changePlayMode() {
                /**
                 * @file: MusicPlayer.vue
                 * @method changePlayMode
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @return {type} argName - description
                 * @description: 切换播放模式
                 * @author: admin
                 * @date: 2020/3/1
                 */
                this.isRandom = !this.isRandom;
                let infoMsg = this.isRandom ?
                    "开启随机播放":
                    "开启列表播放".toString();
//            this.$Notice.info({
//                title: infoMsg
//            })
            },
            toggleSide() {
                /*播放器播放器侧边模式与正常模式*/
                this.isToggle = !this.isToggle;
            },
            toggleLyrics(){
                this.isLyricsShow = !this.isLyricsShow;
//            let info = this.isLyricsShow?"歌词显示开启":"歌词显示关闭";
//            this.$Message.info(info);
            },
            toggleMobileMini() {
                /**
                 * @file: MusicPlayer.vue
                 * @method toggleMobileMini
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @return {type} argName - description
                 * @description: 切换mini模式标志位
                 * @author: admin
                 * @date: 2020/3/1
                 */
                this.isMini = !this.isMini;
                this.isSongListShow = false;
                if(!this.isMini){

//                this.$Message.info("切换回正常播放器！");
                    this.$nextTick(()=>{
                        this.isToggle =false;
                    })


                }
                else {
//                this.$Message.info("切换至mini播放器！");
                    // this.toggleSide();
                }
            },
            changePlayStatus(){
                /**
                 * @file: MusicPlayer.vue
                 * @method changePlayStatus
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @return {type} argName - description
                 * @description: 点击播放/暂停按钮改变播放状态
                 * @author: admin
                 * @date: 2020/3/1
                 */

                (this.$refs.mscAudio ).setAttribute("autoplay", "autoplay");
                if (this.playStatus === "paused") {
                    this.playStatus = "playing";
                    this.getLyric();
                    (this.$refs.mscAudio ).play();
                    this.isPlayingIndex = (this.currentSong ).index;
//                this.$Message.info({content:"开始播放，ctrl+↑增加音量，ctrl+↓减小音量，ctrl+ ←切换上一首，ctrl+→切换下一首",duration:4})
                }
                else {
                    this.playStatus = "paused";
                    (this.$refs.mscAudio ).pause();
                }
            },
            playPrev() {
                /**
                 * @file: MusicPlayer.vue
                 * @method playPrev
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @return {type} argName - description
                 * @description:播放前一首
                 * @author: admin
                 * @date: 2020/3/1
                 */
                let idx = (this.currentSong ).index;
                let randIdx = this.getRdmIndex();
                if (this.isRandom) {
                    this.currentSong = this.songLists[randIdx - 1];
                    this.isPlayingIndex = randIdx;
                }
                else {
                    if (idx !== 1) {
                        idx -= 1;
                        this.currentSong = this.songLists[idx - 1];
                    }
                    this.isPlayingIndex = idx;

                }
                if(this.playStatus ==="paused"){
                    (this.$refs.mscAudio ).removeAttribute("autoplay")
                }
                this.getLyric();
                this.scrollPlayList();
            },
            playNext() {
                /**
                 * @file: MusicPlayer.vue
                 * @method playNext
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @return {type} argName - description
                 * @description:播放下一首
                 * @author: admin
                 * @date: 2020/3/1
                 */
                let idx = (this.currentSong ).index;
                let randIdx = this.getRdmIndex();
                if (this.isRandom) {
                    this.currentSong = this.songLists[randIdx - 1];
                }
                else {
                    if (idx === this.songLists.length) {
                        this.currentSong = this.songLists[0];
                    }
                    else {
                        this.currentSong = this.songLists[idx];
                    }
                }

                this.isPlayingIndex = (this.currentSong ).index;

                if(this.playStatus ==="paused"){
                    (this.$refs.mscAudio ).removeAttribute("autoplay")
                }
                this.getLyric();
                this.scrollPlayList();
            },
            parseLyric(text){
                /**
                 * @file: MusicPlayer.vue
                 * @method parseLyric
                 * @param {type} text - 歌词
                 * @description: 处理接口获取到的歌词
                 * @author: admin
                 * @date: 2020/3/3
                 */

                    //将文本分隔成一行一行，存入数组
                let lines = text.split('\n'),
                    //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
                    pattern = /\[\d{2}:\d{2}.\d{2}]/g,
                    //保存最终结果的数组
                    result = [];
                //去掉不含时间的行
                while (!pattern.test(lines[0])) {
                    lines = lines.slice(1);
                }
                //上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
                lines[lines.length - 1].length === 0 && lines.pop();
                lines.forEach(function(v /*数组元素值*/ , i /*元素索引*/ , a /*数组本身*/ ) {
                    //提取出时间[xx:xx.xx]
                    let time = v.match(pattern),
                        //提取歌词
                        value = v.replace(pattern, '');
                    //因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
                    time.forEach(function(v1, i1, a1) {
                        //去掉时间里的中括号得到xx:xx.xx
                        let t = v1.slice(1, -1).split(':');
                        //将结果压入最终数组
                        result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
                    });
                });
                //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
                result.sort(function(a, b) {
                    return a[0] - b[0];
                });
                return result;
            },

            showLyrics(){
                /**
                 * @file: MusicPlayer.vue
                 * @method showLyrics
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @return {type} argName - description
                 * @description: 根据h5media 的timeupdate事件进行歌词显示
                 * @author: admin
                 * @date: 2020/3/4
                 */
                (this.$refs.mscAudio ).addEventListener("timeupdate", (e) => {
                    for(let i=0,len = this.lyrics.length;i<len;i++){
                        if(e.target.currentTime /*当前播放的时间*/ > this.lyrics[i][0]){
                            this.lyric = this.lyrics[i][1];
                        }
                    }
                });
            },
            getRdmIndex(){
                /**
                 * @file: MusicPlayer.vue
                 * @method getRdmIndex
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @return {type} argName - description
                 * @description: 获取随机播放的随机数字
                 * @author: admin
                 * @date: 2020/3/4
                 */
                return Math.floor(Math.random() * (this.songLists.length - 1 + 1) + 1)
            },

            scrollPlayList(){
                /**
                 * @file: MusicPlayer.vue
                 * @method scrollPlayList
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @return {type} argName - description
                 * @description:
                 * @author: admin
                 * @date: 2020/3/2
                 */
                if(this.isSongListShow){
                    let scrollHeight = (this.$refs.mPlayerPlaylist ).scrollHeight;
                    let sc = ((this.isPlayingIndex - 1) / this.songLists.length);
                    (this.$refs.mPlayerPlaylist ).scrollTop = sc * scrollHeight;
                }

            },
            clickToPlay(index) {
                /**
                 * @file: MusicPlayer.vue
                 * @method clickToPlay
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @return {type} argName - description
                 * @description: 点击播放列表播放对应的歌曲
                 * @author: admin
                 * @date: 2020/3/1
                 */
                (this.$refs.mscAudio ).setAttribute("autoplay", "autoplay");
                this.currentSong = this.songLists[index - 1];
//          console.log(this.currentSong);
                this.getLyric();
                this.playStatus = "playing";
                (this.$refs.mscAudio ).play();
                this.isPlayingIndex = index;

            },
            toggleVSlider() {
                /*切换音量调整条 的显示*/
                this.isVolumeSliderShow = !this.isVolumeSliderShow
            },
            handleProgressClick(e){
                /**
                 * @file: MusicPlayer.vue
                 * @method handleProgressClick
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @return {type} argName - description
                 * @description: 点击进度条切换到相应的时间
                 * @author: admin
                 * @date: 2020/3/4
                 */
                /*快进功能*/
                e= event || window.event;
                //获得鼠标事件的clientX(相对dom元素的x轴坐标)
                let prog_x =e.clientX;
//                console.log(prog_x)
                //超出100按100取整
                prog_x = prog_x>=100? 100 :prog_x;
                this.playPercent =prog_x;
                this.loadingBarStyle = {
                    width:this.playPercent+'%',
                    height:'5px'
                };
                //设置auido元素的current为百分比乘以audio中的媒体元素的总时间
                (this.$refs.mscAudio ).currentTime = (this.$refs.mscAudio ).duration * this.playPercent/100
            },


            updateSongDuration(){
                /**
                 * @file: MusicPlayer.vue
                 * @method updateSongDuration
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @return {type} argName - description
                 * @description: 监听timeUpdate事件，更新界面上的时间，设计分秒转换
                 * @author: admin
                 * @date: 2020/3/4
                 */

                (this.$refs.mscAudio ).addEventListener("timeupdate", (e) => {

                    let currentTime = Math.floor(e.target.currentTime);
                    this.playPercent = Math.floor((currentTime / e.target.duration) * 100);
                    this.loadingBarStyle = {
                        width:this.playPercent+'%',
                        height:'5px'
                    };
                    let sec = "00",
                        min = "00",
                        colon = ":";
                    if (currentTime < 60) {
                        if (currentTime < 10) {
                            this.cur_song_duration = min + colon + "0" + currentTime;
                        }
                        else {
                            this.cur_song_duration = min + colon + currentTime;
                        }
                    }
                    else {
                        let _min = "0" + Math.floor(currentTime / 60);
                        let _sec = Math.floor(currentTime - 60 * Math.floor(currentTime / 60));
                        let secOutPut = Math.floor(_sec) < 10 ? ("0" + _sec) : _sec+"";
                        this.cur_song_duration = _min + colon + secOutPut;
                    }
                });
            },
            keyBoardEventListener(){
                /**
                 * @file: MusicPlayer.vue
                 * @method keyBoardEventListener
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @return {type} argName - description
                 * @description: 监听键盘事件，切歌
                 * @author: admin
                 * @date: 2020/3/4
                 */
                let self = this;
                document.onkeydown = function (e) {
                    let evn = e || event;
                    let key = evn.keyCode || evn.which || evn.charCode;
                    let ctrlKey =evn.ctrlKey || evn.metaKey;
                    /*ctrl+左箭头切换上一首*/
                    if(ctrlKey&& key ===37){
                        evn.preventDefault();
                        self.playPrev();
//                    self.$Notice.info({
//                        title: "切换上一首",
//                        desc:"当前:"+(self.currentSong ).author+"--"+(self.currentSong ).title
//                    })
                    }
                    /*ctrl+右箭头切换下一首*/
                    if(ctrlKey&& key ===39){
                        evn.preventDefault();
                        self.playNext();
//                    self.$Notice.info({
//                        title: "切换下一首",
//                        desc:"当前:"+(self.currentSong ).author+"--"+(self.currentSong ).title
//                    })
                    }
                    /*ctrl+上箭头增加音量*/
                    if(ctrlKey&& key ===38){
                        evn.preventDefault();
                        self.volumeNum+=10;
                        if(self.volumeNum>100){
                            self.volumeNum= 100;
                            return false }
//                    self.$Notice.info({
//                        title: "音量+10,当前音量："+self.volumeNum
//                    });
                    }
                    /*ctrl+下箭头减小音量*/
                    if(ctrlKey&& key ===40){
                        evn.preventDefault();
                        self.volumeNum-=10;
                        if(self.volumeNum<0){
                            self.volumeNum=0;
                            return 0 }
//                    self.$Notice.info({
//                        title: "音量-10,当前音量："+self.volumeNum
//                    })
                    }
                };
            },
            loadMetadataListener(){
                /**
                 * @file: MusicPlayer.vue
                 * @method loadMetadataListener
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @return {type} argName - description
                 * @description: 监听loadedmetadata事件，音频文件加载完成后获取duration，绑定到cur_song_time_count上
                 * @author: admin
                 * @date: 2020/3/4
                 */
                (this.$refs.mscAudio ).addEventListener("loadedmetadata", (e) => {
                    let min = Math.floor(e.target.duration / 60);
                    let sec = Math.floor(e.target.duration % 60);
                    let secOut = sec < 10 ? ("0" + sec) : sec+"";
                    let minOut = min < 10 ? ("0" + min) : min+"";
                    this.cur_song_time_count = minOut + ":" + secOut;
                });
            },
            setCurrentSong(){
               this.currentSong= this.songLists[0];

            },
            getLyric(){
                /**
                 * @file: MusicPlayer.vue
                 * @method getLyric
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @param {type} argName - description
                 * @return {type} argName - description
                 * @description: 获取歌词
                 * @author: admin
                 * @date: 2020/3/1
                 */
                let self = this;
                self.lyrics = [];
                self.lyric = '';
                let param = {
                    id :(self.currentSong ).id
                };
//          alert(self.currentSong.id)
//          (this ).$api.music.getLyric(param).then(res=>{
//              let result = res;
//              if(result.status === 200){
//                  let resLyric = result.data.lrc.lyric;
//                  if(!resLyric){
//                      (self ).lyrics ="暂无歌词"
//                  }
//                  self.lyrics = self.parseLyric(resLyric);
//                  console.log(self.lyrics)
//              }
//          }).catch(err=>{
//
//          })
//            let lrcAddress = (self.currentSong ).lrc.replace("cache=0","cache=1");
//          console.log(lrcAddress);
//          console.log(self.currentSong.lrc);
//            this.$axios.get(lrcAddress)
//                .then((res) => {
//                    self.lyrics = this.parseLyric(res.data);
////                  console.log(self.lyrics)
////                  if(this.lyrics ==="[00:00.00] 暂无歌词"){this.lyrics ="暂无歌词"}
//
//                })
//                .catch((err)=>{
//                    console.log(err);
//                });

            },
            setValue(){
                /*设置音量*/
                (this.$refs.mscAudio ).volume = this.volumeNum/100;
            },
            _isMobile(){
                /*屏幕大小小于425则为手机页面*/
                if (window.screen.width <= 425) {
                    this.isMobile = true;
                    this.isMini = true;
                }
                else {
                    this.isMobile = false;
                }
            },
            mediaOnEndedListener(){
                /*监听ended事件，一个音频放完后，调用playnext方法，手动播放下一首歌*/
                (this.$refs.mscAudio ).addEventListener("ended", () => {
                    this.playNext();
                });
            },

            move(e){
                let $msc = this.$refs.miniPlayer;

                document.onmousemove = (e)=>{       //鼠标按下并移动的事件


                    //移动当前元素
                    ($msc ).style.left = e.clientX + 'px';
                    ($msc ).style.top = e.clientY + 'px';
                };
                document.onmouseup = (e) => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            },




            
        },
        mounted() {
            this. setCurrentSong();
            this.setValue();
            this._isMobile();
            this.mediaOnEndedListener();
            this.updateSongDuration();
            this.keyBoardEventListener();
            this.loadMetadataListener();
            this.showLyrics();
        },


         watch:{
             volumeNum(){
                 /*监听音乐变化设置audio音量*/
                 (this.$refs.mscAudio ).volume = this.volumeNum/100;
             }
         },
        components:{
            VolumeSlider,
        }


    }
</script>
<style scoped>
    body, button, select, textarea, input, label, option, fieldset, legend {
        font-family: "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif !important;
        font-size: 14px !important;
        line-height: 18px;
        color: #444;
    }
    body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, form, fieldset, legend, input, textarea, button, p, blockquote, th, td {
        margin: 0;
        padding: 0;
    }
    li{
        list-style-type: none;
    }
    .ta-left{
        text-align: left;
    }
    .d-flex{
        display: flex;

    }
    .clearfix {
        *zoom: 1
    }

    .clearfix:after {
        display: block;
        visibility: hidden;
        clear: both;
        height: 0;
        content: '.';
        font-size: 0
    }
    .lyric-box{
        position: fixed;
        bottom: 0;
        right: 8%;
        max-width: 100%;
        text-align: center;
        max-height: 4rem;
        overflow: hidden;
        width: 82%
    }
    .lyric-mask {
        transform: translateY(10px);
        background-color: transparent;
        opacity: .95;
        padding: 1rem;
        border-radius: 16px;
    }

    .lyric-items {
        margin-bottom: .4rem;
        font-size: 1rem;
        color: #e18310;
    }

    .msc-player-box {
        z-index: 8;
        position: fixed;
        top:86%;
        transition: transform ease .9s;
        transform: translateX(0);
    }
    .msc-player-hide{
        z-index: 8;
        top:86%;
        position: fixed;
        transition: transform ease .9s;
        transform: translateX(-100%);
    }

    .mPlayer-main-board {
        background-color: #929292;
        border-radius: 4px;
        opacity: .85;
        /*padding: .5rem .9rem 1.5rem .4rem;*/
        width: 20rem;
        height: 6.5rem;
        color: #f6f6f6;
    }

    .mPlayer-song-name, .mPlayer-artist {
        text-align: center;
        font-size: .8rem !important;
        line-height: 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .mPlayer-artist {
        text-overflow: ellipsis;
        margin-top: .2rem;
    }
    #mini-player{
        width: 5rem;
        height:5rem;
        position: absolute;
    }



    .mPlayer-album {
        height: 4rem;
        width: 4rem;
        border-radius: 50%;
        vertical-align: top;
    }

    .miniBtn {
        line-height: 6.5rem;
    }

    .miniBtn-container {
        height: 6.5rem;
        width: 1.8rem;
        position: absolute;
        top: 0;
        left: 100%;
        background-color: rgba(137, 137, 137, .75);
        border-radius: 2px;
        text-align: center;
        z-index: 2;
    }

    .playCtrl > i {
        padding-left: .2rem;
    }

    .mPlayer-playlist {
        position: absolute;
        bottom: 100%;
        background-color: #929292;
        opacity: .85;
        color: #f6f6f6;
        padding: .3rem;
        border-radius: 4px;
        width: 20rem;
        max-height: 20rem;
        margin-bottom: .2rem;
        overflow-x: hidden;
        overflow-y:scroll;
        font-size: .8rem;
        z-index: 8;
    }

    .playlist-index {
        padding-right: .5rem;
    }
    .fa-step-backward{
        margin-right:.2rem;
    }

    .playlist-artist {
        text-overflow: ellipsis;
        width: 8rem;
        white-space: nowrap;
        overflow: hidden;
        padding-right: .2rem;
        text-align: center;
    }

    .playlist-index, .playlist-songname, .playlist-artist, .playlist-cur, .ctrlIcons {
        cursor: pointer;
        /*font-size: .8rem;*/
    }
    .ctrlIcons{
        color: #fff;
    }
    .playlist-songname{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .mPlayer-playlist-items {
        margin-top: .3rem;
        padding: .2rem 0;
        width: 19.5rem;
        overflow: hidden;
    }

    .playing-color {
        color: orange;
    }

    .playlist-cur {

        width: 3px;
        height: 1rem;
        margin-right: .3rem;
    }

    .curIdx {
        background-color: orange;
    }

    .mPlayer-playlist-items:hover {
        background-color: #fff;
        opacity: .5;
        color: orange;
    }

    .curSong {
        background-color: #d4d3da;
    }

    .playBtn {
        width: 2rem;
        /*margin-right: .4rem;*/
    }

    .toggleListBtn {
        margin-bottom: .4rem;
    }

    .mscAudio {
        display: none;
    }



    .mini-player-box {
        width: 5rem;
        height: 5rem;
        border-radius: 50%;
        background-color: rgba(146, 146, 146, 0.35);
        position: fixed;
        top: 85%;
        left: 1%;
        z-index: 99;
    }

    .mPlayer-album-mini {
        height: 5rem;
        width: 5rem;
        border-radius: 50%;
        vertical-align: top;
        /*opacity: 0.75;*/
        /*position: absolute;*/
    }

    @keyframes picRotate {
        from {
            transform: rotate(0)
        }
        to {
            transform: rotate(360deg)
        }
    }

    .picSpin {
        animation: picRotate 10.2s linear infinite;
    }

    .playBtn-mini {
        width: 2rem;
        position: absolute;
        top: 28%;
        left: 36%;
        color: #fff;
        z-index: 2;
    }

    .toggle-mini-btn {
        position: absolute;
        color: #fff;
        z-index: 2;
        top: 74%;
        left: 43%;

    }
    .toggle-mini-btn:hover{
        cursor: pointer;
    }

    .volume-slider {
        position: absolute;
        top: 0;
        left: 5px
    }

    .volume-btn {
        position: absolute;
        top: 55%;
    }

    .slide-range {
        display: none;
    }

    .volume-slider-bar {
        background-color: #57a3f3;
        border-radius: 3px;
        width: 4px;
        /*height: 30%;*/
        position: absolute;
        bottom: 0;
    }

    .volume-slider-wrap {
        width: 4px;
        height: 46px;
        background-color: #e8eaec;
        border-radius: 3px;
    }

    .volume-slider-btn {
        width: 10px;
        height: 10px;
        border: 2px solid #57a3f3;
        border-radius: 50%;
        background-color: #fff;
        outline: 0;
        position: absolute;
        left: -3px;
        /*bottom:30%;*/
        cursor: pointer;
    }

    .volume-box {
        height: 5rem
    }

    .time-ctrl {
        position: absolute;
        bottom: 5%;
        right: 40%;
    }

    .timeDuration {
        margin-left: .4rem;
        font-size: .8rem;
        color: #f8f8f8;
    }

    .progress-bar {
        width: 7rem
    }

    .vol-ctrl {
        position: absolute;
        bottom: 6%;
        right: 10%;
        color: #fff;
        width: 5rem;
        height: 1rem;

    }

    .my-slider {
        position: absolute;
        top: -21%;
        left: 27%;
        width: 4.5rem;
    }

    .mPlayer-playlist::-webkit-scrollbar-track-piece {
        /*滚动条凹槽的颜色，还可以设置边框属性*/
        background-color:#f8f8f8;
    }
    .mPlayer-playlist::-webkit-scrollbar {
        /*滚动条的宽度*/
        width:8px;
        height:9px;
    }
    .mPlayer-playlist::-webkit-scrollbar-thumb {
        /*滚动条的设置*/
        background-color:#dddddd;
        background-clip:padding-box;
        min-height:28px;
    }
    .mPlayer-playlist::-webkit-scrollbar-thumb:hover {
        background-color:#bbb;
    }
    .progress-bar{
        cursor: pointer;
    }
    .row-flex-center-middle{
        display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }
    .col-span-1{
        display: block;
        width: 4.16666667%
    }
    .col-span-2{
        display: block;
        width: 8.33333333%;
    }
    .col-span-3{
        display: block;
        width: 12.5%
    }
    .col-span-4{
        display: block;
        width: 16.66666667%
    }
    .col-span-5{
        display: block;
        width: 20.83333333%
    }
    .col-span-6{
        display: block;
        width: 25%;
    }
    .col-span-7{
        display: block;
        width: 29.16666667%;
    }
    .col-span-8{
        display: block;
        width: 33.33333333%

    }
    .col-span-9{
        display: block;
        width: 37.5%;
    }
    .col-span-10{
        display: block;
        width: 41.66666667%
    }
    .col-span-11{
        display: block;
        width: 45.83333333%
    }
    .col-span-12{
        display: block;
        width: 50%;
    }
    .position-relative{
        position: relative;
    }
    .fl{
        float: left;
    }

    .col-span-1,.col-span-2,.col-span-3,.col-span-4,.col-span-5,
    .col-span-6,.col-span-7,.col-span-8,.col-span-9,.col-span-10,
    .col-span-11,.col-span-12,.col-span-13{
        float: left;
        flex: 0 0 auto;
    }
    input[type="range"] {
        background-color: #fff;
        border-radius: 15px;
        width: 7rem;
        -webkit-appearance: none;
        height:6px;
        outline: none;
        cursor: pointer;
    }
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
    }
    .np-progress-bar{
        width: 7rem;
    }
    .np-progress {
        display: inline-block;
        width: 100%;
        font-size: 12px;
        position: relative;
    }
    .np-progress-outer {
        display: inline-block;
        width: 100%;
        margin-right: 0;
        padding-right: 0;
    }
    .np-progress-inner {
        display: inline-block;
        width: 100%;
        background-color: #f3f3f3;
        border-radius: 100px;
        vertical-align: middle;
        position: relative;
    }
    .np-progress-bg {
        border-radius: 100px;
        background-color: #2d8cf0;
        -webkit-transition: all .2s linear;
        transition: all .2s linear;
        position: relative;
    }

</style>
