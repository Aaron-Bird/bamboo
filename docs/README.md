# bamboo
 
bamboo是一个轮播图插件,由JavaScript编写,无需其他第三方库
[demo](http://htmlpreview.github.io/?https://github.com/Aaron-Bird/bamboo/blob/master/test/div-response.html) 

## 特点
- 兼容ie9及以上浏览器
- 多种切换效果
- 自适应

## 示例
可以在demo和test文件夹下找到大量示例  
[./demo](demo)  
[./test](test)  

## 使用
[demo](http://htmlpreview.github.io/?https://github.com/Aaron-Bird/bamboo/blob/master/demo/default.html)

载入bamboo.css和bamboo.js
```HTML
<head>
  <link rel="stylesheet" type="text/css" href="css/bamboo.css">
  <script type="text/javascript" src="js/bamboo.js"></script>
</head>
```
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

还可以使其他元素作为轮播图内容   
[./demo/default-2.html](demo/default-2.html)  [demo](http://htmlpreview.github.io/?https://github.com/Aaron-Bird/bamboo/blob/master/demo/default-2.html)

## 参数
bamboo(element, animationName, parameters)

element -- (Type: Element) Container element  
animationName -- (Type: String) 动画效果, 可选值: 'fade' | 'roll' | 'into' | 'blinds' | 'square'  
parameters -- (Type: Object) 其他参数,可选
- autoPlay -- (Type: Boolean, Defaults: true) 自动播放
- autoFitImg -- (Type: Boolean, Defaults: true) 自动调整图片,使其适配轮播图容器尺寸
- reverse -- (Type: Boolean, Defaults: false) 倒序播放,当autoPlay:true生效
- timeout -- (Type: Number, Unit: millisecond, Defaults: 2000) 暂停间隔
- speed -- (Type: Number, Unit: millisecond) 动画播放速度
- hideDot -- (Type: Boolean, Defaults: false) 是否隐藏导航圆点
- hideArrow -- (Type: Boolean, Defaults: false) 是否隐藏上/下页切换按钮
- prev -- (Type: Element) 上一页
- next -- (Type: Element) 下一页
- dots -- (Type: Element) 导航按钮

注: prev/next/dots的使用方法见[自定义样式](#自定义样式)
```javascript
var element = document.querySelector('.demo');
var sildeshow = bamboo(element, 'fade', {
    autoPlay: true,
    autoFitImg: true,
    reverse: true,
    timeout: 4000,
    speed: 2000,
    hideDot: true,
    hideArrow: true,
    prev: document.querySelector('.prev'),
    next: document.querySelector('.next'),
    dots: document.querySelector('.dot-container')
});
```
## 方法
bamboo()会返回一个bamboo对象,有以下方法
- run() 开始播放
- stop() 暂停播放
- toNext() 转到下一页
- toPrev() 转到上一页

```javascript
sildeshow.stop()
sildeshow.toPrev()
sildeshow.toNext()
sildeshow.run()
```
## 自定义样式
[demo/custom-style.html](demo/custom-style.html) [preview](http://htmlpreview.github.io/?https://github.com/Aaron-Bird/bamboo/blob/master/demo/custom-style.html)  

定义一个class名为dots的元素,将导航元素放在其中  
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
[demo/custom-style-2.html](demo/custom-style-2.html) [preview](http://htmlpreview.github.io/?https://github.com/Aaron-Bird/bamboo/blob/master/demo/custom-style-2.html)
```html
<div class="demo"> 
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
