import React from "react";
import "./Rating.css";

// React components
import { SvgStar } from "./SvgIcons";


// A component that displays a star rating
function Rating({ width }) {
  return (
    <div className="rating">
      <span>
        <SvgStar color="#bdbdbd" />
        <SvgStar color="#bdbdbd" />
        <SvgStar color="#bdbdbd" />
        <SvgStar color="#bdbdbd" />
        <SvgStar color="#bdbdbd" />
      </span>
      <span style={{ width: `${width}%` }}>
        <SvgStar color="#d00010" />
        <SvgStar color="#d00010" />
        <SvgStar color="#d00010" />
        <SvgStar color="#d00010" />
        <SvgStar color="#d00010" />
      </span>
    </div>
  );
}

export default Rating;
