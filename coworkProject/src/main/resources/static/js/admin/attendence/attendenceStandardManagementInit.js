document.querySelector(".next").addEventListener("click", e => {
    const name = e.target.parentElement.parentElement.parentElement.id.substring(0,4);
    const numStr = e.target.parentElement.parentElement.parentElement.id.substring(4,5);
    e.target.parentElement.parentElement.parentElement.style.display = 'none';
    const num = parseInt(numStr) + 1;
    document.getElementById(name+num).style.display = 'block';
})

document.querySelector(".previous").addEventListener("click", e => {
    const name = e.target.parentElement.parentElement.parentElement.id.substring(0,4);
    const numStr = e.target.parentElement.parentElement.parentElement.id.substring(4,5);
    e.target.parentElement.parentElement.parentElement.style.display = 'none';
    const num = parseInt(numStr) - 1;
    document.getElementById(name+num).style.display = 'block';
})