document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date-input');
    const notesInput = document.getElementById('notes-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');

    // --- 기능 추가: 페이지 로드 시 저장된 할 일 목록 불러오기 ---
    loadTasks();

    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const notes = notesInput.value.trim();

        if (taskText === '') {
            alert('해야 할 일을 입력해주세요.');
            return;
        }

        // 할 일을 화면에 그리는 함수 호출
        createTaskElement({
            text: taskText,
            dueDate: dueDate,
            notes: notes,
            completed: false
        });

        // --- 기능 추가: 할 일 추가 후 목록 저장 ---
        saveTasks();

        taskInput.value = '';
        dueDateInput.value = '';
        notesInput.value = '';
        taskInput.focus();
    }

    // 할 일(li) 요소를 생성하고 화면에 추가하는 함수
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) {
            li.classList.add('completed');
        }
        li.dataset.dueDate = task.dueDate;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed');
            // --- 기능 추가: 완료 상태 변경 시 목록 저장 ---
            saveTasks();
        });

        const taskDetails = document.createElement('div');
        taskDetails.className = 'task-details';

        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = task.text;

        const taskMeta = document.createElement('div');
        taskMeta.className = 'task-meta';

        if (task.dueDate) {
            const dueDateSpan = document.createElement('span');
            dueDateSpan.className = 'due-date';
            dueDateSpan.textContent = `마감일: ${task.dueDate}`;
            taskMeta.appendChild(dueDateSpan);
        }

        if (task.notes) {
            const notesSpan = document.createElement('span');
            notesSpan.className = 'notes';
            notesSpan.textContent = `비고: ${task.notes}`;
            taskMeta.appendChild(notesSpan);
        }
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '✖';
        deleteBtn.addEventListener('click', () => {
            li.remove();
            // --- 기능 추가: 삭제 시 목록 저장 ---
            saveTasks();
        });
        
        taskDetails.appendChild(taskTextSpan);
        if(task.dueDate || task.notes) {
            taskDetails.appendChild(taskMeta);
        }

        li.appendChild(checkbox);
        li.appendChild(taskDetails);
        li.appendChild(deleteBtn);
        
        // 정렬 로직
        const existingTasks = taskList.querySelectorAll('.task-item');
        let inserted = false;

        if (task.dueDate) {
            for (const existingTask of existingTasks) {
                const existingDueDate = existingTask.dataset.dueDate;
                if (!existingDueDate || task.dueDate < existingDueDate) {
                    taskList.insertBefore(li, existingTask);
                    inserted = true;
                    break;
                }
            }
        }

        if (!inserted) {
            taskList.appendChild(li);
        }
    }

    // --- 기능 추가: 현재 할 일 목록을 로컬 스토리지에 저장하는 함수 ---
    function saveTasks() {
        const tasks = [];
        const taskItems = taskList.querySelectorAll('.task-item');

        taskItems.forEach(item => {
            tasks.push({
                text: item.querySelector('.task-text').textContent,
                dueDate: item.dataset.dueDate,
                notes: item.querySelector('.notes')?.textContent.replace('비고: ', '') || '',
                completed: item.classList.contains('completed')
            });
        });

        // 자바스크립트 배열을 JSON 문자열로 변환하여 'tasks'라는 이름으로 저장
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // --- 기능 추가: 로컬 스토리지에서 할 일 목록을 불러오는 함수 ---
    function loadTasks() {
        // 'tasks' 이름으로 저장된 데이터를 가져옴
        const savedTasks = localStorage.getItem('tasks');

        if (savedTasks) {
            // JSON 문자열을 다시 자바스크립트 배열로 변환
            const tasks = JSON.parse(savedTasks);
            tasks.forEach(task => createTaskElement(task));
        }
    }
});