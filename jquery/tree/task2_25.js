var searchWrap = $('.search'),
	root = $('.root'),
	searchText = '',//要搜索的文本
	addText = '',//要添加的文本
	nodeSelected = null,//保存选中的数据
	nodeList = [],//保存渲染所用的数据
	timer = null,//记录超时调用函数返回的id
	currentQueue = null,//广度优先搜索处理的当前节点
	queue = [];//广度优先搜索的队列，通过控制进队出队为currentQueue赋值
	
function init() {
	var divs = $('div:not(.root)');
	//给页面添加加减号。。。放在html里面太丑了
	//同时隐藏内部页面结构
	divs.addClass('hide');
	var plus = $('<span>+</span>');
	var minus = $('<span>-</span>');
	minus.addClass('hide');
	$('div').prepend(plus).prepend(minus);
}
init();

//事件委托
searchWrap.click(render);
root.click(isSelected);

//渲染
function render(event) {
	var target = event.target;
	switch(target.value) {
		case '搜索':
			reset();
			traverseDF(root[0]);
			changeColor(searchText);
			break;
		case '删除':
			reset();
			removeNode();
			break;
		case '添加':
			reset();
			addNode();
			break;
		default:
			break;
	}
}

//深度优先遍历
function traverseDF(node) {
	if (node && node.nodeName.toLowerCase() === 'div') {
		nodeList.push(node);
		for (var i = 0; i < node.children.length; i++) {
			traverseDF(node.children[i]);
		}
	}
}

//延迟改变背景色
function changeColor(text) {
	if (text) {
		if (searchText === nodeList[0].childNodes[2].nodeValue) {
			nodeList[0].style.backgroundColor = 'red';
		} else {
			nodeList[0].style.backgroundColor = 'blue';
		}
	} else {
		nodeList[0].style.backgroundColor = 'blue';
	}
	timer = setTimeout(colorC, 500);
}

//延迟函数所调用的函数
function colorC() {
	num++;
	if (num < nodeList.length){
		if (searchText === nodeList[num].childNodes[2].nodeValue) {
			nodeList[num-1].style.backgroundColor = 'white';
			nodeList[num].style.backgroundColor = 'red';
			show(nodeList[num].parentNode);
		} else {
			if (nodeList[num-1].style.backgroundColor === 'red') {
				nodeList[num].style.backgroundColor = 'blue';
			} else {
				nodeList[num-1].style.backgroundColor = 'white';
				nodeList[num].style.backgroundColor = 'blue';
			}
		}
		timer = setTimeout(colorC, 500);
	} else {
		nodeList[num-1].style.backgroundColor = 'white';
	}
}

//通过递归解决搜索项自动展开需求
function show(node) {
	if(node.nodeName.toLowerCase() == 'div') {
		for (var i = 0; i < nodeList[num].parentNode.children.length; i++) {
			if (node.children[i].nodeName.toLowerCase() !== 'span') {
				node.children[i].classList.remove('hide');
			}
		}
	show(node.parentNode);
	}
}

//点击按钮后重置数据并取消超时调用
function reset() {
	nodeList = [];
	num = 0;
	clearTimeout(timer);
	searchText = $('input[type=text]:eq(0)').val();
	addText = $('input[type=text]:eq(1)').val();
	$('div').css({backgroundColor: 'white'});
}

//确定点击选择到的元素
function isSelected(event) {
	reset();
	var target = event.target;
	switch(target.nodeName.toLowerCase()) {
		case 'div':
			if (nodeSelected !== null) {
				nodeSelected.style.backgroundColor = 'white';
			}
			target.style.backgroundColor = 'orange';
			nodeSelected = target;
			break;
		case 'span':
			toggleClass(target);
			break;
		default:
			break;
	}
}

//删除选中节点
function removeNode() {
	if (nodeSelected) {
		nodeSelected.parentNode.removeChild(nodeSelected);
	}
}

//添加节点
function addNode() {
	if (addText) {
		var newNode = $('<div>' + addText + '</div>');
		newNode.addClass('new-node');
		//添加 加减号
		var plus = $('<span>+</span>');
		var minus = $('<span>-</span>');
		minus.addClass('hide');
		newNode.prepend(minus).prepend(plus);
		nodeSelected.append(newNode);
	}
}

//切换隐藏和展示状态，可以改进
function toggleClass(node) {
	if (node.parentNode.children.length > 2) {
		for (var i = 0; i < node.parentNode.children.length; i++) {
			node.parentNode.children[i].classList.toggle('hide');
		}
	}
}

