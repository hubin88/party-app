const ip = require('ip').address();

const config = {
  server: {
    host: ip,
    port:2022,
  },
  copyFile: [
    // { from: './single_part', to: './' },
    // { from: './static/config.js', to: './static/config.js' },
    { from: './static', to: './static' },
  ],
  html: [
    /*
      name 生成的文件名 (包括html、js、css)
      title html中<title>标签内容
      entry js入口文件路径
      template 自定义模板文件，相对于public目录，默认为index.html
      links 需要自动插入到<head>标签中的<link>标签，默认为空 (可手动修改模板实现同样效果)
      scripts 需要自动插入到<body>标签底部的<script>标签，默认为空 (可手动修改模板实现同样效果)
    */
    {
      name: 'index',
      title: 'React App',
      entry: './src/index',
      scripts: [
        './static/ueditor/ueditor.config.js',
        './static/ueditor/ueditor.all.js',
        './static/ueditor/lang/zh-cn/zh-cn.js',
      ]
    },
  ],
};

module.exports = config;