// Krav för godkänt:

// Hämta todos 
// Använd Fetch för att göra en GET-förfrågan och hämta Todo-listan från API:et vid sidans laddning. Presentera listan på din webbsida.
const todos = [];

const url = 'https://js1-todo-api.vercel.app/api/todos?apikey=6e308da8-8ca1-488a-99f5-fc410760a050'
const todoForm = document.querySelector('#todoForm');
let todoList = document.querySelector('#todoList');
let todoTitle;
let removeTodoTitle;
let isCompleted = false;

const getTodos = async () => {
    const response = await fetch (url)

    if(response.status !== 200){
        throw new Error ('Ett fel uppstod');
    }

    const data = await response.json()
    data.forEach(todo => todos.push(todo))

    showTodos()
    console.log(todos)
    console.log(data)

    return true;
}

getTodos();

const showTodos = () => {
    todos.forEach((todo) => {
        let li = document.createElement("li")
        li.innerText = todo.title
        li.id = todo._id

        let check = document.createElement("input")
        check.type = "checkbox"
        check.id = todo._id

        if (todo.completed) {
            isCompleted = true
            check.checked = true
            li.style.backgroundColor = 'green';
        } else {
            isCompleted = false
            li.style.backgroundColor = 'red';
        }

        todoList.append(li, check)

        check.addEventListener('change', e => {
            if (e.target.checked) {
                isCompleted = true
                li.style.backgroundColor = 'green';
                finishedTodo(check);
            } else {
                isCompleted = false
                li.style.backgroundColor = 'red';
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
    let isTitleAvaliable = true

    if(todoTitle === ''){
        console.log('Not allowed to submit an empty todo');
        return;
    }

    todos.filter(todo => {
        if(todo.title === todoTitle){
            isTitleAvaliable = false
            console.log('Please enter a todo title that does not already exist')
            return;
        } 
    })

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
    
        if(response.status !== 201){
            throw new Error ('Ett fel uppstod');
        }

        window.location.reload()
        // skriva = "" istället för att ladda om sidan?
        // https://medium.com/@johnwadelinatoc/manipulating-the-dom-with-fetch-7bfddf9c526b

    } catch (error) {
        console.error(error.message)
    }

    return true;
}

// Ta bort todo 
// Implementera funktionen att ta bort en todo från listan genom att göra en DELETE-förfrågan till API:et. 
// Uppdatera DOM:en efter du har fått ett svar tillbaka så att den borttagna todon försvinner.

// Din API-nyckel:
// 6e308da8-8ca1-488a-99f5-fc410760a050
removeTodoBtn.addEventListener('click', () => {
    removeTodoTitle = document.querySelector('#removeTodo').value;
    let isTodo = false;

    if(removeTodoTitle === ''){
        console.log('Please enter a todo title');
        return;
    }

    todos.filter(todo => {
        if(todo.title === removeTodoTitle){
            if (!isCompleted) {
                isTodo = true
                showModule()
                console.log('Unable to remove an unfinished Todo')
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
        console.log("Couldn't find a matching todo")
    }
   
})

const removeTodo = async(todo) => {
    const removeTodoId = todo._id
    console.log(removeTodoId)
    const removeTodoUrl = `https://js1-todo-api.vercel.app/api/todos/${removeTodoId}?apikey=6e308da8-8ca1-488a-99f5-fc410760a050`

    try {
        let response = await fetch(removeTodoUrl, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(removeTodoId)
        })
    
        if(response.status !== 200){
            throw new Error ('Ett fel uppstod');
        }
    
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
    console.log(finishedTodoId)
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
    
        if(response.status !== 200){
            throw new Error ('Ett fel uppstod');
        }
    
        const data = await response.json();
        console.log('Todo updated successfully:', data);  
        return data;
    
    } catch (error) {
        console.error(error.message)
    }

    return true;
}

const unfinishedTodo = async (check) => {
    const unfinishedTodoId = check.id
    console.log(unfinishedTodoId)
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
    
        if(response.status !== 200){
            throw new Error ('Ett fel uppstod');
        }
    
        const data = await response.json();
        console.log('Todo updated successfully:', data);  
        return data;
    
    } catch (error) {
        console.error(error.message)
    }

    return true;
}