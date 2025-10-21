import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import painting from "./assets/artexample.jpg";
import crop1 from "./assets/crop1.jpg";
import crop2 from "./assets/crop2.jpg";
import crop3 from "./assets/crop3.jpg";

import { RxHamburgerMenu } from "react-icons/rx";



const metmuesuemids = []

async function getRandomPainting() {
  const res = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isOnView=true&medium=Paintings")
  const data = await res.json();
  const list = data.objectIDs;
  const randomIndex = Math.floor(Math.random() * list.length);
  const randomPaintingID = list[randomIndex];
  const res2 = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomPaintingID}`);
  const data2 = await res2.json();
}

getRandomPainting();

function App() {
  return (
    <>
      <h1 className="logo">ARS ANTIQUA</h1>
      <button className="burger">
        <RxHamburgerMenu />
      </button>
      <main>
        <div className="full-painting-wrapper">
          <div className="title-wrapper">
            <hr />
            <h1>Mount Corcoran</h1>
            <hr />
          </div>
          <img src={painting} alt="siera nevada" />
          <p>c. 1876-1877 Albert Bierstadt</p>
        </div>
        <div className="croppped">
          <hr />
          <div className="cropped-img">
            <img src={crop1} alt="crop1" />
            <p>
              In Mount Corcoran, Albert Bierstadt depicts a breathtaking
              mountain landscape centered around a calm, mirror-like lake. The
              water stretches across the foreground, perfectly reflecting the
              surrounding peaks and sky, creating a sense of stillness and
              purity. On the shore, clusters of evergreen trees and rocky
              formations add texture and depth, while soft patches of mist drift
              near the water’s edge. The scene feels untouched and peaceful,
              inviting the viewer into a serene corner of nature.
            </p>
          </div>
          <hr />
        </div>
        <div className="cropped">
          <div className="cropped-img">
            <p>
              Rising above the lake, the mountains dominate the composition with
              their snow-capped summits and rugged cliffs. Light breaks through
              the clouds, striking the peaks and casting golden highlights
              against deep shadows. The sky above is filled with layers of
              cloud—some soft and illuminated, others dark and heavy—suggesting
              a moment of transition between calm and storm. Every element, from
              the glimmering reflections to the glowing mountaintops, feels
              carefully balanced, emphasizing the grandeur and harmony of the
              natural world.
            </p>
            <img src={crop3} alt="crop1" />
          </div>
        </div>
        <div className="cropped">
          <div className="cropped-img">
            <img src={crop2} alt="crop1" />
            <p>
              Beyond its physical beauty, the painting embodies Bierstadt’s
              vision of the American West as a place of awe and divine majesty.
              The dramatic light and vast scale turn the landscape into
              something almost spiritual—a cathedral of nature. Mount Corcoran
              is not just a depiction of mountains and water but a symbol of
              purity, discovery, and transcendence. Through its glowing light
              and immense depth, the painting evokes a feeling of reverence, as
              though nature itself were a sacred and eternal presence.
            </p>
          </div>
        </div>

        <h1>Author, Year, Print Type, Gallery, sourced from</h1>
      </main>
    </>
  );
}

export default App;
