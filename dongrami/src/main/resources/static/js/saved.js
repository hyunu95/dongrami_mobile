document.addEventListener('DOMContentLoaded', function() {
	const saveButton = document.getElementById('save-result');
	const userId = document.getElementById('userId').value;
	const webReadingId = parseInt(document.getElementById('webReadingId').value);
	const readingTitle = document.getElementById('reading1Title').value;
	const slackName = document.getElementById('subcategory_name').value;
	const subId = parseInt(document.getElementById('subcategoryId').value);
	const cardId = parseInt(document.getElementById('cardId').value);
	
/*	
	console.log("회원 ==> ", userId);
	console.log("해석 ==> ", webReadingId);
	console.log("타이틀 ===> ", readingTitle);
	console.log("소주제 ===> ", subId);
	console.log("카드 ===> ", cardId);
*/
	
	saveButton.addEventListener('click', function(e) {
		e.preventDefault();
		
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '/save';
		
		const input1 = document.createElement('input');
		input1.type = 'hidden';
		input1.name = 'userId';
		input1.value = userId;
		
		const input2 = document.createElement('input');
		input2.type = 'hidden';
		input2.name = 'webReadingId';
		input2.value = webReadingId;
		
		const input3 = document.createElement('input');
		input3.type = 'hidden';
		input3.name = 'readingTitle';
		input3.value = readingTitle;
		
		const input4 = document.createElement('input');
		input4.type = 'hidden';
		input4.name = 'slackName';
		input4.value = slackName;
		
		const input5 = document.createElement('input');
		input5.type = 'hidden';
		input5.name = 'subId';
		input5.value = subId;
		
		const input6 = document.createElement('input');
		input6.type = 'hidden';
		input6.name = 'cardId';
		input6.value = cardId;
		
		
	
		form.appendChild(input1);
		form.appendChild(input2);
		form.appendChild(input3);
		//form.appendChild(input4); //버블슬랙은 안 넣기
		form.appendChild(input5);
		form.appendChild(input6);
		
		document.body.appendChild(form);
		form.submit();
		
		
		
	})
	
	
	
	
})
