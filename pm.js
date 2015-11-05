/**
 * PM for Aimeejs
 * Author by gavinning
 * Homepage https://github.com/Aimeejs/pm
 */

var arr = [];
var pm = {
    version : '1.0.0',

    name: 'pm',

    // Home页id
    homePage: '/home',

    // 缓存当前虚拟页信息
    page: {},

    // 页面列表，以page.name为key
    map: {},

    // 页面列表，以page._id为key
    pageHash: {},

    // 页面列表，array
    pageArray: [],

    // 缓存上一页虚拟页信息
    _prev: {},

    // 缓存全局模块
    app: {},

    // 渲染Home页面
    home: function(){
        try{
            this.setHash(this.homePage);
        }catch(e){
            console.error(e.message);
        }
    },

    error: function(statusCode){
        switch(statusCode){
            case 404: console.error(this.getHash() + ' is not found.');
            break;

            default: console.log(statusCode);
            break;
        }
    },

    // 渲染上一页面
    prev: function(){
        // if(!this._prev.id) return;
        // this.page.leave();
        // this.page = this._prev;
        // this.page.enter();
        // this._prev = {};
    },

    // 页面初始化逻辑
    init: function(){
        console.log(arr.join(', ')  + ' is reg');

        if("onhashchange" in window){

            // 监听hashchange事件
            window.onhashchange = function(){
                pm.hashChange(location.hash.slice(1));
            }
        }else{
            console.log('not support onhashchange event');
        };

        this.load(pm.getHash());
    },

    // 离开虚拟页，缓存上一页
    leave: function(){
        if(this.page.name){
            this.page.leave();
            this.page.display = false;
        this._prev = this.page;
        }
    },

    // 加载虚拟页
    load: function(hash){
        if(!hash) return this.home();

        // debug
        if(this.page.url == hash) return;
        if(!this.pageHash[hash]) return this.error(404);

        // 执行页面离开
        this.leave();
        this.page = this.pageHash[hash];
        this.page.__enter();
        this.page.display = true;

        console.log((this._prev.name || 'init') + ' => ' + this.page.name);
    },

    // 虚拟页注册
    reg: function(page){
        if(!this.map[page.name]){
            this.map[page.name] = page;
            this.pageHash[page._id] = page;
            this.pageArray.push(page);
            arr.push(page.name);
        };

        // 页面注册日志
        // console.log(page.name + ' is reg');
    },

    // 变更hash
    setHash: function(hash){
        location.hash = hash;
    },

    getHash: function(){
        return location.hash.replace(/[\.\?'"><:;,\[\]\{\}]/ig, '').slice(1);
    },

    // 处理hash变更
    hashChange: function(hash){
        if(!hash) return this.home();
        // 过滤非法字符
        hash = hash.replace(/[\.\?'"><:;,\[\]\{\}]/ig, '');
        this.load(hash);
    },

    // 处理页面变更
    pageChange: function(){

    },

    // 处理缓存
    cache: function(){

    },

    bind: function(){

    }
};
console.log('pm is load');
module.exports = window.pm = pm;
