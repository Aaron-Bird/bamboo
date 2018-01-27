var temp = {
    createNew: function(slideshowElement, parameters) {
        var slideshow = Bamboo.createNew(slideshowElement, parameters);
        slideshow.init = function() {
  
        };
        slideshow.setFocus = function(index, autoPlayAnimation, whoTrigger) {
            isbaka() ? slideshow.focusByJs(index, autoPlayAnimation, whoTrigger) : slideshow.focusByCss(index, autoPlayAnimation, whoTrigger);
        };
        slideshow.focusByCss = function(index, autoPlayAnimation, whoTrigger) { 

        };
        slideshow.focusByJs = function(index, autoPlayAnimation, whoTrigger){

        };

        slideshow.init();
        return slideshow;
    },
};
