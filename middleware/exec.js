const exec = require('child_process').exec;
function doShell(command) {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
    } else {
      console.log(stdout, stderr)
    }
  })
}
let command = 'netstat -aon|findstr "3000"'
doShell(command)
// taskkill -PID 进程号 -F
module.exports = doShell