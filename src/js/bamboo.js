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

var Bamboo = function(slideshowElement, parameters) {

    var p = parameters || {};
    this.autoPlay = p.autoPlay !== undefined ? p.autoPlay : true;
    this.index = p.index !== undefined ? p.index : 0;
    this.animationType = p.animationType !== undefined ? p.animationType : 'fade';
    this.reverse = p.reverse !== undefined ? p.reverse : 0;
    this.toward = p.toward !== undefined ? p.toward : 'horizontal';
    this.timeout = p.timeout !== undefined ? p.timeout : 3000;
    this.speed = p.speed !== undefined ? p.speed : 1000;
    this.showDot = p.showDot !== undefined ? p.showDot : true;
    this.showArrow = p.showArrow !== undefined ? p.showArrow : true;
    this.fitImg = p.fitImg !== undefined ? p.fitImg : false;
    this.backgroundColor = p.backgroundColor !== undefined ? p.backgroundColor : '';
    // slideshow
    this.slideshowElement = slideshowElement;
    this.slideshowElement.classList.add('bamboo');
    this.slidesElement = slideshowElement.querySelector('.slides');
    this.slides = this.slidesElement.children;
    // nav
    this.dotsElement = p.dots !== undefined ? p.dots : createDots(this.slides.length);


    if (this.showDot && p.dots == undefined) {
        this.slideshowElement.appendChild(this.dotsElement);
    }
    this.dots = this.dotsElement.children;
    // arrow
    // this.prev = slideshowElement.querySelector('.prev-btn');
    // this.next = slideshowElement.querySelector('.next-btn');
    this.prev = p.prev !== undefined ? p.prev : '';
    this.next = p.next !== undefined ? p.next : '';
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

    this.pause = false;
    this.init();
    this.run();
};

Bamboo.prototype.init = function() {
    this[this.animationType]();

    var _this = this;
    var slideshowElement = this.slideshowElement;
    slideshowElement.addEventListener('mouseenter', function() {
        _this.pause = true;
    });
    slideshowElement.addEventListener('mouseleave', function() {
        _this.pause = false;
    });

    this.prev.addEventListener('click', function() {
        _this.setFocus(_this.index - 1, true, 'left-key');
    });

    this.next.addEventListener('click', function() {
        _this.setFocus(_this.index + 1, 'left-key');
    });

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
                _this.setFocus(index, true, 'dot');
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
};

Bamboo.prototype.run = function() {
    var _this = this;
    this.animation = setInterval(function() {
        if (_this.autoPlay && !_this.pause) {
            _this.setFocus();
        }
    }, this.timeout);
};

Bamboo.prototype.stop = function() {
    this.autoPlay = false;
};

Bamboo.prototype.setFocus = function(index, playAnimation, whoTrigger) {
    if (index === undefined) {
        if (this.reverse) {
            index = this.index - 1;
        } else {
            index = this.index + 1;
        }
    }
    this[this.animationType].setFocus.call(this, index, playAnimation, whoTrigger);
};

Bamboo.prototype.roll = function() {
    this.slideshowElement.classList.add('roll');
    if (this.toward === 'horizontal') {
        this.slideshowElement.classList.add('roll-horizontal');
    }

    var endSlide = this.slides[0].cloneNode(true);
    this.slidesElement.appendChild(endSlide);

    this.setFocus(0);
};

Bamboo.prototype.cleanDotFocus = function() {
    var dLen = this.dots.length;
    for (var i = 0; i < dLen; i++) {
        var dotEle = this.dots[i];
        dotEle.classList.remove('focus');
    }
};

Bamboo.prototype.roll.setFocus = function(index, playAnimation, whoTrigger) {
    playAnimation = playAnimation !== undefined ? playAnimation : true;

    var _this = this;
    _setMoveDistance = function(distance) {
        if (_this.toward === 'vertical') {
            var value = 'translate3d( 0px, ' + distance + 'px, 0px)';
        } else {
            var value = 'translate3d(' + distance + 'px, 0px, 0px)';
        }
        _this.slidesElement.style.transform = value;
    };
    _resetMoveDistance = function(distance) {
        try {
            var transitionProperty = this.slidesElement.style.transitionProperty;
        } catch (err) {
            var transitionProperty = '';
        }

        _this.slidesElement.style.transitionProperty = 'none';
        _setMoveDistance(distance);
        _this.slidesElement.style.display = document.defaultView.getComputedStyle(_this.slidesElement)['display'];
        _this.slidesElement.style.transitionProperty = transitionProperty || 'all';
    };

    var slidesLen = this.slides.length;
    if (this.toward === 'vertical') {
        var slideWidth = this.slideshowElement.clientHeight;
    } else if (this.toward === 'horizontal') {
        var slideWidth = this.slideshowElement.clientWidth;
    }

    if (index === -1) {
        var distance = -(slidesLen - 1) * slideWidth;
        _resetMoveDistance(distance);
        index = (slidesLen - 1) - 1;
    } else if (index === slidesLen) {
        _resetMoveDistance(0);
        index = 1;
    } else if (this.index === slidesLen - 1 && index !== undefined) {
        if (whoTrigger !== 'left-key') {
            _resetMoveDistance(0);
        }
    }

    _setMoveDistance(-(index * slideWidth));

    this.cleanDotFocus();
    dotIndex = index === slidesLen - 1 ? 0 : index;
    this.dots[dotIndex].classList.add('focus');
    this.index = index;
};

Bamboo.prototype.fade = function() {
    this.slideshowElement.classList.add('fade');
    this.setFocus(0);
};

Bamboo.prototype.fade.setFocus = function(index, playAnimation, whoTrigger) {
    playAnimation = playAnimation !== undefined ? playAnimation : true;
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
        slideEle.classList.remove('fade');
    }

    this.slides[prevIndex].style.zIndex = '1';
    this.slides[index].style.zIndex = '2';
    this.slides[index].classList.add('fade');

    this.cleanDotFocus();
    this.dots[index].classList.add('focus');
    this.index = index;
};

Bamboo.prototype.down = function() {
    this.slideshowElement.classList.add('down');
    this.setFocus(0);
};

Bamboo.prototype.down.setFocus = function(index, playAnimation, whoTrigger) {
    playAnimation = playAnimation !== undefined ? playAnimation : true;
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
        if (whoTrigger === 'dot') {
            distance = '-100%';
        } else {
            distance = '100%';
        }
    } else if (index === this.slides.length - 1 && prevIndex === 0) {
        if (whoTrigger === 'dot') {
            distance = '100%';
        } else {
            distance = '-100%';
        }
    }

    this.slides[prevIndex].style.zIndex = '1';

    var currentElement = this.slides[index];
    var transitionProperty = currentElement.style.transitionProperty;

    currentElement.style.zIndex = '2';
    currentElement.style.transitionProperty = 'none';
    currentElement.style.transform = 'translate3d(0px, ' + distance + ', 0px)';
    currentElement.style.display = document.defaultView.getComputedStyle(this.slides[index])['display'];
    currentElement.style.transitionProperty = transitionProperty || 'all';
    currentElement.style.transform = 'translate3d(0px, 0px, 0px)';

    this.cleanDotFocus();
    this.dots[index].classList.add('focus');
    this.index = index;
};

Bamboo.prototype.blinds = function() {
    this.slideshowElement.classList.add('blinds');
    this.slides[0].style.zIndex = '2';
    this.slides[1].style.zIndex = '1';
    this.dots[0].classList.add('focus');
    // this.length = this.slides.length;
};

Bamboo.prototype.blinds.setFocus = function(index, playAnimation, whoTrigger) {
    playAnimation = playAnimation !== undefined ? playAnimation : true;
    var prevIndex = this.index;

    if (index === -1) {
        index = this.slides.length - 1;
    }
    console.log(index, this.slides.length);
    if (index === this.slides.length) {
        index = 0;
    }
    if (index === 4) {
        console.log('bug');
    }

    var tempElement = this.slideshowElement.querySelector('.TEMP');
    if (tempElement) {
        tempElement.parentElement.removeChild(tempElement);
        clearInterval(this.animation);
    }

    this.slides[index].style.zIndex = '1';
    var tempElement = document.createElement('div');
    tempElement.style.zIndex = '2';
    tempElement.classList.add('TEMP');
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

    this.cleanDotFocus();
    this.dots[index].classList.add('focus');
    this.index = index;
};

Bamboo.prototype.square = function() {
    this.slideshowElement.classList.add('square');
    this.slides[0].style.zIndex = '2';
    this.slides[1].style.zIndex = '1';
    this.dots[0].classList.add('focus');
};

Bamboo.prototype.square.setFocus = function(index, playAnimation, whoTrigger) {
    playAnimation = playAnimation !== undefined ? playAnimation : true;
    var prevIndex = this.index;

    if (index === -1) {
        index = this.slides.length - 1;
    } else if (index === this.slides.length) {
        index = 0;
    } else if (index === prevIndex) {
        return;
    }
    var _this = this;
    var tempElement = this.slideshowElement.querySelector('.TEMP');
    if (tempElement) {
        tempElement.parentElement.removeChild(tempElement);
        clearInterval(this.animation);
    }

    this.slides[prevIndex].style.zIndex = '0';
    this.slides[index].style.zIndex = '1';

    var tempElement = document.createElement('div');
    tempElement.style.zIndex = '2';
    tempElement.classList.add('TEMP');
    tempElement.style.width = this.slides[prevIndex].clientWidth + 'px';
    tempElement.style.height = this.slides[prevIndex].clientHeight + 'px';
    var h = 16;
    var v = 8;
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
        // if (i >= len / 4) {
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
    }, 200);

    this.cleanDotFocus();
    this.dots[index].classList.add('focus');
    this.index = index;
};