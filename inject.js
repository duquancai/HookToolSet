const script = document.createElement('script');

function core(e, window) {
    var globalConfig = e;
    //console.log("inject start!", e)

    if (e["config-hook-debugger"]) {

        function Closure(injectFunction) {
            return function () {
                if (!arguments.length)
                    return injectFunction.apply(this, arguments)
                    arguments[arguments.length - 1] = arguments[arguments.length - 1].replace(/debugger/g, "");
                return injectFunction.apply(this, arguments)
            }
        }

        var oldFunctionConstructor = window.Function.prototype.constructor;
        window.Function.prototype.constructor = Closure(oldFunctionConstructor)
            //fix native function
        window.Function.prototype.constructor.toString = oldFunctionConstructor.toString.bind(oldFunctionConstructor);

        var oldFunction = Function;
        window.Function = Closure(oldFunction)
            //fix native function
        window.Function.toString = oldFunction.toString.bind(oldFunction);

        var oldEval = eval;
        window.eval = Closure(oldEval)
            //fix native function
        window.eval.toString = oldEval.toString.bind(oldEval);

        // hook GeneratorFunction
        var oldGeneratorFunctionConstructor = Object.getPrototypeOf(function  * () {}).constructor
            var newGeneratorFunctionConstructor = Closure(oldGeneratorFunctionConstructor)
            newGeneratorFunctionConstructor.toString = oldGeneratorFunctionConstructor.toString.bind(oldGeneratorFunctionConstructor);
        Object.defineProperty(oldGeneratorFunctionConstructor.prototype, "constructor", {
            value: newGeneratorFunctionConstructor,
            writable: false,
            configurable: true
        })

        // hook Async Function
        var oldAsyncFunctionConstructor = Object.getPrototypeOf(async function () {}).constructor
            var newAsyncFunctionConstructor = Closure(oldAsyncFunctionConstructor)
            newAsyncFunctionConstructor.toString = oldAsyncFunctionConstructor.toString.bind(oldAsyncFunctionConstructor);
        Object.defineProperty(oldAsyncFunctionConstructor.prototype, "constructor", {
            value: newAsyncFunctionConstructor,
            writable: false,
            configurable: true
        })

        // hook dom
        var oldSetAttribute = window.Element.prototype.setAttribute;
        window.Element.prototype.setAttribute = function (name, value) {
            if (typeof value == "string")
                value = value.replace(/debugger/g, "")
                    // 向上调用
                    oldSetAttribute.call(this, name, value)
        };
        var oldContentWindow = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "contentWindow").get
            Object.defineProperty(window.HTMLIFrameElement.prototype, "contentWindow", {
            get() {
                var newV = oldContentWindow.call(this)
                    if (!newV.inject) {
                        newV.inject = true;
                        core.call(newV, globalConfig, newV);
                    }
                    return newV
            }
        })

    }
    if (e["config-hook-pushState"]) {
        // hook pushState
        var oldHistoryPushState = history.pushState;
        var pushState = {};

        history.pushState = function () {
            // anti-shake filtering high frequency operation
            if (new Date() - pushState.lastTime > 200) {
                pushState.count = 0;
            }
            pushState.count++;
            if (pushState.count > 3)
                return;
            return oldHistoryPushState.apply(this, arguments)
        };
        history.pushState.toString = oldHistoryPushState.toString.bind(oldHistoryPushState)
    }
    if (e["config-hook-regExp"]) {
        // hook RegExp
        var oldRegExp = RegExp;
        RegExp = new Proxy(RegExp, {
            apply(target, thisArgument, argumentsList) {
                console.log("Some codes are setting RegExp...");
                debugger;
                // prevent detection of formatting
                if (argumentsList[0] == `\\w+ *\\(\\) *{\\w+ *['|"].+['|"];? *}`) {
                    return Reflect.apply(target, thisArgument, [""])
                }
                return Reflect.apply(target, thisArgument, argumentsList)
            }
        });
        RegExp.toString = oldRegExp.toString.bind(oldRegExp)
    }
    if (e["config-hook-console"]) {
        // hook console
        var oldConsole = ["debug", "error", "info", "log", "warn", "dir", "dirxml", "table", "trace", "group", "groupCollapsed", "groupEnd", "clear", "count", "countReset", "assert", "profile", "profileEnd", "time", "timeLog", "timeEnd", "timeStamp", "context", "memory"].map(key => {
            var old = console[key];
            console[key] = function () {};
            console[key].toString = old.toString.bind(old)
                return old;
        })
    }
    if (e["config-hook-setcookie"]) {
        (function () {
            'use strict';
            var pre = document.cookie;
            Object.defineProperty(document, 'cookie', {
                get: function () {
                    //console.log('Getting document.cookie')
                    return pre;

                },
                set: function (val) {
                    console.log('Setting document.cookie', val);
                    debugger;
                    pre = val

                }
            });
        })();
    }
    if (e["config-fuck-sojson"]) {
        (function () {
            var setInterval_ = setInterval;
            setInterval = function () {};
            setInterval.toString = function () {
                console.log("有函数正在检测setInterval是否被hook");
                return setInterval_.toString();
            };
        })();

        (function () {
            var _RegExp = RegExp;
            RegExp = function (pattern, modifiers) {
                if (pattern == decodeURIComponent("%5Cw%2B%20*%5C(%5C)%20*%7B%5Cw%2B%20*%5B'%7C%22%5D.%2B%5B'%7C%22%5D%3B%3F%20*%7D") || pattern == decodeURIComponent("function%20*%5C(%20*%5C)")
                     || pattern == decodeURIComponent("%5C%2B%5C%2B%20*(%3F%3A_0x(%3F%3A%5Ba-f0-9%5D)%7B4%2C6%7D%7C(%3F%3A%5Cb%7C%5Cd)%5Ba-z0-9%5D%7B1%2C4%7D(%3F%3A%5Cb%7C%5Cd))") || pattern == decodeURIComponent("(%5C%5C%5Bx%7Cu%5D(%5Cw)%7B2%2C4%7D)%2B")) {
                    pattern = '.*?';
                    console.log("发现sojson检测特征，已帮您处理。")
                }
                if (modifiers) {
                    console.log("疑似最后一个检测...已帮您处理。")
                    console.log("已通过全部检测，请手动处理debugger后尽情调试吧！")
                    return _RegExp(pattern, modifiers);
                } else {
                    return _RegExp(pattern);
                }
            };
            RegExp.toString = function () {
                return _RegExp.toString();
            };
        })();
    }
    if (e["config-hook-setInterval"]) {
        (function () {
            setInterval_ = setInterval;
            console.log("原函数已被重命名为setInterval_")
            setInterval = function () {};
            setInterval.toString = function () {
                console.log("有函数正在检测setInterval是否被hook");
                return setInterval_.toString();
            };
        })();
    }
    if (e["config-hook-stringify"]) {
        var rstringiyf = JSON.stringify;
        var stringify_key = prompt("请输入你要监视的关键字：")
        JSON.stringify = function (a) {
            console.log('Detect JSON.stringify 被转换的数据为: =>  ', a)
                for (const key in a) {
                    if (a.hasOwnProperty(key)) {
                        const element = a[key];
                        if (element == stringify_key) {
                            console.log("发现有代码正在将关键字对象转换为字符串...")
                            debugger;
                        }

                    }
                }
                return rstringiyf(a);
        }
        JSON.stringify.toString = function () {
            return rstringiyf.toString();
        }

        //JSON.parse
        var strparse = JSON.parse;
        JSON.parse = function (b) {
            console.log("Detect JSON.Parse");
            return strparse(b);
        }
    }
    if (e["config-hook-header"]) {
		(function(){
			let org = window.XMLHttpRequest.prototype.setRequestHeader;
			let head_key = prompt("请输入你要hook的关键字：");
			let reg = new RegExp(String(head_key), "i");
			window.XMLHttpRequest.prototype.setRequestHeader = function (key, value) {
				if(reg.test(key)){
					console.log(key,"--->",value);
					debugger;
				}
				return org.apply(this, arguments);
			};
			window.XMLHttpRequest.prototype.setRequestHeader.toString = org.toString.bind(org); 
		})();
    }	
    if (e["config-hook-url"]) {
		(function(){
			let org = window.XMLHttpRequest.prototype.open;
			let url_key = prompt("请输入你要hook的关键字：");
			window.XMLHttpRequest.prototype.open = function (method, url, async) {
				if (url.indexOf(url_key) != -1) {
						console.log(url_key, "--->", url)
						debugger;
					}
				return org.apply(this, arguments);
			};
			window.XMLHttpRequest.prototype.open.toString = org.toString.bind(org);
		})();
    }	
    if (e["config-hook-canvas"]) {
		(function() {
			let create_element = document.createElement.bind(doument);
			document.createElement = function (_element) {
				if (_element === "canvas") {
					console.log("create_element:",_element);
					debugger;
				}
				return create_element(_element);
			}
		})();
    }
    if (e["config-hook-localStorage"]) {
		(function() {
			let lctItem = window.Storage.prototype.setItem;
			window.Storage.prototype.setItem = function(keyName, keyValue){
				console.log("set_key_val:",keyName,'----->',keyValue);
				debugger;
				lctItem.apply(this,arguments);
			} 
			window.Storage.prototype.setItem.toString = lctItem.toString.bind(lctItem);
		})();
    }

    if (e["config-JsRpc"]) {
		(function () {
			function Hlclient(wsURL) {
				this.wsURL = wsURL;
				this.handlers = {};
				this.socket = {};
				if (!wsURL) {
					throw new Error('wsURL can not be empty!!')
				}
				this.connect()
				this.handlers["_execjs"]=function (resolve,param){
					var res=eval(param)
					if (!res){
						resolve("没有返回值")
					}else{
						resolve(res)
					}

				}
			}

			Hlclient.prototype.connect = function () {
				console.log(`http:\/\/127.0.0.1:12080/execjs?jscode='jscode'&${this.wsURL.split('?')[1]}`);
				var _this = this;
				try {
					this.socket["ySocket"] = new WebSocket(this.wsURL);
					this.socket["ySocket"].onmessage = function (e) {
						try{
							let blob=e.data
							blob.text().then(data =>{
								_this.handlerRequest(data);
							})
						}catch{
							console.log("not blob")
							_this.handlerRequest(blob)
						}

					}
				} catch (e) {
					console.log("connection failed,reconnect after 10s");
					setTimeout(function () {
						_this.connect()
					}, 10000)
				}
				this.socket["ySocket"].onclose = function () {
					console.log("connection failed,reconnect after 10s");
					setTimeout(function () {
						_this.connect()
					}, 10000)
				}

			};
			Hlclient.prototype.send = function (msg) {
				this.socket["ySocket"].send(msg)
			}

			Hlclient.prototype.regAction = function (func_name, func) {
				if (typeof func_name !== 'string') {
					throw new Error("an func_name must be string");
				}
				if (typeof func !== 'function') {
					throw new Error("must be function");
				}
				console.log(`http:\/\/127.0.0.1:12080/go?${this.wsURL.split("?")[1]}&action=${func_name}&param=qw1234`);
				this.handlers[func_name] = func;
				return true

			}

			//收到消息后这里处理，
			Hlclient.prototype.handlerRequest = function (requestJson) {
				var _this = this;
				try {
					var result=JSON.parse(requestJson)
				} catch (error) {
					console.log("catch error",requestJson);
					result = transjson(requestJson)
				}
				//console.log(result)
				if (!result['action']) {
					this.sendResult('','need request param {action}');
					return
				}
				var action=result["action"]
				var theHandler = this.handlers[action];
				if (!theHandler){
					this.sendResult(action,'action not found');
					return
				}
				try {
					if (!result["param"]){
						theHandler(function (response) {
							_this.sendResult(action, response);
						})
					}else{
						var param=result["param"]
						try {
							param=JSON.parse(param)
						}catch (e){
							console.log("")
						}
						theHandler(function (response) {
							_this.sendResult(action, response);
						},param)
					}

				} catch (e) {
					console.log("error: " + e);
					_this.sendResult(action+e);
				}
			}

			Hlclient.prototype.sendResult = function (action, e) {
				this.send(action + atob("aGxeX14") + e);
			}


			function transjson(formdata){
				var regex = /"action":(?<actionName>.*?),/g
				var actionName = regex.exec(formdata).groups.actionName
				stringfystring =  formdata.match(/{..data..:.*..\w+..:\s...*?..}/g).pop()
				stringfystring= stringfystring.replace(/\\"/g,'"')
				paramstring = JSON.parse(stringfystring)
				tens = `{"action":`+ actionName + `,"param":{}}`
				tjson = JSON.parse(tens)
				tjson.param = paramstring
				return tjson
			}
			
			window.Hlclient = Hlclient;
			window.jsRpc = function(obj="obj", group="g", name="n"){
				return `${obj} = new Hlclient("ws:\/\/127.0.0.1:12080/ws?group=${group}&name=${name}");`;
			}
		})();
    }
    if (e["config-hook-loader"]) {
		(function () {
			window.hook_loader = function (func_Str, obj_arr_Str, flag=false) {
				return `(function(w){var hook_fun=${func_Str};(w.__map__={},w.hook_code='',w.hook_flg=${flag});${func_Str}=function(r){if(hook_flg){if(typeof(__map__[r])=='undefined'){__map__[r]=true;let temp_str=(typeof r==='number'?(r):('"'+r+'"'))+': '+${obj_arr_Str}[r];if(hook_code==''){hook_code=temp_str;}else{hook_code+=','+temp_str;};};};return hook_fun(r);};${func_Str}.toString=hook_fun.toString.bind(hook_fun);})(window);`;
			};
		})();
    }
    if (e["config-hook-Local-object"]) {
		(function () {
			window.hook_obj = function(o){
				return `(function(){\n\t${o}=new Proxy(${o},{\n\t\tset(target,prop,value){\n\t\t\tconsole.log("设置:",target,"...",prop,"=",value);\n\t\t\tdebugger;\n\t\t\treturn Reflect.set(...arguments);\n\t\t},\n\t\tget(target,prop){\n\t\t\tconsole.log("获取:",target,"...",prop,"<=",target[prop]);\n\t\t\treturn Reflect.get(...arguments);\n\t\t}\n\t});\n})();`;
			};
		})();
    }
	
	
}
chrome.storage.sync.get(["config-hook-console", "config-hook-debugger", "config-hook-regExp", "config-hook-pushState", "config-hook-setcookie", "config-fuck-sojson", "config-hook-setInterval", "config-hook-stringify", "config-hook-header", "config-hook-url", "config-hook-canvas", "config-hook-localStorage", "config-JsRpc", "config-hook-loader", "config-hook-Local-object"], function (result) {
    script.text = `(${core.toString()})(${JSON.stringify(result)},window)`;
    script.onload = () => {
        script.parentNode.removeChild(script);
    };
    (document.head || document.documentElement).appendChild(script);
});