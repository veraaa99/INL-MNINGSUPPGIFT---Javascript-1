# Javascript 1 Assignment: Todo-list application

## Project description
This project was the final assignment in the Javascript 1-course at the Front End Developer programme that I'm studying. 
The task was to create a simple todo web application that lets the user submit a new todo to a database, and/or delete it later.

The purpose of the project was to let us students practice Javascript, DOM manipulation and asynchronous server communication.<br/>The project was written in HTML, CSS and Javascript. In order to get, post, delete and update todos, the Fetch API was used. I also used Bootstrap’s CSS and Javascript-libraries in order to style the application and include some methods.

This was my first time using Bootstrap libraries, which was a fun learning experience and really helped me out in styling the application in an easy way.<br/>
I did face some problems when creating a modal, as the Bootstrap methods I used for the modal gave me an error message. So instead, I used a more simple solution with other Javascript methods, which still worked out pretty well.

## Installation
To run the application, simply clone the repository: `https://github.com/veraaa99/INL-MNINGSUPPGIFT---Javascript-1.git` or download it as a zip-file and unpack it.<br/>
Then launch the `index.html`-file in your desired browser.

## Usage & features
Inside the first input field, write the title of your todo and press the **Submit**-button. The title will then be displayed in the list below the form.

Each todo in the list has a corresponding checkbox. By checking it, the todo will be crossed out and marked as **“completed”**. The matching todo in the database will also be updated from `“completed”: false` to `“completed”: true`.

The form also lets you delete a todo from the list. To achieve this, write the title of your todo in the second input field and press the **Remove**-button.<br/>
The todo must however be marked as **“completed”** first, otherwise you’ll get a pop-up modal with an error message.

## Credits
I would like to thank my teacher for his very informative and clear lecture videos, that helped me out a lot in this project! :) 
