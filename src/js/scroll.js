/*
* @param options {
*          container :   
*        }
*	1. container : 
*	2. attr :  动画的data-**的属性名，防止冲突
*	3. 
*/
;(function(window,$){
    /*浏览器支持的动画事件*/
  	var transitionEvent = (function(){
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
    })();

  	var SlidePage = function(options){
    	this.$container = $(options.container);
    	this.attr = options.attr || 'animate';
      this.lazyClass = options.delay || 'lazyload';
      this.preLoadNum = options.preLoadNum || 3;
    	this._initial();
	  }
    /*
    *初始化：
    */
  	SlidePage.prototype._initial = function() {
      $("html").height($(window).height());
      $("html").width($(window).width());
      this.index = 0 ;
    	this.pageArray = this.$container.find(".pt-page");
    	this.pageLength = this.pageArray.length;
    	this.isAnimating  = false;
      /*存放所有页面节点的动画队列*/
    	this.animationArray = [];
      /*存放所有页面中开启了延迟加载的动画队列*/
      this.childrenNodes = [];
      /*存放页面之中延迟加载的背景图*/
      this.lazyArray =[];

    	var self = this,
        	attr = this.attr;

    	$.each(this.pageArray,function(index,item){
    		var $item = $(item);
    		self.animationArray.push($item.data(attr));
        self.childrenNodes.push($item.children(".removeable"));
        self.lazyArray.push(0);
    		$item.css("z-index",index);
    	});

      /**首页的动画*/
      this.pageArray.eq(this.index).addClass("pt-page-current");
      this._showPage(this.index);
    };

  	SlidePage.prototype.nextPage = function() {
    	if(!this.isAnimating && this.index != this.pageLength -1){
      
    		var outIndex = this.index,
            inIndex = ++this.index,
            outClass = this.animationArray[outIndex],
        		$outNode = this.pageArray.eq(outIndex),
        		inClass = this.animationArray[inIndex]+' animated',
        		$inNode = this.pageArray.eq(inIndex),
        		self = this;

    		this.isAnimating = true;
    
    		$inNode.addClass(inClass+' pt-page-current').one(transitionEvent,function(){
          self._showPage(inIndex,outIndex);
       		$outNode.removeClass('pt-page-current');
        	$inNode.removeClass(inClass);
        	self.isAnimating = false;
      	})
    	}
  	};

  	SlidePage.prototype.prePage = function() {
    	if(!this.isAnimating  && this.index != 0){

    		var outIndex = this.index,
            inIndex = --this.index,
            outClass = this.animationArray[outIndex]+' out animated',
            $outNode = this.pageArray.eq(outIndex),
            inClass = this.animationArray[inIndex],
            $inNode = this.pageArray.eq(inIndex),
        		self = this;
        
        this.isAnimating = true;
        $inNode.addClass('pt-page-current');

    		$outNode.addClass(outClass).one(transitionEvent,function(){
      		$outNode.removeClass(outClass+' pt-page-current');
          self._showPage(inIndex,outIndex);
      		self.isAnimating = false;
    		})
    	}
  	};

    SlidePage.prototype._showPage = function(inIndex,outIndex){
      this.childrenNodes[inIndex].removeClass("removeable");
      if(outIndex){
        this.childrenNodes[outIndex].addClass("removeable");
      }
      this._lazyLoad(inIndex);
      /*for(var i = 0, len = eleArray.length; i < len; i++){
        var ele = eleArray.eq(i),
            delaySecond = ele.data('delay');
        if(!!delaySecond){
          ele.css({
            'transition-delay' : delaySecond+'s',
            '-moz-transition-delay' : delaySecond+'s',
            '-webkit-transition-delay' : delaySecond+'s',
            '-o-transition-delay' : delaySecond+'s'
          }); 
        }
      }*/

      /*show node*/
      //eleArray.removeClass("removeable");
    };

    SlidePage.prototype._lazyLoad = function(index){
      for(var i = index, len = index+this.preLoadNum; i<len; i++){
        var $node = this.pageArray.eq(i);
        if(this.lazyArray[i]===0){
          /*子节点的处理*/
          var lazyItems = $node.find("."+this.lazyClass);
          /*父节点的处理*/
          $node.hasClass(this.lazyClass) ? lazyItems.push($node) : "";

          $.each(lazyItems,function(index,item){
            var $item = $(item),
                src = $item.attr("data-src"),
                bg = $item.attr("data-bg");
            
            bg ? $item.css("background-image", "url("+bg+")") : "";
            src ? $item.attr('src',src) : "";
          });

          this.lazyArray[i] = 1;
        }
      }
     
    };

  	if ( typeof module != 'undefined' && module.exports ) {
    	module.exports = SlidePage;
    } else {
    	window.SlidePage = SlidePage;
    }
})(window,Zepto)