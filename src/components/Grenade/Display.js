import React, { Component } from "react";
import { MAPS, NADES } from "../../constants";

// React components
import { SvgNext, SvgPrevious } from "../SvgIcons";


// The media section of the grenade content
function Display({ nadeData }) {
  const components = [];

  // Checks if there is grenade data
  if (nadeData) {
    const {
      nade,
      map,
      location,
      movement,
      throw: thrw,
      images,
      videos,
      comments
    } = nadeData;

    // Checks if there is a video for the grenade
    if (videos.demo) {
      components.push(
        <div key="grenade-display-videos-demo" className="grenade-display-media">
          <video src={videos.demo} controls />
        </div>
      );
    }

    // The sections for separating the images and instructions
    const imageSets = ["location", "alignment", "result"];
    const imageUrls = {};
    const imageDesc = {};

    imageSets.forEach(imageSet => {
      let imageUrl;

      // Initializes the image URLs for each image section
      imageUrls[imageSet] = [];

      // Sorts the images into the appropriate image section
      for (let i = 0; imageUrl = images[`${imageSet}_${i}`]; i++) {
        imageUrls[imageSet].push(imageUrl);
      }
    });

    const mapTitle = MAPS[map].title;
    const nadeVerb = NADES[nade].verb;

    const tempThrw = [];
    const thrwDict = { 1: "left click", 2: "right click", 3: "left and right click" };

    if (movement["010"]) tempThrw.push("run");
    if (movement["001"]) tempThrw.push("jump");

    tempThrw.push(thrwDict[thrw]);
    const nadeThrw = tempThrw.join(", ");

    // The image descriptions for each section
    imageDesc["location"] = `Start at ${location.start} on ${mapTitle}`;
    imageDesc["alignment"] = `Align your crosshair and then throw the grenade (${nadeThrw})`;
    imageDesc["result"] = `The grenade should ${nadeVerb} ${location.end}`;

    // Adds the image sections for the grenade
    imageSets.forEach(imageSet => {
      const key = `grenade-display-images-${imageSet}`;
      const header = imageSet[0].toUpperCase() + imageSet.slice(1);

      components.push(
        <DisplayImage
          key={key}
          header={header}
          description={imageDesc[imageSet]}
          comment={comments[imageSet]}
          images={imageUrls[imageSet]}
        />
      );
    });
  }

  return (
    <div className="grenade-display">
      {components}
    </div>
  );
}


// Displays the content for the image section
class DisplayImage extends Component {
  constructor(props) {
    super(props);

    // The default state of the image set
    this.state = {
      index: 0
    };
  }

  // Updates the index for the image set
  nextIndex = (direction) => {
    const numOfImages = this.props.images.length;
    const prevIndex = this.state.index;

    // Increments or decrements the index based on the direction
    const tempIndex = prevIndex + (direction || -1);

    // Prevents negative modulo results
    const nextIndex = ((tempIndex % numOfImages) + numOfImages) % numOfImages;

    this.setState({ index: nextIndex });
  };

  render() {
    const index = this.state.index;

    const header = this.props.header;
    const description = this.props.description;
    const comment = this.props.comment;
    const images = this.props.images;

    // Used for cycling through the image set when there are multiple images
    const nextImage = images.length > 1;
    const nextIndex = this.nextIndex;

    return (
      <div>
        <h2>{header}</h2>
        <p>{description}</p>
        {comment && <p>User Comment: {comment}</p>}
        <div className="grenade-display-media">
          <img src={images[index]} />
          {nextImage && <NextImageButton direction={0} nextIndex={nextIndex} />}
          {nextImage && <NextImageButton direction={1} nextIndex={nextIndex} />}
        </div>
      </div>
    );
  }
}


// The button used for changing the index for the image set
function NextImageButton({ direction, nextIndex }) {
  const color = "#d4006a";
  const title = direction ? "Next" : "Previous";
  const image = direction ? <SvgNext color={color} /> : <SvgPrevious color={color} />;

  const handleClick = () => {
    nextIndex(direction);
  };

  return (
    <div>
      <button title={title} type="button" onClick={handleClick}>{image}</button>
    </div>
  );
}


export default Display;
