class TaskManager {
    constructor() {
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.deleteButtons = document.querySelectorAll('#delete-task-btn');
        this.editButtons = document.querySelectorAll('.bi-pencil');
    }

    bindEvents() {
        this.deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => this.deleteTask(e));
        });
    }

    async deleteTask(e) {
        const taskId = e.currentTarget.getAttribute('task-id');
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This will permanently delete this task",
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
                    await Swal.fire(
                        'Deleted!',
                        'Your task has been deleted.',
                        'success'
                    );
                    window.location.reload();
                } else {
                    throw new Error('Delete failed');
                }
            }
        } catch (error) {
            Swal.fire(
                'Error!',
                'There was a problem deleting the task.',
                'error'
            );
            console.error('Delete error:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});