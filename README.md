# Bamboo
A carousel widget. Written in JavaScript without third-party libraries. 
[demo](http://htmlpreview.github.io/?https://github.com/Aaron-Bird/bamboo/blob/master/test/div-response.html)  

[中文文档](docs/README-zh-CN.md)  
## Features
- Compatible with ie9 and above browsers
- Multiple animations
- Response
- Customizable
- Auto play

## Example
A lot of examples can be found under the demo and test folders  
[./demo](/demo)  
[./test](/test)  

## How to use

[./demo/default.html](/demo/default.html) [preview](http://htmlpreview.github.io/?https://github.com/Aaron-Bird/bamboo/blob/master/demo/default.html)  

Loading scripts and css styles
```HTML
<head>
    <link rel="stylesheet" type="text/css" href="css/bamboo.css">
    <script type="text/javascript" src="js/bamboo.js"></script>
</head>
```
Use the "div" element as the container, add "ul" of "class=slides" and place the image in the "li" element
```HTML
<div class="demo">
    <ul class="slides">
        <li><img src="img/1.jpg"></li>
        <li><img src="img/2.jpg"></li>
        <li><img src="img/3.jpg"></li>
        <li><img src="img/4.jpg"></li>
    </ul> 
</div> 
```
Call bamboo with "div" as a parameter
```HTML
<script>
    var element = document.querySelector('.demo');
    var fade = bamboo(element, 'fade');
</script>
```

You can also use "div" to wrap pictures
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
You can also make other elements as carousel content  
[./demo/default-2.html](/demo/default-2.html)  [demo](http://htmlpreview.github.io/?https://github.com/Aaron-Bird/bamboo/blob/master/demo/default-2.html)

## parameter
bamboo(element, animationName, parameters)  

element -- (Type: Element) Container element  
animationName -- (Type: String) Animation effects, value: 'fade' | 'roll' | 'into' | 'blinds' | 'square'  
parameters -- (Type: Object) Other parameters, optional  
- autoPlay -- (Type: Boolean, Defaults: true) Autoplay
- autoFitImg -- (Type: Boolean, Defaults: true) Adjust the picture to fit the container size
- reverse -- (Type: Boolean, Defaults: false) Reverse.When "autoPlay:true" is valid
- timeout -- (Type: Number, Unit: millisecond, Defaults: 2000) Pause time interval
- speed -- (Type: Number, Unit: millisecond) Animation speed
- hideDot -- (Type: Boolean, Defaults: false) Hide navigation dots
- hideArrow -- (Type: Boolean, Defaults: false) Hide the next/previous page switch button
- prev -- (Type: Element) previous page element
- next -- (Type: Element) next page element
- dots -- (Type: Element) container element of navigation dots  

Note: For the usage of prev/next/dots, see [Custom style](#Custom style)

example:
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
## Function
Call Bamboo will return a Object.The following methods can be used:
- run() Start playing
- stop() Pause playback
- toPrev() Go to previous page
- toNext() Go to next page  

example:
```javascript
var element = document.querySelector('.demo');
var sildeshow = bamboo(element, 'fade');

sildeshow.stop()
sildeshow.toPrev()
sildeshow.toNext()
sildeshow.run()
```

## Custom style
Defining an element whose class is "dots" and placing navigation elements in it  
Other special class names are "prev" and "next", which represent the previous/next buttons

[demo/custom-style.html](/demo/custom-style.html) [preview](http://htmlpreview.github.io/?https://github.com/Aaron-Bird/bamboo/blob/master/demo/custom-style.html)  

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
You also need to add the ".focus" style as the focus style  
```HTML
<style>
    .dots>i.focus {
        background-color: #ff0;
    }
</style>
```

If want to put the dots/next/prev button outside the carousel, you need to pass it as a parameter(Because container will automatically add "oveflow: hidden" style)  
[demo/custom-style-2.html](/demo/custom-style-2.html) [preview](http://htmlpreview.github.io/?https://github.com/Aaron-Bird/bamboo/blob/master/demo/custom-style-2.html)
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
