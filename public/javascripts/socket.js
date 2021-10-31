let socket = io('ws://localhost:3000');

socket.on('api_loadstring', (data) => {
  interee(data);
});
socket.on('net_dostring', (data) => {
  interee(data);
});

// 发送消息
function sendMessage(event, data) {
  if (!socket) {
    socket.open(); // 开始连接socket
  }
  socket.emit(event, data);
}

function sendLua(type, displayMsg) {
  let luaValue = document.querySelector('#textarea').value;
  if (luaValue) {
    let luaStr = {
      type: type,
      content: luaValue,
    };
    if (displayMsg) {
      console.log(luaValue);
    }
    if (type === 'net_dostring') {
      let myselect = document.querySelector('.state');
      let index = myselect.selectedIndex; // selectedIndex代表的是你所选中项的index
      luaStr.env = myselect.options[index].text;
    }
    this.sendMessage('debuggerLua', luaStr);
  } else {
    let element = document.querySelector('#toast');
    removeClass(element, 'hidden');
  }
}
function clearLua() {
  document.querySelector('#textarea').value = '';
  let parent = document.querySelector('#dcsValue');
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
function interee(data) {
  let element = document.querySelector('.status');
  let statusValue = document.querySelector('.statusValue');
  data.payload.result = formatJSONIndnt(data.payload.result) || '执行成功';

  if (!data.payload.status) {
    data.payload.luacode = data.payload.luacode.replace(/\n/g, '\\n');
    data.payload.result = `执行语句:${data.payload.luacode}\n错误原因:${data.payload.result}`;
  }
  document.querySelector('#dcsValue').innerHTML = `${data.payload.result}`;
  document.querySelectorAll('pre code').forEach((el) => {
    hljs.highlightElement(el);
  });
  if (data.payload.status) {
    removeClass(element, 'bg-red-500');
    addClass(element, 'bg-green-500');
    statusValue.innerHTML = `执行成功:时间:${data.executionTime.os}`;
  } else {
    addClass(element, 'bg-red-500');
    removeClass(element, 'bg-green-500');
    statusValue.innerHTML = `执行失败:时间:${data.executionTime.os}`;
  }
}
