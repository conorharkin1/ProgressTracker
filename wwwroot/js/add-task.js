document.addEventListener('DOMContentLoaded', function () {
    const addTaskButtons = document.querySelectorAll('.btn-add-task');
    const addObjectiveButton = document.getElementById('addObjectiveButton');
    const objectivesContainer = document.getElementById('objectives-container');
    const addTaskModal = document.getElementById('addTaskModal');
    const taskNameInput = document.getElementById('taskName');
    const taskDateInput = document.getElementById('dueDate');
    const savebtn = this.getElementById('savebtn');
    let maxObjectives = 0;
    let currentObjectiveIndex = 0;
    let taskType = 'SMALL';

    addTaskButtons.forEach(button => {
        button.addEventListener('click', function () {
            maxObjectives = parseInt(button.getAttribute('data-objective-count'));
            currentObjectiveIndex = 0;

            // Clear any existing objectives
            objectivesContainer.innerHTML = '';

            addObjectiveButton.disabled = false;
        });
    });

    addObjectiveButton.addEventListener('click', function () {
        if (currentObjectiveIndex < maxObjectives) {
            // Create a new set of inputs for the objective
            const objectiveDiv = document.createElement('div');
            objectiveDiv.className = 'mb-3 objective-input-group';

            // Label and input for the objective name
            const labelName = document.createElement('label');
            labelName.className = 'form-label';
            labelName.htmlFor = `objectiveName${currentObjectiveIndex}`;
            labelName.textContent = `Objective ${currentObjectiveIndex + 1} Name`;

            const inputName = document.createElement('input');
            inputName.type = 'text';
            inputName.className = 'form-control objective-input';
            inputName.id = `objectiveName${currentObjectiveIndex}`;
            inputName.name = `objectiveName${currentObjectiveIndex}`;
            inputName.required = true;

            // Label and input for the objective hours
            const labelHours = document.createElement('label');
            labelHours.className = 'form-label';
            labelHours.htmlFor = `objectiveHours${currentObjectiveIndex}`;
            labelHours.textContent = `Objective ${currentObjectiveIndex + 1} Hours`;

            const inputHours = document.createElement('input');
            inputHours.type = 'number';
            inputHours.className = 'form-control objective-input';
            inputHours.id = `objectiveHours${currentObjectiveIndex}`;
            inputHours.name = `objectiveHours${currentObjectiveIndex}`;
            inputHours.required = true;

            // Append the inputs to the container
            objectiveDiv.appendChild(labelName);
            objectiveDiv.appendChild(inputName);
            objectiveDiv.appendChild(labelHours);
            objectiveDiv.appendChild(inputHours);
            objectivesContainer.appendChild(objectiveDiv);

            // Increment the objective index
            currentObjectiveIndex++;

            // Disable the "Add Objective" button if the maximum number of objectives is reached
            if (currentObjectiveIndex >= maxObjectives) {
                addObjectiveButton.disabled = true;
            }
        } else {
            alert('You have reached the maximum number of objectives.');
        }
    });

    addTaskModal.addEventListener('hidden.bs.modal', function () {
        // Clear inputs when modal closes
        objectivesContainer.innerHTML = '';
        taskNameInput.value = '';
        taskDateInput.value = '';
    });

    savebtn.addEventListener('click', function (e) {
        e.preventDefault();
        savebtn.disabled = true;
        // Collect task data
        const nameValue = taskNameInput.value;
        const dateValue = taskDateInput.value;
        const objectives = [];
        taskType = maxObjectives == 3 ? 'SMALL' : maxObjectives == 6 ? 'MEDIUM' : 'LARGE';
        // Collect objective data

        const objectiveInputs = document.querySelectorAll('.objective-input-group');
        objectiveInputs.forEach((group, index) => {
            const name = group.querySelector(`input[name="objectiveName${index}"]`).value;
            const hours = parseInt(group.querySelector(`input[name="objectiveHours${index}"]`).value);

            // Create an Objective object matching the backend structure
            const objective = {
                Name: name,
                Hours: hours,
            };

            objectives.push(objective);
        });


        const rawTaskData = {
            Name: nameValue,
            DueDate: dateValue,
            Objectives: objectives,
            TaskType: taskType
        };

        // Send POST request to the backend
        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rawTaskData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save Task');
            }
            return response.json();
        })
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Task Saved!',
                text: 'Your task has been saved successfully.',
                showConfirmButton: false,
                timer: 2000
            });
        })
        .catch(error => {
            console.error('Fetch error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'An error occurred while saving the task.',
            });
        })
        .finally(() => {
            savebtn.disabled = false;
        });
    });
});