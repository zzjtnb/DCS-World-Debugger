// var element = document.querySelector('#yourId');
//查询
function hasClass(element, yourClassName) {
  return !!element.className.match(new RegExp("(\\s|^)" + yourClassName + "(\\s|$)"));
  // ( \\s|^ ) 判断前面为空格或起始 （\\s | $ ）判断后面为空格或结束 两个感叹号为转换为布尔值 以方便做判断
};
//增加
function addClass(element, yourClassName) {
  if (!hasClass(element, yourClassName)) {
    element.className += " " + yourClassName;
  };
};
//删除
function removeClass(element, yourClassName) {
  if (hasClass(element, yourClassName)) {
    element.className = element.className.replace(new RegExp("(\\s|^)" + yourClassName + "(\\s|$)"), " ");
  };
};

function t2() {
  document.querySelector("#side").style.display = 'none'
  document.querySelector("#sides").style.display = 'none'
}