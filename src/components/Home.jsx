/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-useless-escape */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import ReactCanvasDraw from 'react-canvas-draw';
//import { GoogleGenerativeAI } from "@google/generative-ai";
//import { apikey } from './data';
import * as math from 'mathjs';
import AIImage1 from '../images/AIProjectImage1.png'
import AIChatImg from '../images/chat-bot.gif'
import { SketchPicker } from 'react-color';

const Home = () => {
  const canvasRef = useRef(null);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');  // Default brush color
  const [brushRadius, setBrushRadius] = useState(3);  // Default brush size

  // Function to get image data from the canvas
  const getImageData = () => {
    const canvas = canvasRef.current.canvas.drawing;
    return canvas.toDataURL();
  };

  // Preprocessing image data (for example, resizing)
  const preprocessImage = (imageData) => {
    // This function can be enhanced to resize or optimize the image data
    return imageData;
  };

  // Function to analyze drawing using Google Generative AI
  /*const analyzeDrawing = async () => {
    const imageData = getImageData();
    const processedImage = preprocessImage(imageData);
  
    setLoading(true);
    try {
      const apiKey = apikey;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = "Describe the provided images.";
  
      const imageParts = [
        { inlineData: { data: processedImage.split(',')[1], mimeType: 'image/jpeg' } }
      ];
  
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();
  
      // Log the entire AI-generated response to the console
      console.log('Full AI Response:', text);
  
      // Regex to detect objects or entities (you can improve this depending on your AI response structure)
      // This example looks for common objects mentioned in the text using a general word-matching pattern
      const objectRegex = /\b(apple|tree|cat|car|house|dog|flower|ball)\b/gi;
      const detectedObjects = text.match(objectRegex);
  
      if (detectedObjects && detectedObjects.length > 0) {
        console.log('Detected Objects:', detectedObjects.join(', '));  // Log all detected objects
      } else {
        console.log('No specific objects detected.');
      }
  
      // Highlight the detected objects in the response
      let highlightedText = text;
      if (detectedObjects) {
        detectedObjects.forEach(obj => {
          const regex = new RegExp(`\\b${obj}\\b`, 'gi');
          highlightedText = highlightedText.replace(regex, `<span style="color: red; font-weight: bold;">${obj}</span>`);
        });
      }
  
      // Regex to find algebraic expressions (if necessary)
      const expressionRegex = /([a-zA-Z]\w*|[-+]?\d*\.?\d+)\s*([\+\-\*\/])\s*([a-zA-Z]\w*|[-+]?\d*\.?\d+)/g;
      const matches = text.match(expressionRegex);
  
      let evaluatedResult = text;
      if (matches) {
        for (const match of matches) {
          try {
            // Safely evaluate expressions using math.js
            const result = math.evaluate(match);
            evaluatedResult = evaluatedResult.replace(match, result);
          } catch (e) {
            console.error('Error evaluating expression:', e);
          }
        }
      }
  
      // Overwrite aiResponse with the latest result, including highlighted objects
      const updatedResponse = `AI Generated Response: ${highlightedText}\n\nProcessed Expressions: ${evaluatedResult}`;
      setAiResponse(updatedResponse);
  
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAiResponse('Error analyzing input');
    } finally {
      setLoading(false);
    }
  };*/
  
  //Function to analyze Drawing using OpenRouter
  const analyzeDrawing = async () => {
  const imageData = getImageData();

  setLoading(true);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Describe the objects in this drawing clearly."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter Error:", data);
      throw new Error("API Error");
    }

    const text = data.choices?.[0]?.message?.content || "No response";

    setAiResponse(text);

  } catch (error) {
    console.error("Error analyzing image:", error);
    setAiResponse("Error analyzing input");
  } finally {
    setLoading(false);
  }
};

  // Function to change brush color
  const changeBrushColor = (color) => {
    setBrushColor(color);
    setBrushRadius(4);
  };

  // Function to enable eraser
  const enableEraser = () => {
    setBrushColor('black');
    setBrushRadius(10);
  };

  // Function to clear canvas
  const clearCanvas = () => {
    canvasRef.current.clear();
    setAiResponse('');  // Reset AI response when clearing the canvas
  };

  // Function to undo last stroke
  const undoLastStroke = () => {
    canvasRef.current.undo();
  };

  // Function to redo last undone stroke (note: ReactCanvasDraw doesn't have a direct redo method)
  const redoLastStroke = () => {
    // To redo, save the state before each undo and reapply it
    console.log("Redo is not available in ReactCanvasDraw. Implement custom logic if needed.");
  };
  const handleColorChange = (color) => {
    setBrushColor(color.hex);
  };

  return (
    <div style={{ backgroundColor: '#5c5470', padding: '15px' }}>
     <h1 
  style={{
    textAlign: 'center', 
    fontSize: '40px', 
    fontFamily: 'cursive', 
    color: '#ff487e', 
    //backgroundColor: '#3a9679', 
    background:'url(https://img.freepik.com/premium-photo/graphic-illustration-dynamic-paint-texture-vivid-tone-colors-modern-digital-art-background-tre_108146-1690.jpg)',
    textShadow: `
      1px 1px 0 #000, 
      2px 2px 0 #000, 
      3px 3px 0 #000, 
      4px 4px 0 #000, 
      5px 5px 0 #000
    `,
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px', 
    borderRadius: '15px'
  }} 
  className='p-2 mb-4'
>
  Make a quick sketch
</h1>


      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ReactCanvasDraw 
          style={{ backgroundColor: 'black', border: '20px solid white', borderRadius: '25px' }}
          ref={canvasRef} 
          canvasWidth={1000} 
          canvasHeight={500} 
          brushColor={brushColor} 
          brushRadius={brushRadius} 
        />
        
      </div>

      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <h3 style={{ textAlign: 'center', fontSize: '29px', fontFamily: 'cursive', color: `${brushColor}` }}>Select a color</h3>
        {/*<div style={{ 
          backgroundColor: '#5c5470', 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '10px' 
        }}>
          {[
            { color: 'white', backgroundColor: 'white' },
            { color: '#FF0000', backgroundColor: '#FF0000' },
            { color: '#00FF00', backgroundColor: '#00FF00' },
            { color: '#0000FF', backgroundColor: '#0000FF' },
            { color: '#FFFF00', backgroundColor: '#FFFF00' },
            { color: '#FFA500', backgroundColor: '#FFA500' },
            { color: '#800080', backgroundColor: '#800080' },
            { color: '#FF69B4', backgroundColor: '#FF69B4' },
            { color: '#00CED1', backgroundColor: '#00CED1' },
            { color: '#808080', backgroundColor: '#808080' },
          ].map(({ color, backgroundColor }) => (
            <button 
              key={color}
              style={{ 
                backgroundColor, 
                color: color === 'white' ? 'black' : 'white',
                borderRadius: '50%', 
                width: '40px', 
                height: '40px', 
                margin: '5px', 
                cursor: 'pointer', 
                border: 'none',
                maxWidth: '50px',
                boxShadow:'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px'
              }} 
              onClick={() => changeBrushColor(color)}
            ></button>
          ))}
        </div>*/}
         <SketchPicker 
          color={brushColor} 
          onChange={handleColorChange} 
          width="300px"  // Increase width
          styles={{
            default: {
              picker: {
                width: '260px', // Control picker width
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                borderRadius: '12px', // Rounder corners
                padding: '10px',
                backgroundColor: `#d9f2ff`, // White background
              },
            }
          }}
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <button onClick={enableEraser} style={{ padding: '7px', backgroundColor: '#402a23', borderRadius: '5px', border: 'none', color: 'white', cursor: 'pointer', margin: '10px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-eraser-fill mx-1" viewBox="0 0 16 16">
            <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293z"/>
          </svg>Eraser
        </button>
        <button onClick={clearCanvas} style={{ padding: '7px', backgroundColor: '#53a8b6', borderRadius: '5px', border: 'none', color: 'white', cursor: 'pointer', margin: '10px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 16 16" className='bi bi-trash mx-1'>
            <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5v-7z"/>
            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H5a1 1 0 0 1 .707.293L6.414 2h3.172l.707-.707A1 1 0 0 1 11 1h3.5a1 1 0 0 1 1 1v1zM1.5 4a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 .5.5v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V4z"/>
          </svg>Clear
        </button>
        <button onClick={undoLastStroke} style={{ padding: '7px', backgroundColor: '#ffcccb', borderRadius: '5px', border: 'none', color: 'black', cursor: 'pointer', margin: '10px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
  <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
</svg> Undo
        </button>
        {/*<button onClick={redoLastStroke} style={{ padding: '7px', backgroundColor: '#add8e6', borderRadius: '5px', border: 'none', color: 'black', cursor: 'pointer', margin: '10px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25 " fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
</svg> Redo
        </button>*/}
        <button onClick={analyzeDrawing} style={{ padding: '10px', backgroundColor: '#c3195d', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-cpu-fill mx-2" viewBox="0 0 16 16">
  <path d="M6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z"/>
  <path d="M5.5.5a.5.5 0 0 0-1 0V2A2.5 2.5 0 0 0 2 4.5H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2A2.5 2.5 0 0 0 4.5 14v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14a2.5 2.5 0 0 0 2.5-2.5h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14A2.5 2.5 0 0 0 11.5 2V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1zm1 4.5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3A1.5 1.5 0 0 1 6.5 5"/>
</svg>  {loading ? 'Analyzing...' : 'Analyze Drawing'}
        </button>
      </div>

      {aiResponse && (
  <div 
    style={{ 
      padding: '10px', 
      backgroundColor: '#2b2d42', 
      borderRadius: '10px', 
      color: 'white', 
      marginTop: '20px', 
      maxHeight: '300px', // Adjust based on your needs
      overflowY: 'scroll', 
      scrollbarWidth: 'none', /* Firefox */
    }}
    className="hide-scrollbar"
  >
    <h3 style={{fontFamily:'cursive'}}> AI Response</h3>
    <div className='p-2 d-flex align-items-center justify-content-center'>
  <img src='https://cdn-icons-png.flaticon.com/512/9732/9732800.png' style={{ width: '70px', height: '70px', borderRadius: '50%' }} alt="AI Chat Icon" className="mt-5" />
  <div className='p-3' style={{ position: 'relative' }}>
    {/* Use dangerouslySetInnerHTML to render highlighted HTML */}
    <p className='p-3 comic-bubble' style={{boxShadow:'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',}} dangerouslySetInnerHTML={{ __html: aiResponse }}></p>
  </div>
</div>



  </div>
)}

     {/* <div style={{ marginTop: '30px', backgroundColor: '#3b4d61', padding: '30px', borderRadius: '8px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '35px', color: '#f8da5b' }}>A New Way to Understand Your Art</h2>
        <p style={{ textAlign: 'center', color: 'white', fontSize: '18px' }}>
          This app helps you visualize your artistic expressions through the lens of AI, powered by Google's Gemini AI technology.
        </p>
        <img src={AIImage1} alt="AI Art" style={{ width: '100%', borderRadius: '8px', marginTop: '20px' }} />
      </div>*/}
    </div>
  );
};

export default Home;
