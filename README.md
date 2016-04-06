# hexo-qiniu

> hexo 七牛插件

## 安装

``` sh
$ npm install --save 52cik/hexo-qiniu
```

## 使用

打开 _config.yml 文件，在任意你喜欢的位置加上如下配置:

``` yml
qiniu:
  access_key: AccessKey
  secret_key: SecretKey
  bucket: 空间名
  static_dir: 静态资源目录
  ignoring_log: 是否显示忽略文件日志
  ignoring_files: # 忽略的文件列表
    - '**/.DS_Store'
```

> * `AccessKey` 和 `SecretKey` 可以在 <https://portal.qiniu.com/setting/key> 页面得到
> * 空间名 是将本地文件上传到这个指定的空间下
> * static_dir 是本地资源文件路径，最好单独一个文件夹，例如 `static` 目录
> * ignoring_log 是否输出忽略文件日志
> * ignoring_files 要忽略的文件名，例如mac下的.DS_Store以及win下的thumbs.db这种烦人的东西


### 实例

例如我的博客目录如下:

```
myblog
├── _config.yml
├── db.json
├── package.json
├── public
├── scaffolds
├── source
├── static 静态文件目录
│   ├── assets js/css/img/fonts等
│   └── pics 博客配图
└── themes
```

我的配置如下:

``` yml
## 七牛插件
qiniu:
  access_key: zwfcmdQqm4BTyRmjDmTGbzBf80Hw_**********
  secret_key: MfZjSKCZdmzKKAQFEbmuZGN4CUOv-**********
  bucket: bolg-52cik
  static_dir: static
  ignoring_log: true
  ignoring_files:
    - '**/.DS_Store'
```


## 控制台命令

上面配置好参数后，即可使用七牛插件了。
你可以在你的博客目录下直接输入 `hexo` 回车，即可看到插件提示。

使用方法:

``` sh
$ hexo qn # 显示帮助
$ hexo qn s # 上传新的文件
$ hexo qn s2 # 上传新的以及更新过的文件
```

