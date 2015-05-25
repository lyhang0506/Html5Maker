var Editor = Class.extend({
    init:function() {
        this.canvas = document.getElementById("canvas");
        this.preCanvas = document.getElementById("preCanvas");
        this.canvasDiv = document.getElementById("canvasDiv");
        this.preCanvasDiv = document.getElementById("preContent");
        this.range = document.getElementById("workSpaceRange");
        this.rangeX = document.getElementById("workSpaceRangeX");
        this.rangeY = document.getElementById("workSpaceRangeY");

        this.saveOptionBTN = document.getElementById("saveOptionBTN");
        this.deleteElementBTN = document.getElementById("deleteElementBTN");
        this.centerRegXBTN = document.getElementById("centerRegXBTN");
        this.centerRegYBTN = document.getElementById("centerRegYBTN");

        //------------------------属性输入对象初始化---------------------------
        this.attrOption = {};
        this.attrOption.type = document.getElementById("type");
        this.attrOption.viewName = document.getElementById("viewName");
        //------------------------属性输入对象初始化---------------------------

        //-----------------常规选项输入对象初始化----------------------------
        this.commonOption = {};
        this.commonOption.x = document.getElementById("x");
        this.commonOption.y = document.getElementById("y");
        this.commonOption.width = document.getElementById("width");
        this.commonOption.height = document.getElementById("height");
        this.commonOption.regX = document.getElementById("regX");
        this.commonOption.regY = document.getElementById("regY");
        this.commonOption.skewX = document.getElementById("skewX");
        this.commonOption.skewY = document.getElementById("skewY");
        this.commonOption.scaleX = document.getElementById("scaleX");
        this.commonOption.scaleY = document.getElementById("scaleY");
        this.commonOption.rotation = document.getElementById("rotation");
        this.commonOption.alpha = document.getElementById("alpha");
        this.commonOption.visible = document.getElementById("visible");
        this.commonOptionArr = [
            this.commonOption.x,
            this.commonOption.y,
            this.commonOption.regX,
            this.commonOption.regY,
            this.commonOption.skewX,
            this.commonOption.skewY,
            this.commonOption.scaleX,
            this.commonOption.scaleY,
            this.commonOption.rotation,
            this.commonOption.alpha,
            this.commonOption.visible
        ];
        //-----------------常规选项输入对象初始化----------------------------
        this.stage = new createjs.Stage(this.canvas);
        this.preStage = new createjs.Stage(this.preCanvas);
        this.workSpaceScale = 0;
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", this.stage);
        createjs.Ticker.addEventListener("tick", this.preStage);
        this.renderWorkPlace();
        this.initListener();
    },
    createElement:function(type) {
        switch (type) {
            case "Bitmap":
                var bitmap = new createjs.Bitmap("projects/test/2/bg.png");
                bitmap.type = "bitmap";
                bitmap.name = "test";
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
        this.submitStageEvent();
        this.submitOptionEvent();
        this.submitKeyIncreaseAndDecrease();
    },
    //-----------------------注册事件方法--------------------------
    //注册元件拖拽事件
    submitEditorItemMenu:function() {
        var self = this;
        document.getElementById("toggleEditorItemMenu").addEventListener("click",function(e) {
            self.toggleHiddenItemMenu();
        });
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
            self.rangeScale();
        });

        this.rangeX.addEventListener("change",function() {
            self.rangeXFix();
        });

        this.rangeY.addEventListener("change",function() {
            self.rangeYFix();
        });

    },
    //stage点击事件
    submitStageEvent:function() {
        var self = this;
        //阻止canvas系统默认右键菜单
        this.canvas.oncontextmenu = function() {
          return false;
        };
        this.stage.addEventListener("pressup",function(e) {
            if(e.nativeEvent.button == 0) {
                self.stageLeftMousePressUp(e);
            }
        });
        this.preStage.addEventListener("stagemousemove",function(e) {
            if(self.currentStageTarget.type == "bitmap") {
                self.changePreText(e);
            }
        })
    },
    //选项焦点事件
    submitOptionEvent:function() {
        var self = this;
        document.getElementById("option").addEventListener("click",function(e) {
            if(e.button == 0) {
                self.optionLeftMouseClick(e);
            }
        });
        document.getElementById("option").addEventListener("keydown",function(e) {
            self.optionKeyDown(e);
        });
        document.getElementById("option").addEventListener("keyup",function(e) {
            self.optionKeyUp(e);
        });
    },

    //键盘上下箭头事件
    submitKeyIncreaseAndDecrease:function() {
        var self = this;
        document.body.addEventListener("keydown",function(e) {
            if(e.keyCode == 38&&self.currentOptionTarget) {
                e.preventDefault();
                self.optionIncrease(e);
            }else if(e.keyCode == 40&&self.currentOptionTarget) {
                e.preventDefault();
                self.optionDecrease(e);
            }
        });
    },
    //-----------------------注册事件方法--------------------------


    //-------------------------------------事件回调方法-----------------------------------------------------
    //改变预览框提示数值
    changePreText:function(e) {
        console.log(e);
        $("imgBounds").innerHTML = this.currentStageTarget.image.width+"*"+this.currentStageTarget.image.height;
        $("imgCor").innerHTML = "x:"+e.stageX+",y:"+ e.stageY;
    },

    //元件菜单显示隐藏
    toggleHiddenItemMenu:function() {
        $("left1").toggleClass("hidden");
        $("left2").toggleClass("block");
        this.scalePreView();
    },

    //滑块控制缩放
    rangeScale:function() {
        var self = this;
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
    },
    //滑块x轴移动事件
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
    //滑块Y轴移动
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
    },

    //stage对象鼠标左键点击事件
    stageLeftMousePressUp:function(e) {
        this.currentStageTarget = e.target;

        //属性输入框赋值
        this.attrOption.type.innerHTML = e.target.type;
        this.attrOption.viewName.value = e.target.name;

        //常规属性输入框赋值
        this.commonOption.x.value = e.target.x;
        this.commonOption.y.value = e.target.y;
        this.commonOption.regX.value = e.target.regX;
        this.commonOption.regY.value = e.target.regY;
        this.commonOption.skewX.value = e.target.skewX;
        this.commonOption.skewY.value = e.target.skewY;
        this.commonOption.scaleX.value = e.target.scaleX;
        this.commonOption.scaleY.value = e.target.scaleY;
        this.commonOption.rotation.value = e.target.rotation;
        this.commonOption.alpha.value = e.target.alpha;
        this.commonOption.visible.checked = e.target.visible;

        //根据显示元素类型决定是否disable长宽输入框
        switch (e.target.type) {
            case "bitmap":
                this.commonOption.width.disabled = "disable";
                this.commonOption.height.disabled = "disable";
                this.commonOption.width.value = e.target.image.width;
                this.commonOption.height.value = e.target.image.height;
                //如果点中元素是图片就在预览框内显示图片
                this.scalePreView();
                this.preViewPic(e.target);
                break;
        }
    },

    //在预览框内预览图片
    preViewPic:function(target) {
        var bitmap = new createjs.Bitmap(target.image.currentSrc);
        this.preStage.addChild(bitmap);
    },

    scalePreView:function() {
        var width = this.currentStageTarget.image.width;
        var height = this.currentStageTarget.image.height;
        this.preCanvas.width = width;
        this.preCanvas.height = height;
        //this.preCanvasDiv.style.width = 200+"px";
        this.preCanvasDiv.style.height = 300+"px";
        var preViewWidth = $("preView").getSize().x;

        var scaleX = parseFloat((preViewWidth/width).toFixed(2));
        var scaleY = parseFloat((300/height).toFixed(2));
        var toScale = Math.min(scaleX,scaleY);

        this.scaleDom(this.preCanvas,toScale);
        this.preCanvas.style.marginTop = -(height/2)+150+"px";
        this.preCanvas.style.marginLeft = -(width/2)+preViewWidth/2+"px";
    },

    //选项键盘按键按下事件
    optionKeyDown:function(e) {
        if ((e.keyCode < 48 || (e.keyCode > 57&&e.keyCode<96) || (e.keyCode>105&&e.keyCode!=190&&e.keyCode!=110))&&e.keyCode!=8) {
            e.preventDefault ? e.preventDefault() : e.returnValue=false;
        }
    },
    //选项键盘按键弹起事件
    optionKeyUp:function(e) {
    },

    //选项鼠标左键点击事件
    optionLeftMouseClick:function(e) {
        if(e.target.tagName == "INPUT"&&e.target.id!="viewName"&& !e.target.disabled) {
            this.currentOptionTarget = e.target;
        }

        if(this.currentStageTarget) {
            switch (e.target.id) {
                case "visible":
                    this.currentStageTarget.visible = e.target.checked;
                    break;
                case "centerRegXBTN":
                    this.currentStageTarget.regX = parseInt(parseInt(this.commonOption.width.value)/2);
                    this.commonOption.regX.value = this.currentStageTarget.regX;
                    break;
                case "centerRegYBTN":
                    this.currentStageTarget.regY = parseInt(parseInt(this.commonOption.height.value)/2);
                    this.commonOption.regY.value = this.currentStageTarget.regY;
                    break;
                case "saveOptionBTN":
                    this.applyAllSet();
                    break;
            }
        }
    },

    //键盘上箭头按下
    optionIncrease:function() {
        var value = 0;
        if(this.currentOptionTarget.id=="alpha") {
            value = parseFloat(this.currentOptionTarget.value);
            value+=0.01;
            if(value>1) {
                value=1;
            }else {
                value = value.toFixed(2);
            }
        }else if(this.currentOptionTarget.id=="scaleX"||this.currentOptionTarget.id=="scaleY") {
            value = parseFloat(this.currentOptionTarget.value);
            value+=0.1;
            value = value.toFixed(1);
        }else{
            value = parseInt(this.currentOptionTarget.value);
            value+=1;
        }

        this.currentOptionTarget.value = value;
        this.applySetByFocus(value);
    },
    //键盘下箭头按下
    optionDecrease:function() {
        var value = 0;
        if(this.currentOptionTarget.id=="alpha") {
            value = parseFloat(this.currentOptionTarget.value);
            value-=0.01;
            if(value<0) {
                value=0;
            }else {
                value = value.toFixed(2);
            }
        }else if(this.currentOptionTarget.id=="scaleX"||this.currentOptionTarget.id=="scaleY") {
            value = parseFloat(this.currentOptionTarget.value);
            value-=0.1;
            if(value<0) {
                value = 0;
            }else {
                value = value.toFixed(1);
            }
        }else{
            value = parseInt(this.currentOptionTarget.value);
            value-=1;
        }
        this.currentOptionTarget.value = value;
        this.applySetByFocus(value);
    },

    //显示元素应用当前焦点输入框设置的值
    applySetByFocus:function(value) {
        switch (this.currentOptionTarget.id) {
            case "x":
                this.currentStageTarget.x = value;
                break;
            case "y":
                this.currentStageTarget.y = value;
                break;
            case "regX":
                this.currentStageTarget.regX = value;
                break;
            case "regY":
                this.currentStageTarget.regY = value;
                break;
            case "skewX":
                this.currentStageTarget.skewX = value;
                break;
            case "skewY":
                this.currentStageTarget.skewY = value;
                break;
            case "scaleX":
                this.currentStageTarget.scaleX = value;
                break;
            case "scaleY":
                this.currentStageTarget.scaleY = value;
                break;
            case "rotation":
                this.currentStageTarget.rotation = value;
                break;
            case "alpha":
                this.currentStageTarget.alpha = value;
                break;
        }
    },

    //显示元素应用所有输入框设置的值
    applyAllSet:function() {
        for(var i =0;i<this.commonOptionArr.length;i++) {
            var option = this.commonOptionArr[i];
            switch (option.id) {
                case "x":
                    if(typeof parseInt(option.value) == "number"&&!isNaN(parseInt(option.value))) {
                        option.value = parseInt(option.value);
                        this.currentStageTarget.x = option.value;
                    }else {
                        alert("请确保输入的x坐标为整数");
                        return;
                    }
                    break;
                case "y":
                    if(typeof parseInt(option.value) == "number"&&!isNaN(parseInt(option.value))) {
                        option.value = parseInt(option.value);
                        this.currentStageTarget.y = option.value;
                    }else {
                        alert("请确保输入的y坐标为整数");
                        return;
                    }
                    break;
                case "regX":
                    if(typeof parseInt(option.value) == "number"&&!isNaN(parseInt(option.value))) {
                        option.value = parseInt(option.value);
                        this.currentStageTarget.regX = option.value;
                    }else {
                        alert("请确保输入的regX为整数");
                        return;
                    }
                    break;
                case "regY":
                    if(typeof parseInt(option.value) == "number"&&!isNaN(parseInt(option.value))) {
                        option.value = parseInt(option.value);
                        this.currentStageTarget.regY = option.value;
                    }else {
                        alert("请确保输入的regY为整数");
                        return;
                    }
                    break;
                case "skewX":
                    if(typeof parseInt(option.value) == "number"&&!isNaN(parseInt(option.value))) {
                        option.value = parseInt(option.value);
                        this.currentStageTarget.skewX = option.value;
                    }else {
                        alert("请确保输入的skewX为整数");
                        return;
                    }
                    break;
                case "skewY":
                    if(typeof parseInt(option.value) == "number"&&!isNaN(parseInt(option.value))) {
                        option.value = parseInt(option.value);
                        this.currentStageTarget.skewY = option.value;
                    }else {
                        alert("请确保输入的skewY为整数");
                        return;
                    }
                    break;
                case "scaleX":
                    if(typeof parseFloat(option.value) == "number"&&!isNaN(parseFloat(option.value))) {
                        option.value = parseFloat(option.value);
                        this.currentStageTarget.scaleX = option.value;
                    }else {
                        alert("请确保输入的scaleX为整数或小数");
                        return;
                    }
                    break;
                case "scaleY":
                    if(typeof parseFloat(option.value) == "number"&&!isNaN(parseFloat(option.value))) {
                        option.value = parseFloat(option.value);
                        this.currentStageTarget.scaleY = option.value;
                    }else {
                        alert("请确保输入的scaleY为整数或小数");
                        return;
                    }
                    break;
                case "rotation":
                    if(typeof parseInt(option.value) == "number"&&!isNaN(parseInt(option.value))) {
                        option.value = parseInt(option.value);
                        this.currentStageTarget.rotation = option.value;
                    }else {
                        alert("请确保输入的rotation为整数");
                        return;
                    }
                    break;
                case "alpha":
                    if(typeof parseFloat(option.value) == "number"&&!isNaN(parseFloat(option.value)&&(parseFloat(option.value)<=1||parseFloat(option.value)>=0))) {
                        option.value = parseFloat(option.value);
                        this.currentStageTarget.alpha = option.value;
                    }else {
                        alert("请确保输入的alpha为0-1的整数或小数");
                        return;
                    }
                    break;
                case "visible":
                    this.currentStageTarget.visible = option.checked;
                    break;
                case "viewName":
                    break;
            }
        }
    }
    //-------------------------------------事件回调方法-----------------------------------------------------
});