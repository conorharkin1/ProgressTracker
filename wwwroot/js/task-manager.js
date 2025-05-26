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

        // Add Objective
        if (this.addObjectiveButton) {
            this.addObjectiveButton.addEventListener('click', () => this.addObjective());
        }

        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', (e) => this.handleFormSubmit(e));
        }

        // Reset form on modal close
        if (this.taskModal) {
            this.taskModal.addEventListener('hidden.bs.modal', () => this.resetForm());
        }
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
                            <td><label class="form-label">Name</label></td>
                            <td><input type="text" class="form-control" name="objectiveName${index}" value="${obj.name}" required></td>
                        </tr>
                        <tr>
                            <td><label class="form-label">Hours to complete</label></td>
                            <td><input type="number" class="form-control" name="objectiveHours${index}" value="${obj.hours}" required></td>
                        </tr>
                        <tr>
                            <td><label class="form-label">Is Objective Complete?</label></td>
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
                    <td><label class="form-label">Name</label></td>
                    <td><input type="text" class="form-control" name="objectiveName${this.currentObjectiveIndex}" required></td>
                </tr>
                <tr>
                    <td><label class="form-label">Hours to complete</label></td>
                    <td><input type="number" class="form-control" name="objectiveHours${this.currentObjectiveIndex}" required></td>
                </tr>
                <tr>
                    <td><label class="form-label">Is Objective Complete?</label></td>
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

    async handleFormSubmit(e) {
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

            window.location.reload();
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
}

document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});
