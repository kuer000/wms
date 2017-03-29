var express = require('express');
var router = express.Router();
var request = require('request');
var server = require('../serverConfig/server/wmsServerHost.json');


router.param('_url', function (req, res, next, url) {
    if (typeof req.session.user !== 'undefined') {

        var urlName = '';

        switch (url) {
            case 'userManagement':
                switch (parseInt(req.params._status)) {
                    case 0:
                        urlName = '用户管理-加载用户管理页面';
                        req = autoUrl(req, '/user', "POST", function (json) {
                            res.send(json);
                        });
                        break;
                    case 1:
                        urlName = '用户管理-新增-启用-配置角色';
                        req = autoUrl(req, '/user/', "", function (json) {
                            res.send(json);
                        });
                        break;
                    case 2:
                        urlName = '用户管理-启用';
                        req = autoUrl(req, '/user/liveUsersByUids', "POST", function (json) {
                            res.send(json);
                        });
                        break;
                    case 3:
                        urlName = '用户管理-配置角色';
                        req = autoUrl(req, '/user/userAddRoles', "POST", function (json) {
                            res.send(json);
                        });
                        break;
                    case 4:
                        urlName = '用户管理-编辑';
                        req = autoUrl(req, '/user', "PUT", function (json) {
                            res.send(json);
                        });
                        break;
                    case 5:
                        urlName = '用户管理-重置密码';
                        req = autoUrl(req, '/user/resetPwd', "POST", function (json) {
                            res.send(json);
                        });
                        break;
                    case 6:
                        urlName = '用户管理-禁用';
                        req = autoUrl(req, '/user/dieUsersByUids', "POST ", function (json) {
                            res.send(json);
                        });
                        break;
                    case 7:
                        urlName = '用户管理-判断用户名是否重复';
                        req = autoUrl(req, '/user/isRepeatByUsername/{username}', "GET", function (json) {
                            res.send(json);
                        });
                        break;
                    case 8:
                        urlName = '用户管理-判断登录账号是否重复';
                        req = autoUrl(req, '/user/isRepeatByLoginname/{loginname}', "GET ", function (json) {
                            res.send(json);
                        });
                        break;

                }
                break;

        }111

        console.log(req.session.user.rmsUser.ruUserName + '\t请求：\t' + urlName + '\t' + url);
        next();
    }111
    else {
        var err = new Error('您没有权限，请您重新登录');
        err.status = 403;
        next(err);
    }

});
function autoUrl(req, url, data, method, cal) {
    req.url = url;
    req.data = data;
    req.method = method;
    req.cal = cal;
}

//请求java服务器
router.get('/:_url/:_status', function (req, res, next) {
    request({
        method: req.method,
        json: true,
        url: server.host + '/' + server.port + req.url,
        data: req.data,
        headers: {"Content-Type": 'application/json'}
    }, function (error, response, json) {
        if (!error && response.statusCode == 200) {
            req.cal();
        } else {
            return res.send({
                status: 500,
                message: "服务器未响应"
            });
        }
    });
});

module.exports = router;

