"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function () {
    //Globals
    var todos = [];
    var users = [];
    var toDoList = document.getElementById('todo-list');
    var userSelect = document.getElementById('user-todo');
    var form = document.querySelector('form');
    //Atach events
    document.addEventListener('DOMContentLoaded', initApp);
    form === null || form === void 0 ? void 0 : form.addEventListener('submit', handleSubmit);
    //Basic logic
    function getUserName(userId) {
        var user = users.find(function (u) { return u.id === userId; });
        return (user === null || user === void 0 ? void 0 : user.name) || '';
    }
    function printToDo(_a) {
        var id = _a.id, userId = _a.userId, title = _a.title, completed = _a.completed;
        var li = document.createElement('li');
        li.className = 'todo-item slide-in';
        li.dataset.id = String(id);
        li.innerHTML = "<span>".concat(title, " <i>by</i> <b>").concat(getUserName(userId), "</b></span>");
        var status = document.createElement('input');
        status.type = 'checkbox';
        status.checked = completed;
        status.addEventListener('change', handleTodoChange);
        var close = document.createElement('span');
        close.innerHTML = '&times;';
        close.className = 'close';
        close.addEventListener('click', handleClose);
        toDoList === null || toDoList === void 0 ? void 0 : toDoList.prepend(li);
        li.prepend(status);
        li.append(close);
    }
    function createUserOption(user) {
        if (userSelect) {
            var option = document.createElement('option');
            option.value = String(user.id);
            option.innerText = user.name;
            userSelect.append(option);
        }
    }
    function removeTodo(todoId) {
        var _a, _b;
        if (toDoList) {
            todos = todos.filter(function (todo) { return todo.id !== todoId; });
            var todo_1 = toDoList.querySelector("[data-id = \"".concat(todoId, "\"]"));
            if (todo_1) {
                todo_1.classList.remove('slide-in');
                todo_1.classList.add('slide-out');
                todo_1.addEventListener('animationend', function () {
                    todo_1.remove(); // После окончания анимации удаляем элемент
                });
                (_a = todo_1.querySelector('input')) === null || _a === void 0 ? void 0 : _a.removeEventListener('change', handleTodoChange);
                (_b = todo_1.querySelector('.close')) === null || _b === void 0 ? void 0 : _b.removeEventListener('click', handleClose);
            }
        }
    }
    function alertError(error) {
        alert(error.message);
    }
    //Event logic
    function initApp() {
        Promise.all([getAllToDos(), getAllUsers()]).then(function (values) {
            todos = values[0], users = values[1];
            //Отправить в разметку
            todos.forEach(function (todo) { return printToDo(todo); });
            users.forEach(function (user) { return createUserOption(user); });
        });
    }
    function handleSubmit(event) {
        event.preventDefault();
        if (form) {
            var userId = Number(form.user.value);
            var todoTitle = form.todo.value.trim(); // Удаляем пробелы в начале и конце
            if (!userId || !todoTitle) {
                alert('Пожалуйста выберите пользователя и введите название задачи');
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
    function handleTodoChange() {
        var parent = this.parentElement;
        if (parent) {
            var todoId = parent.dataset.id;
            var completed = this.checked;
            todoId && toggleTodoComplete(todoId, completed);
        }
    }
    function handleClose() {
        var parent = this.parentElement;
        if (parent) {
            var todoId = parent.dataset.id;
            todoId && deleteTodo(todoId);
        }
    }
    //Async logic
    function getAllToDos() {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch('https://jsonplaceholder.typicode.com/todos?_limit=20')];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_1 = _a.sent();
                        if (error_1 instanceof Error)
                            alertError(error_1);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function getAllUsers() {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch('https://jsonplaceholder.typicode.com/users')];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        error_2 = _a.sent();
                        if (error_2 instanceof Error)
                            alertError(error_2);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function createTodo(todo) {
        return __awaiter(this, void 0, void 0, function () {
            var response, newTOdo, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch('https://jsonplaceholder.typicode.com/todos', {
                                method: 'POST',
                                body: JSON.stringify(todo),
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        newTOdo = _a.sent();
                        printToDo(newTOdo);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        if (error_3 instanceof Error) {
                            alertError(error_3);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function toggleTodoComplete(todoId, completed) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fetch("https://jsonplaceholder.typicode.com/todos/".concat(todoId), {
                                method: 'PATCH',
                                body: JSON.stringify({ completed: completed }),
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error('Failed to connect with server! Please try later!');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        if (error_4 instanceof Error) {
                            alertError(error_4);
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function deleteTodo(todoId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fetch("https://jsonplaceholder.typicode.com/todos/".concat(todoId), {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.ok) {
                            removeTodo(todoId);
                        }
                        else {
                            throw new Error('Failed to connect with server! Please try later!');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        if (error_5 instanceof Error) {
                            alertError(error_5);
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
})();
