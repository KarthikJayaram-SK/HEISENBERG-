import React, { useEffect, memo } from 'react';

const ElfsightWidget = () => {
  useEffect(() => {
    // This function creates a script tag and adds it to the page head
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    
    // Check if the script is already on the page to avoid duplicates
    const existingScript = document.querySelector(`script[src="${script.src}"]`);
    if (!existingScript) {
      document.head.appendChild(script);
    }

    // Clean up the script when the component is unmounted
    return () => {
      const elfsightScript = document.querySelector(`script[src="${script.src}"]`);
      if (elfsightScript) {
        // While we could remove it, it's often better to leave it
        // in case the user navigates back to the page. Elfsight's script
        // is designed to handle this.
      }
    };
  }, []); // The empty array ensures this effect runs only once

  return (
    // This div is what the Elfsight script will target
    <div 
      className="elfsight-app-b7c5afa9-3619-4c0a-b51f-d0cd8ad7af3a" 
      data-elfsight-app-lazy
    ></div>
  );
};

// memo prevents the component from re-rendering unnecessarily
export default memo(ElfsightWidget);