# InDesign Arabic to English Translator

An Adobe InDesign script that translates Arabic text to English using Google's Gemini API while preserving all text formatting, styles, and colors.

## Features

- ✅ Translates Arabic text to English using Gemini API
- ✅ Preserves text formatting (fonts, sizes, colors, styles)
- ✅ Works with selected text frames or highlighted text
- ✅ Maintains paragraph and character styles
- ✅ Preserves colors (fill and stroke)

## Prerequisites

1. **Adobe InDesign** (CS6 or later)
2. **Google Gemini API Key** - Get one from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **PowerShell** (Windows) or **curl** (Mac/Linux) - for API communication

## Installation

1. **Download the script files:**
   - `TranslateArabicToEnglish.jsx` (main script)
   - `geminiAPI.jsxinc` (API helper)

2. **Set up your API key:**
   - Copy `config.json.example` to `config.json`
   - Open `config.json` and replace `YOUR_GEMINI_API_KEY_HERE` with your actual Gemini API key
   - Place `config.json` in one of these locations:
     - `%APPDATA%\InDesignTranslator\config.json` (Windows)
     - `~/Library/Preferences/InDesignTranslator/config.json` (Mac)
     - Same folder as the script files

3. **Install the script in InDesign:**
   - **Windows:** Copy both files to `C:\Users\[YourUsername]\AppData\Roaming\Adobe\InDesign\[Version]\Scripts\Scripts Panel\User\`
   - **Mac:** Copy both files to `~/Library/Preferences/Adobe InDesign/[Version]/Scripts/Scripts Panel/User/`
   - Or place both files in the same folder and run from File > Scripts > User
   - **Important:** The script should appear under the "User" folder in the Scripts panel, not "Samples"

## Usage

1. Open your InDesign document with Arabic text
2. **Select one of the following:**
   - A text frame containing Arabic text, OR
   - Highlight specific Arabic text
3. Run the script:
   - Go to **File > Scripts > User** and select `TranslateArabicToEnglish.jsx`
   - Or use the Scripts panel (Window > Utilities > Scripts)
4. The script will:
   - Extract the Arabic text
   - Send it to Gemini API for translation
   - Replace the text with English translation
   - Preserve all formatting, styles, and colors

## How It Works

1. **Text Detection:** The script detects selected text frames or highlighted text ranges
2. **Format Preservation:** It captures all formatting information (fonts, sizes, colors, styles) for each character
3. **Translation:** Sends the text to Gemini API with a translation prompt
4. **Format Application:** Applies the original formatting to the translated text

## Configuration

### API Key Setup

Create a `config.json` file with the following structure:

```json
{
  "apiKey": "your-actual-api-key-here"
}
```

If the config file is not found, the script will prompt you to enter the API key manually.

### API Model

The script uses `gemini-pro` model by default. To change it, edit the model name in `geminiAPI.jsxinc`:

```javascript
var apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey;
```

## Troubleshooting

### "API key not found" error
- Make sure `config.json` exists and contains a valid API key
- Check that the file is in one of the expected locations
- Or enter the API key when prompted

### "Translation failed" error
- Check your internet connection
- Verify your API key is valid and has credits/quota
- Check if PowerShell (Windows) or curl (Mac/Linux) is available

### Formatting not preserved
- Make sure you're selecting text within a text frame
- Some complex formatting might not be fully preserved if the translated text length differs significantly

### Script doesn't run
- Make sure both `.jsx` and `.jsxinc` files are in the same location
- Check InDesign's Scripts panel for error messages
- Verify you're using a compatible InDesign version

## Limitations

- The script processes text sequentially, so large documents may take time
- Very long text blocks might hit API limits (split into smaller chunks if needed)
- Some advanced formatting features might not be fully preserved
- Requires internet connection for API calls

## API Costs

Google Gemini API has usage limits and may charge based on your plan. Check [Google AI Studio](https://makersuite.google.com/) for current pricing and limits.

## License

This script is provided as-is for personal and commercial use.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify your API key and internet connection
3. Check InDesign's error console for detailed error messages

