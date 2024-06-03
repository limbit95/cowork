const request = document.querySelector(".request");
const approval = document.querySelector(".approval");
const reject = document.querySelector(".reject");

request.addEventListener("click", e => {
  location.href = '/admin/attendance/requestManager';
})

approval.addEventListener("click", e => {
  location.href = '/admin/attendance/approvalManager';
})

reject.addEventListener("click", e => {
  location.href = '/admin/attendance/RejectManager';
})