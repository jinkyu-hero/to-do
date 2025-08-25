document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date-input');
    const notesInput = document.getElementById('notes-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');

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

        const li = document.createElement('li');
        li.className = 'task-item';
        // 나중에 정렬을 위해 마감일 데이터를 li 요소에 저장
        li.dataset.dueDate = dueDate;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed');
        });

        const taskDetails = document.createElement('div');
        taskDetails.className = 'task-details';

        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = taskText;

        const taskMeta = document.createElement('div');
        taskMeta.className = 'task-meta';

        if (dueDate) {
            const dueDateSpan = document.createElement('span');
            dueDateSpan.className = 'due-date';
            dueDateSpan.textContent = `마감일: ${dueDate}`;
            taskMeta.appendChild(dueDateSpan);
        }

        if (notes) {
            const notesSpan = document.createElement('span');
            notesSpan.className = 'notes';
            notesSpan.textContent = `비고: ${notes}`;
            taskMeta.appendChild(notesSpan);
        }
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '✖';
        deleteBtn.addEventListener('click', () => {
            li.remove();
        });
        
        taskDetails.appendChild(taskTextSpan);
        if(dueDate || notes) {
            taskDetails.appendChild(taskMeta);
        }

        li.appendChild(checkbox);
        li.appendChild(taskDetails);
        li.appendChild(deleteBtn);
        
        // --- 정렬 로직 시작 ---
        const existingTasks = taskList.querySelectorAll('.task-item');
        let inserted = false;

        // 마감일이 있는 경우에만 정렬 시도
        if (dueDate) {
            for (const existingTask of existingTasks) {
                const existingDueDate = existingTask.dataset.dueDate;
                // 기존 항목에 마감일이 없거나, 새 항목의 마감일이 더 빠르면 그 앞에 삽입
                if (!existingDueDate || dueDate < existingDueDate) {
                    taskList.insertBefore(li, existingTask);
                    inserted = true;
                    break;
                }
            }
        }

        // 삽입되지 않았다면 (마감일이 가장 늦거나, 마감일이 없는 경우) 맨 뒤에 추가
        if (!inserted) {
            taskList.appendChild(li);
        }
        // --- 정렬 로직 끝 ---

        taskInput.value = '';
        dueDateInput.value = '';
        notesInput.value = '';
        taskInput.focus();
    }
});