import { useEffect, useState } from "react";
import "./App.css";
import { RxHamburgerMenu } from "react-icons/rx";
import crop1 from "./assets/crop1.jpg";
import crop2 from "./assets/crop2.jpg";
import crop3 from "./assets/crop3.jpg";
import list from "./apis/met.js";

function App() {
  const [paintingData, setPaintingData] = useState(null);

  useEffect(() => {
    async function getRandomPainting() {
      // const res = await fetch(
      //   "https://collectionapi.metmuseum.org/public/collection/v1/objects?hasImages=true&isOnView=true&medium=Paintings"
      // );
      // const data = await res.json();
      // const list = data.objectIDs;
      const randomIndex = Math.floor(Math.random() * list.length);
      const randomPaintingID = list[randomIndex];
      const resImg = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomPaintingID}`
      );
      const dataImg = await resImg.json();
      setPaintingData(dataImg);
    }
    getRandomPainting();
  }, []);

  return (
    <>
      {paintingData ? (
        <>
          <h1 className="logo">ARS ANTIQUA</h1>
          <button className="burger">
            <RxHamburgerMenu />
          </button>
          <main>
            <div className="full-painting-wrapper">
              <div className="title-wrapper">
                <hr />
                <h1>{paintingData.title}</h1>
                <hr />
              </div>
              <img src={paintingData.primaryImage} alt={paintingData.title} />
              <p>
                {paintingData.culture} Created by:{" "}
                {paintingData.artistDisplayName} {paintingData.DisplayBio}{" "}
                {paintingData.period} {paintingData.medium}
              </p>
            </div>

            <div className="cropped">
              <div className="cropped-img">
                <img src={crop1} alt="crop1" />
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
                  doloremque delectus eum ratione quia a libero cupiditate esse
                  sed unde, suscipit porro? Libero nesciunt ducimus quae
                  molestiae totam autem hic?
                </p>
              </div>
            </div>

            <div className="cropped">
              <div className="cropped-img">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Similique nesciunt fuga, possimus nulla esse, facilis nostrum,
                  eos assumenda vel quae minus rerum! Magni dolore repudiandae
                  distinctio illum nobis, doloribus voluptatibus.
                </p>
                <img src={crop3} alt="crop3" />
              </div>
            </div>

            <div className="cropped">
              <div className="cropped-img">
                <img src={crop2} alt="crop2" />
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Reprehenderit sunt veniam qui ex libero beatae exercitationem
                  accusamus a, magni delectus, officiis alias ipsa aliquid sed
                  repudiandae aut sequi, eos laudantium!
                </p>
              </div>
            </div>

            <h1>Author, Year, Print Type, Gallery, sourced from</h1>
          </main>
        </>
      ) : (
        <div className="div">...loading</div>
      )}
    </>
  );
}

export default App;
