export async function showSelectionDialog(options, prompt) {
    return new Promise((resolve) => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.classList.add('dialog-overlay'); // Add CSS class

        // Create dialog container
        const dialog = document.createElement('div');
        dialog.classList.add('dialog-container'); // Add CSS class

        // Title
        const title = document.createElement('h3');
        title.classList.add('dialog-title'); // Add CSS class
        title.innerText = prompt;
        dialog.appendChild(title);

        // Options
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.classList.add('dialog-button'); // Add CSS class
            button.innerText = option;

            button.addEventListener('click', () => {
                resolve(index); // Resolve the promise with selected option
                document.body.removeChild(overlay); // Remove overlay
            });

            dialog.appendChild(button);
        });

        // Append dialog to overlay and overlay to body
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    });
}