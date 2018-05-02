var bamboo = (function(){

    function hasClass(element, className) {
        var regExp = new RegExp('(\\s|^)'+ className +'(\\s|$)');
        return regExp.test(element.className);
    }

    function addClass(element, className) {
        if ('classList' in document.documentElement) {
            element.classList.add(className);
        } else if (!hasClass(element, className)) {
            element.className += ' ' + className;
        }
    }

    function removeClass(element, className) {
        if ('classList' in document.documentElement) {
            element.classList.remove(className);
        } else if (hasClass(element, className)) {
            var regExp = new RegExp(className +'(\\s|$)');
            element.className = element.className.replace(regExp, '');
        }
    }

    function supportTransition() {
        if ('transition' in document.documentElement.style) {
            return true;
        }
        return false;
    }
    function resizeDetect(element, callback){
        // When the element size changes, call the callback function
        // parameter
        // element (Object) The monitored element
        // callback (Function) Invoked after the element size changes
        var isJsTrigger = false;
        function reset() {
            // Reset the scroll bar to the right
            isJsTrigger = true;
            expand.scrollLeft = 100000;
            expand.scrollTop = 100000;
            shrink.scrollLeft = 100000;
            shrink.scrollTop = 100000;
            setTimeout(function(){
                isJsTrigger = false;
            }, 1000 / 20);
        }
        function onscroll() {
            if (!isJsTrigger){
                callback();
            }  
            reset();     
        }
        var expand = document.createElement('div');
        var shrink = document.createElement('div');
        var expandChild = document.createElement('div');
        var shrinkChild = document.createElement('div');

        containerStyle = 'position: absolute; top: 0; left: 0;bottom: 0; right: 0;overflow: scroll; visibility: hidden;z-index: -1';
        expand.className = 'expend-detect';
        expand.style.cssText = containerStyle;
        shrink.className = 'shrink-detect';
        shrink.style.cssText = containerStyle; 
        expandChild.style.width = '100000px';
        expandChild.style.height = '100000px';
        shrinkChild.style.width = '300%';
        shrinkChild.style.height = '300%';
    
        expand.appendChild(expandChild);
        shrink.appendChild(shrinkChild);
        element.appendChild(expand);
        element.appendChild(shrink);
        reset();
        expand.addEventListener('scroll', onscroll);
        shrink.addEventListener('scroll', onscroll);
    }
    function jsAnimation(start, end, duration, element, property, valueUnit) {
        // Use js animation transition, similar to css transition
        // parameter
        // start (Number) The starting value
        // end (Number) The end value
        // duration (Number, milliseconds) Duration of the animation
        // element (Object) Dom element
        // property (str) element style attribute name, for example: 'marginTop'
        // valueUnit (str) optional, element style attribute value unit, for example: 'px'
        // example:
        // jsAnimation (0, 1, 1000, doucment.body, 'opacity');
        start = parseInt(start);
        end = parseInt(end);
        duration = parseInt(duration);
        valueUnit = (valueUnit !== undefined) ? valueUnit : '';
        function _easeInQuad(t, b, c, d) {
            t /= d;
            return c*t*t + b;
        }
        function _easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        function _linearTween(t, b, c, d) {
            return c*t/d + b;
        };

        var startTime = new Date().getTime();
        var animation = setInterval(function() {
            var currentTime = new Date().getTime() - startTime;
            var percentage = currentTime / duration;
            if (percentage < 1) {
                element.style[property] = _easeInQuad(currentTime, start, end - start, duration) + valueUnit;
            } else {
                element.style[property] = end + valueUnit;
                clearInterval(animation);
            }
        }, 13);
        return animation;
    }

    var Bamboo = {
        createNew: function(slideshowElement, parameters) {
            var p = parameters || {};
            var slideshow = {
                slideshowElement: slideshowElement,
                slidesElement: slideshowElement.querySelector('.slides'),
                dotsElement: (p.dots !== undefined) ? p.dots : slideshowElement.querySelector('.dots'),
                prev: (p.prev !== undefined) ? p.prev :slideshowElement.querySelector('.prev'),
                next: (p.next !== undefined) ? p.next : slideshowElement.querySelector('.next'),
                hideDot: p.hideDot !== undefined ? p.hideDot : false,
                hideArrow: p.hideArrow !== undefined ? p.hideArrow : false,

                width: p.width !== undefined ? p.width : slideshowElement.clientWidth,
                height: p.height !== undefined ? p.height : slideshowElement.clientHeight,
                backgroundColor: p.backgroundColor,
                index: p.index !== undefined ? p.index : 0,
                vertical: p.vertical !== undefined ? p.vertical : false,
                speed: p.speed,
                autoPlay: p.autoPlay !== undefined ? p.autoPlay : true,
                autoFitImg: p.autoFitImg !== undefined ? p.autoFitImg : true,
                reverse: p.reverse !== undefined ? p.reverse : false,
                timeout: p.timeout !== undefined ? p.timeout : 2000,
                jsAnime: p.jsAnime !== undefined ? p.jsAnime : false,
                
                pause: false,
                // toward: p.toward !== undefined ? p.toward : 'horizontal',
            };

            slideshow._init = function() {
                var _this = this;

                if (!this.slidesElement) {
                    throw "Not slides found";
                }

                // slide automatically resize when the container changes size
                resizeDetect(this.slideshowElement, function(){
                    _this.resetSlideSize(); 
                    if (_this.autoFitImg) {
                        _this.fitImg();
                    }
                });

                this.slideList = this.slidesElement.children;
                addClass(this.slideshowElement, 'bamboo');
                // dots
                if (!this.dotsElement) {
                    // create a navigation button
                    var dotsEelement = document.createElement('ul');
                    addClass(dotsEelement, 'bamboo-dots');
                    for (var i = 0; i < this.slideList.length; i++) {
                        var dotElement = document.createElement('li');
                        addClass(dotElement, 'dot');
                        dotsEelement.appendChild(dotElement);
                    }
                    this.dotsElement = dotsEelement;
                    // if (this.showDot) {
                    if (!this.hideDot) {
                        this.slideshowElement.appendChild(this.dotsElement);
                    }
                }
                this.dots = this.dotsElement.children;
                
                if (!this.prev) {
                    // create previous button
                    this.prev = document.createElement('i');
                    addClass(this.prev, 'bamboo-prev');
                    if (!this.hideArrow) {
                        this.slideshowElement.appendChild(this.prev);
                    }
                }
                if (!this.next) {
                    // create next button
                    this.next = document.createElement('i');
                    addClass(this.next, 'bamboo-next');
                    if (!this.hideArrow) {
                        this.slideshowElement.appendChild(this.next);
                    }
                }
                
                for (var i = 0; i < this.slideList.length; i++) {
                    // Set the height and width of the slide
                    var slide = this.slideList[i];
                    addClass(slide, 'slide');
                    slide.style.width = this.width + 'px';
                    slide.style.height = this.height + 'px';
                }

                // nav init
                for (var i = 0; i < this.dots.length; i++) {
                    var dotEle = _this.dots[i];
                    dotEle.setAttribute('data-index', i);
                    dotEle.addEventListener('mouseenter', function(event) {
                        var index = Number(this.getAttribute('data-index'));
                        if (index != _this.index) {
                            _this.setFocus(index, 'dot');
                        }
                    });
                }
                // mouse event
                // Pauses autoplay when the mouse is on the carousel
                this.slideshowElement.addEventListener('mouseenter', function() {
                    _this.pause = true;
                });
                // When the mouse left the carousel, resume autoplay
                this.slideshowElement.addEventListener('mouseleave', function() {
                    _this.pause = false;
                });
                // Previous button
                this.prev.addEventListener('click', function() {
                    _this.setFocus(_this.index - 1, 'left-key');
                });
                // Next button
                this.next.addEventListener('click', function() {
                    _this.setFocus(_this.index + 1, 'right-key');
                });
                // Change the picture size and coordinates to fit the carousel size
                if (this.autoFitImg) {
                    var imgList = this.slidesElement.querySelectorAll('img');
                    for (var i = 0; i < imgList.length; i++){
                        var img = imgList[i];
                        this.resizeImg(img);
                        img.addEventListener('load',this.resizeImg.bind(this,img));
                    }
                }
                
                if (this.backgroundColor) {
                    // set the background color
                    this.slidesElement.style.backgroundColor = this.backgroundColor;
                    var len = this.slideList.length;
                    for (var i = 0; i < len; i++) {
                        this.slideList[i].style.backgroundColor = this.backgroundColor;
                    }
                }
                
                if (this.jsAnime) {
                    // Use js to calculate animation transition
                    // Remove the transition property to prevent css animation and js animation conflict
                    this.slidesElement.style.transition = 'none';
                    for (var i = 0; i < this.slideList.length; i++) {
                        this.slideList[i].style.transition = 'none';
                    }
                }
            };
            slideshow.resetSlideSize = function() {
                // resize the slide size to match the slideshow
                for (var i = 0; i < this.slideList.length; i++) {
                    var slide = this.slideList[i];
                    this.width = this.slideshowElement.clientWidth;
                    this.height = this.slideshowElement.clientHeight;
                    slide.style.width = this.width + 'px';
                    slide.style.height = this.height + 'px';
                }                
            };

            slideshow.resizeImg = function(imgElement) {
                addClass(imgElement, 'fit-img');
                var imgHeight = imgElement.clientHeight;
                var t = this.width / imgElement.clientWidth;
                if (imgHeight * t > this.height) {
                    imgElement.style.height = 'auto';
                    imgElement.style.width = this.width + 'px';
                } else {
                    imgElement.style.width = 'auto';
                    imgElement.style.height = this.height + 'px';
                }
            };

            slideshow.fitImg = function(){
                // resize the image to match the slideshow 
                var imgList = this.slidesElement.querySelectorAll('img');
                var len = imgList.length;
                for (var i = 0; i < len; i++) {
                    this.resizeImg(imgList[i]);
                }
            };
            slideshow.run = function() {
                // start playing the slideshow
                this.speed = (this.speed !== undefined) ? this.speed : 1000;
                if (this._runAnimation) {
                    clearInterval(this._runAnimation);
                }

                var _this = this;
                this._runAnimation = setInterval(function() {
                    if (!_this.pause) {
                        var index = (_this.reverse) ? _this.index - 1 : _this.index + 1;
                        _this.setFocus(index);
                    }
                }, this.timeout + this.speed);
            };
            slideshow.stop = function() {
                // Stop playing the slideshow 
                if (this._runAnimation) {
                    clearInterval(this._runAnimation);
                }
            };
            slideshow.toNext = function(){
                // jump to the previous page
                this.setFocus(this.index + 1, 'left-key');
            };
            slideshow.toPrev = function(){
                // jump to the next page
                this.setFocus(this.index - 1, 'right-key');
            };
            slideshow.setFocus = function(index, whoTrigger) {
                // jump to the page by index
                if (this.jsAnime || !supportTransition()) {
                    slideshow.focusByJs(index, whoTrigger);
                } else {
                    slideshow.focusByCss(index, whoTrigger);
                }
            };
            slideshow.getFocus = function(){
                // get the index of the currently displayed page
                return this.index;
            };
            slideshow.dotFocus = function(index) {
                // switch the focus of the nav
                var dLen = this.dots.length;
                for (var i = 0; i < dLen; i++) {
                    var dotEle = this.dots[i];
                    removeClass(dotEle, 'focus');
                }
                addClass(this.dots[index], 'focus');
            };
            slideshow._init();
            return slideshow;
        }
    };

    var Roll = {
        createNew: function(slideshowElement, parameters) {
            var slideshow = Bamboo.createNew(slideshowElement, parameters);
            slideshow.init = function() {
                this.animationType = 'roll';
                addClass(this.slideshowElement, 'roll');

                this.speed = (this.speed !== undefined) ? this.speed : 200;
                this.slidesElement.style.transitionDuration = this.speed / 1000 + 's';
                
                if (!this.vertical) {
                    addClass(this.slideshowElement, 'roll-horizontal');
                }

                var endSlide = this.slideList[0].cloneNode(true);
                this.slidesElement.appendChild(endSlide);
                this.setFocus(this.index);

                if (this.autoPlay) {
                    this.run();
                }
            };
            slideshow.moveTo = function(distance) {
                var style = this.slidesElement.style;
                if (this.vertical) {
                    // scroll vertically
                    if (this.jsAnime || !supportTransition()) {
                        style.marginTop = distance + 'px';
                    } else {
                        style.transform = 'translate3d( 0px, ' + distance + 'px, 0px)';
                    }
                } else {
                    // scroll horizontally
                    if (this.jsAnime || !supportTransition()) {
                        style.marginLeft = distance + 'px';
                    } else {
                        style.transform = 'translate3d(' + distance + 'px, 0px, 0px)';
                    }
                }
            };

            slideshow.resetTo = function(distance) {
                // reset the moving distance without animating
                var transitionProperty = getComputedStyle(this.slidesElement, null).getPropertyValue('transition-property');
                this.slidesElement.style.transitionProperty = 'none';
                this.moveTo(distance);
                this.slidesElement.style.display = document.defaultView.getComputedStyle(this.slidesElement)['display'];
                this.slidesElement.style.transitionProperty = transitionProperty || 'all';
            };
            slideshow.focusByCss = function(index, whoTrigger) {
                var moveDistance = (this.vertical) ? this.height : this.width;
                var slidesLength = this.slideList.length;
                if (index === -1) {
                    this.resetTo(-(slidesLength - 1) * moveDistance);
                    index = (slidesLength - 1) - 1;
                } else if (index === slidesLength) {
                    this.resetTo(0);
                    index = 1;
                } else if (this.index === slidesLength - 1 && whoTrigger === 'dot') {
                    this.resetTo(0);
                }

                this.moveTo(-(index * moveDistance));

                var dotIndex = (index === slidesLength - 1) ? 0 : index;
                this.dotFocus(dotIndex);
                this.index = index;
            };
            slideshow.focusByJs = function(index, whoTrigger) {
                var moveDistance = (this.vertical) ? this.height : this.width;

                var start;
                var slidesLength = this.slideList.length;
                if (index === -1) {
                    var distance = -(slidesLength - 1) * moveDistance;
                    this.resetTo(distance);
                    index = (slidesLength - 1) - 1;
                    start = distance;
                } else if (index === slidesLength) { 
                    this.resetTo(0);
                    index = 1;
                    start = 0;
                } else if (this.index === slidesLength - 1 && whoTrigger === 'dot') {
                    this.resetTo(0);
                    start = 0;
                } else {
                    start = -(this.index * moveDistance);
                }
                var end = -(index * moveDistance);

                var property = (this.vertical) ? 'marginTop' : 'marginLeft';
                if (this.animation) {
                    clearInterval(this.animation);
                    // this.slidesElement.style[property] = start + 'px';
                }
                this.animation = jsAnimation(start, end, this.speed, this.slidesElement, property, 'px');
                
                var dotIndex = (index === slidesLength - 1) ? 0 : index;
                this.dotFocus(dotIndex);
                this.index = index;
            };

            slideshow.init();
            return slideshow;
        },
    };

    var Fade = {
        createNew: function(slideshowElement, parameters) {
            var slideshow = Bamboo.createNew(slideshowElement, parameters);
            slideshow.init = function() {
                this.animationType = 'fade';
                this.speed = (this.speed !== undefined) ? this.speed : 400;
                for (var i = 0; i < this.slideList.length; i++) {
                    this.slideList[i].style.transitionDuration = this.speed / 1000 + 's';
                }
                addClass(this.slideshowElement, 'fade');
                this.setFocus(this.index);
                if (this.autoPlay) {
                    this.run();
                }
            };
            slideshow.focusByCss = function(index, whoTrigger) {
                if (index === -1) {
                    index = this.slideList.length - 1;
                } else if (index === this.slideList.length) {
                    index = 0;
                }

                for (var i = 0; i < this.slideList.length; i++) {
                    this.slideList[i].style.zIndex = '0';
                    this.slideList[i].style.visibility = 'hidden';
                }

                var current = this.slideList[index];
                var previous = this.slideList[this.index];
                var saveTransitionProperty = getComputedStyle(current, null).getPropertyValue('transition-property');
                current.style.transitionProperty = 'none';
                previous.style.zIndex = '1';
                current.style.zIndex = '2';
                current.style.opacity = '0';
                current.style.visibility = 'visible';
                previous.style.visibility = 'visible';
                current.style.display = document.defaultView.getComputedStyle(current)['display'];
                current.style.transitionProperty = saveTransitionProperty || 'all';

                current.style.opacity = '1';

                this.dotFocus(index);
                this.index = index;
            };
            slideshow.focusByJs = function(index, whoTrigger) {
                if (this.animation) {
                    clearInterval(this.animation);
                }

                if (index === -1) {
                    index = this.slideList.length - 1;
                } else if (index === this.slideList.length) {
                    index = 0;
                }

                for (var i = 0; i < this.slideList.length; i++) {
                    this.slideList[i].style.zIndex = '0';
                    this.slideList[i].style.visibility = 'hidden';
                }

                var current = this.slideList[index];
                var previous = this.slideList[this.index];
                current.style.zIndex = '2';
                previous.style.zIndex = '1';
                current.style.opacity = '0';
                current.style.visibility = 'visible';
                previous.style.visibility = 'visible';

                this.animation = jsAnimation(0, 1, this.speed, this.slideList[index], 'opacity');

                this.dotFocus(index);
                this.index = index;
            };

            slideshow.init();
            return slideshow;
        },
    };

    var Into = {
        createNew: function(slideshowElement, parameters) {
            var slideshow = Bamboo.createNew(slideshowElement, parameters);
            slideshow.init = function() {
                this.animationType = 'into';
                addClass(this.slideshowElement, 'into');

                this.speed = (this.speed !== undefined) ? this.speed : 200;
                for (var i = 0; i < this.slideList.length; i++) {
                    this.slideList[i].style.transitionDuration = this.speed / 1000 + 's';
                };
                
                this.setFocus(this.index);
                if (this.autoPlay) {
                    this.run();
                }
            };
            slideshow.focusByCss = function(index, whoTrigger) {
                var previousIndex = this.index;
                if (index === -1) {
                    index = this.slideList.length - 1;
                } else if (index === this.slideList.length) {
                    index = 0;
                }

                var startPosition;
                if (index > previousIndex) {
                    startPosition = '100%';
                } else if (index < previousIndex) {
                    startPosition = '-100%';
                }

                if (index === 0 && previousIndex === this.slideList.length - 1) {
                    startPosition = '100%';
                } else if (index === this.slideList.length - 1 && previousIndex === 0) {
                    startPosition = '-100%';
                } else if (whoTrigger === 'dot') {
                    startPosition = '-100%';
                }

                for (var i = 0; i < this.slideList.length; i++) {
                    this.slideList[i].style.zIndex = '0';
                }

                var current = this.slideList[index];
                var previous = this.slideList[this.index];
                // var transitionProperty = current.style.transitionProperty;
                var transitionProperty =  getComputedStyle(current, null).getPropertyValue('transition-property');
                current.style.zIndex = '2';
                previous.style.zIndex = '1';
                current.style.transitionProperty = 'none';
                current.style.transform = 'translate3d(0px, ' + startPosition + ', 0px)';
                current.style.display = document.defaultView.getComputedStyle(current)['display'];
                current.style.transitionProperty = transitionProperty || 'transform';

                current.style.transform = 'translate3d(0px, 0px, 0px)';

                this.dotFocus(index);
                this.index = index;
            };
            slideshow.focusByJs = function(index, whoTrigger) {
                var previousIndex = this.index;
                if (index === -1) {
                    index = this.slideList.length - 1;
                } else if (index === this.slideList.length) {
                    index = 0;
                }

                var startPosition;
                if (index > previousIndex) {
                    startPosition = this.height;
                } else if (index < previousIndex) {
                    startPosition = -this.height;
                }

                if (index === 0 && previousIndex === this.slideList.length - 1) {
                    startPosition = this.height;
                } else if (index === this.slideList.length - 1 && previousIndex === 0) {
                    startPosition = -this.height;
                } else if (whoTrigger === 'dot') {
                    startPosition = -this.height;
                }

                for (var i = 0; i < this.slideList.length; i++) {
                    this.slideList[i].style.zIndex = '0';
                }

                var current = this.slideList[index];
                var previous = this.slideList[this.index];
                // var transitionProperty = current.style.transitionProperty;
                var transitionProperty =  getComputedStyle(current, null).getPropertyValue('transition-property');
                current.style.zIndex = '2';
                previous.style.zIndex = '1';
                current.style.marginTop = startPosition + 'px';
                jsAnimation(startPosition, 0, this.speed, current, 'marginTop', 'px');

                this.dotFocus(index);
                this.index = index;
            };

            slideshow.init();
            return slideshow;
        },
    };

    var Blinds = {
        createNew: function(slideshowElement, parameters) {
            var slideshow = Bamboo.createNew(slideshowElement, parameters);
            slideshow.init = function() {
                this.animationType = 'blinds';
                addClass(this.slideshowElement, 'blinds');

                this.speed = (this.speed !== undefined) ? this.speed : 600;
                this.slideList[this.index].style.zIndex = '2';

                var next = (this.index < this.slideList.length - 1) ? this.index + 1 : 0;
                this.slideList[next].style.zIndex = '1';
                this.dotFocus(this.index);

                if (this.autoPlay) {
                    this.run();
                }
            };
            slideshow.focusByCss = function(index, whoTrigger) {
                if (index === -1) {
                    index = this.slideList.length - 1;
                } else if (index === this.slideList.length) {
                    index = 0;
                }

                var current = this.slideList[index];
                var previous = this.slideList[this.index];
                current.style.zIndex = '1'; 
                previous.style.zIndex = '0';

                var temp = this.slideshowElement.querySelector('.tempSlide');
                if (temp) {
                    temp.parentElement.removeChild(temp);
                }
                temp = document.createElement('div');
                addClass(temp, 'tempSlide');
                temp.style.zIndex = '2';
                temp.style.width = this.width + 'px';
                temp.style.height = this.height + 'px';
                var num = 8;
                for (var i = 0; i < num; i++) {
                    var child = document.createElement('div');
                    child.style.width = 100 / num + '%';
                    child.style.height = '100%';
                    child.style.left = i * (this.width / num) + 'px';
                    child.style.transitionDuration = this.speed / 1000 + 's';
                    var previousClone = previous.cloneNode(true);
                    previousClone.style.left = -(this.width / num) * i + 'px';
                    child.appendChild(previousClone);
                    temp.appendChild(child);
                }
                this.slideshowElement.appendChild(temp);

                for (var i = 0; i < temp.children.length; i++) {
                    var child = temp.children[i];
                    child.style.display = document.defaultView.getComputedStyle(child)['display'];
                    child.style.width = 0;  
                }

                this.dotFocus(index);
                this.index = index;
            };
            slideshow.focusByJs = function(index, whoTrigger) {
                var prevIndex = this.index;

                if (index === -1) {
                    index = this.slideList.length - 1;
                } else if (index === this.slideList.length) {
                    index = 0;
                }

                var current = this.slideList[index];
                var previous = this.slideList[this.index];
                current.style.zIndex = '1'; 
                previous.style.zIndex = '0';

                var temp = this.slideshowElement.querySelector('.tempSlide');
                if (temp) {
                    clearInterval(this.animation);
                    temp.parentElement.removeChild(temp);
                }
                temp = document.createElement('div');
                addClass(temp, 'tempSlide');
                temp.style.zIndex = '2';
                temp.style.width = this.width + 'px';
                temp.style.height = this.height + 'px';
                var num = 8;
                for (var i = 0; i < num; i++) {
                    var child = document.createElement('div');
                    child.style.width = 100 / num + '%';
                    child.style.height = '100%';
                    child.style.left = i * (this.width / num) + 'px';
                    child.style.transitionDuration = this.speed / 1000 + 's';
                    var previousClone = previous.cloneNode(true);
                    previousClone.style.left = -(this.width / num) * i + 'px';
                    child.appendChild(previousClone);
                    temp.appendChild(child);
                }
                this.slideshowElement.appendChild(temp);

                for (var i = 0; i < temp.children.length; i++) {
                    var child = temp.children[i];
                    child.style.display = document.defaultView.getComputedStyle(child)['display'];
                    var width =  child.clientWidth;
                    this.animation = jsAnimation(width, 0, this.speed, child, 'width', 'px');
                }

                this.dotFocus(index);
                this.index = index;
            };

            slideshow.init();
            return slideshow;
        },
    };

    var Square = {
        createNew: function(slideshowElement, parameters) {
            var slideshow = Bamboo.createNew(slideshowElement, parameters);
            slideshow.init = function() {
                this.animationType = 'square';
                addClass(this.slideshowElement, 'square');

                this.speed = (this.speed !== undefined) ? this.speed : 1000;

                this.slideList[this.index].style.zIndex = '2';
                var next = (this.index < this.slideList.length - 1) ? this.index + 1 : 0;
                this.slideList[next].style.zIndex = '1';

                this.dotFocus(this.index);
                if (this.autoPlay) {
                    this.run();
                }
            };
            slideshow.focusByCss = function(index, whoTrigger) {
                var prevIndex = this.index;

                if (index === -1) {
                    index = this.slideList.length - 1;
                } else if (index === this.slideList.length) {
                    index = 0;
                } else if (index === this.index) {
                    return;
                }

                var temp = this.slideshowElement.querySelector('.tempSlide');
                if (temp) {
                    clearInterval(this.animation);
                    temp.parentElement.removeChild(temp);
                }

                var current = this.slideList[index];
                var previous = this.slideList[this.index];
                
                temp = document.createElement('div');
                temp.style.zIndex = '2';
                addClass(temp, 'tempSlide');
                temp.style.width = this.width + 'px';
                temp.style.height = this.height + 'px';
                var h = 10;
                var v = 6;
                for (var i = 0; i < h * v; i++) {
                    var child = document.createElement('div');
                    child.style.width = 100 / h + '%';
                    child.style.height = 100 / v + '%';
                    child.style.transitionDuration = this.speed / (h * v / 4) / 1000 + 's';

                    var previousClone = previous.cloneNode(true);
                    previousClone.style.top = -100 * Math.floor(i / h) + '%';
                    previousClone.style.left = -100 * (i % h) + '%';

                    child.appendChild(previousClone);
                    temp.appendChild(child);
                }
                this.slideshowElement.style.display = document.defaultView.getComputedStyle(this.slideshowElement)['display'];
                this.slideshowElement.appendChild(temp);
                current.style.zIndex = '1';
                previous.style.zIndex = '0';
                
                var i = 0;
                var _this = this;
                var squareList = Array.apply(null, { length: temp.children.length }).map(Number.call, Number);
                this.animation = setInterval(function() {
                    if (!squareList) {
                        clearInterval(_this.animation);
                        temp.parentElement.removeChild(temp);
                    } else {
                        for (var j = 0; j < 4; j++) {
                            if (squareList.length > 0) {
                                var random = Math.floor(Math.random() * squareList.length);
                                var k = squareList.splice(random, 1)[0];
                                // temp.children[k].style.opacity = '0';
                                temp.children[k].style.visibility = 'hidden';
                            }
                        }
                        i++;
                    }
                }, this.speed / (h * v / 4));

                this.dotFocus(index);
                this.index = index;
            };
            slideshow.focusByJs = function(index, whoTrigger) {
                var prevIndex = this.index;

                if (index === -1) {
                    index = this.slideList.length - 1;
                } else if (index === this.slideList.length) {
                    index = 0;
                } else if (index === this.index) {
                    return;
                }

                var current = this.slideList[index];
                var previous = this.slideList[this.index];
                current.style.zIndex = '1';
                previous.style.zIndex = '0';
                
                var temp = this.slideshowElement.querySelector('.tempSlide');
                if (temp) {
                    clearInterval(this.animation);
                    temp.parentElement.removeChild(temp);
                }
                temp = document.createElement('div');
                temp.style.zIndex = '2';
                addClass(temp, 'tempSlide');
                temp.style.width = this.width + 'px';
                temp.style.height = this.height + 'px';
                var h = 10;
                var v = 6;
                for (var i = 0; i < h * v; i++) {
                    var child = document.createElement('div');
                    child.style.width = 100 / h + '%';
                    child.style.height = 100 / v + '%';
                    child.style.transitionDuration = this.speed / (h * v / 4) / 1000 + 's';

                    var previousClone = previous.cloneNode(true);
                    previousClone.style.top = -100 * Math.floor(i / h) + '%';
                    previousClone.style.left = -100 * (i % h) + '%';

                    child.appendChild(previousClone);
                    temp.appendChild(child);
                }
                this.slideshowElement.appendChild(temp);  
                var i = 0;
                var _this = this;
                var squareList = Array.apply(null, { length: temp.children.length }).map(Number.call, Number);
                this.animation = setInterval(function() {
                    if (!squareList) {
                        clearInterval(_this.animation);
                        temp.parentElement.removeChild(temp);
                    } else {
                        for (var j = 0; j < 4; j++) {
                            if (squareList.length > 0) {
                                var random = Math.floor(Math.random() * squareList.length);
                                var k = squareList.splice(random, 1)[0];
                                var child = temp.children[k];
                                child.style.visibility = 'hidden';
                                jsAnimation(1, 0, this.speed / (h * v / 4), child, 'opacity');
                            }
                        }
                        i++;
                    }
                }, this.speed / (h * v / 4));  

                this.dotFocus(index);
                this.index = index;
            };

            slideshow.init();
            return slideshow;
        },
    };

    function package(slideshowElement, animationType, parameters) {
        var s;
        switch (animationType) {
            case 'roll':
                s = Roll.createNew(slideshowElement, parameters);
                break;
            case 'fade':
                s = Fade.createNew(slideshowElement, parameters);
                break;
            case 'into':
                s = Into.createNew(slideshowElement, parameters);
                break;
            case 'blinds':
                s = Blinds.createNew(slideshowElement, parameters);
                break;
            case 'square':
                s = Square.createNew(slideshowElement, parameters);
                break;
            default:
                s = Fade.createNew(slideshowElement, parameters);
        }
        return s;
    }

    return package;
})();