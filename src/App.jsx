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

import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
console.log(process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({});

async function main() {
  console.log(response.text);
}

async function description(input) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
${input}
Write 3 paragraphs about this painting. Do deep research, search on the internet.
The first paragraph should describe the story the painting conveys.
The second paragraph can expand on the historical or narrative context.
The third paragraph should discuss the art itself—composition, technique, and style.
Write professionally, like a blog post. Avoid AI-like phrasing and keep the writing simple but refined.
`,
  });

  return response.text();
}

async function getRandomPainting() {
  const randomIndex = Math.floor(Math.random() * list.length);
  const randomPaintingID = list[randomIndex];
  const resImg = await fetch(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomPaintingID}`
  );
  const IMGData = await resImg.json();
  const response = await fetch("http://127.0.0.1:5000/run-script", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl: IMGData.primaryImage }),
  });
  const saliencydata = await response.json();

  return { imgdata: IMGData, saliancy: saliencydata };
}

function App() {
  const [paintingData, setPaintingData] = useState(null);
  const [paintingText, setPaintingText] = useState(null);
  const [croppedImages, setCroppedImages] = useState(null);

  useEffect(() => {
    async function fetchPainting() {
      try {
        let returned;

        do {
          returned = await getRandomPainting();
        } while (
          !returned.imgdata.primaryImage ||
          returned.imgdata.primaryImage === ""
        );

        setPaintingData(returned.imgdata);
        setCroppedImages(returned.saliancy.result);

        const text = await description(
          returned.imgdata.title + " " + returned.imgdata.artistDisplayName
        );
        const paragraphs = text.split("\n\n");
        setPaintingText(paragraphs);
      } catch (err) {
        console.error("Error fetching painting or description:", err);
      }
    }

    fetchPainting();
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
              {croppedImages && (
                <img
                  src={`data:image/png;base64,${croppedImages[0]}`}
                  alt="Processed"
                />
              )}
              <p>{paintingText ? paintingText[0] : ""}</p>
            </div>

            <div className="cropped">
              <p>{paintingText ? paintingText[1] : ""}</p>
              {croppedImages && (
                <img
                  src={`data:image/png;base64,${croppedImages[1]}`}
                  alt="Processed"
                />
              )}
            </div>

            <div className="cropped">
              {croppedImages && (
                <img
                  src={`data:image/png;base64,${croppedImages[2]}`}
                  alt="Processed"
                />
              )}
              <p>{paintingText ? paintingText[2] : ""}</p>
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
