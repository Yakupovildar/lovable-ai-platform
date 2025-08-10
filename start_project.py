#!/usr/bin/env python3
"""
Скрипт для запуска Lovable AI Platform
"""

import os
import sys
import subprocess
import time
import threading
import webbrowser
from pathlib import Path

def check_python():
    """Проверяет версию Python"""
    if sys.version_info < (3, 7):
        print("❌ Требуется Python 3.7 или выше")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} найден")
    return True

def setup_backend():
    """Настраивает и запускает backend"""
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Папка backend не найдена")
        return False
    
    # Проверяем виртуальное окружение в корневой директории
    venv_dir = Path("venv")
    if not venv_dir.exists():
        print("📦 Создаю виртуальное окружение...")
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
    
    # Устанавливаем зависимости
    print("📦 Устанавливаю зависимости...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"], check=True)
    
    print("✅ Backend готов к запуску")
    return True

def start_backend():
    """Запускает backend сервер"""
    print("🚀 Запускаю backend...")
    backend_dir = Path("backend")
    
    # Переходим в backend директорию
    if backend_dir.exists():
        os.chdir(backend_dir)
    else:
        print("❌ Папка backend не найдена")
        return
    
    # Запускаем Flask приложение
    try:
        subprocess.run([sys.executable, "app.py"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка запуска backend: {e}")
    except FileNotFoundError:
        print("❌ Файл app.py не найден в backend директории")

def start_frontend():
    """Запускает frontend сервер"""
    print("🌐 Запускаю frontend...")
    os.chdir(Path.cwd().parent)  # Возвращаемся в корневую директорию
    
    # Запускаем HTTP сервер
    subprocess.run([sys.executable, "-m", "http.server", "8000"])

def open_browser():
    """Открывает браузер"""
    time.sleep(3)  # Ждем запуска серверов
    print("🌐 Открываю браузер...")
    webbrowser.open("http://localhost:8000")

def main():
    """Основная функция"""
    print("💻 Lovable AI Platform")
    print("=" * 50)
    
    # Проверяем Python
    if not check_python():
        return
    
    # Настраиваем backend
    if not setup_backend():
        return
    
    print("\n🎯 Все готово к запуску!")
    print("📍 Backend: http://localhost:5002")
    print("🌐 Frontend: http://localhost:8000")
    print("🔌 WebSocket: ws://localhost:5002")
    print("\n💡 Для остановки нажмите Ctrl+C")
    print("=" * 50)
    
    # Запускаем серверы в отдельных потоках
    backend_thread = threading.Thread(target=start_backend, daemon=True)
    frontend_thread = threading.Thread(target=start_frontend, daemon=True)
    browser_thread = threading.Thread(target=open_browser, daemon=True)
    
    try:
        backend_thread.start()
        time.sleep(2)  # Ждем запуска backend
        
        frontend_thread.start()
        time.sleep(1)  # Ждем запуска frontend
        
        browser_thread.start()
        
        # Ждем завершения
        backend_thread.join()
        frontend_thread.join()
        
    except KeyboardInterrupt:
        print("\n👋 Останавливаю серверы...")
        print("✅ Все серверы остановлены")

if __name__ == "__main__":
    main() 