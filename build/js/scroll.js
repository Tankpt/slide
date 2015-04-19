
/*
@description  类似幻灯片轮播的工具
*@author      tankpt
*@email       tinkpt@hotmail.com
*@version     1.0
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
    /*
    *@para options(obj)
    *@para option.container 容器的选择器
    *@para option.attr 标签中data-**的属性名，定义动画名字默认是animate
    *@para option.delay 标签中默认延迟动画的名字data-*，默认是delay
    *@para option.preLoadNum 惰性加载的控制数量
    */
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

      this.index = 0 ;
      /*缓存所有的页面DOM节点*/
      this.pageArray = this.$container.find(".pt-page");
      /*缓存子页面的数量*/
      this.pageLength = this.pageArray.length;
      /*标识页面切换的过程中是否正在进行动画*/
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
          $outNode.removeClass('pt-page-current');
          $inNode.removeClass(inClass);
          self._showPage(inIndex,outIndex);
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
        /*往前翻，为了防止本页隐藏的时候出现白屏，先将上一页显示*/
        $inNode.addClass('pt-page-current');

        $outNode.addClass(outClass).one(transitionEvent,function(){
          $outNode.removeClass(outClass+' pt-page-current');
          self._showPage(inIndex,outIndex);
          self.isAnimating = false;
        })
      }
    };

    SlidePage.prototype._showPage = function(inIndex,outIndex){
      var animateIn = this.childrenNodes[inIndex].data("animate")+' animated';
      this.childrenNodes[inIndex].removeClass("removeable").addClass(animateIn);
      if(outIndex!= void 0){
        var animateOut = this.childrenNodes[outIndex].data('animate')+' animated';
        this.childrenNodes[outIndex].addClass("removeable").removeClass(animateOut);
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
        
        if(this.lazyArray[i]===0){
          var $node = this.pageArray.eq(i);
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