import os
import re
from dotenv import load_dotenv
from openai import OpenAI
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
import json
import urllib.parse

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('***REMOVED***'))

def get_video_id(url):
    """Extract video ID from YouTube URL"""
    query = urllib.parse.urlparse(url)
    if query.hostname == 'youtu.be':
        return query.path[1:]
    if query.hostname in ('www.youtube.com', 'youtube.com'):
        if query.path == '/watch':
            return urllib.parse.parse_qs(query.query)['v'][0]
        if query.path[:7] == '/embed/':
            return query.path.split('/')[2]
        if query.path[:3] == '/v/':
            return query.path.split('/')[2]
    return None

def fetch_transcript(video_id):
    """Fetch transcript for a given video ID"""
    try:
        # Get the list of available transcripts
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        
        # Try to get the manually created transcript first
        try:
            transcript = transcript_list.find_manually_created_transcript(['en'])
        except:
            # If no manually created transcript, try to find any available transcript
            transcript = next(iter(transcript_list))
        
        # Fetch the actual transcript data
        transcript_data = transcript.fetch()
        
        # If the transcript is not in English, try to translate it to save tokens
        if transcript.language_code != 'en':
            try:
                transcript_data = transcript.translate('en').fetch()
                print(f"Translated transcript from {transcript.language_code} to English")
            except Exception as e:
                print(f"Couldn't translate transcript: {str(e)}")
        
        return '\n'.join(f"[{item['start']}] {item['text']}" for item in transcript_data)
    
    except TranscriptsDisabled:
        print("Transcripts are disabled for this video.")
        return None
    
    except Exception as e:
        print(f"Error fetching transcript: {str(e)}")
        return None

def extract_json_from_string(s):
    """Extract JSON from a string"""
    match = re.search(r'\[[\s\S]*\]', s)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            print("Found a JSON-like structure, but it's not valid JSON.")
            return None
    else:
        print("No JSON-like structure found in the response.")
        return None

def analyze_transcript(transcript):
    """Analyze transcript using OpenAI API"""
    prompt = f"""
    Given the following transcript of a YouTube video, identify and extract parts where there is unwanted promotion or sponsored content that is totally off from the main content. These are parts where the conversation goes off-topic and includes advertisements or promotions of a specific product or service from a company. 
    Don't highlight just any company mention in the video transcript. Carefully think which part is not about the main discussion of the video and is a place where narrative suddenly changes to selling something directly to the viewer instead of just informing about the product or service. Provide the results in JSON format with each brand integration part including the content, start time, and end time.
    Be very open minded and do not include content which doesn't feel sponsored. If there's no brand integration, respond with an empty JSON. It's important that we only include those parts in the response which actually sponsored content and not include any genuine discussion about some other company from the video
    Think critically and find if there is even any brand integration in the first place. If not, just respond with an empty JSON.
    Transcript:
    {transcript}

    Expected JSON format:
    [
      {{
        "content": "Brand integration content",
        "start": "start time",
        "end": "end time"
      }},
      ...
    ]
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant. Respond only with the requested JSON."},
                {"role": "user", "content": prompt}
            ]
        )
        response_content = response.choices[0].message.content
        json_data = extract_json_from_string(response_content)
        if json_data is None:
            print("Failed to extract valid JSON from the API response.")
            print("Raw response:", response_content)
        return json_data
    except Exception as e:
        print(f"Error analyzing transcript: {str(e)}")
        return None

def main():
    url = input("Enter the YouTube video URL: ")
    video_id = get_video_id(url)
    
    if not video_id:
        print("Invalid YouTube URL")
        return

    transcript = fetch_transcript(video_id)
    if not transcript:
        return

    analysis = analyze_transcript(transcript)
    if analysis:
        print(json.dumps(analysis, indent=2))
    else:
        print("Failed to analyze the transcript")

if __name__ == "__main__":
    main()