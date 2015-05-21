(function(){
    /*
    * @author will.jiang
    * 日期 14-7-15 上午10:10
    * 功能描述 首页滚动条功能，垂直滚动
    * @param {num} 参数1说明
    * @return {num} 返回值说明
    * */
     function ScrollBar(handle,content){
         this.startY=0;
         this.endY=0;
        //bar的顶部坐标
         this.barTop =0;
         //容器的顶部坐标。做累加运算
         this.contentTop =0;
         //保存最终节诶过
         this.contentRsTop =0;
         //滚动条
         this.bar = handle;
         //滚动内容
         this.content =content;
         //滚动条的高度
         this.barH = 160;
         //容器的高度
         this.contentH =0;
         //保护区域的高度
         this.cPH =160;
        //容器/滚动条的高度
         this.ratio =1;
         //流程控制中心
         this.control();
     }
    //原型链上实现方法
    ScrollBar.prototype={
        /*
        * @author will.jiang
        * 日期 14-7-15 上午10:26
        * 功能描述 初始化方法
        * @param {num} 参数1说明
        * @return {num} 返回值说明
        * */
        init:function(){
         //需要初始化容器和滚动条的位置
            this.bar.css('top',0);
            this.content.css('top',0);
         //初始化比例
            this.ratio =  (this.content.height()-this.cPH)/this.barH;
            //取得滚动条距离页面顶部的高度
//            this.top = $(this.bar).offset().top;
        },
        control:function(){
            var self = this;
            //初始化操作
            this.init();
            //事件绑定
            this.bar.on('mousedown',mouseDown);
            //事件逻辑
            function mouseDown(evt){
                self.startY = evt.y||evt.pageY;
                console.log("startY:"+self.startY);
                //在window对象上绑定mousemove方法
                $(window).on('mousemove',mouseMove);
                //在window对象上绑定mouseup方法
                $(window).on('mouseup',mouseUp);
                //获取content内容区域的高度,还需要取出掉保护区域的高度
                self.contentH = self.content.height()-self.cPH;
                //初始化的高度
                self.barTop = parseInt(self.bar.css("top"));
                self.contentTop = parseInt(self.content.css("top"));
            }
            function mouseMove(evt){
                self.endY = evt.y||evt.pageY;

                //最终的top偏移量。
                var scroll =  self.endY -self.startY;
                var  rsH =scroll+self.barTop;
                //向下移动为-1，向上移动为1
                var  direction = -1;
                if(scroll<0){
                    direction=1;
                }

                if(rsH>=0){
                    rsH =  rsH>self.barH?self.barH:rsH;
                }else{
                    rsH=0;
                }
                //让滚动条移动到拖拽位置
                self.bar.css('top',rsH);
                //保留百分比
                var ratio = rsH/self.barH;
                //改变容器的坐标
                self.contentRsTop = Math.floor(self.contentH*ratio);
                //移动的有效距离。扣除容器的初始高度。结果带方向
                var between  = Math.abs(rsH - self.barTop)*direction;
                var rs = self.contentTop+self.contentH*ratio/2*direction;
                self.content.css('top',rs);
            }
            function mouseUp(){
                //调用该方法说明已经拖拽结束了。
                self.content.animate({
                    'top':-self.contentRsTop
                },400);
                //移除事件
                $(window).off('mousemove',mouseMove);
                $(window).off('mouseup',mouseUp);
            }

        }

    };

    new ScrollBar($("#js_bar"),$("#js_content"));
    /*
    * mousemove 方法需要设定容器，为了兼容用户在拖拽时脱离容器
    * 因此在容器中通过讲事件扩展到window对象上
    * 2.在触发mouseup后应该销毁对window事件的绑定。优化性能
    *
    * */
   /* $(window).on('mousemove',function(ev){
        var x = ev.x||ev.pageX;
        var y= ev.y ||ev.pageY;
            console.log("x:"+x+"||y:"+y);
    });*/
}());