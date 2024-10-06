const chatInput = document.querySelector('#chat-input');
const sendBtn = document.querySelector('.sent-btn');
const chatContainer = document.querySelector('.chat-container');
const copyIcon = document.querySelector('.copy-icon');
const themeBtn = document.querySelector('.theme-btn');
const deleteBtn = document.querySelector('.delete-btn');



let userText = null;
const API_KEY = 'your_api_key';
const initialHeight = chatInput.scrollHeight;


function loadDataFormatStorage(){
    const themeColor = localStorage.getItem('theme-color');  // Retrieve theme color from localStorage
    // If theme-color is not found, default to 'light-mode'
    if (themeColor) {
        document.body.classList.toggle('light-mode', themeColor === 'light-mode');
    } else {
        // Default theme is 'light-mode' if not set in localStorage
        document.body.classList.add('light-mode');
        localStorage.setItem('theme-color', 'light-mode');  // Set default value in localStorage
    }
    
    themeBtn.innerHTML = document.body.classList.contains('light-mode') 
        ? `<i class="fa-solid fa-moon"></i>` 
        : `<i class="fa-regular fa-moon"></i>`;
    const defaultText = `<div class="default-text">
                        <h1>ChatGPT Clone</h1>
                        <p>Start a conversation and explore the power of AI.</p>
                        </div>`
    chatContainer.innerHTML = localStorage.getItem('all-chat') || defaultText;
    chatContainer.scrollTo(0,chatContainer.scrollHeight);
}


loadDataFormatStorage();

function createElement(html,className){
    const chatDiv = document.createElement('div');
    chatDiv.classList.add('chat',className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

async function getChatResponse(incomingChatDiv){
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    const pElement  = document.createElement('p');
    const requestOptions = {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
            // "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            contents:[{"parts":[{text:userText}]}]
            // model:"text-davinci-003",
            // prompt:userText,
            // max_tokens:2048,
            // temperature:0.2,
            // n:1,
            // stop:null
        })
    }

    try{
        const response = await (await fetch(API_URL,requestOptions)).json();
        pElement.textContent = response.candidates[0].content.parts[0].text.trim();
    }catch(error){
        pElement.classList.add('error');
       pElement.textContent = 'Oops!Something went wrong while retrieving the response.Please try again.'
    }
    incomingChatDiv.querySelector('.typing-animation').remove();
    incomingChatDiv.querySelector('.chat-details').appendChild(pElement);
    localStorage.setItem('all-chat',chatContainer.innerHTML);
    chatContainer.scrollTo(0,chatContainer.scrollHeight);
}

function copyResponse(copyBtn){
    const responseTextEl = copyBtn.parentElement.querySelector('p');
    navigator.clipboard.writeText(responseTextEl.textContent);
    copyBtn.innerHTML= `<i class="fa-solid fa-check"></i>`;
    setTimeout(()=>copyBtn.innerHTML=`<span class="copy-icon"><i class="fa-regular fa-copy"></i></span>`,1000);
}

function showTypingAnimation(){
    const html = `<div class="chat-content">
                <div class="chat-details">
                    <img src="image/chatbot.jpg" alt="chatbot-img">
                    <div class="typing-animation">
                        <div class="typing-dot" style="--delay:1s"></div>
                        <div class="typing-dot" style="--delay:2s"></div>
                        <div class="typing-dot" style="--delay:3s"></div>
                    </div>
                </div>
                <span onclick="copyResponse(this)" class="copy-icon"><i class="fa-regular fa-copy"></i></span>
            </div>`;
    const incomingChatDiv = createElement(html,'incoming');
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0,chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

function handleOutGoingChat(){
    userText = chatInput.value.trim(); 
    if(!userText) return;

    chatInput.value = '';
    chatInput.style.height = `${initialHeight}px`;
   const html = `<div class="chat-content">
                <div class="chat-details">
                    <img src="image/user.jpg" alt="user-img">
                    <p></p>
                </div>
            </div>`;
    const outgoingChatDiv = createElement(html,'outgoing')
    chatContainer.appendChild(outgoingChatDiv);
    outgoingChatDiv.querySelector('p').textContent = userText;
    document.querySelector('.default-text')?.remove();
    chatContainer.scrollTo(0,chatContainer.scrollHeight);
    setTimeout(showTypingAnimation,500);
}

sendBtn.addEventListener('click',handleOutGoingChat);

chatInput.addEventListener('input',()=>{
    chatInput.style.height=`${initialHeight}px`;
    chatInput.style.height=`${chatInput.scrollHeight}px`;
})

chatInput.addEventListener('keydown',(e)=>{
   if (e.key === 'Enter' && !e.shiftKey && window.innerHeight > 800){
    e.preventDefault();
    handleOutGoingChat();
   }
})

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    // Store the current theme (light-mode or dark-mode) in localStorage
    const newTheme = document.body.classList.contains('light-mode') ? 'light-mode' : 'dark-mode';
    localStorage.setItem('theme-color', newTheme);  // Save theme in localStorage
    themeBtn.innerHTML = document.body.classList.contains('light-mode') 
        ? `<i class="fa-solid fa-moon"></i>` 
        : `<i class="fa-regular fa-moon"></i>`;
});
deleteBtn.addEventListener('click',()=>{
    if(confirm('Are you sure you want to delete all the  chats')){
        localStorage.removeItem('all-chat');
       loadDataFormatStorage();
    }
})