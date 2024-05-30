let markdownTimer;

/*
    Add the new buttons into the page.
 */
function mutationCallback(mutationsList, observer) {
    mutationsList.forEach(mutation => {
        // Listen for an open story
        if (mutation.target.matches('.right-column')) {
            const storyId = mutation.target.querySelector('.attribute.story-id');
            const markdownButton = storyId?.querySelector('.markdown-button');
            if (storyId && !markdownButton) {
                // Gather data
                const text = storyId.closest('.story-details').querySelector('.story-name').innerText.trim();
                const url = storyId.nextElementSibling.querySelector('input').value;
                // Add button to copy the Markdown link to the clipboard
                const markdownButton = document.createElement('span');
                storyId.appendChild(markdownButton);
                markdownButton.className = 'markdown-button';
                markdownButton.addEventListener('mousedown', async function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    await copyToClipboard('[' + text + '](' + url + ')');
                    // Display success icon
                    markdownButton.className = 'markdown-button markdown-success';
                    clearTimeout(markdownTimer);
                    markdownTimer = setTimeout(() => markdownButton.className = 'markdown-button', 1000);
                });
            }
        }
    });
    // We never call observer.disconnect() in case we open several stories throughout the session
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        console.error(error);
    }
}

const observer = new MutationObserver(mutationCallback);
observer.observe(document.body, {childList: true, subtree: true});
