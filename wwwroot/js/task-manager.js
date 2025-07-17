class TaskManager {
    constructor() {
        this.maxObjectives = 0;
        this.currentObjectiveIndex = 0;
        this.taskType = 'SMALL';
        this.isEditMode = false;
        this.taskModal = document.getElementById('taskModal');

        this.setupEventHandlers();
        this.initElements();
        this.initProgressCircles();
    }

    initElements() {
        // Common modal for Add/Edit
        this.modal = new bootstrap.Modal(this.taskModal);
        this.taskModalTitle = document.getElementById('taskModalTitle');
        this.taskForm = document.getElementById('taskForm');
        this.taskIdInput = document.getElementById('taskId');
        this.taskNameInput = document.getElementById('taskName');
        this.taskDateInput = document.getElementById('dueDate');
        this.addObjectiveButton = document.getElementById('addObjectiveBtn');
        this.objectivesContainer = document.getElementById('objectivesContainer');
        this.saveBtn = document.getElementById('saveBtn');

        // Buttons
        this.addTaskButtons = document.querySelectorAll('#add-task-btn');
        this.editButtons = document.querySelectorAll('#update-task-btn');
        this.deleteButtons = document.querySelectorAll('#delete-task-btn');
        this.syncBtn = document.getElementById('sync');
        this.canvasApiKeyForm = document.getElementById('CanvasApiKeyForm');

        // Objectives
        this.objectiveCheckboxes = document.querySelectorAll('.objective-item-checkbox');
    }

    setupEventHandlers() {
        // Edit canvas key
        document.addEventListener('click', (e) => {
            if (e.target.closest('#edit-key')) {
                this.editCanvasKey(e);
            }
        });

        // Open Add Task Modal
        document.addEventListener('click', (e) => {
            if (e.target.closest('#add-task-btn')) {
                this.openAddTaskModal(e.target.closest('#add-task-btn'));
            }
        });

        // Open Edit Task Modal
        document.addEventListener('click', (e) => {
            if (e.target.closest('#update-task-btn')) {
                this.openEditTaskModal(e.target.closest('#update-task-btn'));
            }
        });

        // Delete Task
        document.addEventListener('click', (e) => {
            if (e.target.closest('#delete-task-btn')) {
                this.deleteTask(e.target.closest('#delete-task-btn'));
            }
        });

        // Add Objective
        document.addEventListener('click', (e) => {
            if (e.target.closest('#addObjectiveBtn')) {
                this.addObjective();
            }
        });

        // Save Tasks
        document.addEventListener('click', (e) => {
            if (e.target.closest('#saveBtn')) {
                this.saveTasks(e);
            }
        });

        // Sync with Canvas
        const syncBtn = document.getElementById('sync');
        if (syncBtn) {
            syncBtn.addEventListener('click', () => this.sync());
        }

        // Canvas API key form
        const apiKeyInput = document.getElementById('CanvasApiKeyForm');
        if (apiKeyInput) {
            apiKeyInput.addEventListener('submit', (e) => this.setCanvasAPIKey(e));
        }

        // Reset form on modal close
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.addEventListener('hidden.bs.modal', () => this.resetForm());
        }

        // Delegate objective checkbox change
        document.addEventListener('change', (e) => {
            if (e.target.matches('.objective-item-checkbox')) {
                this.updateIsComplete(e.target);
            }
        });
    }

    rebindObjectiveCheckboxes() {
        this.objectiveCheckboxes = document.querySelectorAll('.objective-item-checkbox');

        this.objectiveCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateIsComplete(checkbox));
        });
    }

    openAddTaskModal(button) {
        this.taskModalTitle.textContent = 'Add a new Task';
        this.maxObjectives = parseInt(button.getAttribute('data-objective-count'));
        this.modal.show();
    }

    async openEditTaskModal(button) {
        const taskId = button.getAttribute('data-task-id');
        this.isEditMode = true;
        this.taskModalTitle.textContent = 'Edit Task';

        try {
            const response = await fetch(`/api/tasks/${taskId}`);
            if (!response.ok) throw new Error('Failed to load task');

            const task = await response.json();

            this.taskIdInput.value = task.id;
            this.taskNameInput.value = task.name;
            const date = new Date(task.dueDate);
            const localDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
            this.taskDateInput.value = localDateTime;
            this.objectivesContainer.innerHTML = '';

            this.currentObjectiveIndex = task.objectives.length;
            this.maxObjectives = parseInt(button.getAttribute('data-objective-count'));
            this.addObjectiveButton.disabled = false;

            // Manually create objective input groups for all existing objectives
            task.objectives.forEach((obj, index) => {
                const div = document.createElement('div');
                div.className = 'mb-2 objective-input-group';
                div.innerHTML = `
                    <table class="objective-table">
                        <tr>
                            <td><label>Name</label></td>
                            <td><input type="text" name="objectiveName${index}" value="${obj.name}" required></td>
                        </tr>
                        <tr>
                            <td><label>Hours to complete</label></td>
                            <td><input type="number" name="objectiveHours${index}" value="${obj.hours}" required></td>
                        </tr>
                        <tr>
                            <td><label>Is Objective Complete?</label></td>
                            <td>
                                <input type="checkbox" class="form-check-input" name="objectiveIsComplete${index}" ${obj.isComplete ? 'checked' : ''}>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" style="text-align: right;">
                                <button type="button" class="btn btn-sm btn-danger delete-objective">Delete</button>
                            </td>
                        </tr>
                    </table>
                `;

                div.querySelector('.delete-objective').addEventListener('click', () => {
                    div.remove();
                });

                this.objectivesContainer.appendChild(div);
            });
            this.modal.show();

        } catch (error) {
            Swal.fire('Error!', 'Issue fetching Task please try again... ', 'error');
        }
    }

    addObjective() {
        if (this.currentObjectiveIndex >= this.maxObjectives) {
            Swal.fire({
                title: 'Error!',
                text: 'Maximum number of objectives reached for this task',
                icon: 'error',
                timer: 1000,
                showConfirmButton: false,
                customClass: {
                    popup: 'swal-popup',
                    confirmButton: 'swal-confirm-btn',
                    cancelButton: 'swal-cancel-btn' 
                },
            });
            return;
        }

        // Dynamically create a new objective group and append it to the dom
        const div = document.createElement('div');
        div.className = 'mb-2 objective-input-group';
        div.innerHTML = `
            <table class="objective-table">
                <tr>
                    <td><label>Name</label></td>
                    <td><input type="text" name="objectiveName${this.currentObjectiveIndex}" required></td>
                </tr>
                <tr>
                    <td><label>Hours to complete</label></td>
                    <td><input type="number" name="objectiveHours${this.currentObjectiveIndex}" required></td>
                </tr>
                <tr>
                    <td><label>Is Objective Complete?</label></td>
                    <td>
                        <input type="checkbox" class="form-check-input" name="objectiveIsComplete${this.currentObjectiveIndex}">
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: right;">
                        <button type="button" class="btn btn-sm btn-danger delete-objective">Delete</button>
                    </td>
                </tr>
            </table>
        `;

        div.querySelector('.delete-objective').addEventListener('click', () => {
            div.remove();
        });

        this.objectivesContainer.appendChild(div);
        this.currentObjectiveIndex++;

        if (this.currentObjectiveIndex >= this.maxObjectives) {
            this.addObjectiveButton.disabled = true;
        }
    }

    // Reset the form upon the modal closing
    resetForm() {
        this.taskForm.reset();
        this.objectivesContainer.innerHTML = '';
        this.currentObjectiveIndex = 0;
        this.maxObjectives = 0;
        this.addObjectiveButton.disabled = false;
        this.isEditMode = false;
    }

    // Called right before creating/updating a task. Fetches all of the required data and formats in a way the backend accepts.
    collectTaskData() {
        const objectives = [];
        const objectiveInputs = document.querySelectorAll('.objective-input-group');

        objectiveInputs.forEach((group, index) => {
            const name = group.querySelector(`input[name="objectiveName${index}"]`).value;
            const hours = parseInt(group.querySelector(`input[name="objectiveHours${index}"]`).value);
            const iscomplete = group.querySelector(`input[name="objectiveIsComplete${index}"]`).checked;
            objectives.push({ Name: name, Hours: hours, IsComplete: iscomplete});
        });

        // Figure out the tasktype by the amount of allowed objectives
        this.taskType = this.maxObjectives === 2 ? 'SMALL' :
                        this.maxObjectives === 4 ? 'MEDIUM' : 'LARGE';

        return {
            Id: this.taskIdInput.value ? this.taskIdInput.value : 0,
            Name: this.taskNameInput.value,
            DueDate: new Date(this.taskDateInput.value).toISOString(),
            Objectives: objectives,
            TaskType: this.taskType
        };
    }

    // Dynamically update the DOM when updating a task. Very proud of this (was hell to write never forget)
    updateTaskDom(updatedTaskData) {
        const rawDate = new Date(updatedTaskData.dueDate);
        const formattedDate = rawDate.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(',', '');

        // Update the Task Name
        const taskHeader = Array.from(document.querySelectorAll('.task-header-centre')).find(th => th.dataset.taskId == updatedTaskData.id);
        const taskNameElement = taskHeader.querySelector('h4');
        taskNameElement.textContent = updatedTaskData.name;

        if (updatedTaskData.objectives.length > 0) {
            // Update Objectives
            if (updatedTaskData.taskType === 'SMALL') {
                //Since taskType = small the .percentage div will always exist.
                var dueDiv = Array.from(document.querySelectorAll('.percentage')).find(th => th.dataset.taskId == updatedTaskData.id);
                const dueElement = dueDiv.querySelectorAll('h5');
                const h5ToUpdate = dueElement[1];
                h5ToUpdate.innerText = formattedDate;
                const smallObjectivesWrapper = Array.from(document.querySelectorAll('.objectives-list')).find(ol => ol.dataset.taskId == updatedTaskData.id);
                smallObjectivesWrapper.innerHTML = '';

                // Re-populate the objectives list
                if (updatedTaskData.objectives && updatedTaskData.objectives.length > 0) {
                    updatedTaskData.objectives.forEach(obj => {
                        const isChecked = obj.isComplete ? 'checked' : '';
                        smallObjectivesWrapper.insertAdjacentHTML('beforeend', `
                            <div class="objective-item">
                                <div class="objective-header">
                                    <input class="objective-item-checkbox" 
                                        data-objective-id="${obj.id}" 
                                        type="checkbox" ${isChecked}>
                                    <h4 class="objective-name">${obj.name}</h4>
                                </div>
                            </div>
                        `);
                    });
                }

                // Rebind the checkboxes' event listeners
                this.rebindObjectiveCheckboxes();

                // Update the progress circles
                if (updatedTaskData.objectives && updatedTaskData.objectives.length > 0) {
                    updatedTaskData.objectives.forEach(obj => {
                        const checkbox = document.querySelector(`input.objective-item-checkbox[data-objective-id="${obj.id}"]`);
                        if (checkbox) {
                            this.UpdateProgressCircle(checkbox);
                        }
                    });
                }

            } else if (updatedTaskData.taskType === 'MEDIUM' || updatedTaskData.taskType === 'LARGE') {
                const mediumObjectivesWrapper = Array.from(document.querySelectorAll('.medium-objectives-list')).find(ol => ol.dataset.taskId == updatedTaskData.id);
                const noObjectivesDiv = mediumObjectivesWrapper.querySelector('.no-medium-large-objectives');
                
                if (noObjectivesDiv) {
                    noObjectivesDiv.remove();
                }

                // Reset the left and right objective containers so I have a blank slate
                let leftContainer = mediumObjectivesWrapper.querySelector('.objective-left');
                if (leftContainer) {
                    leftContainer.innerHTML = '';
                } else {
                    leftContainer = document.createElement('div');
                    leftContainer.classList.add('objective-left');
                    mediumObjectivesWrapper.appendChild(leftContainer);
                }

                let rightContainer = mediumObjectivesWrapper.querySelector('.objective-right');
                if (rightContainer) {
                    rightContainer.innerHTML = '';
                } else {
                    rightContainer = document.createElement('div');
                    rightContainer.classList.add('objective-right');
                    mediumObjectivesWrapper.appendChild(rightContainer);
                }

                const objectives = updatedTaskData.objectives || [];
                const leftObjectives = objectives.slice(0, 2);
                const rightObjectives = objectives.slice(2, 4);

                // This is a helper method. It gets called twice, once for the left side and once for the right side. 
                // Render the objectives firstly. If there is only 1 objective render the objective-item-placeholder for the second.
                const renderObjectives = (container, list) => {
                    list.forEach(obj => {
                        const isChecked = obj.isComplete ? 'checked' : '';
                        container.insertAdjacentHTML('beforeend', `
                            <div class="objective-item">
                                <div class="objective-header">
                                    <input class="objective-item-checkbox" 
                                        data-objective-id="${obj.id}" 
                                        type="checkbox" ${isChecked}>
                                    <h4 class="objective-name">${obj.name}</h4>
                                </div>
                            </div>
                        `);
                    });

                    // Add placeholders if needed
                    const placeholdersNeeded = 2 - list.length;
                    for (let i = 0; i < placeholdersNeeded; i++) {
                        container.insertAdjacentHTML('beforeend', `
                            <div class="objective-item-placeholder">
                                <!-- placeholder -->
                            </div>
                        `);
                    }
                };

                // Calls to the above method.
                renderObjectives(leftContainer, leftObjectives);
                renderObjectives(rightContainer, rightObjectives);

                // Rebind the checkboxes' event listeners !!IMPORTANT
                this.rebindObjectiveCheckboxes();

                // Update the progress circles
                if (updatedTaskData.objectives && updatedTaskData.objectives.length > 0) {
                    updatedTaskData.objectives.forEach(obj => {
                        const checkbox = document.querySelector(`input.objective-item-checkbox[data-objective-id="${obj.id}"]`);
                        if (checkbox) {
                            this.UpdateProgressCircle(checkbox, formattedDate, updatedTaskData.taskType);
                        }
                    });
                }
            }
        } else {
            // No Objectives 
            if (updatedTaskData.taskType === 'SMALL') {
                const smallObjectivesWrapper = Array.from(document.querySelectorAll('.objectives-list')).find(ol => ol.dataset.taskId == updatedTaskData.id);
                smallObjectivesWrapper.innerHTML = '';
                smallObjectivesWrapper.insertAdjacentHTML('beforeend', `
                    <h4>Add some Objectives to track your progress!</h4>
                `);
            } else if (updatedTaskData.taskType === 'MEDIUM' || updatedTaskData.taskType === 'LARGE') {
                const mediumObjectivesWrapper = Array.from(document.querySelectorAll('.medium-objectives-list')).find(ol => ol.dataset.taskId == updatedTaskData.id);
                mediumObjectivesWrapper.innerHTML = '';
                mediumObjectivesWrapper.insertAdjacentHTML('beforeend', `
                    <div class="no-medium-large-objectives">
                        <h4>Due: ${formattedDate}</h4>
                        <h5>Add some Objectives to track your progress!</h5>
                    </div>
                `);
            }
        }

        this.modal.hide();
    }

    async saveTasks(e) {
        e.preventDefault();
        this.saveBtn.disabled = true;

        try {
            // Collect the entered data and determine if creating or updating.
            const taskData = this.collectTaskData();
            const method = this.isEditMode ? 'PUT' : 'POST';
            const endpoint = this.isEditMode ? `/api/tasks/${taskData.Id}` : '/api/tasks';

            const response = await fetch(endpoint, { 
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) throw new Error('Failed to save task');

            await Swal.fire({
                icon: 'success',
                title: this.isEditMode ? 'Task Updated!' : 'Task Saved!',
                text: 'Your task has been saved successfully.',
                showConfirmButton: false,
                customClass: {
                    popup: 'swal-popup',
                    confirmButton: 'swal-confirm-btn',
                    cancelButton: 'swal-cancel-btn' 
                },
                timer: 1500
            });

            // If the task is being updated I can dynamically update it.
            if (this.isEditMode) {
                const createdTask = await response.json();
                this.updateTaskDom(createdTask);
            } else {
                // I have to refresh the window if a new task is being created. This is because there was no way to create
                // the task-headers and place them in the correct spot as previously there was a _NoTaskPartial
                window.location.reload();
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'An error occurred while saving the task.'
            });
        } finally {
            this.saveBtn.disabled = false;
        }
    }

    async deleteTask(button) {
        const taskId = button.getAttribute('task-id');
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'This will permanently delete this task',
                icon: 'warning',
                showCancelButton: true,
                customClass: {
                    popup: 'swal-popup',
                    confirmButton: 'swal-confirm-btn',
                    cancelButton: 'swal-cancel-btn' 
                },
            });

            if (result.isConfirmed) {
                const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    await Swal.fire({
                        title: 'Deleted!',
                        text: 'Your task has been successfully deleted.',
                        icon: 'success',
                        showConfirmButton: false,
                        customClass: {
                            popup: 'swal-popup',
                            confirmButton: 'swal-confirm-btn',
                            cancelButton: 'swal-cancel-btn' 
                        },
                        timer: 1000
                    });
                    // If task is deleted successfully, clear any form data and dynamically populate the _NoTaskPartial
                    this.resetForm();
                    this.setNoTaskPartial(taskId);
                } else {
                    throw new Error('Delete failed');
                }
            }
        } catch (error) {
            Swal.fire('Error!', 'There was a problem deleting the task.', 'error');
        }
    }

    // Dynamically populates the _NoTaskPartial in place of a newly deleted task.
    async setNoTaskPartial(taskId) {
        // Figure out where the task was deleted from firstly
        const taskWrapperSmall = document.querySelector(`.small-task[data-task-id="${taskId}"]`);
        const taskWrapperMedium = document.querySelector(`.medium-task[data-task-id="${taskId}"]`);
        const taskWrapperLarge = document.querySelector(`.large-task[data-task-id="${taskId}"]`);
        
        // Then populate the correct container / wrapper with a _NoTaskPartial.
        if (taskWrapperSmall) {
            var response = await fetch(`/noTaskPartial?taskType=small`);
            const _NoTaskPartial = await response.text();
            taskWrapperSmall.innerHTML = _NoTaskPartial;
        } else if (taskWrapperMedium) {
            var response = await fetch(`/noTaskPartial?taskType=medium`);
            const _NoTaskPartial = await response.text();
            taskWrapperMedium.innerHTML = _NoTaskPartial;
        } else if (taskWrapperLarge) {
            var response = await fetch(`/noTaskPartial?taskType=large`);
            const _NoTaskPartial = await response.text();
            taskWrapperLarge.innerHTML = _NoTaskPartial;
        }

        // Remember to re-initialise elements.
        this.initElements();
    }

    // Clicking a checkbox on an objective calls this method.
    async updateIsComplete(changedCheckbox) {
        const objectiveId = changedCheckbox.dataset.objectiveId;
        const isChecked = changedCheckbox.checked;

        try {
            const response = await fetch(`/api/tasks/objective`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Id: objectiveId, IsComplete: isChecked })
            });

            if (!response.ok) {
                throw new Error('Failed to update completion status');
            }
            // Dynamically update the progress circle.
            this.UpdateProgressCircle(changedCheckbox);
        } catch (error) {
            console.error('Error saving:', error);
        }
    }

    // VERY PROUD OF THIS PILE OF SHIT - tooks years off my life 
    UpdateProgressCircle(updatedCheckbox, formattedDate, taskType) {
        // Using the checkbox I get the objectives wrapper and the progress circle warpper of the task being updated
        const smallObjectivesWrapper = updatedCheckbox.closest('.sm-task-body');
        const mediumObjectivesWrapper = updatedCheckbox.closest('.medium-objectives-list');

        // In the case of a small objective I don't need to worry about progressCircleWrapper not existing it always does.
        if (smallObjectivesWrapper) {
            var progressCircleWrapper = Array.from(document.querySelectorAll('.sm-task-stats')).find(sm => sm.dataset.taskId == smallObjectivesWrapper.dataset.taskId);
            var checkboxes = smallObjectivesWrapper.querySelectorAll('[data-objective-id]');
            const completed = Array.from(checkboxes).filter(cb => cb.checked).length;
            const total = checkboxes.length;
            const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;
            // Get the actual percentage wrapper and circle
            const percentageElement = progressCircleWrapper.querySelector('.percentage');
            const circle = progressCircleWrapper.querySelector('circle');
            // Update the percentage complete
            percentageElement.dataset.percentage = percentComplete;

            // Update the circle based on new percentageComplete
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            circle.style.strokeDasharray = `${circumference}`;
            circle.style.strokeDashoffset = `${circumference}`;
            const offset = circumference - (percentComplete / 100) * circumference;
            circle.style.strokeDashoffset = offset;

        } else if (mediumObjectivesWrapper) {
            var progressCircleWrapper = Array.from(document.querySelectorAll('.medium-plus-progress-circle')).find(mp => mp.dataset.taskId == mediumObjectivesWrapper.dataset.taskId);
            var checkboxes = mediumObjectivesWrapper.querySelectorAll('[data-objective-id]');

            // Get the other checkboxes related to the task and calculate the completeness 
            const completed = Array.from(checkboxes).filter(cb => cb.checked).length;
            const total = checkboxes.length;
            const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;

            if (!progressCircleWrapper) {
                // If this is the first objective being added to a medium/large task I need to manually create the container to hold the progress circle.
                progressCircleWrapper = document.createElement('div');
                progressCircleWrapper.classList.add('medium-plus-progress-circle');
                progressCircleWrapper.dataset.taskId = mediumObjectivesWrapper.dataset.taskId;

                progressCircleWrapper.innerHTML = `
                    <div class="outer">
                        <div class="inner">
                            <div class="percentage percentage-${taskType.toLowerCase()}" data-percentage="${percentComplete}" data-task-id="${mediumObjectivesWrapper.dataset.taskId}">
                                <h5>Due:</h5>
                                <h5>${formattedDate}</h5>
                            </div>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="70" stroke-linecap="round" stroke="#DDA853" />
                    </svg>
                `;
                // Inserts it before the right container meaning it's in between the right and left
                let rightContainer = mediumObjectivesWrapper.querySelector('.objective-right');
                mediumObjectivesWrapper.insertBefore(progressCircleWrapper, rightContainer);
            } else {
                // Get the actual percentage wrapper and circle
                const percentageElement = progressCircleWrapper.querySelector('.percentage');
                const circle = progressCircleWrapper.querySelector('circle');
                // Update the percentage complete
                percentageElement.dataset.percentage = percentComplete;

                // Update the circle based on new percentageComplete
                const radius = circle.r.baseVal.value;
                const circumference = 2 * Math.PI * radius;
                circle.style.strokeDasharray = `${circumference}`;
                circle.style.strokeDashoffset = `${circumference}`;
                const offset = circumference - (percentComplete / 100) * circumference;
                circle.style.strokeDashoffset = offset;
            }
        }
    }

    // Initialises the progress circles when the page is rendered.
    initProgressCircles() {
        document.querySelectorAll('.progress-circle').forEach(circleContainer => {
            const percentageElement = circleContainer.querySelector('.percentage');
            const circle = circleContainer.querySelector('circle');
        
            if (!percentageElement || !circle) return; // Just in case
        
            const percentage = parseInt(percentageElement.dataset.percentage, 10);
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
        
            circle.style.strokeDasharray = `${circumference}`;
            circle.style.strokeDashoffset = `${circumference}`;
        
            const offset = circumference - (percentage / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        });

        document.querySelectorAll('.medium-plus-progress-circle').forEach(circleContainer => {
            const percentageElement = circleContainer.querySelector('.percentage');
            const circle = circleContainer.querySelector('circle');
        
            if (!percentageElement || !circle) return; // Just in case
        
            const percentage = parseInt(percentageElement.dataset.percentage, 10);
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
        
            circle.style.strokeDasharray = `${circumference}`;
            circle.style.strokeDashoffset = `${circumference}`;
        
            const offset = circumference - (percentage / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        });
    }

    // Sync with my canvas method
    async sync() {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to populate the system with assignments fetched from Canvas',
                icon: 'warning',
                showCancelButton: true,
                customClass: {
                    popup: 'swal-popup',
                    confirmButton: 'swal-confirm-btn',
                    cancelButton: 'swal-cancel-btn' 
                },
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, sync'
            });

            if (result.isConfirmed) {
                const response = await fetch(`/api/canvas/sync`, {
                    method: 'GET'
                });

                if (response.ok) {
                    await Swal.fire({
                        title: 'Success',
                        text: 'You have successfully synced your Canvas assignments',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1000,
                        customClass: {
                            popup: 'swal-popup',
                            confirmButton: 'swal-confirm-btn',
                            cancelButton: 'swal-cancel-btn' 
                        },
                    });
                    this.resetForm();
                    window.location.reload();
                } else {
                    Swal.fire('Error!', 'Your API key is likely invalid, please ensure you have entered it correctly', 'error');
                }
            }
        } catch (error) {
            Swal.fire('Error!', 'There was a problem syncing with canvas please get in touch with your local developer', 'error');
        }
    }

    // Allows users without a Canvas API key to enter one and save it.
    async setCanvasAPIKey(e) {
        e.preventDefault();
        const key = document.getElementById('canvasApiKey').value;
        try {
            const response = await fetch('/api/canvas/setKey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ canvasApiKey: key })
            });
            if (response.ok) {
                    await Swal.fire({
                        title: 'Success',
                        text: 'API Key succesfully saved. Please refresh your page for changes to take effect',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 3000,
                        customClass: {
                            popup: 'swal-popup',
                            confirmButton: 'swal-confirm-btn',
                            cancelButton: 'swal-cancel-btn' 
                        },
                    });

                } else {
                    throw new Error('Setting key failed');
                }
        } catch (error) {
            Swal.fire('Error!', 'There was a problem setting your Canvas API key please get in touch with your local developer', 'error');
        }
    }

    async editCanvasKey(e) {
        const { value: key } = await Swal.fire({
            title: "Enter your API key",
            input: "text",
            inputplaceholder: "API key",
            showCancelButton: true,
            customClass: {
                popup: 'swal-popup',
                confirmButton: 'swal-confirm-btn',
                cancelButton: 'swal-cancel-btn' 
            },
        });
        if (key) {
            try {
                const response = await fetch('/api/canvas/setKey', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ canvasApiKey: key })
                });
                if (response.ok) {
                        await Swal.fire({
                            title: 'Success',
                            text: 'API Key succesfully saved.',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
                            customClass: {
                                popup: 'swal-popup',
                                confirmButton: 'swal-confirm-btn',
                                cancelButton: 'swal-cancel-btn' 
                            },
                        });

                    } else {
                        throw new Error('Setting key failed');
                    }
            } catch (error) {
                Swal.fire('Error!', 'There was a problem setting your Canvas API key please get in touch with your local developer', 'error');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});
