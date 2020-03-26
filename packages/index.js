import MusicPlayer from './musicplayer';

//把所有的组件存储起来
const components = [MusicPlayer];

//注册install方法
const install = (Vue)=> {
    //判断我们的组件是否安装，如果安装了就不安装了，按需引入
    if(install.installed)return;
    install.installed  = true;
    //遍历注册所有组件
    components.map(component =>{
        Vue.use(component);
    });
    //检测到Vue才去执行
    if(typeof  window !=='undefined' && window.Vue){
        install(window.Vue);
    }
};

export  default {
    //所有的组件必须有install方法才能使用Vue.use
    install,
    ...components
}
