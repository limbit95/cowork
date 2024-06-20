// 직책 추가 버튼 클릭 시
const addPosition = document.querySelector(".addPosition");

addPosition.addEventListener("click", () => {

    // 직책 추가 버튼 클릭 시 버튼 숨기기
    addPosition.classList.add("btnHidden");
    const addMiddlePosition = document.querySelector(".addMiddlePosition");
    if(addMiddlePosition != null) {
        addMiddlePosition.classList.add("btnHidden");
    }

    const emptyDiv = document.querySelector(".emptyDiv");
    if(emptyDiv != null) {
        emptyDiv.classList.add("btnHidden");
    }

    // 메인 div 생성
    const positionDiv = document.createElement('div');
    positionDiv.className = 'positionDiv';

    // 인덱스 div 생성
    const indexDiv = document.createElement('div');
    indexDiv.className = 'firstWidth';
    indexDiv.textContent = ''; // 나중에 동적으로 인덱스 번호 설정
    positionDiv.appendChild(indexDiv);

    // 두 번째 넓이 div 생성
    const secondWidthDiv = document.createElement('div');
    secondWidthDiv.className = 'secondWidth';

    // 직책 이름 입력란 생성
    const positionNameInput = document.createElement('input');
    positionNameInput.className = 'inputWidth';
    positionNameInput.type = 'text';
    secondWidthDiv.appendChild(positionNameInput);

    // 직책 번호 숨김 입력란 생성
    const positionNoInput = document.createElement('input');
    positionNoInput.type = 'hidden';
    positionNoInput.name = 'positionNo';
    secondWidthDiv.appendChild(positionNoInput);

    positionDiv.appendChild(secondWidthDiv);

    // 세 번째 넓이 div 생성
    const thirdWidthDiv = document.createElement('div');
    thirdWidthDiv.className = 'thirdWidth';

    // 저장 버튼 생성
    const saveBtn = document.createElement('button');
    saveBtn.className = 'default-btn saveBtn';
    saveBtn.textContent = '저장';


    // 삭제 버튼 생성
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'default-btn cancelBtn';
    cancelBtn.textContent = '취소';
    cancelBtn.addEventListener('click', function() {
        positionDiv.remove();
        updateIndexNumbers(); // 삭제 후 인덱스 번호 업데이트

        addPosition.classList.remove("btnHidden");
        document.querySelector(".addMiddlePosition").classList.remove("btnHidden");
    });

    thirdWidthDiv.appendChild(saveBtn);
    thirdWidthDiv.appendChild(cancelBtn);

    positionDiv.appendChild(thirdWidthDiv);

    // 새 positionDiv를 positionBlock에 추가
    document.getElementById('positionBlock').appendChild(positionDiv);

    // 인덱스 번호 업데이트
    updateIndexNumbers();

    saveBtn.addEventListener('click', function() {
        // 직책 이름 값 가져오기
        const positionNm = positionNameInput.value;
        let indexNo = indexDiv.innerText;
        if(positionNm == "") {
            alert("직책을 입력 후 저장 버튼을 눌러주세요");
            return;
        }

        console.log("인덱스 넘버가 안 나와?" + indexNo);

        // 여기서 positionNm 값을 처리 (예: 서버로 전송하거나 콘솔에 출력)
        location.href = "/position/positionInsert?positionNm=" + positionNm + "&level=" + indexNo;
    });

});

function updateIndexNumbers() {
    const positionDivs = document.querySelectorAll('.positionDiv .firstWidth');
    positionDivs.forEach((div, index) => {
        div.textContent = index + 1; // 인덱스 번호 설정
    });
}

// 중간 직책 추가하기 클릭 시 인덱스 번호도 지정할 수 있게 해줘야함 level
const addMiddlePosition = document.querySelector(".addMiddlePosition");

if(addMiddlePosition != null) {

    addMiddlePosition.addEventListener("click", () => {

        document.querySelector(".addPosition").classList.add("btnHidden");
        addMiddlePosition.classList.add("btnHidden");
    
        // 메인 div 생성
        const positionDiv = document.createElement('div');
        positionDiv.className = 'positionDiv';
    
        // 인덱스 div 생성
        const indexDiv = document.createElement('div');
        indexDiv.className = 'firstWidth';
        positionDiv.appendChild(indexDiv);
    
        // 레벨 입력 받을 부분
        const positionP = document.createElement('p');
        positionP.textContent = '순서 입력';
        indexDiv.appendChild(positionP);
    
        const positionLevelInput = document.createElement('input');
        positionLevelInput.className = 'indexInput';
        positionLevelInput.type = 'text';
        indexDiv.appendChild(positionLevelInput);
    
        // 두 번째 넓이 div 생성
        const secondWidthDiv = document.createElement('div');
        secondWidthDiv.className = 'secondWidth';
    
        // 직책 이름 입력란 생성
        const positionNameInput = document.createElement('input');
        positionNameInput.className = 'inputWidth';
        positionNameInput.type = 'text';
        secondWidthDiv.appendChild(positionNameInput);
    
        // 직책 번호 숨김 입력란 생성
        const positionNoInput = document.createElement('input');
        positionNoInput.type = 'hidden';
        positionNoInput.name = 'positionNo';
        secondWidthDiv.appendChild(positionNoInput);
    
        positionDiv.appendChild(secondWidthDiv);
    
        // 세 번째 넓이 div 생성
        const thirdWidthDiv = document.createElement('div');
        thirdWidthDiv.className = 'thirdWidth';
    
        // 저장 버튼 생성
        const saveBtn = document.createElement('button');
        saveBtn.className = 'default-btn middleSaveBtn';
        saveBtn.textContent = '저장';
    
        // 삭제 버튼 생성
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'default-btn cancelBtn';
        cancelBtn.textContent = '취소';
    
        thirdWidthDiv.appendChild(saveBtn);
        thirdWidthDiv.appendChild(cancelBtn);
    
        positionDiv.appendChild(thirdWidthDiv);
    
        // 새 positionDiv를 positionBlock에 추가
        document.getElementById('positionBlock').appendChild(positionDiv);
    
        const middleSaveBtn = document.querySelector(".middleSaveBtn");
    
        cancelBtn.addEventListener('click', function() {
            positionDiv.remove();
            updateIndexNumbers(); // 삭제 후 인덱스 번호 업데이트
    
            document.querySelector(".addPosition").classList.remove("btnHidden");
            addMiddlePosition.classList.remove("btnHidden");
        });
    
        middleSaveBtn.addEventListener('click', function() {
            // 직책 이름 값 가져오기
            const positionNm = positionNameInput.value;
            const level = positionLevelInput.value;
    
            const regExp = /^[0-9]+$/;
    
            if(level.trim().length == 0) {
                alert("번호를 입력해주세요");
                return;
            }
    
            if(!regExp.test(level)) {
                alert("순서 입력에는 숫자만 입력 가능합니다.");
                return;
            }
    
            // indexNo보다 1 이상 크면 안됨 0 이하 안됨
            if(level <= 0) {
                alert("0 이하의 숫자는 선택하실 수 없습니다.");
                return;
            }
    
            // indexNo 중 제일 큰 값 가져와서 크기 비교
            const limitNo = document.querySelectorAll('.firstWidth');
            limitNo.forEach((index) => {

                console.log(index.innerText);

                if(level > index.innerText) {
                    alert("직책 추가 버튼을 눌러 추가해주세요");
                    return;
                }
            });



            if(positionNm.trim().length == 0) {
                alert("직책을 입력 후 저장 버튼을 눌러주세요");
                return;
            }
    
            console.log("직책 이름 : " + positionNm);
            console.log("레벨 : " + level);
    
            // 여기서 positionNm 값을 처리 (예: 서버로 전송하거나 콘솔에 출력)
            // location.href = "/position/positionMiddleInsert?positionNm=" + positionNm + "&level=" + level;
        });
    
    });
}

const deleteButtons = document.querySelectorAll('.deleteBtn');
if (deleteButtons.length > 0) {

    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function() {

            if(deleteButtons.length == 1) {
                alert("최소한 1개의 직책은 남아있어야합니다.");
                return;
            }

            // 클릭된 버튼의 부모 .positionDiv 요소 찾기
            const positionDiv = button.closest('.positionDiv');
            // 해당 .positionDiv 내의 숨김 입력란 (positionNo) 찾기
            const positionNoInput = positionDiv.querySelector('input[name="positionNo"]');
            const positionNo = positionNoInput.value;

            location.href = "/position/positionDelete?positionNo=" + positionNo;

            // 여기서 positionDiv를 삭제할 수 있음 (선택사항)
            positionDiv.remove();
        });
    });
}