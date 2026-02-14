# backend/app/gradcam.py

import tensorflow as tf
import numpy as np
import cv2
from PIL import Image
import io
from tensorflow.keras.applications.efficientnet import preprocess_input as eff_preprocess

def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    """Generates the raw heatmap with proper gradient computation."""
    
    # Build model that outputs both the conv layer and predictions
    grad_model = tf.keras.models.Model(
        inputs=model.inputs,
        outputs=[model.get_layer(last_conv_layer_name).output, model.output]
    )
    
    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        
        # Use the predicted class if no index provided
        if pred_index is None:
            pred_index = tf.argmax(predictions[0])
        
        # Get the output for the specific class
        class_output = predictions[:, pred_index]
    
    # Get gradients of the class output with respect to the conv outputs
    grads = tape.gradient(class_output, conv_outputs)
    
    # Pool gradients spatially (global average pooling)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    
    # Weight the conv outputs by the gradients
    conv_outputs = conv_outputs[0]  # Remove batch dimension
    heatmap = tf.reduce_sum(pooled_grads * conv_outputs, axis=-1)
    
    # Normalize heatmap between 0 and 1
    heatmap = tf.maximum(heatmap, 0)
    heatmap_max = tf.reduce_max(heatmap)
    
    if heatmap_max > 0:
        heatmap = heatmap / heatmap_max
    else:
        heatmap = heatmap  # All zeros
    
    return heatmap.numpy()

def apply_colormap_to_heatmap(heatmap, colormap=cv2.COLORMAP_JET):
    """Apply colormap to heatmap with better contrast."""
    # Normalize heatmap to 0-255 range
    heatmap_normalized = np.uint8(255 * heatmap)
    
    # Apply colormap
    colored_heatmap = cv2.applyColorMap(heatmap_normalized, colormap)
    
    return colored_heatmap

def create_gradcam_visualization(
    original_image_bytes,
    preprocessed_img_array,
    base_model,
    last_conv_layer_name,
    alpha=0.4,
    resize_to_original=True
):
    """
    Creates a proper Grad-CAM visualization.
    
    Args:
        original_image_bytes: Original image as bytes
        preprocessed_img_array: Preprocessed image array for model input
        base_model: The model to use for Grad-CAM
        last_conv_layer_name: Name of the last convolutional layer
        alpha: Transparency of heatmap overlay (0-1)
        resize_to_original: Whether to resize heatmap to original image size
    
    Returns:
        overlay_img: RGB image with heatmap overlay
        heatmap_only: Just the heatmap as RGB image
    """
    
    try:
        print(f"[INFO] Generating Grad-CAM with layer: {last_conv_layer_name}")
        
        # 1. Generate heatmap
        heatmap = make_gradcam_heatmap(
            preprocessed_img_array,
            base_model,
            last_conv_layer_name
        )
        
        print(f"[INFO] Raw heatmap shape: {heatmap.shape}, min: {heatmap.min():.3f}, max: {heatmap.max():.3f}")
        
        # 2. Load and prepare original image
        original_pil = Image.open(io.BytesIO(original_image_bytes)).convert("RGB")
        original_img = np.array(original_pil)
        
        print(f"[INFO] Original image shape: {original_img.shape}")
        
        # 3. Resize heatmap to match original image if requested
        if resize_to_original:
            heatmap = cv2.resize(heatmap, (original_img.shape[1], original_img.shape[0]))
        
        # 4. Apply Gaussian blur for smoother heatmap
        heatmap = cv2.GaussianBlur(heatmap, (11, 11), sigmaX=0, sigmaY=0)
        
        # 5. Enhance contrast (optional but often helpful)
        heatmap = np.clip((heatmap - heatmap.min()) / (heatmap.max() - heatmap.min() + 1e-8), 0, 1)
        
        # 6. Apply colormap - using JET for standard Grad-CAM look
        # JET colormap: blue (cold/low) -> cyan -> green -> yellow -> red (hot/high)
        heatmap_colored = apply_colormap_to_heatmap(heatmap, cv2.COLORMAP_JET)
        
        # 7. Convert from BGR to RGB
        heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
        
        # 8. Create overlay
        # Resize heatmap_colored if it doesn't match original image
        if heatmap_colored.shape[:2] != original_img.shape[:2]:
            heatmap_colored = cv2.resize(heatmap_colored, 
                                        (original_img.shape[1], original_img.shape[0]))
        
        # Create overlay
        overlay = cv2.addWeighted(
            original_img.astype(np.float32),
            1 - alpha,
            heatmap_colored.astype(np.float32),
            alpha,
            0
        ).astype(np.uint8)
        
        # 9. Optional: Apply circular mask for eye images
        apply_circular_mask = True
        if apply_circular_mask:
            h, w = overlay.shape[:2]
            center = (w // 2, h // 2)
            radius = min(h, w) // 2 - 5
            
            # Create circular mask
            mask = np.zeros((h, w), dtype=np.uint8)
            cv2.circle(mask, center, radius, 255, -1)
            
            # Apply mask to overlay
            for i in range(3):
                overlay[:, :, i] = cv2.bitwise_and(overlay[:, :, i], mask)
            
            # Apply mask to original to maintain consistency
            for i in range(3):
                original_img[:, :, i] = cv2.bitwise_and(original_img[:, :, i], mask)
        
        print(f"[INFO] Overlay shape: {overlay.shape}")
        
        return overlay, heatmap_colored
        
    except Exception as e:
        print(f"[ERROR] Failed to create Grad-CAM visualization: {str(e)}")
        import traceback
        traceback.print_exc()
        raise

def generate_gradcam_overlay(
    original_image_bytes,
    preprocessed_img_array,
    base_model,
    last_conv_layer_name,
    alpha=0.4
):
    """
    Simplified wrapper for compatibility.
    Returns just the overlay image.
    """
    overlay, _ = create_gradcam_visualization(
        original_image_bytes=original_image_bytes,
        preprocessed_img_array=preprocessed_img_array,
        base_model=base_model,
        last_conv_layer_name=last_conv_layer_name,
        alpha=alpha,
        resize_to_original=True
    )
    
    return overlay