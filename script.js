let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let currentlyEditing = null;

        function saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        function addTask() {
            const taskInput = document.getElementById('new-task');
            const text = taskInput.value.trim();
            if (!text) return;

            const task = {
                id: Date.now(),
                text: text,
                completed: false
            };

            tasks.push(task);
            taskInput.value = '';
            renderTasks();
            saveTasks();
            updateProgress();
        }

        function toggleTask(id) {
            tasks = tasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            );
            updateTaskDisplay(id);
            saveTasks();
            updateProgress();
        }

        function updateTaskDisplay(id) {
            const taskElement = document.querySelector(`[data-id="${id}"]`);
            const task = tasks.find(t => t.id === id);

            if (taskElement) {
                taskElement.classList.toggle('completed', task.completed);
                const checkbox = taskElement.querySelector('input[type="checkbox"]');
                checkbox.checked = task.completed;
            }
        }

        function startEdit(id) {
            if (currentlyEditing) {
                finishEdit(currentlyEditing);
            }

            const task = tasks.find(t => t.id === id);
            const taskElement = document.querySelector(`[data-id="${id}"]`);
            const textElement = taskElement.querySelector('.task-text');

            textElement.contentEditable = true;
            textElement.classList.add('editing');
            textElement.focus();

            const range = document.createRange();
            range.selectNodeContents(textElement);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            currentlyEditing = id;
        }

        function finishEdit(id) {
            const task = tasks.find(t => t.id === id);
            const taskElement = document.querySelector(`[data-id="${id}"]`);
            const textElement = taskElement.querySelector('.task-text');

            task.text = textElement.textContent.trim();
            textElement.contentEditable = false;
            textElement.classList.remove('editing');

            saveTasks();
            currentlyEditing = null;
        }

        function deleteTask(id) {
            const taskElement = document.querySelector(`[data-id="${id}"]`);
            taskElement.classList.add('removing');
            setTimeout(() => {
                tasks = tasks.filter(task => task.id !== id);
                renderTasks();
                saveTasks();
                updateProgress();
            }, 300);
        }

        function updateProgress() {
            const total = tasks.length;
            const completed = tasks.filter(t => t.completed).length;
            const progress = total ? Math.round((completed / total) * 100) : 0;

            const progressBar = document.getElementById('progress-bar');
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${progress}%`;
        }

        function renderTasks() {
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = tasks.length ? '' :
                `<div class="task-item">
                    <div class="task-content">
                        <span>Let's Go! Add your first task.</span>
                    </div>
                </div>`;

            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskElement.setAttribute('data-id', task.id);
                taskElement.innerHTML = `
                    <div class="task-content" >
                        <label class="custom-checkbox">
                            <input type="checkbox" ${task.completed ? 'checked' : ''}
                                onchange="toggleTask(${task.id})">
                            <span class="checkmark"></span>
                        </label>
                        <div class="task-text" onclick="handleTaskClick(event, ${task.id})">${task.text}</div>
                    </div>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="startEdit(${task.id})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                            </svg>
                        </button>
                        <button class="action-btn" onclick="deleteTask(${task.id})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                `;
                taskList.appendChild(taskElement);
            });
        }

        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            const moon = document.getElementById('moon-icon');
            const sun = document.getElementById('sun-icon');
            [moon.style.display, sun.style.display] =
                document.body.classList.contains('dark-mode') ?
                    ['none', 'block'] : ['block', 'none'];
        }

        function handleTaskClick(event, taskId) {
            if (event.target.classList.contains('task-text')) {
                toggleTask(taskId);
            }
        }

        // Event Listeners
        document.getElementById('new-task').addEventListener('keypress', e => {
            if (e.key === 'Enter') addTask();
        });

        document.addEventListener('click', (e) => {
            if (currentlyEditing && !e.target.closest(`[data-id="${currentlyEditing}"]`)) {
                finishEdit(currentlyEditing);
            }
        });

        renderTasks();
        updateProgress();