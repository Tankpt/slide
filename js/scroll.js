/*
* options :
*	1. container : 
*	2. index :  0-..
*	3. 
*/
;(function(window,$){

  function whichTransitionEvent(){
    var t,
        el = document.createElement('fakeelement'),
        transitions = {
          'WebkitAnimation' : 'webkitAnimationEnd',
          'OAnimation' : 'oAnimationEnd',
          'msAnimation' : 'MSAnimationEnd',
          'animation' : 'animationend'
        };

    for(t in transitions){
      if( el.style[t] !== undefined ){
        return transitions[t];
      }
    }
  }

  var transitionEvent = whichTransitionEvent();

  var SlidePage = function(options){
  		
    this.$container = $(options.container);
    this.index = options.index || 0 ;
    this.attr = options.attr || 'animate';
    this.initial();
	}

  SlidePage.prototype.initial = function() {
    this.pageArray = this.$container.find(".pt-page");
    this.pageLength = this.pageArray.length;
    this.isAnimating  = false;
    this.animationArray = [];

    var self = this,
        attr = this.attr;
    $.each(this.pageArray,function(index,item){
      var $item = $(item);
      self.animationArray.push($item.data(attr));
      $item.css("z-index",index);
    });

  };

  SlidePage.prototype.animcursorCheck = function(param){
    if(this.isAnimating){
      return false;
    }else{
      return true;
    }
  };

  SlidePage.prototype.nextPage = function() {
    if(this.animcursorCheck('next') && this.index != this.pageLength -1){
      
      var outClass = this.animationArray[this.index],
          $outNode = this.pageArray.eq(this.index),
          inClass = this.animationArray[++this.index],
          $inNode = this.pageArray.eq(this.index),
          self = this;

      this.isAnimating = true;
      
      $inNode.addClass(inClass+' pt-page-current animated').one(transitionEvent,function(){
        $outNode.removeClass('pt-page-current');
        $inNode.removeClass(inClass+' animated');
        self.isAnimating = false;
      })
    }
  };

  SlidePage.prototype.prePage = function() {
    if(this.animcursorCheck('pre') && this.index != 0){
      var outClass = this.animationArray[this.index],
          $outNode = this.pageArray.eq(this.index),
          inClass = this.animationArray[--this.index],
          $inNode = this.pageArray.eq(this.index),
          self = this;

      this.isAnimating = true;
      window.a = inClass;
      window.$a = $inNode;
      window.b = outClass;
      window.$b = $outNode;
      $inNode.addClass('pt-page-current');
    
      //$outNode.addClass(outClass+' animated');
      /*$inNode.addClass(inClass+'pt-page-current').one(transitionEvent,function(){
        $outNode.removeClass(outClass+' animated pt-page-current');
        $inNode.removeClass(inClass+' animated');
        self.isAnimating = false;
      })*/
      $outNode.addClass(outClass+' out animated').one(transitionEvent,function(){
        $outNode.removeClass(outClass+' out animated pt-page-current');
        self.isAnimating = false;
      })
    }
  };

 

  if ( typeof module != 'undefined' && module.exports ) {
    module.exports = SlidePage;
  } else {
    window.SlidePage = SlidePage;
  }
})(window,$)