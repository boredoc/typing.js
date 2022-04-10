// wpm.tw
$.easing.elasout = function(x, t, b, c, d) {
						var s=1.70158;var p=0;var a=c;
						if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
						if (a < Math.abs(c)) { a=c; var s=p/4; }
						else var s = p/(2*Math.PI) * Math.asin (c/a);
						return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
					};		
					
var wpmtw = {
	
	url : '' ,
	index : '' , 
	user : { } ,
 	debug: false,
	go_root : function() {
				location.href = wpmtw.index ;	
			} ,
			
	go_to	: function(url) {
				location.href = url;	
			} , 
	toggle_temp_score	: function() {  $('#temp_score_area').slideToggle("fast"); },
	save_temp_score	:function() { 
				wpmtw.go_to(wpmtw.url+'exam/save_score'); 
			} ,
	init 	: function() { 
                                                                
                                                                if(wpmtw.debug)
                                                                    $('#debug').show();
                                                                else
                                                                    $('#debug').hide();
            
				$('a').tooltip({ 
					track: true, 
					delay: 0, 
					showURL: false, 
					showBody: " - ", 
					fade: 250 
				});
				
				$('span').tooltip({ 
					track: true, 
					delay: 0, 
					showURL: false, 
					showBody: " - ", 
					fade: 250 
				});
				
				$('tr').tooltip({ 
					track: true, 
					delay: 0, 
					showURL: false, 
					showBody: " - ", 
					fade: 250 
				});
				
				$('td').tooltip({ 
					track: true, 
					delay: 0, 
					showURL: false, 
					showBody: " - ", 
					fade: 250 
				}); 
				
				$('input').tooltip({ 
					track: true, 
					delay: 0, 
					showURL: false, 
					showBody: " - ", 
					fade: 250 
				});
				
				
				$('div').tooltip({ 
					track: true, 
					delay: 0, 
					showURL: false, 
					showBody: " - ", 
					fade: 250 
				});
			
			}
}


wpmtw.template = {
	normal	: true ,
	resize	: function()
			{ 
//				$('#right').width(160); 
//				$('#left').width(160); 
//				$('#center').width(660);
				//$('#content_title').html($().width());
//				if($().width()>950){    
//					$('#center').width($().width()-360);
//					if(!wpmtw.template.normal){
//						$('#left').after($('#center'));
//						wpmtw.template.normal = true ;
//					}
//				}else{
//					if(wpmtw.template.normal){
//						$('#center').after($('#left'));
//						wpmtw.template.normal = false ;
//					}
//				}
			} ,
	init	: function()
			{
//				wpmtw.template.resize();
//				$(window).resize(function(){
//					wpmtw.template.resize();			   
//				});	
			} 
}

//$(document).ready(function() {
//	wpmtw.template.init();					
//});