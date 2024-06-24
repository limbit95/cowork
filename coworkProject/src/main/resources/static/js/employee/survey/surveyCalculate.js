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


let deleteBtnDiv = document.querySelector('#deleteBtnDiv');

deleteBtnDiv.addEventListener('click', function(){
	
	let result = confirm('삭제된 설문은 복구할 수 없습니다. 그래도 삭제하시겠습니까?');
	if(result){
		// 확인을 누른 경우 
		fetch("/survey/delete", {
		method : "POST",
		headers : {"Content-Type" : "application/json"},
		body : JSON.stringify({'surveyNo' : surveyNo})	// 단순 문자열 형태의 하나의 데이터만 보내는 경우.
		})
		.then(resp => resp.text())
		.then(result => {
			
			if(result == 0){
				alert('잘못된 접근입니다.');
			} else{
				alert('설문이 삭제되었습니다.');
				window.location.href ='/survey/mySurvey?currentPage=1';
			}
			
			
		})
	} else{
		
		// 취소를 누른 경우 
		return;
		
	}

})























