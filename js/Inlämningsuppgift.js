// Krav för godkänt:

// Hämta todos 
// Använd Fetch för att göra en GET-förfrågan och hämta Todo-listan från API:et vid sidans laddning. Presentera listan på din webbsida.
const todos = [];

const url = 'https://js1-todo-api.vercel.app/api/todos?apikey=6e308da8-8ca1-488a-99f5-fc410760a050'
const todoForm = document.querySelector('#todoForm');
const createTodoField = document.querySelector('#createTodo')
const removeTodoField = document.querySelector('#removeTodo')

let todoList = document.querySelector('#todoList');

const myModal = new bootstrap.Modal(document.querySelector('#myModal'), {
     keyboard: false
    });
// https://getbootstrap.com/docs/5.3/components/modal/#how-it-works
// https://www.w3schools.com/bootstrap/bootstrap_modal.asp

const closeModalBtn = document.querySelector('#closeModal');

let todoTitle;
let removeTodoTitle;
let errorMessage;
let isCompleted = false;

const getTodos = async () => {
    const response = await fetch (url)
    checkResponse(response);

    const data = await response.json()
    data.forEach(todo => todos.push(todo))
    showTodos()

    return true;
}

getTodos();

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
        // Kod tagen från/inspirerad från (Youtube-länk)

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
        // https://stackoverflow.com/questions/14544104/checkbox-check-event-listener
    })

}

// Lägga till todos 
// Skapa ett formulär med en textinput och en knapp, som låter användaren lägga till en ny Todo. 
// Validera inmatningen för att undvika att man kan lägga till tomma Todos. Försöker man lägga till en todo utan att ha fyllt i någon text så ska ett felmeddelande visas för användaren.

// Spara todo till databasen 
// Använd Fetch för att göra en POST-förfrågan till API:et när en ny todo läggs till. 
// Uppdatera listan på hemsidan med den nya todon efter att du har fått ett svar från API:et.
todoForm.addEventListener('submit', e => {
    e.preventDefault();
    todoTitle = document.querySelector('#createTodo').value;

    console.log(createTodoField)
    console.log(typeof createTodoField)
    console.log(createTodoField.parentElement)

    let isTitleAvaliable = true

    todos.filter(todo => {
        if(todo.title === todoTitle){
            isTitleAvaliable = false
            validateInput(createTodoField, isTitleAvaliable)
        } 
    })
    //youtube-länk

    if(!validateInput(createTodoField, isTitleAvaliable)){
        isTitleAvaliable = false
    }

    if (isTitleAvaliable) {
        createTodo()
        return
    }

})

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
        // https://medium.com/@johnwadelinatoc/manipulating-the-dom-with-fetch-7bfddf9c526b

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
removeTodoBtn.addEventListener('click', () => {
    removeTodoTitle = document.querySelector('#removeTodo').value;
    let isTodo = false;

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

const showModal = () => {
    myModal.show()
}

closeModalBtn.onclick = () => {
    myModal.hide()
}

window.onclick = (event) => {
    if(event.target == myModal) {
        myModal.hide()
    }
}
// https://www.w3schools.com/howto/howto_css_modals.asp
// https://www.geeksforgeeks.org/how-to-trigger-a-modal-using-javascript-in-bootstrap/

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
        // https://medium.com/@johnwadelinatoc/manipulating-the-dom-with-fetch-7bfddf9c526b

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

const showErrorMessage = (inputField, errorText) => {
    const parent = inputField.parentElement
    const errorElement = parent.querySelector('.errorMessage')

    inputField.className = 'form-control border border-danger'
    errorElement.innerText = errorText
    errorElement.className = 'errorMessage text-danger'
    return
}
// https://www.youtube.com/watch?v=ccC7K-AwvfA

const checkResponse = async (response) => {
    switch(response.status) {
        case 200: 
            break
        case 201:
            break
        default:
            throw new Error ('Ett fel uppstod');
    }
    //skriva return ist?
}