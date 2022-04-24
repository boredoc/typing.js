/************************************************************
 *																														*
 * WPM.TW	EXAM EDITOR											*
 *																														*	
 ************************************************************/
wpmtw.exam.editor = {

	ver: '0.1',
	max_chars: 40,
	totalline: 0,
	full: 0,
	half: 0,
	ch: 0,

	re_full: /[\uff00-\uffff]/,
	re_half: /[\u0000-\u00ff]/,
	re_ch: /[\u4e00-\u9a05]/,

                    pasteTips : '請輸入文章或直接貼上...\n\n或輸入0~n按enter載入demo articles' ,

	split: function() {

		with(wpmtw.exam.editor) {
			var txt = $.trim($('#exam_paste_area').val());
			if (txt == wpmtw.exam.editor.pasteTips || txt == '') {
				alert('請輸入內容！');
				return;
			}

			var raw = txt.split("\n");


			var lines = new Array(); 
			var temp_line = '', temp_char = '', halfSeq = false,  isHalf = false,  isBlank = false, tempHalfStr = '',  temp_char_code = 0; 
                                                            var remainStr = '';
			for (i = 0; i < raw.length; i++) { // each line
				line = $.trim(raw[i]);

				if (line != '') {
					c = 0;
					temp_line = '';
                                                                                                    var _lastBlankIdx = 0;
                                                                                                    var _remainIdx = 0;
                                                                                                    var _z = 0;
					for (z = 0; z < line.length; z++) { // each char
                                                                                                                        
						temp_char = line.charAt(z);
						temp_char_code = temp_char.charCodeAt(); 

                                                                                                                        isHalf = temp_char.match(re_half);
                                                                                                                        
                                                                                                                        isBlank = temp_char_code == 12288 || temp_char_code == 32;
                                                                                                                        //console.log('isBlank='+isBlank);                   
						if (temp_line == '' && isBlank) { // first char is blank
                                                                                                                            continue;
						} 
                                                                                                                            
                                                                                                                            c += isHalf ? 0.5 : 1;
                                                                                                                            //c+=(temp_char_code<=128) ? 0.5  : 1; 
                                                                                                                            temp_line += temp_char;   
                                                                                                                            //console.log('temp_line='+temp_line);
                                                                                                                           
                                                                                                                           
                                                                                                                           
                                                                                                                           _lastBlankIdx = _z; // final fix ?
                                                                                                                           
                                                                                                                           if(isBlank)
                                                                                                                                _lastBlankIdx = _z + _remainIdx;
                                                                                                                            
                                                                                                                        if (c >= max_chars) {
                                                                                                                            //console.log('c >= max_chars');                                                             

                                                                                                                              if(z < line.length-1) // 
                                                                                                                              {
                                                                                                                                  var _nextChar = line.charAt(z+1);
                                                                                                                                  let _nextCharCode = _nextChar.charCodeAt();
                                                                                                                                  console.log('_nextChar='+_nextChar + ' ' + _nextCharCode);         
                                                                                                                                  if(_nextCharCode != ! 12288 && _nextCharCode != 32)
                                                                                                                                  {
                                                                                                                                     //console.log('_lastBlankIdx=' + _lastBlankIdx);  
                                                                                                                                     remainStr = temp_line.substring(_lastBlankIdx);
                                                                                                                                     temp_line = temp_line.substring(0, _lastBlankIdx);
                                                                                                                                     //console.log('remainStr='+remainStr);
                                                                                                                                  } 
                                                                                                                              }
                                                                                                                              
                                                                                                                              //console.log('temp_line='+temp_line);
                                                                                                                              lines.push(temp_line);
                                                                                                                              temp_line = '';
                                                                                                                              c = 0;
                                                                                                                              _lastBlankIdx= 0;
                                                                                                                              
                                                                                                                              
                                                                                                                              if(remainStr!='')
                                                                                                                              {    
                                                                                                                                  remainStr = remainStr.trim();
                                                                                                                                  temp_line = remainStr;
                                                                                                                                  _remainIdx = temp_line.length;
                                                                                                                                  for (j = 0; j < temp_line.length; j++) { // each char
                                                                                                                                      	temp_char = temp_line.charAt(j); 
                                                                                                                                            isHalf = temp_char.match(re_half);
                                                                                                                                            c += isHalf ? 0.5 : 1;
                                                                                                                                  } 
                                                                                                                              }
                                                                                                                              else
                                                                                                                                  _remainIdx = 0;
                                                                                                                              remainStr = '';
                                                                                                                              //console.log('c='+c); 
                                                                                                                              _z = 0;
						}
                                                                                                        _z ++;
					} // end each char

					if (temp_line != '') lines.push(temp_line);

				}
			} // end each line 

			//$('#exam_preview').html(lines.join('<BR>'));
                                                            //  type.js no need title
			//html = '<div align=center><input type="text" id="title" class="inputline" style="width:300px;"  value="" maxlength="20" ></div>';
                                                            html = '<div align=center><input type="text" class="inputline" ></div>';
			for (i = 0; i < lines.length; i++) {
				html += '<input id="line' + i + '" type="text"  class=inputline readonly />';
			}
			for (i = lines.length; i < lines.length + 3; i++) {
				html += '<input id="line' + i + '" type="text"  class=inputline value="" readonly />';
			}
			totalline = lines.length + 3;

			$('#exam_preview').html(html);

			for (i = 0; i < lines.length; i++) {
				$('#line' + i).val(lines[i]);
			}
                                                            full = 0;
                                                            half = 0;
                                                            for (i = 0; i < lines.length; i++) {
                                                                    line = lines[i]; 
                                                                    if (line != '') {
                                                                            for (z = 0; z < line.length; z++) { 
                                                                                _a = '';

                                                                                    if (!line.charAt(z).match(re_half)) {
                                                                                        full++;
                                                                                        _a = 'Full ' + full;
                                                                                    }
                                                                                    else if ($.trim(line.charAt(z))!='') {
                                                                                        half++;
                                                                                        _a = 'Half ' +half; 
                                                                                    }
                                                                                    add_log(line.charAt(z) +" " +_a);

                                                                            } 
                                                                    }
                                                            }
                                                            add_log('full='+full);
                                                            add_log('half='+half);
                                                            
                                                            $('#line' + (lines.length + 1)).val('全型：'+ full + '  半型：' + half);

			$('#exam_paste_area').hide();
			$('#exam_preview').show();

//			$('#title').val(lines[0].substring(0, 20)).css('background-color', '#FFFFB0');
//			$('#title').focus(function(e) {
//				if ($('#title').val() == '請輸入標題') {
//					$('#title').val('').css('color', '#222');
//				}
//			});
//			$('#title').blur(function(e) {
//				if ($('#title').val() == '請輸入標題' || $.trim($('#title').val()) == '') {
//					$('#title').val('請輸入標題').css('color', '#555');
//				}
//			});
		}

	},


	add_log: function(msg) {
		$('#debug').val($('#debug').val() + msg + "\n");
	},
        
	do_submit: function() {

		with(wpmtw.exam.editor) {
			if ($('#exam_paste_area').css('display') == 'none') {
//				var title = $.trim($('#title').val());
//				if (title == '請輸入標題' || title == '') {
//					return alert('請輸入標題！');
//				}
//                                                                                if(!confirm('確定新增此文章？'))
//                                                                                return;

				var exam = new Array();
				for (i = 0; i < totalline - 3; i++) {
					line = $.trim($('#line' + i).val());


					if (line != '') {
						for (z = 0; z < line.length; z++) {
							if (!line.charAt(z).match(re_half)) full++;
							else if ($.trim(line.charAt(z))!='') half++;
						}
						exam.push($.trim($('#line' + i).val()));
					}
				}
                                
                                
                                                                                
                                
                                                                                
    				$('#f_full').val(full);
				$('#f_half').val(half);
				//$('#f_title').val(title);
				$('#f_lines').val(exam.join('\n'));
				//alert($('#f_lines').val())
                                
                                                                                
                                                                                //$('#frm').submit();
                                                                                
                                                                                 $('#dvEditor').hide();
                                                                                 $('#dvPlay').show();
                                                                                 
                                                                                 
                                                                                 wpmtw.exam.play.preInit(  full + half , full , half   ,  exam  );
                                                                                 
				return false;
			}

			wpmtw.exam.editor.split();

		}

	},

	do_reset: function() {
		$('#exam_paste_area').val(wpmtw.exam.editor.pasteTips);
		$('#exam_preview').html('');
		$('#exam_paste_area').show();
		$('#exam_preview').hide();
	},


	init: function() {
		$('#exam_paste_area').val(wpmtw.exam.editor.pasteTips);
		$('#exam_paste_area').focus(function(e) {
			if ($('#exam_paste_area').val() == wpmtw.exam.editor.pasteTips) {
				$('#exam_paste_area').val('');
			}
		});
		$('#exam_paste_area').blur(function(e) {
			if ($('#exam_paste_area').val() == wpmtw.exam.editor.pasteTips || $.trim($('#exam_paste_area').val()) == '') {
				$('#exam_paste_area').val(wpmtw.exam.editor.pasteTips);
			}
		});
                
                
                                        //demo articles
                                        $('#exam_paste_area').keyup(function(e) {
                                                
                                                        if (e.which == 13) // enter
                                                        {  
                                                            
                                                            var articles = [];
                                                            articles.push('根據聯合國教科文組織1972年制訂的《保護世界文化和自然遺產公約》，世界遺產指對全人類有重要文化或自然價值的遺產項目。1990年12月，蘇聯在加拿大班夫舉行的聯合國教科文組織世界遺產委員會第十四屆會議入選首批共五項遺產，其中聖彼得堡歷史中心及其相關古蹟群（當時叫列寧格勒）、基日島的木結構教堂、克里姆林宮與紅場位於今俄羅斯境內。俄羅斯截至2022年共有30項世界遺產，其中奧涅加湖和白海的岩刻2021年最新入選。另有28項遺產入選預備名單。入選項目分19項文化遺產和11項自然遺產，四項是跨國項目。庫爾斯沙嘴與立陶宛共享，達烏爾斯基自然保護區和烏布蘇盆地與蒙古共有，斯特魯維測地弧與歐洲九國分享。');
                                                            articles.push('紐約市是美國最大的城市，坐落著6,486棟竣工高層建築物，其中有113座高度超過600英尺（183公尺）。這些高樓集中在曼哈頓中城和下城區域，曼哈頓的其他區域以及布魯克林、皇后區、布朗克斯的行政區也有一定數量的高層建築。紐約市最高的建築是世界貿易中心一號大樓，高度1,776英尺（541公尺）。這棟104層高的摩天大樓同時也是美國最高、西半球最高、世界第六高的建築。坐落於曼哈頓中城的帝國大廈，建於1931年，在其建成之後直到1972年原世界貿易中心110層高的北樓完工，曾一直保有世界上最高建築的桂冠。世界貿易中心世界第一高的稱號並沒有保留很久，1974年位於芝加哥108層高的西爾斯大樓完工後趕超了它。');
                                                            articles.push('世界遺產是由聯合國教科文組織管理，世界遺產委員會依據《保護世界文化和自然遺產公約》決議通過的地標或區域，分為自然遺產、文化遺產，以及兼具兩者的複合遺產。被列入世界遺產的地點，必須對全世界人類都具有「突出的普世價值」，在地理或歷史上具有可辨識與特殊的意義。世界遺產始於1972年11月16日聯合國教科文組織大會通過，1975年12月17日生效的《保護世界文化和自然遺產公約》。');
                                                            articles.push('儒家，又稱儒學、孔孟思想、孔儒思想，諸子百家及九流十家之一，是一種起源於中國並同時影響及流傳至其他周遭東亞地區國家的文化主流思想、哲理。公元前5世紀由孔子創立，脫胎自周朝禮樂傳統，以仁、恕、誠、孝為核心價值，著重君子的品德修養，強調仁與禮相輔相成，重視五倫與家族倫理，提倡教化和仁政，輕徭薄賦，抨擊暴政，力圖重建禮樂秩序，移風易俗，保國安民，富於入世理想與人文主義精神。「儒」, 「儒」字觀其形而知其意, 「儒」之尚義在於佐「人」於佑「需」也。大凡能俱備成為完美的人，其所有為人與處事之需, 皆為儒家所闡揚與信奉者。');
                                                            articles.push('儒家，又稱儒學、孔孟思想、孔儒思想，諸子百家及九流十家之一，是一種起源於中國並同時影響及流傳至其他周遭東亞地區國家的文化主流思想、哲理。公元前5世紀由孔子創立，脫胎自周朝禮樂傳統，以仁、恕、誠、孝為核心價值，著重君子的品德修養，強調仁與禮相輔相成，重視五倫與家族倫理，提倡教化和仁政，輕徭薄賦，抨擊暴政，力圖重建禮樂秩序，移風易俗，保國安民，富於入世理想與人文主義精神。「儒」, 「儒」字觀其形而知其意, 「儒」之尚義在於佐「人」於佑「需」也。大凡能俱備成為完美的人，其所有為人與處事之需, 皆為儒家所闡揚與信奉者。');
                                                
                                                            var parsed = parseInt($.trim(this.value));
                                                            
                                                            if(isNaN(parsed))
                                                                return;                                                                                                                                                        
                                                            if(parsed+1 > articles.length){
                                                                alert('alticles.lenth='+articles.length);
                                                                return;
                                                            }
                                                            
                                                            $('#exam_paste_area').val(articles[parsed]);
                                                            wpmtw.exam.editor.do_submit();
                                                            
                                                            
                                                        }

		});
	}



};
