"""
API Views for Valorant HUB Backend
Secure OpenRouter API integration with Django
"""
import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import StreamingHttpResponse
import json


@api_view(['POST'])
def chat_view(request):
    """
    POST /api/chat/
    
    Secure endpoint for AI chat with OpenRouter
    API key is protected on the server!
    
    Request body:
    {
        "messages": [{"role": "user", "content": "Hello"}],
        "model": "meta-llama/llama-3.2-3b-instruct:free",
        "temperature": 0.7,
        "max_tokens": 2000,
        "stream": false
    }
    """
    try:
        # Validate API key
        api_key = settings.OPENROUTER_API_KEY
        if not api_key:
            return Response(
                {'error': 'Server configuration error: API key not set'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Get request data
        messages = request.data.get('messages')
        model = request.data.get('model', settings.DEFAULT_AI_MODEL)
        temperature = request.data.get('temperature', 0.1)
        max_tokens = request.data.get('max_tokens', 4000)
        top_p = request.data.get('top_p', 1)
        stream = request.data.get('stream', False)
        
        # Validate messages
        if not messages or not isinstance(messages, list) or len(messages) == 0:
            return Response(
                {'error': 'Messages are required and must be a non-empty array'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Prepare request to OpenRouter
        payload = {
            'model': model,
            'messages': messages,
            'temperature': temperature,
            'max_tokens': max_tokens,
            'top_p': top_p,
            'stream': stream,
        }
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': settings.APP_URL,
            'X-Title': settings.APP_NAME,
        }
        
        # Make request to OpenRouter
        response = requests.post(
            settings.OPENROUTER_API_URL,
            json=payload,
            headers=headers,
            stream=stream,
            timeout=60
        )
        
        # Handle streaming response
        if stream:
            def generate():
                for line in response.iter_lines():
                    if line:
                        yield line + b'\n'
            
            return StreamingHttpResponse(
                generate(),
                content_type='text/event-stream'
            )
        
        # Handle regular response
        if response.status_code != 200:
            error_data = response.json() if response.text else {}
            return Response(
                {
                    'error': error_data.get('error', {}).get('message', 
                             f'OpenRouter API Error: {response.status_code}')
                },
                status=response.status_code
            )
        
        return Response(response.json(), status=status.HTTP_200_OK)
        
    except requests.exceptions.Timeout:
        return Response(
            {'error': 'Request timeout - AI model took too long to respond'},
            status=status.HTTP_504_GATEWAY_TIMEOUT
        )
    except requests.exceptions.RequestException as e:
        return Response(
            {'error': f'Failed to communicate with OpenRouter API: {str(e)}'},
            status=status.HTTP_502_BAD_GATEWAY
        )
    except Exception as e:
        return Response(
            {'error': f'Internal server error: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def models_view(request):
    """
    GET /api/models/
    
    Get available AI models from OpenRouter
    """
    try:
        # Validate API key
        api_key = settings.OPENROUTER_API_KEY
        if not api_key:
            return Response(
                {'error': 'Server configuration error: API key not set'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        headers = {
            'Authorization': f'Bearer {api_key}',
        }
        
        # Make request to OpenRouter
        response = requests.get(
            'https://openrouter.ai/api/v1/models',
            headers=headers,
            timeout=10
        )
        
        if response.status_code != 200:
            return Response(
                {'error': f'Failed to fetch models: {response.status_code}'},
                status=response.status_code
            )
        
        return Response(response.json(), status=status.HTTP_200_OK)
        
    except requests.exceptions.RequestException as e:
        return Response(
            {'error': f'Failed to fetch models: {str(e)}'},
            status=status.HTTP_502_BAD_GATEWAY
        )
    except Exception as e:
        return Response(
            {'error': f'Internal server error: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def health_check(request):
    """
    GET /api/health/
    
    Health check endpoint
    """
    api_key_configured = bool(settings.OPENROUTER_API_KEY)
    
    return Response({
        'status': 'healthy',
        'api_key_configured': api_key_configured,
        'app_name': settings.APP_NAME,
        'debug_mode': settings.DEBUG,
    }, status=status.HTTP_200_OK)
