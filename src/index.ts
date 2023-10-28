type ID = number | string;

interface Todo {
    userId: ID;
    id: ID;
    title: string;
    completed: boolean;
}
interface User {
    id: ID;
    name: string;
}

(function () {
    //Globals
    let todos: Todo[] = [];
    let users: User[] = [];
    const toDoList = document.getElementById('todo-list');
    const userSelect = document.getElementById('user-todo');
    const form = document.querySelector('form');

    //Atach events
    document.addEventListener('DOMContentLoaded', initApp);
    form?.addEventListener('submit', handleSubmit);

    //Basic logic
    function getUserName(userId: ID) {
        const user = users.find((u) => u.id === userId);
        return user?.name || '';
    }

    function printToDo({ id, userId, title, completed }: Todo) {
        const li = document.createElement('li');

        li.className = 'todo-item slide-in';
        li.dataset.id = String(id);
        li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(
            userId
        )}</b></span>`;

        const status = document.createElement('input');
        status.type = 'checkbox';
        status.checked = completed;
        status.addEventListener('change', handleTodoChange);

        const close = document.createElement('span');
        close.innerHTML = '&times;';
        close.className = 'close';
        close.addEventListener('click', handleClose);

        toDoList?.prepend(li);
        li.prepend(status);
        li.append(close);
    }

    function createUserOption(user: User) {
        if (userSelect) {
            const option = document.createElement('option');
            option.value = String(user.id);
            option.innerText = user.name;

            userSelect.append(option);
        }
    }

    function removeTodo(todoId: ID) {
        if (toDoList) {
            todos = todos.filter((todo) => todo.id !== todoId);
            const todo = toDoList.querySelector(`[data-id = "${todoId}"]`);

            if (todo) {
                todo.classList.remove('slide-in');
                todo.classList.add('slide-out');

                todo.addEventListener('animationend', () => {
                    todo.remove(); // После окончания анимации удаляем элемент
                });

                todo.querySelector('input')?.removeEventListener(
                    'change',
                    handleTodoChange
                );
                todo.querySelector('.close')?.removeEventListener(
                    'click',
                    handleClose
                );
            }
        }
    }
    function alertError(error: Error) {
        alert(error.message);
    }

    //Event logic
    function initApp() {
        Promise.all([getAllToDos(), getAllUsers()]).then((values) => {
            [todos, users] = values;
            //Отправить в разметку
            todos.forEach((todo) => printToDo(todo));
            users.forEach((user) => createUserOption(user));
        });
    }
    function handleSubmit(event: Event) {
        event.preventDefault();

        if (form) {
            const userId = Number(form.user.value);
            const todoTitle = form.todo.value.trim(); // Удаляем пробелы в начале и конце

            if (!userId || !todoTitle) {
                alert(
                    'Пожалуйста выберите пользователя и введите название задачи'
                );
                return;
            }
            createTodo({
                userId: Number(form.user.value),
                title: form.todo.value,
                completed: false,
            });
            form.user.value = '';
            form.todo.value = '';
        }
    }
    function handleTodoChange(this: HTMLInputElement) {
        const parent = this.parentElement;
        if (parent) {
            const todoId = parent.dataset.id;
            const completed = this.checked;
            todoId && toggleTodoComplete(todoId, completed);
        }
    }
    function handleClose(this: HTMLSpanElement) {
        const parent = this.parentElement;

        if (parent) {
            const todoId = parent.dataset.id;
            todoId && deleteTodo(todoId);
        }
    }

    //Async logic
    async function getAllToDos(): Promise<Todo[]> {
        try {
            const response = await fetch(
                'https://jsonplaceholder.typicode.com/todos?_limit=20'
            );
            const data = await response.json();
            return data;
        } catch (error) {
            if (error instanceof Error) alertError(error);

            return [];
        }
    }

    async function getAllUsers(): Promise<User[]> {
        try {
            const response = await fetch(
                'https://jsonplaceholder.typicode.com/users'
            );
            const data = await response.json();
            return data;
        } catch (error) {
            if (error instanceof Error) alertError(error);

            return [];
        }
    }

    async function createTodo(todo: Omit<Todo, 'id'>) {
        try {
            const response = await fetch(
                'https://jsonplaceholder.typicode.com/todos',
                {
                    method: 'POST',
                    body: JSON.stringify(todo),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const newTOdo = await response.json();
            printToDo(newTOdo);
        } catch (error) {
            if (error instanceof Error) {
                alertError(error);
            }
        }
    }

    async function toggleTodoComplete(todoId: ID, completed: boolean) {
        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/todos/${todoId}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({ completed: completed }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.ok) {
                throw new Error(
                    'Failed to connect with server! Please try later!'
                );
            }
        } catch (error) {
            if (error instanceof Error) {
                alertError(error);
            }
        }
    }

    async function deleteTodo(todoId: ID) {
        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/todos/${todoId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.ok) {
                removeTodo(todoId);
            } else {
                throw new Error(
                    'Failed to connect with server! Please try later!'
                );
            }
        } catch (error) {
            if (error instanceof Error) {
                alertError(error);
            }
        }
    }
})();
