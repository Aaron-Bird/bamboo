# bamboo

bamboo是一个轮播图插件,由JavaScript编写,无需其他第三方库

## 特点
- 兼容ie9及以上浏览器
- 多种切换效果
- 自适应

## 示例
在项目的demo和test文件夹中有很多范例,例如

http://htmlpreview.github.io/?https://github.com/Aaron-Bird/bamboo/blob/master/test/index.html

## 载入
将bamboo.css和bamboo.js在使用前载入
```HTML
<head>
  <link rel="stylesheet" type="text/css" href="css/bamboo.css">
  <script type="text/javascript" src="js/bamboo.js"></script>
</head>
```
## 使用
[demo](http://htmlpreview.github.io/?https://github.com/Aaron-Bird/bamboo/blob/master/demo/default.html)

创建一个div作为容器,在其中加入一个class名为slides的元素,将图片放在li中  
```HTML
<div class="demo">
    <ul class="slides">
        <li><img src="img/1.jpg"></li>
        <li><img src="img/2.jpg"></li>
        <li><img src="img/3.jpg"></li>
        <li><img src="img/4.jpg"></li>
    </ul> 
</div>  
<script>
var element = document.querySelector('.demo');
var fade = bamboo(element);
</script>
```
也可以使用div包裹图片
```HTML
<div class="demo">
    <div class="slides">
        <div><img src="img/1.jpg"></div>
        <div><img src="img/2.jpg"></div>
        <div><img src="img/3.jpg"></div>
        <div><img src="img/4.jpg"></div>
    </div> 
</div>  
<script>
var element = document.querySelector('.demo');
var fade = bamboo(element);
</script>
```
不只是图片,还可以将HMTL文档作为轮播内容 
[demo](http://htmlpreview.github.io/?https://github.com/Aaron-Bird/bamboo/blob/master/demo/default-2.html)

## 参数
bamboo(element, animationName, parameters)
- element(Element) 
- animationName(Str) 动画效果,可选.值: 'fade' | 'roll' | 'into' | 'blinds' | 'square'
- parameters({}) 参数,可选
  - autoPlay(Boolean) 自动播放,默认值: true
  - autoFitImg 自动调整图片大小/位置,使其适配轮播图尺寸,默认值: true
  - reverse(Boolean) 倒序播放,当autoPlay:true生效,默认值: false
  - timeout(Number) 暂停间隔,单位为毫秒,默认值: 2000
  - speed(Number) 动画播放速度,单位为毫秒
  - hideDot(Boolean) 是否隐藏导航圆点,默认值: false
  - hideArrow(Boolean) 是否隐藏上/下页切换按钮,默认值: false
  - prev(Element) 上一页
  - next(Element) 下一页
  - dots(Element) 导航按钮
  
```javascript
var element = document.querySelector('.demo');
var sildeshow = bamboo(element, 'fade', {
  speed: 2000,
  timeout: 4000,
  hideDot: true,
});
```
## 方法
bamboo()会返回一个bamboo对象,有以下方法
- run() 开始播放
- stop() 暂停播放
- toNext() 转到上一页
- toPrev() 转到下一页
例
```javascript
var element = document.querySelector('.demo');
var sildeshow = bamboo(element);
// 停止播放
sildeshow.stop()
// 转到上一页
sildeshow.toPrev()
// 转到下一页
sildeshow.toNext()
```
### 自定义样式
[demo](http://htmlpreview.github.io/?https://github.com/Aaron-Bird/bamboo/blob/master/demo/custom-style.html)

定义一个class名为dots的元素,将导航元素放在其中

bamboo会自动搜索class名为dots的元素,将其子元素视为导航按钮

其他特殊class名还有prev和next,分别表示前/后页按钮
```html
<div>
    <div class="slides">
        <div><img src="img/1.jpg"></div>
        <div><img src="img/2.jpg"></div>
        <div><img src="img/3.jpg"></div>
        <div><img src="img/4.jpg"></div>
    </div> 
    <div class="dots">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
    </div>
    <div>
        <i class="prev"></i>
        <i class="next"></i>
    </div>
</div> 
```
还需要为导航元素添加一个.focus样式,作为获得焦点样式
```HTML
<style>
.dots>i.focus {}
</style>
```

bamboo会自动给轮播图容器添加overflow: hidden样式

如果想把导航和前/后页切换按钮放在轮播图外,需在调用bamboo时将其作为参数传入

[demo](http://htmlpreview.github.io/?https://github.com/Aaron-Bird/bamboo/blob/master/demo/custom-style-2.html)
```html
<div>
    <div class="slides">
        <div><img src="img/1.jpg"></div>
        <div><img src="img/2.jpg"></div>
        <div><img src="img/3.jpg"></div>
        <div><img src="img/4.jpg"></div>
    </div> 
</div> 
<div class="my-dots">
    <i></i>
    <i></i>
    <i></i>
    <i></i>
</div>
<div>
    <i class="my-prev"></i>
    <i class="my-next"></i>
</div>
<script>
var element = document.querySelector('.demo');
var fade = bamboo(element,'fade', {
  dots: document.querySelector('my-dots');
  prev: document.querySelector('my-prev');
  next: document.querySelector('my-next');
});
</script>
```
