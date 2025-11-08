// src/components/ui/ElfsightWidget.js
import React, { useEffect } from 'react';
import styled from 'styled-components';

const WidgetContainer = styled.div`
  width: 100%;
  min-height: 400px; // Add a min-height to prevent layout shifts while loading
`;

const ElfsightWidget = () => {
  const widgetClass = 'elfsight-app-5c201895-0245-4296-bef8-0fc6d9762325'; // Your specific widget class
  const scriptSrc = 'https://elfsightcdn.com/platform.js';
  const scriptId = 'elfsight-platform-script'; // Unique ID for the script

  useEffect(() => {
    // Check if the script is already added
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.id = scriptId;
      script.async = true; // Use async as provided
      // data-use-service-core might not be needed if not in Elfsight's code
      // script.dataset.useServiceCore = true; 
      document.body.appendChild(script);
    }

    // Cleanup function (optional, might not be needed for platform.js)
    // return () => {
    //   const existingScript = document.getElementById(scriptId);
    //   if (existingScript) {
    //      // Check Elfsight docs if removing this script causes issues
    //     // document.body.removeChild(existingScript);
    //   }
    // };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <WidgetContainer>
      {/* This div matches the code Elfsight provided */}
      <div className={widgetClass} data-elfsight-app-lazy></div>
    </WidgetContainer>
  );
};

export default ElfsightWidget;