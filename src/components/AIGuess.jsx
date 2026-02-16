/* eslint-disable react/no-unescaped-entities */

import { useRef, useState } from "react";
import ReactCanvasDraw from "react-canvas-draw";
import { SketchPicker } from "react-color";

const Home = () => {
  const canvasRef = useRef(null);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [brushColor, setBrushColor] = useState("#ffffff");
  const [brushRadius, setBrushRadius] = useState(4);

  // Get base64 image from canvas
  const getImageData = () => {
    const canvas = canvasRef.current.canvas.drawing;
    return canvas.toDataURL("image/png");
  };

  // 🔥 SMART AI ANALYSIS FUNCTION
  const analyzeDrawing = async () => {
    const imageData = getImageData();
    setLoading(true);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "AI Sketch Interpreter",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            temperature: 0.7,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `
You are an intelligent visual interpretation assistant.

The user has drawn a rough sketch.

Your task:
1. Identify what real-world object, symbol, logo, religious mark, or cultural symbol this most closely represents.
2. Focus on symbolic meaning, not geometric description.
3. Give your best guess of what the user intended.
4. Provide a confidence level (Low, Medium, High).
5. Keep the answer concise.

Do NOT only describe lines or shapes.
`
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: imageData,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("OpenRouter Error:", data);
        throw new Error("API error");
      }

      const text =
        data?.choices?.[0]?.message?.content || "No response from AI";

      setAiResponse(text);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setAiResponse("Error analyzing input");
    } finally {
      setLoading(false);
    }
  };

  const enableEraser = () => {
    setBrushColor("#000000");
    setBrushRadius(15);
  };

  const clearCanvas = () => {
    canvasRef.current.clear();
    setAiResponse("");
  };

  const undoLastStroke = () => {
    canvasRef.current.undo();
  };

  const handleColorChange = (color) => {
    setBrushColor(color.hex);
    setBrushRadius(4);
  };

  return (
    <div
      style={{
        backgroundColor: "#5c5470",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "40px",
          fontFamily: "cursive",
          color: "#ff487e",
          textShadow: "2px 2px 6px black",
        }}
      >
        Make a quick sketch
      </h1>

      {/* Canvas */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ReactCanvasDraw
          ref={canvasRef}
          canvasWidth={900}
          canvasHeight={400}
          brushColor={brushColor}
          brushRadius={brushRadius}
          style={{
            backgroundColor: "black",
            border: "15px solid white",
            borderRadius: "25px",
          }}
        />
      </div>

      {/* Color Picker */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <SketchPicker color={brushColor} onChange={handleColorChange} />
      </div>

      {/* Buttons */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={enableEraser}
          style={{
            padding: "8px 15px",
            backgroundColor: "#402a23",
            color: "white",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Eraser
        </button>

        <button
          onClick={clearCanvas}
          style={{
            padding: "8px 15px",
            backgroundColor: "#53a8b6",
            color: "white",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Clear
        </button>

        <button
          onClick={undoLastStroke}
          style={{
            padding: "8px 15px",
            backgroundColor: "#ffcccb",
            color: "black",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Undo
        </button>

        <button
          onClick={analyzeDrawing}
          style={{
            padding: "10px 18px",
            backgroundColor: "#c3195d",
            color: "white",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Analyze Drawing"}
        </button>
      </div>

      {/* AI Response */}
      {aiResponse && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#2b2d42",
            borderRadius: "12px",
            color: "white",
            maxWidth: "900px",
            marginInline: "auto",
          }}
        >
          <h3 style={{ fontFamily: "cursive" }}>AI Response</h3>
          <p style={{ marginTop: "10px", lineHeight: "1.6" }}>
            {aiResponse}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
