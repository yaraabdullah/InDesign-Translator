/*
 * InDesign Script: Arabic to English Translator
 * Uses Google Gemini API for translation
 * Preserves text styles and colors
 */

//@include "geminiAPI.jsxinc"

// Main translation function
function main() {
    try {
        // Check if a document is open
        if (app.documents.length === 0) {
            alert("Please open an InDesign document first.");
            return;
        }

        var doc = app.activeDocument;
        var selection = app.selection;

        if (selection.length === 0) {
            alert("Please select a text frame or highlight some text.");
            return;
        }

        // Process the selection
        var textItems = [];
        
        for (var i = 0; i < selection.length; i++) {
            var item = selection[i];
            
            if (item.constructor.name === "TextFrame") {
                // Selected text frame - translate all text in the frame
                if (item.texts.length > 0 && item.texts[0].contents.trim() !== "") {
                    textItems.push({
                        text: item.texts[0],
                        parent: item
                    });
                }
            } else if (item.constructor.name === "Text" || item.constructor.name === "TextStyleRange") {
                // Selected text range
                var parentFrame = item.parentTextFrames[0];
                if (parentFrame && item.contents.trim() !== "") {
                    textItems.push({
                        text: item,
                        parent: parentFrame
                    });
                }
            } else if (item.constructor.name === "Character" || item.constructor.name === "Word" || item.constructor.name === "Line" || item.constructor.name === "Paragraph") {
                // Selected text element - get the parent text
                var parentFrame = item.parentTextFrames[0];
                if (parentFrame) {
                    // Get the text range for this element
                    var startIdx = item.startOffset;
                    var endIdx = item.endOffset;
                    if (endIdx > startIdx) {
                        var textRange = item.parent.characters.itemByRange(startIdx, endIdx - 1);
                        if (textRange && textRange.contents.trim() !== "") {
                            textItems.push({
                                text: textRange,
                                parent: parentFrame
                            });
                        }
                    }
                }
            } else if (item.constructor.name === "InsertionPoint") {
                // Insertion point - get the paragraph or word
                var parentFrame = item.parentTextFrames[0];
                if (parentFrame) {
                    var para = item.paragraphs[0];
                    if (para && para.contents.trim() !== "") {
                        textItems.push({
                            text: para,
                            parent: parentFrame
                        });
                    }
                }
            }
        }

        if (textItems.length === 0) {
            alert("No text found in selection. Please select a text frame or highlight some text.");
            return;
        }

        // Process each text item
        for (var j = 0; j < textItems.length; j++) {
            var textItem = textItems[j];
            translateText(textItem.text, textItem.parent, doc);
        }

        alert("Translation completed!");
        
    } catch (error) {
        alert("Error: " + error.message + "\nLine: " + error.line);
    }
}

// Function to translate text while preserving formatting
function translateText(textObj, textFrame, doc) {
    try {
        // Get the original text content
        var originalText = textObj.contents;
        
        if (!originalText || originalText.trim() === "") {
            return;
        }

        // Store formatting information
        var formattingInfo = [];
        var textLength = textObj.characters.length;
        
        // Collect formatting for each character
        for (var i = 0; i < textLength; i++) {
            var char = textObj.characters[i];
            formattingInfo.push({
                fillColor: char.fillColor.name,
                strokeColor: char.strokeColor.name,
                appliedFont: char.appliedFont.name,
                pointSize: char.pointSize,
                leading: char.leading,
                tracking: char.tracking,
                horizontalScale: char.horizontalScale,
                verticalScale: char.verticalScale,
                baselineShift: char.baselineShift,
                skew: char.skew,
                underline: char.underline,
                strikethrough: char.strikethrough,
                allCaps: char.allCaps,
                smallCaps: char.smallCaps,
                superscript: char.superscript,
                subscript: char.subscript,
                appliedParagraphStyle: char.appliedParagraphStyle ? char.appliedParagraphStyle.name : null,
                appliedCharacterStyle: char.appliedCharacterStyle ? char.appliedCharacterStyle.name : null
            });
        }

        // Call Gemini API for translation
        var translatedText = callGeminiAPI(originalText);
        
        if (!translatedText) {
            alert("Translation failed. Please check your API key and internet connection.");
            return;
        }

        // Replace text while preserving formatting
        app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
        
        // Store the selection
        var startIndex = textObj.startOffset;
        var endIndex = textObj.endOffset;
        
        // Replace the text
        textObj.contents = translatedText;
        
        // Apply formatting to the new text
        var newTextLength = textObj.characters.length;
        
        // Apply formatting proportionally
        for (var k = 0; k < newTextLength && k < formattingInfo.length; k++) {
            var newChar = textObj.characters[k];
            var format = formattingInfo[k];
            
            try {
                // Apply character formatting
                if (format.appliedFont) {
                    newChar.appliedFont = app.fonts.itemByName(format.appliedFont);
                }
                newChar.pointSize = format.pointSize;
                newChar.leading = format.leading;
                newChar.tracking = format.tracking;
                newChar.horizontalScale = format.horizontalScale;
                newChar.verticalScale = format.verticalScale;
                newChar.baselineShift = format.baselineShift;
                newChar.skew = format.skew;
                newChar.underline = format.underline;
                newChar.strikethrough = format.strikethrough;
                newChar.allCaps = format.allCaps;
                newChar.smallCaps = format.smallCaps;
                newChar.superscript = format.superscript;
                newChar.subscript = format.subscript;
                
                // Apply colors
                try {
                    newChar.fillColor = doc.swatches.itemByName(format.fillColor);
                } catch (e) {
                    // Color might not exist, skip
                }
                
                try {
                    newChar.strokeColor = doc.swatches.itemByName(format.strokeColor);
                } catch (e) {
                    // Color might not exist, skip
                }
                
                // Apply paragraph style
                if (format.appliedParagraphStyle) {
                    try {
                        newChar.appliedParagraphStyle = doc.paragraphStyles.itemByName(format.appliedParagraphStyle);
                    } catch (e) {
                        // Style might not exist, skip
                    }
                }
                
                // Apply character style
                if (format.appliedCharacterStyle) {
                    try {
                        newChar.appliedCharacterStyle = doc.characterStyles.itemByName(format.appliedCharacterStyle);
                    } catch (e) {
                        // Style might not exist, skip
                    }
                }
            } catch (e) {
                // Continue if formatting fails for a character
            }
        }
        
        // If translated text is longer, apply last format to remaining characters
        if (newTextLength > formattingInfo.length && formattingInfo.length > 0) {
            var lastFormat = formattingInfo[formattingInfo.length - 1];
            for (var m = formattingInfo.length; m < newTextLength; m++) {
                var remainingChar = textObj.characters[m];
                try {
                    if (lastFormat.appliedFont) {
                        remainingChar.appliedFont = app.fonts.itemByName(lastFormat.appliedFont);
                    }
                    remainingChar.pointSize = lastFormat.pointSize;
                    remainingChar.leading = lastFormat.leading;
                    remainingChar.tracking = lastFormat.tracking;
                    remainingChar.fillColor = doc.swatches.itemByName(lastFormat.fillColor);
                } catch (e) {
                    // Continue if formatting fails
                }
            }
        }
        
        app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
        
    } catch (error) {
        app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
        throw error;
    }
}

// Run the main function
main();

