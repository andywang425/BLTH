// ==UserScript==
// @namespace     https://github.com/andywang425
// @name          B站直播自动抢辣条
// @name:en       B站直播自动抢辣条
// @author        andywang425
// @description   自动参与Bilibili直播区抽奖;完成每日任务
// @description:en 自动参与Bilibili直播区抽奖;完成每日任务
// @updateURL     https://raw.githubusercontent.com/andywang425/Bilibili-SGTH/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%BE%A3%E6%9D%A1.user.js
// @downloadURL    https://raw.githubusercontent.com/andywang425/Bilibili-SGTH/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%BE%A3%E6%9D%A1.user.js
// @homepageURL   https://github.com/andywang425/Bilibili-SGTH/
// @supportURL    https://github.com/andywang425/Bilibili-SGTH/issues
// @icon          https://s1.hdslb.com/bfs/live/d57afb7c5596359970eb430655c6aef501a268ab.png
// @copyright     2020, andywang425 (https://github.com/andywang425)
// @license       MIT
// @version       3.8
// @include      /https?:\/\/live\.bilibili\.com\/[blanc\/]?[^?]*?\d+\??.*/
// @run-at       document-end
// @connect      passport.bilibili.com
// @connect      api.live.bilibili.com
// @connect      live-trace.bilibili.com
// @require https://cdn.jsdelivr.net/gh/jquery/jquery@3.2.1/dist/jquery.min.js
// @require https://cdn.jsdelivr.net/gh/andywang425/Bilibili-SGTH@v1.4/BilibiliAPI_Mod.min.js
// @require https://cdn.jsdelivr.net/gh/andywang425/Bilibili-SGTH@v1.3.2/OCRAD.min.js
// @require https://cdn.jsdelivr.net/gh/andywang425/Bilibili-SGTH@v1.3.4/libBilibiliToken.user.js
// @require https://cdn.jsdelivr.net/gh/andywang425/Bilibili-SGTH@v2.0/enc.min.js
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// ==/UserScript==
(function(){let msgHide=false;let debugSwitch=true;let NAME='IGIFTMSG';let BAPI=BilibiliAPI;let gift_join_try=0;let guard_join_try=0;let pk_join_try=0;let SEND_GIFT_NOW=false;const tz_offset=new Date().getTimezoneOffset()+480;const ts_ms=()=>Date.now();const ts_s=()=>Math.round(ts_ms()/1000);let Live_info={room_id:undefined,uid:undefined,ruid:undefined,mobile_verify:undefined,gift_list:undefined,rnd:undefined,visit_id:undefined,identification:undefined,bili_jct:undefined};const runUntilSucceed=(callback,delay=0,period=100)=>{setTimeout(()=>{if(!callback())runUntilSucceed(callback,period,period);},delay);};const delayCall=(callback,delay=10e3)=>{const p=$.Deferred();setTimeout(()=>{const t=callback();if(t&&t.then)t.then((arg1,arg2,arg3,arg4,arg5,arg6)=>p.resolve(arg1,arg2,arg3,arg4,arg5,arg6));else p.resolve();},delay);return p;};const MYDEBUG=(sign,...data)=>{if(!debugSwitch)return;let d=new Date();d=`[${NAME}][${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}]`;if(data.length===1){console.log(d,`${sign}:`,data[0]);return}
console.log(d,`${sign}:`,data);};const runMidnight=(callback,msg)=>{const t=new Date();let name=msg||' ';t.setMinutes(t.getMinutes()+tz_offset);t.setDate(t.getDate()+1);t.setHours(0,1,0,0);t.setMinutes(t.getMinutes()-tz_offset);setTimeout(callback,t-ts_ms());MYDEBUG('runMidnight',name+" "+t.toString());};const runExactMidnight=(callback,msg)=>{const t=new Date();let name=msg||' ';t.setMinutes(t.getMinutes()+tz_offset);t.setDate(t.getDate()+1);t.setHours(0,0,0,0);t.setMinutes(t.getMinutes()-tz_offset);setTimeout(callback,t-ts_ms());MYDEBUG('runExactMidnight',name+" "+t.toString());};const runTomorrow=(callback,hour,minute,msg)=>{const t=new Date();let name=msg||' ';t.setMinutes(t.getMinutes()+tz_offset);t.setDate(t.getDate()+1);t.setHours(hour,minute,0,0);t.setMinutes(t.getMinutes()-tz_offset);setTimeout(callback,t-ts_ms());MYDEBUG('runTomorrow',name+" "+t.toString());}
const appToken=new BilibiliToken();const baseQuery=`actionKey=appkey&appkey=${BilibiliToken.appKey}&build=5561000&channel=bili&device=android&mobi_app=android&platform=android&statistics=%7B%22appId%22%3A1%2C%22platform%22%3A3%2C%22version%22%3A%225.57.0%22%2C%22abtest%22%3A%22%22%7D`;let userToken=undefined;let tokenData=JSON.parse(localStorage.getItem(`${NAME}_userToken`))||{};const setToken=async()=>{if(tokenData.time>ts_s()){userToken=userToken;}else{tokenData=await appToken.getToken();tokenData.time=ts_s()+tokenData.expires_in;localStorage.setItem(`${NAME}_Token`,JSON.stringify(tokenData));userToken=tokenData;};MYDEBUG(`${NAME}_userToken`,tokenData);return'OK';};const newWindow={init:()=>{return newWindow.Toast.init().then(()=>{});},Toast:{init:()=>{try{const list=[];window.toast=(msg,type='info',timeout=5e3)=>{switch(type){case'success':case'info':break;case'caution':break;case'error':break;default:type='info';}
const a=$(`<div class="link-toast ${type} fixed"><span class="toast-text">${msg}</span></div>`)[0];document.body.appendChild(a);a.style.top=(document.body.scrollTop+list.length*40+10)+'px';a.style.left=(document.body.offsetWidth+document.body.scrollLeft-a.offsetWidth-5)+'px';list.push(a);setTimeout(()=>{a.className+=' out';setTimeout(()=>{list.shift();list.forEach((v)=>{v.style.top=(parseInt(v.style.top,10)-40)+'px';});$(a).remove();},200);},timeout);};return $.Deferred().resolve();}catch(err){console.error(`初始化浮动提示时出现异常`,err);return $.Deferred().reject();}}}}
newWindow.init();$(()=>{let loadInfo=(delay)=>{setTimeout(()=>{const W=typeof unsafeWindow==='undefined'?window:unsafeWindow;if(W.BilibiliLive===undefined||parseInt(W.BilibiliLive.UID)===0||isNaN(parseInt(W.BilibiliLive.UID))){loadInfo(1000);window.toast(`[${GM_info.script.name}]无配置信息`,'warning');MYDEBUG('无配置信息');}else{Live_info.room_id=W.BilibiliLive.ROOMID;Live_info.uid=W.BilibiliLive.UID;BAPI.live_user.get_info_in_room(Live_info.room_id).then((response)=>{MYDEBUG('InitData: API.live_user.get_info_in_room',response);Live_info.mobile_verify=response.data.info.mobile_verify;Live_info.identification=response.data.info.identification;});BAPI.gift.gift_config().then((response)=>{MYDEBUG('InitData: API.gift.gift_config',response);if(!!response.data&&$.isArray(response.data)){Live_info.gift_list=response.data;}else if(!!response.data.list&&$.isArray(response.data.list)){Live_info.gift_list=response.data.list;}else{Live_info.gift_list=[{"id":6,"price":1000},{"id":1,"price":100},{'id':30607,'price':5000}];window.toast('直播间礼物数据获取失败，使用备用数据','error');}});Live_info.bili_jct=BAPI.getCookie('bili_jct');Live_info.ruid=W.BilibiliLive.ANCHOR_UID;Live_info.rnd=W.BilibiliLive.RND;Live_info.visit_id=W.__statisObserver?W.__statisObserver.__visitId:'';MYDEBUG("Live_info",Live_info);init();}},delay);};loadInfo(1000);addStyle();});Array.prototype.remove=function(val){let index=this.indexOf(val);if(index>-1){this.splice(index,1);}};function addStyle(){$('head').append(`
        <style>
            .igiftMsg_input{
                outline: none;
                border: 1px solid #e9eaec;
                background-color: #fff;
                border-radius: 4px;
                padding: 1px 0 0;
                overflow: hidden;
                font-size: 12px;
                line-height: 19px;
                width: 30px;
                'z-index': '10001';
            }
            .igiftMsg_btn{
                background-color: #23ade5;
                color: #fff;
                border-radius: 4px;
                border: none;
                padding: 5px;
                cursor: pointer;
                box-shadow: 0 0 2px #00000075;
                line-height: 10px;
                'z-index': '10001';
            }
            .igiftMsg_fs{
                border: 2px solid #d4d4d4;
                'z-index': '10001';
            }
        </style>
            `)}
function init(){const MY_API={CONFIG_DEFAULT:{AUTO_GIFT:false,AUTO_GIFT_ROOMID:"0",AUTO_GROUP_SIGN:true,AUTO_TREASUREBOX:true,CHECK_HOUR_ROOM_INTERVAL:120,COIN:false,COIN_NUMBER:0,COIN_TYPE:"COIN_DYN",COIN_UID:0,EXCLUDE_ROOMID:"0",FORCE_LOTTERY:false,GIFT_LIMIT:1,GIFT_SEND_HOUR:23,GIFT_SEND_MINUTE:59,GIFT_SORT:false,IN_TIME_RELOAD_DISABLE:false,LIVE_SIGN:true,LOGIN:true,LITTLE_HEART:false,LIGHT_MEDALS:"0",LIGHT_METHOD:"LIGHT_WHITE",MAX_GIFT:99999,MOBILE_HEARTBEAT:true,RANDOM_DELAY:true,RANDOM_SEND_DANMU:0,RANDOM_SKIP:0,REMOVE_ELEMENT_2233:false,REMOVE_ELEMENT_july:false,REMOVE_ELEMENT_player:false,RND_DELAY_END:5,RND_DELAY_START:2,SEND_ALL_GIFT:false,SHARE:true,SILVER2COIN:false,SPARE_GIFT_ROOM:"0",SPARE_GIFT_UID:"0",STORM:false,STORM_MAX_COUNT:100,STORM_ONE_LIMIT:200,STORM_QUEUE_SIZE:3,TIME_AREA_DISABLE:true,TIME_AREA_END_H0UR:8,TIME_AREA_END_MINUTE:0,TIME_AREA_START_H0UR:2,TIME_AREA_START_MINUTE:0,TIME_RELOAD:60,WATCH:true,},CACHE_DEFAULT:{UNIQUE_CHECK:0,AUTO_GROUP_SIGH_TS:0,DailyReward_TS:0,LiveReward_TS:0,TreasureBox_TS:0,Silver2Coin_TS:0,Gift_TS:0,MobileHeartBeat_TS:0,},CONFIG:{},CACHE:{},GIFT_COUNT:{COUNT:0,SILVER_COUNT:0,CLEAR_TS:0,},init:()=>{try{BAPI.setCommonArgs(Live_info.bili_jct);}catch(err){console.error(`[${NAME}]`,err);return;}
let p=$.Deferred();try{MY_API.loadConfig().then(()=>{MY_API.chatLog('脚本载入配置成功','success');p.resolve()});}catch(e){console.error('API初始化出错',e);MY_API.chatLog('API初始化出错','error');p.reject()}
try{MY_API.loadCache().then(()=>{window.toast('CACHE载入成功','success')
p.resolve()});}catch(e){console.error('CACHE初始化出错',e);window.toast('CACHE初始化出错','error')
p.reject()}
setTimeout(()=>{MY_API.TreasureBox.init();},5750);return p;},loadConfig:()=>{let p=$.Deferred();try{let config=JSON.parse(localStorage.getItem(`${NAME}_CONFIG`));$.extend(true,MY_API.CONFIG,MY_API.CONFIG_DEFAULT);for(let item in MY_API.CONFIG){if(!MY_API.CONFIG.hasOwnProperty(item))continue;if(config[item]!==undefined&&config[item]!==null)MY_API.CONFIG[item]=config[item];}
MY_API.loadGiftCount();p.resolve()}catch(e){MYDEBUG('API载入配置失败，加载默认配置',e);MY_API.setDefaults();p.reject()}
return p},loadCache:()=>{let p=$.Deferred();try{let cache=JSON.parse(localStorage.getItem(`${NAME}_CACHE`));$.extend(true,MY_API.CACHE,MY_API.CACHE_DEFAULT);for(let item in MY_API.CACHE){if(!MY_API.CACHE.hasOwnProperty(item))continue;if(cache[item]!==undefined&&cache[item]!==null)MY_API.CACHE[item]=cache[item];}
p.resolve()}catch(e){MYDEBUG('CACHE载入配置失败，加载默认配置',e);MY_API.setDefaults();p.reject()}
return p},newMeaasge:(version)=>{let newMsg=`${version}更新提示：\n
                等b站删除辣条后脚本会改名，\n
                （greasyfork用户可忽略以下部分）所以更新链接也会变化。\n
                改名后，我会发布B站直播自动抢辣条的最终版本。\n
                安装这个版本后脚本会提示你安装改名后的新脚本。\n
                本提示仅会出现一次。`;try{let cache=localStorage.getItem(`${NAME}_NEWMSG_CACHE`);if((cache==undefined||cache==null||cache!='3.8')&&version!='0'){alert(newMsg);localStorage.setItem(`${NAME}_NEWMSG_CACHE`,version);}}catch(e){MYDEBUG('提示信息CACHE载入配置失败',e);}},saveConfig:()=>{try{localStorage.setItem(`${NAME}_CONFIG`,JSON.stringify(MY_API.CONFIG));MY_API.chatLog('配置已保存');MYDEBUG('MY_API.CONFIG',MY_API.CONFIG);return true}catch(e){MYDEBUG('API保存出错',e);return false}},saveCache:(logswitch)=>{try{localStorage.setItem(`${NAME}_CACHE`,JSON.stringify(MY_API.CACHE));if(logswitch!=false){MYDEBUG('CACHE已保存',MY_API.CACHE)};return true}catch(e){MYDEBUG('CACHE保存出错',e);return false}},setDefaults:()=>{MY_API.CONFIG=MY_API.CONFIG_DEFAULT;MY_API.CACHE=MY_API.CACHE_DEFAULT;MY_API.saveConfig();MY_API.saveCache();MY_API.chatLog('配置和CACHE已重置为默认。3秒后刷新页面');setTimeout(()=>{window.location.reload()},3000);},ReDoDailyTasks:()=>{window.toast('3秒后再次执行每日任务','info')
setTimeout(()=>{MY_API.CACHE=MY_API.CACHE_DEFAULT;MY_API.GroupSign.run();MY_API.DailyReward.run();MY_API.LiveReward.run();MY_API.Exchange.runS2C();MY_API.TreasureBox.run();MY_API.Gift.run();MY_API.MobileHeartBeat.run();},3000);},loadGiftCount:()=>{try{let config=JSON.parse(localStorage.getItem(`${NAME}_GIFT_COUNT`));for(let item in MY_API.GIFT_COUNT){if(!MY_API.GIFT_COUNT.hasOwnProperty(item))continue;if(config[item]!==undefined&&config[item]!==null)MY_API.GIFT_COUNT[item]=config[item];}
MYDEBUG('MY_API.GIFT_COUNT',MY_API.GIFT_COUNT);}catch(e){MYDEBUG('读取统计失败',e);}},saveGiftCount:()=>{try{localStorage.setItem(`${NAME}_GIFT_COUNT`,JSON.stringify(MY_API.GIFT_COUNT));MYDEBUG('统计保存成功',MY_API.GIFT_COUNT);return true}catch(e){MYDEBUG('统计保存出错',e);return false}},addGift:(count)=>{MY_API.GIFT_COUNT.COUNT+=count;$('#giftCount span:eq(0)').text(MY_API.GIFT_COUNT.COUNT);MY_API.saveGiftCount();},addSilver:(count)=>{MY_API.GIFT_COUNT.SILVER_COUNT+=(count*10);$('#giftCount span:eq(1)').text(MY_API.GIFT_COUNT.SILVER_COUNT);MY_API.saveGiftCount();},removeUnnecessary:()=>{let unnecessaryList=['#my-dear-haruna-vm','.july-activity-entry','.bilibili-live-player'];const removeUntiSucceed=(settingName,list_id)=>{if(MY_API.CONFIG[settingName]===true){setInterval(()=>{if($(unnecessaryList[list_id]).length>0){$(unnecessaryList[list_id]).remove();}else{return}},200);}};removeUntiSucceed('REMOVE_ELEMENT_2233',0);removeUntiSucceed('REMOVE_ELEMENT_july',1);removeUntiSucceed('REMOVE_ELEMENT_player',2);},creatSetBox:()=>{let btn=$('<button style="display: inline-block; float: left; margin-right: 7px;background-color: #23ade5;color: #fff;border-radius: 4px;border: none; padding:4px; cursor: pointer;box-shadow: 1px 1px 2px #00000075;" id="hiderbtn">隐藏窗口和抽奖信息<br></button>');btn.click(()=>{if(msgHide==false){msgHide=true;$('.igiftMsg').hide();div.hide();let ct=$('.chat-history-list');ct.animate({scrollTop:0},0);setTimeout(()=>{ct.animate({scrollTop:ct.prop("scrollHeight")},10)},100);document.getElementById('hiderbtn').innerHTML="显示窗口和抽奖信息";}
else{msgHide=false;$('.igiftMsg').show();div.show();let ct=$('.chat-history-list');ct.animate({scrollTop:ct.prop("scrollHeight")},0);document.getElementById('hiderbtn').innerHTML="隐藏窗口和抽奖信息";}});$('.attention-btn-ctnr').append(btn);let div=$('<div>');let settingTableHeight=$(`.live-player-mounter`).height()
div.css({'width':'auto','height':settingTableHeight,'position':'absolute','top':'-2px','right':'0px','background':'#F0F0F0','padding':'10px','z-index':'10001','border-radius':'4px','overflow':'scroll','line-height':'15px'});div.append(`
                <div id='allsettings'>
                <fieldset class="igiftMsg_fs">
                    <legend style="color: black">今日统计</legend>
                    <div id="giftCount" style="font-size: large; text-shadow: 1px 1px #00000066; color: blueviolet;">
                        辣条&nbsp;<span>${MY_API.GIFT_COUNT.COUNT}</span>
                        银瓜子&nbsp;<span>${MY_API.GIFT_COUNT.SILVER_COUNT}万</span>
                        <button style="font-size: small" class="igiftMsg_btn" data-action="save">保存所有设置</button>
                    </div>
                </fieldset>
                <div id="left_fieldset" style="float:left;">
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">低调设置</legend>
                        <div data-toggle="RANDOM_DELAY">
                            <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
                                <input style="vertical-align: text-top;" type="checkbox">抽奖附加随机延迟
                                <input class="RND_DELAY_START igiftMsg_input" style="width: 30px;vertical-align: top;" type="text">~
                                <input class="RND_DELAY_END igiftMsg_input" style="width: 30px;vertical-align: top;" type="text">s
                            </label>
                        </div>
                        <div data-toggle="TIME_AREA_DISABLE">
                            <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
                                <input style="vertical-align: text-top;" type="checkbox">启用
                                <input class="startHour igiftMsg_input" style="width: 20px;" type="text">点
                                <input class="startMinute igiftMsg_input" style="width: 20px;" type="text">分至
                                <input class="endHour igiftMsg_input" style="width: 20px;" type="text">点
                                <input class="endMinute igiftMsg_input" style="width: 20px;" type="text">分不抽奖(24小时制)
                            </label>
                        </div>
                        <div data-toggle="RANDOM_SKIP">
                            <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
                                随机跳过礼物(0到100,为0则不跳过)<input class="per igiftMsg_input" style="width: 30px;" type="text">%
                            </label>
                        </div>
                        <div data-toggle="MAX_GIFT">
                            <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
                                当天最多抢辣条数量<input class="num igiftMsg_input" style="width: 100px;" type="text">
                            </label>
                        </div>
                        <div data-toggle="RANDOM_SEND_DANMU">
                            <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
                                抽奖时活跃弹幕发送概率(0到5,为0则不发送)<input class="per igiftMsg_input" style="width: 30px;" type="text">%
                            </label>
                        </div>
                        <div data-toggle="CHECK_HOUR_ROOM_INTERVAL">
                            <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
                                检查小时榜间隔时间<input class="num igiftMsg_input" style="width: 25px;" type="text">秒
                            </label>
                        </div>
            
                    </fieldset>
            
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">每日任务设置</legend>
                        <div data-toggle="LOGIN" style=" color: black">
                            <input style="vertical-align: text-top;" type="checkbox">
                            登陆
                        </div>
                        <div data-toggle="WATCH" style=" color: black">
                            <input style="vertical-align: text-top;" type="checkbox">
                            观看视频
                        </div>
                        <div data-toggle="COIN" style=" color: black">
                            <label style="cursor: pointer">
                                <input style="cursor: pointer; vertical-align: text-top;" type="checkbox">
                                自动投币<input class="coin_number igiftMsg_input" style="width: 40px;" type="text">个(0-5)
                            </label>
                        </div>
                        <div data-toggle="COIN_TYPE" style=" color: black">
                            <div data-toggle="COIN_UID">
                            <input style="vertical-align: text-top;" type="radio" name="COIN_TYPE">
                            给用户(UID:<input class="num igiftMsg_input" style="width: 80px;" type="text">)
                            的视频投币
                            </div>
                            <div data-toggle="COIN_DYN">
                                <input style="vertical-align: text-top;" type="radio" name="COIN_TYPE">
                                给动态中的的视频投币
                            </div>
                        </div>
                        <div data-toggle="SHARE" style=" color: black">
                            <input style="vertical-align: text-top;" type="checkbox">
                            分享视频
                        </div>
                        <div data-toggle="SILVER2COIN" style=" color: black">
                            <input style="vertical-align: text-top;" type="checkbox">
                            银瓜子换硬币
                        </div>
                        <div data-toggle="LIVE_SIGN" style=" color: black">
                            <input style="vertical-align: text-top;" type="checkbox">
                            直播区签到
                        </div>
                        <div data-toggle="AUTO_GROUP_SIGN" style=" color: darkgreen">
                            <input style="vertical-align: text-top;" type="checkbox">
                            应援团签到
                        </div>
                        <div data-toggle="MOBILE_HEARTBEAT" style=" color: purple">
                            <input style="vertical-align: text-top;" type="checkbox">
                            模拟移动端心跳 + 领双端观看直播奖励
                        </div>
                        <div data-toggle="AUTO_TREASUREBOX" style=" color: purple">
                            <input style="vertical-align: text-top;" type="checkbox">
                            自动领银瓜子宝箱
                        </div>
                    </fieldset>
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">自动送礼设置</legend>
                        <div data-toggle="AUTO_GIFT" style=" color: purple">
                            <input style="vertical-align: text-top;" type="checkbox">
                            自动送礼
                        </div>
            
                        <div data-toggle="AUTO_GIFT_ROOMID" style=" color: purple">
                            优先送礼房间
                            <input class="num igiftMsg_input" style="width: 150px;" type="text">
                        </div>
            
                        <div data-toggle="EXCLUDE_ROOMID" style=" color: purple">
                            不送礼房间
                            <input class="num igiftMsg_input" style="width: 150px;" type="text">
                        </div>
            
                        <div data-toggle="GIFT_SEND_TIME" style=" color: purple">
                            送礼时间
                            <input class="Hour igiftMsg_input" style="width: 20px;" type="text">点
                            <input class="Minute igiftMsg_input" style="width: 20px;" type="text">分
                            <button style="font-size: small" class="igiftMsg_btn" data-action="sendGiftNow">立刻开始送礼</button>
                        </div>
                        <div data-toggle="GIFT_LIMIT" style=" color: purple">
                            礼物到期时间
                            <input class="num igiftMsg_input" style="width: 20px;" type="text">
                            天
                        </div>
                        <div data-toggle="GIFT_SORT" style=" color: purple">
                            <input style="vertical-align: text-top;" type="checkbox">
                            送礼优先高等级粉丝牌
                        </div>
                        <div data-toggle="SEND_ALL_GIFT" style=" color: purple">
                            <input style="vertical-align: text-top;" type="checkbox">
                            送满全部勋章
                        </div>
                        <div data-toggle="SPARE_GIFT_ROOM" style=" color: black">
                            剩余礼物送礼直播间：
                            <input class="num igiftMsg_input" type="text" style="width: 100px;">
                        </div>
                        <div data-toggle="SPARE_GIFT_UID" style=" color: black">
                            剩余礼物送礼直播间拥有者UID：
                            <input class="num igiftMsg_input" type="text" style="width: 100px;">
                        </div>
                    </fieldset>
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">节奏风暴设置</legend>
                        <div data-toggle="STORM" style="line-height: 15px">
                            <label style="margin: 5px auto; color: #ff5200">
                                <input style="vertical-align: text-top;" type="checkbox">参与节奏风暴
                            </label>
                        </div>
                        <div data-toggle="STORM_QUEUE_SIZE" style="color: black">
                            允许同时参与的节奏风暴次数：
                            <input class="num igiftMsg_input" type="text" style="width: 30px;">
                        </div>
                        <div data-toggle="STORM_MAX_COUNT" style="color: black">
                            单个风暴最大尝试次数：
                            <input class="num igiftMsg_input" type="text" style="width: 30px;">
                        </div>
                        <div data-toggle="STORM_ONE_LIMIT" style="color: black">
                            单个风暴参与次数间隔：
                            <input class="num igiftMsg_input" type="text" style="width: 30px;">
                            毫秒
                        </div>
                    </fieldset>
                </div>
            
            
            
                <div id="right_fieldset" style="float:left;">
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">说明</legend>
                        自动送礼目前只会送出辣条和亿圆。<br>
                        礼物到期时间: 将要在这个时间段里过期的礼物会被送出<br>
                        勾选送满全部勋章时无论是否将要过期都会被送出<br>
                        如果要填写多个优先送礼房间，<br>
                        每个房间号之间需用半角逗号,隔开。(不送礼房间，自动点亮勋章房间号同理)<br>
                        如 666,777,888。为0则不送。<br>
                        如果没有这些房间的粉丝牌也不送。<br>
                        无论【优先高等级粉丝牌】如何设置，会根据【送满全部勋章】<br>
                        （勾选则补满，否则只送到期的）条件去按优先送礼房间先后顺序送礼。<br>
                        之后根据【优先高等级粉丝牌】决定先送高级还是低级（勾选先高级，不勾选先低级）。<br>
                        剩余礼物:指送完了所有粉丝牌，但仍有剩余的将在1天内过期的礼物。<br>
                        剩余礼物也会在指定送礼时间被送出。<br>
                        参与节奏风暴风险较大，如果没有实名可能无法参加。<br>
                        脚本仅能参加广播中的节奏风暴。<br>
                        【给用户(UID:___)的视频投币】若填0则给动态中的视频依次投币(因为无UID为0的用户)
            
                    </fieldset>
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">小心心</legend>
                        <div data-toggle="LITTLE_HEART" style="line-height: 15px">
                            <label style="margin: 5px auto; color: black">
                                <input style="vertical-align: text-top;" type="checkbox"> 自动获取小心心
                            </label>
                        </div>
                        <div data-toggle="LIGHT_MEDALS" style=" color: purple">
                            自动点亮勋章房间号
                        <input class="num igiftMsg_input" style="width: 300px;" type="text">
                    </div>
                    <div data-toggle="LIGHT_METHOD" style="line-height: 15px; color: black; display:inline">
                        勋章点亮模式：&nbsp;&nbsp;
                        <div data-toggle="LIGHT_WHITE" style="color: black; display:inline">
                            <input style="vertical-align: text-top;" type="radio" name="LIGHT_TYPE">
                            白名单
                        </div>
                        <div data-toggle="LIGHT_BLACK" style="color: black; display:inline">
                            &nbsp;
                            <input style="vertical-align: text-top;" type="radio" name="LIGHT_TYPE">
                            黑名单
                        </div>
                    </div>
                    </fieldset>
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">内容屏蔽</legend>
                        <div data-toggle="REMOVE_ELEMENT_2233" style="line-height: 15px">
                            <label style="margin: 5px auto; color: black">
                                <input style="vertical-align: text-top;" type="checkbox"> 移除2233模型
                            </label>
                        </div>
                        <div data-toggle="REMOVE_ELEMENT_july" style="line-height: 15px">
                            <label style="margin: 5px auto; color: black">
                                <input style="vertical-align: text-top;" type="checkbox"> 移除夏日活动入口
                            </label>
                        </div>
                        <div data-toggle="REMOVE_ELEMENT_player" style="line-height: 15px">
                        <label style="margin: 5px auto; color: black">
                            <input style="vertical-align: text-top;" type="checkbox"> 移除直播画面
                        </label>
                    </div>
                    </fieldset>
                    <fieldset class="igiftMsg_fs" style="line-height: 15px">
                        <legend style="color: black">其他设置</legend>
                        <div data-toggle="TIME_RELOAD" style="color: black">
                            本直播间刷新时间：
                            <input class="delay-seconds igiftMsg_input" type="text" style="width: 30px;">分
                        </div>
                        <div data-toggle="IN_TIME_RELOAD_DISABLE" style="line-height: 15px">
                            <label style="margin: 5px auto; color: darkgreen">
                                <input style="vertical-align: text-top;" type="checkbox">不抽奖时段不重载直播间
                            </label>
                        </div>
                        <div data-toggle="FORCE_LOTTERY" style="line-height: 20px">
                            <label style="margin: 5px auto; color: red;">
                                <input style="vertical-align: text-top;" type="checkbox">访问被拒绝后强制重复抽奖(最多5次)
                            </label>
                        </div>
                        <div id="resetArea">
                            <button data-action="reset" style="color: red;" class="igiftMsg_btn">重置所有为默认</button>
                            <button data-action="redo_dailyTasks" style="color: red;" class="igiftMsg_btn">再次执行每日任务</button>
                            <button style="font-size: small" class="igiftMsg_btn" data-action="countReset">重置统计</button>
                        </div>
            
                    </fieldset>
                    <label style="color: darkblue; font-size:large;">
                        v${GM_info.script.version} <a href="https://github.com/andywang425/Bilibili-SGTH/"
                            target="_blank">更多说明和更新日志见github上的项目说明(点我)</a>
                    </label>
                </div>
            </div>
    `);$('.live-player-mounter').append(div);div.find('div[data-toggle="LIGHT_MEDALS"] .num').val(MY_API.CONFIG.LIGHT_MEDALS.toString());div.find('div[data-toggle="STORM_MAX_COUNT"] .num').val(parseInt(MY_API.CONFIG.STORM_MAX_COUNT).toString());div.find('div[data-toggle="STORM_ONE_LIMIT"] .num').val(parseInt(MY_API.CONFIG.STORM_ONE_LIMIT).toString());div.find('div[data-toggle="STORM_QUEUE_SIZE"] .num').val(parseInt(MY_API.CONFIG.STORM_QUEUE_SIZE).toString());div.find('div[data-toggle="SPARE_GIFT_UID"] .num').val(MY_API.CONFIG.SPARE_GIFT_UID.toString());div.find('div[data-toggle="SPARE_GIFT_ROOM"] .num').val(MY_API.CONFIG.SPARE_GIFT_ROOM.toString());div.find('div[data-toggle="TIME_RELOAD"] .delay-seconds').val(parseInt(MY_API.CONFIG.TIME_RELOAD).toString());div.find('div[data-toggle="RANDOM_SKIP"] .per').val((parseFloat(MY_API.CONFIG.RANDOM_SKIP)).toString());div.find('div[data-toggle="RANDOM_SEND_DANMU"] .per').val((parseFloat(MY_API.CONFIG.RANDOM_SEND_DANMU)).toString());div.find('div[data-toggle="MAX_GIFT"] .num').val((parseInt(MY_API.CONFIG.MAX_GIFT)).toString());div.find('div[data-toggle="COIN"] .coin_number').val(parseInt(MY_API.CONFIG.COIN_NUMBER).toString());div.find('div[data-toggle="COIN_UID"] .num').val(parseInt(MY_API.CONFIG.COIN_UID).toString());div.find('div[data-toggle="RANDOM_DELAY"] .RND_DELAY_START').val(parseFloat(MY_API.CONFIG.RND_DELAY_START).toString());div.find('div[data-toggle="RANDOM_DELAY"] .RND_DELAY_END').val(parseFloat(MY_API.CONFIG.RND_DELAY_END).toString());div.find('div[data-toggle="TIME_AREA_DISABLE"] .startHour').val(parseInt(MY_API.CONFIG.TIME_AREA_START_H0UR).toString());div.find('div[data-toggle="TIME_AREA_DISABLE"] .endHour').val(parseInt(MY_API.CONFIG.TIME_AREA_END_H0UR).toString());div.find('div[data-toggle="TIME_AREA_DISABLE"] .startMinute').val(parseInt(MY_API.CONFIG.TIME_AREA_START_MINUTE).toString());div.find('div[data-toggle="TIME_AREA_DISABLE"] .endMinute').val(parseInt(MY_API.CONFIG.TIME_AREA_END_MINUTE).toString());div.find('div[data-toggle="CHECK_HOUR_ROOM_INTERVAL"] .num').val(parseInt(MY_API.CONFIG.CHECK_HOUR_ROOM_INTERVAL).toString());div.find('div[data-toggle="AUTO_GIFT_ROOMID"] .num').val((MY_API.CONFIG.AUTO_GIFT_ROOMID).toString());div.find('div[data-toggle="EXCLUDE_ROOMID"] .num').val((MY_API.CONFIG.EXCLUDE_ROOMID).toString());div.find('div[data-toggle="GIFT_SEND_TIME"] .Hour').val(MY_API.CONFIG.GIFT_SEND_HOUR.toString());div.find('div[data-toggle="GIFT_SEND_TIME"] .Minute').val(MY_API.CONFIG.GIFT_SEND_MINUTE.toString());div.find('div[data-toggle="GIFT_LIMIT"] .num').val(parseInt(MY_API.CONFIG.GIFT_LIMIT).toString());function saveAction(){let val=undefined;let valArray=undefined;let val1=MY_API.CONFIG.TIME_AREA_START_H0UR=parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .startHour').val());let val2=MY_API.CONFIG.TIME_AREA_END_H0UR=parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .endHour').val());let val3=MY_API.CONFIG.TIME_AREA_START_MINUTE=parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .startMinute').val());let val4=MY_API.CONFIG.TIME_AREA_END_MINUTE=parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .endMinute').val());if(val1<0||val2<0||val3<0||val4<0){MY_API.chatLog("[定时休眠]数据小于0",'warning');return}
else if(val1>=24||val2>=24||val3>=60||val4>=60){MY_API.chatLog("[定时休眠]时间错误",'warning');return}
MY_API.CONFIG.TIME_AREA_START_H0UR=val1;MY_API.CONFIG.TIME_AREA_END_H0UR=val2;MY_API.CONFIG.TIME_AREA_START_MINUTE=val3;MY_API.CONFIG.TIME_AREA_END_MINUTE=val4;val=parseFloat(div.find('div[data-toggle="RANDOM_SKIP"] .per').val());if(val<0||val>100){MY_API.chatLog('[随机跳过礼物]数据小于0或大于100','warning');return}
MY_API.CONFIG.RANDOM_SKIP=val;val=parseFloat(div.find('div[data-toggle="RANDOM_SEND_DANMU"] .per').val());if(val>5){MY_API.chatLog("[活跃弹幕]为维护直播间弹幕氛围,弹幕发送概率不得大于5%",'warning');return}
else if(val<0){MY_API.chatLog("[活跃弹幕]数据小于0",'warning');return}
MY_API.CONFIG.RANDOM_SEND_DANMU=val;val=parseInt(div.find('div[data-toggle="MAX_GIFT"] .num').val());MY_API.CONFIG.MAX_GIFT=val;val=parseInt(div.find('div[data-toggle="TIME_RELOAD"] .delay-seconds').val());if(val<=0||val>10000){MY_API.chatLog('[直播间重载时间]数据小于等于0或大于10000','warning');return}
MY_API.CONFIG.TIME_RELOAD=val;val=parseFloat(div.find('div[data-toggle="RANDOM_DELAY"] .RND_DELAY_START').val());val2=parseFloat(div.find('div[data-toggle="RANDOM_DELAY"] .RND_DELAY_END').val());if(val<0||val2>100){MY_API.chatLog('[抽奖延时]数据小于0或大于100','warning');return}
else if(val2<=val){MY_API.chatLog('[抽奖延时]数据大小关系不正确','warning');return}
MY_API.CONFIG.RND_DELAY_START=val;MY_API.CONFIG.RND_DELAY_END=val2;val=parseInt(div.find('div[data-toggle="COIN"] .coin_number').val());if(val<0||val>5){MY_API.chatLog("[自动投币]数据小于0或大于5",'warning');return}
MY_API.CONFIG.COIN_NUMBER=val;val=parseInt(div.find('div[data-toggle="CHECK_HOUR_ROOM_INTERVAL"] .num').val());if(val<=0){MY_API.chatLog("[检查小时榜间隔]数据小于等于0",'warning');return}
MY_API.CONFIG.CHECK_HOUR_ROOM_INTERVAL=val;val=div.find('div[data-toggle="AUTO_GIFT_ROOMID"] .num').val();valArray=val.split(",");for(let i=0;i<valArray.length;i++){if(valArray[i]===''){valArray[i]=0;}};val=valArray.join(",");MY_API.CONFIG.AUTO_GIFT_ROOMID=val;val=div.find('div[data-toggle="EXCLUDE_ROOMID"] .num').val();valArray=val.split(",");for(let i=0;i<valArray.length;i++){if(valArray[i]===''){valArray[i]=0;}};val=valArray.join(",");MY_API.CONFIG.EXCLUDE_ROOMID=val;val=parseInt(div.find('div[data-toggle="GIFT_LIMIT"] .num').val());MY_API.CONFIG.GIFT_LIMIT=val;val1=parseInt(div.find('div[data-toggle="GIFT_SEND_TIME"] .Hour').val());val2=parseInt(div.find('div[data-toggle="GIFT_SEND_TIME"] .Minute').val());if(val1<0||val2<0){MY_API.chatLog("[送礼时间]数据小于0",'warning');return}
else if(val1>=24||val2>=60){MY_API.chatLog("[送礼时间]时间错误",'warning');return}
MY_API.CONFIG.GIFT_SEND_HOUR=val1;MY_API.CONFIG.GIFT_SEND_MINUTE=val2;val=div.find('div[data-toggle="SPARE_GIFT_ROOM"] .num').val();MY_API.CONFIG.SPARE_GIFT_ROOM=val;val=div.find('div[data-toggle="SPARE_GIFT_UID"] .num').val();MY_API.CONFIG.SPARE_GIFT_UID=val;val=parseInt(div.find('div[data-toggle="STORM_QUEUE_SIZE"] .num').val());MY_API.CONFIG.STORM_QUEUE_SIZE=val;val=parseInt(div.find('div[data-toggle="STORM_MAX_COUNT"] .num').val());MY_API.CONFIG.STORM_MAX_COUNT=val;val=parseInt(div.find('div[data-toggle="STORM_ONE_LIMIT"] .num').val());MY_API.CONFIG.STORM_ONE_LIMIT=val;val=parseInt(div.find('div[data-toggle="COIN_UID"] .num').val());MY_API.CONFIG.COIN_UID=val;val=div.find('div[data-toggle="LIGHT_MEDALS"] .num').val();MY_API.CONFIG.LIGHT_MEDALS=val;MY_API.saveConfig();};div.find('div[id="giftCount"] [data-action="save"]').click(()=>{saveAction();});div.find('button[data-action="reset"]').click(()=>{MY_API.setDefaults();});div.find('button[data-action="checkUpdate"]').click(()=>{MY_API.checkUpdate();});div.find('button[data-action="redo_dailyTasks"]').click(()=>{MY_API.ReDoDailyTasks();});div.find('#resetArea [data-action="countReset"]').click(()=>{MY_API.GIFT_COUNT={COUNT:0,SILVER_COUNT:0,CLEAR_TS:0,};MY_API.saveGiftCount();$('#giftCount span:eq(0)').text(MY_API.GIFT_COUNT.COUNT);$('#giftCount span:eq(1)').text(MY_API.GIFT_COUNT.SILVER_COUNT);MY_API.chatLog('已重置统计数据');});div.find('button[data-action="sendGiftNow"]').click(()=>{SEND_GIFT_NOW=true;MY_API.Gift.run();});let checkList=['RANDOM_DELAY','TIME_AREA_DISABLE','AUTO_GROUP_SIGN','FORCE_LOTTERY','LOGIN','WATCH','COIN','SHARE','SILVER2COIN','LIVE_SIGN','IN_TIME_RELOAD_DISABLE','AUTO_TREASUREBOX','IN_TIME_RELOAD_DISABLE',"AUTO_GIFT","GIFT_SORT","SEND_ALL_GIFT",'MOBILE_HEARTBEAT','STORM','LITTLE_HEART','REMOVE_ELEMENT_2233','REMOVE_ELEMENT_july','REMOVE_ELEMENT_player'];for(let i of checkList){let input=div.find(`div[data-toggle="${i}"] input:checkbox`);if(MY_API.CONFIG[i])input.attr('checked','');input.change(function(){MY_API.CONFIG[i]=$(this).prop('checked');MY_API.saveConfig()});};$('input:text').bind('keydown',function(event){if(event.keyCode=="13"){saveAction();}});if(MY_API.CONFIG.COIN_TYPE=='COIN_DYN'){$("div[data-toggle='COIN_DYN'] input:radio").attr('checked','');}else{$("div[data-toggle='COIN_UID'] input:radio").attr('checked','');};if(MY_API.CONFIG.LIGHT_METHOD=='LIGHT_WHITE'){$("div[data-toggle='LIGHT_WHITE'] input:radio").attr('checked','');}else{$("div[data-toggle='LIGHT_BLACK'] input:radio").attr('checked','');};$("input:radio[name='COIN_TYPE']").change(function(){let a=$("div[data-toggle='COIN_DYN'] input:radio").is(':checked');if(a==true){MY_API.CONFIG.COIN_TYPE='COIN_DYN';}
else{MY_API.CONFIG.COIN_TYPE='COIN_UID';}
MY_API.saveConfig();});$("input:radio[name='LIGHT_TYPE']").change(function(){let a=$("div[data-toggle='LIGHT_WHITE'] input:radio").is(':checked');if(a==true){MY_API.CONFIG.LIGHT_METHOD='LIGHT_WHITE';}
else{MY_API.CONFIG.LIGHT_METHOD='LIGHT_BLACK';}
MY_API.saveConfig();});},chatLog:function(text,type='info'){let div=$("<div class='igiftMsg'>");let msg=$("<div>");let ct=$('#chat-history-list');let myDate=new Date();msg.text(text);div.text(myDate.toLocaleString());div.append(msg);div.css({'text-align':'center','border-radius':'4px','min-height':'30px','width':'256px','color':'#9585FF','line-height':'30px','padding':'0 10px','margin':'10px auto',});msg.css({'word-wrap':'break-word','width':'100%','line-height':'1em','margin-bottom':'10px',});switch(type){case'warning':div.css({'border':'1px solid rgb(236, 221, 192)','color':'rgb(218, 142, 36)','background':'rgb(245, 235, 221) none repeat scroll 0% 0%',});break;case'success':div.css({'border':'1px solid rgba(22, 140, 0, 0.28)','color':'rgb(69, 171, 69)','background':'none 0% 0% repeat scroll rgba(16, 255, 0, 0.18)',});break;case'error':div.css({'border':'1px solid rgb(255, 46, 0)','color':'white','background':'none 0% 0% repeat scroll #ff4c4c',});break;default:div.css({'border':'1px solid rgb(203, 195, 255)','background':'rgb(233, 230, 255) none repeat scroll 0% 0%',});}
if(msgHide==false){ct.find('#chat-items').append(div);}else{ct.find('#chat-items').append(div.hide());}
ct.scrollTop(ct.prop("scrollHeight"));},blocked:false,max_blocked:false,listen:(roomId,uid,area='本直播间')=>{BAPI.room.getConf(roomId).then((response)=>{MYDEBUG(`获取弹幕服务器信息 ${area}`,response);let wst=new BAPI.DanmuWebSocket(uid,roomId,response.data.host_server_list,response.data.token);wst.bind((newWst)=>{wst=newWst;MY_API.chatLog(`${area}弹幕服务器连接断开，尝试重连`,'warning');},()=>{MY_API.chatLog(`——————连接弹幕服务器成功——————\n房间号: ${roomId} 分区: ${area}`,'success');},()=>{if(MY_API.blocked||MY_API.stormBlack){wst.close();MY_API.chatLog(`进了小黑屋主动与弹幕服务器断开连接-${area}`,'warning')}
if(MY_API.max_blocked&&!MY_API.CONFIG.STORM){wst.close();MY_API.chatLog(`辣条最大值主动与弹幕服务器断开连接-${area}`,'warning')}},(obj)=>{if(inTimeArea(MY_API.CONFIG.TIME_AREA_START_H0UR,MY_API.CONFIG.TIME_AREA_END_H0UR,MY_API.CONFIG.TIME_AREA_START_MINUTE,MY_API.CONFIG.TIME_AREA_END_MINUTE)&&MY_API.CONFIG.TIME_AREA_DISABLE)return;MYDEBUG('弹幕公告'+area,obj);switch(obj.cmd){case'GUARD_MSG':if(obj.roomid===obj.real_roomid){MY_API.checkRoom(obj.roomid,area);}else{MY_API.checkRoom(obj.roomid,area);MY_API.checkRoom(obj.real_roomid,area);}
break;case'PK_BATTLE_SETTLE_USER':if(!!obj.data.winner){MY_API.checkRoom(obj.data.winner.room_id,area);}else{MY_API.checkRoom(obj.data.my_info.room_id,area);}
MY_API.checkRoom(obj.data.winner.room_id,area);break;case'NOTICE_MSG':switch(obj.msg_type){case 1:break;case 2:case 3:case 4:case 8:if(obj.roomid===obj.real_roomid){MY_API.checkRoom(obj.roomid,area);}else{MY_API.checkRoom(obj.roomid,area);MY_API.checkRoom(obj.real_roomid,area);}
break;case 5:break;case 6:window.toast(`监控到房间 ${obj.roomid} 的节奏风暴`,'info');MY_API.Storm.run(obj.roomid);break;}
break;case'SPECIAL_GIFT':if(obj.data['39']){switch(obj.data['39'].action){case'start':window.toast(`监控到房间 ${obj.roomid} 的节奏风暴`,'info');MY_API.Storm.run(obj.roomid);case'end':}};break;default:return;}});},()=>{MY_API.chatLog('获取弹幕服务器地址错误','error')});},EntryRoom_list_history:{add:function(EntryRoom){let EntryRoom_list=[];try{let config=JSON.parse(localStorage.getItem(`${NAME}_EntryRoom_list`));EntryRoom_list=[].concat(config.list);EntryRoom_list.push(EntryRoom);if(EntryRoom_list.length>100){EntryRoom_list.splice(0,50);}
localStorage.setItem(`${NAME}_EntryRoom_list`,JSON.stringify({list:EntryRoom_list}));MYDEBUG(`${NAME}_EntryRoom_list_add`,EntryRoom_list);}catch(e){EntryRoom_list.push(EntryRoom);localStorage.setItem(`${NAME}_EntryRoom_list`,JSON.stringify({list:EntryRoom_list}));}},isIn:function(EntryRoom){let EntryRoom_list=[];try{let config=JSON.parse(localStorage.getItem(`${NAME}_EntryRoom_list`));if(config===null){EntryRoom_list=[];}else{EntryRoom_list=[].concat(config.list);}
MYDEBUG(`${NAME}_EntryRoom_list_read`,config);return EntryRoom_list.indexOf(EntryRoom)>-1}catch(e){localStorage.setItem(`${NAME}_EntryRoom_list`,JSON.stringify({list:EntryRoom_list}));MYDEBUG('读取'+`${NAME}_EntryRoom_list`+'缓存错误已重置');return EntryRoom_list.indexOf(EntryRoom)>-1}}},RoomId_list:[],err_roomId:[],auto_danmu_list:["(=・ω・=)","（￣▽￣）","nice","666","kksk","(⌒▽⌒)","(｀・ω・´)","╮(￣▽￣)╭","(￣3￣)","Σ( ￣□￣||)","(^・ω・^ )","_(:3」∠)_"],checkRoom:function(roomId,area='本直播间'){if(MY_API.blocked||MY_API.max_blocked){return}
if(MY_API.RoomId_list.indexOf(roomId)>=0){return}else{MY_API.RoomId_list.push(roomId);}
if(!MY_API.EntryRoom_list_history.isIn(roomId)){BAPI.room.room_entry_action(roomId);MY_API.EntryRoom_list_history.add(roomId);}
if(probability(MY_API.CONFIG.RANDOM_SEND_DANMU)){BAPI.sendLiveDanmu(MY_API.auto_danmu_list[Math.floor(Math.random()*12)],roomId).then((response)=>{MYDEBUG('弹幕发送返回信息',response);})}
BAPI.xlive.lottery.check(roomId).then((re)=>{MY_API.RoomId_list.remove(roomId);MYDEBUG('检查房间返回信息',re);let data=re.data;if(re.code===0){let list;if(data.gift){list=data.gift;for(let i in list){if(!list.hasOwnProperty(i))continue;MY_API.creat_join(roomId,list[i],'gift',area)}}
if(data.guard){list=data.guard;for(let i in list){if(!list.hasOwnProperty(i))continue;MY_API.creat_join(roomId,list[i],'guard',area)}}
if(data.pk){list=data.pk;for(let i in list){if(!list.hasOwnProperty(i))continue;MY_API.creat_join(roomId,list[i],'pk',area)}}}else{MY_API.chatLog(`[检查房间出错]${response.msg}`,'error');if(MY_API.err_roomId.indexOf(roomId)>-1){MYDEBUG(`[检查此房间出错多次]${roomId}${re.message}`);}
else{MY_API.err_roomId.push(roomId);MY_API.checkRoom(roomId,area);MYDEBUG(`[检查房间出错_重试一次]${roomId}${re.message}`);}}})},Id_list_history:{add:function(id,type){let id_list=[];try{let config=JSON.parse(localStorage.getItem(`${NAME}_${type}Id_list`));id_list=[].concat(config.list);id_list.push(id);if(id_list.length>200){id_list.splice(0,50);}
localStorage.setItem(`${NAME}_${type}Id_list`,JSON.stringify({list:id_list}));MYDEBUG(`${NAME}_${type}Id_list_add`,id_list);}catch(e){id_list.push(id);localStorage.setItem(`${NAME}_${type}Id_list`,JSON.stringify({list:id_list}));}},isIn:function(id,type){let id_list=[];try{let config=JSON.parse(localStorage.getItem(`${NAME}_${type}Id_list`));if(config===null){id_list=[];}else{id_list=[].concat(config.list);}
MYDEBUG(`${NAME}_${type}Id_list_read`,config);return id_list.indexOf(id)>-1}catch(e){localStorage.setItem(`${NAME}_${type}Id_list`,JSON.stringify({list:id_list}));MYDEBUG('读取'+`${NAME}_${type}Id_list`+'缓存错误已重置');return id_list.indexOf(id)>-1}}},raffleId_list:[],guardId_list:[],pkId_list:[],creat_join:function(roomId,data,type,area='本直播间'){MYDEBUG('礼物信息',data);if(MY_API.GIFT_COUNT.COUNT>=MY_API.CONFIG.MAX_GIFT){MYDEBUG('超过今日辣条限制，不参与抽奖');MY_API.max_blocked=true;return}
switch(type){case'gift':if(MY_API.Id_list_history.isIn(data.raffleId,'raffle')){MYDEBUG('礼物重复',`raffleId ${data.raffleId}`);return}else{MY_API.raffleId_list.push(data.raffleId);MY_API.Id_list_history.add(data.raffleId,'raffle');}
break;case'guard':if(MY_API.Id_list_history.isIn(data.id,'guard')){MYDEBUG('舰长重复',`id ${data.id}`);return}else{MY_API.guardId_list.push(data.id);MY_API.Id_list_history.add(data.id,'guard');}
break;case'pk':if(MY_API.Id_list_history.isIn(data.id,'pk')){MYDEBUG('pk重复',`id ${data.id}`);return}else{MY_API.pkId_list.push(data.id);MY_API.Id_list_history.add(data.id,'pk');}
break;}
let delay=data.time_wait||0;if(MY_API.CONFIG.RANDOM_DELAY)
delay+=Math.floor(Math.random()*(MY_API.CONFIG.RND_DELAY_END-MY_API.CONFIG.RND_DELAY_START+1))+MY_API.CONFIG.RND_DELAY_START;let div=$("<div class='igiftMsg'>");let msg=$("<div>");let aa=$("<div>");let ct=$('#chat-history-list');let myDate=new Date();msg.text(`[${area}]`+data.thank_text.split('<%')[1].split('%>')[0]+data.thank_text.split('%>')[1]);div.text(myDate.toLocaleString());div.append(msg);aa.css('color','red');aa.text('等待抽奖');msg.append(aa);div.css({'text-align':'center','border-radius':'4px','min-height':'30px','width':'256px','color':'#9585FF','line-height':'30px','padding':'0 10px','margin':'10px auto',});msg.css({'word-wrap':'break-word','width':'100%','line-height':'1em','margin-bottom':'10px',});div.css({'border':'1px solid rgb(203, 195, 255)','background':'rgb(233, 230, 255) none repeat scroll 0% 0%',});if(msgHide==false){ct.find('#chat-items').append(div);}else{ct.find('#chat-items').append(div.hide());}
ct.scrollTop(ct.prop("scrollHeight"));let timer=setInterval(()=>{aa.text(`等待抽奖倒计时${delay}秒`);if(delay<=0){if(probability(MY_API.CONFIG.RANDOM_SKIP)){aa.text(`跳过此礼物抽奖`);}else{aa.text(`进行抽奖...`);switch(type){case'gift':MY_API.gift_join(roomId,data.raffleId,data.type).then(function(msg,num){aa.text(msg);if(num){if(msg.indexOf('辣条')>-1){MY_API.addGift(num);}
else if(msg.indexOf('银瓜子')>-1){MY_API.addSilver(num);}}
MY_API.raffleId_list.remove(data.raffleId);});break;case'guard':MY_API.guard_join(roomId,data.id).then(function(msg,num){aa.text(msg);if(num){if(msg.indexOf('辣条')>-1){MY_API.addGift(num);}
else if(msg.indexOf('银瓜子')>-1){MY_API.addSilver(num);}}
MY_API.guardId_list.remove(data.id);});break;case'pk':MY_API.pk_join(roomId,data.id).then(function(msg,num){aa.text(msg);if(num){if(msg.indexOf('辣条')>-1){MY_API.addGift(num);}
else if(msg.indexOf('银瓜子')>-1){MY_API.addSilver(num);}}
MY_API.pkId_list.remove(data.id);});break;}}
aa.css('color','green');clearInterval(timer)}
delay--;},1000);},gift_join:function(roomid,raffleId,type){let p=$.Deferred();BAPI.Lottery.Gift.join(roomid,raffleId,type).then((response)=>{MYDEBUG('抽奖返回信息',response);switch(response.code){case 0:if(response.data.award_text){p.resolve(response.data.award_text,response.data.award_num);}else{p.resolve(response.data.award_name+'X'+response.data.award_num.toString(),response.data.award_num);}
break;default:if(response.msg.indexOf('拒绝')>-1){if(MY_API.CONFIG.FORCE_LOTTERY==false){MY_API.blocked=true;p.resolve('访问被拒绝，您的帐号可能已经被关小黑屋，已停止');}else if(++gift_join_try<=5){MY_API.gift_join(roomid,raffleId,type);}else{gift_join_try=0;p.resolve(`[礼物抽奖](roomid=${roomid},id=${raffleId},type=${type})${response.msg}`);}}else{p.resolve(`[礼物抽奖](roomid=${roomid},id=${raffleId},type=${type})${response.msg}`);}}});return p},guard_join:function(roomid,Id){let p=$.Deferred();BAPI.Lottery.Guard.join(roomid,Id).then((response)=>{MYDEBUG('上船抽奖返回信息',response);switch(response.code){case 0:if(response.data.award_text){p.resolve(response.data.award_text,response.data.award_num);}else{p.resolve(response.data.award_name+'X'+response.data.award_num.toString(),response.data.award_num);}
break;default:if(response.msg.indexOf('拒绝')>-1){if(MY_API.CONFIG.FORCE_LOTTERY==false){MY_API.blocked=true;p.resolve('访问被拒绝，您的帐号可能已经被关小黑屋，已停止');}else if(++guard_join_try<=5){MY_API.guard_join(roomid,id);}else{guard_join_try=0;p.resolve(`[礼物抽奖](roomid=${roomid},id=${raffleId},type=${type})${response.msg}`);}}else{p.resolve(`[上船](roomid=${roomid},id=${Id})${response.msg}`);}
break;}});return p},pk_join:function(roomid,Id){let p=$.Deferred();BAPI.Lottery.Pk.join(roomid,Id).then((response)=>{MYDEBUG('PK抽奖返回信息',response);switch(response.code){case 0:if(response.data.award_text){p.resolve(response.data.award_text,response.data.award_num);}else{p.resolve(response.data.award_name+'X'+response.data.award_num.toString(),response.data.award_num);}
break;default:if(response.msg.indexOf('拒绝')>-1){if(MY_API.CONFIG.FORCE_LOTTERY==false){MY_API.blocked=true;p.resolve('访问被拒绝，您的帐号可能已经被关小黑屋，已停止');}else if(++pk_join_try<=5){MY_API.pk_join(roomid,id);}else{pk_join_try=0;p.resolve(`[礼物抽奖](roomid=${roomid},id=${raffleId},type=${type})${response.msg}`);}}else{p.resolve(`[PK](roomid=${roomid},id=${Id})${response.msg}`);}
break;}});return p},GroupSign:{getGroups:()=>{return BAPI.Group.my_groups().then((response)=>{MYDEBUG('GroupSign.getGroups: API.Group.my_groups',response);if(response.code===0)return $.Deferred().resolve(response.data.list);window.toast(`[自动应援团签到]'${response.msg}`,'caution');return $.Deferred().reject();},()=>{window.toast('[自动应援团签到]获取应援团列表失败，请检查网络','error');return delayCall(()=>MY_API.GroupSign.getGroups());});},signInList:(list,i=0)=>{if(i>=list.length)return $.Deferred().resolve();const obj=list[i];if(obj.owner_uid==Live_info.uid)return GroupSign.signInList(list,i+1);return BAPI.Group.sign_in(obj.group_id,obj.owner_uid).then((response)=>{MYDEBUG('GroupSign.signInList: API.Group.sign_in',response);let p=$.Deferred();if(response.code===0){if(response.data.add_num>0){window.toast(`[自动应援团签到]应援团(group_id=${obj.group_id},owner_uid=${obj.owner_uid})签到成功，当前勋章亲密度+${response.data.add_num}`,'success');p.resolve();}
else if(response.data.add_num==0){window.toast(`[自动应援团签到]应援团(group_id=${obj.group_id},owner_uid=${obj.owner_uid})已签到`,'caution');p.resolve();}
else{p.reject();}}else{window.toast(`[自动应援团签到]'${response.msg}`,'caution');return MY_API.GroupSign.signInList(list,i);}
return $.when(MY_API.GroupSign.signInList(list,i+1),p);},()=>{window.toast(`[自动应援团签到]应援团(group_id=${obj.group_id},owner_uid=${obj.owner_uid})签到失败，请检查网络`,'error');return delayCall(()=>MY_API.GroupSign.signInList(list,i));});},run:()=>{try{if(!MY_API.CONFIG.AUTO_GROUP_SIGN)return $.Deferred().resolve();if(!checkNewDay(MY_API.CACHE.AUTO_GROUP_SIGH_TS)){runTomorrow(MY_API.GroupSign.run,8,0,'应援团签到');return $.Deferred().resolve();}else if(new Date().getHours()<8&&MY_API.CACHE.AUTO_GROUP_SIGH_TS!=0){setTimeout(MY_API.GroupSign.run,getIntervalTime(8,0));return $.Deferred().resolve();}
return MY_API.GroupSign.getGroups().then((list)=>{return MY_API.GroupSign.signInList(list).then(()=>{MY_API.CACHE.AUTO_GROUP_SIGH_TS=ts_ms();MY_API.saveCache();runTomorrow(MY_API.GroupSign.run,8,0,'应援团签到');return $.Deferred().resolve();},()=>delayCall(()=>MY_API.GroupSign.run()));},()=>delayCall(()=>MY_API.GroupSign.run()));}catch(err){window.toast('[自动应援团签到]运行时出现异常，已停止','error');console.error(`[${NAME}]`,err);return $.Deferred().reject();}}},DailyReward:{coin_exp:0,login:()=>{return BAPI.DailyReward.login().then(()=>{MYDEBUG('DailyReward.login: API.DailyReward.login');window.toast('[自动每日奖励][每日登录]完成','success');},()=>{window.toast('[自动每日奖励][每日登录]完成失败，请检查网络','error');return delayCall(()=>MY_API.DailyReward.login());});},watch:(aid,cid)=>{if(!MY_API.CONFIG.WATCH)return $.Deferred().resolve();return BAPI.DailyReward.watch(aid,cid,Live_info.uid,ts_s()).then((response)=>{MYDEBUG('DailyReward.watch: API.DailyReward.watch',response);if(response.code===0){window.toast(`[自动每日奖励][每日观看]完成(av=${aid})`,'success');}else{window.toast(`[自动每日奖励][每日观看]'${response.msg}`,'caution');}},()=>{window.toast('[自动每日奖励][每日观看]完成失败，请检查网络','error');return delayCall(()=>MY_API.DailyReward.watch(aid,cid));});},coin:(cards,n,i=0,one=false)=>{if(!MY_API.CONFIG.COIN)return $.Deferred().resolve();if(MY_API.DailyReward.coin_exp>=MY_API.CONFIG.COIN_NUMBER*10){window.toast('[自动每日奖励][每日投币]今日投币已完成','info');return $.Deferred().resolve();}
if(i>=cards.length){window.toast('[自动每日奖励][每日投币]动态里可投币的视频不足','caution');return $.Deferred().resolve();}
const obj=JSON.parse(cards[i].card);let num=Math.min(2,n);if(one)num=1;BAPI.x.getCoinInfo('','jsonp',obj.aid,ts_ms()).then((re)=>{if(re.data.multiply===2){MYDEBUG('API.x.getCoinInfo',`已投币两个 aid = ${obj.aid}`)
return MY_API.DailyReward.coin(vlist,n,i+1);}
else{return BAPI.DailyReward.coin(obj.aid,num).then((response)=>{MYDEBUG('DailyReward.coin: API.DailyReward.coin',response);if(response.code===0){MY_API.DailyReward.coin_exp+=num*10;window.toast(`[自动每日奖励][每日投币]投币成功(av=${obj.aid},num=${num})`,'success');return MY_API.DailyReward.coin(cards,n-num,i+1);}else if(response.code===-110){window.toast('[自动每日奖励][每日投币]未绑定手机，已停止','error');return $.Deferred().reject();}else if(response.code===34003){if(one)return MY_API.DailyReward.coin(cards,n,i+1);return MY_API.DailyReward.coin(cards,n,i,true);}else if(response.code===34005){return MY_API.DailyReward.coin(cards,n,i+1);}else if(response.code===-104){window.toast('[自动每日奖励][每日投币]剩余硬币不足，已停止','warning');return $.Deferred().reject();}
window.toast(`[自动每日奖励][每日投币]'${response.msg}`,'caution');return MY_API.DailyReward.coin(cards,n,i+1);},()=>delayCall(()=>MY_API.DailyReward.coin(cards,n,i)));}})},coin_uid:(vlist,n,pagenum,uid,i=0,one=false)=>{if(!MY_API.CONFIG.COIN)return $.Deferred().resolve();if(MY_API.DailyReward.coin_exp>=MY_API.CONFIG.COIN_NUMBER*10){window.toast('[自动每日奖励][每日投币]今日投币已完成','info');return $.Deferred().resolve();}
if(i>=vlist.length){MY_API.DailyReward.UserSpace(MY_API.CONFIG.COIN_UID,30,0,pagenum++,'','pubdate','jsonp');}
const obj=vlist[i];if(obj.is_union_video===1||obj.mid!=uid){MYDEBUG('DailyReward.coin_uid',`联合投稿且UP不是指定UID用户 aid = ${obj.aid}`)
return MY_API.DailyReward.coin_uid(vlist,n,pagenum,uid,i+1);}
let num=Math.min(2,n);if(one)num=1;BAPI.x.getCoinInfo('','jsonp',obj.aid,ts_ms()).then((re)=>{if(re.data.multiply===2){MYDEBUG('API.x.getCoinInfo',`已投币两个 aid = ${obj.aid}`)
return MY_API.DailyReward.coin_uid(vlist,n,pagenum,uid,i+1);}
else{return BAPI.DailyReward.coin(obj.aid,num).then((response)=>{MYDEBUG('DailyReward.coin_uid: API.DailyReward.coin_uid',response);if(response.code===0){MY_API.DailyReward.coin_exp+=num*10;window.toast(`[自动每日奖励][每日投币]投币成功(av=${obj.aid},num=${num})`,'success');return MY_API.DailyReward.coin_uid(vlist,n-num,pagenum,uid,i+1);}else if(response.code===-110){window.toast('[自动每日奖励][每日投币]未绑定手机，已停止','error');return $.Deferred().reject();}else if(response.code===34003){if(one)return MY_API.DailyReward.coin_uid(vlist,n,pagenum,uid,i+1);return MY_API.DailyReward.coin_uid(vlist,n,i,pagenum,uid,true);}else if(response.code===34005){return MY_API.DailyReward.coin_uid(vlist,n,pagenum,uid,i+1);}else if(response.code===-104){window.toast('[自动每日奖励][每日投币]剩余硬币不足，已停止','warning');return $.Deferred().reject();}
window.toast(`[自动每日奖励][每日投币]'${response.msg}`,'caution');return MY_API.DailyReward.coin_uid(vlist,n,pagenum,uid,i+1);},()=>delayCall(()=>MY_API.DailyReward.coin_uid(vlist,n,pagenum,uid,i)));}});},share:(aid)=>{if(!MY_API.CONFIG.SHARE)return $.Deferred().resolve();return BAPI.DailyReward.share(aid).then((response)=>{MYDEBUG('DailyReward.share: API.DailyReward.share',response);if(response.code===0){window.toast(`[自动每日奖励][每日分享]分享成功(av=${aid})`,'success');}else if(response.code===71000){window.toast('[自动每日奖励][每日分享]今日分享已完成','info');}else{window.toast(`[自动每日奖励][每日分享]'${response.msg}`,'caution');}},()=>{window.toast('[自动每日奖励][每日分享]分享失败，请检查网络','error');return delayCall(()=>MY_API.DailyReward.share(aid));});},dynamic:async()=>{let throwCoinNum=undefined;let coinNum=MY_API.CONFIG.COIN_NUMBER-MY_API.DailyReward.coin_exp/10;throwCoinNum=await BAPI.getuserinfo().then((re)=>{MYDEBUG('DailyReward.dynamic: API.getuserinfo',re);if(re.data.biliCoin<coinNum)return re.data.biliCoin
else return coinNum});if(throwCoinNum===0){return $.Deferred().resolve();}else if(throwCoinNum<coinNum){window.toast(`[自动每日奖励][每日投币]剩余硬币不足，仅能投${throwCoinNum}个币`,'warning');};return BAPI.dynamic_svr.dynamic_new(Live_info.uid,8).then((response)=>{MYDEBUG('DailyReward.dynamic: API.dynamic_svr.dynamic_new',response);if(response.code===0){if(!!response.data.cards){const obj=JSON.parse(response.data.cards[0].card);const p1=MY_API.DailyReward.watch(obj.aid,obj.cid);let p2=undefined;if(MY_API.CONFIG.COIN_UID==0||MY_API.CONFIG.COIN_TYPE=='COIN_DYN'){p2=MY_API.DailyReward.coin(response.data.cards,Math.max(throwCoinNum,0));}else{p2=MY_API.DailyReward.UserSpace(MY_API.CONFIG.COIN_UID,30,0,1,'','pubdate','jsonp');}
const p3=MY_API.DailyReward.share(obj.aid);return $.when(p1,p2,p3);}else{window.toast('[自动每日奖励]"动态-投稿视频"中暂无动态','info');}}else{window.toast(`[自动每日奖励]获取"动态-投稿视频"'${response.msg}`,'caution');}},()=>{window.toast('[自动每日奖励]获取"动态-投稿视频"失败，请检查网络','error');return delayCall(()=>MY_API.DailyReward.dynamic());});},UserSpace:(uid,ps,tid,pn,keyword,order,jsonp)=>{return BAPI.x.getUserSpace(uid,ps,tid,pn,keyword,order,jsonp).then((response)=>{MYDEBUG('DailyReward.UserSpace: API.dynamic_svr.UserSpace',response);if(response.code===0){if(!!response.data.list.vlist){let throwCoinNum=MY_API.CONFIG.COIN_NUMBER-MY_API.DailyReward.coin_exp/10;const p1=MY_API.DailyReward.coin_uid(response.data.list.vlist,Math.max(throwCoinNum,0),pn,uid);return p1;}else{window.toast('[自动每日奖励]"空间-投稿视频"中暂无视频','info');}}
else{window.toast(`[自动每日奖励]获取"空间-投稿视频"'${response.msg}`,'caution');}},()=>{window.toast('[自动每日奖励]获取"空间-投稿视频"失败，请检查网络','error');return delayCall(()=>MY_API.DailyReward.UserSpace(uid,ps,tid,pn,keyword,order,jsonp));})},run:()=>{try{if(!checkNewDay(MY_API.CACHE.DailyReward_TS)){runMidnight(MY_API.DailyReward.run,'每日任务');return $.Deferred().resolve();}
return BAPI.DailyReward.exp().then((response)=>{MYDEBUG('DailyReward.run: API.DailyReward.exp',response);if(response.code===0){MY_API.DailyReward.coin_exp=response.number;MY_API.DailyReward.login();return MY_API.DailyReward.dynamic().then(()=>{MY_API.CACHE.DailyReward_TS=ts_ms();MY_API.saveCache();runMidnight(MY_API.DailyReward.run,'每日任务');});}else{window.toast(`[自动每日奖励]${response.message}`,'caution');}},()=>{window.toast('[自动每日奖励]获取每日奖励信息失败，请检查网络','error');return delayCall(()=>MY_API.DailyReward.run());});}catch(err){window.toast('[自动每日奖励]运行时出现异常','error');console.error(`[${NAME}]`,err);return $.Deferred().reject();}}},LiveReward:{dailySignIn:()=>{return BAPI.xlive.dosign().then((response)=>{MYDEBUG('LiveReward.dailySignIn: API.xlive.dosign',response);if(response.code===0){window.toast('[自动直播签到]完成','success')}else if(response.code===1011040){window.toast('[自动直播签到]今日直播签到已完成','info')}else{window.toast(`[自动直播签到]${response.message}`,'caution')}},()=>{window.toast('[自动直播签到]直播签到失败，请检查网络','error');return delayCall(()=>MY_API.LiveReward.dailySignIn());});},run:()=>{try{if(!MY_API.CONFIG.LIVE_SIGN)return $.Deferred().resolve();if(!checkNewDay(MY_API.CACHE.LiveReward_TS)){runMidnight(MY_API.LiveReward.run,'直播签到');return $.Deferred().resolve();}
MY_API.LiveReward.dailySignIn()
MY_API.CACHE.LiveReward_TS=ts_ms();MY_API.saveCache();runMidnight(MY_API.LiveReward.run,'直播签到');}catch(err){window.toast('[自动直播签到]运行时出现异常','error');console.error(`[${NAME}]`,err);return $.Deferred().reject();}}},Exchange:{silver2coin:()=>{return BAPI.Exchange.silver2coin().then((response)=>{MYDEBUG('Exchange.silver2coin: API.SilverCoinExchange.silver2coin',response);if(response.code===0){window.toast(`[银瓜子换硬币]${response.msg}`,'success');}else if(response.code===403){window.toast(`[银瓜子换硬币]${response.msg}`,'info');}else{window.toast(`[银瓜子换硬币]${response.msg}`,'caution');}},()=>{window.toast('[银瓜子换硬币]兑换失败，请检查网络','error');return delayCall(()=>MY_API.Exchange.silver2coin());});},runS2C:()=>{try{if(!MY_API.CONFIG.SILVER2COIN)return $.Deferred().resolve();if(!checkNewDay(MY_API.CACHE.Silver2Coin_TS)){runMidnight(MY_API.Exchange.runS2C,'瓜子换硬币');return $.Deferred().resolve();}
return MY_API.Exchange.silver2coin().then(()=>{MY_API.CACHE.Silver2Coin_TS=ts_ms();MY_API.saveCache();runMidnight(MY_API.Exchange.runS2C,'瓜子换硬币');},()=>delayCall(()=>MY_API.Exchange.runS2C()));}catch(err){window.toast('[银瓜子换硬币]运行时出现异常，已停止','error');console.error(`[${NAME}]`,err);return $.Deferred().reject();}}},TreasureBox:{timer:undefined,time_end:undefined,time_start:undefined,promise:{calc:undefined,timer:undefined},DOM:{image:undefined,canvas:undefined,div_tip:undefined,div_timer:undefined},init:()=>{if(!MY_API.CONFIG.AUTO_TREASUREBOX)return $.Deferred().resolve();const p=$.Deferred();runUntilSucceed(()=>{try{if($('.draw-box.gift-left-part').length){window.toast('[自动领取瓜子]当前直播间有实物抽奖，暂停领瓜子功能','caution');p.resolve();return true;}
let treasure_box=$('#gift-control-vm div.treasure-box.p-relative');if(!treasure_box.length)return false;treasure_box=treasure_box.first();treasure_box.attr('id','old_treasure_box');treasure_box.hide();const div=$(`<div id="${NAME}_treasure_div" class="treasure-box p-relative" style="min-width: 46px;display: inline-block;float: left;padding: 22px 0 0 15px;"></div>`);MY_API.TreasureBox.DOM.div_tip=$(`<div id="${NAME}_treasure_div_tip" class="t-center b-box none-select">自动<br>领取中</div>`);MY_API.TreasureBox.DOM.div_timer=$(`<div id="${NAME}_treasure_div_timer" class="t-center b-box none-select">0</div>`);MY_API.TreasureBox.DOM.image=$(`<img id="${NAME}_treasure_image" style="display:none">`);MY_API.TreasureBox.DOM.canvas=$(`<canvas id="${NAME}_treasure_canvas" style="display:none" height="40" width="120"></canvas>`);const css_text='min-width: 40px;padding: 2px 3px;margin-top: 3px;font-size: 12px;color: #fff;background-color: rgba(0,0,255,.5);border-radius: 10px;';MY_API.TreasureBox.DOM.div_tip[0].style=css_text;MY_API.TreasureBox.DOM.div_timer[0].style=css_text;div.append(MY_API.TreasureBox.DOM.div_tip);div.append(MY_API.TreasureBox.DOM.image);div.append(MY_API.TreasureBox.DOM.canvas);MY_API.TreasureBox.DOM.div_tip.after(MY_API.TreasureBox.DOM.div_timer);treasure_box.after(div);try{if(OCRAD);}catch(err){MY_API.TreasureBox.setMsg('初始化<br>失败');window.toast('[自动领取瓜子]OCRAD初始化失败，请检查网络','error');console.error(`[${NAME}]`,err);p.resolve();return true;}
MY_API.TreasureBox.timer=setInterval(()=>{let t=parseInt(MY_API.TreasureBox.DOM.div_timer.text(),10);if(isNaN(t))t=0;if(t>0)MY_API.TreasureBox.DOM.div_timer.text(`${t - 1}s`);else MY_API.TreasureBox.DOM.div_timer.hide();},1e3);MY_API.TreasureBox.DOM.image[0].onload=()=>{const ctx=MY_API.TreasureBox.DOM.canvas[0].getContext('2d');ctx.font='40px agencyfbbold';ctx.textBaseline='top';ctx.clearRect(0,0,MY_API.TreasureBox.DOM.canvas[0].width,MY_API.TreasureBox.DOM.canvas[0].height);ctx.drawImage(MY_API.TreasureBox.DOM.image[0],0,0);const grayscaleMap=MY_API.TreasureBox.captcha.OCR.getGrayscaleMap(ctx);const filterMap=MY_API.TreasureBox.captcha.OCR.orderFilter2In3x3(grayscaleMap);ctx.clearRect(0,0,120,40);for(let i=0;i<filterMap.length;++i){const gray=filterMap[i];ctx.fillStyle=`rgb(${gray}, ${gray}, ${gray})`;ctx.fillRect(i%120,Math.round(i/120),1,1);}
try{const question=MY_API.TreasureBox.captcha.correctQuestion(OCRAD(ctx.getImageData(0,0,120,40)));MYDEBUG('TreasureBox.DOM.image.load','question =',question);const answer=MY_API.TreasureBox.captcha.eval(question);MYDEBUG('TreasureBox.DOM.image.load','answer =',answer);if(answer!==undefined){console.info(`[${NAME}][自动领取瓜子]验证码识别结果: ${question} = ${answer}`);MY_API.TreasureBox.promise.calc.resolve(answer);}}catch(err){MY_API.TreasureBox.promise.calc.reject();}};p.resolve();return true;}catch(err){window.toast('[自动领取瓜子]初始化时出现异常，已停止','error');console.error(`[${NAME}]`,err);p.reject();return true;}});return p;},run:()=>{try{if(!MY_API.CONFIG.AUTO_TREASUREBOX||!MY_API.TreasureBox.timer)return;if(Live_info.blocked){MY_API.TreasureBox.setMsg('小黑屋');window.toast('[自动领取瓜子]帐号被关小黑屋，停止领取瓜子','caution');return;}
if(!checkNewDay(MY_API.CACHE.TreasureBox_TS)){MY_API.TreasureBox.setMsg('今日<br>已领完');runMidnight(MY_API.TreasureBox.run,'领银瓜子宝箱');return;}
MY_API.TreasureBox.getCurrentTask().then((response)=>{MYDEBUG('TreasureBox.run: TreasureBox.getCurrentTask().then',response);if(response.code===0){MY_API.TreasureBox.promise.timer=$.Deferred();MY_API.TreasureBox.promise.timer.then(()=>{MY_API.TreasureBox.captcha.calc().then((captcha)=>{MY_API.TreasureBox.getAward(captcha).then(()=>MY_API.TreasureBox.run(),()=>MY_API.TreasureBox.run());},()=>TreasureBox.run());});MY_API.TreasureBox.time_end=response.data.time_end;MY_API.TreasureBox.time_start=response.data.time_start;let t=MY_API.TreasureBox.time_end-ts_s()+1;if(t<0)t=0;setTimeout(()=>{if(MY_API.TreasureBox.promise.timer)MY_API.TreasureBox.promise.timer.resolve();},t*1e3);MY_API.TreasureBox.DOM.div_timer.text(`${t}s`);MY_API.TreasureBox.DOM.div_timer.show();MY_API.TreasureBox.DOM.div_tip.html(`轮数<br>${response.data.times}/${response.data.max_times}<br>银瓜子<br>${response.data.silver}`);}else if(response.code===-10017){MY_API.TreasureBox.setMsg('今日<br>已领完');MY_API.CACHE.TreasureBox_TS=ts_ms();MY_API.saveCache();runMidnight(MY_API.TreasureBox.run,'领银瓜子宝箱');}else if(response.code===-500){location.reload();}else{window.toast(`[自动领取瓜子]${response.msg}`,'caution');return MY_API.TreasureBox.run();}});}catch(err){MY_API.TreasureBox.setMsg('运行<br>异常');window.toast('[自动领取瓜子]运行时出现异常，已停止','error');console.error(`[${NAME}]`,err);}},setMsg:(htmltext)=>{if(!MY_API.CONFIG.AUTO_TREASUREBOX)return;if(MY_API.TreasureBox.promise.timer){MY_API.TreasureBox.promise.timer.reject();MY_API.TreasureBox.promise.timer=undefined;}
if(MY_API.TreasureBox.DOM.div_timer)MY_API.TreasureBox.DOM.div_timer.hide();if(MY_API.TreasureBox.DOM.div_tip)MY_API.TreasureBox.DOM.div_tip.html(htmltext);},getAward:(captcha,cnt=0)=>{if(!MY_API.CONFIG.AUTO_TREASUREBOX)return $.Deferred().reject();if(cnt>3)return $.Deferred().resolve();return BAPI.TreasureBox.getAward(MY_API.TreasureBox.time_start,MY_API.TreasureBox.time_end,captcha).then((response)=>{MYDEBUG('TreasureBox.getAward: getAward',response);switch(response.code){case 0:window.toast(`[自动领取瓜子]领取了 ${response.data.awardSilver} 银瓜子`,'success');case-903:return $.Deferred().resolve();case-902:case-901:case-10017:return MY_API.TreasureBox.captcha.calc().then((captcha)=>{return MY_API.TreasureBox.getAward(captcha,cnt);});case-800:MY_API.TreasureBox.setMsg('未绑定<br>手机');window.toast('[自动领取瓜子]未绑定手机，已停止','caution');return $.Deferred().reject();case-500:const p=$.Deferred();setTimeout(()=>{MY_API.TreasureBox.captcha.calc().then((captcha)=>{MY_API.TreasureBox.getAward(captcha,cnt+1).then(()=>p.resolve(),()=>p.reject());},()=>p.reject());},3e3);return p;case 400:if(response.msg.indexOf('拒绝')>-1){Live_info.blocked=true;MY_API.TreasureBox.setMsg('拒绝<br>访问');window.toast('[自动领取瓜子]访问被拒绝，您的帐号可能已经被关小黑屋，已停止','error');return $.Deferred().reject();}
window.toast(`[自动领取瓜子]${response.msg}`,'caution');return $.Deferred().resolve();default:window.toast(`[自动领取瓜子]${response.msg}`,'caution');}},()=>{window.toast('[自动领取瓜子]获取任务失败，请检查网络','error');return delayCall(()=>MY_API.TreasureBox.getAward(captcha,cnt));});},getCurrentTask:()=>{if(!MY_API.CONFIG.AUTO_TREASUREBOX)return $.Deferred().reject();return BAPI.TreasureBox.getCurrentTask().then((response)=>{MYDEBUG('TreasureBox.getCurrentTask: API.TreasureBox.getCurrentTask',response);return $.Deferred().resolve(response);},()=>{window.toast('[自动领取瓜子]获取当前任务失败，请检查网络','error');return delayCall(()=>MY_API.TreasureBox.getCurrentTask());});},captcha:{cnt:0,calc:()=>{if(!MY_API.CONFIG.AUTO_TREASUREBOX){MY_API.TreasureBox.captcha.cnt=0;return $.Deferred().reject();}
if(MY_API.TreasureBox.captcha.cnt>20){MY_API.TreasureBox.setMsg('验证码<br>识别<br>失败');window.toast('[自动领取瓜子]验证码识别失败，已停止','error');return $.Deferred().reject();}
return BAPI.TreasureBox.getCaptcha(ts_ms()).then((response)=>{MYDEBUG('TreasureBox.captcha.calc: getCaptcha',response);if(response.code===0){MY_API.TreasureBox.captcha.cnt++;const p=$.Deferred();MY_API.TreasureBox.promise.calc=$.Deferred();MY_API.TreasureBox.promise.calc.then((captcha)=>{MY_API.TreasureBox.captcha.cnt=0;p.resolve(captcha);},()=>{MY_API.TreasureBox.captcha.calc().then((captcha)=>{p.resolve(captcha);},()=>{p.reject();});});MY_API.TreasureBox.DOM.image.attr('src',response.data.img);return p;}else{window.toast(`[自动领取瓜子]${response.msg}`,'caution');return delayCall(()=>MY_API.TreasureBox.captcha.calc());}},()=>{window.toast('[自动领取瓜子]加载验证码失败，请检查网络','error');return delayCall(()=>MY_API.TreasureBox.captcha.calc());});},OCR:{getGrayscaleMap:(context,rate=235,width=120,height=40)=>{const pixelMap=context.getImageData(0,0,width,height).data;const map=[];for(let y=0;y<height;y++){for(let x=0;x<width;x++){const index=(y*width+x)*4;const pixel=pixelMap.slice(index,index+4);const gray=pixel?(77*pixel[0]+150*pixel[1]+29*pixel[2]+128)>>8:0;map.push(gray>rate?gray:0);}}
return map;},orderFilter2In3x3:(grayscaleMap,n=9,width=120)=>{const gray=(x,y)=>(x+y*width>=0)?grayscaleMap[x+y*width]:255;const map=[];const length=grayscaleMap.length;const catchNumber=n-1;for(let i=0;i<length;++i){const[x,y]=[i%width,Math.floor(i/width)];const matrix=new Array(9);matrix[0]=gray(x-1,y-1);matrix[1]=gray(x+0,y-1);matrix[2]=gray(x+1,y-1);matrix[3]=gray(x-1,y+0);matrix[4]=gray(x+0,y+0);matrix[5]=gray(x+1,y+0);matrix[6]=gray(x-1,y+1);matrix[7]=gray(x+0,y+1);matrix[8]=gray(x+1,y+1);matrix.sort((a,b)=>a-b);map.push(matrix[catchNumber]);}
return map;},},eval:(fn)=>{let Fn=Function;return new Fn(`return ${fn}`)();},correctStr:{'i':1,'I':1,'|':1,'l':1,'o':0,'O':0,'D':0,'S':6,'s':6,'b':6,'R':8,'B':8,'z':2,'Z':2,'.':'-','_':4,'g':9,'>':3},correctQuestion:(question)=>{let q='';question=question.trim();for(let i in question){let a=MY_API.TreasureBox.captcha.correctStr[question[i]];q+=(a!==undefined?a:question[i]);}
if(q[2]==='4')q[2]='+';for(let c=0;c<=parseInt(q.length-2);c++){if(q[c]==='\''&&q[c+1]==='1'){q[c]='7';q.splice(c+1,1)}}
return q;}}},Gift:{run_timer:undefined,ruid:undefined,room_id:undefined,medal_list:undefined,bag_list:undefined,time:undefined,remain_feed:undefined,sendGiftList:[1,6,30607],getMedalList:(page=1)=>{if(page===1)MY_API.Gift.medal_list=[];return BAPI.i.medal(page,25).then((response)=>{MYDEBUG('Gift.getMedalList: API.i.medal',response);MY_API.Gift.medal_list=MY_API.Gift.medal_list.concat(response.data.fansMedalList);if(response.data.pageinfo.curPage<response.data.pageinfo.totalpages)return MY_API.Gift.getMedalList(page+1);},()=>{window.toast('[自动送礼]获取勋章列表失败，请检查网络','error');return delayCall(()=>MY_API.Gift.getMedalList(page));});},getBagList:()=>{return BAPI.gift.bag_list().then((response)=>{MYDEBUG('Gift.getBagList: API.gift.bag_list',response);MY_API.Gift.bag_list=response.data.list;MY_API.Gift.time=response.data.time;},()=>{window.toast('[自动送礼]获取包裹列表失败，请检查网络','error');return delayCall(()=>MY_API.Gift.getBagList());});},getFeedByGiftID:(gift_id)=>{for(let i=Live_info.gift_list.length-1;i>=0;--i){if(Live_info.gift_list[i].id===gift_id){return Math.ceil(Live_info.gift_list[i].price/100);}}
return 0;},sort_medals:(medals)=>{if(MY_API.CONFIG.GIFT_SORT){medals.sort((a,b)=>{if(b.level-a.level==0){return b.intimacy-a.intimacy;}
return b.level-a.level;});}else{medals.sort((a,b)=>{if(a.level-b.level==0){return a.intimacy-b.intimacy;}
return a.level-b.level;});}
if(MY_API.CONFIG.AUTO_GIFT_ROOMID&&MY_API.CONFIG.AUTO_GIFT_ROOMID.length>0){let sortRooms=MY_API.CONFIG.AUTO_GIFT_ROOMID.split(",");sortRooms.reverse();for(let froom of sortRooms){let rindex=medals.findIndex(r=>r.roomid==froom);if(rindex!=-1){let tmp=medals[rindex];medals.splice(rindex,1);medals.unshift(tmp);}}}
return medals;},auto_light:async(medal_list)=>{try{const feed=MY_API.Gift.getFeedByGiftID(30607);let light_roomid=MY_API.CONFIG.LIGHT_MEDALS.split(",");let unLightedMedals=undefined;if(MY_API.CONFIG.LIGHT_METHOD=='LIGHT_WHITE'){unLightedMedals=medal_list.filter(m=>m.is_lighted==0&&m.day_limit-m.today_feed>=feed&&light_roomid.findIndex(it=>it==m.roomid)>=0)}else{unLightedMedals=medal_list.filter(m=>m.is_lighted==0&&m.day_limit-m.today_feed>=feed&&light_roomid.findIndex(it=>it==m.roomid)==-1)};if(unLightedMedals&&unLightedMedals.length>0){unLightedMedals=MY_API.Gift.sort_medals(unLightedMedals);await MY_API.Gift.getBagList();let heartBags=MY_API.Gift.bag_list.filter(r=>r.gift_id==30607);if(heartBags&&heartBags.length>0){for(let medal of unLightedMedals){let gift=heartBags.find(g=>g.gift_id==30607&&g.gift_num>0);if(gift){let remain_feed=medal.day_limit-medal.today_feed;if(remain_feed-feed>=0){let response=await BAPI.room.room_init(parseInt(medal.roomid,10));let send_room_id=parseInt(response.data.room_id,10);let feed_num=1;let rsp=await BAPI.gift.bag_send(Live_info.uid,30607,medal.target_id,feed_num,gift.bag_id,send_room_id,Live_info.rnd)
if(rsp.code===0){gift.gift_num-=feed_num;medal.today_feed+=feed_num*feed;remain_feed-=feed_num*feed;window.toast(`[自动送礼]勋章[${medal.medalName}]点亮成功，送出${feed_num}个${gift.gift_name}，[${medal.today_feed}/${medal.day_limit}]距离升级还需[${remain_feed}]`,'success');MYDEBUG('Gift.auto_light',`勋章[${medal.medalName}]点亮成功，送出${feed_num}个${gift.gift_name}，[${medal.today_feed}/${medal.day_limit}]`)}else{window.toast(`[自动送礼]勋章[${medal.medalName}]点亮失败【${response.msg}】`,'caution');}}
continue;}
break;}}}}catch(e){console.error(e);window.toast(`[自动送礼]点亮勋章出错:${e}`,'error');}},run:async()=>{const FailFunc=()=>{window.toast('[自动送礼]送礼失败，请检查网络','error');return delayCall(()=>MY_API.Gift.run());};const nextTimeDebug=()=>{let alternateTime=getIntervalTime(MY_API.CONFIG.GIFT_SEND_HOUR,MY_API.CONFIG.GIFT_SEND_MINUTE);setTimeout(MY_API.Gift.run,alternateTime);let runTime=new Date(ts_ms()+alternateTime).toLocaleString();MYDEBUG("[自动送礼]",`将在${runTime}进行自动送礼`);}
try{if(!MY_API.CONFIG.AUTO_GIFT)return $.Deferred().resolve();if(!isTime(MY_API.CONFIG.GIFT_SEND_HOUR,MY_API.CONFIG.GIFT_SEND_MINUTE)&&SEND_GIFT_NOW==false){let alternateTime=getIntervalTime(MY_API.CONFIG.GIFT_SEND_HOUR,MY_API.CONFIG.GIFT_SEND_MINUTE);setTimeout(MY_API.Gift.run,alternateTime);let runTime=new Date(ts_ms()+alternateTime).toLocaleString();MYDEBUG("[自动送礼]",`将在${runTime}进行自动送礼`);return $.Deferred().resolve();};await MY_API.Gift.getMedalList();let medal_list=MY_API.Gift.medal_list;MYDEBUG('Gift.run: Gift.getMedalList().then: Gift.medal_list',medal_list);if(medal_list&&medal_list.length>0){medal_list=medal_list.filter(it=>it.day_limit-it.today_feed>0&&it.level<20);medal_list=MY_API.Gift.sort_medals(medal_list);if(MY_API.CONFIG.EXCLUDE_ROOMID&&MY_API.CONFIG.EXCLUDE_ROOMID.length>0){ArrayEXCLUDE_ROOMID=MY_API.CONFIG.EXCLUDE_ROOMID.split(",");medal_list=medal_list.filter(Er=>ArrayEXCLUDE_ROOMID.findIndex(exp=>exp==Er.roomid)==-1);};if(MY_API.CONFIG.LIGHT_MEDALS!="0")await MY_API.Gift.auto_light(medal_list);let limit=MY_API.CONFIG.GIFT_LIMIT*86400;for(let v of medal_list){let response=await BAPI.room.room_init(parseInt(v.roomid,10));MY_API.Gift.room_id=parseInt(response.data.room_id,10);MY_API.Gift.ruid=v.target_id;MY_API.Gift.remain_feed=v.day_limit-v.today_feed;if(MY_API.Gift.remain_feed>0){await MY_API.Gift.getBagList();let now=ts_s();if(!MY_API.CONFIG.SEND_ALL_GIFT){let pass=MY_API.Gift.bag_list.filter(r=>MY_API.Gift.sendGiftList.includes(r.gift_id)&&r.gift_num>0&&r.expire_at>now&&(r.expire_at-now<limit));if(pass.length==0){break;}};MY_API.CACHE.Gift_TS=ts_ms();MY_API.saveCache();if(MY_API.Gift.remain_feed>0){window.toast(`[自动送礼]勋章[${v.medalName}] 今日亲密度未满[${v.today_feed}/${v.day_limit}]，预计需要[${MY_API.Gift.remain_feed}]送礼开始`,'info');await MY_API.Gift.sendGift(v);if(!MY_API.CONFIG.SEND_ALL_GIFT){let pass=MY_API.Gift.bag_list.filter(r=>MY_API.Gift.sendGiftList.includes(r.gift_id)&&r.gift_num>0&&r.expire_at>now&&(r.expire_at-now<limit));if(pass.length==0){break;}}}else{window.toast(`[自动送礼]勋章[${v.medalName}] 今日亲密度已满`,'info');}}}}
await MY_API.Gift.getBagList();let i=0;for(i=0;i<=MY_API.Gift.bag_list.length-1;i++){if(MY_API.Gift.bag_list[i].gift_id==1){break;}}
let v=MY_API.Gift.bag_list[i];if(v==undefined){SEND_GIFT_NOW=false;nextTimeDebug();return $.Deferred().resolve();}
let feed=MY_API.Gift.getFeedByGiftID(v.gift_id);let limit=86400;let now=ts_s();if(MY_API.Gift.bag_list.filter(r=>MY_API.Gift.sendGiftList.includes(r.gift_id)&&r.gift_num>0&&r.expire_at>now&&(r.expire_at-now<limit)).length!=0&&v.expire_at>MY_API.Gift.time&&(v.expire_at-MY_API.Gift.time<limit&&MY_API.CONFIG.SPARE_GIFT_ROOM!='0'&&MY_API.CONFIG.SPARE_GIFT_UID!='0'&&feed>0)){let giftnum=v.gift_num;return BAPI.gift.bag_send(Live_info.uid,v.gift_id,MY_API.CONFIG.SPARE_GIFT_UID,giftnum,v.bag_id,MY_API.CONFIG.SPARE_GIFT_ROOM,Live_info.rnd).then((response)=>{MYDEBUG('Gift.sendGift(剩余礼物): API.gift.bag_send',response);if(response.code===0){window.toast(`[自动送礼](剩余礼物)房间[${MY_API.CONFIG.SPARE_GIFT_ROOM}] 送礼成功，送出${giftnum}个${v.gift_name}`,'success');}else{window.toast(`[自动送礼](剩余礼物)房间[${MY_API.CONFIG.SPARE_GIFT_ROOM}] 送礼异常:${response.msg}`,'caution');}},()=>{window.toast('[自动送礼](剩余礼物)包裹送礼失败，请检查网络','error');return delayCall(()=>MY_API.Gift.sendGift(medal,i));});}}catch(err){FailFunc();window.toast('[自动送礼]运行时出现异常，已停止','error');console.error(`[${NAME}]`,err);return $.Deferred().reject();}
SEND_GIFT_NOW=false;nextTimeDebug();},sendGift:(medal,i=0)=>{if(i>=MY_API.Gift.bag_list.length){return $.Deferred().resolve();}
if(MY_API.Gift.remain_feed<=0){window.toast(`[自动送礼]勋章[${medal.medalName}] 送礼结束，今日亲密度已满[${medal.today_feed}/${medal.day_limit}]`,'info');return $.Deferred().resolve();}
if(MY_API.Gift.time<=0)MY_API.Gift.time=ts_s();const v=MY_API.Gift.bag_list[i];if(((MY_API.Gift.sendGiftList.includes(v.gift_id)&&v.expire_at>MY_API.Gift.time&&(v.expire_at-MY_API.Gift.time<MY_API.CONFIG.GIFT_LIMIT*86400))||MY_API.CONFIG.SEND_ALL_GIFT)&&v.corner_mark!='永久'){if(v.gift_id==undefined){return $.Deferred().resolve();}
if(v==undefined){return $.Deferred().resolve();}
const feed=MY_API.Gift.getFeedByGiftID(v.gift_id);if(feed>0){let feed_num=Math.floor(MY_API.Gift.remain_feed/feed);if(feed_num>v.gift_num)feed_num=v.gift_num;if(feed_num>0){return BAPI.gift.bag_send(Live_info.uid,v.gift_id,MY_API.Gift.ruid,feed_num,v.bag_id,MY_API.Gift.room_id,Live_info.rnd).then((response)=>{MYDEBUG('Gift.sendGift: API.gift.bag_send',response);if(response.code===0){v.gift_num-=feed_num;medal.today_feed+=feed_num*feed;MY_API.Gift.remain_feed-=feed_num*feed;window.toast(`[自动送礼]勋章[${medal.medalName}] 送礼成功，送出${feed_num}个${v.gift_name}，[${medal.today_feed}/${medal.day_limit}]距离升级还需[${MY_API.Gift.remain_feed}]`,'success');}else{window.toast(`[自动送礼]勋章[${medal.medalName}] 送礼异常:${response.msg}`,'caution');}
return MY_API.Gift.sendGift(medal,i+1);},()=>{window.toast('[自动送礼]包裹送礼失败，请检查网络','error');return delayCall(()=>MY_API.Gift.sendGift(medal,i));});}}}
return MY_API.Gift.sendGift(medal,i+1);}},MobileHeartBeat:{run:async()=>{if(MY_API.CONFIG.MOBILE_HEARTBEAT==false)return $.Deferred().resolve();if(!checkNewDay(MY_API.CACHE.MobileHeartBeat_TS)){runMidnight(MY_API.MobileHeartBeat.run,'移动端心跳');return $.Deferred().resolve();}
if(Live_info.mobile_verify===false){window.toast('[移动端心跳]未绑定手机，已停止','warning');MYDEBUG('MobileHeartBeat',`未绑定手机 mobile_verify = ${Live_info.mobile_verify}`);return $.Deferred().resolve();}
const mobileOnline=()=>{XHR({GM:true,anonymous:true,method:'POST',url:`https://api.live.bilibili.com/heartbeat/v1/OnLine/mobileOnline?${BilibiliToken.signQuery(`access_key=${tokenData.access_token}&${baseQuery}`)}`,data:`room_id=${Live_info.room_id}&scale=xxhdpi`,responseType:'json',headers:appToken.headers});};const EndFunc=(re)=>{MYDEBUG('MobileHeartBeat GetAward',re);clearInterval(HBinterval);MY_API.CACHE.MobileHeartBeat_TS=ts_ms();MY_API.saveCache();runMidnight(MY_API.MobileHeartBeat.run,'移动端心跳');};const getWatchingAward=()=>{BAPI.activity.receive_award('double_watch_task').then((response)=>{if(response.code===0){window.toast('[双端观看直播]奖励领取成功','success');EndFunc(response);return $.Deferred().resolve();}
else if(response.code===-400){window.toast('[双端观看直播]奖励已领取','info');EndFunc(response);return $.Deferred().resolve();}
else{window.toast(`[双端观看直播]${response}`,'warning');EndFunc(response);return $.Deferred().resolve();}},(err)=>{window.toast('[双端观看直播]奖励领取失败，请检查网络','error');console.error('MobileHeartBeat GetAward',err);clearInterval(HBinterval);return delayCall(()=>MY_API.MobileHeartBeat.run());});}
if(await setToken()===undefined&&tokenData.access_token===undefined){MYDEBUG('MobileHeartBeat','token设置失败');return;}
MYDEBUG('MobileHeartBeat','开始客户端心跳');mobileOnline();let HBinterval=undefined;HBinterval=setInterval(()=>mobileOnline(),300*1e3);setTimeout(()=>getWatchingAward(),360*1e3);}},stormQueue:[],stormBlack:false,stormIdSet:{add:function(id){let storm_id_list=[];try{let config=JSON.parse(localStorage.getItem(`${NAME}stormIdSet`));storm_id_list=[].concat(config.list);storm_id_list.push(id);if(storm_id_list.length>50){storm_id_list.splice(0,10);}
localStorage.setItem(`${NAME}stormIdSet`,JSON.stringify({list:storm_id_list}));MYDEBUG(`${NAME}storm_Id_list_add`,storm_id_list);}catch(e){storm_id_list.push(id);localStorage.setItem(`${NAME}stormIdSet`,JSON.stringify({list:storm_id_list}));}},isIn:function(id){let storm_id_list=[];try{let config=JSON.parse(localStorage.getItem(`${NAME}stormIdSet`));if(config===null){storm_id_list=[];}else{storm_id_list=[].concat(config.list);}
MYDEBUG(`${NAME}storm_Id_list_read`,config);return storm_id_list.indexOf(id)>-1}catch(e){localStorage.setItem(`${NAME}stormIdSet`,JSON.stringify({list:storm_id_list}));MYDEBUG('读取'+`${NAME}stormIdSet`+'缓存错误已重置');return storm_id_list.indexOf(id)>-1}}},Storm:{check:(id)=>{return MY_API.stormQueue.indexOf(id)>-1;},append:(id)=>{MY_API.stormQueue.push(id);if(MY_API.stormQueue.length>MY_API.CONFIG.STORM_QUEUE_SIZE){MY_API.stormQueue.shift();}},over:(id)=>{var index=MY_API.stormQueue.indexOf(id);if(index>-1){MY_API.stormQueue.splice(id,1);}},run:(roomid)=>{try{if(!MY_API.CONFIG.STORM)return $.Deferred().resolve();if(MY_API.stormBlack)return $.Deferred().resolve();if(inTimeArea(MY_API.CONFIG.TIME_AREA_START_H0UR,MY_API.CONFIG.TIME_AREA_END_H0UR,MY_API.CONFIG.TIME_AREA_START_MINUTE,MY_API.CONFIG.TIME_AREA_END_MINUTE)&&MY_API.CONFIG.TIME_AREA_DISABLE){MYDEBUG(`节奏风暴`,`自动休眠，跳过检测roomid=${roomid}`);return $.Deferred().resolve();}
return BAPI.Storm.check(roomid).then((response)=>{MYDEBUG('MY_API.Storm.run: MY_API.API.Storm.check',response);if(response.code===0){var data=response.data;MY_API.Storm.join(data.id,data.roomid,Math.round(new Date().getTime()/1000)+data.time);return $.Deferred().resolve();}else{window.toast(`[自动抽奖][节奏风暴](roomid=${roomid})${response.msg}`,'caution');}},()=>{window.toast(`[自动抽奖][节奏风暴]检查直播间(${roomid})失败，请检查网络`,'error');});}catch(err){window.toast('[自动抽奖][节奏风暴]运行时出现异常','error');console.error(`[${NAME}]`,err);return $.Deferred().reject();}},join:(id,roomid,endtime)=>{roomid=parseInt(roomid,10);id=parseInt(id,10);if(isNaN(roomid)||isNaN(id))return $.Deferred().reject();var tid=Math.round(id/1000000);if(MY_API.stormIdSet.isIn(tid))return $.Deferred().resolve();MY_API.stormIdSet.add(tid);if(MY_API.Storm.check(id)){return;}
MY_API.Storm.append(id);var stormInterval=0;if(endtime<=0){endtime=Math.round(new Date().getTime()/1000)+90;}
var count=0;window.toast(`[自动抽奖][节奏风暴]尝试抽奖(roomid=${roomid},id=${id})`,'success');async function process(){try{if(!MY_API.Storm.check(id)){clearInterval(stormInterval);return;}
var timenow=Math.round(new Date().getTime()/1000);if(timenow>endtime&&endtime>0){MY_API.Storm.over(id);clearInterval(stormInterval);return;}
count++;if(count>MY_API.CONFIG.STORM_MAX_COUNT&&MY_API.CONFIG.STORM_MAX_COUNT>0){MY_API.Storm.over(id);clearInterval(stormInterval);window.toast(`[自动抽奖][节奏风暴]抽奖(roomid=${roomid},id=${id})到达尝试次数。\r\n尝试次数:${count},距离到期:${endtime - timenow}s`,'caution');return;}
let response;try{if(userToken&&appToken&&tokenData.access_token){response=await BAPI.Storm.join_ex(id,roomid,tokenData.access_token,BilibiliToken.appKey,BilibiliToken.headers);}else{response=await BAPI.Storm.join(id,captcha_token='',captcha_phrase='',roomid);}
MYDEBUG('MY_API.Storm.join: MY_API.API.Storm.join',response);if(response.code){if(response.msg.indexOf("领取")!=-1){MY_API.Storm.over(id);clearInterval(stormInterval);window.toast(`[自动抽奖][节奏风暴]领取(roomid=${roomid},id=${id})成功,${response.msg}\r\n尝试次数:${count}`,'success');return;}
if(response.msg.indexOf("验证码")!=-1){MY_API.Storm.over(id);clearInterval(stormInterval);MY_API.stormBlack=true;window.toast(`[自动抽奖][节奏风暴]抽奖(roomid=${roomid},id=${id})失败,疑似账号不支持,${response.msg}`,'caution');return;}
if(response.data&&response.data.length==0&&response.msg.indexOf("下次要更快一点")!=-1){MY_API.Storm.over(id);window.toast(`[自动抽奖][节奏风暴]抽奖(roomid=${roomid},id=${id})疑似风暴黑屋,终止！`,'error');clearInterval(stormInterval);MY_API.stormBlack=true;setTimeout(()=>{MY_API.stormBlack=false;},3600*1000);return;}
if(response.msg.indexOf("下次要更快一点")==-1){clearInterval(stormInterval);return;}}else{MY_API.Storm.over(id);Statistics.appendGift(response.data.gift_name,response.data.gift_num);window.toast(`[自动抽奖][节奏风暴]领取(roomid=${roomid},id=${id})成功,${response.data.gift_name + "x" + response.data.gift_num}\r\n${response.data.mobile_content}\r\n尝试次数:${count}`,'success');clearInterval(stormInterval);return;}}catch(e){MY_API.Storm.over(id);window.toast(`[自动抽奖][节奏风暴]抽奖(roomid=${roomid},id=${id})疑似触发风控,终止！\r\n尝试次数:${count}`,'error');console.error(e);clearInterval(stormInterval);return;}}
catch(e){MY_API.Storm.over(id);window.toast(`[自动抽奖][节奏风暴]抽奖(roomid=${roomid},id=${id})抽奖异常,终止！`,'error');console.error(e);clearInterval(stormInterval);return;}}
stormInterval=setInterval(()=>process(),MY_API.CONFIG.STORM_ONE_LIMIT);return $.Deferred().resolve();}},LITTLE_HEART:{medalRoom_list:undefined,getMedalRoomList:(page=1)=>{if(page===1)MY_API.LITTLE_HEART.medalRoom_list=[];return BAPI.i.medal(page,25).then((response)=>{MYDEBUG('LITTLE_HEART.getMedalRoomList: API.i.medal',response);for(let i of response.data.fansMedalList){MY_API.LITTLE_HEART.medalRoom_list=MY_API.LITTLE_HEART.medalRoom_list.concat(i.roomid);}
MYDEBUG('MY_API.LITTLE_HEART.medalRoom_list',MY_API.LITTLE_HEART.medalRoom_list)
if(response.data.pageinfo.curPage<response.data.pageinfo.totalpages)MY_API.LITTLE_HEART.getMedalRoomList(page+1);},()=>{window.toast('[小心心]获取勋章列表失败，请检查网络','error');return delayCall(()=>MY_API.LITTLE_HEART.getMedalRoomList(page));});},checkRoomList:async(roomList)=>{MYDEBUG(`MY_API.LITTLE_HEART.checkRoomList start`);let returnRoom=undefined;for(let r of roomList){await BAPI.room.get_info(r).then((re)=>{if(re.data.live_status===1){MYDEBUG('MY_API.LITTLE_HEART.checkRoomList returnRoom',r)
returnRoom=r;return}},()=>{window.toast('[小心心]获取房间信息失败，请检查网络','error');return delayCall(()=>MY_API.LITTLE_HEART.checkRoomList(roomList));})
if(returnRoom!=undefined)break;};if(returnRoom!=undefined){return returnRoom}else{window.toast('[小心心]当前粉丝勋章列表中无正在直播房间，5分钟后重试');return delayCall(()=>MY_API.LITTLE_HEART.getMedalRoomList(page),300e3);}},checkRoom:async(roomid)=>{let roomCheck=undefined;await BAPI.room.get_info(roomid).then((re)=>{if(re.data.live_status===1){roomCheck=true;}else{roomCheck=false;}},()=>{window.toast('[小心心]获取房间信息失败，请检查网络','error');return delayCall(()=>MY_API.LITTLE_HEART.checkRoomList(roomList));});return roomCheck;},heartBeat_E:async(roomid)=>{let payload={'id':`[1, 34, 0, ${String(roomid)}]`,'device':'["c4ca4238a0b923820dcc509a6f75849b","55e2620e-a2b9-4086-bd9a-bc399ba13480"]','ts':ts_s(),'is_patch':0,'heart_beat':'[]','ua':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36','csrf_token':Live_info.bili_jct,'csrf':Live_info.bili_jct,'heartbeat_interval':'','secret_key':'','heartbeat_interval':'','visit_id':''};let data=encodeURI(BAPI.KeySign.sort(payload));MYDEBUG('data encode',data)
let header={'Content-Type':'application/x-www-form-urlencoded','Origin':'https://live.bilibili.com','Referer':`https://live.bilibili.com/${String(roomid)}`,'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36','Cookie':Live_info.bili_jct,};MYDEBUG('[web心跳]','E 首次心跳');let response=await XHR({GM:true,anonymous:false,method:'POST',url:`https://live-trace.bilibili.com/xlive/data-interface/v1/x25Kn/E`,responseType:'json',headers:header,data:data});MYDEBUG('[web心跳]E返回',response);payload['ets']=parseInt(response.data.timestamp);MYDEBUG('[web心跳] payload[ets]',payload['ets']);payload['secret_key']=String(response.data.secret_key);MYDEBUG('[web心跳] payload[secret_key]',payload['secret_key']);payload['heartbeat_interval']=parseInt(response.data.heartbeat_interval);MYDEBUG('[web心跳] payload[heartbeat_interval]',payload['heartbeat_interval']);MYDEBUG('[web心跳]E返回payload',payload);return payload},heartBeat_X:async(index,payload,room_id)=>{const header={'Content-Type':'application/x-www-form-urlencoded','Origin':'https://live.bilibili.com','Referer':`https://live.bilibili.com/${String(room_id)}`,'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36','Cookie':Live_info.bili_jct,};const s_data={"t":{'id':`[1, 34, ${String(index)}, ${String(room_id)}]`,"device":payload['device'],"ets":payload['ets'],"benchmark":payload['secret_key'],"time":payload['heartbeat_interval'],"ts":ts_s(),"ua":payload['ua']},"r":[2,5,1,4]};let t=s_data['t'];MYDEBUG('[web心跳]s_data[r]',s_data['r']);MYDEBUG('[web心跳]s_data[t]',s_data['t']);bilibiliPcHeartBeat.run(JSON.stringify(s_data['t']),s_data['r'],String(room_id))
await sleep(1e3)
MYDEBUG('[web心跳]UniqueFinalS',bilibiliPcHeartBeat.ANSWER);let newpayload={'s':String(bilibiliPcHeartBeat.ANSWER),'id':t['id'],'device':t['device'],'ets':t['ets'],'benchmark':String(t['benchmark']),'time':String(t['time']),'ts':t['ts'],"ua":t['ua'],'csrf_token':Live_info.bili_jct,'csrf':Live_info.bili_jct,'visit_id':'',};let data=encodeURI(BAPI.KeySign.sort(newpayload));MYDEBUG('[web心跳]data',data);MYDEBUG('[web心跳]',`X 第${index}次心跳`);let response=await XHR({GM:true,anonymous:false,method:'POST',url:`https://live-trace.bilibili.com/xlive/data-interface/v1/x25Kn/X`,responseType:'json',headers:header,data:data});MYDEBUG(`[web心跳]X 第${index}次心跳返回`,response);newpayload['ets']=response.data.timestamp;newpayload['secret_key']=response.data.secret_key;newpayload['heartbeat_interval']=response.data.heartbeat_interval;MYDEBUG('[web]心跳X返回newpayload',newpayload);return newpayload},run:async()=>{if(!MY_API.CONFIG.LITTLE_HEART)return $.Deferred().resolve();await MY_API.LITTLE_HEART.getMedalRoomList();let targetRoomId=await MY_API.LITTLE_HEART.checkRoomList(MY_API.LITTLE_HEART.medalRoom_list);window.toast(`[小心心]发送房间${targetRoomId}的E心跳`,'info');let payLoad=await MY_API.LITTLE_HEART.heartBeat_E(targetRoomId);let heartBeatTime=1;let Timer=setInterval(async()=>{if(heartBeatTime<=7){if(await MY_API.LITTLE_HEART.checkRoom(targetRoomId)===true){window.toast(`[小心心]发送房间${targetRoomId}的X心跳`,'info');MYDEBUG('[web心跳] heartBeatTime次数',heartBeatTime);payLoad=await MY_API.LITTLE_HEART.heartBeat_X(heartBeatTime,payLoad,targetRoomId);heartBeatTime=heartBeatTime+1;}else{window.toast(`[小心心]当前房间未开播，重新寻找开播房间`,'warning');clearInterval(Timer);return MY_API.LITTLE_HEART.run();}}else{window.toast('[小心心]任务完成','success');clearInterval(Timer);}},299e3)}}};MY_API.init().then(()=>{try{const promiseInit=$.Deferred();const uniqueCheck=()=>{const t=Date.now();if(t-MY_API.CACHE.UNIQUE_CHECK>=0&&t-MY_API.CACHE.UNIQUE_CHECK<=15e3){$('.link-toast').hide();$('.igiftMsg').hide();MY_API.CONFIG.AUTO_TREASUREBOX=false;window.toast('有其他直播间页面的脚本正在运行，本页面脚本停止运行','caution');return promiseInit.reject();}
return promiseInit.resolve();};uniqueCheck().then(()=>{let timer_unique;const uniqueMark=()=>{timer_unique=setTimeout(uniqueMark,10e3);MY_API.CACHE.UNIQUE_CHECK=Date.now();MY_API.saveCache(false);};window.addEventListener('unload',()=>{if(timer_unique){clearTimeout(timer_unique);MY_API.CACHE.UNIQUE_CHECK=0;MY_API.saveCache();}});uniqueMark();if(parseInt(Live_info.uid)===0||isNaN(parseInt(Live_info.uid))){MY_API.chatLog('未登录，请先登录再使用脚本','warning');return};MY_API.newMeaasge(GM_info.script.version);MYDEBUG('MY_API.CONFIG',MY_API.CONFIG);StartPlunder(MY_API);})}
catch(e){console.error('重复运行检测错误',e);}});}
function StartPlunder(API){'use strict';let clearStat=()=>{API.GIFT_COUNT.COUNT=0;API.GIFT_COUNT.CLEAR_TS=dateNow();API.saveGiftCount();MYDEBUG('已清空辣条数量')}
if(checkNewDay(API.GIFT_COUNT.CLEAR_TS))clearStat();runExactMidnight(clearStat,'重置统计')
API.LITTLE_HEART.run();API.removeUnnecessary();setTimeout(()=>{API.GroupSign.run();API.DailyReward.run();API.LiveReward.run();API.Exchange.runS2C();API.TreasureBox.run();API.Gift.run();API.MobileHeartBeat.run();},6e3);API.creatSetBox();BAPI.room.getList().then((response)=>{MYDEBUG('直播间列表',response);for(const obj of response.data){BAPI.room.getRoomList(obj.id,0,0,1,1).then((response)=>{MYDEBUG('直播间号列表',response);for(let j=0;j<response.data.length;++j){API.listen(response.data[j].roomid,Live_info.uid,`${obj.name}区`);}});}});let check_top_room=()=>{if(API.GIFT_COUNT.COUNT>=API.CONFIG.MAX_GIFT){MYDEBUG('超过今日辣条限制，不参与抽奖');API.max_blocked=true;}
if(API.blocked||API.max_blocked){if(API.blocked){API.chatLog('进入小黑屋检查小时榜已停止运行');clearInterval(check_timer);return}
else{API.chatLog('辣条已达到最大值检查小时榜已停止运行');return}}
if(inTimeArea(API.CONFIG.TIME_AREA_START_H0UR,API.CONFIG.TIME_AREA_END_H0UR,API.CONFIG.TIME_AREA_START_MINUTE,API.CONFIG.TIME_AREA_END_MINUTE)&&API.CONFIG.TIME_AREA_DISABLE){API.chatLog('当前时间段不检查小时榜礼物','warning');return}
const AreaIdList=['小时总榜','娱乐小时榜','网游小时榜','手游小时榜','绘画小时榜','电台小时榜','单机小时榜',];let AreaNum=1;let checkHourRank=(areaId)=>{BAPI.rankdb.getTopRealTimeHour(areaId).then((data)=>{let list=data.data.list;API.chatLog(`检查${AreaIdList[areaId]}房间的礼物`,'warning');MYDEBUG(`${AreaIdList[areaId]}房间列表`,list);for(let i of list){API.checkRoom(i.roomid,`小时榜-${i.area_v2_parent_name}区`);}})};let timer=setInterval(()=>{if(AreaNum<=AreaIdList.length-1){checkHourRank(AreaNum);AreaNum++;}
else{clearInterval(timer)}},1000);};setTimeout(check_top_room,6e3);let check_timer=setInterval(check_top_room,parseInt(API.CONFIG.CHECK_HOUR_ROOM_INTERVAL*1000));let reset=(delay)=>{setTimeout(()=>{if(API.raffleId_list.length>0||API.guardId_list.length>0||API.pkId_list.length>0){MYDEBUG('还有礼物没抽，延迟15s后刷新直播间');reset(15000);return}
if(inTimeArea(API.CONFIG.TIME_AREA_START_H0UR,API.CONFIG.TIME_AREA_END_H0UR,API.CONFIG.TIME_AREA_START_MINUTE,API.CONFIG.TIME_AREA_END_MINUTE)&&API.CONFIG.IN_TIME_RELOAD_DISABLE){let resetTime=getIntervalTime(API.CONFIG.TIME_AREA_START_MINUTE,API.CONFIG.TIME_AREA_END_MINUTE);reset(resetTime);MYDEBUG(`处于休眠时间段，将在${resetTime}毫秒后刷新直播间`);return;}
window.location.reload();},delay);};reset(API.CONFIG.TIME_RELOAD*60000);}
function getIntervalTime(hour,minute){let myDate=new Date();let h=myDate.getHours();let m=myDate.getMinutes();let s=myDate.getSeconds();let TargetTime=hour*3600*1e3+minute*60*1e3;let nowTime=h*3600*1e3+m*60*1e3+s*1e3;let intervalTime=TargetTime-nowTime;MYDEBUG("[getIntervalTime]获取间隔时间",intervalTime+'毫秒');if(intervalTime<0){return 24*3600*1e3+intervalTime}
else{return intervalTime}}
function isTime(hour,minute){let myDate=new Date();let h=myDate.getHours();let m=myDate.getMinutes();if(h==hour&&m==minute){return true}else{MYDEBUG("错误时间");return false}}
function inTimeArea(sH,eH,sM,eM){if(sH>23||eH>24||sH<0||eH<1||sM>59||sM<0||eM>59||eM<0){return false}
let myDate=new Date();let h=myDate.getHours();let m=myDate.getMinutes();if(sH<eH){if(h>=sH&&h<eH)
return true;else if(h==eH&&m>=sM&&m<eM)
return true;else return false;}
else if(sH>eH){if(h>=sH||h<eH)
return true;else if(h==eH&&m>=sM&&m<eM)
return true;else return false;}
else if(sH==eH){if(h==sH&&sM<=eM&&m>=sM&&m<eM)
return true
else if(h==sH&&sM>eM&&m<=eM&&m>sM)
return true
else return false;}}
function sleep(millisecond){return new Promise(resolve=>{setTimeout(()=>{resolve()},millisecond)})}
function probability(val){if(val<=0)return false;let rad=Math.random();return(val/100)>=rad}
const dateNow=()=>Date.now();const checkNewDay=(ts)=>{if(ts===0)return true;let t=new Date(ts);let d=new Date();let td=t.getDate();let dd=d.getDate();return(dd!==td);};function XHR(XHROptions){return new Promise(resolve=>{const onerror=(error)=>{console.error('XHR',error);resolve(undefined);};if(XHROptions.GM){if(XHROptions.method==='POST'){if(XHROptions.headers===undefined)
XHROptions.headers={};if(XHROptions.headers['Content-Type']===undefined)
XHROptions.headers['Content-Type']='application/x-www-form-urlencoded; charset=utf-8';}
XHROptions.timeout=30*1000;XHROptions.onload=res=>{resolve(res.response)};XHROptions.onerror=onerror;XHROptions.ontimeout=onerror;GM_xmlhttpRequest(XHROptions);}
else{const xhr=new XMLHttpRequest();xhr.open(XHROptions.method,XHROptions.url);if(XHROptions.method==='POST'&&xhr.getResponseHeader('Content-Type')===null)
xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=utf-8');if(XHROptions.cookie)
xhr.withCredentials=true;if(XHROptions.responseType!==undefined)
xhr.responseType=XHROptions.responseType;xhr.timeout=30*1000;xhr.onload=ev=>{const res=ev.target;resolve({response:res,body:res.response});};xhr.onerror=onerror;xhr.ontimeout=onerror;xhr.send(XHROptions.data);}});};})();