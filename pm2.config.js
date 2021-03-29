// 名称任意，按照个人习惯来
module.exports = {
  apps: [
    {
      name: 'DCS World', // 应用名称
      script: './bin/www', // 启动文件地址
      cwd: './', // 当前工作路径
      //监听模式,不能单纯的设置为true,易导致无限重启,因为日志文件在变化,需要排除对其的监听
      // watch: [  "bin", ],
      watch: true,
      ignore_watch: [  // 忽视这些目录的变化
        'node_modules',
        'logs',
        'public',
      ],
      // node_args: '--insecure-http-parser', // node的启动模式
      env: {
        NODE_ENV: 'development', //启动默认模式,设置运行环境,此时process.env.NODE_ENV的值就是development
      },
      env_production: {
        NODE_ENV: 'production', //使用production模式 pm2 start ecosystem.config.js --env production
      },
      instances: "max", //将应用程序分布在所有CPU核心上,可以是整数或负数,应用启动实例个数，仅在cluster模式有效 默认为fork；或者 max
      exec_mode: "cluster",
      out_file: './logs/pm2/out.log', // 普通日志路径
      error_file: './logs/pm2/err.log', // 错误日志路径
      merge_logs: true,//集群情况下，可以合并日志
      log_date_format: 'YYYY-MM-DD HH:mm Z', //日志文件名输出日期格式
    },
  ],
};

