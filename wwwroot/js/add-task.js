class AddTaskManager {
    constructor() {
        this.maxObjectives = 0;
        this.currentObjectiveIndex = 0;
        this.taskType = 'SMALL';
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.addTaskButtons = document.querySelectorAll('.btn-add-task');
        this.addObjectiveButton = document.getElementById('addObjectiveButton');
        this.objectivesContainer = document.getElementById('objectives-container');
        this.addTaskModal = document.getElementById('addTaskModal');
        this.taskNameInput = document.getElementById('taskName');
        this.taskDateInput = document.getElementById('dueDate');
        this.saveBtn = document.getElementById('savebtn');
    }

    bindEvents() {
        this.addTaskButtons.forEach(button => {
            button.addEventListener('click', () => this.handleAddTaskClick(button));
        });
        this.addObjectiveButton.addEventListener('click', () => this.addObjective());
        this.addTaskModal.addEventListener('hidden.bs.modal', () => this.resetForm());
        this.saveBtn.addEventListener('click', (e) => this.saveTask(e));
    }

    handleAddTaskClick(button) {
        this.maxObjectives = parseInt(button.getAttribute('data-objective-count'));
        this.currentObjectiveIndex = 0;
        this.objectivesContainer.innerHTML = '';
        this.addObjectiveButton.disabled = false;
    }

    addObjective() {
        if (this.currentObjectiveIndex >= this.maxObjectives) {
            alert('You have reached the maximum number of objectives.');
            return;
        }

        const objectiveDiv = document.createElement('div');
        objectiveDiv.className = 'mb-3 objective-input-group';

        objectiveDiv.innerHTML = `
            <label class="form-label" for="objectiveName${this.currentObjectiveIndex}">
                Objective ${this.currentObjectiveIndex + 1} Name
            </label>
            <input type="text" class="form-control objective-input" 
                   id="objectiveName${this.currentObjectiveIndex}" 
                   name="objectiveName${this.currentObjectiveIndex}" required>
            
            <label class="form-label" for="objectiveHours${this.currentObjectiveIndex}">
                Objective ${this.currentObjectiveIndex + 1} Hours
            </label>
            <input type="number" class="form-control objective-input" 
                   id="objectiveHours${this.currentObjectiveIndex}" 
                   name="objectiveHours${this.currentObjectiveIndex}" required>
        `;

        this.objectivesContainer.appendChild(objectiveDiv);
        this.currentObjectiveIndex++;

        if (this.currentObjectiveIndex >= this.maxObjectives) {
            this.addObjectiveButton.disabled = true;
        }
    }

    resetForm() {
        this.objectivesContainer.innerHTML = '';
        this.taskNameInput.value = '';
        this.taskDateInput.value = '';
    }

    async saveTask(e) {
        e.preventDefault();
        this.saveBtn.disabled = true;

        try {
            const taskData = this.collectTaskData();
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) throw new Error('Failed to save Task');
            
            await Swal.fire({
                icon: 'success',
                title: 'Task Saved!',
                text: 'Your task has been saved successfully.',
                showConfirmButton: false,
                timer: 2000
            });
            
            // Optionally refresh the page or update the UI
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'An error occurred while saving the task.',
            });
        } finally {
            this.saveBtn.disabled = false;
        }
    }

    collectTaskData() {
        const objectives = [];
        const objectiveInputs = document.querySelectorAll('.objective-input-group');
        
        objectiveInputs.forEach((group, index) => {
            const name = group.querySelector(`input[name="objectiveName${index}"]`).value;
            const hours = parseInt(group.querySelector(`input[name="objectiveHours${index}"]`).value);
            objectives.push({ Name: name, Hours: hours });
        });

        this.taskType = this.maxObjectives === 3 ? 'SMALL' : 
                       this.maxObjectives === 6 ? 'MEDIUM' : 'LARGE';

        return {
            Name: this.taskNameInput.value,
            DueDate: this.taskDateInput.value,
            Objectives: objectives,
            TaskType: this.taskType
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AddTaskManager();
});