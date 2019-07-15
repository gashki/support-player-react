import React from "react";

// React components
import Help from "./Help";
import Required from "./Required";
import { SvgAddBox, SvgDelete } from "../SvgIcons";
import { UploadMessage, UploadSubmit } from "./Form";
import Vertical from "../Vertical";


// The media form of the upload page
function Media(props) {
  const { location, alignment, result, video, comments } = props;
  const handleChange = props.handleChange;
  const handleSubmit = props.handleSubmit;
  const changeState = props.changeState;

  // Returns to the previous page
  const previousPage = () => {
    // Changes the content to the details form
    handleChange("content", 0);

    // Scroll to the top of the page
    document.querySelector(".content > .scroll").scrollTop = 0;
  };

  const instructions = "Please use Steam's built-in screenshot feature (F12 by default) and set your in-game resolution to 1920x1080 or the highest common resolution you can run. We recommend to use OBS Studio for recording gameplay if you intend to submit in-game footage. Screenshots and videos may be edited to provide better clarity as long as the files abide by the appropriate file sizes and file types.";

  return (
    <div>
      <h3 style={{ marginBottom: "8px" }}>Instructions</h3>
      <p className="upload-instructions">{instructions}</p>
      <form onSubmit={handleSubmit}>
        <UploadImage
          label="Location"
          input="location"
          images={location}
          comments={comments}
          help="The first image in this set will be used in the thumbnail and should be a third-person view of the player in the starting location. Include additional images if the player must align themselves to a wall or the ground."
          onChange={handleChange}
          changeState={changeState}
        />
        <UploadImage
          label="Alignment"
          input="alignment"
          images={alignment}
          comments={comments}
          help="An image or set of images that should help the player align their crosshair or viewmodel to be able to consistently and successfully throw this grenade."
          onChange={handleChange}
          changeState={changeState}
        />
        <UploadImage
          label="Result"
          input="result"
          images={result}
          comments={comments}
          help="The first image in this set will be used in the thumbnail and should be an elevated view of the result of the grenade throw."
          onChange={handleChange}
          changeState={changeState}
        />
        <UploadVideo
          label="Demonstration"
          input="video"
          video={video}
          help="A video demonstration of the grenade throw. This video is intended to be short and to the point."
          onChange={handleChange}
          changeState={changeState}
        />
        <div style={{ height: 16 }} />
        <button className="upload-previous" type="button" onClick={previousPage}>Go to previous page</button>
        <UploadSubmit value="Submit" />
      </form>
    </div>
  );
}


// The images to be submitted
function UploadImage({ label, input, images, comments, help, onChange, changeState }) {
  // The maximum accepted file size
  const maxSize = 2;

  const fileRequirements =
    <ul>
      <li>Accepted file extensions: jpg, jpeg, png</li>
      <li>Maximum file size: {maxSize} MB</li>
    </ul>;

  // Validates the file type and displays the image
  const handleMedia = (e) => {
    const target = e.target;

    // Checks if there is a file selected
    if (target.files && target.files[0]) {
      const file = target.files[0];

      // Checks the file type and size
      if (/^image\/(jpeg|png)$/.test(file.type) && (file.size < 1024 * 1024 * maxSize)) {
        images.push(file);
        onChange(input, images);
      }
      else {
        // The content of the error message
        const content =
          <UploadMessage
            title="File Requirements"
            message="The submitted file does not meet one or more of the following requirements."
            content={fileRequirements}
            changeState={changeState}
          />;

        changeState("contentModal", content);
      }
    }
  };

  // Removes the image from display
  const removeMedia = (index) => {
    images.splice(index, 1);
    onChange(input, images);
  };

  // Stores the comment input
  const handleComment = (e) => {
    const value = { ...comments, [input]: e.target.value };
    onChange("comments", value);
  };

  // Prevents the label from opening the help message
  const handleClick = (e) => {
    e.preventDefault();
  };

  return (
    <section className="upload-media">
      <label onClick={handleClick}>
        {label}
        <Help message={help} content={fileRequirements} changeState={changeState} />
      </label>
      <div className="upload-image">
        <MediaFile
          id={`media-file-${input}-0`}
          media={images[0]}
          require={true}
          handleMedia={handleMedia}
          removeMedia={() => removeMedia(0)}
        />
        <MediaFile
          id={`media-file-${input}-1`}
          media={images[1]}
          handleMedia={handleMedia}
          removeMedia={() => removeMedia(1)}
        />
        <MediaFile
          id={`media-file-${input}-2`}
          media={images[2]}
          handleMedia={handleMedia}
          removeMedia={() => removeMedia(2)}
        />
      </div>
      <textarea
        className="border-box"
        value={comments[input]}
        placeholder="Comment (Optional)"
        rows="2"
        wrap="soft"
        maxLength={140}
        onChange={handleComment}
      />
    </section>
  );
}


// The video to be submitted
function UploadVideo({ label, input, video, help, onChange, changeState }) {
  // The maximum accepted file size
  const maxSize = 50;

  const fileRequirements =
    <ul>
      <li>Accepted file extensions: mp4</li>
      <li>Maximum file size: {maxSize} MB</li>
    </ul>;

  // Validates the file type and displays the video
  const handleMedia = (e) => {
    const target = e.target;

    // Checks if there is a file selected
    if (target.files && target.files[0]) {
      const file = target.files[0];

      // Checks the file type and size
      if (/^video\/(mp4)$/.test(file.type) && (file.size < 1024 * 1024 * maxSize)) {
        onChange(input, file);
      }
      else {
        // The content of the error message
        const content =
          <UploadMessage
            title="File Requirements"
            message="The submitted file does not meet one or more of the following requirements."
            content={fileRequirements}
            changeState={changeState}
          />;

        changeState("contentModal", content);
      }
    }
  };

  // Prevents the label from opening the help message
  const handleClick = (e) => {
    e.preventDefault();
  };

  return (
    <section className="upload-media">
      <label onClick={handleClick}>
        {label}
        <Help message={help} content={fileRequirements} changeState={changeState} />
      </label>
      <div className="upload-video">
        <MediaFile
          id={`media-file-${input}`}
          image={false}
          media={video}
          handleMedia={handleMedia}
          removeMedia={(_) => onChange(input, null)}
        />
      </div>
    </section>
  );
}


// Displays the selected media file
function MediaFile({ id, image = true, media, require = false, handleMedia, removeMedia }) {
  const label = image ? "Add an image" : "Add a video";
  const accept = image ? "image/jpeg,image/png" : "video/mp4";

  // Resets the value of the input element
  const handleClick = (_) => {
    document.getElementById(id).value = "";
    removeMedia();
  };

  return (
    <div>
      <input id={id} style={{ display: "none" }} type="file" accept={accept} onChange={handleMedia} />
      {media
        ? <div className="upload-media-file">
          {image
            ? <img src={URL.createObjectURL(media)} alt="Submitted file" />
            : <video src={URL.createObjectURL(media)} />
          }
          <button title="Remove" type="button" onClick={handleClick}>
            <SvgDelete color="#ff4755" />
          </button>
          <Vertical />
        </div>
        : <label className="upload-media-label unselectable" htmlFor={id}>
          <SvgAddBox color="#ffadd6" />
          <span>{label}{require && <Required />}</span>
          <Vertical />
        </label>
      }
    </div>
  );
}


export default Media;
