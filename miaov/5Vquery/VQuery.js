//添加事件
//call(obj,arg1,arg2,arg3);call第一个参数传对象，可以是null。参数以逗号分开进行传值，参数可以是任何类型。
//apply(obj,[arg1,arg2,arg3]);apply第一个参数传对象，参数可以是数组或者arguments 对象。
//这两个方法通常被用来类的继承和回调函数：
// 通俗点说 就是一个对象调用一个方法  而call就是改变调用方法的对象
function myAddEvent(obj, sEv, fn)
{
	// ie下事件注册
	if(obj.attachEvent)
	{
		// 只在ie下面用  不用再其他下面用
		// 反着的  解决ie下绑定不可以用this  this找出来的是window  
		obj.attachEvent('on'+sEv, function (){
			//  因为ie下的事件注册是作用域是全局作用域  this为window引用  改变调用对象为当前元素
			fn.call(obj);
			// 这里的本质是obj.fn();   本来是  window.fn();
		});
	}
	else
	{
		// dom标准事件注册
		//大多数不需要捕获  
		// 火狐 chrome 下面是事件注册是元素作用域  this为当前element引用
		obj.addEventListener(sEv, fn, false);
	}
}


//选择class元素
function getByClass(oParent, sClass)
{
	var aEle=oParent.getElementsByTagName('*');
	var aResult=[];
	var i=0;
	
	for(i=0;i<aEle.length;i++)
	{
		if(aEle[i].className==sClass)
		{
			aResult.push(aEle[i]);
		}
	}
	
	return aResult;
}

function getStyle(obj, attr)
{
	// 有这个属性
	if(obj.currentStyle)
	{
		return obj.currentStyle[attr];
	}
	//  没有这个属性  false随便放什么都可以
	else
	{
		return getComputedStyle(obj, false)[attr];
	}
}

// VQuery选择器   对象
function VQuery(vArg)
{
	//用来保存选中的元素  
	this.elements=[];
	
	switch(typeof vArg)
	{
		case 'function':
			//window.onload=vArg;
			myAddEvent(window, 'load', vArg);
			break;
		case 'string':
			switch(vArg.charAt(0))
			{
				case '#':	//ID
					var obj=document.getElementById(vArg.substring(1));
					//保存到Element元素中
					this.elements.push(obj);
					break;
				case '.':	//class
				//  通过class选择元素  从谁下面选取？  $(".box")在整个页面找.box
				//  返回的就是数组  直接赋值给
					this.elements=getByClass(document, vArg.substring(1));
					break;
				default:	//tagName
					this.elements=document.getElementsByTagName(vArg);
			}
			break;
		case 'object':
			this.elements.push(vArg);
	}
}

//给元素加点击事件   fn是click的函数
VQuery.prototype.click=function (fn)
{
	var i=0;
	
	for(i=0;i<this.elements.length;i++)
	{
		myAddEvent(this.elements[i], 'click', fn);
	}
};

//显示元素
VQuery.prototype.show=function ()
{
	var i=0;
	//显示选择的elements  没有处理行间样式   因为不是block
	for(i=0;i<this.elements.length;i++)
	{
		this.elements[i].style.display='block';
	}
};


//隐藏元素
VQuery.prototype.hide=function ()
{
	var i=0;
	
	for(i=0;i<this.elements.length;i++)
	{
		this.elements[i].style.display='none';
	}
};

//jquery 一入一出
VQuery.prototype.hover=function (fnOver, fnOut)
{
	var i=0;
	//循环里面加了两个事件
	for(i=0;i<this.elements.length;i++)
	{
		//鼠标移入
		myAddEvent(this.elements[i], 'mouseover', fnOver);
		//鼠标移出 
		myAddEvent(this.elements[i], 'mouseout', fnOut);
	}
};

VQuery.prototype.css=function (attr, value)
{
	//取值赋值都是通过一个函数      读写都是一个函数  可变参数
	if(arguments.length==2)	//设置样式
	{
		var i=0;
		
		for(i=0;i<this.elements.length;i++)
		{
			this.elements[i].style[attr]=value;
		}
	}
	else	//获取样式
	{
		// 获取的是行间样式  大多数不是写在行间
		//return this.elements[0].style[attr];  和jq一样  都是返回第一个
		return getStyle(this.elements[0], attr);
	}
};

//获取属性的
VQuery.prototype.attr=function (attr, value)
{
	if(arguments.length==2)
	{
		var i=0;
		
		for(i=0;i<this.elements.length;i++)
		{
			this.elements[i][attr]=value;
		}
	}
	else
	{
		return this.elements[0][attr];
	}
};

VQuery.prototype.toggle=function ()
{
	var i=0;
	// 存的toggle的传入的函数  存起来
	var _arguments=arguments;
	
	for(i=0;i<this.elements.length;i++)
	{
		addToggle(this.elements[i]);
	}
	
	function addToggle(obj)
	{
		var count=0;
		myAddEvent(obj, 'click', function (){
			// arguments比this还乱
			_arguments[count++%_arguments.length].call(obj);
		});
	}
};

//  取某一个  类似于数组下标  体现了方法函数化
VQuery.prototype.eq=function (n)
{
	return $(this.elements[n]);
	//return this.elements[n]   不能使用css方法  普通div没有css方法
};

function appendArr(arr1, arr2)
{
	var i=0;
	
	for(i=0;i<arr2.length;i++)
	{
		arr1.push(arr2[i]);
	}
}

//找子元素的
VQuery.prototype.find=function (str)
{
	var i=0;
	var aResult=[];
	// this.elements 就是选中的所有元素
	for(i=0;i<this.elements.length;i++)
	{
		switch(str.charAt(0))
		{
			case '.':	//class
				var aEle=getByClass(this.elements[i], str.substring(1));
				
				aResult=aResult.concat(aEle);
				break;
			default:	//标签
				var aEle=this.elements[i].getElementsByTagName(str);
				// 增加数组
				//aResult=aResult.concat(aEle);
				appendArr(aResult, aEle);
		}
	}
	//  find后也要选择css方法  链式操作核心
	//  空的vquery对象
	var newVquery=$();
	
	newVquery.elements=aResult;
	//为了让find后面也可以跟上css之类的方法
	return newVquery;
};

//获取同级的索引值  求某元素在同级中的序号
function getIndex(obj)
{
	var aBrother=obj.parentNode.children;
	var i=0;
	
	for(i=0;i<aBrother.length;i++)
	{
		if(aBrother[i]==obj)
		{
			return i;
		}
	}
}

VQuery.prototype.index=function ()
{
	return getIndex(this.elements[0]);
};


//类似于jquery  jquery不是纯粹面向对象的  而是扩展基础对象
function $(vArg)
{
	return new VQuery(vArg);
}






