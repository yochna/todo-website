 const inbox = document.getElementById("inbox");
        const btn = document.getElementById("addBtn");
        const taskList = document.getElementById("taskList");
        const due = document.getElementById('duedate');
        const sortBtn = document.getElementById('sortBtn');
        const clearCompletedBtn = document.getElementById('clearCompletedBtn');
        const counterText = document.getElementById('counterText');
        const progressBar = document.getElementById('progressBar');
        const toast = document.getElementById('toast');
        
       
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        
        function showToast(message, type = 'success') {
            toast.textContent = message;
            toast.className = 'toast show ' + type;
            
            setTimeout(() => {
                toast.className = 'toast';
            }, 3000);
        }

       
        function saveTask() {
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }

    
        function updateCounter() {
            const total = tasks.length;
            const completed = tasks.filter(t => t.completed).length;
            
            counterText.textContent = `${completed} of ${total} tasks completed • ${total - completed} remaining`;
            
            
            if (total > 0) {
                const progress = (completed / total) * 100;
                progressBar.style.width = `${progress}%`;
            } else {
                progressBar.style.width = '0%';
            }
        }

      
        function formatDate(dateString) {
            if (!dateString || dateString === "No deadline") return "No deadline";
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const date = new Date(dateString);
            date.setHours(0, 0, 0, 0);
            
            if (date.getTime() === today.getTime()) {
                return "Today";
            } else if (date.getTime() === tomorrow.getTime()) {
                return "Tomorrow";
            } else {
                const options = { weekday: 'short', month: 'short', day: 'numeric' };
                return date.toLocaleDateString('en-US', options);
            }
        }

       
        function getPriorityClass(priority) {
            return `priority-${priority}`;
        }

       
        function renderTask() {
            taskList.innerHTML = "";
            
            if (tasks.length === 0) {
                taskList.innerHTML = `
                    <div class="empty-state">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNhZGJhYmQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jbGlwYm9hcmQtbGlzdCI+PHBhdGggZD0iTTggMTJoLjAxIi8+PHBhdGggZD0iTTEyIDEyaC4wMSIvPjxwYXRoIGQ9Ik0xNiAxMmguMDEiLz48cGF0aCBkPSJNOCA4aC4wMSIvPjxwYXRoIGQ9Ik0xMiA4aC4wMSIvPjxwYXRoIGQ9Ik0xNiA4aC4wMSIvPjxwYXRoIGQ9Ik04IDE2aC4wMSIvPjxwYXRoIGQ9Ik0xMiAxNmgxIi8+PHBhdGggZD0iTTE2IDE2aC4wMSIvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgeD0iMiIgeT0iMiIgcng9IjIiIHJ5PSIyIi8+PC9zdmc+" alt="Empty">
                        <h3>No tasks yet!</h3>
                        <p>Add your first task to get started</p>
                    </div>`;
                updateCounter();
                return;
            }

            tasks.forEach((taskObj, index) => {
                const li = document.createElement('li');
                li.dataset.priority = taskObj.priority;
                
                if (taskObj.completed) {
                    li.classList.add('completed');
                }
                
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'task-content';
                contentDiv.innerHTML = `
                    <div>
                        <strong>${taskObj.text}</strong>
                        <div class="task-meta">
                            <span title="Due date">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                                </svg>
                                ${formatDate(taskObj.due)}
                            </span>
                            <span class="priority-tag ${getPriorityClass(taskObj.priority)}" title="Priority">
                                ${taskObj.priority.charAt(0).toUpperCase() + taskObj.priority.slice(1)}
                            </span>
                            <span title="Created on">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                                </svg>
                                ${new Date(taskObj.timestamp).toLocaleDateString()}
                            </span>
                        </div>
                    </div>`;
                
               
                const actionDiv = document.createElement('div');
                actionDiv.className = 'task-actions';
                
              
                const edit = document.createElement('button');
                edit.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>`;
                edit.className = 'edit-btn';
                edit.addEventListener('click', (e) => {
                    e.stopPropagation();
                    editTask(index);
                });
                
                
                const del = document.createElement('button');
                del.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>`;
                del.className = 'delete-btn';
                del.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteTask(index);
                });
                
                
                contentDiv.addEventListener('click', () => {
                    toggleCompleted(index);
                });
                
                actionDiv.appendChild(edit);
                actionDiv.appendChild(del);
                li.appendChild(contentDiv);
                li.appendChild(actionDiv);
                taskList.appendChild(li);
            });
            
            updateCounter();
        }

        function deleteTask(index) {
            if (confirm("Are you sure you want to delete this task?")) {
                const deletedTask = tasks[index];
                tasks.splice(index, 1);
                saveTask();
                renderTask();
                showToast('Task deleted', 'error');
            }
        }

       
        function editTask(index) {
            const li = taskList.children[index];
            const strong = li.querySelector('strong');
            const currentText = strong.textContent;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.style.width = '100%';
            input.style.fontSize = '1.1rem';
            input.style.padding = '0.5rem';
            input.style.border = '2px solid var(--primary)';
            input.style.borderRadius = '6px';
            
            strong.replaceWith(input);
            input.focus();
            
            const save = () => {
                const newTask = input.value.trim();
                if (newTask) {
                    tasks[index] = { 
                        ...tasks[index], 
                        text: newTask,
                        timestamp: new Date().toISOString()
                    };
                    saveTask();
                    renderTask();
                    showToast('Task updated');
                }
            };
            
            input.addEventListener('blur', save);
            input.addEventListener("keydown", (e) => {
                if (e.key === 'Enter') {
                    save();
                }
            });
        }

      
        function toggleCompleted(index) {
            tasks[index].completed = !tasks[index].completed;
            saveTask();
            renderTask();
            
            if (tasks[index].completed) {
                showToast('Task completed!', 'success');
            }
        }

       
        function addTask() {
            const taskText = inbox.value.trim();
            
            if (!taskText) {
                inbox.focus();
                showToast('Please enter a task', 'warning');
                return;
            }
            
            if (tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase())) {
                showToast('This task already exists!', 'warning');
                inbox.focus();
                return;
            }
            
            const now = new Date();
            tasks.push({
                text: taskText,
                timestamp: now.toISOString(),
                due: due.value || "No deadline",
                priority: document.getElementById("priority").value,
                completed: false
            });
            
            saveTask();
            renderTask();
            inbox.value = "";
            inbox.focus();
            due.value = "";
            
            showToast('Task added!', 'success');
        }

        
        sortBtn.addEventListener('click', () => {
            tasks.sort((a, b) => {
                const priorityOrder = { high: 1, medium: 2, low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            saveTask();
            renderTask();
            showToast('Tasks sorted by priority');
        });


        clearCompletedBtn.addEventListener('click', () => {
            const completedCount = tasks.filter(task => task.completed).length;
            if (completedCount === 0) {
                showToast('No completed tasks to clear', 'warning');
                return;
            }
            
            if (confirm(`Are you sure you want to clear ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`)) {
                tasks = tasks.filter(task => !task.completed);
                saveTask();
                renderTask();
                showToast(`Cleared ${completedCount} task${completedCount > 1 ? 's' : ''}`, 'error');
            }
        });

        
        btn.addEventListener('click', addTask);
        inbox.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        const today = new Date().toISOString().split('T')[0];
        due.setAttribute('min', today);
        due.value = today;

       
        renderTask();