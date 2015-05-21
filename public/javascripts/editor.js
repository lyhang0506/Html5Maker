var Editor = Class.extend({
    init:function() {
        this.canvas = document.getElementById("canvas");
        this.canvasDiv = document.getElementById("canvasDiv");
        this.range = document.getElementById("workSpaceRange");
        this.rangeX = document.getElementById("workSpaceRangeX");
        this.rangeY = document.getElementById("workSpaceRangeY");
        this.stage = new createjs.Stage(this.canvas);
        this.workSpaceScale = 0;
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", this.stage);
        this.renderWorkPlace();
        this.initListener();
    },
    createElement:function(type) {
        switch (type) {
            case "Bitmap":
                var bitmap = new createjs.Bitmap("projects/test/2/bg.png");
                this.stage.addChild(bitmap);
                break;
        }
    },
    //----------------渲染工作空间----------------------
    renderWorkPlace:function() {
        var fixH = 80;
        this.canvasDiv = document.getElementById("canvasDiv");
        this.canvasWidth = parseInt(buildProjectObj.config.width);
        this.canvasHeight = parseInt(buildProjectObj.config.height);
        this.canvasDivWidth = this.canvasWidth+fixH;
        this.canvasDivHeight = this.canvasHeight + fixH/2;

        this.canvasDiv.style.width = this.canvasDivWidth+"px";
        this.canvasDiv.style.height =  this.canvasDivHeight+"px";
        this.canvasDiv.style.paddingTop = fixH/2 + "px";

        this.canvasDivMarginLeft = this.canvasDivWidth/2;
        this.canvasDivMarginTop = (this.canvasDivHeight+fixH/2)/2;

        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.canvasDiv.style.marginLeft = ("-"+this.canvasDivMarginLeft+"px");
        this.canvasDiv.style.marginTop = ("-"+this.canvasDivMarginTop+"px");


        this.workSpaceScale = 760/(this.canvasWidth+fixH);
        this.scaleDom(this.canvasDiv,this.workSpaceScale);
    },

    //根据缩放倍数缩放dom元素
    scaleDom:function(dom,scale) {
        dom.style["transform"] = 'scale(' + scale + ')';
        dom.style["msTransform"] = 'scale(' + scale + ')';
        dom.style["MozTransform"] = 'scale(' + scale + ')';
        dom.style["WebkitTransform"] = 'scale(' + scale + ')';
    },

    initListener:function() {
        this.submitEditorItemMenu();
        this.submitRange();
    },

    //-----------------------注册事件方法--------------------------
    //注册元件拖拽事件
    submitEditorItemMenu:function() {
        var self = this;
        document.getElementById("editorItemMenu").addEventListener("dragstart", function (e) {
            e.dataTransfer.setData("Text",e.target.getAttribute("name"));
        });
        document.getElementById("canvasDiv").addEventListener("dragover",function(e) {
            e.preventDefault();
        });
        document.getElementById("canvasDiv").addEventListener("drop",function(e) {
            e.preventDefault();
            self.createElement(e.dataTransfer.getData("Text"));
        });
    },
    //注册缩放工作空间滑块事件
    submitRange:function() {
        var self = this;
        this.range = document.getElementById("workSpaceRange");
        this.rangeX = document.getElementById("workSpaceRangeX");
        this.rangeY = document.getElementById("workSpaceRangeY");

        this.range.value = this.workSpaceScale;
        this.range.addEventListener("change",function() {
            self.workSpaceScale = self.range.value;
            self.scaleDom(self.canvasDiv,self.workSpaceScale);
            if(1300-self.canvasDivWidth*self.workSpaceScale<0){
                self.rangeXFix();
            }else {
                self.canvasDiv.style.marginLeft = -self.canvasDivMarginLeft+"px";
            }

            if(1000-self.canvasDivHeight*self.workSpaceScale<0) {
                self.rangeYFix();
            }else {
                self.canvasDiv.style.marginTop = -self.canvasDivMarginTop+"px";
            }
        });

        this.rangeX.addEventListener("change",function() {
            self.rangeXFix();
        });

        this.rangeY.addEventListener("change",function() {
            self.rangeYFix();
        });

    },

    //滑块检测事件
    rangeXFix:function() {
        var self = this;
        if(1300-self.canvasDivWidth*self.workSpaceScale<0) {
            var fixX = self.canvasDivWidth*self.workSpaceScale-1300;
            var perX = fixX/100;
            if(self.rangeX.value < 50) {
                self.canvasDiv.style.marginLeft = -(self.canvasDivMarginLeft-(50-self.rangeX.value)*perX)+"px"
            }else if(self.rangeX.value >50) {
                self.canvasDiv.style.marginLeft = -(self.canvasDivMarginLeft+(self.rangeX.value-50)*perX)+"px"
            }else {
                self.canvasDiv.style.marginLeft = -self.canvasDivMarginLeft+"px";
            }
        }
    },
    rangeYFix:function() {
        var self = this;
        if(1000-self.canvasDivHeight*self.workSpaceScale<0) {
            var fixY = self.canvasDivHeight*self.workSpaceScale-1000;
            var perY = fixY/100;
            if(self.rangeY.value < 50) {
                self.canvasDiv.style.marginTop = -(self.canvasDivMarginTop-(50-self.rangeY.value)*perY)+"px"
            }else if(self.rangeY.value >50) {
                self.canvasDiv.style.marginTop = -(self.canvasDivMarginTop+(self.rangeY.value-50)*perY)+"px"
            }else {
                self.canvasDiv.style.marginTop = -self.canvasDivMarginTop+"px";
            }
        }
    }

    //-----------------------注册事件方法--------------------------

});