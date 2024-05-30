// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------

// document.addEventListener('DOMContentLoaded', function () {
//     var groupList = document.getElementById('groupList');

    
    
//     // 부모들 움직이면 발생하는 거임. 
//     new Sortable(groupList, { // 첫번째 매개변수인, groupList 안 태그 중 아들딸만 드래그가능하게 됨. 손자손녀는 안됨. 
//         group: {
//             name: 'nested',
//             put: true,
//             pull: true
//         },
//         animation: 150, 
//         fallbackOnBody: true,
//         swapThreshold: 0.65,
//         handle: '.handle',
//         onEnd: function (evt) {
//             var itemEl = evt.item; // 드래그된 부모li 태그 
//             var parentEl = itemEl.parentElement.closest('li'); // 드래그된 부모 li 태그의 부모 li 태그
//             // 드래그된 부모 li 태그가 드래그 된 "후" 부모 li 태그가 
//             // 존재한다면, 그 부모 li 태그속성에 저장되어 있는 USER_GROUP 테이블 id 컬럼값이, 
//             // 존재하지 않는다면, null 이 newParentId 라는 변수에 저장되게 됨.   
//             var newParentId = parentEl ? parentEl.getAttribute('data-id') : null;  //null 이라는 건 어떤 부서 밑으로 부서를 움직인게 아니라는 거야. 즉, 어떤 부서를 위아래 위치만 변경시키거나 안에 있던 부서를 바깥으로 뺀것 
//             // 드래그된 부모 li 태그속성에 저장되어 있는 USER_GROUP 테이블 id컬럼값 
//             var groupId = itemEl.getAttribute('data-id'); // 드래그 된 부모 li 태그의 USER_GROUP 테이블 id 컬럼값 

//             fetch('/groups/move', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     groupId: groupId, //드래그된 부모 li 태그속성에 저장되어 있는 USER_GROUP 테이블 id컬럼값 
//                     newParentId: newParentId // null 또는 드래그된 부모 li 태그의 드래그 "후" 부모 li 태그 안 속성
//                 })
//             })
//             .then(response => {
//                 if (response.ok) {
//                     console.log('Group moved successfully');
//                 } else {
//                     console.error('Failed to move group');
//                 }
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//             });
//         }
//     });

    
//     //자식들 움직이면 발생하는 거임. 
//     document.querySelectorAll('ul[id^="children-"]').forEach(function (el) {
//         new Sortable(el, { // 'ul[id^="children-"]' : ul 태그 중 id 가 children- 으로 시작하는 태그 
//                         // 즉, 자식 li 태그 
//             group: {
//                 name: 'nested',
//                 put: true,
//                 pull: true
//             },
//             animation: 150,
//             fallbackOnBody: true,
//             swapThreshold: 0.65,
//             handle: '.handle',
//             onEnd: function (evt) {
//                 var itemEl = evt.item;
//                 var parentEl = itemEl.parentElement.closest('li');
//                 var newParentId = parentEl ? parentEl.getAttribute('data-id') : null;
//                 var groupId = itemEl.getAttribute('data-id');

//                 fetch('/groups/move', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         groupId: groupId,
//                         newParentId: newParentId
//                     })
//                 })
//                 .then(response => {
//                     if (response.ok) {
//                         console.log('Group moved successfully');
//                     } else {
//                         console.error('Failed to move group');
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error:', error);
//                 });
//             }
//         });
//     });
// });

// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------