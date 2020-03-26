# vue-nplayer

## 说明
```
取自我的个人网站中的音乐播放器组件，基于Vue2.X,有几个按钮样式依赖于font-awesome；
播放器外形有2种模式，迷你模式与正常模式，默认加载的是迷你模式；正常模式可切换隐藏与显示；
播放器实现的功能有：歌单列表显示、列表播放与随机播放切换；

```

### 安装
```
cnpm 或者yarn
```

### 注册
```
全局注册：
    import vueNplayer from 'vue-nplayer';
    Vue.use(vueNplayer);
    或者Vue.component("vueNplayer",vueNplayer)
局部注册：
    单文件组件内引入 import vueNplayer from 'vue-nplayer';
    随后在components中注册
    components: {
           vueNplayer 
         },
    
模板中使用：
    <vue-nplayer :songLists="songLists"></vue-nplayer>
```

### 需要传递的props
```
songLists
类型:array
说明:从音乐API接口返回的歌单列表


```

### Todos
```
歌词显示功能
```


