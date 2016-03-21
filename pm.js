/**
 * PM for Aimeejs
 * Author by gavinning
 * Homepage https://github.com/Aimeejs/pm
 */

var pm = {

    // Page map
    map: {
        // page.name: page
    },

    // Current page
    page: {},

    // Page array
    pages: [
        // page1, page2, page3...
    ],

    // Prev page
    prevPage: {},

    /**
     * PM初始化, 加载首页, 开放式Api
     * @example pm.init()
     */
    init: function(){
        // 打印页面注册信息
        console.log(getPagesHash().join(', ')  + ' is reg');

        if("onhashchange" in window){
            // 监听hashchange事件
            window.onhashchange = function(){
                pm.hashChange(location.hash);
            }
        }else{
            console.log('not support onhashchange event');
        };

        this.load(this.getHash());
    },

    /**
     * 注册页面到PM
     * @param   {Object}  page  页面实例对象
     * @example pm.reg(home)
     */
    reg: function(page){
        if(!this.map[page.name]){
            this.map[page.name] = page;
            this.pages.push(page);
        }
    },

    /**
     * 快捷返回首页
     * @example pm.home()
     */
    home: function(){
        try{
            this.load('home')
        }
        catch(e){
            throw e
            // console.error(e.message)
        }
    },

    /**
     * 加载指定页面
     * @param   {String}  name  page.name, page.hash
     * @example pm.load('home'); pm.load('#/home');
     */
    load: function(name){
        var id;

        // 默认返回到首页
        if(!name) return this.home();

        // Load page.hash
        if(name.indexOf('#') === 0){
            // 获取 page._id
            id = name.replace('#', '');

            // 加载目标页面等于当前页面, 或id为空时拒绝
            if(!id || this.page._id === id) return;

            this.pages.some(function(page){
                if(page._id === id){
                    // 加载目标页面
                    pm.enter(page.name);
                    // 打印页面分发日志
                    console.log((pm.prevPage.name || 'init') + ' => ' + pm.page.name);
                    return;
                }
            })
        }
        // Load page.name
        else{
            // 查询当前name是否已被注册
            this.pages.some(function(page){
                if(page.name === name){
                    pm.enter(name);
                    // 打印页面分发日志
                    console.log((pm.prevPage.name || 'init') + ' => ' + pm.page.name);
                    return;
                }
            })
        }
    },

    /**
     * 进入指定页面
     * @param   {String}  name 页面名字, page.name
     * @example pm.enter('home')
     */
    enter: function(name){
        // 执行当前页面离开
        this.leave();
        // 加载目标页面
        this.page = this.map[name];
        // 渲染目标页面
        this.page.load();
    },

    // 获取上一页页面对象
    prev: function(){
        return this.prevPage;
    },

    // 离开当前页面
    leave: function(){
        if(this.page.name){
            // 执行当前页面离开
            this.page.unload();
            // 修改当前页为上一页
            this.prevPage = this.page;
        }
    },

    // 加载错误页面
    // pm.error(404)
    error: function(name){
        this.load(name)
    },

    // 变更hash
    setHash: function(hash){
        location.hash = hash;
    },

    // 获取当前hash
    getHash: function(){
        return location.hash.replace(/[\.\?'"><:;,\[\]\{\}]/ig, '');
    },

    // 处理hash变更
    hashChange: function(hash){
        // 默认返回首页
        if(!hash) return this.home();
        // 过滤非法字符
        hash = hash.replace(/[\.\?'"><:;,\[\]\{\}]/ig, '');
        // Load指定页面
        this.load(hash);
    }
}

// 获取已注册页面
function getPagesHash(){
    var arr = [];
    pm.pages.forEach(function(page){
        arr.push(page._id.replace(/^\//, ''))
    })
    return arr;
}

console.log('pm is load');
module.exports = window.pm = pm;
