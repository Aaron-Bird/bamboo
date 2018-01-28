var bamboo = (function(){

    function hasClass(element, className) {
        var regExp = new RegExp('(\\s|^)'+ className +'(\\s|$)');
        return regExp.test(element.className);
    }

    function addClass(element, className) {
        if (!isIe9()) {
            element.classList.add(className);
        } else if (!hasClass(element, className)) {
            alert(' ');
            element.className += ' ' + className;
        }
    }

    function removeClass(element, className) {
        if (!isIe9()) {
            element.classList.remove(className);
        } else if (hasClass(element, className)) {
            var regExp = new RegExp(className +'(\\s|$)');
            element.className = element.className.replace(regExp, '');
        }
    }

    function isIe9() {
        if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i) == "9.") {
            return true;
        }
        return false;
    }

    function jsAnimation(start, end, duration, element, property, valueUnit) {
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
                showDot: p.showDot !== undefined ? p.showDot : true,
                showArrow: p.showArrow !== undefined ? p.showArrow : true,

                backgroundColor: p.backgroundColor,
                index: p.index !== undefined ? p.index : 0,
                autoPlay: p.autoPlay !== undefined ? p.autoPlay : true,
                vertical: p.vertical !== undefined ? p.vertical : false,

                fitImg: p.fitImg !== undefined ? p.fitImg : false,
                reverse: p.reverse !== undefined ? p.reverse : false,
                timeout: p.timeout !== undefined ? p.timeout : 2000,
                jsAnime: p.jsAnime !== undefined ? p.jsAnime : false,
                pause: false,
                // to do 
                toward: p.toward !== undefined ? p.toward : 'horizontal',
            };

            slideshow._init = function() {
                if (!this.slidesElement) {
                    throw "Not slides found";
                }
                this.slides = this.slidesElement.children;
                addClass(this.slideshowElement, 'bamboo');
                // dots
                if (!this.dotsElement) {
                    var dotsEelement = document.createElement('ul');
                    addClass(dotsEelement, 'bamboo-dots');
                    for (var i = 0; i < this.slides.length; i++) {
                        var dotElement = document.createElement('li');
                        addClass(dotElement, 'dot');
                        dotsEelement.appendChild(dotElement);
                    }
                    this.dotsElement = dotsEelement;
                    if (this.showDot) {
                        this.slideshowElement.appendChild(this.dotsElement);
                    }
                }
                this.dots = this.dotsElement.children;
                // arrow
                if (!this.prev) {
                    this.prev = document.createElement('i');
                    addClass(this.prev, 'bamboo-prev');
                    if (this.showArrow) {
                        this.slideshowElement.appendChild(this.prev);
                    }
                }
                if (!this.next) {
                    this.next = document.createElement('i');
                    addClass(this.next, 'bamboo-next');
                    if (this.showArrow) {
                        this.slideshowElement.appendChild(this.next);
                    }
                }
                // event
                var _this = this;
                this.slideshowElement.addEventListener('mouseenter', function() {
                    _this.pause = true;
                });
                this.slideshowElement.addEventListener('mouseleave', function() {
                    _this.pause = false;
                });
                this.prev.addEventListener('click', function() {
                    _this.setFocus(_this.index - 1, 'left-key');
                });
                this.next.addEventListener('click', function() {
                    _this.setFocus(_this.index + 1, 'right-key');
                });
                // set
                var width = this.slideshowElement.clientWidth;
                var height = this.slideshowElement.clientHeight;
                for (var i = 0; i < this.slides.length; i++) {
                    var slide = this.slides[i];
                    addClass(slide, 'slide');
                    slide.style.width = width + 'px';
                    slide.style.height = height + 'px';
                }
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
                if (this.fitImg) {
                    var imgList = this.slidesElement.querySelectorAll('img');
                    var containerWidth = this.slideshowElement.clientWidth;
                    var containerHeight = this.slideshowElement.clientHeight;
                    var len = imgList.length;
                    for (var i = 0; i < len; i++) {
                        var imgElement = imgList[i];
                        addClass(imgElement, 'fit-img');
                        var imgWidth = imgElement.clientWidth;
                        var imgHeight = imgElement.clientHeight;
                        var widthM = containerWidth / imgWidth;
                        if (imgHeight * widthM > containerHeight) {
                            imgElement.style.width = '100%';
                        } else {
                            imgElement.style.height = '100%';
                        }
                    }
                }
                if (this.backgroundColor) {
                    this.slidesElement.style.backgroundColor = this.backgroundColor;
                    var len = this.slides.length;
                    for (var i = 0; i < len; i++) {
                        this.slides[i].style.backgroundColor = this.backgroundColor;
                    }
                }
                if (this.jsAnime) {
                    addClass(this.slideshowElement, 'jsAnime');
                }
            };
            slideshow.dotFocus = function(index) {
                var dLen = this.dots.length;
                for (var i = 0; i < dLen; i++) {
                    var dotEle = this.dots[i];
                    removeClass(dotEle, 'focus');
                }
                addClass(this.dots[index], 'focus');
            };
            slideshow.run = function() {
                this.speed = (this.speed !== undefined) ? this.speed : 1000;
                if (this._runAnimation) {
                    clearInterval(this._runAnimation);
                }

                var _this = this;
                this._runAnimation = setInterval(function() {
                    if (_this.autoPlay && !_this.pause) {
                        var index = (_this.reverse) ? _this.index - 1 : _this.index + 1;
                        _this.setFocus(index);
                    }
                }, this.timeout + this.speed);
            };
            slideshow.play = function() {
                this.autoPlay = true;
            }
            slideshow.stop = function() {
                this.autoPlay = false;
            };
            slideshow.setFocus = function(index, whoTrigger) {
                if (this.jsAnime || isIe9()) {
                    slideshow.focusByJs(index, whoTrigger);
                } else {
                    slideshow.focusByCss(index, whoTrigger);
                }
            };
            slideshow.getFocus = function(){
                return this.index;
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
                this.speed = (this.speed !== undefined) ? this.speed : 200;
                this.slidesElement.style.transitionDuration = this.speed / 1000 + 's';
                addClass(this.slideshowElement, 'roll');
                if (!this.vertical) {
                    addClass(this.slideshowElement, 'roll-horizontal');
                }
                var endSlide = this.slides[0].cloneNode(true);
                this.slidesElement.appendChild(endSlide);

                this.setFocus(this.index);
                this.run();
            };
            slideshow.moveTo = function(distance) {
                var style = this.slidesElement.style;
                if (this.vertical) {
                    if (this.jsAnime || isIe9()) {
                        style.marginTop = distance + 'px';
                    } else {
                        style.transform = 'translate3d( 0px, ' + distance + 'px, 0px)';
                    }
                } else {
                    if (this.jsAnime || isIe9()) {
                        style.marginLeft = distance + 'px';
                    } else {
                        style.transform = 'translate3d(' + distance + 'px, 0px, 0px)';
                    }
                }
            };

            slideshow.resetTo = function(distance) {
                var transitionProperty = getComputedStyle(this.slidesElement, null).getPropertyValue('transition-property');
                this.slidesElement.style.transitionProperty = 'none';
                this.moveTo(distance);
                this.slidesElement.style.display = document.defaultView.getComputedStyle(this.slidesElement)['display'];
                this.slidesElement.style.transitionProperty = transitionProperty || 'all';
            };
            slideshow.focusByCss = function(index, whoTrigger) {
                var slideWidth;
                // calculate the moving distance
                if (this.vertical) {
                    slideWidth = this.slideshowElement.clientHeight;
                } else {
                    slideWidth = this.slideshowElement.clientWidth;
                }

                var slidesLength = this.slides.length;
                if (index === -1) {
                    // reset slide to last one
                    this.resetTo(-(slidesLength - 1) * slideWidth);
                    index = (slidesLength - 1) - 1;
                } else if (index === slidesLength) {
                    // reset slide to 0
                    this.resetTo(0);
                    index = 1;
                } else if (this.index === slidesLength - 1 && whoTrigger === 'dot') {
                    // click dot on the last slide. reset slide to 0
                    this.resetTo(0);
                }

                this.moveTo(-(index * slideWidth));

                var dotIndex = (index === slidesLength - 1) ? 0 : index;
                this.dotFocus(dotIndex);
                this.index = index;
            };
            slideshow.focusByJs = function(index, whoTrigger) {
                var slideWidth;
                if (this.vertical) {
                    slideWidth = this.slideshowElement.clientHeight;
                } else {
                    slideWidth = this.slideshowElement.clientWidth;
                }

                var start;
                var slidesLength = this.slides.length;
                if (index === -1) {
                    
                    var distance = -(slidesLength - 1) * slideWidth;
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
                    start = -(this.index * slideWidth);
                }
                var end = -(index * slideWidth);
                // delete the previous animation
                if (this.animation) {
                    clearInterval(this.animation);
                }

                if (this.vertical) {
                    this.animation = jsAnimation(start, end, this.speed, this.slidesElement, 'marginTop', 'px');
                } else {
                    this.animation = jsAnimation(start, end, this.speed, this.slidesElement, 'marginLeft', 'px');
                }

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
                for (var i = 0; i < this.slides.length; i++) {
                    this.slides[i].style.transitionDuration = this.speed / 1000 + 's';
                }
                addClass(this.slideshowElement, 'fade');
                this.setFocus(this.index);
                this.run();
            };
            slideshow.focusByCss = function(index, whoTrigger) {
                var prevIndex = this.index;
                if (index === -1) {
                    index = this.slides.length - 1;
                } else if (index === this.slides.length) {
                    index = 0;
                }

                var sLen = this.slides.length;
                for (var i = 0; i < sLen; i++) {
                    var slideEle = this.slides[i];
                    slideEle.style.zIndex = '0';
                    slideEle.style.opacity = '0';
                }

                var current = this.slides[index];
                var transitionProperty = getComputedStyle(current, null).getPropertyValue('transition-property');
                // close the animtion
                current.style.transitionProperty = 'none';
                // z-index
                this.slides[prevIndex].style.zIndex = '1';
                current.style.zIndex = '2';
                // opactiy
                this.slides[prevIndex].style.opacity = '1';
                current.style.opacity = '0';
                // refresh
                current.style.display = document.defaultView.getComputedStyle(current)['display'];
                // display the animation
                current.style.transitionProperty = transitionProperty || 'all';

                // display the current slide
                current.style.opacity = '1';
                // set the dot focus
                this.dotFocus(index);
                this.index = index;
            };
            slideshow.focusByJs = function(index, whoTrigger) {
                var prevIndex = this.index;
                if (index === -1) {
                    index = this.slides.length - 1;
                } else if (index === this.slides.length) {
                    index = 0;
                }

                if (this.animation) {
                    clearInterval(this.animation);
                }
                for (var i = 0; i < this.slides.length; i++) {
                    var slideEle = this.slides[i];
                    slideEle.style.zIndex = '0';
                    slideEle.style.opacity = '0';
                }

                this.slides[prevIndex].style.zIndex = '1';
                this.slides[prevIndex].style.opacity = '1';
                this.slides[index].style.zIndex = '2';

                this.slides[index].style.opacity = '0';
                this.animation = jsAnimation(0, 1, this.speed, this.slides[index], 'opacity');

                this.dotFocus(index);
                this.index = index;
            };

            slideshow.init();
            return slideshow;
        },
    };

    var Down = {
        createNew: function(slideshowElement, parameters) {
            var slideshow = Bamboo.createNew(slideshowElement, parameters);
            slideshow.init = function() {
                this.animationType = 'down';
                this.speed = (this.speed !== undefined) ? this.speed : 200;
                for (var i = 0; i < this.slides.length; i++) {
                    this.slides[i].style.transitionDuration = this.speed / 1000 + 's';
                };
                addClass(this.slideshowElement, 'down');

                this.setFocus(this.index);
                // this.slidesElement.style.transform = 'translate3d(0px, 0px, 0px)';
                this.run();
            };
            slideshow.focusByCss = function(index, whoTrigger) {
                var prevIndex = this.index;
                if (index === -1) {
                    index = this.slides.length - 1;
                } else if (index === this.slides.length) {
                    index = 0;
                }

                var distance;
                if (index > prevIndex) {
                    distance = '100%';
                } else if (index < prevIndex) {
                    distance = '-100%';
                }

                if (index === 0 && prevIndex === this.slides.length - 1) {
                    distance = '100%';
                } else if (index === this.slides.length - 1 && prevIndex === 0) {
                    distance = '-100%';
                } else if (whoTrigger === 'dot') {
                    distance = '-100%';
                }

                for (var i = 0; i < this.slides.length; i++) {
                    this.slides[i].style.zIndex = '0';
                }
                var currentElement = this.slides[index];
                var transitionProperty = currentElement.style.transitionProperty;

                currentElement.style.zIndex = '2';
                this.slides[prevIndex].style.zIndex = '1';
                currentElement.style.transitionProperty = 'none';
                currentElement.style.transform = 'translate3d(0px, ' + distance + ', 0px)';
                currentElement.style.display = document.defaultView.getComputedStyle(currentElement)['display'];
                currentElement.style.transitionProperty = transitionProperty || 'transform';

                currentElement.style.transform = 'translate3d(0px, 0px, 0px)';

                this.dotFocus(index);
                this.index = index;
            };
            slideshow.focusByJs = function(index, whoTrigger) {
                var prevIndex = this.index;
                var width = this.slideshowElement.clientHeight;

                if (index === -1) {
                    index = this.slides.length - 1;
                } else if (index === this.slides.length) {
                    index = 0;
                }

                var distance;
                if (index > prevIndex) {
                    distance = width;
                } else if (index < prevIndex) {
                    distance = -width;
                }

                if (index === 0 && prevIndex === this.slides.length - 1) {
                    distance = width;
                } else if (index === this.slides.length - 1 && prevIndex === 0) {
                    distance = -width;
                } else if (whoTrigger === 'dot') {
                    distance = -width;
                }

                for (var i = 0; i < this.slides.length; i++) {
                    this.slides[i].style.zIndex = '0';
                }
                var currentElement = this.slides[index];
                var transitionProperty = currentElement.style.transitionProperty;

                currentElement.style.zIndex = '2';
                this.slides[prevIndex].style.zIndex = '1';
                currentElement.style.marginTop = distance + 'px';
                jsAnimation(distance, 0, this.speed, currentElement, 'marginTop', 'px');

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
                this.slides[this.index].style.zIndex = '2';
                var next = (this.index < this.slides.length - 1) ? this.index + 1 : 0;
                this.slides[next].style.zIndex = '1';
                this.dotFocus(this.index);
                this.run();
            };
            slideshow.focusByCss = function(index, whoTrigger) {
                var prevIndex = this.index;

                if (index === -1) {
                    index = this.slides.length - 1;
                } else if (index === this.slides.length) {
                    index = 0;
                }

                var tempElement = this.slideshowElement.querySelector('.tempSlide');
                if (tempElement) {
                    tempElement.parentElement.removeChild(tempElement);
                }

                this.slides[index].style.zIndex = '1';
                var tempElement = document.createElement('div');
                tempElement.style.zIndex = '2';
                addClass(tempElement, 'tempSlide');
                tempElement.style.width = this.slides[prevIndex].clientWidth + 'px';
                tempElement.style.height = this.slides[prevIndex].clientHeight + 'px';
                var num = 8;
                for (var i = 0; i < num; i++) {
                    var child = document.createElement('div');
                    child.style.width = 100 / num + '%';
                    child.style.height = '100%';
                    child.style.left = i * (this.slides[prevIndex].clientWidth / num) + 'px';
                    child.style.transitionDuration = this.speed / 1000 + 's';
                    var prevSlice = this.slides[prevIndex].cloneNode(true);
                    prevSlice.style.left = - (this.slides[prevIndex].clientWidth / num) * i + 'px';
                    child.appendChild(prevSlice);
                    tempElement.appendChild(child);
                }
                this.slideshowElement.appendChild(tempElement);
                this.slides[prevIndex].style.zIndex = '0';

                for (var i = 0; i < tempElement.children.length; i++) {
                    tempElement.children[i].style.display = document.defaultView.getComputedStyle(tempElement.children[i])['display'];
                    tempElement.children[i].style.width = 0;
                }

                this.dotFocus(index);
                this.index = index;
            };
            slideshow.focusByJs = function(index, whoTrigger) {
                var prevIndex = this.index;

                if (index === -1) {
                    index = this.slides.length - 1;
                } else if (index === this.slides.length) {
                    index = 0;
                }

                var tempElement = this.slideshowElement.querySelector('.tempSlide');
                if (tempElement) {
                    clearInterval(this.animation);
                    tempElement.parentElement.removeChild(tempElement);
                }

                this.slides[index].style.zIndex = '1';
                var tempElement = document.createElement('div');
                tempElement.style.zIndex = '2';
                addClass(tempElement, 'tempSlide');
                tempElement.style.width = this.slides[prevIndex].clientWidth + 'px';
                tempElement.style.height = this.slides[prevIndex].clientHeight + 'px';
                var num = 8;
                for (var i = 0; i < num; i++) {
                    var child = document.createElement('div');
                    child.style.width = 100 / num + '%';
                    child.style.height = '100%';

                    child.style.left = i * (this.slides[prevIndex].clientWidth / num) + 'px';
                    child.style.transitionDuration = this.speed / 1000 + 's';
                    var prevSlice = this.slides[prevIndex].cloneNode(true);
                    prevSlice.style.left = - (this.slides[prevIndex].clientWidth / num) * i + 'px';

                    child.appendChild(prevSlice);
                    tempElement.appendChild(child);
                }
                this.slideshowElement.appendChild(tempElement);
                this.slides[prevIndex].style.zIndex = '0';

                for (var i = 0; i < tempElement.children.length; i++) {
                    tempElement.children[i].style.display = document.defaultView.getComputedStyle(tempElement.children[i])['display'];
                    this.animation = jsAnimation(tempElement.children[i].clientWidth, 0, this.speed, tempElement.children[i], 'width', 'px');
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
                this.speed = (this.speed !== undefined) ? this.speed : 600;
                // this.slides[0].style.zIndex = '2';
                // this.slides[1].style.zIndex = '1';
                // addClass(this.dots[0], 'focus');
                this.slides[this.index].style.zIndex = '2';
                var next = (this.index < this.slides.length - 1) ? this.index + 1 : 0;
                this.slides[next].style.zIndex = '1';
                this.dotFocus(this.index);
                this.run();
            };
            slideshow.focusByCss = function(index, whoTrigger) {
                var prevIndex = this.index;

                if (index === -1) {
                    index = this.slides.length - 1;
                } else if (index === this.slides.length) {
                    index = 0;
                } else if (index === prevIndex) {
                    return;
                }
                var _this = this;
                var tempElement = this.slideshowElement.querySelector('.tempSlide');
                if (tempElement) {
                    tempElement.parentElement.removeChild(tempElement);
                    clearInterval(this.animation);
                }

                this.slides[prevIndex].style.zIndex = '0';
                this.slides[index].style.zIndex = '1';

                var tempElement = document.createElement('div');
                tempElement.style.zIndex = '2';
                addClass(tempElement, 'tempSlide');
                tempElement.style.width = this.slides[prevIndex].clientWidth + 'px';
                tempElement.style.height = this.slides[prevIndex].clientHeight + 'px';
                var h = 10;
                var v = 6;
                for (var i = 0; i < h * v; i++) {
                    var childElement = document.createElement('div');
                    var prevElementSqare = this.slides[prevIndex].cloneNode(true);

                    childElement.style.width = 100 / h + '%';
                    childElement.style.height = 100 / v + '%';
                    childElement.style.transitionDuration = this.speed / (h * v / 4) / 1000 + 's';
                    prevElementSqare.style.top = -100 * Math.floor(i / h) + '%';
                    prevElementSqare.style.left = -100 * (i % h) + '%';

                    childElement.appendChild(prevElementSqare);
                    tempElement.appendChild(childElement);
                }
                this.slideshowElement.appendChild(tempElement);

                var i = 0;
                var _this = this;
                var len = tempElement.children.length;
                var squareList = Array.apply(null, { length: len }).map(Number.call, Number);
                this.animation = setInterval(function() {
                    if (!squareList) {
                        clearInterval(_this.animation);
                        tempElement.parentElement.removeChild(tempElement);
                        _this.slides[index].style.zIndex = '2';
                    } else {
                        for (var j = 0; j < 4; j++) {
                            if (squareList.length > 0) {
                                var random = Math.floor(Math.random() * squareList.length);
                                var k = squareList.splice(random, 1)[0];
                                tempElement.children[k].style.opacity = '0';
                                tempElement.children[k].style.visibility = 'hidden';
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
                    index = this.slides.length - 1;
                } else if (index === this.slides.length) {
                    index = 0;
                } else if (index === prevIndex) {
                    return;
                }
                var _this = this;
                var tempElement = this.slideshowElement.querySelector('.tempSlide');
                if (tempElement) {
                    tempElement.parentElement.removeChild(tempElement);
                    clearInterval(this.animation);
                }

                this.slides[prevIndex].style.zIndex = '0';
                this.slides[index].style.zIndex = '1';

                var tempElement = document.createElement('div');
                tempElement.style.zIndex = '2';
                addClass(tempElement, 'tempSlide');
                tempElement.style.width = this.slides[prevIndex].clientWidth + 'px';
                tempElement.style.height = this.slides[prevIndex].clientHeight + 'px';
                var h = 10;
                var v = 6;
                for (var i = 0; i < h * v; i++) {
                    var childElement = document.createElement('div');
                    var prevElementSqare = this.slides[prevIndex].cloneNode(true);

                    childElement.style.width = 100 / h + '%';
                    childElement.style.height = 100 / v + '%';
                    prevElementSqare.style.top = -100 * Math.floor(i / h) + '%';
                    prevElementSqare.style.left = -100 * (i % h) + '%';

                    childElement.appendChild(prevElementSqare);
                    tempElement.appendChild(childElement);
                }
                this.slideshowElement.appendChild(tempElement);

                var i = 0;
                var _this = this;
                var len = tempElement.children.length;
                var squareList = Array.apply(null, { length: len }).map(Number.call, Number);
                this.animation = setInterval(function() {
                    if (!squareList) {
                        clearInterval(_this.animation);
                        tempElement.parentElement.removeChild(tempElement);
                        _this.slides[index].style.zIndex = '2';
                    } else {
                        for (var j = 0; j < 4; j++) {
                            if (squareList.length > 0) {
                                var random = Math.floor(Math.random() * squareList.length);
                                var k = squareList.splice(random, 1)[0];
                                var element = tempElement.children[k];
                                jsAnimation(1, 0, this.speed / (h * v / 4), element, 'opacity');
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

    function bamboo(slideshowElement, animationType, parameters) {
        var s;
        switch (animationType) {
            case 'roll':
                s = Roll.createNew(slideshowElement, parameters);
                break;
            case 'fade':
                s = Fade.createNew(slideshowElement, parameters);
                break;
            case 'down':
                s = Down.createNew(slideshowElement, parameters);
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

    return bamboo;
})();