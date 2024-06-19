document.addEventListener("DOMContentLoaded", function() {
	setTimeout(function(){
		document.querySelectorAll('.gageBar').forEach(function(gageBar){
		let ratio = gageBar.getAttribute("data-ratio");
		//let ratio = gageBar.innerText;
		gageBar.style.width = ratio + "%";
		
		
		});
		
	}, 100);
	
	setTimeout(function(){
	let highlightSpan = document.querySelector('#highlight');
	highlightSpan.style.width = "100%";			
	}, 100);
	
	

	


});


