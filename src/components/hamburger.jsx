import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import "./hamburger.css"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="nav-icon-group">
      
      <button onClick={toggleMenu} className="burger">
        <RxHamburgerMenu color=" #b8996b"/>
      </button>

      {/* Menu (conditionally rendered) */}
      {isOpen && (
          <ul className="nav-group">
            <li><a href="#" className="hover:text-gray-300">Home</a></li>
            <li><a href="#" className="hover:text-gray-300">About</a></li>
            <li><a href="#" className="hover:text-gray-300">Contact</a></li>
          </ul>
        
      )}
    </div>
  );
}
