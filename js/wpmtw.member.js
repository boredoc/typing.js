// wpm.tw member
 
wpmtw.member = { 
	ajax_page 	: ''  ,
	re_email		:  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ,
	is_email		: function(str)
						{ 
							return wpmtw.member.re_email.test(str);
						}

} 

wpmtw.member.score_record = { 
	init : function()
		{
			$('#content').css('overflow','hidden');	
			$('#content').height(120);
		} ,
	more : function()
		{
			if($('#content').height()==120){
				$('#content').animate({"height": "+=250px"}, "slow");
			}else{
				$('#content').animate({"height": "-=250px"}, "slow");
			}
		} 
}

wpmtw.member.login = {
	
	redirect : '' ,
	
	init	: function()
			{ 
					$('#email').blur(function(){ 
						$('#email_notice').html('');  
						var email = $.trim($('#email').val()) ;
						if(email==''){
							$('#email_notice').html('請輸入 !');  
						}
						else if(!wpmtw.member.is_email(email)){
							$('#email_notice').html('不合格的email !');  
						}  
					});
					$('#email').after(' <span id="email_notice" class="notice s"></span>');
					$('#password').after(' <span id="password_notice" class="notice s"></span>'); 
					
					$('form').submit(function() {
						return wpmtw.member.login.check_from(); 
					});	
			},
				
	check_from	: function()
					{ 
						var err = 0;
						
						$('#email_notice').html(''); 
						$('#password_notice').html('');  
						
						var email = $.trim($('#email').val()) ;
						var password = $.trim($('#password').val()) ; 
						
						if(email==''){
							$('#email_notice').html('請輸入 !'); 
							err++;
						}
						else if(!wpmtw.member.is_email(email)){
							$('#email_notice').html('不合格的email !'); 
							err++;
						}  
						
						if(err>0){
							return false;
						}
						
						wpmtw.member.login.submit();
						
						return false;
					} ,
	submit		: function()
					{
					 
						$.ajax({
							   type: "POST",
							   url: wpmtw.member.ajax_page + '/login',
							   data:  $('form').serialize(),
							   cache: false,
							   success: function(msg){
								    if(msg!=''){
										$('div .line:eq(2)').css('color','red').attr('align','center').html(msg);
							   		}else{  
										$('#content div').html('&nbsp;');  
										$('div .line:eq(0)').addClass('notice').attr('align','center').html('登入成功～');
										
										if(wpmtw.member.login.redirect != '' ){ 
											$('div .line:eq(2)').attr('align','center').html('<a href="'+wpmtw.member.login.redirect+'">繼續</a>');										
											setTimeout('wpmtw.go_to("'+wpmtw.member.login.redirect+'");',2000) ;
										}else{
											$('div .line:eq(2)').attr('align','center').html('<a href="'+wpmtw.url+'">回到首頁</a>');										
											setTimeout('wpmtw.go_root();',2000);
										}
									}
										
							   },
							   error: function(XMLHttpRequest, textStatus, errorThrown){
									alert( "Error: " + textStatus );
							   }
						 }); 
						
					}

}

wpmtw.member.join = {
	
 
	init		: function()
				{ 
					
					$('#email').blur(function(){ 
						wpmtw.member.join.is_exist('email'); 
					});
					$('#password').blur(function(){
						wpmtw.member.join.chk_psw();
					});
					$('#cofirm_password').blur(function(){
						wpmtw.member.join.chk_psw();
					});
					$('#account').blur(function(){
						wpmtw.member.join.is_exist('account'); 
					});
					
					$('form').submit(function() {
					  return wpmtw.member.join.check_from(); 
					});
					
					$('#email').after(' <span id="email_notice" class="notice s"></span>');
					$('#password').after(' <span id="password_notice" class="notice s"></span>');
					$('#cofirm_password').after(' <span id="cofirm_password_notice" class="notice s"></span>');
					$('#account').after(' <span id="account_notice" class="notice s"></span>');
					
					 
				} ,
				
	check_from	: function()
					{ 
						var err = 0;
						
						$('#email_notice').html(''); 
						$('#password_notice').html(''); 
						$('#cofirm_password_notice').html(''); 
						$('#account_notice').html(''); 
						
						var email = $.trim($('#email').val()) ;
						var password = $.trim($('#password').val()) ;
						var cofirm_password = $.trim($('#cofirm_password').val()) ;
						var account = $.trim($('#account').val()) ;
						
						if(email==''){
							$('#email_notice').html('請輸入 !'); 
							err++;
						}
						else if(!wpmtw.member.is_email(email)){
							$('#email_notice').html('不合格的email !'); 
							err++;
						}
						
						err += wpmtw.member.join.chk_psw();
						
						if(account ==''){
							$('#account_notice').html('請輸入 !'); 
							err++;
						}
						
						if(err>0){
							return false;
						}
						
						wpmtw.member.join.insert();
						
						return false;
					} ,
					
	insert		: function()
					{  
						$.ajax({
							   type: "POST",
							   url: wpmtw.member.ajax_page + '/insert',
							   data:  $('form').serialize(),
							   cache: false,
							   success: function(msg){
								    if(msg!=''){
										$('div .line:eq(4)').addClass('notice').attr('align','center').html(msg);
							   		}else{
										$('div .line').html('&nbsp;');
										$('div .line:eq(2)').addClass('notice').attr('align','center').html('歡迎您的加入～');
										$('div .line:eq(4)').attr('align','center').html('<a href="javascript:wpmtw.go_root();">回到首頁</a>');
									}
										
							   },
							   error: function(XMLHttpRequest, textStatus, errorThrown){
									alert( "Error: " + textStatus );
							   }
						 }); 
						
					} ,
	
	chk_psw	: function()
					{
						$('#password_notice').html(''); 
						$('#cofirm_password_notice').html(''); 
						var password = $.trim($('#password').val()) ;
						var cofirm_password = $.trim($('#cofirm_password').val()) ;
						if(password==''){
							$('#password_notice').html('請輸入 !');  
							return 1;
						}
						if(password.length<4||password.length>8){
							$('#password_notice').html('密碼長度限制4~8個字元 !');  
							return 1;
						}
						if(cofirm_password!=''){
							if(password!=cofirm_password){
								$('#cofirm_password_notice').html('密碼錯認錯誤 !');  
								return 1;
							}
						}
					} ,
				
	is_exist	: function(col)
					{
						var val = $.trim($('#'+col).val()) ;
						$('#'+col+'_notice').html('');
						if(val==''){
							$('#'+col+'_notice').html('請輸入 !');
							return 0;
						}
						
						if(col=='email'){
							if(!wpmtw.member.is_email(val)){
								$('#email_notice').html('不合格的email !'); 
								return 0;
							}
						}
						
						$.ajax({
							   type: "POST",
							   url: wpmtw.member.ajax_page + '/is_exist',
							   data: "col="+col+"&val="+val,
							   cache: false,
							   success: function(msg){
											$('#'+col+'_notice').html(msg); 
							   },
							   error: function(XMLHttpRequest, textStatus, errorThrown){
								 alert( "Error: " + textStatus );
							   }
						 });
					} 
				



}; 


