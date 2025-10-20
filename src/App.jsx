import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import painting from './assets/artexample.jpg'

function App() {
 

  return (
    <>
      <header className='Header'>
        <h1>ARS ANTIQUA</h1>
        <button>___</button>
      </header>
      <main>
        <img src={painting} alt="siera nevada" />
        <h1>Mount Corcoran</h1>
        <p>zoomed in image</p>
        <p>text</p>
        <p>zoomed in image</p>
        <p>text</p>
        <p>zoomed in image</p>
        <p>text</p>
        <p>zoomed in image</p>
        <p>text</p>
        <h1>Author, Year, Print Type, Gallery, sourced from</h1>
      </main>

    </>
  )
}

export default App
