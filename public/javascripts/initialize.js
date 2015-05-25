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
        this.navBtns = wrap.getElements(".navBtn");
        this.navConts = wrap.getElements(".navCont");
        this.actIndex = 0;
        this.init();
    };
    SwitchNav.prototype.init=function(){
        var self = this;
        //1.初始化内容区域
        for(var i =0;i<this.navConts.length;i++) {
            if(i>0){
                this.navConts[i].setStyle("display","none");
            }else{
                this.navConts[i].setStyle("display","block");
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
    new SwitchNav($$("#left2 .navWrap")[0]);

    var editor = new Editor();
    //editor.renderWorkPlace();
    //editor.submitEditorItemMenu();
}
