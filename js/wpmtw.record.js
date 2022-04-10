// wpm.tw record

wpmtw.record = { 
	init : function()
		{
//			$('#content').css('overflow','hidden');	
//			$('#content').height(120);
			$(".sort_table").tablesorter({         // sort on the first column and third column, order asc         
			 		headers: { 6 : { sorter: false } }
			}); 
			
			setTimeout("$('#rank_div').scrollTo( $('.mark') , 1000 , {easing:'elasout'}  );",1000)
			
			
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