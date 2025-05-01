// document.addEventListener('DOMContentLoaded', function() {
//     const chatMessages = document.getElementById('chat-messages');
//     const userInput = document.getElementById('user-input');
//     const sendButton = document.getElementById('send-button');
//     const mbtiSelect = document.getElementById('mbti-select');
    
//     // Add message to chat
//     function addMessage(text, isUser) {
//         const messageDiv = document.createElement('div');
//         messageDiv.classList.add('message');
//         messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
//         messageDiv.textContent = text;
//         chatMessages.appendChild(messageDiv);
//         chatMessages.scrollTop = chatMessages.scrollHeight;
//     }
    
//     // Show typing indicator
//     function showTypingIndicator() {
//         const typingDiv = document.createElement('div');
//         typingDiv.classList.add('typing-indicator');
//         typingDiv.id = 'typing-indicator';
//         typingDiv.innerHTML = '<span></span><span></span><span></span>';
//         chatMessages.appendChild(typingDiv);
//         chatMessages.scrollTop = chatMessages.scrollHeight;
//     }
    
//     // Hide typing indicator
//     function hideTypingIndicator() {
//         const typingDiv = document.getElementById('typing-indicator');
//         if (typingDiv) typingDiv.remove();
//     }
    
//     // Send message to backend
//     async function sendMessageToBackend(message) {
//         try {
//             const response = await fetch('http://localhost:5000/api/chat', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     message: message,
//                     mbti: mbtiSelect.value
//                 })
//             });
            
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
            
//             return await response.json();
//         } catch (error) {
//             console.error('Error:', error);
//             return { reply: "Sorry, I'm having trouble connecting to the server." };
//         }
//     }
    
//     // Handle user input
//     async function handleUserInput() {
//         const text = userInput.value.trim();
//         if (text) {
//             addMessage(text, true);
//             userInput.value = '';
            
//             showTypingIndicator();
            
//             const response = await sendMessageToBackend(text);
//             hideTypingIndicator();
            
//             addMessage(response.reply, false);
//         }
//     }
    
//     // Event listeners
//     sendButton.addEventListener('click', handleUserInput);
//     userInput.addEventListener('keypress', function(e) {
//         if (e.key === 'Enter') handleUserInput();
//     });
    
//     // Initial bot message
//     setTimeout(() => {
//         addMessage("Hello! I'm your MBTI-aware chatbot. How can I help you today?", false);
//     }, 500);
// });

document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const mbtiSelect = document.getElementById('mbti-select');
    
    // Add date separator
    function addDateSeparator() {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = today.toLocaleDateString(undefined, options);
        
        const separator = document.createElement('div');
        separator.className = 'date-separator';
        separator.innerHTML = `<span>${dateString}</span>`;
        chatMessages.appendChild(separator);
    }
    
    // Add message with timestamp
    function addMessage(text, isUser) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        messageDiv.innerHTML = `
            ${text}
            <span class="message-time">${timeString}</span>
        `;
        
        // Add to chat
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add subtle "sent" animation for user messages
        if (isUser) {
            messageDiv.style.transform = 'translateX(10px)';
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                messageDiv.style.transform = 'translateX(0)';
                messageDiv.style.opacity = '1';
                messageDiv.style.transition = 'all 0.3s ease';
            }, 10);
        }
    }
    
    // Show typing indicator with MBTI flair
    function showTypingIndicator() {
        const mbti = mbtiSelect.value;
        const typingTexts = {
            'INFP': 'Reflecting deeply...',
            'INTJ': 'Analyzing carefully...',
            'ENTP': 'Generating ideas...'
            // Add more MBTI-specific messages
        };
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <span></span><span></span><span></span>
            <span style="margin-left:8px;font-size:0.9em;animation:none;">
                ${typingTexts[mbti] || 'Thinking...'}
            </span>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Send message to backend
    async function sendMessageToBackend(message) {
        try {
            showTypingIndicator();
            
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    mbti: mbtiSelect.value
                })
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return { reply: "Sorry, I'm having trouble connecting to the server." };
        } finally {
            hideTypingIndicator();
        }
    }
    
    // Handle user input
    async function handleUserInput() {
        const text = userInput.value.trim();
        if (text) {
            addMessage(text, true);
            userInput.value = '';
            
            const response = await sendMessageToBackend(text);
            addMessage(response.reply, false);
        }
    }
    
    // Event listeners
    sendButton.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleUserInput();
    });
    
    // Initial setup
    addDateSeparator();
    setTimeout(() => {
        addMessage("Hello! I'm your MBTI-aware chatbot. How can I help you today?", false);
    }, 800);
    
    // Add MBTI change animation
    mbtiSelect.addEventListener('change', function() {
        const mbti = this.value;
        const colors = {
            'INFP': '#6c5ce7',
            'INTJ': '#00b894',
            'ENTP': '#fd79a8'
            // Add colors for other types
        };
        
        document.documentElement.style.setProperty('--primary-color', colors[mbti] || '#6c5ce7');
    });
});
let abortController = null;

async function sendMessage() {
    if (abortController) abortController.abort();
    
    const message = inputElement.value.trim();
    if (!message) return;
    
    addMessage(message, true);
    inputElement.value = "";
    
    abortController = new AbortController();
    showTypingIndicator();
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                mbti: mbtiSelect.value
            }),
            signal: abortController.signal
        });
        
        const data = await response.json();
        replaceLastMessage(data.reply);
    } catch (err) {
        if (err.name !== 'AbortError') {
            replaceLastMessage("Sorry, I couldn't process that quickly enough.");
        }
    } finally {
        hideTypingIndicator();
        abortController = null;
    }
}

// New: Progressive message display
function replaceLastMessage(newText) {
    const lastMsg = chatContainer.lastChild;
    if (lastMsg.classList.contains('typing')) {
        lastMsg.textContent = newText;
        lastMsg.classList.remove('typing');
    }
}

