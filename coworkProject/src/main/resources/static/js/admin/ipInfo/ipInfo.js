document.addEventListener('DOMContentLoaded', () => {
    const findInput = document.getElementById('findInput');
    const resultList = document.getElementById('resultList');
    const noResultsMessage = document.getElementById('noResultsMessage');

    // 초기 데이터를 보존
    const initialData = Array.from(resultList.children);

    // 초기 화면 설정 함수
    function showInitialView() {
        resultList.innerHTML = '';
        initialData.forEach(item => resultList.appendChild(item));
        noResultsMessage.style.display = 'none';
    }

    findInput.addEventListener("input", () => {
        const query = findInput.value.trim();

        if (query === '') {
            showInitialView(); // 입력값이 비어있을 때 초기 화면 보여주기
            return;
        }

        console.log(query);

        // 서버로 데이터 요청
        fetch("/ipInfo/selectIpInfo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: query
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(list => {
            console.log(list);

            // 기존 리스트 초기화
            resultList.innerHTML = '';

            if (list == null || list.length === 0) {
                console.log("List 없음");
                noResultsMessage.style.display = 'block'; // 검색 결과 없음 메시지 표시
            } else {
                console.log("List 있음");
                noResultsMessage.style.display = 'none'; // 검색 결과 없음 메시지 숨김
                
                // 필터링된 리스트 표시
                list.forEach(item => {
                    const div = document.createElement('div');
                    div.classList.add('resultContainer');
                    div.innerHTML = `
                        <div class="firstResult">${item.affiliation}</div>
                        <div class="secondResult">[${item.empNo}] ${item.fullName}</div>
                        <div class="thirdResult">
                            <div class="ipNo">${item.ip}</div>
                            <input type="hidden" value="${item.empCode}">
                            <div class="ipBtn">
                                <button class="default-btn glucose-border-btn updateBtn">수정</button>
                                <button class="default-btn deleteBtn">삭제</button>
                            </div>
                        </div>
                    `;
                    resultList.appendChild(div);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultList.innerHTML = '';
            noResultsMessage.style.display = 'block'; // 에러 시 검색 결과 없음 메시지 표시
        });
    });

    // 버튼 이벤트 설정
    resultList.addEventListener('click', e => {
        const target = e.target;

        // 수정 버튼 클릭 시
        if (target.classList.contains('updateBtn')) {
            const resultContainer = target.closest('.resultContainer');
            if (resultContainer) {
                const ipNoDiv = resultContainer.querySelector('.ipNo');
                const empCodeInput = resultContainer.querySelector('input[type="hidden"]');
                if (ipNoDiv && empCodeInput) {
                    const ipValue = ipNoDiv.textContent.trim();
                    const empCodeValue = empCodeInput.value.trim();

                    // ipNo 숨기기
                    ipNoDiv.style.display = 'none';

                    // input 태그 생성 및 설정
                    const inputField = document.createElement('input');
                    inputField.type = 'text';
                    inputField.value = ipValue; // 기존 IP 값 설정
                    inputField.classList.add('updatedIpInput'); // CSS 클래스 추가
                    resultContainer.querySelector('.thirdResult').prepend(inputField);

                    // 수정 버튼을 '저장' 버튼으로 변경
                    target.textContent = '저장';
                    target.classList.remove('updateBtn');
                    target.classList.add('saveBtn');

                    // 취소 버튼 생성
                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = '취소';
                    cancelButton.classList.add('default-btn', 'glucose-border-btn', 'cancelBtn');
                    resultContainer.querySelector('.ipBtn').appendChild(cancelButton);

                    // 저장 버튼 이벤트 설정
                    const saveBtn = resultContainer.querySelector(".saveBtn");
                    if (saveBtn) {
                        saveBtn.addEventListener("click", () => {
                            const updatedIpValue = inputField.value.trim();
                            if (validateIPv4(updatedIpValue)) {
                                console.log("유효한 IPv4 주소입니다.");
                                // 여기에서 서버로의 저장 요청을 넣으세요
                                location.href = `/ipInfo/updateIpInfo?empCode=${empCodeValue}&ip=${updatedIpValue}`;
                            } else {
                                alert("유효하지 않은 IP 주소입니다.");
                                return;
                            }
                        });
                    }

                    // 취소 버튼 클릭 시
                    cancelButton.addEventListener("click", () => {
                        // ipNo 다시 보이게 하기
                        ipNoDiv.style.display = 'block';

                        // input 태그 제거
                        inputField.remove();

                        // 버튼을 다시 '수정'으로 변경
                        target.textContent = '수정';
                        target.classList.remove('saveBtn');
                        target.classList.add('updateBtn');

                        // 취소 버튼 제거
                        cancelButton.remove();
                    });
                }
            }
        }

        // 삭제 버튼 클릭 시 (추가 구현)
        if (target.classList.contains('deleteBtn')) {
            const resultContainer = target.closest('.resultContainer');
            if (resultContainer) {
                const empCodeInput = resultContainer.querySelector('input[type="hidden"]');
                if (empCodeInput) {
                    const empCode = empCodeInput.value.trim();
                    if (confirm("정말 삭제하시겠습니까?")) {
                        // 여기에서 서버로의 삭제 요청을 넣으세요
                        location.href = `/ipInfo/deleteIpInfo?empCode=${empCode}`;
                    } else {
                        location.href = "/ipInfo/ipInfoMain";
                    }
                }
            }
        }
    });

    // IPv4 주소 유효성 검사 함수
    function validateIPv4(ip) {
        const ipPattern = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;

        if (!ipPattern.test(ip)) {
            return false;
        }

        const octets = ip.split('.');
        for (let i = 0; i < octets.length; i++) {
            const octet = parseInt(octets[i]);
            if (octet < 0 || octet > 255 || isNaN(octet)) {
                return false;
            }
        }

        return true;
    }
});