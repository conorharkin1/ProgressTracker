class TaskManager {
    constructor() {
        this.maxObjectives = 0;
        this.currentObjectiveIndex = 0;
        this.taskType = 'SMALL';
        this.isEditMode = false;
        this.taskModal = document.getElementById('taskModal');

        this.initElements();
        this.bindEvents();
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

    bindEvents() {
        // Open Add Task Modal
        this.addTaskButtons.forEach(button => {
            button.addEventListener('click', () => this.openAddTaskModal(button));
        });

        // Open Edit Task Modal
        this.editButtons.forEach(button => {
            button.addEventListener('click', () => this.openEditTaskModal(button));
        });

        // Delete Task
        this.deleteButtons.forEach(button => {
            button.addEventListener('click', () => this.deleteTask(button));
        });

        // Sync with Canvas
        if (this.syncBtn) {
            this.syncBtn.addEventListener('click', () => this.sync());
        }

        if (this.canvasApiKeyForm) {
            this.canvasApiKeyForm.addEventListener('submit', (e) => this.setCanvasAPIKey(e)); 
        }

        // Add Objective
        if (this.addObjectiveButton) {
            this.addObjectiveButton.addEventListener('click', () => this.addObjective());
        }

        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', (e) => this.saveTasks(e));
        }

        // Reset form on modal close
        if (this.taskModal) {
            this.taskModal.addEventListener('hidden.bs.modal', () => this.resetForm());
        }

        // Objective cards
        this.objectiveCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateIsComplete(checkbox));
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
            this.taskDateInput.value = task.dueDate;
            this.objectivesContainer.innerHTML = '';

            this.currentObjectiveIndex = task.objectives.length;
            this.maxObjectives = parseInt(button.getAttribute('data-objective-count'));
            this.addObjectiveButton.disabled = false;

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
            alert('You have reached the maximum number of objectives.');
            return;
        }

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

    resetForm() {
        this.taskForm.reset();
        this.objectivesContainer.innerHTML = '';
        this.currentObjectiveIndex = 0;
        this.maxObjectives = 0;
        this.addObjectiveButton.disabled = false;
        this.isEditMode = false;
    }

    collectTaskData() {
        const objectives = [];
        const objectiveInputs = document.querySelectorAll('.objective-input-group');

        objectiveInputs.forEach((group, index) => {
            const name = group.querySelector(`input[name="objectiveName${index}"]`).value;
            const hours = parseInt(group.querySelector(`input[name="objectiveHours${index}"]`).value);
            const iscomplete = group.querySelector(`input[name="objectiveIsComplete${index}"]`).checked;
            objectives.push({ Name: name, Hours: hours, IsComplete: iscomplete});
        });

        this.taskType = this.maxObjectives === 2 ? 'SMALL' :
                        this.maxObjectives === 4 ? 'MEDIUM' : 'LARGE';

        return {
            Id: this.taskIdInput.value ? this.taskIdInput.value : 0,
            Name: this.taskNameInput.value,
            DueDate: this.taskDateInput.value,
            Objectives: objectives,
            TaskType: this.taskType
        };
    }

    updateTaskDom(updatedTaskData) {
        console.log(updatedTaskData);
        // Update the Task Name
        const taskHeader = Array.from(document.querySelectorAll('.task-header-centre')).find(th => th.dataset.taskId == updatedTaskData.id);
        const taskNameElement = taskHeader.querySelector('h4');
        taskNameElement.textContent = updatedTaskData.name;

        // Update the DueDate
        var dueDiv = Array.from(document.querySelectorAll('.percentage')).find(th => th.dataset.taskId == updatedTaskData.id);
        const dueElement = dueDiv.querySelectorAll('h5');
        const h5ToUpdate = dueElement[1];
        const rawDate = new Date(updatedTaskData.dueDate);
        const formattedDate = rawDate.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(',', '');
        h5ToUpdate.innerText = formattedDate;

        //Objectives
        if (updatedTaskData.taskType === 'SMALL') {
            const smallObjectivesWrapper = Array.from(document.querySelectorAll('.objectives-list')).find(ol => ol.dataset.taskId == updatedTaskData.id);
            smallObjectivesWrapper.innerHTML = '';

            // Re-populate the objectives list
            if (updatedTaskData.objectives && updatedTaskData.objectives.length > 0) {
                console.log('here');
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
            this.rebindObjectiveCheckboxes();

        } else if (updatedTaskData.TaskType === 'MEDIUM' || updatedTaskData.TaskType === 'LARGE') {
            const mediumObjectivesWrapper = Array.from(document.querySelectorAll('.medium-objectives-list')).find(ol => ol.dataset.taskId == updatedTaskData.Id);
            mediumObjectivesWrapper.innerHTML = '';

            // Re-populate the objectives list
            if (updatedTaskData.objectives && updatedTaskData.objectives.length > 0) {
                updatedTaskData.objectives.forEach(obj => {
                    const isChecked = obj.isComplete ? 'checked' : '';
                    mediumObjectivesWrapper.insertAdjacentHTML('beforeend', `
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
            this.rebindObjectiveCheckboxes();
        }

        this.modal.hide();
    }

    async saveTasks(e) {
        e.preventDefault();
        this.saveBtn.disabled = true;

        try {
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
                timer: 1500
            });

            const updatedTask = await fetch(`/api/tasks/${taskData.Id}`);
            if (!response.ok) throw new Error('Failed to load task');

            const task = await updatedTask.json();

            this.updateTaskDom(task);

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
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it'
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
                        timer: 1000
                    });
                    this.resetForm();
                    window.location.reload();
                } else {
                    throw new Error('Delete failed');
                }
            }
        } catch (error) {
            Swal.fire('Error!', 'There was a problem deleting the task.', 'error');
        }
    }

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
            this.UpdateProgressCircle(changedCheckbox);
        } catch (error) {
            console.error('Error saving:', error);
        }
    }

    UpdateProgressCircle(updatedCheckbox) {
        // Using the checkbox I get the objectives wrapper and the progress circle warpper of the task being updated
        const smallObjectivesWrapper = updatedCheckbox.closest('.sm-task-body');
        const mediumObjectivesWrapper = updatedCheckbox.closest('.medium-objectives-list');

        if (smallObjectivesWrapper) {
            var progressCircleWrapper = Array.from(document.querySelectorAll('.sm-task-stats')).find(sm => sm.dataset.taskId == smallObjectivesWrapper.dataset.taskId);
            var checkboxes = smallObjectivesWrapper.querySelectorAll('[data-objective-id]');
        } else {
            var progressCircleWrapper = Array.from(document.querySelectorAll('.medium-plus-progress-circle')).find(mp => mp.dataset.taskId == mediumObjectivesWrapper.dataset.taskId);
            var checkboxes = mediumObjectivesWrapper.querySelectorAll('[data-objective-id]');
        }

        // Get the other checkboxes related to the task and calculate the completeness 
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
    }

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

    async sync() {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to populate the system with assignments fetched from Canvas',
                icon: 'warning',
                showCancelButton: true,
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
                        timer: 1000
                    });
                    this.resetForm();
                    window.location.reload();
                } else {
                    throw new Error('Sync failed');
                }
            }
        } catch (error) {
            Swal.fire('Error!', 'There was a problem syncing with canvas please get in touch with your local developer', 'error');
        }
    }

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
                        text: 'API Key succesfully saved. You may now sync with canvas',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    
                } else {
                    throw new Error('Setting key failed');
                }
        } catch (error) {
            Swal.fire('Error!', 'There was a problem setting your Canvas API key please get in touch with your local developer', 'error');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});
