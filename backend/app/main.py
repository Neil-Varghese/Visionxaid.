# backend/app/main.py

from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import base64
import numpy as np
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input
from PIL import Image
from io import BytesIO

# Import from app module
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Now import your modules
from app.inference import load_model, predict_image
from app.gradcam import generate_gradcam_overlay


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for FastAPI app."""
    print("[INFO] Starting application lifespan...")
    
    # Try multiple possible model locations
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    possible_paths = [
        os.path.join(base_dir, "models", "v50.keras"),
        os.path.join(base_dir, "backend", "models", "v50.keras"),
        os.path.join(os.path.dirname(__file__), "models", "v50.keras"),
        "models/v50.keras",
        "../models/v50.keras",
        "./models/v50.keras"
    ]
    
    found_path = None
    for path in possible_paths:
        if os.path.exists(path):
            found_path = path
            print(f"[INFO] Found model at: {path}")
            break
    
    if found_path is None:
        print("[ERROR] Model file not found in any location!")
        print("[ERROR] Checked paths:")
        for path in possible_paths:
            exists = os.path.exists(path)
            print(f"  - {path} {'[EXISTS]' if exists else '[NOT FOUND]'}")
        
        # Create models directory if it doesn't exist
        models_dir = os.path.join(base_dir, "models")
        os.makedirs(models_dir, exist_ok=True)
        print(f"[INFO] Created models directory: {models_dir}")
        print(f"[INFO] Please place 'v50.keras' file in: {models_dir}")
        
        # For testing, you can continue without model
        print("[WARNING] Starting without model - prediction endpoints will fail")
        app.state.model = None
        app.state.base_model = None
        app.state.last_conv_layer_name = None
        app.state.model_path = None
        yield
        return
    
    try:
        # Load the ML model (using the updated function that returns 3 values)
        print(f"[INFO] Loading model from: {found_path}")
        model, base_model, last_conv_layer_name = load_model(found_path)
        print("[INFO] Model loaded successfully")
        
        # Store models in app state
        app.state.model = model
        app.state.base_model = base_model
        app.state.last_conv_layer_name = last_conv_layer_name
        app.state.model_path = found_path
        
        print(f"[INFO] Models stored in app state")
        print(f"[INFO] Base model: {base_model.name if base_model else 'None'}")
        print(f"[INFO] Last conv layer: {last_conv_layer_name}")
        
    except Exception as e:
        print(f"[ERROR] Failed to initialize models: {str(e)}")
        import traceback
        traceback.print_exc()
        app.state.model = None
        app.state.base_model = None
        app.state.last_conv_layer_name = None
        app.state.model_path = None
    
    yield
    
    # Cleanup
    app.state.model = None
    app.state.base_model = None
    app.state.last_conv_layer_name = None
    app.state.model_path = None
    print("[INFO] Application shutdown complete")


app = FastAPI(title="VisionXaid Backend", lifespan=lifespan)

# ----------------------------
# CORS
# ----------------------------

# Get allowed origins from environment variable or use default
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

# Feature flags
def env_flag(name: str, default: str = "true") -> bool:
    return os.getenv(name, default).strip().lower() in {"1", "true", "yes", "on"}

ENABLE_GRADCAM = env_flag("ENABLE_GRADCAM", "true")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Helpers
# ----------------------------

def image_to_base64(img: np.ndarray) -> str:
    """Convert numpy image array to base64 string."""
    import cv2
    
    # Ensure image is in correct format
    if img.dtype != np.uint8:
        img = (img * 255).astype(np.uint8)
    
    # Convert BGR to RGB if needed (OpenCV images are BGR)
    if len(img.shape) == 3 and img.shape[2] == 3:
        # Grad-CAM returns BGR images, convert to RGB for web display
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    else:
        img_rgb = img
    
    # Encode to JPEG
    success, buffer = cv2.imencode('.jpg', img_rgb)
    if not success:
        raise ValueError("Failed to encode image to JPEG")
    
    return base64.b64encode(buffer).decode('utf-8')

# ----------------------------
# Routes
# ----------------------------

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "VisionXaid Backend API",
        "status": "running",
        "endpoints": {
            "/": "This info page",
            "/health": "Health check",
            "/predict": "POST - Make prediction on image",
            "/report": "POST - Generate PDF report"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    model_loaded = hasattr(app.state, 'model') and app.state.model is not None
    
    return {
        "status": "healthy" if model_loaded else "degraded",
        "message": "VisionXaid backend is running",
        "model_loaded": model_loaded,
        "model_path": app.state.model_path if hasattr(app.state, 'model_path') else None,
        "last_conv_layer": app.state.last_conv_layer_name if hasattr(app.state, 'last_conv_layer_name') else None,
        "gradcam_enabled": ENABLE_GRADCAM
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Make prediction on an uploaded image."""
    try:
        print(f"[INFO] Received prediction request for file: {file.filename}")
        
        # Check if model is loaded
        if not hasattr(app.state, 'model') or app.state.model is None:
            return JSONResponse(
                status_code=503,
                content={
                    "success": False,
                    "error": "Model not loaded",
                    "message": "Server is still initializing or model failed to load"
                }
            )
        
        # Check if we have Grad-CAM components
        if app.state.last_conv_layer_name is None:
            print("[WARNING] No conv layer found for Grad-CAM")
        
        # Read image bytes
        image_bytes = await file.read()
        print(f"[INFO] Image size: {len(image_bytes)} bytes")
        
        # 1. Make prediction
        print("[INFO] Making prediction...")
        result = predict_image(image_bytes, model=app.state.model)
        print(f"[INFO] Prediction: {result['prediction']} ({result['top_confidence']:.2%})")
        
        # 2. Preprocess image for Grad-CAM
        img = Image.open(BytesIO(image_bytes)).convert("RGB").resize((224, 224))
        arr = np.array(img).astype(np.float32)
        arr = preprocess_input(arr)
        arr = np.expand_dims(arr, axis=0)
        
        # 3. Generate Grad-CAM overlay if we have the components
        heatmap_b64 = None
        if (ENABLE_GRADCAM and app.state.base_model is not None and 
            app.state.last_conv_layer_name is not None):
            
            print("[INFO] Generating Grad-CAM overlay...")
            heatmap_img = generate_gradcam_overlay(
                original_image_bytes=image_bytes,
                preprocessed_img_array=arr,
                base_model=app.state.base_model,
                last_conv_layer_name=app.state.last_conv_layer_name,
            )
            
            # Convert heatmap to base64
            heatmap_b64 = image_to_base64(heatmap_img)
            print("[INFO] Heatmap generated successfully")
        else:
            print("[WARNING] Skipping Grad-CAM - disabled or missing model components")
        
        return JSONResponse({
            "success": True,
            "prediction": result["prediction"],
            "top_confidence": float(result["top_confidence"]),
            "probs": result["probs"],
            "heatmap": heatmap_b64,
            "filename": file.filename
        })
        
    except Exception as e:
        print(f"[ERROR] Prediction failed: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e),
                "message": "Failed to process image"
            }
        )

@app.post("/report")
async def generate_report(payload: dict):
    """Generate PDF report from prediction results."""
    try:
        print("[INFO] Generating PDF report...")
        
        # Decode base64 images
        img_b64 = payload["original_image"]

        # remove data:image/... prefix if present
        if "," in img_b64:
            img_b64 = img_b64.split(",")[1]

        # fix missing padding
        img_b64 += "=" * (-len(img_b64) % 4)

        original_image_bytes = base64.b64decode(img_b64)
        heatmap_b64 = payload["heatmap"]
        
        # Generate PDF
        from app.pdf_report import generate_pdf_report
        pdf_bytes = generate_pdf_report(
            original_image_bytes=original_image_bytes,
            heatmap_img=heatmap_b64,
            filename=payload.get("filename", "unknown.jpg"),
            prediction=payload["prediction"],
            confidence=payload["top_confidence"],
        )
        
        print("[INFO] PDF report generated successfully")
        
        return StreamingResponse(
            iter([pdf_bytes]),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=VisionXaid_Report_{payload.get('filename', 'report')}.pdf"
            },
        )
    except Exception as e:
        print(f"[ERROR] Report generation failed: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e),
                "message": "Failed to generate report"
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)