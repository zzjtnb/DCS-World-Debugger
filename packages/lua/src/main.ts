// print(_VERSION) // Editor and transpiler know what print and _VERSION are
// // Tools.dostring_in = function(code)
// //   code = [[a_do_script("]] .. code .. [[")]]
// //   local result, status = net.dostring_in('mission', code) -- res is a string
// //   net.log('执行结果:', result, status)
// // end

function dostring_in(code: string) {
  const data = {
    id: '',
    type: 'serverStatus',
    sent: 1669024862,
    payload: {
      data: {
        msg: '启动DCS API CONTROL服务器',
      },
    },

  }
  const dataJSON = JSON.stringify(data)
  code = `a_do_script(TCP.send(${dataJSON}))`
  // code = code.replace('"', '\'')
  // code = `a_do_script(${code})`
  console.log(code)
}
dostring_in('')
