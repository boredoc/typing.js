// wpm.tw
// wpm.tw
// wpm.tw
// yh kao cow315@gmail.com
wpmtw.exam = {
	ver: '0.1',
	ajax_page: '',
	title: '',
	owner: {
		'id': 0,
		'account': ''
	},
	total_words: 0,
	full: 0,
	half: 0,
	line_count: 0
};


/************************************************************
 *																														*
 * WPM.TW  Preview										
 *																														*	
 ************************************************************/

wpmtw.exam.preview = {
	ver: '0.1',
	init: function() {

		if (wpmtw.exam.line_count >= 20) {
			$('#exam_preview').height(455);
		}

		$(".sort_table").tablesorter({ // sort on the first column and third column, order asc         
			headers: {
				6: {
					sorter: false
				}
			}
		});

		/*$('#exam_info').html(	'建立者:' + wpmtw.exam.owner.account +'<BR>'+
											'字元:'+wpmtw.exam.total_words+'<BR>'+
											'全形:'+wpmtw.exam.full+'<BR>'+
											'半形:'+wpmtw.exam.half); */
	}
}




/************************************************************
 *																														*
 *WPM.TW	PLAY															*
 *																														*	
 ************************************************************/

wpmtw.exam.play = {

	ajax_page: '',
	ver: '0.1',
                    countdown: 5, //倒數幾秒
	login_data: new Object(),
	title: '',
	url: '',
	id: 0,
	total_line: 0,
	title_index: 0,
	current_line: 0,
	total_words: 0,
	temp_input_words: 0,
	is_start: false,
	start_time: -1,
	is_finish: false,
	finish_time: -1,
	real_time_wpm: 0,
	real_time_progress: 0,
	gaugeSpeed: {},
	gaugeProgress: {},
	max_wpm: 0,
	esc: 0,
	state: new Array(),
	line: new Array(),
	chk_line: new Array(),
                    current_char: '', 
                    current_char_num: -1, 
                    current_char_special: false,
                    hash: '', 
	score: {
		avgwpm: 0,
		maxwpm: 0,
		time: 0,
		total_c: 0,
		input_c: 0,
		correct_c: 0,
		wrong_c: 0,
		complete_p: 0,
		correct_p: 0,
		wrong_p: 0,
		final: 0
	},


	preview: function() {
		wpmtw.go_to(wpmtw.exam.play.url + '/' + wpmtw.exam.play.id + '/preview');
	},
	start: function(i) {
		//console.log(wpmtw.exam.play.gauge.value);
		//wpmtw.exam.play.gauge.value *= 1.2
//                                        $('.wpm_symbol').css('display', 'block');

    
		with(wpmtw.exam.play) {
			$('#past_line' + (title_index)).html("&nbsp;");
                                                      
			if (i == 0) {
                                                                                
                                                                                //hash = MD5();
				$("#state-counter").html('開始!!!'); 
				$("#state-counter").css('margin', '3px');
				$("#state-realtime_wpm").css('margin', '3px');
				$("#state-progress").css('margin', '3px');


				//$('#line0').html('<span class=current_char>' + htmlspecialchars(line[0].charAt(0)) + '</span>' + htmlspecialchars(line[0].substr(1, line[0].length)));
				//$('#line0').html('dwwwd<span class=current_char>CX' + (line[0].charAt(0)) + '</span>' + htmlspecialchars(line[0].substr(1, line[0].length)));
                                               

				$("#keyin").val('');
				$("#keyin").css('color', '#222').css('font-weight', 'normal');;
				$("#keyin").attr('readonly', false).attr('focus', true);
				is_start = true;
				start_time = new Date().getTime();
				add_log("start:" + start_time);

                                                                                check(current_line);
				chk_line[0]["start"] = start_time;


				$('#line1').css('color', '#444');
				$('#line2').css('color', '#666');
				$('#line3').css('color', '#888');
				for (i = 4; i < line.length; i++) {
					$('#line' + i).css('color', '#AAA');
				}



				$("#state-counter").everyTime(1000, function(i) {
					if (!is_finish)
						$(this).html(' 計 時： ' + ((new Date().getTime() - start_time) / 1000).toFixed(0));
				});

				$("#state-progress").everyTime(500, function(i) {
					if (!is_finish) {
						real_time_progress = temp_input_words + chk_line[current_line]['total'];
						real_time_progress /= total_words;
						real_time_progress *= 100;
						if (real_time_progress < 0) real_time_progress = 0;
						$(this).html('  進&nbsp&nbsp度： ' + real_time_progress.toFixed(0) + '%');
					}
				});

				$("#state-realtime_wpm").everyTime(200, function(i) {
					if (!is_finish) {
						if (chk_line[current_line]['correct'] > 0) {
							//  每一行正確的字除每一行花費的時間
							real_time_wpm = chk_line[current_line]['correct'] / ((new Date().getTime() - chk_line[current_line]['start']) / 1000 / 60);
						} else {
							real_time_wpm *= 0.6;
						}
						if (real_time_wpm > max_wpm) max_wpm = real_time_wpm;
						real_time_wpm = real_time_wpm.toFixed(2);
						$(this).html('WPM： ' + real_time_wpm);
//                                                                                                                        $('.wpm_symbol').html(real_time_wpm);
					} else {
						$(this).html('WPM： ' +max_wpm.toFixed(2) + "<span class=s>(max)</span>");
					}

				});

				wpmtw.exam.play.gaugeRefresh();
				$("#state-counter").css('text-align', 'left').css('font-size', 14);

			} else { 
				$("#keyin").attr('readonly', true);
				$("#keyin").val(i);
				$("#state-counter").css('text-align', 'center').css('font-size', 40).html(i);
				$('#exam').scrollTo('50%', 1000, {
					easing: 'elasout'
				});
				setTimeout("wpmtw.exam.play.start(" + (i - 1) + ")", 1000);
			}


		}
	},

	gaugeRefresh: function() {
		if (!wpmtw.exam.play.is_finish)
			wpmtw.exam.play.gaugeSpeed.value = wpmtw.exam.play.real_time_wpm;
		else
			wpmtw.exam.play.gaugeSpeed.value = wpmtw.exam.play.max_wpm;
		wpmtw.exam.play.gaugeProgress.value = wpmtw.exam.play.real_time_progress;

		//if(!wpmtw.exam.play.is_finish)
		setTimeout('wpmtw.exam.play.gaugeRefresh()', 500);
	},


	finish: function() {
		with(wpmtw.exam.play) {
			if (!is_start || is_finish) return false;

			//$('#exam').jScrollPaneRemove();
			//$('body').css('overflow','auto');

			$('#exam_boder').css('margin-top', '10px');
			//$.scrollTo( "#status" );	
			//alert('pause press')	

			for (i = 8; i < line.length; i++) {
				$('#line' + i).hide();
			}

			$('#keyinline').hide();


			$('#exam').css('overflow', 'auto');
			//$('#exam').height( $(document).height() - 200 );
			$('#exam').height(550);
			$('#exam').scrollTo('0%', 1000, {
				easing: 'elasout'
			});
			//$('#exam')[0].scrollTo('0%' , 1500 ,{ easing:'elasout'});
			//$('#exam').height(  ((line.length + 30 ) * $('#past_line1').height() ) );
			//$('#exam_boder').css('margin-bottom','50px') ;

			//$('#state-counter').html($('#state-counter').html()+"(秒)");

			chk_line[current_line]["finish"] = new Date().getTime();

			//$('#exam')[0].scrollTo(0);
			$("#keyin").attr('disabled', true);
			$("#keyin").hide();
			is_finish = true;


			finish_time = new Date().getTime();
			add_log("finish:" + finish_time);

			for (i = 0; i < chk_line.length; i++) {
				$('#past_line' + i).html(chk_line[i]['line']);
				$('#line' + i).html("&nbsp;");
			}

			for (i = chk_line.length; i < total_line; i++) {
				$('#past_line' + i).html('&nbsp;');
			}

			cal_score();


			//setTimeout("$.scrollTo( '100%' , 1500 ,{ easing:'elasout'} );",1500);
			setTimeout("$('#exam').scrollTo( '100%' , 1000 , {easing:'elasout'}  );", 1500);
		}
	},

	cal_score: function() {
		with(wpmtw.exam.play) {
			//during = finish_time - start_time ;
			//add_log("during:"+during);
			score.time = finish_time - start_time;
			//score.total_c 	= 0 ;
			score.input_c = 0;
			score.correct_c = 0;
			score.wrong_c = 0;
			score.final = 0;

			for (i = 0; i < chk_line.length; i++) {
				//score.total_c+=line[i].length;
				if (chk_line[i]['total'] > 0) {
					during = chk_line[i]['finish'] - chk_line[i]['start'];
					//total_time += during

					score.input_c += chk_line[i]['total'];
					score.correct_c += chk_line[i]['correct'];
					score.wrong_c += chk_line[i]['wrong'];

					//add_log( "line"+i+":");
					//add_log( "\tstart="+chk_line[i]['start']);
					//add_log( "\tfinish="+chk_line[i]['finish']);
					//add_log( "\ttotal="+chk_line[i]['total']);

					if (chk_line[i]['correct'] > 0) {
						score.correct_p = (chk_line[i]['correct'] / chk_line[i]['total']) * 100;
						score.correct_p = score.correct_p.toFixed(0);
					}
					chk_line[i]['correct_p'] = score.correct_p;
					//add_log( "\tcorrect="+chk_line[i]['correct'] + " ("+score.correct_p+"%)");

					score.wrong_p = 100 - score.correct_p;

					//add_log( "\twrong="+chk_line[i]['wrong'] + " ("+score.wrong_p+"%)");


					wpm = 0;
					if (chk_line[i]['correct'] > 0) {
						wpm = chk_line[i]['correct'] / (during / 1000 / 60);
					}
					//add_log( "\twpm="+wpm.toFixed(3));

				}
			}

			//wpm=0;
			if (score.correct_c > 0) {
				score.avgwpm = score.correct_c / (score.time / 1000 / 60);
			}
			score.avgwpm = score.avgwpm.toFixed(3)
			score.maxwpm = max_wpm.toFixed(3)
			score.correct_p = 0;
			if (score.correct_c > 0) {
				score.correct_p = (score.correct_c / score.input_c) * 100;
				score.correct_p = score.correct_p.toFixed(0);
			}
			score.wrong_p = 100 - score.correct_p;

			score.complete_p = (score.input_c / score.total_c) * 100;
			score.complete_p = score.complete_p.toFixed(0);
                                                            add_log("complete_p=(" + score.input_c + "/" + score.total_c +")* 100");

                                                            //final = ( (avg_wpm 8成 + max_wpm ２成) * 正確字元 * 0.01 ) *  正確率
			score.final = (score.avgwpm * 0.8 + score.maxwpm * 0.2) * (score.correct_c) * 0.01 ;
                                                            score.final *= score.correct_p / 100;
                                                            if(score.complete_p == 100) // 完打加分
                                                            {  
                                                                score.final *= 1.1;
                                                            }
			score.final = score.final.toFixed(0);


			score.time = (score.time / 1000);

			$("#state-counter").html(' 計 時： ' + score.time.toFixed(0) + '<span class=s>秒</span>');

			score.time = score.time.toFixed(3);



			$('.line').css('color', '#555');
			$('.correct').css('text-decoration', 'none').css('color', '#006600').css('font-weight', 'bolder');
			$('.wrong').css('text-decoration', 'underline').css('font-weight', 'bolder');

			$('#line1').html("&nbsp;&nbsp;平均WPM：<span class=score>" + score.avgwpm + "</span>，最高WPM：<span class=score>" + score.maxwpm + "</span>，總使用時間：<span class=score>" + (score.time) + '</span>(秒)').css('color', 'black');
			$('#line2').html("&nbsp;&nbsp;輸入字元：<span class=score>" + score.input_c + "</span>，正確字元：<span class=score>" + score.correct_c + "</span>，錯誤字元：<span class=score>" + score.wrong_c + "</span>").css('color', 'black');
			$('#line3').html("&nbsp;&nbsp;完成度：<span class=score>" + score.complete_p + "%</span>，正確率：<span class=score>" + score.correct_p + "%</span>，失誤率：<span class=score>" + score.wrong_p + "%</span>").css('color', 'black');
			$('#line4').html("&nbsp;&nbsp;分數：<span class=score>" + score.final + "</span>").css('color', 'black');
			$('#line5').html("<a href='javascript:wpmtw.exam.play.save_score();' title='save score'>儲存成績</a>&nbsp;&nbsp;<a href='javascript:wpmtw.exam.play.play_again();' title='play again'>再打一次</a>").css('text-align', 'center');

			// update_temp_score 
			$.ajax({
				type: "POST",
				url: wpmtw.exam.ajax_page + '/update_temp_score',
				data: $.param(score, true) + '&exam_id=' + id + '&exam_title=' + title,
				cache: false,
				success: function(msg) {

				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert("Error: " + textStatus);
				}
			});



			//	add_log( "wpm:"+wpm.toFixed(3)); 
			//	add_log( "輸入字元:"+total ); 
			//	add_log( "正確字元:"+correct );
			//	add_log( "錯誤字元:"+wrong );
			//	add_log( "正確率:"+correct_p + "% 失誤率:"+wrong_p + "%");
		}
	},

	play_again: function() {
		document.location.reload(true);
	},

	add_log: function(msg) {
                        if(!wpmtw.debug) return;
		$('#debug').val($('#debug').val() + msg + "\n");
	},

	enter: function() {
                                        $('.return_symbol').css('display', 'none');
                                        //check(current_line);
		with(wpmtw.exam.play) {
			if (!is_start || is_finish) return false;
			$('#rs' + current_line).hide();

			if (current_line == line.length - 1) {
				return finish();
			} else {
				//var s = ( line.length * 2  ) * 20 - 350  
				//$('#exam')[0].scrollTo(s/4+ line.length * 13);
				$('#exam').scrollTo("50%");

				chk_line[current_line]["finish"] = new Date().getTime();
				chk_line[current_line + 1]["start"] = new Date().getTime();

			}

			temp_input_words += chk_line[current_line]["total"];


			$("#keyin").val('');


			for (i = 0; i < total_line; i++) {
				next = (i != total_line - 1) ? $('#past_line' + (i + 1)).html() : $('#line0').html();
				$('#past_line' + i).html(next);
			}
			for (i = 0; i < line.length; i++) {
				next = (i == line.length - 1) ? '&nbsp;' : $('#line' + (i + 1)).html();
				if (i == 0)
					$('#line0').html('<span class=current_char>' + next.charAt(0) + '</span>' + next.substr(1, next.length));
				else
					$('#line' + i).html(next);
			}



			current_line++;

                                                            check(current_line);
			$("#keyin").attr('maxlength', unhtmlspecialchars(line[current_line]).length);
		}
	},


	check: function(j) {
		with(wpmtw.exam.play) {

			if (!is_start || is_finish) return false;


			var input = $('#keyin').val();

			if (input.length > 0) {
				if (input.charAt(0) == '　' || input.charAt(input.length - 1) == '　') {
					return;
				}
			}

                                                            add_log("line="+line[j]);
                                                            var decodeLine = unhtmlspecialchars(line[j]);
                                                            add_log("decodeLine="+decodeLine);
			var len = decodeLine.length;// line[j].length;

			var result = '',
				result2 = '',
				char = '',
				char2 = '';

			var total = 0,
				correct = 0,
				wrong = 0; 
			var current_flag = false;
			for (i = 0; i <= len; i++) {
				if (i < input.length) {  
					if (decodeLine.charAt(i) != input.charAt(i)) { //wrong
						char = htmlspecialchars(input.charAt(i));
						char2 = htmlspecialchars(decodeLine.charAt(i));
						result += '<span class="wrong" title="' + char + '">' + char2 + '</span>';
						if ($.trim(input.charAt(i)) != '')
							wrong++;
					} else { //correct
						char = htmlspecialchars(decodeLine.charAt(i));
						result += '<span class="correct">' + char + '</span>';
						if ($.trim(input.charAt(i)) != '')
							correct++;
					}

					if ($.trim(input.charAt(i)) != '')
						total++;
				} else {  
					char = htmlspecialchars(decodeLine.charAt(i)); 
                                        
					if (!current_flag) {
						result += '<span class="current_char">' + char + '</span>';
						current_flag = true;
                                                                                                                        current_char = char;
                                                                                               
					} else {
						result += char;
					}
				}
			}

			//	if(correct>0)
			//	{
			//		real_time_wpm = correct / ( ( new Date().getTime() - chk_line[j]['start'] ) / 1000 / 60 );  
			//		if(real_time_wpm > max_wpm) max_wpm = real_time_wpm;
			//		real_time_wpm = real_time_wpm.toFixed(3);
			//		
			//	}	
			//result+=" <div class='line_wpm'>("+wpm+")</div>"

			chk_line[j]['line'] = result;
			chk_line[j]['total'] = total;
			chk_line[j]['correct'] = correct;
			chk_line[j]['wrong'] = wrong;

                                                            var showReturn = false;
                                                            var decodeCurLine = unhtmlspecialchars(line[current_line]);
			if ($("#keyin").val().length == decodeCurLine.length) {
				// enter
                                                                                showReturn = true;
//                                                                                    var rc = caretXY(document.getElementById('keyin'));
//                                                                                    
//                                                                                    $('.return_symbol').css('top', rc.top - 50).css('left', rc.left - 920);
                                                                                    
                                                                                   
                                                                                //$('.return_symbol').css('display', 'block');
				//result += ' <span id="rs' + j + '" class="return_symbol">&nbsp⏎&nbsp</span>';
				//							if(wrong==0) 
				//								result+=' <span id="ss'+j+'" class="score_symbol">&#10004;&#10004;&#10004;</span>';
				//							else
				//							{
				//								rate = correct / total;	
				//								if(rate > 0.9)
				//									result+=' <span id="ss'+j+'" class="score_symbol">&nbsp;&nbsp;&#10004;&nbsp;&#10004;&nbsp;&nbsp;</span>' ;
				//								else if(rate > 0.8)
				//									result+=' <span id="ss'+j+'" class="score_symbol">&nbsp;&nbsp;&nbsp;&nbsp;&#10004;&nbsp;&nbsp;&nbsp;&nbsp;</span>' ;
				//								else if(rate > 0.7)
				//									result+=' <span id="ss'+j+'" class="score_symbol">&nbsp;&nbsp;&nbsp;&nbsp;&#10006;&nbsp;&nbsp;&nbsp;&nbsp;</span>' ;
				//								else if(rate > 0.6)
				//									result+=' <span id="ss'+j+'" class="score_symbol">&nbsp;&nbsp;&#10006;&nbsp;&nbsp;&#10006;&nbsp;&nbsp;</span>' ;
				//								else
				//									result+=' <span id="ss'+j+'" class="score_symbol">&#10006;&#10006;&#10006;</span>' ;
				//							}
			}else {
                                                                    showReturn = false;
//                                                                    $('.return_symbol').css('display', 'none');
                                                            }
                            
                            
                                                            add_log("result="+result);

			$('#line0').html(result);
                        
                                                            if(showReturn)
                                                            {
                                                                $('#char').html( '<div style="font-size:120px; margin-top:-40px;" class=yellow>⏎</div>');
                                                                return;
                                                            }

                                                            current_char_num = current_char.charCodeAt(0);
                                                            if(current_char_num == 32)
                                                                $('#char').html( '<span  style="font-size:45px;">空白</span><br><span class=red style="font-size:12px;">' + pad(current_char_num.toString(16).toUpperCase(), 4)  + '</span>');
                                                            else
                                                                $('#char').html( '<span  style="font-size:45px;">' + current_char +'</span><br><span class=red style="font-size:12px;">U+' + pad(current_char_num.toString(16).toUpperCase(), 4) + '</span>');
                                                    
                                                            current_char_special = false;   
                                                            if(current_char.match(/[^\x00-\xff]/g)) 
                                                            {
                                                                if(current_char.match(/[\u4e00-\u9fa5]/g))
                                                                {
                                                                    $('#char').html($('#char').html() +'<br><span class=green>中文</sapn>');
                                                                }
                                                                else if(current_char.match(/[\u3131-\uD79D]/g))
                                                                {
                                                                    $('#char').html($('#char').html() +'<br><span class=green>韓文</sapn>');
                                                                }
                                                                else if(current_char.match(/[\u0800-\u4e00]/g))
                                                                {
                                                                    if(current_char_num >= 12288 && current_char_num <= 12319) 
                                                                    {
                                                                        current_char_special = true;
                                                                        $('#char').html($('#char').html() +'<br><span class=yellow>全形符號</span>');
                                                                    }
                                                                    else
                                                                    {
                                                                        $('#char').html($('#char').html() +'<br><span class=green>日文</sapn>');
                                                                    }
                                                                }
                                                                else
                                                                {
                                                                        current_char_special = true;
                                                                    $('#char').html($('#char').html() +'<br><span class=yellow>全形符號</span>');
                                                                }
                                                            }
                                                             
		}
	},

                    pad: function(n, width, z) {
                      z = z || '0';
                      n = n + '';
                      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
                    },
	htmlspecialchars: function(ch) {
                        if (ch===null) return '';
                        ch = ch.replace(/&/g, "&amp;");
                        ch = ch.replace(/\"/g, "&quot;");
                        ch = ch.replace(/\'/g, "&#039;");
                        ch = ch.replace(/</g, "&lt;");
                        ch = ch.replace(/>/g, "&gt;");
                        return ch;
	},
                    unhtmlspecialchars: function(ch) {
                        if (ch===null) return '';
                        ch = ch.replace(/&amp;/g, "&");
                        ch = ch.replace(/&quot;/g, "\"");
                        ch = ch.replace(/&#039;/g, "\'");
                        ch = ch.replace(/&lt;/g, "<");
                        ch = ch.replace(/&gt;/g, ">");
                        return ch;
                     },

	init: function() {

		/*				$('#exam_info').html(	'建立者:' + wpmtw.exam.owner.account +'<BR>'+
											 				'字元:'+wpmtw.exam.total_words+'<BR>'+
											 			 	'全形:'+wpmtw.exam.full+'<BR>'+
															'半形:'+wpmtw.exam.half); */


		with(wpmtw.exam.play) {

			gaugeSpeed = new RadialGauge({
				renderTo: 'speed_gauge',
				width: 170,
				height: 170,
				units: 'WPM',
				minValue: 0,
				maxValue: 180,
				exactTicks: true,
				borders: false,
				animatedValue: true,
				animateOnInit: true,
				// progress bar
				barWidth: 5, // percents
				barStrokeWidth: 0, // pixels
				barProgress: true,
				barShadow: 0,
				colorBarProgress: '#ff8282',
				// borders
				borderOuterWidth: 0,
				borderMiddleWidth: 0,
				borderInnerWidth: 0,
				borderShadowWidth: 0,
				highlights: [{
						from: 50,
						to: 80,
						color: '#eee'
					},
					{
						from: 80,
						to: 140,
						color: '#ccc'
					},
					{
						from: 140,
						to: 180,
						color: '#999'
					}
				],
				majorTicks: [
					'0', '20', '40', '60', '80', '100', '120', '140', '160', '180'
				]
			}).draw();


			gaugeProgress = new LinearGauge({
				renderTo: 'progress_gauge',
				width: 170,
				height: 40,
				minValue: 0,
				maxValue: 100,
				borders: false,
				strokeTicks: true,
				minorTicks: 2,
				colorPlate: "#fff",
				borderShadowWidth: 0,
				borders: false,
				highlights: false,
				barBeginCircle: false,
				tickSide: "left",
				numberSide: "left",
				needleSide: "left",
				needleType: "line",
				needleWidth: 3,
				colorNeedle: "#222",
				colorNeedleEnd: "#222",
				animationDuration: 1500,
				animationRule: "linear",
				animationTarget: "plate",
				barWidth: 10,
				barBeginCircle: false,
				colorBarProgress: '#ff8282'
			}).draw();


                                                            $('#speed_gauge').removeClass('hide');
                                                            $('#progress_gauge').removeClass('hide');

			for (i = 0; i < line.length; i++) {
				total_words += unhtmlspecialchars(line[i]).length;
				chk_line[i] = new Object();
				chk_line[i]["line"] = line[i];
				chk_line[i]["total"] = -1;
				chk_line[i]["correct"] = -1;
				chk_line[i]["correct_p"] = -1;
				chk_line[i]["wrong"] = -1;
				chk_line[i]["wrong_p"] = -1;
				chk_line[i]["start"] = -1;
				chk_line[i]["finish"] = -1;
			}


			$('#debug').val("");
			//$('#debug').hide();
			$("#keyin").attr('readonly', false);
			//alert($(window).height())

			$("table").height($(window).height());
			$("#exam").height(405);

			$(window).resize(function() {
				$("table").height($(window).height());
				//$("#exam").height( $(window).height() / 2.5);
			});


			$("#keyin").focus(function(e) {
				if (!is_start) {
					//$('#exam_status').html(	'<span id="count"></span><br /> <span id="realtime_wpm"></span><br /> <span id="progress"></span>' );
					start(countdown);
				}
			});

			// keyin shift 
			if (!$.browser.msie) {
				$('#keyin').css('margin', '-1px');
			}


			if ($.browser.mozilla) { // firefox

				// IME process
				$('#keyin').bind('text', function(e) {

					if (e.which == 19) // Pause
					{
						//if(++esc==2) 
						finish();
					}

					check(current_line);

					if (e.which == 13) // enter
					{
                                                                                                        
						if ($("#keyin").val().length == unhtmlspecialchars(line[current_line]).length)
							return enter();
                                                                                                                        
					}

					//$('#debug').val(jQuery.trim($("#keyin").val()))



					//console.log($(this).val());
				});

				// nonIME process
				$("#keyin").keydown(function(e) {
					if (e.which == 19) // Pause
					{
						//if(++esc==2) 
						finish();
					}

					check(current_line);

					if (e.which == 13) // enter
					{
						if ($("#keyin").val().length == unhtmlspecialchars(line[current_line]).length)
						{	
                                                                                                                                    enter();
                                                                                                                                    $('.return_symbol').css('border', 'outset 1px');
                                                                                                                        }
					}

					//$('#debug').val(jQuery.trim($("#keyin").val()))
                                                               

				});


			} else { // ie or chrome
				$("#keyin").keyup(function(e) {
                                    
//                                                                                        var rc = caretXY(document.getElementById('keyin'));
//
//                                                                                       $('.wpm_symbol').css('top', rc.top - 20).css('left', rc.left - 920);
                                                                                     

					if (e.which == 19) // Pause
					{
						//if(++esc==2) 
						finish();
					}

					check(current_line);
                                        
                                                                                             

				//});
				//$("#keyin").keydown(function(e) {

				 
					if (e.which == 13) // enter
					{
                                                                                                        if ($("#keyin").val().length == unhtmlspecialchars(line[current_line]).length)
                                                                                                        {	
                                                                                                            enter();
                                                                                                            $('.return_symbol').css('border', 'outset 1px');
                                                                                                        }
					}
//                                                                                    if(e.which == 9) // tab
//                                                                                    {
//                                                                                        $("#keyin").val($("#keyin").val() + current_char);
//                                                                                        check(current_line);
//                                                                                        return false;
//                                                                                    }

				});



			}
                        
                                                            $('#test-area .line').keydown(function(e) {

				if (e.which == 13) // enter
				{
                                                                                    l =  eval($(this).attr('l')); 
                                                                                    $('#test-area .line:eq(' + l + ')').focus(); 
				}

			});

			$("#keyin").keydown(function(e) {
                                                          
                                                                                                      
//                                                                                        var rc = caretXY(document.getElementById('keyin'));
//
//                                                                                       $('.wpm_symbol').css('top', rc.top - 20).css('left', rc.left - 920);
                                                                                                      
				if (e.which == 13) // enter
				{  
                                                                                        $('.return_symbol').css('border', 'inset 1px');
                                                                                        $('#char div').css('margin-top', '-35px').css('margin-left', '2px');
				}
                                
                                                                                if(e.which == 9) // tab
                                                                                { 
                                                                                    //console.log('tab pressed') 
                                                                                    if($("#keyin").val()=='')check(current_line);
                                                                                    if(current_char_special)
                                                                                    {
                                                                                        $("#keyin").val($("#keyin").val() + current_char);
                                                                                        check(current_line);
                                                                                    }
                                                                                    return false;
                                                                                }

			});


			$("#keyin").val('點選' + countdown + '秒後開始... (若想終止請按Pause/Break鍵, 跳過全形符號請按Tab鍵)').css('color', 'red').css('font-weight', 'bolder');

			$("#keyin").attr('maxlength', unhtmlspecialchars(line[0]).length);

			for (i = 0; i < line.length; i++) {
				$('#line' + i).html(line[i]);
			}

			//$('#exam').jScrollPane({animateTo:true, animateInterval:50, animateStep:5});

			//var s = ( line.length * 2  ) * 20 - 350  
			//$('#exam')[0].scrollTo(s/4+ line.length * 13);

			//$('body').css('overflow','hidden');
			//$('#exam').css('overflow','auto');


			total_line = (line.length < 6) ? 6 : line.length;

			title_index = (line.length < 6) ? 4 : line.length - 3;

			$('#past_line' + (title_index)).html("<center><!--<B>" + title + "</B> --><a href='javascript:wpmtw.exam.play.preview();'  class='' title='preview'>預覽全文</a></center>");

			$('#past_line' + (title_index) + ' a').tooltip({
				track: true,
				delay: 0,
				showURL: false,
				showBody: " - ",
				fade: 250
			});

			setTimeout("$('#exam').scrollTo( '50%' , 1000 , {easing:'elasout'}  );", 300);
			setTimeout("$('#exam').scrollTo( '50%' );", 2000);
		}


	},

	save_score: function() {
		wpmtw.go_to(wpmtw.url + 'exam/save_score');

	},
        
        
                    preInit : function(total_words, full, half, exam_lines){
                            console.log('preInit...');
                            //wpmtw.exam.ajax_page = "<?=site_url('exam/ajax');?>";
                            //wpmtw.exam.title = '<?=addslashes(htmlspecialchars($exam_title))?>'; 
                            //wpmtw.exam.play.title = '<?=addslashes(htmlspecialchars($exam_title))?>'; 
                            wpmtw.exam.play.score.total_c = total_words ; 
                            //<? for($i=0;$i<$line_count;$i++) : ?>
                            //wpmtw.exam.play.line[<?=$i?>] = '<?=addslashes(htmlspecialchars($exam_lines[$i]))?>';
                            //<? endfor ; ?> 
                            
                            for(i=0; i < exam_lines.length; i++)
                            { 
                                console.log(exam_lines[i]);
                                wpmtw.exam.play.line[i] = exam_lines[i];
                                
                            }
                            
                            //wpmtw.exam.play.url = "<?=site_url('exam');?>";
                            //wpmtw.exam.play.id  = <?=$id;?>; 
                            //wpmtw.exam.play.login_data = <?= json_encode($login_data) ?> ;

                            //wpmtw.exam.owner.account = '<?=$owner_account?>';
                            //wpmtw.exam.owner.id = <?=$owner_id?>;
                            wpmtw.exam.total_words = total_words;
                            wpmtw.exam.full = full;
                            wpmtw.exam.half = half; 

                            wpmtw.exam.play.init();

 
                        
                        
                    }


};




// canvas-gauges ie fix
if (!String.prototype.repeat) {
	String.prototype.repeat = function(count) {
		'use strict';
		if (this == null)
			throw new TypeError('can\'t convert ' + this + ' to object');

		var str = '' + this;
		// To convert string to integer.
		count = +count;
		// Check NaN
		if (count != count)
			count = 0;

		if (count < 0)
			throw new RangeError('repeat count must be non-negative');

		if (count == Infinity)
			throw new RangeError('repeat count must be less than infinity');

		count = Math.floor(count);
		if (str.length == 0 || count == 0)
			return '';

		// Ensuring count is a 31-bit integer allows us to heavily optimize the
		// main part. But anyway, most current (August 2014) browsers can't handle
		// strings 1 << 28 chars or longer, so:
		if (str.length * count >= 1 << 28)
			throw new RangeError('repeat count must not overflow maximum string size');

		var maxCount = str.length * count;
		count = Math.floor(Math.log(count) / Math.log(2));
		while (count) {
			str += str;
			count--;
		}
		str += str.substring(0, maxCount - str.length);
		return str;
	}
}



//caretXY 
 var root = document.documentElement;
var body = document.body;
var remToPixelRatio;
function toPixels(value, elementFontSize) {
    var pixels = parseFloat(value);
    if (value.indexOf('pt') !== -1) {
        pixels = pixels * 4 / 3;
    }
    else if (value.indexOf('mm') !== -1) {
        pixels = pixels * 96 / 25.4;
    }
    else if (value.indexOf('cm') !== -1) {
        pixels = pixels * 96 / 2.54;
    }
    else if (value.indexOf('in') !== -1) {
        pixels *= 96;
    }
    else if (value.indexOf('pc') !== -1) {
        pixels *= 16;
    }
    else if (value.indexOf('rem') !== -1) {
        if (!remToPixelRatio) {
            remToPixelRatio = parseFloat(getComputedStyle(root).fontSize);
        }
        pixels *= remToPixelRatio;
    }
    else if (value.indexOf('em') !== -1) {
        pixels = elementFontSize ? pixels * parseFloat(elementFontSize) : toPixels(pixels + 'rem', elementFontSize);
    }
    return pixels;
}
function lineHeightInPixels(lineHeight, elementFontSize) {
    return lineHeight === 'normal' ? 1.2 * parseInt(elementFontSize, 10) : toPixels(lineHeight, elementFontSize);
}
var mirrorAttributes = [
    'direction',
    'boxSizing',
    'width',
    'height',
    'overflowX',
    'overflowY',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderStyle',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',
    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration',
    'varterSpacing',
    'wordSpacing',
    'tabSize',
    'MozTabSize'
];
function getMirrorInfo(element, isInput) {
    if (element.mirrorInfo) {
        return element.mirrorInfo;
    }
    var div = document.createElement('div');
    var style = div.style;
    var computedStyles = getComputedStyle(element);
    var hidden = 'hidden';
    var focusOut = 'focusout';
    style.whiteSpace = 'pre-wrap';
    if (!isInput)
        style.wordWrap = 'break-word';
    style.position = 'absolute';
    style.visibility = hidden;
    mirrorAttributes.forEach(function (prop) { return style[prop] = computedStyles[prop]; });
    style.overflow = hidden;
    body.appendChild(div);
    element.mirrorInfo = { div: div, span: document.createElement('span'), computedStyles: computedStyles };
    element.addEventListener(focusOut, function cleanup() {
        delete element.mirrorInfo;
        body.removeChild(div);
        element.removeEventListener(focusOut, cleanup);
    });
    return element.mirrorInfo;
}
function caretXY(element, position) {
    if (position === void 0) { position = element.selectionEnd; }
    var isInput = element.nodeName.toLowerCase() === 'input';
    var _a = getMirrorInfo(element, isInput), div = _a.div, span = _a.span, computedStyles = _a.computedStyles;
    var content = element.value.substring(0, position);
    div.textContent = isInput ? content.replace(/\s/g, '\u00a0') : content;
    span.textContent = element.value.substring(position) || '.';
    div.appendChild(span);
    var rect = element.getBoundingClientRect();
    var top = span.offsetTop + parseInt(computedStyles.borderTopWidth) - element.scrollTop + rect.top;
    var left = span.offsetLeft + parseInt(computedStyles.borderLeftWidth) - element.scrollLeft + rect.left;
    var height = lineHeightInPixels(computedStyles.lineHeight, computedStyles.fontSize);
    return { top: top, left: left, height: height };
}
 