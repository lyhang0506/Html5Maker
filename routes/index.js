var express = require('express');
var router = express.Router();
var fs = require('fs');
var projects = [];
var path = require("path");
var projectPath = path.normalize(__dirname + "/../public/projects");
var url = require('url');
var querystring = require('querystring');
var source = {};
var sourceIndex = 0;

var get = function (name, rUrl) {
    var getQuery = url.parse(rUrl).query;
    var getData = querystring.parse(getQuery); //getData数据
    if (typeof(name) == 'object') { //数组形式传递进来
        var temp = {};
        for (var i = 0; i < name.length; i++) {
            if (getData[name[i]]) {
                temp[name[i]] = getData[name[i]];
            } else {
                temp[name[i]] = '';
            }
        }
        return temp;
    } else {
        if (getData[name]) {
            return getData[name];
        } else {
            return '';
        }
    }
}

/* GET home page. */
router.get('/', function (req, res) {
    var projectPath = path.normalize(__dirname + "/../public/projects");
    travel(projectPath);
    res.render('index', { title: 'Html5Maker', projects: projects });
});


//遍历工程下projects文件夹内所有文件夹
function travel(dir) {
    projects = [];
    var tempProject;
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);
        if (fs.statSync(pathname).isDirectory()) {
            tempProject = {};
            tempProject.name = file;
            tempProject.path = pathname;
        }
        projects.push(tempProject);
    });
}

//遍历文件夹下所有子文件夹和子文件
function travelFiles(dir, sourceDir) {
    var parent;
    if(sourceDir.id) {
        parent = sourceDir.id;
    }else {
        parent = "#";
    }
    if(source == sourceDir) {
        source = {
            core:{
                data:[]
            }
        }
    }
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);
        var tempFile = {};
        var arr = [];
        sourceIndex++;
        tempFile.id = sourceIndex;
        tempFile.parent = parent;
        tempFile.name = file;
        tempFile.src = pathname;
        arr = tempFile.name.split(".");
        if(arr.length>1) {
            tempFile.type = arr[1];
        }else {
            tempFile.type = "dir"
        }
        source.core.data.push(tempFile);
        if (fs.statSync(pathname).isDirectory()) {
            travelFiles(pathname, tempFile);
        }
    });
}

//创建工程并返回ide首页
router.post('/createProject', function (req, res) {

    var newDirPath = projectPath + "/" + req.body.projectName;
    fs.mkdirSync(newDirPath, "0777");

    var project = {};
    project.config = {};
    project.director = {};
    project.config.title = req.body.projectTitle;
    project.config.width = req.body.screenWidth;
    project.config.height = req.body.screenHeight;

    var options = {
        flags: 'w',
        encoding: null,
        mode: 0777
    }

    var projectJson = JSON.stringify(project);
    fs.writeFileSync(newDirPath + "/buildProject.json", projectJson, options);

    travel(projectPath);
    res.render('index', { title: 'Html5Maker', projects: projects });

});

//根据选择的工程进入编辑器
router.get('/editor', function (req, res) {
    var projectPath = get("path", req.url);
    var json = require(projectPath + '/buildProject.json');
    source = {};
    sourceIndex = 0;
    travelFiles(projectPath, source);
    res.render('editor', { buildProjectJson: json, sourceJson:source});
});


module.exports = router;
