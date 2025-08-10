// Lovable AI Platform - Enhanced JavaScript with Backend Integration
console.log('💻 Lovable AI Platform loaded!');

// Конфигурация
const API_BASE_URL = 'http://127.0.0.1:5002';
const WS_URL = 'ws://127.0.0.1:5002';

// Глобальные переменные
let isTyping = false;
let socket = null;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Основная функция инициализации
function initializeApp() {
    setupNavigation();
    setupChatInterface();
    setupAnimations();
    setupScrollEffects();
    setupWebSocket();
}

// Функции для кнопок
window.startFreeTrial = function() {
    console.log('🚀 Начинаем бесплатную пробу...');
    
    // Создаем модальное окно для регистрации
    const modal = document.createElement('div');
    modal.className = 'signup-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                                 <div class="modal-header">
                     <h2>Регистрация</h2>
                     <button class="modal-close" onclick="closeModal()">&times;</button>
                 </div>
                <div class="modal-body">
                    <form id="signupForm" class="signup-form">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" required placeholder="your@email.com">
                        </div>
                        <div class="form-group">
                            <label for="password">Пароль</label>
                            <input type="password" id="password" required placeholder="Минимум 8 символов">
                        </div>
                        <div class="form-group">
                            <label for="name">Имя</label>
                            <input type="text" id="name" required placeholder="Ваше имя">
                        </div>
                        <button type="submit" class="btn-primary">
                            <span>Создать аккаунт</span>
                            <div class="btn-glow"></div>
                        </button>
                    </form>
                    <div class="modal-footer">
                        <p>Уже есть аккаунт? <a href="#" onclick="showLogin()">Войти</a></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем стили для модального окна
    const style = document.createElement('style');
    style.textContent = `
                 .signup-modal {
             position: fixed;
             top: 0;
             left: 0;
             width: 100%;
             height: 100%;
             z-index: 10000;
             display: flex;
             align-items: center;
             justify-content: center;
             background: rgba(0, 0, 0, 0.8);
             backdrop-filter: blur(10px);
         }
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
        }
        .modal-content {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 20px;
            padding: 30px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            z-index: 10001;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .modal-header h2 {
            color: white;
            margin: 0;
            font-size: 24px;
        }
        .modal-close {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.3s;
        }
        .modal-close:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        .signup-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .form-group label {
            color: white;
            font-weight: 500;
            font-size: 14px;
        }
        .form-group input {
            padding: 12px 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.05);
            color: white;
            font-size: 16px;
            transition: all 0.3s;
        }
        .form-group input:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        .form-group input::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }
        .modal-footer {
            margin-top: 20px;
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
        }
        .modal-footer a {
            color: #6366f1;
            text-decoration: none;
            font-weight: 500;
        }
        .modal-footer a:hover {
            text-decoration: underline;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Обработчик формы
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;
        
        console.log('📝 Регистрация:', { email, name });
        
        // Здесь можно добавить реальную логику регистрации
        showNotification('✅ Аккаунт создан! Теперь войдите в систему', 'success');
        
        setTimeout(() => {
            closeModal();
            // Показываем форму входа
            setTimeout(() => {
                showLogin();
            }, 500);
        }, 2000);
    });
};

window.showDemo = function() {
    console.log('🎬 Показываем демо...');
    // Прокручиваем к демо разделу
    const demoSection = document.getElementById('demo');
    if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
        
        // Запускаем демо анимацию через небольшую задержку
        setTimeout(() => {
            startDemoAnimation();
        }, 1000);
    }
};

window.closeModal = function() {
    const signupModal = document.querySelector('.signup-modal');
    const loginModal = document.querySelector('.login-modal');
    
    if (signupModal) {
        signupModal.remove();
    }
    if (loginModal) {
        loginModal.remove();
    }
};

window.showLogin = function() {
    console.log('🔐 Показываем форму входа...');
    
    // Создаем модальное окно для входа
    const modal = document.createElement('div');
    modal.className = 'login-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Вход</h2>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="loginForm" class="login-form">
                        <div class="form-group">
                            <label for="loginEmail">Email</label>
                            <input type="email" id="loginEmail" required placeholder="your@email.com">
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Пароль</label>
                            <input type="password" id="loginPassword" required placeholder="Введите пароль">
                        </div>
                        <button type="submit" class="btn-primary">
                            <span>Войти</span>
                            <div class="btn-glow"></div>
                        </button>
                    </form>
                    <div class="modal-footer">
                        <p>Нет аккаунта? <a href="#" onclick="showSignup()">Регистрация</a></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем стили для модального окна входа
    const style = document.createElement('style');
    style.textContent = `
        .login-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
        }
        .login-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Обработчик формы входа
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        console.log('🔐 Вход:', { email });
        
        // Здесь можно добавить реальную логику входа
        showNotification('✅ Вход выполнен успешно!', 'success');
        
        setTimeout(() => {
            closeModal();
            // Перенаправляем на главную страницу или дашборд
            window.location.href = '#chat';
        }, 2000);
    });
};

window.showSignup = function() {
    // Закрываем текущее модальное окно и показываем регистрацию
    closeModal();
    setTimeout(() => {
        startFreeTrial();
    }, 300);
};

// Глобальная функция для инициализации WebSocket
window.initializeWebSocket = function() {
    try {
        console.log('🔄 Подключаюсь к WebSocket...', API_BASE_URL);
        
        // Проверяем, что Socket.IO загружен
        if (typeof io === 'undefined') {
            console.log('⚠️ Socket.IO не загружен, пропускаем WebSocket');
            return;
        }
        
        // Подключаемся к WebSocket серверу
        socket = io(API_BASE_URL, {
            transports: ['polling', 'websocket'],
            timeout: 5000,
            forceNew: true
        });
        
        socket.on('connect', function() {
            console.log('🔌 WebSocket подключен!');
            showConnectionStatus('Подключено', 'success');
        });
        
        socket.on('disconnect', function() {
            console.log('❌ WebSocket отключен!');
            showConnectionStatus('Отключено', 'error');
        });
        
        socket.on('connect_error', function(error) {
            console.error('❌ Ошибка подключения WebSocket:', error);
            showConnectionStatus('Ошибка подключения', 'error');
            socket = null;
        });
        
        socket.on('project_status', function(data) {
            console.log('📦 Получен статус проекта:', data);
            handleProjectStatus(data);
        });
        
    } catch (error) {
        console.error('Ошибка подключения к WebSocket:', error);
        showConnectionStatus('Ошибка подключения', 'error');
        socket = null;
    }
};

// Показать статус подключения
function showConnectionStatus(message, type) {
    const statusDiv = document.createElement('div');
    statusDiv.className = `connection-status ${type}`;
    statusDiv.textContent = message;
    statusDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
    `;
    
    document.body.appendChild(statusDiv);
    
    setTimeout(() => {
        statusDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(statusDiv);
        }, 300);
    }, 3000);
}

// Обработка статуса проекта
function handleProjectStatus(data) {
    const { status, message, project_id, download_url } = data;
    
    if (status === 'completed') {
        showNotification('✅ Проект создан успешно!', 'success');
        showDownloadButton(download_url, project_id);
    } else if (status === 'error') {
        showNotification('❌ Ошибка создания проекта', 'error');
    } else if (status === 'generating') {
        showNotification('🔄 Создаю проект...', 'info');
    }
}

// Показать кнопку скачивания
function showDownloadButton(downloadUrl, projectId) {
    const downloadDiv = document.createElement('div');
    downloadDiv.className = 'download-notification';
    downloadDiv.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(45deg, #8b5cf6, #06b6d4);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
            z-index: 10000;
            animation: slideInUp 0.3s ease;
        ">
            <h4 style="margin: 0 0 0.5rem 0;">🎉 Проект готов!</h4>
            <p style="margin: 0 0 1rem 0; opacity: 0.9;">Ваш проект создан успешно</p>
            <button onclick="downloadProject('${downloadUrl}')" style="
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            ">📥 Скачать</button>
        </div>
    `;
    
    document.body.appendChild(downloadDiv);
    
    setTimeout(() => {
        downloadDiv.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(downloadDiv);
        }, 300);
    }, 10000);
}

// Скачать проект
function downloadProject(downloadUrl) {
    window.open(downloadUrl, '_blank');
}

// Показать статус AI
function showAIStatus() {
    fetch(`${API_BASE_URL}/api/ai/status`)
        .then(response => response.json())
        .then(data => {
            const status = data.available_services.map(service => 
                `${service.name}: ${service.configured ? '✅' : '❌'}`
            ).join('\n');
            
            alert(`🤖 Статус AI сервисов:\n\n${status}`);
        })
        .catch(error => {
            console.error('Ошибка получения статуса AI:', error);
            alert('❌ Не удалось получить статус AI сервисов');
        });
}

// Настройка навигации
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Плавная прокрутка для ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Настройка чата
function setupChatInterface() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');
    
    if (chatInput && sendButton) {
        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// Отправить сообщение
async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Добавляем сообщение пользователя
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Показываем индикатор печати
    showTypingIndicator();
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        
        // Скрываем индикатор печати
        hideTypingIndicator();
        
        // Добавляем ответ AI
        addMessage(data.message, 'ai', data);
        
        // Показываем предложения если есть
        if (data.suggestions && data.suggestions.length > 0) {
            showSuggestions(data.suggestions);
        }
        
    } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
        hideTypingIndicator();
        addMessage('Извините, произошла ошибка. Попробуйте еще раз.', 'ai');
    }
}

// Добавить сообщение в чат
function addMessage(text, sender, data = null) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = sender === 'ai' ? '🤖' : '👤';
    const avatarClass = sender === 'ai' ? 'ai-avatar' : 'user-avatar';
    
    let messageContent = `<p>${text}</p>`;
    
    // Если это проект, добавляем кнопку скачивания
    if (data && data.type === 'project_created' && data.download_url) {
        messageContent += `
            <div class="project-actions">
                <button class="download-btn" onclick="downloadProject('${data.download_url}', '${data.project_id}')">
                    📦 Скачать проект
                </button>
                <button class="view-btn" onclick="viewProject('${data.project_id}')">
                    👁️ Просмотр
                </button>
            </div>
        `;
    }
    
    messageDiv.innerHTML = `
        <div class="message-avatar ${avatarClass}">${avatar}</div>
        <div class="message-content">
            ${messageContent}
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Показать индикатор печати
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Скрыть индикатор печати
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Функции для работы с проектами
window.downloadProject = function(downloadUrl, projectId) {
    console.log('📦 Скачиваем проект:', projectId);
    
    // Создаем временную ссылку для скачивания
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `project_${projectId}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('📦 Проект загружается...', 'info');
};

window.viewProject = function(projectId) {
    console.log('👁️ Просматриваем проект:', projectId);
    showNotification('👁️ Функция просмотра будет добавлена позже', 'info');
};

// Показать предложения
function showSuggestions(suggestions) {
    const chatMessages = document.getElementById('chatMessages');
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'suggestions';
    
    const buttons = suggestions.map(suggestion => 
        `<button onclick="sendSuggestion('${suggestion}')" class="suggestion-btn">${suggestion}</button>`
    ).join('');
    
    suggestionsDiv.innerHTML = `
        <div class="suggestions-container">
            ${buttons}
        </div>
    `;
    
    chatMessages.appendChild(suggestionsDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Отправить предложение
function sendSuggestion(suggestion) {
    const chatInput = document.getElementById('chatInput');
    chatInput.value = suggestion;
    sendMessage();
    
    // Удаляем предложения
    const suggestions = document.querySelector('.suggestions');
    if (suggestions) {
        suggestions.remove();
    }
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        ${type === 'success' ? 'background: #10b981;' : 
          type === 'error' ? 'background: #ef4444;' : 
          'background: #3b82f6;'}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Настройка анимаций
function setupAnimations() {
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками функций
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });
}

// Настройка эффектов скролла
function setupScrollEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-background');
        
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });
}

// Настройка WebSocket
function setupWebSocket() {
    // WebSocket будет инициализирован асинхронно
    console.log('📡 WebSocket будет инициализирован после загрузки');
}

// CSS анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes slideInUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideOutDown {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(30px); opacity: 0; }
    }
    
    @keyframes fadeInUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    .typing-dots {
        display: flex;
        gap: 4px;
    }
    
    .typing-dots span {
        width: 8px;
        height: 8px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        animation: typingDot 1.4s ease-in-out infinite;
    }
    
    .typing-dots span:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-dots span:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typingDot {
        0%, 60%, 100% { transform: scale(1); opacity: 0.7; }
        30% { transform: scale(1.2); opacity: 1; }
    }
    
    .suggestions-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .suggestion-btn {
        background: rgba(139, 92, 246, 0.2);
        border: 1px solid rgba(139, 92, 246, 0.3);
        color: #8b5cf6;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }
    
    .suggestion-btn:hover {
        background: rgba(139, 92, 246, 0.3);
        transform: translateY(-1px);
    }
    
    .user-avatar {
        background: linear-gradient(45deg, #10b981, #06b6d4) !important;
    }
`;

document.head.appendChild(style);

// Демо анимация
let demoAnimationRunning = false;
let demoAnimationTimeout = null;

function startDemoAnimation() {
    if (demoAnimationRunning) return;
    
    demoAnimationRunning = true;
    console.log('🎬 Запускаю демо анимацию...');
    
    // Сбрасываем все шаги
    const steps = document.querySelectorAll('.demo-step');
    steps.forEach(step => step.classList.remove('active'));
    
    // Сбрасываем таймлайн
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => item.classList.remove('active'));
    
    // Запускаем анимацию по шагам
    setTimeout(() => activateStep(1), 500);
    setTimeout(() => activateStep(2), 3000);
    setTimeout(() => activateStep(3), 6000);
    setTimeout(() => showSuccess(), 9000);
    setTimeout(() => showEmotions(), 10000);
    setTimeout(() => activateTimelineItem(0), 500);
    setTimeout(() => activateTimelineItem(1), 3000);
    setTimeout(() => activateTimelineItem(2), 6000);
    setTimeout(() => activateTimelineItem(3), 9000);
    setTimeout(() => activateTimelineItem(4), 12000);
    
    // Сбрасываем флаг через 15 секунд
    demoAnimationTimeout = setTimeout(() => {
        demoAnimationRunning = false;
    }, 15000);
}

function activateStep(stepNumber) {
    const step = document.querySelector(`[data-step="${stepNumber}"]`);
    if (step) {
        step.classList.add('active');
        
        // Специальные эффекты для каждого шага
        if (stepNumber === 1) {
            typeInInput();
        } else if (stepNumber === 2) {
            showThinking();
        } else if (stepNumber === 3) {
            showCodeGeneration();
        }
    }
}

function activateTimelineItem(index) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => item.classList.remove('active'));
    
    if (timelineItems[index]) {
        timelineItems[index].classList.add('active');
    }
}

function typeInInput() {
    const inputSimulation = document.querySelector('.input-simulation');
    const text = 'Создай интернет-магазин с корзиной';
    
    if (!inputSimulation) return;
    
    let i = 0;
    inputSimulation.innerHTML = '<span class="typing-cursor">|</span>';
    
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            inputSimulation.innerHTML = text.substring(0, i + 1) + '<span class="typing-cursor">|</span>';
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 100);
}

function showThinking() {
    const thinkingText = document.querySelector('.ai-thinking p');
    const texts = [
        'Анализирую требования...',
        'Планирую структуру...',
        'Подбираю технологии...',
        'Готовлю шаблоны...'
    ];
    
    if (!thinkingText) return;
    
    let currentIndex = 0;
    const thinkingInterval = setInterval(() => {
        if (currentIndex < texts.length) {
            thinkingText.textContent = texts[currentIndex];
            currentIndex++;
        } else {
            clearInterval(thinkingInterval);
        }
    }, 700);
}

function showCodeGeneration() {
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
        }, index * 800);
    });
}

function showSuccess() {
    const appContent = document.querySelector('.app-content');
    if (appContent) {
        appContent.innerHTML = `
            <div class="success-animation">
                <div class="check-mark">✓</div>
            </div>
            <p>Готово!</p>
        `;
    }
}

function showEmotions() {
    const emotionFace = document.querySelector('.emotion-face');
    const emotionText = document.querySelector('.emotion-text p');
    
    if (!emotionFace || !emotionText) return;
    
    const emotions = [
        { face: '😊', text: '"Вау! Это работает!"' },
        { face: '🤩', text: '"Невероятно быстро!"' },
        { face: '💰', text: '"Уже получил заказы!"' },
        { face: '🎉', text: '"Бизнес процветает!"' }
    ];
    
    let currentEmotion = 0;
    const emotionInterval = setInterval(() => {
        if (currentEmotion < emotions.length) {
            emotionFace.textContent = emotions[currentEmotion].face;
            emotionText.textContent = emotions[currentEmotion].text;
            currentEmotion++;
        } else {
            clearInterval(emotionInterval);
        }
    }, 2000);
}

// Функция воспроизведения демо видео
window.playDemoVideo = function() {
    console.log('🎥 Воспроизводим демо видео...');
    
    // Создаем полноэкранное видео демонстрацию
    const videoModal = document.createElement('div');
    videoModal.className = 'video-demo-modal';
    videoModal.innerHTML = `
        <div class="video-modal-overlay" onclick="closeDemoVideo()">
            <div class="video-modal-content" onclick="event.stopPropagation()">
                <div class="video-modal-header">
                    <h3>🎬 Демонстрация Lovable AI</h3>
                    <button onclick="closeDemoVideo()" class="modal-close">&times;</button>
                </div>
                <div class="video-demo-container">
                    <div class="demo-progress">
                        <div class="progress-bar" id="demoProgress"></div>
                    </div>
                    <div class="demo-stages">
                        <div class="demo-stage active" id="stage1">
                            <h4>💡 Пользователь вводит идею</h4>
                            <p>"Хочу создать интернет-магазин с возможностью онлайн-оплаты"</p>
                            <div class="stage-visual">
                                <div class="typing-demo">Создай интернет-магазин...</div>
                            </div>
                        </div>
                        <div class="demo-stage" id="stage2">
                            <h4>🤖 ИИ анализирует запрос</h4>
                            <p>Lovable AI понимает требования и планирует архитектуру</p>
                            <div class="stage-visual">
                                <div class="ai-analysis">
                                    <div class="analysis-item">✓ Определена структура БД</div>
                                    <div class="analysis-item">✓ Выбраны технологии</div>
                                    <div class="analysis-item">✓ Спланирован UI/UX</div>
                                </div>
                            </div>
                        </div>
                        <div class="demo-stage" id="stage3">
                            <h4>⚡ Генерация кода</h4>
                            <p>ИИ создает полнофункциональное приложение</p>
                            <div class="stage-visual">
                                <div class="code-progress">
                                    <div class="progress-item">Frontend (React) - 100%</div>
                                    <div class="progress-item">Backend (Node.js) - 100%</div>
                                    <div class="progress-item">База данных - 100%</div>
                                    <div class="progress-item">Интеграции - 100%</div>
                                </div>
                            </div>
                        </div>
                        <div class="demo-stage" id="stage4">
                            <h4>🎉 Готовый продукт</h4>
                            <p>Полнофункциональный интернет-магазин готов к запуску</p>
                            <div class="stage-visual">
                                <div class="product-showcase">
                                    <div class="feature">✅ Каталог товаров</div>
                                    <div class="feature">✅ Корзина покупок</div>
                                    <div class="feature">✅ Система оплаты</div>
                                    <div class="feature">✅ Админ панель</div>
                                </div>
                            </div>
                        </div>
                        <div class="demo-stage" id="stage5">
                            <h4>💰 Успех в бизнесе</h4>
                            <p>Пользователь получает первые заказы и развивает бизнес</p>
                            <div class="stage-visual">
                                <div class="success-metrics">
                                    <div class="metric">📈 +300% продаж</div>
                                    <div class="metric">👥 1000+ клиентов</div>
                                    <div class="metric">💰 $50K+ доход</div>
                                    <div class="metric">⭐ 4.9/5 рейтинг</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="video-controls">
                        <button onclick="restartDemo()" class="control-btn">🔄 Повторить</button>
                        <button onclick="closeDemoVideo()" class="control-btn primary">✨ Попробовать</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем стили для видео модального окна
    const videoStyle = document.createElement('style');
    videoStyle.textContent = `
        .video-demo-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
        }
        
        .video-modal-content {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 20px;
            padding: 2rem;
            max-width: 900px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .video-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 1rem;
        }
        
        .video-modal-header h3 {
            color: white;
            margin: 0;
            font-size: 1.5rem;
        }
        
        .demo-progress {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            margin-bottom: 2rem;
            overflow: hidden;
        }
        
        .progress-bar {
            height: 100%;
            background: linear-gradient(45deg, #8b5cf6, #06b6d4);
            width: 0%;
            transition: width 0.5s ease;
            border-radius: 2px;
        }
        
        .demo-stage {
            display: none;
            text-align: center;
            padding: 2rem;
            animation: stageAppear 0.5s ease;
        }
        
        .demo-stage.active {
            display: block;
        }
        
        @keyframes stageAppear {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .demo-stage h4 {
            color: white;
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }
        
        .demo-stage p {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }
        
        .stage-visual {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 2rem;
            margin: 2rem 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .typing-demo {
            font-family: 'Courier New', monospace;
            font-size: 1.2rem;
            color: #10b981;
            animation: typewriter 2s steps(30) infinite;
        }
        
        .analysis-item, .progress-item, .feature, .metric {
            background: rgba(139, 92, 246, 0.2);
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 10px;
            padding: 1rem;
            margin: 0.5rem 0;
            color: white;
            animation: itemAppear 0.5s ease;
        }
        
        @keyframes itemAppear {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .video-controls {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
        }
        
        .control-btn {
            padding: 1rem 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            background: rgba(255, 255, 255, 0.05);
            color: white;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .control-btn.primary {
            background: linear-gradient(45deg, #8b5cf6, #06b6d4);
            border-color: transparent;
        }
        
        .control-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
        }
    `;
    
    document.head.appendChild(videoStyle);
    document.body.appendChild(videoModal);
    
    // Запускаем демонстрацию
    startVideoDemo();
};

function startVideoDemo() {
    let currentStage = 1;
    const totalStages = 5;
    const progressBar = document.getElementById('demoProgress');
    
    const stageInterval = setInterval(() => {
        // Обновляем прогресс
        const progress = (currentStage / totalStages) * 100;
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        
        // Скрываем предыдущий этап
        const prevStage = document.getElementById(`stage${currentStage - 1}`);
        if (prevStage) {
            prevStage.classList.remove('active');
        }
        
        // Показываем текущий этап
        const currentStageElement = document.getElementById(`stage${currentStage}`);
        if (currentStageElement) {
            currentStageElement.classList.add('active');
        }
        
        currentStage++;
        
        if (currentStage > totalStages) {
            clearInterval(stageInterval);
        }
    }, 3000);
}

window.closeDemoVideo = function() {
    const videoModal = document.querySelector('.video-demo-modal');
    if (videoModal) {
        videoModal.remove();
    }
};

window.restartDemo = function() {
    // Сбрасываем все этапы
    document.querySelectorAll('.demo-stage').forEach(stage => {
        stage.classList.remove('active');
    });
    
    // Показываем первый этап
    const firstStage = document.getElementById('stage1');
    if (firstStage) {
        firstStage.classList.add('active');
    }
    
    // Перезапускаем демонстрацию
    startVideoDemo();
};

// Автоматический запуск демо анимации при скролле
function setupDemoScrollTrigger() {
    const demoSection = document.getElementById('demo');
    if (!demoSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !demoAnimationRunning) {
                setTimeout(() => {
                    startDemoAnimation();
                }, 500);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(demoSection);
}

// Инициализируем демо триггеры при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDemoScrollTrigger);
} else {
    setupDemoScrollTrigger();
} 