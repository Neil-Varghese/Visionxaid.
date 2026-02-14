# backend/app/inference.py

import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input
from PIL import Image
from io import BytesIO

# Class names
CLASS_NAMES = ["AMD", "DR", "Glaucoma", "Normal"]
IMG_SIZE = (224, 224)

# Global model cache
_loaded_model = None
_base_model = None
_last_conv_layer_name = None

def load_model(model_path=None):
    """
    Loads the trained EfficientNet model and extracts base model info.
    Based on the working Streamlit version.
    """
    global _loaded_model, _base_model, _last_conv_layer_name
    
    if _loaded_model is not None:
        return _loaded_model, _base_model, _last_conv_layer_name
    
    # If no path provided, try to find it
    if model_path is None:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        possible_paths = [
            os.path.join(current_dir, "..", "models", "v50.keras"),
            os.path.join(current_dir, "models", "v50.keras"),
            "models/v50.keras",
            "../models/v50.keras",
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                model_path = path
                break
        
        if model_path is None:
            raise FileNotFoundError(
                "Model file 'v50.keras' not found. Please place it in the models/ directory."
            )
    
    print(f"[INFO] Loading model from: {model_path}")
    
    try:
        _loaded_model = tf.keras.models.load_model(model_path, compile=False)
        print(f"[INFO] Model loaded successfully")
        print(f"[INFO] Model input shape: {_loaded_model.input_shape}")
        
        # Try to get the EfficientNet base model
        try:
            _base_model = _loaded_model.get_layer('efficientnetb0')
            print(f"[INFO] Found base model: {_base_model.name}")
        except Exception as e:
            print(f"[WARNING] Could not find 'efficientnetb0' layer: {e}")
            _base_model = _loaded_model
        
        # Find last convolutional layer for Grad-CAM
        _last_conv_layer_name = None
        for layer in reversed(_base_model.layers):
            try:
                # Use layer.output.shape instead of layer.output_shape
                if len(layer.output.shape) == 4:
                    _last_conv_layer_name = layer.name
                    break
            except Exception:
                continue
        
        # Fallback if logic fails
        if _last_conv_layer_name is None:
            fallback_layers = ['top_conv', 'block7a_project_conv', 'block6e_project_conv']
            for ln in fallback_layers:
                try:
                    if _base_model.get_layer(ln):
                        _last_conv_layer_name = ln
                        break
                except Exception:
                    pass
        
        if _last_conv_layer_name is None:
            print("[WARNING] Failed to find a suitable last convolutional layer for Grad-CAM.")
        else:
            print(f"[INFO] Found conv layer for Grad-CAM: {_last_conv_layer_name}")
        
        return _loaded_model, _base_model, _last_conv_layer_name
        
    except Exception as e:
        print(f"[ERROR] Failed to load model: {str(e)}")
        raise

def predict_image(image_bytes: bytes, model=None):
    """
    Runs inference on a single image.
    Based on the working Streamlit version.
    """
    try:
        # Load image from bytes
        img = Image.open(BytesIO(image_bytes)).convert("RGB")
        img = img.resize(IMG_SIZE)
        
        # Preprocess
        arr = np.array(img).astype(np.float32)
        arr = preprocess_input(arr)
        arr = np.expand_dims(arr, axis=0)
        
        # Load model if not provided
        if model is None:
            model, _, _ = load_model()
        
        # Predict
        preds = model.predict(arr, verbose=0)
        preds = np.array(preds).squeeze()
        
        # Apply softmax if needed (handle logits)
        if not np.all((preds >= 0) & (preds <= 1)):
            probs_array = tf.nn.softmax(preds).numpy()
        else:
            probs_array = preds
        
        # Create probability dictionary
        probs_dict = {CLASS_NAMES[i]: float(probs_array[i]) for i in range(len(CLASS_NAMES))}
        
        # Find top prediction
        top_label = max(probs_dict, key=probs_dict.get)
        top_conf = probs_dict[top_label]
        
        return {
            "prediction": top_label,
            "top_confidence": float(top_conf),
            "probs": probs_dict,
        }
        
    except Exception as e:
        print(f"[ERROR] Prediction failed: {str(e)}")
        import traceback
        traceback.print_exc()
        raise