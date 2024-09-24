/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import React, { useRef, useState } from 'react';
import ReactCanvasDraw from 'react-canvas-draw';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { apikey } from './data';

const Home = () => {
  const canvasRef = useRef(null);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');  // Default brush color
  const [brushRadius, setBrushRadius] = useState(3);  // Default brush size

  const getImageData = () => {
    const canvas = canvasRef.current.canvas.drawing;
    return canvas.toDataURL();
  };

  const preprocessImage = (imageData) => {
    return imageData;
  };

  const analyzeDrawing = async () => {
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
  
      //console.log("API Result:", text);
  
      // Update regex to match algebraic expressions
      const regex = /([a-zA-Z]\w*|[-+]?\d*\.?\d+)\s*([\+\-\*\/])\s*([a-zA-Z]\w*|[-+]?\d*\.?\d+)/g;
      const matches = text.match(regex);
  
      let evaluatedResult = text;
      if (matches) {
        for (const match of matches) {
          try {
            // If the match contains algebraic expressions, handle accordingly
            const result = eval(match); // Be cautious with eval; this is a simple example
            evaluatedResult = evaluatedResult.replace(match, result);
          } catch (e) {
            console.error('Error evaluating expression:', e);
          }
        }
      }
  
      setAiResponse(prev => `${prev}\nGenerated Insights: ${evaluatedResult}`);
  
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAiResponse('Error analyzing input');
    } finally {
      setLoading(false);
    }
  };
  

  const changeBrushColor = (color) => {
    setBrushColor(color);
    setBrushRadius(3);
  };

  const enableEraser = () => {
    setBrushColor('black');
    setBrushRadius(10);
  };

  const clearCanvas = () => {
    canvasRef.current.clear();
    setAiResponse('');  // Reset AI response when clearing the canvas
  };

  return (
    <div style={{backgroundColor:'#5c5470',padding:'15px'}}>
      <h1 style={{ textAlign: 'center', fontSize: '40px',fontFamily:'cursive',color:'#f48db4' }} className='p-2'>Draw or Write Below</h1>

      <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
      <ReactCanvasDraw 
        style={{backgroundColor: 'black',border:'20px solid white',borderRadius:'25px'}}
        ref={canvasRef} 
        canvasWidth={1000} 
        canvasHeight={500} 
        brushColor={brushColor} 
        brushRadius={brushRadius} 
      />
      </div>

      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <h3 style={{ textAlign: 'center', fontSize: '29px', fontFamily: 'cursive', color: 'white' }}>Select a color</h3>
        <div style={{ 
            backgroundColor: '#5c5470', 
            display: 'flex', 
            flexWrap: 'wrap',
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '10px' ,
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
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button onClick={enableEraser} style={{ padding: '7px', backgroundColor: '#402a23', borderRadius: '5px', border: 'none', color: 'white', cursor: 'pointer', margin: '10px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-eraser-fill mx-1" viewBox="0 0 16 16">
            <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293z"/>
          </svg>Eraser
        </button>
        <button onClick={clearCanvas} style={{ padding: '7px', backgroundColor: '#53a8b6', borderRadius: '5px', border: 'none', color: 'white', cursor: 'pointer', margin: '10px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 24 24" className='mx-1'>
            <path d="M3 6h18M9 6V4a2 2 0 0 1 4 0v2M6 6h12v2H6V6zm1 0v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6H7z"/>
          </svg>
          Clear Canvas
        </button>

        <button onClick={analyzeDrawing} style={{ padding: '7px', backgroundColor: '#c3195d', borderRadius: '5px', border: 'none', color: 'white', cursor: 'pointer', margin: '10px' }} disabled={loading}>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-cpu-fill mx-2" viewBox="0 0 16 16">
  <path d="M6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z"/>
  <path d="M5.5.5a.5.5 0 0 0-1 0V2A2.5 2.5 0 0 0 2 4.5H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2A2.5 2.5 0 0 0 4.5 14v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14a2.5 2.5 0 0 0 2.5-2.5h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14A2.5 2.5 0 0 0 11.5 2V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1zm1 4.5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3A1.5 1.5 0 0 1 6.5 5"/>
</svg>
          {loading ? 'Analyzing...' : 'Analyze Drawing'}
        </button>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        border: '1px solid white', 
        borderRadius: '5px', 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'white'
      }}>
        <h2 style={{fontFamily:'cursive',color:'#8ed2c9' }} >AI Response:</h2>
       {
        aiResponse?(
          <pre style={{ whiteSpace: 'pre-wrap' }}>{aiResponse}</pre>
        ):(
          <p style={{ color: 'white' }}>No AI response available.</p> 
        )
       }
      </div>
    </div>
  );
};

export default Home;
