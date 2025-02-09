let myForm = document.getElementById('myForm');
let myField = document.getElementById('myField');
let myList = document.getElementById('myList');

myForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo(myField.value);
});

function addTodo(todo){
    let myHtml = `<li>${todo} <button onclick="remoteTodo(this)">Delete</button> </li></br>`;
    myList.insertAdjacentHTML('beforeend', myHtml);
    myField.value = "";
    myField.focus();
}

function remoteTodo(todo){
    todo.parentElement.remove();
}