let createField = document.getElementById("create-input");

function todoTemplate(newTodo){
    return `
        <div class="flex justify-between items-center py-6">
            <!-- title -->
            <span class="text-white todo-text">${newTodo.text}</span>
            <!-- action -->
            <div class="flex items-center space-x-4">
              <!-- edit -->
              <button>
                <i
                  data-item="${newTodo._id}"
                  class="fa-solid fa-pencil text-green-400 transition-all hover:scale-125 edit-btn"
                ></i>
              </button>
              <!-- delete -->
              <button>
                <i
                  data-item="${newTodo._id}"
                  class="fa-solid fa-trash-can text-red-400 transition-all hover:scale-125 delete-btn"
                ></i>
              </button>
            </div>
        </div>
    `;
}

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("edit-btn")) {
        // console.log("CLICKED")
        let newTodo = prompt("New Todo:", e.target.parentElement.parentElement.parentElement.querySelector(".todo-text").innerHTML);

        if (newTodo) {
            axios
            .post("/update", { 
                id: e.target.getAttribute("data-item"),
                text: newTodo 
            })
            .then(function () {
                let element = e.target.parentElement.parentElement.parentElement.querySelector(".todo-text");
                element.innerHTML = newTodo
            })
            .catch(function () {
                console.log("Error")
            });
        }
    }

    if(e.target.classList.contains("delete-btn")) {
        if (confirm("Are you sure?")){

            let element = e.target.parentElement.parentElement.parentElement;

            axios.post("/delete", 
                {
                    id: e.target.getAttribute("data-item"),
                }).then(function(){
                    element.remove()
                }).catch(function(error){
                    console.log("ERROR: ", error)
                });
        }
    }
});

//Create
document.getElementById("create-form").addEventListener("submit", function(e){
    e.preventDefault();

    axios.post("/create", 
        {text: createField.value,}
    ).then(function(res){
        createField.value = "";
        document
            .getElementById("item-list")
            .insertAdjacentHTML("beforeend", todoTemplate(res.data));
    }).catch(function(error){
        console.log("ERROR: ", error);
    })
});