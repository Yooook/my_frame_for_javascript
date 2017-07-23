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
	extend : function(target,source){
		// 遍历对象并拷贝
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
        var parent = $$.$id(pid);
        function handle(e){
            var target = $$.GetTarget(e);
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
            context = $$.$id(context);
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
      parentId = document.getElementById(parentId);
    }else{
      parentId = document;
    }
//        如果兼容getElementsByClassName
    if(parentId.getElementsByClassName){
      return parentId.getElementsByClassName(className);
    }else{
      //如果浏览器不支持
      dom = parentId.getElementsByTagName('*');

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
})