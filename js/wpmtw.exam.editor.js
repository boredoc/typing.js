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


	split: function() {

		with(wpmtw.exam.editor) {
			var txt = $.trim($('#exam_past_area').val());
			if (txt == '請輸入或直接貼上...' || txt == '') {
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
                                                                                                                        
						if (temp_line == '' && isBlank) {
                                                                                                                            continue;
						} 
                                                                                                                            
                                                                                                                            c += isHalf ? 0.5 : 1;
                                                                                                                            //c+=(temp_char_code<=128) ? 0.5  : 1; 
                                                                                                                            temp_line += temp_char;   
                                                                                                                            
                                                                                                                            if(isBlank)
                                                                                                                                _lastBlankIdx = _z +_remainIdx;
                                                                                                                            
                                                                                                                        if (c >= max_chars) {
                                                                                                                            console.log('c >= max_chars');                                                             

                                                                                                                              if(z < line.length-1)
                                                                                                                              {
                                                                                                                                  var _nextChar = line.charAt(z+1);
                                                                                                                                 console.log('_nextChar='+_nextChar);         
                                                                                                                                  if(_nextChar != 12288 && _nextChar != 32)
                                                                                                                                  {
                                                                                                                                    console.log('_lastBlankIdx=' + _lastBlankIdx);  
                                                                                                                                     remainStr = temp_line.substring(_lastBlankIdx);
                                                                                                                                     temp_line = temp_line.substring(0, _lastBlankIdx);
                                                                                                                                     console.log('remainStr='+remainStr);
                                                                                                                                  } 
                                                                                                                              }
                                                                                                                              
                                                                                                                              console.log('temp_line='+temp_line);
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
                                                                                                                              console.log('c='+c); 
                                                                                                                              _z = 0;
						}
                                                                                                        _z ++;
					} // end each char

					if (temp_line != '') lines.push(temp_line);

				}
			} // end each line 

			//$('#exam_preview').html(lines.join('<BR>'));
			html = '<div align=center><input type="text" id="title" class="inputline" style="width:300px;"  value="" maxlength="20" ></div>';
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

			$('#exam_past_area').hide();
			$('#exam_preview').show();

			$('#title').val(lines[0].substring(0, 20)).css('background-color', '#FFFFB0');
			$('#title').focus(function(e) {
				if ($('#title').val() == '請輸入標題') {
					$('#title').val('').css('color', '#222');
				}
			});
			$('#title').blur(function(e) {
				if ($('#title').val() == '請輸入標題' || $.trim($('#title').val()) == '') {
					$('#title').val('請輸入標題').css('color', '#555');
				}
			});
		}

	},


	add_log: function(msg) {
		$('#debug').val($('#debug').val() + msg + "\n");
	},
        
	do_submit: function() {

		with(wpmtw.exam.editor) {
			if ($('#exam_past_area').css('display') == 'none') {
				var title = $.trim($('#title').val());
				if (title == '請輸入標題' || title == '') {
					return alert('請輸入標題！');
				}
                                                                                if(!confirm('確定新增此文章？'))
                                                                                return;

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
				$('#f_title').val(title);
				$('#f_lines').val(exam.join('\n'));
				//alert($('#f_lines').val())
                                
                                                                                
                                                                                //$('#frm').submit();
                                                                                
                                                                                console.log(document.cookie);
                                                                                
				return false;
			}

			wpmtw.exam.editor.split();

		}

	},

	do_reset: function() {
		$('#exam_past_area').val('請輸入或直接貼上...');
		$('#exam_preview').html('');
		$('#exam_past_area').show();
		$('#exam_preview').hide();
	},


	init: function() {
		$('#exam_past_area').val('請輸入或直接貼上...');
		$('#exam_past_area').focus(function(e) {
			if ($('#exam_past_area').val() == '請輸入或直接貼上...') {
				$('#exam_past_area').val('');
			}
		});
		$('#exam_past_area').blur(function(e) {
			if ($('#exam_past_area').val() == '請輸入或直接貼上...' || $.trim($('#exam_past_area').val()) == '') {
				$('#exam_past_area').val('請輸入或直接貼上...');
			}
		});
	}



};
