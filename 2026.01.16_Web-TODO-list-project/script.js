// step 1: 날자를 화면에 표시하기
function dateUpdate() {
    const dateElement = document.getElementById('date-display');
    const now = new Date(); // 새 날자객체를 창조한다. 

    // 설정객체를 창조
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    // 화면에 날자를 출력한다.
    dateElement.textContent = now.toLocaleDateString('en-US', options);

    console.log('success update date', dateElement.textContent);
}

// step 2: 기본 UI 상호작용 - 할 일 관리
let todos = []; // 할 일 배렬 창조
let currentFilter = 'all'; // 현재 필터상태

// DOM 요소 가져오기
const todoContainer = document.getElementById('todo-container');
const todoForm = document.querySelector('.input-section');
const todoInput = document.querySelector('.input-border');

// 로컬스토리쥐 저장함수 
function saveTodos() {
    localStorage.setItem('todoApp_todos', JSON.stringify(todos));
    console.log('saved to localstorage:', todos);
}

// 로컬스토리쥐에서 불러오기함수
function loadTodos() {
    const saved = localStorage.getItem('todoApp_todos');
    if (saved) {
        try {
            todos = JSON.parse(saved);
            console.log('load from localStorage:', todos);
        } catch (error) {
            console.log('loading error:', error);
        }
    } else {
        console.log('no saved date');
    }
}

// 하루 할 일 요소를 생성하는 함수
function createTodoElement(todoObj, index) {
    // div 요소생성
    const todoItem = document.createElement('div');

    if (todoObj.completed === true) {
        todoItem.className = "todo-Item completed";
    } else {
        todoItem.className = "todo-Item";
    }
    // 쉽게 참조할수 있도록 인덱스를 data 속성으로 저장
    todoItem.setAttribute('data-index', index);
    todoItem.setAttribute('data-id', todoObj.id);

    //체크박스상태 결정
    let checkboxChecked = '';
    if (todoObj.completed === true) {
        checkboxChecked = 'checked';
    }

    // 할 일 항목의 html구조 생성
    todoItem.innerHTML = `
        <div class="todo-content">
            <input type="checkbox" class="todo-checkbox" ${checkboxChecked}> 
            <span class="todo-text">${todoObj.text}</span>
        </div>
        <button class="todo-delete-btn">
            <i class="fas fa-trash"></i>
        </button>
    `;

    // 체크박스 eventListener 추가
    const checkbox = todoItem.querySelector('.todo-checkbox');
    checkbox.addEventListener('click', function () {
        toggleTodoComplete(index);
    });

    // 삭제단추에 eventListener 추가
    const deleteBtn = todoItem.querySelector('.todo-delete-btn');
    deleteBtn.addEventListener('click', function () {
        deleteTodo(index);
    });

    return todoItem;
}

// 필더링된 할 일 목록을 반환하는 함수
function getFilteredTodos() {
    if (currentFilter === 'all') {
        return todos;
    }

    let filteredArray = [];

    if (currentFilter === 'completed') {
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].completed === true) {
                filteredArray.push(todos[i]);
            }
        }
    }
    else if (currentFilter === 'uncompleted') {
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].completed === false) {
                filteredArray.push(todos[i]);
            }
        }
    }
    return filteredArray;
}

// 활성화된 필드 버튼 스타일 
function updateActiveButton() {
    const allButtons = document.querySelectorAll('.btn-todo-list');
    for (let i = 0; i < allButtons.length; i++) {
        allButtons[i].classList.remove('active');
    }

    let activeButtonSelector = '';
    if (currentFilter === 'all') {
        activeButtonSelector = '[data-action="all-todo-list"]';
    } else if (currentFilter === 'uncompleted') {
        activeButtonSelector = '[data-action="must-do-list"]';
    } else if (currentFilter === 'completed') {
        activeButtonSelector = '[data-action="completed-list"]';
    }

    const activeButton = document.querySelector(activeButtonSelector);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

function toggleTodoComplete(index) {
    if (index >= 0 && index < todos.length) {
        // 현재 체크박크상태를 가져오기
        const currentStatus = todos[index].completed;

        //상태변경
        if (currentStatus === true) {
            todos[index].completed = false;
        } else {
            todos[index].completed = true;
        }
        saveTodos();
        renderTodos();
    }
}

// 할 일 목록을 삭제하는 함수
function deleteTodo(index) {
    todos.splice(index, 1); // 배렬에서 지정된 첨수의 항목 1개를 제거
    console.log('delete task');

    saveTodos();
    renderTodos(); // 삭제후 화면 업데이트
}
// 미완료된 일들 개수세는 함수
function updateUncompletedCount() {
    const countElement = document.getElementById('Uncompleted-count');

    if (countElement) {
        let count = 0;
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].completed === false) count++;
        }
        countElement.textContent = count;
    }
}

// 모든 할 일을 화면에 redering 하는 함수
function renderTodos() {
    todoContainer.innerHTML = ''; // 현재내용 지우기

    const filteredTodos = getFilteredTodos();

    if (todos.length === 0) {
        let message = '';
        if (currentFilter === 'uncompleted') {
            message = 'No uncompleted tasks!';
        } else if (currentFilter === 'completed') {
            message = 'No completed tasks!';
        } else {
            message = 'can not find tasks. add new tasks.';
        }

        todoContainer.innerHTML = `<div class="no-tasks">${message}</div>`;
        updateActiveButton();
        updateUncompletedCount();
        return;
    }

    // 잘 리해가 안됐던 부분 !important
    filteredTodos.forEach((todo) => {
        let realIndex = -1;
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].id === todo.id) {
                realIndex = i;
                break;
            }
        }

        if (realIndex != -1) {
            const todoElement = createTodoElement(todo, realIndex);
            todoContainer.appendChild(todoElement);
        }
    });

    updateUncompletedCount();
    updateActiveButton();
    todoContainer.scrollTop = todoContainer.scrollHeight;
}

// 새 할일 항목을 추가하는 함수
function addTodo() {
    const text = todoInput.value.trim(); // 입력값 가져오기

    if (text === '') {
        alert('add tasks!');
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
    }

    todos.push(newTodo); // 새 작업을 배렬에 추가

    saveTodos();
    console.log('add task:', text);
    console.log('current list:', todos);

    renderTodos(); // 새 작업으로 화면 업데이트

    // 입력후 입력창비여지게
    todoInput.value = '';
    todoInput.focus();
}

// enter 나 add 단추를 클릭했을때 동작설정함수
function setupEventListeners() {
    todoForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addTodo();
    });
    // clearAll 버튼을 클릭했을때 동작
    const clearAllBtn = document.querySelector('.btn-clear-all');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllTodos);
    }

    const allButton = document.querySelector('[data-action="all-todo-list"]');
    const uncompletedButton = document.querySelector('[data-action="must-do-list"]');
    const completedButton = document.querySelector('[data-action="completed-list"]')

    allButton.addEventListener('click', function () {
        handleFilterBtn('all');
    });
    uncompletedButton.addEventListener('click', function () {
        handleFilterBtn('uncompleted');
    });
    completedButton.addEventListener('click', function () {
        handleFilterBtn('completed');
    });

    console.log('completed setting of EventListener');
}

// 필더링버튼이 클릭되였을때 함수 
function handleFilterBtn(filterType) {
    currentFilter = filterType;
    renderTodos();
}

// 동적으로 생성된 요소를 위한 style 추가 함수
function addTodoStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .todo-Item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 15px;
            margin-bottom: 10px;
            background-color: #41386D;
            border-radius: 5px;
            border-left: 4px solid #05E392;
        }

        /* 체크박스기능을 위하여 추가된 CSS */
        .todo-Item.completed {
            opacity: 0.7;
            border-left-color: #888;
        }

        .todo-content {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .todo-checkbox {
            width: 18px;  /* 체크박스 크기 추가 */
            height: 18px; /* 체크박스 크기 추가 */
            cursor: pointer; /* 커서 모양 추가 */
        }

        .todo-text {
            font-size: 16px;
            color: #E2ECEE;
        }

        /* 체크박스기능을 위하여 추가된 CSS */
        .todo-Item.completed .todo-text {
            text-decoration: line-through;
            color: #aaa;
        }

        .todo-delete-btn {
            background: none;
            border: none;
            color: #FF4757;
            font-size: 16px;
            cursor: pointer;
            padding: 5px;
            border-radius: 3px;
        }

        .todo-delete-btn:hover {
            background-color: rgba(255, 71, 87, 0.1);
        }

        .no-tasks {
            text-align: center;
            padding: 40px 20px;
            color: #888;
            font-style: italic;
        }
        
        .btn-todo-list.active {
            background-color: #05E392;
            color: #242C3F;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style); // 문서 head 부에 style 요소 추가
    console.log('completed add style');
}

// application 초기화
function init() {
    loadTodos();
    dateUpdate();
    addTodoStyles();
    setupEventListeners();
    renderTodos();
}

// DOM이 완전히 로드되면 application 시작
document.addEventListener('DOMContentLoaded', init);

function clearAllTodos() {
    if (confirm('Do you want to clear all tasks?')) {
        todos = [];
        saveTodos();
        renderTodos();
    }
}