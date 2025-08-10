import requests
import json
import time
from typing import Dict, Any, Optional
from .ai_config import AIConfig

class RussianAI:
    def __init__(self):
        self.config = AIConfig()
        self.session = requests.Session()
    
    def generate_response(self, prompt: str, ai_service: str = None) -> Dict[str, Any]:
        """Генерирует ответ используя указанный AI сервис"""
        if not ai_service:
            ai_service = self.config.default_ai
        
        if ai_service == 'gigachat':
            return self._gigachat_request(prompt)
        elif ai_service == 'yandex':
            return self._yandex_request(prompt)
        elif ai_service == 'localai':
            return self._localai_request(prompt)
        else:
            return self._fallback_response(prompt)
    
    def _gigachat_request(self, prompt: str) -> Dict[str, Any]:
        """Запрос к GigaChat API"""
        if not self.config.gigachat_enabled:
            return self._error_response("GigaChat не настроен")
        
        try:
            headers = {
                'Authorization': f'Bearer {self.config.gigachat_api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': 'GigaChat:latest',
                'messages': [{'role': 'user', 'content': prompt}],
                'temperature': 0.7,
                'max_tokens': 2000
            }
            
            response = self.session.post(
                'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'success': True,
                    'response': result['choices'][0]['message']['content'],
                    'ai_service': 'gigachat'
                }
            else:
                return self._error_response(f"GigaChat ошибка: {response.status_code}")
                
        except Exception as e:
            return self._error_response(f"GigaChat ошибка: {str(e)}")
    
    def _yandex_request(self, prompt: str) -> Dict[str, Any]:
        """Запрос к Yandex GPT API"""
        if not self.config.yandex_enabled:
            return self._error_response("Yandex GPT не настроен")
        
        try:
            headers = {
                'Authorization': f'Api-Key {self.config.yandex_api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'modelUri': 'gpt://b1g8c7fqomqkqkqkqkqk/yandexgpt-lite',
                'completionText': prompt,
                'maxTokens': 2000
            }
            
            response = self.session.post(
                'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'success': True,
                    'response': result['result']['alternatives'][0]['text'],
                    'ai_service': 'yandex'
                }
            else:
                return self._error_response(f"Yandex GPT ошибка: {response.status_code}")
                
        except Exception as e:
            return self._error_response(f"Yandex GPT ошибка: {str(e)}")
    
    def _localai_request(self, prompt: str) -> Dict[str, Any]:
        """Запрос к LocalAI"""
        if not self.config.localai_enabled:
            return self._error_response("LocalAI не настроен")
        
        try:
            headers = {'Content-Type': 'application/json'}
            
            data = {
                'model': 'gpt-3.5-turbo',
                'messages': [{'role': 'user', 'content': prompt}],
                'temperature': 0.7,
                'max_tokens': 2000
            }
            
            response = self.session.post(
                f'{self.config.localai_url}/v1/chat/completions',
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'success': True,
                    'response': result['choices'][0]['message']['content'],
                    'ai_service': 'localai'
                }
            else:
                return self._error_response(f"LocalAI ошибка: {response.status_code}")
                
        except Exception as e:
            return self._error_response(f"LocalAI ошибка: {str(e)}")
    
    def _fallback_response(self, prompt: str) -> Dict[str, Any]:
        """Fallback ответ когда AI сервисы недоступны"""
        return {
            'success': True,
            'response': f"Извините, AI сервисы временно недоступны. Ваш запрос: {prompt}",
            'ai_service': 'fallback'
        }
    
    def _error_response(self, error_message: str) -> Dict[str, Any]:
        """Возвращает ошибку"""
        return {
            'success': False,
            'error': error_message,
            'ai_service': 'error'
        }
    
    def generate_project(self, description: str, project_type: str = 'html') -> Dict[str, Any]:
        """Генерирует проект на основе описания"""
        prompt = self.config.prompts['project_generation'].format(description=description)
        
        # Пробуем разные AI сервисы
        available_ais = self.config.get_available_ais()
        
        for ai_service in available_ais:
            result = self.generate_response(prompt, ai_service)
            if result['success']:
                return self._parse_project_response(result['response'], project_type)
        
        return self._error_response("Не удалось сгенерировать проект")
    
    def improve_project(self, code: str) -> Dict[str, Any]:
        """Улучшает существующий проект"""
        prompt = self.config.prompts['project_improvement'].format(code=code)
        
        available_ais = self.config.get_available_ais()
        
        for ai_service in available_ais:
            result = self.generate_response(prompt, ai_service)
            if result['success']:
                return {
                    'success': True,
                    'improved_code': result['response'],
                    'ai_service': ai_service
                }
        
        return self._error_response("Не удалось улучшить проект")
    
    def _parse_project_response(self, response: str, project_type: str) -> Dict[str, Any]:
        """Парсит ответ AI и извлекает код проекта"""
        try:
            # Простая логика извлечения кода из ответа
            files = {
                'index.html': '',
                'styles.css': '',
                'script.js': '',
                'README.md': ''
            }
            
            # Разделяем ответ на файлы (упрощенная логика)
            lines = response.split('\n')
            current_file = None
            
            for line in lines:
                if 'index.html' in line.lower():
                    current_file = 'index.html'
                elif 'styles.css' in line.lower() or 'css' in line.lower():
                    current_file = 'styles.css'
                elif 'script.js' in line.lower() or 'javascript' in line.lower():
                    current_file = 'script.js'
                elif 'readme' in line.lower():
                    current_file = 'README.md'
                elif current_file:
                    files[current_file] += line + '\n'
            
            return {
                'success': True,
                'files': files,
                'project_type': project_type
            }
            
        except Exception as e:
            return self._error_response(f"Ошибка парсинга проекта: {str(e)}")
