import { use, useEffect, useState } from "react";
import "./App.css";

import { HiMiniBuildingLibrary } from "react-icons/hi2";
import { IoPersonOutline } from "react-icons/io5";
import { GiLargePaintBrush } from "react-icons/gi";
import { GrMapLocation } from "react-icons/gr";
import { MdOutlineDateRange } from "react-icons/md";
import list from "./apis/met.js";
import Groq from "groq-sdk";
import { GiMagnifyingGlass } from "react-icons/gi";
import Navbar from "./components/hamburger.jsx";


import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
  console.log(response.text);
}

async function description(input) {
  try {
    console.log("Starting Gemini request...");
    console.log("Input:", input);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
${input}
Write 3 paragraphs about this painting.
`,
    });

    console.log("Gemini raw response:", response);

    const text = response.text;

    console.log("Gemini text:", text);

    return text;
  } catch (err) {
    console.error("Gemini ERROR:", err);
    return "Failed to generate description";
  }
}

async function getRandomPainting() {
  console.log("Choosing random painting...");

  let IMGData;

  do {
    const randomIndex = Math.floor(Math.random() * list.length);

    const randomPaintingID = list[randomIndex];

    const resImg = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomPaintingID}`
    );

    IMGData = await resImg.json();
  } while (!IMGData.primaryImage);

  return IMGData;
}

async function getSaliency(imageUrl) {
  try {
    const response = await fetch("http://127.0.0.1:5000/run-script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();

    return data.result;
  } catch (err) {
    console.error("Saliency ERROR:", err);
    return null;
  }
}

function App() {
  const [paintingData, setPaintingData] = useState(null);
  const [paintingText, setPaintingText] = useState(null);
  const [croppedImages, setCroppedImages] = useState(null);
  const [loadingPainting, setLoadingPainting] = useState(false);
const [loadingSaliency, setLoadingSaliency] = useState(false);
const [loadingText, setLoadingText] = useState(false);

 async function loadArtwork() {
  try {
    setLoadingPainting(true);
    setLoadingSaliency(true);
    setLoadingText(true);

    setPaintingData(null);
    setPaintingText(null);
    setCroppedImages(null);

    const artwork = await getRandomPainting();

    console.log("Artwork fetched");

    setPaintingData(artwork);

    setLoadingPainting(false);

    getSaliency(artwork.primaryImage).then((images) => {
      setCroppedImages(images);
      setLoadingSaliency(false);
    });

    description(
      artwork.title + " " + artwork.artistDisplayName
    ).then((text) => {
      const paragraphs = text.split("\n\n");
      setPaintingText(paragraphs);
      setLoadingText(false);
    });

  } catch (err) {
    console.error(err);
  }
}

useEffect(() => {
  loadArtwork();
}, []);

  return (
    <>
      {paintingData ? (
        <>
          <h1 className="logo">ARS ANTIQUA</h1>
          <Navbar />
          
          <main>
            <div className="full-painting-wrapper">
              <div className="title-desc-wrapper">
                <div className="title-wrapper">
                  <hr />
                  <h1>{paintingData.title}</h1>
                  <hr />
                </div>
                <div className="desc-wrapper">
                  <HiMiniBuildingLibrary size="15" color="#b8996b" />
                  <p className="muse">The Metropolian Museum of Art</p>
                </div>
              </div>
              <img src={paintingData.primaryImage} alt={paintingData.title} />
              <div className="info-panel">
                {paintingData.culture && (
                  <div className="info-section">
                    <GrMapLocation color="#b8996b" /> {paintingData.culture}
                  </div>
                )}

                {paintingData.artistDisplayName && (
                  <div className="info-section">
                    <IoPersonOutline color="#b8996b" />{" "}
                    {paintingData.artistDisplayName}
                  </div>
                )}

                {paintingData.period && (
                  <div className="info-section">
                    <MdOutlineDateRange color="#b8996b" /> {paintingData.period}
                  </div>
                )}

                {paintingData.medium && (
                  <div className="info-section">
                    <GiLargePaintBrush color="#b8996b" /> {paintingData.medium}
                  </div>
                )}
              </div>
            </div>
            <button className="new-art-btn" onClick={loadArtwork}>
  New Artwork
</button>
            <div className="detailed-segments">
              <hr />
              <div className="detailed-segments-text">
                <h2> DETAILED SEGMENTS</h2> <GiMagnifyingGlass />
              </div>

              <p>
                Explore the intricate details within the painting and know the
                symbolism and history
              </p>
            </div>

            <div className="cropped">
  {loadingSaliency ? (
    <div className="placeholder-img">Loading image segment...</div>
  ) : (
    croppedImages && (
      <img
        src={`data:image/png;base64,${croppedImages[0]}`}
        alt="Processed"
      />
    )
  )}

  <p>
    {loadingText
      ? "Generating analysis..."
      : paintingText?.[0]}
  </p>
</div>

            <div className="cropped">
  <p>
    {loadingText
      ? "Researching historical context..."
      : paintingText?.[1]}
  </p>

  {loadingSaliency ? (
    <div className="placeholder-img">Loading image segment...</div>
  ) : (
    croppedImages && (
      <img
        src={`data:image/png;base64,${croppedImages[1]}`}
        alt="Processed"
      />
    )
  )}
</div>
            <div className="cropped">
  {loadingSaliency ? (
    <div className="placeholder-img">Loading image segment...</div>
  ) : (
    croppedImages && (
      <img
        src={`data:image/png;base64,${croppedImages[2]}`}
        alt="Processed"
      />
    )
  )}

  <p>
    {loadingText
      ? "Analyzing composition and style..."
      : paintingText?.[2]}
  </p>
</div>

            <p>
              Made with love by tachi, check out the sidebar to know more about
              this project and to contact me
            </p>
          </main>
        </>
      ) : (
        <div className="div">...loading</div>
      )}
    </>
  );
}

export default App;
