import React, { useRef, useState, useEffect } from 'react';
import './dropdownStyle.css';

const DropDown = ({className,buttonStyle,title,options, position}) => {
  console.log(options)
  const ref = useRef(null);

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsDropDownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref]);

  return (
    <div className='dropDownContainer'>
    <div className= 'ddinline'>

      <div className= 'ddButtonContainer'>
        <button className= 'buttonOne' onClick={() => { setIsDropDownOpen(!isDropDownOpen)}}>
        {title}
        </button>
      </div>

      {isDropDownOpen && (
        <div className = 'ddoptions'>
          {options.map((option) => {return (<button className='buttonDos' onClick={option.onClick}>{option.text}</button>)})}
        </div>
      )}

    </div>
    </div>
  );
};

export default DropDown;
