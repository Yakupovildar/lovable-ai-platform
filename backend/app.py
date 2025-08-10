from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os
import json
import zipfile
import tempfile
import shutil
from datetime import datetime
import uuid
from pathlib import Path
import subprocess
import threading
import queue
import time

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Конфигурация
PROJECTS_DIR = "projects"
TEMP_DIR = "temp"
MAX_PROJECTS_PER_USER = 10

# Создаём директории если их нет
os.makedirs(PROJECTS_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

# Очередь для обработки генерации проектов
project_queue = queue.Queue()

class ProjectGenerator:
    def __init__(self):
        self.templates = {
            "html": {
                "files": {
                    "index.html": self.get_html_index,
                    "styles.css": self.get_html_styles,
                    "script.js": self.get_html_script,
                    "README.md": self.get_html_readme
                }
            }
        }
    
    def generate_project(self, project_type, description, project_name):
        """Генерирует проект на основе описания"""
        try:
            # Создаём уникальный ID проекта
            project_id = str(uuid.uuid4())
            project_path = os.path.join(PROJECTS_DIR, project_id)
            os.makedirs(project_path, exist_ok=True)
            
            # Получаем шаблон для типа проекта
            template = self.templates.get(project_type, self.templates["html"])
            
            # Генерируем файлы проекта
            for file_path, generator_func in template["files"].items():
                full_path = os.path.join(project_path, file_path)
                os.makedirs(os.path.dirname(full_path), exist_ok=True)
                
                content = generator_func(project_name, description)
                with open(full_path, 'w', encoding='utf-8') as f:
                    f.write(content)
            
            return {
                "success": True,
                "project_id": project_id,
                "project_name": project_name,
                "files": list(template["files"].keys())
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_html_index(self, project_name, description):
        return f"""<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{project_name}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>{project_name}</h1>
            <p>{description}</p>
        </header>
        <main>
            <p>Создано с помощью Lovable AI</p>
        </main>
    </div>
    <script src="script.js"></script>
</body>
</html>"""
    
    def get_html_styles(self, project_name, description):
        return """body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    text-align: center;
    color: white;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(10px);
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

p {
    font-size: 1.2rem;
    margin-bottom: 1rem;
}"""

    def get_html_script(self, project_name, description):
        return """console.log('Приложение загружено!');

// Добавляем интерактивность
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    
    container.addEventListener('click', function() {
        this.style.transform = 'scale(1.05)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
});"""

    def get_html_readme(self, project_name, description):
        return f"""# {project_name}

{description}

## Создано с помощью Lovable AI

### Запуск

Просто откройте index.html в браузере или используйте локальный сервер:

```bash
python -m http.server 8000
```

Затем откройте http://localhost:8000"""

# Инициализируем генератор проектов
generator = ProjectGenerator()

# Умный AI-агент с памятью, контекстом и простым обучением
class SmartAI:
    def __init__(self):
        self.conversation_history = []
        self.user_preferences = {}
        self.current_context = None
        self.last_topic = None
        self.user_mood = "neutral"
        self.interaction_count = 0
        
        # Система обучения
        self.learning_data = {
            "successful_responses": {},
            "failed_responses": {},
            "user_patterns": {},
            "preferred_topics": [],
            "response_style": "normal"
        }
        
    def generate_response(self, message):
        """Генерирует умный ответ с учетом контекста, настроения и обучения"""
        message_type = self.analyze_message(message)
        self.conversation_history.append({"user": message, "type": message_type})
        self.current_context = message_type
        self.last_topic = message_type
        
        # Учимся на основе сообщения пользователя
        self.learn_from_interaction(message, message_type)
        
        return self.generate_normal_response(message, message_type)
    
    def analyze_message(self, message):
        """Анализирует сообщение пользователя с учетом контекста"""
        message_lower = message.lower()
        self.interaction_count += 1
        
        # Приветствия
        if any(word in message_lower for word in ["привет", "здравствуй", "добрый", "hi", "hello"]):
            return "greeting"
        
        # Вопросы о самочувствии
        if any(word in message_lower for word in ["как дела", "как ты", "как поживаешь"]):
            return "wellbeing"
        
        # Запросы на создание проекта
        if any(word in message_lower for word in ["создай", "сделай", "построй", "разработай", "напиши"]):
            return "create_project"
        
        # Вопросы о возможностях
        if any(word in message_lower for word in ["что умеешь", "возможности", "функции", "помощь"]):
            return "capabilities"
        
        # Игры и развлечения
        if any(word in message_lower for word in ["игра", "game", "игр", "развлечение", "весело"]):
            return "game_discussion"
        
        # Вопросы о том, что можно создать
        if any(word in message_lower for word in ["что можно", "что думаешь", "как думаешь", "предложи", "идеи"]):
            return "suggestions"
        
        return "general"
    
    def learn_from_interaction(self, message, response_type):
        """Учится на основе взаимодействия с пользователем"""
        message_lower = message.lower()
        
        # Анализируем паттерны пользователя
        if "игра" in message_lower or "game" in message_lower:
            if "игра" not in self.learning_data["preferred_topics"]:
                self.learning_data["preferred_topics"].append("игра")
        
        if "будильник" in message_lower or "таймер" in message_lower:
            if "таймер" not in self.learning_data["preferred_topics"]:
                self.learning_data["preferred_topics"].append("таймер")
    
    def create_project_response(self, project_type, description):
        """Создает проект и возвращает ответ с ссылкой на скачивание"""
        # Используем глобальный генератор проектов
        global generator
        
        project_name = f"Проект {project_type}"
        result = generator.generate_project("html", description, project_name)
        
        if result['success']:
            # Создаём архив проекта
            archive_path = create_project_archive(result['project_id'])
            download_url = f"http://localhost:5002/api/download/{result['project_id']}"
            
            return {
                "type": "project_created",
                "message": f"✅ {description} готов!\n\n🎉 Ваш проект успешно создан!\n📦 Проект ID: {result['project_id']}\n⬇️ Вы можете скачать его по кнопке ниже.",
                "project_id": result['project_id'],
                "download_url": download_url,
                "suggestions": [
                    "Скачать проект",
                    "Создать другой проект",
                    "Показать код",
                    "Что еще можешь?"
                ]
            }
        else:
            return {
                "type": "error",
                "message": f"❌ Произошла ошибка при создании проекта: {result.get('error', 'Неизвестная ошибка')}",
                "suggestions": [
                    "Попробовать еще раз",
                    "Создать другой проект",
                    "Помощь"
                ]
            }
    
    def generate_normal_response(self, message, message_type):
        """Генерирует обычный ответ"""
        if message_type == "greeting":
            return {
                "type": "ai_response",
                "message": "Привет! 👋 Я Lovable AI - ваш помощник в создании кода. Я могу помочь вам создать веб-приложения, сайты, игры и многое другое! Что вас интересует?",
                "suggestions": [
                    "Расскажи, что ты умеешь",
                    "Создай будильник",
                    "Сделай калькулятор",
                    "Хочу игру"
                ]
            }
        
        elif message_type == "wellbeing":
            return {
                "type": "ai_response",
                "message": "Спасибо, у меня всё отлично! 😊 Я готов помочь вам создать что-то интересное. Может быть, хотите попробовать создать приложение?",
                "suggestions": [
                    "Создай будильник",
                    "Сделай калькулятор",
                    "Хочу игру",
                    "Расскажи о возможностях"
                ]
            }
        
        elif message_type == "game_discussion":
            return {
                "type": "ai_response",
                "message": "Отлично! 🎮 Игры - это всегда интересно! Я могу создать для вас различные игры:\n\n• 🎯 Игры на реакцию и точность\n• 🧩 Головоломки и пазлы\n• 🎲 Простые аркадные игры\n• 🏆 С системой очков и рекордов\n\nКакая игра вам больше нравится? Или есть конкретные идеи?",
                "suggestions": [
                    "Создай игру на реакцию",
                    "Сделай головоломку",
                    "Аркадная игра",
                    "Расскажи подробнее"
                ]
            }
        
        elif message_type == "suggestions":
            return {
                "type": "ai_response",
                "message": "Отличный вопрос! 🤔 Вот что я могу предложить создать прямо сейчас:\n\n🎮 **Игры:** аркадные, головоломки, на реакцию\n⏰ **Приложения:** будильники, калькуляторы, таймеры\n🎨 **Креативные проекты:** портфолио, презентации\n\nЧто из этого вас больше всего интересует? Или есть другие идеи?",
                "suggestions": [
                    "Расскажи про игры",
                    "Покажи приложения",
                    "Креативные проекты",
                    "Создай что-нибудь"
                ]
            }
        
        elif message_type == "create_project":
            # Определяем, что именно хочет создать пользователь
            message_lower = message.lower()
            
            if "калькулятор" in message_lower:
                return self.create_project_response("calculator", "Создаю красивый калькулятор с современным дизайном")
            elif "будильник" in message_lower:
                return self.create_project_response("alarm", "Создаю стильный будильник с звуковыми сигналами")
            elif "игр" in message_lower:
                return self.create_project_response("game", "Создаю увлекательную игру с интересной механикой")
            elif "сайт" in message_lower and "университет" in message_lower:
                return self.create_project_response("university", "Создаю современный сайт для университета")
            else:
                return {
                    "type": "ai_response", 
                    "message": "Отлично! 🚀 Я готов помочь вам создать проект! Расскажите подробнее, что именно вы хотите создать? Например:\n\n• ⏰ Будильник или таймер\n• 🧮 Калькулятор\n• 🎮 Игру\n• 📱 Веб-приложение\n\nЧто вас интересует?",
                    "suggestions": [
                        "Создай будильник",
                        "Сделай калькулятор", 
                        "Хочу игру",
                        "Покажи примеры"
                    ]
                }
        
        elif message_type == "capabilities":
            return {
                "type": "ai_response",
                "message": "Я умею создавать различные веб-приложения! 🚀\n\n• ⏰ Будильники и таймеры\n• 🧮 Калькуляторы\n• 🎮 Простые игры\n• 📱 Адаптивные сайты\n• 🎨 Красивые интерфейсы\n\nПросто скажите, что хотите создать, и я предложу лучшие варианты!",
                "suggestions": [
                    "Создай будильник",
                    "Сделай калькулятор",
                    "Хочу игру",
                    "Покажи примеры"
                ]
            }
        
        else:
            return {
                "type": "ai_response",
                "message": "Интересно! 🤔 Расскажите подробнее, что вы хотели бы создать? Я могу помочь с веб-приложениями, играми, калькуляторами и многим другим.",
                "suggestions": [
                    "Создай будильник",
                    "Сделай калькулятор",
                    "Хочу игру",
                    "Расскажи о возможностях"
                ]
            }

ai_agent = SmartAI()

# API endpoints
@app.route('/api/chat', methods=['POST'])
def chat():
    """Обработка сообщений чата"""
    data = request.json
    message = data.get('message', '')
    
    ai_response = ai_agent.generate_response(message)
    
    return jsonify(ai_response)

@app.route('/api/generate-project', methods=['POST'])
def generate_project():
    """Генерация проекта"""
    data = request.json
    description = data.get('description', '')
    project_name = data.get('project_name', 'Мой проект')
    project_type = data.get('project_type', 'html')
    
    # Генерируем проект
    result = generator.generate_project(project_type, description, project_name)
    
    if result['success']:
        # Создаём архив проекта
        archive_path = create_project_archive(result['project_id'])
        result['download_url'] = f"/api/download/{result['project_id']}"
        result['archive_path'] = archive_path
    
    return jsonify(result)

@app.route('/api/download/<project_id>')
def download_project(project_id):
    """Скачивание проекта"""
    project_path = os.path.join(PROJECTS_DIR, project_id)
    archive_path = os.path.join(TEMP_DIR, f"{project_id}.zip")
    
    if not os.path.exists(project_path):
        return jsonify({"error": "Проект не найден"}), 404
    
    # Создаём архив если его нет
    if not os.path.exists(archive_path):
        create_project_archive(project_id)
    
    return send_file(archive_path, as_attachment=True, download_name=f"project_{project_id}.zip")

@app.route('/api/projects')
def list_projects():
    """Список проектов"""
    projects = []
    for project_id in os.listdir(PROJECTS_DIR):
        project_path = os.path.join(PROJECTS_DIR, project_id)
        if os.path.isdir(project_path):
            projects.append({
                "id": project_id,
                "name": f"Проект {project_id[:8]}",
                "created_at": datetime.fromtimestamp(os.path.getctime(project_path)).isoformat()
            })
    
    return jsonify({"projects": projects})

@app.route('/api/ai/status')
def get_ai_status():
    """Получить статус AI сервисов"""
    return jsonify({
        "available_services": [
            {
                "name": "SmartAI",
                "enabled": True,
                "configured": True
            }
        ],
        "current_ai": "smartai",
        "configured": True
    })

def create_project_archive(project_id):
    """Создаёт архив проекта"""
    project_path = os.path.join(PROJECTS_DIR, project_id)
    archive_path = os.path.join(TEMP_DIR, f"{project_id}.zip")
    
    with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(project_path):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, project_path)
                zipf.write(file_path, arcname)
    
    return archive_path

# WebSocket для real-time обновлений
@socketio.on('connect')
def handle_connect():
    print('Клиент подключился')

@socketio.on('disconnect')
def handle_disconnect():
    print('Клиент отключился')

@socketio.on('generate_project')
def handle_project_generation(data):
    """Обработка генерации проекта через WebSocket"""
    project_id = data.get('project_id')
    description = data.get('description')
    project_name = data.get('project_name', 'Мой проект')
    project_type = data.get('project_type', 'html')
    
    # Отправляем статус начала генерации
    emit('project_status', {
        'status': 'generating',
        'message': 'Создаю проект...'
    })
    
    # Генерируем проект
    result = generator.generate_project(project_type, description, project_name)
    
    if result['success']:
        # Создаём архив
        archive_path = create_project_archive(result['project_id'])
        
        emit('project_status', {
            'status': 'completed',
            'project_id': result['project_id'],
            'download_url': f"/api/download/{result['project_id']}",
            'message': 'Проект создан успешно!'
        })
    else:
        emit('project_status', {
            'status': 'error',
            'message': f'Ошибка: {result["error"]}'
        })

if __name__ == '__main__':
    print("🚀 Запускаю Lovable AI Platform...")
    print("📍 Backend: http://localhost:5002")
    print("🔌 WebSocket: ws://localhost:5002")
    print("💡 Для остановки нажмите Ctrl+C")
    print("=" * 50)
    
    socketio.run(app, host='0.0.0.0', port=5002, debug=True) 