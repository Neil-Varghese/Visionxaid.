from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib.units import inch
from reportlab.lib import colors
from io import BytesIO
from datetime import datetime
import base64
from PIL import Image

def get_condition_details(pred_label: str):
    # (Kept your logic, but ensured clean mapping)
    conditions = {
        "AMD": {
            "full_name": "Age-Related Macular Degeneration",
            "severity": "Moderate Risk",
            "description": "A progressive eye condition affecting the macula, leading to central vision loss.",
            "recommendations": [
                "Schedule comprehensive retinal examination within 2 weeks",
                "Consider AREDS2 vitamin supplementation after consultation",
                "Increase dietary intake of leafy greens and omega-3 fatty acids",
                "Monitor vision daily with Amsler grid for distortion",
                "Protect eyes from UV exposure with quality sunglasses",
                "Regular follow-up every 3-6 months recommended"
            ],
        },
        "DR": {
            "full_name": "Diabetic Retinopathy",
            "severity": "Requires Attention",
            "description": "Diabetes-related damage to retinal blood vessels that can lead to vision impairment.",
            "recommendations": [
                "Urgent ophthalmology referral for comprehensive diabetic eye exam",
                "Optimize glycemic control (target HbA1c <7.0%)",
                "Monitor and control blood pressure (<130/80 mmHg)",
                "Annual dilated fundus examination mandatory",
                "Consider OCT imaging to assess macular edema",
                "Immediate medical attention if sudden vision changes occur"
            ],
        },
        "Glaucoma": {
            "full_name": "Glaucoma",
            "severity": "High Priority",
            "description": "Progressive optic nerve damage often associated with elevated intraocular pressure.",
            "recommendations": [
                "Immediate ophthalmology consultation for IOP measurement",
                "Visual field testing and OCT imaging of optic nerve",
                "Initiate or optimize topical IOP-lowering therapy as prescribed",
                "Regular IOP monitoring every 3-4 months",
                "Assess for medication compliance and side effects",
                "Lifetime monitoring required to prevent irreversible vision loss"
            ],
        },
        "Normal": {
            "full_name": "Normal Retina",
            "severity": "No Abnormalities Detected",
            "description": "Retinal imaging shows no signs of pathological changes.",
            "recommendations": [
                "Continue routine comprehensive eye examinations every 1-2 years",
                "Maintain healthy lifestyle with balanced diet rich in antioxidants",
                "Protect eyes from UV radiation with certified sunglasses",
                "Monitor for any sudden changes in vision quality",
                "If diabetic or >60 years old, annual screening recommended",
                "Report any new symptoms promptly to eye care professional"
            ],
        }
    }
    return conditions.get(pred_label, conditions["Normal"])

def draw_text_block(c, text, x, y, max_width, font_name="Helvetica", font_size=9, leading=12):
    """Wraps text and returns the next safe Y position."""
    words = text.split()
    line = []
    current_y = y
    
    for word in words:
        test_line = ' '.join(line + [word])
        if c.stringWidth(test_line, font_name, font_size) < max_width:
            line.append(word)
        else:
            c.drawString(x, current_y, ' '.join(line))
            current_y -= leading
            line = [word]
    if line:
        c.drawString(x, current_y, ' '.join(line))
        current_y -= leading
    return current_y

def generate_pdf_report(original_image_bytes, heatmap_img, filename, prediction, confidence):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    margin = 0.75 * inch
    content_width = width - (2 * margin)
    
    condition_info = get_condition_details(prediction)
    
    # --- Header ---
    c.setFillColor(colors.HexColor("#1A237E"))
    c.rect(0, height - 1.0*inch, width, 1.0*inch, fill=True, stroke=False)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(margin, height - 0.45*inch, "VisionXaid")
    c.setFont("Helvetica", 10)
    c.drawString(margin, height - 0.65*inch, "AI-Powered Retinal Analysis Report")
    
    # Meta
    c.setFont("Helvetica", 8)
    c.drawRightString(width - margin, height - 0.45*inch, f"ID: VXR-{datetime.now().strftime('%Y%m%d')}")
    c.drawRightString(width - margin, height - 0.65*inch, datetime.now().strftime('%B %d, %Y'))

    # --- Analysis Summary Section ---
    c.setFillColor(colors.black)
    y_pos = height - 1.35 * inch
    c.setFont("Helvetica-Bold", 13)
    c.drawString(margin, y_pos, "Analysis Summary")
    
    y_pos -= 30
    box_width = (content_width - 20) / 2
    box_height = 75
    
    # File Info Box
    c.setLineWidth(0.5)
    c.rect(margin, y_pos - box_height, box_width, box_height)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(margin + 10, y_pos - 20, "File Data")
    c.setFont("Helvetica", 9)
    c.drawString(margin + 10, y_pos - 35, f"Name: {filename[:25]}")
    c.drawString(margin + 10, y_pos - 48, f"Time: {datetime.now().strftime('%I:%M %p')}")

    # Diagnosis Box
    c.rect(margin + box_width + 20, y_pos - box_height, box_width, box_height)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(margin + box_width + 30, y_pos - 20, "Findings")
    c.setFont("Helvetica", 9)
    c.drawString(margin + box_width + 30, y_pos - 35, f"Label: {condition_info['full_name']}")
    c.drawString(margin + box_width + 30, y_pos - 48, f"Conf: {confidence*100:.1f}%")
    
    # --- Clinical Overview (Dynamic height) ---
    y_pos -= (box_height + 30)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin, y_pos, "Clinical Overview")
    y_pos -= 15
    c.setFont("Helvetica", 9)
    y_pos = draw_text_block(c, condition_info['description'], margin, y_pos, content_width)

    # --- Retinal Imaging Analysis (Fixed height section) ---
    y_pos -= 20
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin, y_pos, "Imaging Analysis")
    y_pos -= 20
    
    img_size = 2.1 * inch
    img_y = y_pos - img_size
    
    # Helper to process and draw images safely
    def place_img(data, x, y, is_b64=False):
        try:
            if data is None:
                c.drawString(x + 10, y + 50, "Image not available")
                return
            if is_b64:
                if data.startswith('data:image'): data = data.split(',')[1]
                data = base64.b64decode(data)
            p_img = Image.open(BytesIO(data)).convert("RGB")
            p_img.thumbnail((400, 400))
            tmp = BytesIO()
            p_img.save(tmp, format="JPEG")
            tmp.seek(0)
            c.drawImage(ImageReader(tmp), x, y, width=img_size, height=img_size, preserveAspectRatio=True)
            c.rect(x, y, img_size, img_size) # Frame
        except:
            c.drawString(x + 10, y + 50, "Image Data Error")

    place_img(original_image_bytes, margin, img_y)
    place_img(heatmap_img, width - margin - img_size, img_y, is_b64=True)
    
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(margin + img_size/2, y_pos + 5, "ORIGINAL FUNDUS")
    c.drawCentredString(width - margin - img_size/2, y_pos + 5, "AI ACTIVATION MAP")

    # --- Clinical Recommendations (Dynamic bullets) ---
    y_pos = img_y - 35
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin, y_pos, "Clinical Recommendations")
    y_pos -= 18
    
    for i, rec in enumerate(condition_info['recommendations'], 1):
        c.setFont("Helvetica-Bold", 9)
        c.drawString(margin, y_pos, f"{i}.")
        # Capture the next Y position from the wrapped bullet text
        y_pos = draw_text_block(c, rec, margin + 15, y_pos, content_width - 20)
        y_pos -= 4 # Spacing between bullets

    # --- Footer (Static position) ---
    footer_y = 1.0 * inch
    c.setLineWidth(0.5)
    c.line(margin, footer_y, width - margin, footer_y)
    c.setFont("Helvetica", 7)
    c.drawCentredString(width/2, footer_y - 15, "VisionXaid screening tool is for informational purposes and does not constitute clinical diagnosis.")
    
    c.save()
    buffer.seek(0)
    return buffer.read()