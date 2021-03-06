/**
 * 作者：苏奋强（Finch）
 * 开发日期：2017/7/20
 * 描述：通用框架
 * 域名：www.apskt.com
 * 版权所有 违者必究
 */

(function(window) {

    var Apskt = function(id) {
         this.elements = [];
         return this.query(id);
    };
    
    // 框架基类方法
    Apskt.prototype = {
        // html5选择器
        query:function(selector,parentId){
            context = parentId || document;
            this.elements = context.querySelectorAll(selector);
        },
        //去除左边空格
        ltrim:function(){
            this.elements = this.elements.replace(/(^\s*)/g,'');
            return this;
        },
        //去除右边空格
        rtrim:function(){
            this.elements = this.elements.replace(/(\s*$)/g,'');
            return this;
        },
        //去除空格
        trim:function(str){
            if (str) {
                 this.elements = str.replace(/(^\s*)|(\s*$)/g, '');
             }else {
                 this.elements = this.elements.replace(/(^\s*)|(\s*$)/g, '');
             }
           
            return this;
        },
        // 实现对象拷贝，利于后面框架模块的划分
    	extend : function(target,source){
    		for(var i in source) {
    			target[i] = source[i];
    		}
    		return target;
    	}
    }

    // 实例化
    Apskt = new Apskt();

    // 事件框架
    Apskt.extend(Apskt,{
    	// 事件绑定
    	on:function(event,funciton) {
    		var doms  = this.elements;//这是一个伪数组
    		if (doms[0].addEventListener) {
    			// dom.addEventListener(event, funciton, false);
                for (var i = 0; i < doms.length; i++) {
                    doms[i].addEventListener(event, funciton, false);
                }
    		} else if (doms[0].attachEvent) {
    			// dom.attachEvent('on' + event, funciton);
                for (var i = 0; i < doms.length; i++) {
                    doms[i].attachEvent('on' + event, funciton);
                }
    		}
    	},

    	// 事件解除
    	un:function(event,funciton) {
            var doms  = this.elements;//这是一个伪数组
            if (doms[0].removeEventListener) {
                for (var i = 0; i < doms.length; i++) {
                    doms[i].removeEventListener(event, funciton, false);
                }
            } else if (doms[0].detachEvent) {
                for (var i = 0; i < doms.length; i++) {
                    doms[i].detachEvent('on' + event, funciton);
                }
            }
    	},

    	//点击
        click : function(funciton){
            Apskt.on('click',funciton);
        },

        // 鼠标移上
        mouseover:function(funciton){
            Apskt.on('mouseover',funciton);
        },

        // 鼠标离开
        mouseout:function(funciton){
            Apskt.on('mouseout',funciton);
        },

        // 悬浮
        hover : function(fnOver,fnOut){
            if(fnOver){
                Apskt.on("mouseover",fnOver);
            }
            if(fnOut){
                Apskt.on("mouseout",fnOut);
            }
        }, 

        // 事件对象
        getEvent : function(event) {
        	return event ? event : window.event;
        },

        // 获取目标
        getTarget : function(event) {
        	var e = Apskt.getEvent(event);
        	return e.target || e.srcElement;
        },

        // 阻止默认行为
        preventDefault : function(event) {
        	var e = Apskt.getEvent(event);
        	if (e.preventDefault) {
        		e.preventDefault();
        	}else {
        		e.returnValue = false;
        	}
        },
       
        // 阻止事件冒泡
        stopPropagation : function(event) {
        	var e = Apskt.getEvent(event);
        	if (e.stopPropagation) {
        		e.stopPropagation();
        	}else {
        		e.cancelBubble = false;
        	}
        },

        //事件委托
        delegate:function (eventType, selector, fn) {
            //参数处理
            // console.log(this.elements[0])
            var parent = this.elements[0];
            function handle(e){
                var target = Apskt.getTarget(e);
                if(target.nodeName.toLowerCase()=== selector || target.id === selector || target.className.indexOf(selector) != -1){
                    // 在事件冒泡的时候，遍历每个子孙后代，如果找到对应的元素，则执行如下函数
                    // 为什么使用call，因为call可以改变this指向
                    // 函数中的this默认指向window，而我们希望指向当前dom元素本身
                    fn.call(target);
                }
            }
            //当我们给父亲元素绑定一个事件，他的执行顺序：先捕获到目标元素，然后事件再冒泡
            //这里是是给元素对象绑定一个事件
            parent[eventType]=handle;
        }
    })



    // 类型检测框架
    Apskt.extend(Apskt,{

        //数据类型检测
    	isString : function() {
    		return typeof this.elements === 'string';
    	},
        isNumber:function (){
            return typeof this.elements === 'number' && isFinite(this.elements)
        },
        isBoolean:function () {
            return typeof this.elements ==="boolean";
        },
        isUndefined:function () {
            return typeof this.elements === "undefined";
        },
        isObj:function (){
            if(this.elements === null || typeof this.elements === 'undefined'){
                return false;
            }
            return typeof this.elements === 'object';
        },
        isNull:function (){
            return  this.elements === null;
        },
        isArray:function () {
            if(this.elements === null || typeof this.elements === 'undefined'){
                return false;
            }
            return this.elements.constructor === Array;
        }
    })



    // 选择器框架
    Apskt.extend(Apskt,{

        //id选择器
        getId:function(id){
            return document.getElementById(id);
        },

        //tag选择器
        getTag:function(tag,context){
            if(typeof context == 'string'){
                context = Apskt.getId(context);
            }

            if(context){
                return context.getElementsByTagName(tag);
            }else{
                return document.getElementsByTagName(tag);
            }
        },

        //class选择器
        getCla:function(className,parentId){
            var i=0,len,dom=[],arr=[];
            //如果传递过来的是字符串 ，则转化成元素对象
            if( typeof parentId === 'string'){
              parent = document.getElementById(parentId);
            }else{
              parent = document;
            }
            //如果兼容getElementsByClassName
            if(parent.getElementsByClassName){
              return parent.getElementsByClassName(className);
            }else{
              //如果浏览器不支持
              dom = parent.getElementsByTagName('*');

              for(i;len=dom.length,i<len;i++)
              {
                var array = dom[i].className.split(' ');
                for (var j = 0; j < array.length; j++) {
                  if (array[j] == className) {
                    arr.push(dom[i]);
                  }
                }
              }
            }
            return arr;
          },

        //分组选择器
        group:function(content) {
            var result=[],doms=[];
            var arr = Apskt.trim(content).split(',');
            //alert(arr.length);
            for(var i=0,len=arr.length;i<len;i++) {
                var item = Apskt.trim(arr[i])
                var first= item.charAt(0)
                var index = item.indexOf(first)
                if(first === '.') {
                    doms=Apskt.getClass(item.slice(index+1))
                    pushArray(doms,result)

                }else if(first ==='#'){
                    doms=[Apskt.getId(item.slice(index+1))]//doms是数组，但是getId获取的不是数组，而是单个元素
                    pushArray(doms,result)
                }else{
                    doms = Apskt.getTag(item)
                    pushArray(doms,result)
                }
            }
            return result;

            //重复的代码
            function pushArray(doms,result){
                for(var j= 0, domlen = doms.length; j < domlen; j++){
                    result.push(doms[j])
                }
            }
        },
        //层次选择器
        layer:function (select){
            //个个击破法则 -- 管道思想
            var sel = Apskt.trim(select).split(' ');
            var result=[];
            var context=[];
            for(var i = 0, len = sel.length; i < len; i++){
                result=[];
                var item = Apskt.trim(sel[i]);
                var first = sel[i].charAt(0)
                var index = item.indexOf(first)
                if(first ==='#'){
                    //如果是#，找到该元素，
                    pushArray([Apskt.id(item.slice(index + 1))]);
                    context = result;
                }else if(first ==='.'){
                    if(context.length){
                        for(var j = 0, contextLen = context.length; j < contextLen; j++){
                            pushArray(Apskt.getClass(item.slice(index + 1), context[j]));
                        }
                    }else{
                        pushArray(Apskt.getClass(item.slice(index + 1)));
                    }
                    context = result;
                }else{

                    if(context.length){
                        for(var j = 0, contextLen = context.length; j < contextLen; j++){
                            pushArray(Apskt.getTag(item, context[j]));
                        }
                    }else{
                        pushArray(Apskt.getTag(item));
                    }
                    context = result;
                }
            }

            return context;
            //重复的代码
            function pushArray(doms){
                for(var j= 0, domlen = doms.length; j < domlen; j++){
                    result.push(doms[j])
                }
            }
        },

        //混合选择器（多组+层次）
        blend:function(str) {
            var result = [];
            var item = Apskt.trim(str).split(',');
            for(var i = 0, glen = item.length; i < glen; i++){
                var select = Apskt.trim(item[i]);
                var context = [];
                context = Apskt.layer(select);
                pushArray(context);

            };
            return result;

            //重复的代码
            function pushArray(doms){
                for(var j= 0, domlen = doms.length; j < domlen; j++){
                    result.push(doms[j])
                }
            }
        },

        //html5选择器
        query:function(selector,parentId){
            context = parentId || document;
            return  context.querySelectorAll(selector);
        },
    })


    // css框架
    Apskt.extend(Apskt,{
        //样式
        css:function(key, value){
            var dom = this.elements;
            //如果是数组
            if(dom.length){
                //如果value不为空，则表示设置
                if(value){
                    for(var i = dom.length - 1; i >= 0; i--){
                        setStyle(dom[i],key, value);
                    }
                    //如果value为空，则表示获取
                }else{
                    return getStyle(dom[0]);
                }
                //如果不是数组
            }else{
                if(value){
                    setStyle(dom,key, value);
                }else{
                    return getStyle(dom);
                }
            }
            function getStyle(dom){
                if(dom.currentStyle){
                    return dom.currentStyle[key];
                }else{
                    return getComputedStyle(dom,null)[key];
                }
            }
            function setStyle(dom,key,value){
                dom.style[key] = value;
            }
        },

        //显示
        show:function (){
            var doms = this.elements;
            for(var i= 0,len=doms.length;i<len;i++){
                //display属性最好写在行内，这样避免无法读取DOM对象的问题，使得无法block
                Apskt.css('display', 'block');
            }
            return this;
        },

        //隐藏
        hide:function (){
            var doms = this.elements;
            for(var i= 0,len=doms.length;i<len;i++){
                Apskt.css('display', 'none');
            }
            return this;
        },

        //元素高度宽度概述
        //计算方式：clientHeight clientWidth innerWidth innerHeight
        //元素的实际高度+border，也不包含滚动条
        width:function (){
            // console.log(this.elements[0].clientWidth)
            return this.elements[0].clientWidth
        },

        height:function (){
            // console.log(this.elements[0].clientWidth)
            return this.elements[0].clientHeight
        },

         //元素的滚动高度和宽度
        //当元素出现滚动条时候，这里的高度有两种：可视区域的高度 实际高度（可视高度+不可见的高度）
        //计算方式 scrollwidth
        scrollWidth:function (){
             // console.log(this.elements[0].scrollWidth)
            return this.elements[0].scrollWidth
        },

        scrollHeight:function (){
            // console.log(this.elements[0].scrollHeight)
            return this.elements[0].scrollHeight
        },

        //元素滚动的时候 如果出现滚动条 相对于左上角的偏移量
        //计算方式 scrollTop scrollLeft
        scrollTop:function (){
            // console.log(this.elements[0].scrollTop)
            return this.elements[0].scrollTop
        },

        scrollLeft:function (){
            // console.log(this.elements[0].scrollLeft)
            return this.elements[0].scrollLeft
        },

        //文档视口的高度和宽度
        wWidth:function (){
            // 判断是否是标准模式，ie会有混杂模式
            if (document.compatMode == 'CSS1Compat') {
                return document.documentElement.clientWidth
            }else {
                return document.body.clientWidth
            }
            
        },

        wHeight:function (){
            if (document.compatMode == 'CSS1Compat') {
                return document.documentElement.clientHeight
            }else {
                return document.body.clientHeight
            }
        },

        //文档滚动区域的整体的高和宽
        wScrollHeight:function () {
            // console.log(document.body.scrollHeight)
            return document.body.scrollHeight
        },

        wScrollWidth:function () {
            return document.body.scrollWidth
        },

        //获取滚动条相对于其顶部的偏移
        wScrollTop:function () {
            var scrollTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
            // console.log(scrollTop)
            return scrollTop
        },

        //获取滚动条相对于其左边的偏移
        wScrollLeft:function () {
            var scrollLeft = document.body.scrollLeft || (document.documentElement && document.documentElement.scrollLeft);
            return scrollLeft
        }
    })


    // 属性框架
    Apskt.extend(Apskt,{
        attr:function(key, value){
            var dom = this.elements;
            //如果是数组  比如tag
                if(dom.length){
                    if(value){
                        for(var i= 0, len=dom.length; i <len; i++){
                            dom[i].setAttribute(key, value);
                        }
                    }else{
                        return dom[0].getAttribute(key);
                    }
            //如果是单个元素  比如id
                }else{
                    if(value){
                        dom.setAttribute(key, value);
                    }else{
                        return dom.getAttribute(key);
                    }
                }
        },

        //动态添加和移除class
        addClass:function (name){
            var dom = this.elements;
            //如果获取的是集合
            if(dom.length){
                for(var i= 0,len=dom.length;i<len;i++){
                    addName(dom[i]);
                }
            }else{
                addName(dom);
            }
            function addName(dom){
                dom.className = dom.className + ' ' + name;
            }
        },

        removeClass:function (name){
         var doms = this.elements;
            if(doms.length){
                for(var i= 0,len=doms.length;i<len;i++){
                    removeName(doms[i]);
                }
            }else{
                removeName(doms);
            }
            function removeName(dom){
                dom.className = dom.className.replace(name, '');
            }
        },

        //判断是否有
        hasClass:function(name){
            var doms = this.elements;
            var flag = true;
            for(var i= 0,len=doms.length;i<len;i++){
                flag = flag && check(doms[i],name)
            }
            return flag;
            //判定单个元素
            function check(element,name){
                return -1<(" "+element.className+" ").indexOf(" "+name+" ")
            }
        },

        //获取
        getClass:function (){
            var doms = this.elements;
            var str = Apskt.trim(doms[0].className);
            this.elements = this.elements.split(" ");
            return this.elements
        }
    })

    //内容框架
    Apskt.extend(Apskt,{
        //innerHTML的函数版本
        html:function (value){
            var doms = this.elements;
            //设置
            if(value){
                for(var i= 0,len= doms.length; i<len; i++){
                    doms[i].innerHTML = value;
                }
            }else{
                this.elements = doms[0].innerHTML;
                // console.log(doms[0].value)
                return this;
            }
        },
        // value获取表单内容
        val:function (value){
            var doms = this.elements;
            //设置
            if(value){
                for(var i= 0,len= doms.length; i<len; i++){
                    doms[i].value = value;
                }
            }else{
                this.elements = doms[0].value;
                return this;
            }
        }
    })

    //动画框架
    Apskt.extend(Apskt,{
        // 函数版本,动画时间进程,这用方式太繁杂,没有动画距离进程简单,主要体会成员私有化的思想
        // animate : function (id,juli,duration) {
        //    var dom = Apskt.getId(id);
        //    var now = +new Date();
        //    // var pass = +new Date();
        //    // var yongshi = pass-now;
        //    var tween = 0;
        //    // var juli = 400;
        //    // var step;
        //    var timer;
        //    timer = setInterval(move,30);
        //    unction getTween(now,pass,all) {
        //     // var yongshi = pass-now;
        //     // var tween = yongshi/duration;
        //     return (pass-now)/all;
        //     }

        //     function stop() {
        //         clearInterval(timer);
        //     }

        //     function oneProperty(id,name,start,juli,tween) {
        //         if (true) {

        //         }else{
        //             Apskt.css(id,name,(start+juli*tween) + 'px')
        //             // dom.style[name] = juli*tween + 'px';
        //         }
        //     }
            
        //     function move() {
        //         if (tween >= 1) {
        //              stop();
        //         }else {
        //             pass = +new Date();
        //         // var yongshi = pass-now;
        //             tween = getTween(now,pass,duration);
        //             // div.style.left = juli*tween + 'px';
        //             oneProperty('div','left',0,juli,tween);
        //         }
                
        //     } 
        // }
    })

    window.$ = Apskt;

     // 实现链式调用
    window.apskt = function(id) {
        Apskt.elements = Apskt.query(id);
        // console.log(Apskt.elements)
        return Apskt;
    }

})(window);
