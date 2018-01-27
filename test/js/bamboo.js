Object.defineProperty(Element.prototype, 'classList', {
    get: function() {
        var self = this,
            bValue = self.className.split(" ")

        bValue.add = function() {
            var b;
            for (i in arguments) {
                b = true;
                for (var j = 0; j < bValue.length; j++)
                    if (bValue[j] == arguments[i]) {
                        b = false
                        break
                    }
                if (b)
                    self.className += (self.className ? " " : "") + arguments[i]
            }
        }
        bValue.remove = function() {
            self.className = ""
            for (i in arguments)
                for (var j = 0; j < bValue.length; j++)
                    if (bValue[j] != arguments[i])
                        self.className += (self.className ? " " : "") + bValue[j]
        }
        bValue.toggle = function(x) {
            var b;
            if (x) {
                self.className = ""
                b = false;
                for (var j = 0; j < bValue.length; j++)
                    if (bValue[j] != x) {
                        self.className += (self.className ? " " : "") + bValue[j]
                        b = false
                    } else b = true
                if (!b)
                    self.className += (self.className ? " " : "") + x
            } else throw new TypeError("Failed to execute 'toggle': 1 argument required")
            return !b;
        }

        return bValue;
    },
    enumerable: false
});

function isIe9() {
    // return true;
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

    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    var startTime = new Date().getTime();
    var animation = setInterval(function() {
        var currentTime = new Date().getTime() - startTime;
        var percentage = currentTime / duration;
        if (percentage < 1) {
            element.style[property] = easeInOutQuad(currentTime, start, end - start, duration) + valueUnit;
            // element.style[property] = percentage * (end - start) + start + valueUnit;
        } else {
            element.style[property] = end + valueUnit;
            clearInterval(animation);
        }
    }, 13);
    return animation;
}

function createDots(num) {
    var dotsEelement = document.createElement('ul');
    dotsEelement.classList.add('dots');
    for (var i = 0; i < num; i++) {
        var dotElement = document.createElement('li');
        dotElement.classList.add('dot');
        dotsEelement.appendChild(dotElement);
    }
    return dotsEelement;
}

var Bamboo = {
    createNew: function(slideshowElement, parameters) {
        var p = parameters || {};
        var slideshow = {
            slideshowElement: slideshowElement,
            slidesElement: slideshowElement.querySelector('.slides'),
            backgroundColor: p.backgroundColor,
            dotsElement: p.dots,
            prev: p.prev,
            next: p.next,
            index: p.index !== undefined ? p.index : 0,
            autoPlay: p.autoPlay !== undefined ? p.autoPlay : true,
            showDot: p.showDot !== undefined ? p.showDot : true,
            showArrow: p.showArrow !== undefined ? p.showArrow : true,
            fitImg: p.fitImg !== undefined ? p.fitImg : false,
            pause: false,
            reverse: p.reverse !== undefined ? p.reverse : false,
            toward: p.toward !== undefined ? p.toward : 'horizontal',
            timeout: p.timeout !== undefined ? p.timeout : 2000,
            speed: p.speed !== undefined ? p.speed : 1000,
            jsAnime: p.jsAnime !== undefined ? p.jsAnime : false,
        };

        slideshow._init = function() {
            this.slides = this.slidesElement.children;
            this.slideshowElement.classList.add('bamboo');
            // dots
            if (!this.dotsElement) {
                this.dotsElement = createDots(this.slides.length);
            }
            if (this.showDot && p.dots == undefined) {
                this.slideshowElement.appendChild(this.dotsElement);
            }
            this.dots = this.dotsElement.children;
            // arrow
            if (!this.prev) {
                this.prev = document.createElement('i');
                this.prev.classList.add('prev');
            }
            if (!this.next) {
                this.next = document.createElement('i');
                this.next.classList.add('next');
            }
            if (this.showArrow) {
                this.slideshowElement.appendChild(this.prev);
                this.slideshowElement.appendChild(this.next);
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
                slide.classList.add('slide');
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
                    imgElement.classList.add('fit-img');
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
                this.slideshowElement.classList.add('jsAnime');
            }
        };
        slideshow.dotFocus = function(index) {
            var dLen = this.dots.length;
            for (var i = 0; i < dLen; i++) {
                var dotEle = this.dots[i];
                dotEle.classList.remove('focus');
            }
            this.dots[index].classList.add('focus');
        };
        slideshow.run = function() {
            var _this = this;
            this._runAnimation = setInterval(function() {
                if (_this.autoPlay && !_this.pause) {
                    var index = (_this.reverse) ? _this.index - 1 : _this.index + 1;
                    _this.setFocus(index);
                }
            }, this.timeout);
        };
        slideshow.setFocus = function(index, whoTrigger) {
            if (this.jsAnime || isIe9()) {
                slideshow.focusByJs(index, whoTrigger);
            } else {
                slideshow.focusByCss(index, whoTrigger);
            }
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
            this.slideshowElement.classList.add('roll');
            if (this.toward === 'horizontal') {
                this.slideshowElement.classList.add('roll-horizontal');
            }
            var endSlide = this.slides[0].cloneNode(true);
            this.slidesElement.appendChild(endSlide);
            this.setFocus(0);
            this.run();
        };
        slideshow.moveTo = function(distance) {
            var style = this.slidesElement.style;
            if (this.toward === 'vertical') {
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
            var transition;
            try {
                transitionPtoperty = this.slidesElement.style.transitionProperty;
            } catch (err) {
                transitionPtoperty = '';
            }
            this.slidesElement.style.transitionProperty = 'none';
            this.moveTo(distance);
            this.slidesElement.style.display = document.defaultView.getComputedStyle(this.slidesElement)['display'];
            this.slidesElement.style.transitionProperty = transitionPtoperty || 'all';
        };
        slideshow.focusByCss = function(index, whoTrigger) {
            var slideWidth;
            if (this.toward === 'vertical') {
                slideWidth = this.slideshowElement.clientHeight;
            } else if (this.toward === 'horizontal') {
                slideWidth = this.slideshowElement.clientWidth;
            }
            var slidesLen = this.slides.length;
            if (index === -1) {
                this.resetTo(-(slidesLen - 1) * slideWidth);
                index = (slidesLen - 1) - 1;
            } else if (index === slidesLen) {
                this.resetTo(0);
                index = 1;
            // } else if (this.index === slidesLen - 1 && whoTrigger !== 'left-key') {
            } else if (this.index === slidesLen - 1 && whoTrigger === 'dot') {
                console.log(whoTrigger);
                this.resetTo(0);
            }

            this.moveTo(-(index * slideWidth));

            var dotIndex = (index === slidesLen - 1) ? 0 : index;
            this.dotFocus(dotIndex);
            this.index = index;
        };
        slideshow.focusByJs = function(index, whoTrigger) {
            var start;
            var slidesLen = this.slides.length;
            if (this.toward === 'vertical') {
                slideWidth = this.slideshowElement.clientHeight;
            } else if (this.toward === 'horizontal') {
                slideWidth = this.slideshowElement.clientWidth;
            }
            if (index === -1) {
                var distance = -(slidesLen - 1) * slideWidth;
                this.resetTo(distance);
                index = (slidesLen - 1) - 1;
                start = distance;
            } else if (index === slidesLen) {
                this.resetTo(0);
                index = 1;
                start = 0;
            // } else if (this.index === slidesLen - 1 && whoTrigger !== 'left-key') {
            } else if (this.index === slidesLen - 1 && whoTrigger === 'dot') {
                this.resetTo(0);
                start = 0;
            } else {
                // start = parseInt(this.slidesElement.style.marginLeft) || 0;
                start = -(this.index * slideWidth);
            }
            var end = -(index * slideWidth);

            if (this.animation) {
                clearInterval(this.animation);
            }
            this.animation = jsAnimation(start, end, 200, this.slidesElement, 'marginLeft', 'px');

            var dotIndex = (index === slidesLen - 1) ? 0 : index;
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
            this.slideshowElement.classList.add('fade');
            this.setFocus(0);
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
            this.animation = jsAnimation(0, 1, 600, this.slides[index], 'opacity');

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
            this.slideshowElement.classList.add('down');
            this.setFocus(0);
            this.slidesElement.style.transform = 'translate3d(0px, 0px, 0px)';
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
            jsAnimation(distance, 0, 400, currentElement, 'marginTop', 'px');

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
            this.slideshowElement.classList.add('blinds');
            this.slides[0].style.zIndex = '2';
            this.slides[1].style.zIndex = '1';
            this.dots[0].classList.add('focus');
            this.run();
            // this.length = this.slides.length;
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
                clearInterval(this.animation);
                tempElement.parentElement.removeChild(tempElement);
            }

            this.slides[index].style.zIndex = '1';
            var tempElement = document.createElement('div');
            tempElement.style.zIndex = '2';
            tempElement.classList.add('tempSlide');
            tempElement.style.width = this.slides[prevIndex].clientWidth + 'px';
            tempElement.style.height = this.slides[prevIndex].clientHeight + 'px';
            var num = 8;
            for (var i = 0; i < num; i++) {
                var child = document.createElement('div');
                child.style.width = 100 / num + '%';
                child.style.height = '100%';
                var prevSlice = this.slides[prevIndex].cloneNode(true);
                prevSlice.style.left = -100 * i + '%';
                child.appendChild(prevSlice);
                tempElement.appendChild(child);
            }
            this.slideshowElement.appendChild(tempElement);
            this.slides[prevIndex].style.zIndex = '0';

            var i = 0;
            var _this = this;
            this.animation = setInterval(function() {
                if (i >= tempElement.children.length) {
                    clearInterval(_this.animation);
                    tempElement.parentElement.removeChild(tempElement);
                    _this.slides[index].style.zIndex = '2';

                } else {
                    tempElement.children[i].style.opacity = '0';
                    tempElement.children[i].style.transform = 'translate3d(0, 100%, 0)';
                    tempElement.children[i].style.visibility = 'hidden';
                    i++;
                }
            }, 200);

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
            tempElement.classList.add('tempSlide');
            tempElement.style.width = this.slides[prevIndex].clientWidth + 'px';
            tempElement.style.height = this.slides[prevIndex].clientHeight + 'px';
            var num = 8;
            for (var i = 0; i < num; i++) {
                var child = document.createElement('div');
                child.style.width = 100 / num + '%';
                child.style.height = '100%';
                var prevSlice = this.slides[prevIndex].cloneNode(true);
                prevSlice.style.left = -100 * i + '%';
                child.appendChild(prevSlice);
                tempElement.appendChild(child);
            }
            this.slideshowElement.appendChild(tempElement);
            this.slides[prevIndex].style.zIndex = '0';

            var i = 0;
            var _this = this;
            this.animation = setInterval(function() {
                if (i === tempElement.children.length) {
                    clearInterval(_this.animation);
                    tempElement.parentElement.removeChild(tempElement);
                    _this.slides[index].style.zIndex = '2';
                } else {
                    var ele = tempElement.children[i];
                    jsAnimation(0, ele.clientHeight, 200, ele, 'marginTop', 'px');
                    i++;
                }
            }, 220);

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
            this.slideshowElement.classList.add('square');
            this.slides[0].style.zIndex = '2';
            this.slides[1].style.zIndex = '1';
            this.dots[0].classList.add('focus');
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
            tempElement.classList.add('tempSlide');
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
                            tempElement.children[k].style.opacity = '0';
                            tempElement.children[k].style.visibility = 'hidden';
                        }
                    }
                    i++;
                }
            }, 50);

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
            tempElement.classList.add('tempSlide');
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
                            jsAnimation(1, 0, 100, element, 'opacity');
                        }
                    }
                    i++;
                }
            }, 50);

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
            s = Fade.craeteNew(slideshowElement, parameters);
    }
    return s;
}