function myAddEvent(obj, sEv, fn) {
	if(obj.attachEvent) {
		obj.attachEvent('on'+sEv, function() {
			//fn.call(obj);
			if(false == fn.call(obj)) {
				event.cancelBubble = true;
				return false;
			}
		});
	} else {
//		obj.addEventListener(sEv, fn, false);
		obj.addEventListener(sEv, function(ev){
			if(false == fn.call(obj)) {}
			ev.cancelBubble = true;
			ev,preventDefault();
		}, false);
	}
}

function getByClass(oParent, sClass) {
	var aEle = oParent.getElementsByTagName('*');
	var aResult = [];
	var i = 0;
	for(i = 0; i<aEle.length; i++) {
		if(aEle[i].className == sClass) {
			aResult.push(aEle[i]);
		}
	}
	return aResult;
}

function getStyle(obj, attr) {
	if(obj.currentStyle) {
		return obj.currentStyle[attr];
	} else {
		return getComputedStyle(obj, false)[attr];
	}
}

function LiQuery(vArg) {
	this.elements = [];
	switch (typeof vArg) {
		case 'function':
			myAddEvent(window, 'load', vArg);
			break;
		case 'string' :
			switch(vArg.charAt(0)) {
				case '#':
					var obj = document.getElementById(vArg.substring(1));
					this.elements.push(obj);
					break;
				case '.':
					this.elements = getByClass(document, vArg.substring(1));
					break;
				default:
					this.elements = document.getElementsByTagName(vArg);
			}
			break;
		case 'object':
			this.elements.push(vArg);
	}
}

function $(vArg) {
	return new LiQuery(vArg);
}

// 把click传入fn   LiQuery上面添加了一个click事件  该click是所有对象共享的
LiQuery.prototype.click = function(fn) {
	var i = 0;
	for(i = 0;i < this.elements.length; i++) {
		myAddEvent(this.elements[i], 'click', fn);
	}
}

// 此时候的elements是$()选中的对象
LiQuery.prototype.show = function() {
	var i = 0;
	for(i = 0; i < this.elements.length; i++) {
		this.elements[i].style.display = 'block';
	}
}

LiQuery.prototype.hide = function() {
	var i = 0;
	for(i = 0; i < this.elements.length; i++) {
		this.elements[i].style.display = 'none';
	}
}

LiQuery.prototype.hover = function(fnOver, fnOut) {
	var i = 0;
	for(i = 0; i < this.elements.length; i++) {
		myAddEvent(this.elements[i], 'mouseover', fnOver);
		myAddEvent(this.elements[i], 'mouseout', fnOut);
	}
}

LiQuery.prototype.css = function(attr, value) {
	if(arguments.length == 2) {
		var i = 0;
		for(i = 0; i<this.elements.length; i++) {
			this.elements[i].style[attr] = value;
		}
	} else {
		return getStyle(this.elements[0], attr);
	}
}

LiQuery.prototype.attr = function(attr, value) {
	if(arguments.length == 2) {
		var i = 0;
		for(i = 0; i < this.elements.length; i++) {
			this.elements[i][attr] = value;
		}
	} else {
		return this.elements[0][attr];
	}
}

LiQuery.prototype.toggle = function() {
	var i = 0;
	var _arguments =arguments;
	for(i = 0; i < this.elements,length; i++) {
		addToggle(this.elements[i]);
	}
	function addToggle(obj) {
		var count = 0;
		myAddEvent(obj, 'click', function(){
			_arguments[count++ % _arguments.length].call(obj);
		});
	}
}

LiQuery.prototype.eq = function (n) {
	return $(this.elements[n]);
}

function appendArr(arr1, arr2) {
	var i = 0;
	for(i = 0; i < arr2.length; i++) {
		arr1.push(arr2[i]);
	}
}

// 关键就是elements数组push进去些什么东西
LiQuery.prototype.find = function(str) {
	var i = 0;
	var aResult = [];
	for(i = 0; i < this.elements.length; i++) {
		switch(str.charAt(0)) {
			case '.':
				var aEle = getByClass(this.elements[i], str.substring(1));
				// 数组连接
				aResult = aResult.concat(aEle);
				break;
			default:
				var aEle = this.elements[i].getElementsByTagName(str);
				appendArr(aResult, aEle);
		}
	}
	// 什么都没传进去
	var newLiQuery = $();
	newLiQuery.elements = aResult;
	return newLiQuery;
}

function getIndex(obj) {
	//获取父节点下面的HTMLElement元素
	var aBrother = obj.parentNode.children;
	var i = 0;
	for(i = 0; i < aBrother.length; i++) {
		if(aBrother[i] == obj) {
			return i;
		}
	}
}

LiQuery.prototype.index = function() {
	return getIndex(this.elements[0]);
}

LiQuery.prototype.extend = function(name, fn) {
	LiQuery.prototype[name] = fn;
}



