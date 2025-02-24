
function getDate() {
    const date = new Date();
    document.getElementById('currentYear').innerHTML = date.getFullYear();
}
getDate();

// Connect to the EventSource endpoint
const eventSource = new EventSource('/esbuild');

// Add an event listener to reload the page when a 'change' event is received
eventSource.addEventListener('change', () => {
    location.reload();
});

// Optional: Handle other events or errors from the EventSource
eventSource.onerror = (error) => {
    console.error('EventSource failed: ', error);
};