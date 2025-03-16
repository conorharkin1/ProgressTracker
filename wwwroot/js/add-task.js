document.addEventListener('DOMContentLoaded', function () {
    const addTaskButtons = document.querySelectorAll('.btn-add-task');
    const objectivesContainer = document.getElementById('objectives-container');
    const addTaskModal = document.getElementById('addTaskModal');
    const nameInput  = document.getElementById('taskName');
    const dateInput  = document.getElementById('dueDate');
    const savebtn = this.getElementById('savebtn');

    addTaskButtons.forEach(button => {
        button.addEventListener('click', function () {
            const objectiveCount = parseInt(button.getAttribute('data-objective-count'));

            // Clear any existing objectives
            objectivesContainer.innerHTML = '';

            // Dynamically add the correct number of objectives
            for (let i = 0; i < objectiveCount; i++) {
                const objectiveDiv = document.createElement('div');
                objectiveDiv.className = 'mb-3';

                const label = document.createElement('label');
                label.className = 'form-label';
                label.htmlFor = `objective${i}`;
                label.textContent = `Objective ${i + 1}`;

                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'form-control objective-input';
                input.id = `objective${i}`;
                input.name = `objective${i + 1}`;

                objectiveDiv.appendChild(label);
                objectiveDiv.appendChild(input);
                objectivesContainer.appendChild(objectiveDiv);
            }
        });
    });

    addTaskModal.addEventListener('hidden.bs.modal', function () {
        // Clear inputs when modal closes
        objectivesContainer.innerHTML = '';
        nameInput.value = '';
        dateInput.value = '';
    });

    savebtn.addEventListener('click', function (e) {
        e.preventDefault();
        const nameValue = nameInput.value;
        const dateValue = dateInput.value;
        const objectiveValues = [...document.querySelectorAll('.objective-input')].map(input => input.value);

        const rawTaskData = {
            Name: nameValue,
            DueDate: dateValue,
            Objectives: []
        };

        // Wrap the task data in a "task" object
        // const payloadTaskData = {
        //     task: rawTaskData
        // };
        console.log(rawTaskData);
        try {
            // Send POST request to the backend
            const response = fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rawTaskData)
            });
    
            // Handle the response
            if (response.ok) {
                console.log('success');
            } else {
                console.log('failure');
            }
        } catch (error) {
            console.log(error);
        }
    })
});