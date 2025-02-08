document.addEventListener('DOMContentLoaded', function () {
    const addTaskButtons = document.querySelectorAll('.add-btn');
    const objectivesContainer = document.getElementById('objectives-container');

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
                input.className = 'form-control';
                input.id = `objective${i}`;
                input.name = `objective${i + 1}`;

                objectiveDiv.appendChild(label);
                objectiveDiv.appendChild(input);
                objectivesContainer.appendChild(objectiveDiv);
            }
        });
    });

    const addTaskModal = document.getElementById('addTaskModal');
    addTaskModal.addEventListener('hidden.bs.modal', function () {
        // Clear the objectives when the modal is closed
        objectivesContainer.innerHTML = '';
    });
});