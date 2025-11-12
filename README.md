# InDesign Arabic to English Translator

An Adobe InDesign script that translates Arabic text to English using Google's Gemini API while preserving all text formatting, styles, colors, and paragraph structure.

## 📹 Demo Video

https://github.com/yaraabdullah/InDesign-Translator/Demo.mp4

*Click the link above to watch the demo video*

## Features

- ✅ **Cross-platform** - Works on both Windows and Mac
- ✅ Translates Arabic text to English using Gemini API
- ✅ Preserves text formatting (fonts, sizes, colors, styles)
- ✅ Maintains paragraph structure (each line stays on its own line)
- ✅ Preserves individual character formatting (colors, sizes per paragraph)
- ✅ Works with selected text frames or highlighted text
- ✅ Shows progress indicator during translation
- ✅ Silent execution (no PowerShell/terminal windows)
- ✅ Automatic platform detection (Windows uses PowerShell, Mac uses curl)

## Prerequisites

1. **Adobe InDesign** (CS6 or later) - Works on both **Windows** and **Mac**
2. **Internet connection** - for API communication
3. **PowerShell** (Windows) or **curl** (Mac/Linux) - Automatically detected, no configuration needed

## Installation

1. **Download the script files:**
   - `TranslateArabicToEnglish.jsx` (main script)
   - `geminiAPI.jsxinc` (API helper)

2. **Install the script in InDesign:**
   
   **Windows:**
   - Copy both files to: `C:\Users\[YourUsername]\AppData\Roaming\Adobe\InDesign\[Version]\Scripts\Scripts Panel\User\`
   - To find this folder: Press `Win + R`, type `%APPDATA%`, press Enter, then navigate to `Adobe\InDesign\[Version]\Scripts\Scripts Panel\User\`
   - Create the "User" folder if it doesn't exist
   
   **Mac:**
   - Copy both files to: `~/Library/Preferences/Adobe InDesign/[Version]/Scripts/Scripts Panel/User/`
   - To find this folder: Open Finder, press `Cmd + Shift + G`, type the path above
   - Create the "User" folder if it doesn't exist

3. **Restart InDesign**

4. **Verify installation:**
   - Open Scripts panel: **Window > Utilities > Scripts**
   - Find `TranslateArabicToEnglish.jsx` under the **"User"** folder
   - The script is ready to use!

## Usage

1. Open your InDesign document with Arabic text
2. **Select one of the following:**
   - A text frame containing Arabic text, OR
   - Highlight specific Arabic text (including selecting all text)
3. Run the script:
   - Go to **Window > Utilities > Scripts** and double-click `TranslateArabicToEnglish.jsx` under the "User" folder
   - Or go to **File > Scripts > User** and select `TranslateArabicToEnglish.jsx`
4. A progress window will appear showing translation progress
5. The script will:
   - Translate each paragraph separately to preserve line structure
   - Replace the text with English translation
   - Preserve all formatting, styles, colors, and sizes
   - Each paragraph maintains its original formatting

## How It Works

1. **Text Detection:** The script detects selected text frames or highlighted text ranges
2. **Format Preservation:** It captures all formatting information (fonts, sizes, colors, styles) for each character and paragraph
3. **Paragraph-by-Paragraph Translation:** Each paragraph is translated separately to preserve line breaks
4. **Translation:** Sends each paragraph to Gemini API for translation
5. **Format Application:** Applies the original formatting to the translated text, preserving colors, sizes, and styles

## Features in Detail

### Format Preservation
- **Colors:** Each paragraph maintains its original fill and stroke colors
- **Font Sizes:** Each paragraph keeps its original point size
- **Fonts:** Original font families are preserved
- **Styles:** Character and paragraph styles are maintained
- **Line Structure:** Each paragraph stays on its own line

### Selection Methods
The script works with:
- Selected text frames
- Highlighted text (partial or full selection)
- Selected words, lines, or paragraphs
- Multiple selections

## Troubleshooting

### "Translation failed" error
- Check your internet connection
- The API key is included in the script - no configuration needed
- If issues persist, verify the API key in `geminiAPI.jsxinc` is valid

### "No text found in selection" error
- Make sure you've selected a text frame or highlighted some text
- Try selecting the text frame itself (click the frame edge) instead of just the text
- The script works with both partial and full text selections

### Formatting not preserved correctly
- Make sure you're selecting text within a text frame
- Each paragraph should maintain its own formatting
- If formatting is lost, try selecting the entire text frame instead of just text

### Script doesn't run
- Make sure both `.jsx` and `.jsxinc` files are in the same location
- Restart InDesign after copying files
- Check InDesign's Scripts panel for error messages
- Verify you're using a compatible InDesign version

### Progress window doesn't appear
- This is normal - the window may appear briefly
- The script runs silently in the background
- Translation may take a few seconds depending on text length

## Limitations

- The script processes text paragraph by paragraph, so large documents may take time
- Very long paragraphs might hit API limits (split into smaller paragraphs if needed)
- Requires internet connection for API calls
- API key is hardcoded in the script (see `geminiAPI.jsxinc`)

## API Information

The script uses Google's Gemini 2.5 Flash model for translation. The API key is included in the script for convenience. For production use, you may want to use your own API key.

To change the API key, edit `geminiAPI.jsxinc` and update the `GEMINI_API_KEY` variable.

## License

This script is provided as-is for personal and commercial use.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify your internet connection
3. Check InDesign's error console for detailed error messages
4. Make sure both script files are in the same folder

## Contributing

Feel free to submit issues or pull requests to improve this script!
