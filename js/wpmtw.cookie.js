// wpm.tw
// wpm.tw
// wpm.tw
// yh kao cow315@gmail.com
//20220410 typing.js
wpmtw.cookie = {
	ver: '0.1',
	ajax_page: '',

                    write : function() {
                        
                        exdays = 7;
                        
                        cname = 'test';
                        cvalue = '身兼民眾黨主席的台北市長柯文哲日前在黨政會報中，針對苗栗縣議員提名爭議炮轟中評會主委、賴香伶辦公室主任林恕暉，甚至脫口「誰家的狗，自己回去管好」。賴香伶昨表示，以理服人比情緒性用語更能獲得尊重，柯主席應該收回那句話並道歉。柯文哲則稱，EQ不好、情緒不佳要改進，但拒絕公開道歉，會私底下跟賴香伶講。民眾黨苗栗縣議員提名傳出爭議，民眾黨中評會認定提名過程有「關鍵瑕疵」，建議撤銷提名、重啟初選，未料，柯文哲日前黨政會報討論時，怪罪中評會「為什麼要查」，說到激動處竟然脫口而出「誰家的狗，自己回去管好」。對此，賴香伶昨表示，她在會中非常激動提出反駁及諫言，她說，黨制度建立的過程本來就是不斷的磨合與修正才能完善，在中央委員會上就事論事討論大家常有爭執，以理服人比情緒性用語更能獲得尊重。她認為，「柯主席應該收回那句話，並向大家道歉。」民眾黨昨舉行華山論壇，賴香伶原定出席與柯文哲同台，但臨時未到場。柯文哲表示，此次事件代表新興政黨沒制度，去年11月發生的爭議拖到現在才處理，很奇怪，顯示新的政黨很多制度欠缺，這件事情拖到都要選舉了，不是很好笑嗎？後續爭議將送到中央委員會討論。民進黨立委鄭運鵬、時代力量立委王婉諭也看不下去齊批柯文哲，在職場上用什麼方式對待同仁，未來就會用同樣方式對待人民，要求柯文哲應公開向同仁道歉。';
                        
                        const d = new Date();
                        d.setTime(d.getTime() + (exdays*24*60*60*1000));
                        let expires = "expires="+ d.toUTCString();
                        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  
  
                        console.log('write');
                        
                    }, 
                    
                    
                    read : function() {
                        
                        
                        console.log(wpmtw.cookie.getCookie('test'));
                        
                    },
                    
                    
                    getCookie : function (cname) {
                        let name = cname + "=";
                        let ca = document.cookie.split(';');
                        for(let i = 0; i < ca.length; i++) {
                          let c = ca[i];
                          while (c.charAt(0) == ' ') {
                            c = c.substring(1);
                          }
                          if (c.indexOf(name) == 0) {
                            return c.substring(name.length, c.length);
                          }
                        }
                        return "";
                      }
};
 