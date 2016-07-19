/**
 * PM for Aimeejs
 * Author by gavinning
 * Homepage https://github.com/Aimeejs/pm
 */

class PM {

    constructor() {
        // Page map { page.name: page }
        this.map = {};
        // Current page
        this.page = {};
        this.pages = [];
        this.prevPage = {};
    }

    init() {
        // 打印页面注册信息
        console.log(this.getPagesHash().join(', ')  + ' is reg');

        if("onhashchange" in window) {
            // 监听hashchange事件
            window.onhashchange = function() {
                pm.hashChange(location.hash);
            }
        }else{
            console.log('not support onhashchange event');
        };

        this.load(this.getHash());
    }

    /**
     * 注册页面到PM
     * @param   {Object}  page  页面实例对象
     */
    reg(page) {
        if(!this.map[page.name]) {
            this.map[page.name] = page;
            this.pages.push(page);
        }
    }

    /**
     * 快捷返回首页
     * @example pm.home()
     */
    home() {
        try{
            this.load('home')
        }
        catch(e) {
            throw e
            // console.error(e.message)
        }
    }

    /**
     * 加载指定页面
     * @param   {String}  name  page.name, page.hash
     * @example pm.load('home'); pm.load('#/home');
     */
    load(name) {
        var id;

        // 默认返回到首页
        if(!name) return this.home();

        // Load page.hash
        if(name.indexOf('#') === 0) {
            // 获取 page._id
            id = name.replace('#', '');

            // 加载目标页面等于当前页面, 或id为空时拒绝
            if(!id || this.page._id === id) return;

            this.pages.some(function(page) {
                if(page._id === id) {
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
            this.pages.some(function(page) {
                if(page.name === name) {
                    pm.enter(name);
                    // 打印页面分发日志
                    console.log((pm.prevPage.name || 'init') + ' => ' + pm.page.name);
                    return;
                }
            })
        }
    }

    /**
     * 进入指定页面
     * @param   {String}  name 页面名字, page.name
     * @example pm.enter('home')
     */
    enter(name) {
        // 执行当前页面离开
        this.leave();
        // 加载目标页面
        this.page = this.map[name];
        // 渲染目标页面
        this.page.load();
    }

    // 获取上一页页面对象
    prev() {
        return this.prevPage;
    }

    // 离开当前页面
    leave() {
        if(this.page.name) {
            // 执行当前页面离开
            this.page.unload();
            // 修改当前页为上一页
            this.prevPage = this.page;
        }
    }

    // 加载错误页面
    // pm.error(404)
    error(name) {
        this.load(name)
    }

    // 变更hash
    setHash(hash) {
        location.hash = hash;
    }

    // 获取当前hash
    getHash() {
        return location.hash.replace(/[\.\?'"><:;,\[\]\{\}]/ig, '');
    }

    // 处理hash变更
    hashChange(hash) {
        // 默认返回首页
        if(!hash) return this.home();
        // 过滤非法字符
        hash = hash.replace(/[\.\?'"><:;,\[\]\{\}]/ig, '');
        // Load指定页面
        this.load(hash);
    }

    // 获取所有注册Hash
    getPagesHash() {
        var arr = [];
        pm.pages.forEach(function(page) {
            arr.push(page._id.replace(/^\//, ''))
        })
        return arr;
    }
}

console.log('pm is load');
module.exports = window.pm = new PM;
