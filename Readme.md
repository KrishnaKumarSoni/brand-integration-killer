# YouTube Brand Integration Analyzer

This project provides a Python script that analyzes YouTube video transcripts to identify brand integrations and promotions. It uses the YouTube Transcript API to fetch video transcripts and OpenAI's GPT-4 model to analyze the content.

## Features

- Fetches transcripts from YouTube videos
- Supports multiple languages with automatic translation to English
- Identifies brand integrations and promotions in video content
- Outputs results in a clean JSON format

## Prerequisites

- Python 3.6 or higher
- An OpenAI API key

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/youtube-brand-integration-analyzer.git
   cd youtube-brand-integration-analyzer
   ```

2. Install the required packages:
   ```
   pip install python-dotenv openai youtube_transcript_api
   ```

3. Create a `.env` file in the project root and add your OpenAI API key:
   ```
   ***REMOVED***=your_openai_api_key_here
   ```

   Note: Never commit your `.env` file to version control. It's included in the `.gitignore` file to prevent accidental commits.

## Usage

Run the script:
```
python youtube_brand_analyzer.py
```

When prompted, enter the URL of the YouTube video you want to analyze. The script will fetch the transcript, analyze it for brand integrations, and output the results in JSON format.

## Managing Environment Variables and API Keys

This project uses a `.env` file to manage environment variables, including API keys. Here's how to handle it securely:

1. Create a `.env` file in the project root directory.
2. Add your OpenAI API key to the `.env` file:
   ```
   ***REMOVED***=your_actual_api_key_here
   ```
3. Never commit the `.env` file to version control. It's listed in the `.gitignore` file to prevent accidental commits.
4. For deployment or sharing the project, create a `.env.example` file with placeholder values:
   ```
   ***REMOVED***=your_openai_api_key_here
   ```
   This file can be safely committed to the repository.

Remember to keep your API keys confidential and never share them publicly.

### If you're interested in contributing to the Chrome extension:

1. Check out the js-code branch:
2. Copygit checkout js-code
3. Navigate to the JS code folder to find the extension files.
4. Make your changes and test the extension locally.
5. Submit a pull request to the js-code branch with your changes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

For those interested in the JavaScript version of this project (aimed at creating a Chrome Extension), please check the `dev` branch of this repository.

When contributing, remember to:
1. Never commit API keys or sensitive information.
2. Use environment variables for configuration.
3. Update the `.env.example` file if you add new environment variables.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [YouTube Transcript API](https://github.com/jdepoix/youtube-transcript-api)
- [OpenAI](https://www.openai.com/)

## Disclaimer

This tool is for educational purposes only. Always respect YouTube's terms of service and content creators' rights when using this tool.
