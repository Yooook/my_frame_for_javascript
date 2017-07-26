/**
 * 作者：苏奋强（Finch）
 * 开发日期：2017/7/20
 * 描述：通用框架
 * 域名：www.apskt.com
 * 版权所有 违者必究
 */

// 创建顶层的命名空间
var Apskt = function() {};

// 框架基类方法
Apskt.prototype = {
    //去除左边空格
    ltrim:function(str){
        return str.replace(/(^\s*)/g,'');
    },
    //去除右边空格
    rtrim:function(str){
        return str.replace(/(\s*$)/g,'');
    },
    //去除空格
    trim:function(str){
        return str.replace(/(^\s*)|(\s*$)/g, '');
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
	on:function(id,event,funciton) {
		var dom  = Apskt.isString(id) ? document.getElementById(id) : id;
		if (dom.addEventListener) {
			dom.addEventListener(event, funciton, false);
		} else if (dom.attachEvent) {
			dom.attachEvent('on' + event, funciton);
		}
	},

	// 事件解除
	un:function(id,event,funciton) {
		var dom  = Apskt.isString(id) ? document.getElementById(id) : id;
		if (dom.removeEventListener) {
			dom.removeEventListener(event, funciton, false);
		} else if (dom.detachEvent) {
			dom.detachEvent('on' + event, funciton);
		}
	},

	//点击
    click : function(id,funciton){
        Apskt.on(id,'click',funciton);
    },

    // 鼠标移上
    mouseover:function(id,funciton){
        Apskt.on(id,'mouseover',funciton);
    },

    // 鼠标离开
    mouseout:function(id,funciton){
        Apskt.on(id,'mouseout',funciton);
    },

    // 悬浮
    hover : function(id,fnOver,fnOut){
        if(fnOver){
            Apskt.on(id,"mouseover",fnOver);
        }
        if(fnOut){
            Apskt.on(id,"mouseout",fnOut);
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
    delegate:function (pid, eventType, selector, fn) {
        //参数处理
        var parent = Apskt.getId(pid);
        function handle(e){
            var target = Apskt.GetTarget(e);
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
	isString : function(value) {
		return typeof value === 'string';
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
    getClass:function(className,parentId){
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
    css:function(context, key, value){
            var dom = Apskt.isString(context)?Apskt.query(context) : context;
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
    show:function (content){
        var dom = Apskt.isString(context)?Apskt.query(context) : context;
        for(var i= 0,len=doms.length;i<len;i++){
            Apskt.css(doms[i], 'display', 'block');
        }
    },

    //隐藏
    hide:function (content){
        var dom = Apskt.isString(context)?Apskt.query(context) : context;
        for(var i= 0,len=doms.length;i<len;i++){
            Apskt.css(doms[i], 'display', 'none');
        }
    },

    //元素高度宽度概述
    //计算方式：clientHeight clientWidth innerWidth innerHeight
    //元素的实际高度+border，也不包含滚动条
    Width:function (id){
        return Apskt.getId(id).clientWidth
    },

    Height:function (id){
        return Apskt.getId(id).clientHeight
    },

     //元素的滚动高度和宽度
    //当元素出现滚动条时候，这里的高度有两种：可视区域的高度 实际高度（可视高度+不可见的高度）
    //计算方式 scrollwidth
    scrollWidth:function (id){
        return Apskt.getId(id).scrollWidth
    },

    scrollHeight:function (id){
        return Apskt.getId(id).scrollHeight
    },

    //元素滚动的时候 如果出现滚动条 相对于左上角的偏移量
    //计算方式 scrollTop scrollLeft
    scrollTop:function (id){
        return Apskt.getId(id).scrollTop
    },

    scrollLeft:function (id){
        return Apskt.getId(id).scrollLeft
    },

    //文档视口的高度和宽度
    wWidth:function (){
        return document.documentElement.clientWidth
    },

    wHeight:function (){
        return document.documentElement.clientHeight
    },

    //文档滚动区域的整体的高和宽
    wScrollHeight:function () {
        return document.body.scrollHeight
    },

    wScrollWidth:function () {
        return document.body.scrollWidth
    },

    //获取滚动条相对于其顶部的偏移
    wScrollTop:function () {
        var scrollTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
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
    attr:function(content, key, value){
        var dom = Apskt.isString(context)?Apskt.query(context) : context;
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
    addClass:function (context, name){
        var dom = Apskt.isString(context)?Apskt.query(context) : context;
        //如果获取的是集合
        if(doms.length){
            for(var i= 0,len=doms.length;i<len;i++){
                addName(doms[i]);
            }
        }else{
            addName(doms);
        }
        function addName(dom){
            dom.className = dom.className + ' ' + name;
        }
    },

    removeClass:function (context, name){
     var dom = Apskt.isString(context)?Apskt.query(context) : context;
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
    hasClass:function(context,name){
        var dom = Apskt.isString(context)?Apskt.query(context) : context;
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
    getClass:function (id){
        var doms = $$.$all(id)
        return Apskt.trim(doms[0].className).split(" ")
    }
})

