import { OpenAI } from 'openai';
import { getSubtitles } from 'youtube-captions-scraper';

const openai = new OpenAI({
  apiKey: 'your-api-key'
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('Message received in background script:', request);

  if (request.action === 'fetchAndAnalyzeTranscript') {
    const videoUrl = request.url;
    console.log('Fetching transcript for URL:', videoUrl);

    try {
      const videoId = new URL(videoUrl).searchParams.get('v');
      let captions = await getSubtitles({ videoID: videoId, lang: 'hi' });
      if (!captions.length) {
        captions = await getSubtitles({ videoID: videoId });
      }

      const transcriptText = captions.map(item => `[${item.start}] ${item.text}`).join('\n');
      const prompt = `
        Given the following transcript of a YouTube video, identify and extract parts where there is brand integration or promotion. These are parts where the conversation goes off-topic and includes advertisements or promotions of a specific brand. Provide the results in JSON format with each brand integration part including the content, start time, and end time.

        Transcript:
        ${transcriptText}

        Expected JSON format:
        [
          {
            "content": "Brand integration content",
            "start": "start time",
            "end": "end time"
          },
          ...
        ]
      `;

      const completion = await openai.chat.completions.create({
        messages: [{"role": "system", "content": "You are a helpful assistant."},
                   {"role": "user", "content": prompt}],
        model: "gpt-4o"
      });

      const responseContent = completion.choices[0].message.content;
      const jsonStart = responseContent.indexOf('[');
      const jsonEnd = responseContent.lastIndexOf(']') + 1;
      const jsonResponse = responseContent.substring(jsonStart, jsonEnd);
      const analysis = JSON.parse(jsonResponse);

      sendResponse({ success: true, analysis });
    } catch (error) {
      console.error('Error:', error.message);
      sendResponse({ success: false, error: error.message });
    }

    return true;
  }
});
