/**
 * Keep Coding!
 * Created by admin on 2020/3/25.
 */

const path = require('path');
module.exports ={
    //修改入口
    pages:{
        index:{
            entry:'src/main.js', //入口文件
            template:'public/index.html',
            filename:'index.html'
        }
    },

    //webpack基本配置
    chainWebpack:config=>{
        config.module
            .rule('js')
            .include.add(path.resolve(__dirname,'packages')).end()
            .use('babel')
            .loader('babel-loader')

            //修改配置
            .tap(options=>{
                return options
            })
    }
};
