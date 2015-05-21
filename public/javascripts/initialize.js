var buildProjectObj, sourceObj,canvas;
function parseSource(sourceStr) {
    sourceStr = sourceStr.replace(/&quot;/g, "\"");
    sourceStr = sourceStr.replace(/\\/g, "\\\\");
    sourceObj = JSON.parse(sourceStr);
}

function parseBuildProject(buildProjectStr) {
    buildProjectStr = buildProjectStr.replace(/&quot;/g, "\"");
    buildProjectObj = JSON.parse(buildProjectStr);
}

function initialize() {
    var SwitchNav = function(wrap){
        this.navBtns = $(wrap).find(".navBtn");
        this.navConts = $(wrap).find(".navCont");
        this.actIndex = 0;
        this.init();
    };
    SwitchNav.prototype.init=function(){
        var self = this;
        //1.初始化内容区域
        for(var i =0;i<this.navConts.length;i++) {
            if(i>0){
                $(this.navConts[i]).css("display","none");
            }else{
                $(this.navConts[i]).css("display","block");
            }
        }
       //2.设置下标
        for (var i = 0; i < this.navBtns.length; i++) {
            var obj = this.navBtns[i];
            obj.setAttribute("k",i);
            
        }
        //bind Event
        for (var i = 0; i < this.navBtns.length; i++) {
            var obj = this.navBtns[i];
            obj.addEventListener("click",function(){
                var k = this.getAttribute("k");
                if(k!=self.actIndex){
                    self.navConts[self.actIndex].style.display ="none";
                    self.navConts[k].style.display = "block";
                    self.actIndex = k;
                }
            })
        }
    };
    new SwitchNav($("#left2 .navWrap")[0]);
    //元件菜单开启关闭逻辑
    var left1El = $("#left1");
    var left2El = $("#left2");
    $("#toggleEditorItemMenu").click(function(){
        left1El.toggleClass("hidden");
        left2El.toggleClass("block");
    });

    var editor = new Editor();
    //editor.renderWorkPlace();
    //editor.submitEditorItemMenu();
}
