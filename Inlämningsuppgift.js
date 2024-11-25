/*
* VARIABLES 
*/
const url = 'https://js1-todo-api.vercel.app/api/todos?apikey=6e308da8-8ca1-488a-99f5-fc410760a050'
const todoForm = document.querySelector('#todoForm');

const submitTodoInput = document.querySelector('#submitTodoInput')
const submitTodoBtn = document.querySelector('#submitTodoBtn')
const removeTodoInput = document.querySelector('#removeTodoInput')
const removeTodoBtn = document.querySelector('#removeTodoBtn')
let errorMessage;
let todoTitle;
let removeTodoTitle;
let todoList = document.querySelector('#todoList');

const myModal = document.getElementById('myModal')
const closeModalBtn = document.querySelector('#closeModal');

// Todo-array containing the titles of all todos
const todos = [];

/*
* GET/SHOW TODOS 
*/

/*
 * Fetch all submitted Todos from the database, and call on showTodos()
 * Code taken from/inspired by: https://www.youtube.com/watch?v=5ULBPRuyKfc&t=4975s , timestamp 1:00:18-1:04:08
 * and 1:20:25-1:22:55
 */
const getTodos = async () => {
    const response = await fetch (url)
    const data = await response.json()
    checkResponse(response);

    data.forEach(todo => todos.push(todo))
    showTodos()

    return true;
}

getTodos();

/*
 * Show all submitted Todos in a list on the website
 * Code taken from/inspired by: https://www.youtube.com/watch?v=BMBi1LE3DCA&t=1s , timestamp 38:30-43:20
 * and https://www.youtube.com/watch?v=5ULBPRuyKfc&t=4975s , timestamp 1:24:55-1:26:25, 1:32:56-1:34:17
 */
const showTodos = () => {
    todos.forEach((todo) => {
        let li = document.createElement("li")
        li.innerText = todo.title
        li.id = todo._id
        li.className = 'list-group-item d-flex justify-content-between'

        let checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.id = todo._id
        checkbox.className = 'form-check-input'

        if (todo.completed) {
            checkbox.checked = true
            li.classList.add('bg-primary', 'text-decoration-line-through')
            li.classList.remove('bg-dark', 'text-decoration-none')
        } else {
            li.classList.add('bg-dark', 'text-light')
            li.classList.remove('bg-primary', 'text-decoration-line-through')
        }

        li.appendChild(checkbox)
        todoList.appendChild(li)

        //Event listener for checkbox-code taken from/inspired by user SabU at: https://stackoverflow.com/questions/14544104/checkbox-check-event-listener 
        checkbox.addEventListener('change', e => {
            if (e.target.checked) {
                todo.completed = true
                li.classList.add('bg-primary', 'text-decoration-line-through')
                li.classList.remove('bg-dark', 'text-decoration-none')

                finishedTodo(checkbox);
            } else {
                todo.completed = false
                li.classList.add('bg-dark', 'text-decoration-none')
                li.classList.remove('bg-primary', 'text-decoration-line-through')

                unfinishedTodo(checkbox)
            }
        })
    })
}

/*
* SUBMIT NEW TODO
*/

/*
 * Event listener for when the user submits a new Todo.
 * If the Todo title isn't empty and does not already exist, call the createTodo() function.
 */
todoForm.addEventListener('submit', e => {
    e.preventDefault();
    todoTitle = submitTodoInput.value.trim();

    let isTitleAvaliable = true

    // Use of filter function inspired by: https://www.youtube.com/watch?v=XPX8IT_aW2Q&t=1222s , timestamp: 21:27-23:35
    todos.filter(todo => {
        if(todo.title.trim() === todoTitle){
            isTitleAvaliable = false
            validateInput(submitTodoInput, isTitleAvaliable)
        } 
    })

    if(!validateInput(submitTodoInput, isTitleAvaliable)){
        isTitleAvaliable = false
    }

    if (isTitleAvaliable) {
        submitTodo()
        return
    }

})

/*
 * Create and submit user's todo to database
 * Code taken from/inspired by: https://www.youtube.com/watch?v=5ULBPRuyKfc&t=4975s , timestamp 2:35:14-2:37:35
 */
const submitTodo = async() => {
    const newTodo = {
        title: todoTitle
    }

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(newTodo)
        })

        checkResponse(response);
        window.location.reload()

    } catch (error) {
        console.error(error.message)
    }
}

/*
 * Triggers the submit-button if the user presses the 'Enter' key while being in the 'submit todo'-input field
 * Code taken from/inspired by: https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp 
 */
submitTodoInput.addEventListener("keypress", (e) => {
    if(e.key == "Enter"){
        e.preventDefault();
        submitTodoBtn.click()
    }
})


/*
* REMOVE TODO
*/

/*
 * Event listener for when the user wants to remove a Todo.
 * If the Todo title exists in the database, call the removeTodo() function.
 */
removeTodoBtn.addEventListener('click', () => {
    removeTodoTitle = document.querySelector('#removeTodoInput').value.trim();
    let doesTodoExist = false;

    // Use of filter function inspired by: https://www.youtube.com/watch?v=XPX8IT_aW2Q&t=1222s , timestamp: 21:27-23:35
    todos.filter(todo => {
        if(todo.title.trim() === removeTodoTitle){
            if (!todo.completed) {
                doesTodoExist = true
                showModal()
                return
            } else {
                doesTodoExist = true
                removeTodo(todo)
                return
            }
        } 
    })

    if (!doesTodoExist) {
        validateInput(removeTodoInput, doesTodoExist)
        return
    }
})

/*
 * Delete a chosen todo from the database
 * Code taken from/inspired by: https://www.youtube.com/watch?v=5ULBPRuyKfc&t=4975s , timestamp 2:35:14-2:37:35
 */
const removeTodo = async(todo) => {
    const removeTodoId = todo._id
    const removeTodoUrl = `https://js1-todo-api.vercel.app/api/todos/${removeTodoId}?apikey=6e308da8-8ca1-488a-99f5-fc410760a050`

    try {
        let response = await fetch(removeTodoUrl, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(removeTodoId)
        })

        response = await response.json();
        checkResponse(response);

        delete todos[response]
        window.location.reload()

    } catch (error) {
        console.error(error.message)
    }
}

/*
 * Triggers the remove-button if the user presses the 'Enter' key while being in the 'remove todo'-input field
 * Code taken from/inspired by: https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp 
 */
removeTodoInput.addEventListener("keypress", (e) => {
    if(e.key == "Enter"){
        e.preventDefault();
        removeTodoBtn.click();
    }
})

/*
* UPDATE TODO
*/

/*
 * Change a Todo's status to 'completed: true' in the database
 * Code taken from/inspired by: https://www.youtube.com/watch?v=5ULBPRuyKfc&t=4975s , timestamp 2:35:14-2:37:35
 */
const finishedTodo = async (checkbox) => {
    const finishedTodoId = checkbox.id
    const finishedTodoUrl = `https://js1-todo-api.vercel.app/api/todos/${finishedTodoId}?apikey=6e308da8-8ca1-488a-99f5-fc410760a050`

    const finishedTodo = {
        completed: true
    }

    try {
        const response = await fetch(finishedTodoUrl, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(finishedTodo)
        })

        checkResponse(response);
        return true;        
    
    } catch (error) {
        console.error(error.message)
    }
}

/*
 * Change a Todo's status to 'completed: false' in the database
 * Code taken from/inspired by: https://www.youtube.com/watch?v=5ULBPRuyKfc&t=4975s , timestamp 2:35:14-2:37:35
 */
const unfinishedTodo = async (checkbox) => {
    const unfinishedTodoId = checkbox.id
    const unfinishedTodoUrl = `https://js1-todo-api.vercel.app/api/todos/${unfinishedTodoId}?apikey=6e308da8-8ca1-488a-99f5-fc410760a050`

    const unfinishedTodo = {
        completed: false
    }

    try {
        const response = await fetch(unfinishedTodoUrl, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(unfinishedTodo)
        })

        checkResponse(response);
        return true;
    
    } catch (error) {
        console.error(error.message)
    }
    
}

/*
* MODAL
*/

/*
 * Show & close a modal with an error message. The modal appears if the user tries to remove an unfinished Todo
 * Code taken from/inspired by: https://www.w3schools.com/howto/howto_css_modals.asp
 */
// Show modal
const showModal = () => {
    myModal.style.display ="block";
    closeModalBtn.focus();
}

// Close modal (if the user presses the 'close'-button in the modal)
closeModalBtn.onclick = () => {
    myModal.style.display = "none";
}

// //Close modal (if the user clicks anywhere outside of the modal)
window.onclick = (event) => {
    if(event.target == myModal) {
        myModal.style.display = "none";
    }
}

/*
* VALIDATE TODO
*/

/*
 * Validate user's input
 * Code taken from/inspired by: https://www.youtube.com/watch?v=ccC7K-AwvfA&t=4128s , timestamp 26:27-36:17
 */
 const validateInput = (inputField, todoBoolean) => {
    if(inputField.value.trim() === ''){
        showErrorMessage(inputField, "Please enter a todo title")
        return false
    } else if (!todoBoolean) {
        if(inputField === submitTodoInput) {
            showErrorMessage(submitTodoInput, "Please enter a todo title that does not already exist")
            return false
        } else if (inputField === removeTodoInput) {
            showErrorMessage(removeTodoInput, "Couldn't find a matching todo")
            return false
        } 
    }
    return true
}

/*
 * Create and show error message
 * Code taken from/inspired by: https://www.youtube.com/watch?v=ccC7K-AwvfA&t=4128s , timestamp 26:27-36:17
 */
const showErrorMessage = (inputField, errorText) => {
    const parent = inputField.parentElement
    const errorElement = parent.querySelector('.errorMessage')

    inputField.className = 'form-control border border-danger'
    errorElement.innerText = errorText
    errorElement.className = 'errorMessage text-danger'
    return
}

/*
 * Check if fetch request's response is ok or not
 */
const checkResponse = async (response) => {
    switch(response.status) {
        case 200: 
            break
        case 201:
            break
        default:
            throw new Error ('An error occurred');
    }
}