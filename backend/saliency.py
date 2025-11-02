import cv2
import numpy as np

def processImage(cv2Image):
    saliency = cv2.saliency.StaticSaliencySpectralResidual_create()
    (success, saliencyMap) = saliency.computeSaliency(cv2Image)
    saliencyMap = (saliencyMap * 255).astype("uint8")
    return saliencyMap
