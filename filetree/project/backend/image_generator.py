import requests

OLLAMA_API_URL = "http://localhost:11434/api/generate"  # Example Ollama endpoint

def generate_image_for_option(option_text):
    payload = {
        "model": "llava",  # Example Ollama model for image generation
        "prompt": f"Generate an image representing: {option_text}"
    }
    response = requests.post(OLLAMA_API_URL, json=payload)
    if response.status_code == 200:
        return f"https://fakeimageapi.com/{option_text.replace(' ', '_')}.png"  # Placeholder
    return None
