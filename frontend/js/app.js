const API_URL = 'http://localhost:3000/api/todos';
let currentFilter = 'all';

const getTodos = async () => {
    const res = await fetch(API_URL);
    const todos = await res.json();

    let filtered = todos;
    if (currentFilter === 'active') {
        filtered = todos.filter(todo => todo.completed === 0);
    } else if (currentFilter === 'completed') {
        filtered = todos.filter(todo => todo.completed === 1);
    }

    renderTodos(filtered, todos.length);
};

const renderTodos = (todos, totalCount = todos.length) => {
    const list = document.querySelector('.list-tasks');
    const emptyTips = document.querySelector('.empty-tips-board');
    const markAll = document.querySelector('.mark-all');
    const listBatch = document.querySelector('.list-batch');
    const listDatasave = document.querySelector('.list-datasave');
    const countTasks = document.querySelector('.board-count-tasks');
    list.innerHTML = '';

    if (totalCount === 0) {
        emptyTips.classList.remove('hidden');
        markAll.style.display = 'none';
        listBatch.classList.add('hidden');
        listDatasave.classList.add('hidden');
        countTasks.innerHTML = '';
    } else {
        emptyTips.classList.add('hidden');
        markAll.style.display = 'flex';
        listBatch.classList.remove('hidden');
        listDatasave.classList.remove('hidden');
        const remaining = todos.filter(todo => todo.completed === 0 || todo.completed === null).length;
        countTasks.innerHTML = `<p>${remaining} item${remaining !== 1 ? 's' : ''} remaining</p>`;
    }

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.classList.add('task-item');
        li.dataset.id = todo.id;
        if (todo.completed) li.classList.add('task-completed');
        li.innerHTML = `
            <div class="task-item-row">
                <div class="task-check ${todo.completed ? 'checked' : ''}">
                    ${todo.completed ? '<img src="img/check.svg" alt="check">' : ''}
                </div>
                <span class="task-title">${todo.title}</span>
                <div class="task-delete">
                    <img src="/frontend/img/delete.svg" alt="delete">
                </div>
            </div>
        `;

        li.addEventListener('dblclick', (e) => {
            if (e.target.closest('.task-check') || e.target.closest('.task-delete')) return;
            const existing = li.querySelector('.task-edit-container');
            if (existing) {
                existing.remove();
                return;
            }
            const editContainer = document.createElement('div');
            editContainer.classList.add('task-edit-container');
            editContainer.innerHTML = `
                <input class="task-edit-input" type="text" value="${todo.title}" />
                <div class="task-edit-btn">
                    <img src="/frontend/img/Update.svg" alt="save">
                </div>
            `;
            li.appendChild(editContainer);

            const editInput = editContainer.querySelector('.task-edit-input');
            editInput.focus();

            const saveEdit = async () => {
                const newTitle = editInput.value.trim();
                if (!newTitle) return;
                await updateTodo(todo.id, newTitle);
            };

            editContainer.querySelector('.task-edit-btn').addEventListener('click', saveEdit);
            editInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') editContainer.remove();
            });
        });
        li.querySelector('.task-check').addEventListener('click', () => {
            const isCompleted = li.classList.contains('task-completed');
            toggleComplete(todo.id, isCompleted ? 0 : 1);
        });

        li.querySelector('.task-delete').addEventListener('click', () => {
            deleteTodo(todo.id);
        });

        list.appendChild(li);
    });
};

const addTodo = async (title) => {
    if (!title.trim()) return;
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });
    getTodos();
};

const updateTodo = async (id, title) => {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });
    getTodos();
};

const toggleComplete = async (id, completed) => {
    await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
    });
    const li = document.querySelector(`li[data-id="${id}"]`);
    if (!li) return;

    const check = li.querySelector('.task-check');

    if (completed === 1) {
        li.classList.add('task-completed');
        check.classList.add('checked');
        check.innerHTML = '<img src="img/check.svg" alt="check">';
    } else {
        li.classList.remove('task-completed');
        check.classList.remove('checked');
        check.innerHTML = '';
    }

    const allItems = document.querySelectorAll('.list-tasks .task-item');
    const remaining = Array.from(allItems).filter(item => !item.classList.contains('task-completed')).length;
    const countTasks = document.querySelector('.board-count-tasks');
    countTasks.innerHTML = `<p>${remaining} item${remaining !== 1 ? 's' : ''} remaining</p>`;
};

const deleteTodo = async (id) => {
    const confirmar = window.confirm('¿Eliminar esta tarea?');
    if (!confirmar) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    getTodos();
};

const markAllComplete = async () => {
    await fetch(`${API_URL}/complete-all`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
    });
    getTodos();
};

const deleteAllTodos = async () => {
    await fetch(`${API_URL}/delete-all`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    getTodos();
};

const showConfirmModal = (message, onConfirm) => {
    const overlay = document.querySelector('.alert.overlay');
    const modalMessage = document.querySelector('.alert-mark-all p');
    const btnOk = document.querySelector('.alert-buttons button:last-child');
    const btnCancel = document.querySelector('.alert-buttons button:first-child');

    modalMessage.textContent = message;
    overlay.style.display = 'flex';

    btnOk.onclick = () => {
        overlay.style.display = 'none';
        onConfirm();
    };

    btnCancel.onclick = () => {
        overlay.style.display = 'none';
    };
};

document.addEventListener('DOMContentLoaded', () => {
    getTodos();

    const input = document.querySelector('.task-input');
    const btnAdd = document.querySelector('.add-button');
    const tipContainer = document.querySelector('.tip-container');
    const about = document.querySelector('.about');
    const popupNav = document.querySelector('.poput-nav');
    const markAll = document.querySelector('.mark-all');
    const finishAll = document.querySelector('.finish-all');
    const clearAll = document.querySelector('.clear-all');

    about.addEventListener('click', () => {
        popupNav.style.display = popupNav.style.display === 'block' ? 'none' : 'block';
    });

    btnAdd.addEventListener('click', (e) => {
        e.preventDefault();
        if (!input.value.trim()) {
            tipContainer.style.display = 'flex';
            return;
        }
        tipContainer.style.display = 'none';
        addTodo(input.value);
        input.value = '';
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (!input.value.trim()) {
                tipContainer.style.display = 'flex';
                return;
            }
            tipContainer.style.display = 'none';
            addTodo(input.value);
            input.value = '';
        }
    });

    markAll.addEventListener('click', () => {
        showConfirmModal('Confirm to mark all as completed?', markAllComplete);
    });

    if (finishAll) {
        finishAll.addEventListener('click', () => {
            showConfirmModal('Confirm to mark all as completed?', markAllComplete);
        });
    }

    if (clearAll) {
        clearAll.addEventListener('click', () => {
            showConfirmModal('Confirm to delete all tasks?', deleteAllTodos);
        });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active-filter'));
            btn.classList.add('active-filter');
            currentFilter = btn.dataset.filter;
            getTodos();
        });
    });
});