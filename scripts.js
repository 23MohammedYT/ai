// scripts.js
document.getElementById('open-menu').addEventListener('click', function() {
    document.getElementById('side-menu').classList.add('open');
    document.getElementById('main-content').classList.add('shifted');
});

document.getElementById('close-menu').addEventListener('click', function() {
    document.getElementById('side-menu').classList.remove('open');
    document.getElementById('main-content').classList.remove('shifted');
});

document.getElementById('history').addEventListener('click', function() {
    alert("Displaying history...");
});

document.getElementById('settings').addEventListener('click', function() {
    alert("Opening settings...");
});

document.getElementById('send-message').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value;

    if (userInput.trim() === "") {
        return; // Ignore empty messages
    }

    // Add user message to chat window
    addMessage(userInput, 'user-message');

    // Send user message to the serverless function (AI response)
    fetch('/.netlify/functions/ai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.imageUrl) {
            // If response contains image URL, display it
            addImage(data.imageUrl);
        } else {
            // Otherwise, display AI text response
            const aiResponse = data.message || 'Sorry, I didn\'t get that!';
            addMessage(aiResponse, 'ai-message');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        addMessage('Something went wrong. Please try again later.', 'ai-message');
    });
});

function addMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;

    document.getElementById('chat-window').appendChild(messageElement);

    // Auto-scroll to the latest message
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addImage(imageUrl) {
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;
    imageElement.classList.add('ai-image');

    document.getElementById('chat-window').appendChild(imageElement);

    // Auto-scroll to the latest message
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
}