# server.py
from flask import Flask, request, jsonify
import requests
from io import BytesIO
from PIL import Image
import saliency  # Your processing logic (e.g. saliency, cropping, etc.)
from flask_cors import CORS
import base64
import cv2;
import numpy as np;

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/run-script", methods=["POST"])
def run_script():
    try:
        print("Request received")

        data = request.get_json()

        print("JSON:", data)

        image_url = data.get("imageUrl")

        print("Image URL:", image_url)

        response = requests.get(image_url)

        print("Image fetch status:", response.status_code)

        image_bytes = response.content

        nparr = np.frombuffer(image_bytes, np.uint8)

        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        print("Image decoded:", img is not None)

        print("Running saliency...")

        output = saliency.processImage(img)

        print("Saliency complete")

        print("Output shape:", output.shape)

        if len(output.shape) == 3:
            output = cv2.cvtColor(output, cv2.COLOR_BGR2GRAY)

        _, thresh = cv2.threshold(
            output,
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )

        contours, _ = cv2.findContours(
            thresh,
            cv2.RETR_EXTERNAL,
            cv2.CHAIN_APPROX_SIMPLE
        )

        print("Contours found:", len(contours))

        contours = sorted(
            contours,
            key=cv2.contourArea,
            reverse=True
        )[:3]

        cropped_images = []

        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)

            crop = img[y:y+h, x:x+w]

            success, buffer = cv2.imencode(".png", crop)

            encoded_crop = base64.b64encode(buffer).decode("utf-8")

            cropped_images.append(encoded_crop)

        print("Returning images")

        return jsonify({"result": cropped_images})

    except Exception as e:
        print("FULL ERROR:")
        print(e)

        import traceback
        traceback.print_exc()

        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
    data = request.get_json()
     