// Krav för godkänt:

// Hämta todos 
// Använd Fetch för att göra en GET-förfrågan och hämta Todo-listan från API:et vid sidans laddning. Presentera listan på din webbsida.

/*
* VARIABLES 
*/
const todos = [];

const url = 'https://js1-todo-api.vercel.app/api/todos?apikey=6e308da8-8ca1-488a-99f5-fc410760a050'
const todoForm = document.querySelector('#todoForm');
const createTodoField = document.querySelector('#createTodo')
const removeTodoField = document.querySelector('#removeTodo')
let todoList = document.querySelector('#todoList');

/*
* Code taken from/inspired by: https://getbootstrap.com/docs/5.3/components/modal/#how-it-works 
*/
const myModal = new bootstrap.Modal(document.querySelector('#myModal'), {
     keyboard: false
})
const closeModalBtn = document.querySelector('#closeModal');

let todoTitle;
let removeTodoTitle;
let errorMessage;
let isCompleted = false;

/*
* FETCH/SHOW TODOS 
*/

/*
 * Fetch all submitted Todos from the database, and call on showTodos()
 * Code taken from/inspired by: https://www.youtube.com/watch?v=5ULBPRuyKfc&t=4975s , timestamp 1:00:18-1:04:08
 * and 1:20:25-1:22:55
 */
const getTodos = async () => {
    const response = await fetch (url)
    checkResponse(response);

    const data = await response.json()
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

        let check = document.createElement("input")
        check.type = "checkbox"
        check.id = todo._id
        check.className = 'form-check-input'

        if (todo.completed) {
            isCompleted = true
            check.checked = true
            li.classList.add('bg-success', 'text-decoration-line-through')
            li.classList.remove('bg-danger', 'text-decoration-none')
        } else {
            isCompleted = false
            li.classList.add('bg-danger')
            li.classList.remove('bg-success', 'text-decoration-line-through')
        }

        li.appendChild(check)
        todoList.appendChild(li)

        //Event listener for checkbox-code taken from/inspired by user Penguin9 at: https://stackoverflow.com/questions/14544104/checkbox-check-event-listener 
        check.addEventListener('change', e => {
            if (e.target.checked) {
                isCompleted = true
                li.classList.add('bg-success', 'text-decoration-line-through')
                li.classList.remove('bg-danger', 'text-decoration-none')

                finishedTodo(check);
            } else {
                isCompleted = false
                li.classList.add('bg-danger', 'text-decoration-none')
                li.classList.remove('bg-success', 'text-decoration-line-through')

                unfinishedTodo(check)
            }
        })
    })
}

// Lägga till todos 
// Skapa ett formulär med en textinput och en knapp, som låter användaren lägga till en ny Todo. 
// Validera inmatningen för att undvika att man kan lägga till tomma Todos. Försöker man lägga till en todo utan att ha fyllt i någon text så ska ett felmeddelande visas för användaren.

// Spara todo till databasen 
// Använd Fetch för att göra en POST-förfrågan till API:et när en ny todo läggs till. 
// Uppdatera listan på hemsidan med den nya todon efter att du har fått ett svar från API:et.

/*
* SUBMIT NEW TODO
*/

/*
 * Event listener for when the user submits a new Todo.
 * If the Todo title isn't empty and does not already exist, call the createTodo() function.
 */
todoForm.addEventListener('submit', e => {
    e.preventDefault();
    todoTitle = document.querySelector('#createTodo').value;

    let isTitleAvaliable = true

    // Use of filter function inspired by: https://www.youtube.com/watch?v=XPX8IT_aW2Q&t=1222s , timestamp: 21:27-23:35
    todos.filter(todo => {
        if(todo.title === todoTitle){
            isTitleAvaliable = false
            validateInput(createTodoField, isTitleAvaliable)
        } 
    })

    if(!validateInput(createTodoField, isTitleAvaliable)){
        isTitleAvaliable = false
    }

    if (isTitleAvaliable) {
        createTodo()
        return
    }

})

/*
 * Post user's todo to database
 * Code taken from/inspired by: https://www.youtube.com/watch?v=5ULBPRuyKfc&t=4975s , timestamp 2:35:14-2:37:35
 */
const createTodo = async() => {
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

    return;
}

// Ta bort todo 
// Implementera funktionen att ta bort en todo från listan genom att göra en DELETE-förfrågan till API:et. 
// Uppdatera DOM:en efter du har fått ett svar tillbaka så att den borttagna todon försvinner.

// Din API-nyckel:
// 6e308da8-8ca1-488a-99f5-fc410760a050

/*
* REMOVE TODO
*/

/*
 * Event listener for when the user wants to remove a Todo.
 * If the Todo title exists in the database, call the removeTodo() function.
 */
removeTodoBtn.addEventListener('click', () => {
    removeTodoTitle = document.querySelector('#removeTodo').value;
    let isTodo = false;

    // Use of filter function inspired by: https://www.youtube.com/watch?v=XPX8IT_aW2Q&t=1222s , timestamp: 21:27-23:35
    todos.filter(todo => {
        if(todo.title === removeTodoTitle){
            if (!isCompleted) {
                isTodo = true
                showModal()
                return
            } else {
                isTodo = true
                removeTodo(todo)
                return
            }
        } 
        return
    })

    if (!isTodo) {
        validateInput(removeTodoField, isTodo)
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

        checkResponse(response);
    
        response = await response.json();

        delete todos[response]
        window.location.reload()

    } catch (error) {
        console.error(error.message)
    }

    return true
}

// Klarmarkera todos 
// Låt användarna klarmarkera en todo genom att skicka en PUT-förfrågan till API:et. 
// Uppdatera stylingen på den klarmarkerade todon för att visa tydligt att den är avklarad. 
// Möjliggör även att ändra tillbaka statusen till "ej avklarad" om det behövs.

// Visuell indikation för klarmarkering 
// Todos som är klarmarkerade när de hämtas från databasen ska presenteras med samma styling som ovan som indikerar deras avklarade status.

// Förhindra borttagning av ej klarmarkerade todos 
// Förhindra användare från att ta bort todos som inte är klarmarkerade. 
// Om användaren ändå försöker ta bort en sådan todo ska en modal (popup) visas istället med en text som förklarar varför borttagningen inte är tillåten. 
// Denna får inte vara en vanlig alert()

/*
* UPDATE TODO
*/

/*
 * Change a Todo's status to 'completed: true' in the database
 * Code taken from/inspired by: https://www.youtube.com/watch?v=5ULBPRuyKfc&t=4975s , timestamp 2:35:14-2:37:35
 */
const finishedTodo = async (check) => {
    const finishedTodoId = check.id
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
    
        const data = await response.json();
        return data;
    
    } catch (error) {
        console.error(error.message)
    }

    return true;
}

/*
 * Change a Todo's status to 'completed: false' in the database
 * Code taken from/inspired by: https://www.youtube.com/watch?v=5ULBPRuyKfc&t=4975s , timestamp 2:35:14-2:37:35
 */
const unfinishedTodo = async (check) => {
    const unfinishedTodoId = check.id
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
    
        const data = await response.json();
        return data;
    
    } catch (error) {
        console.error(error.message)
    }
    
    return true;
}

/*
* MODAL
*/

/*
 * Show & close a modal with an error message. The modal appears if the user tries to remove an unfinished Todo
 * Code taken from/inspired by: https://www.w3schools.com/howto/howto_css_modals.asp & https://www.geeksforgeeks.org/how-to-trigger-a-modal-using-javascript-in-bootstrap/
 */
//Show modal
const showModal = () => {
    myModal.show()
}

// Close modal (if the user presses the 'close'-button in the modal)
closeModalBtn.onclick = () => {
    myModal.hide()
}

//Close modal (if the user clicks anywhere outside of the modal)
window.onclick = (event) => {
    if(event.target == myModal) {
        myModal.hide()
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
    if(inputField.value === ''){
        console.log(inputField.parentElement)
        showErrorMessage(inputField, "Please enter a Todo title")
        return false
    } else if (!todoBoolean) {
        if(inputField === createTodoField) {
            showErrorMessage(createTodoField, "Please enter a Todo title that does not already exist")
            return false
        } else if (inputField === removeTodoField) {
            showErrorMessage(removeTodoField, "Couldn't find a matching Todo")
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
            throw new Error ('Ett fel uppstod');
    }
}