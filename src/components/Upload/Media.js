import React from "react";

// Components
import Required from "./Required";
import { UploadSubmit } from "./Form";
import Vertical from "../Vertical";

// SVG Icons
import ic_add_box from "../../svg/ic_add_box.svg";
import ic_delete from "../../svg/ic_delete.svg";

function Media(props) {
  const {
    location,
    alignment,
    result,
    video,
    comments
  } = props;

  const handleChange = props.handleChange;

  return (
    <form>
      <UploadImage
        label="Location"
        input="location"
        images={location}
        comments={comments}
        onChange={handleChange}
      />
      <UploadImage
        label="Alignment"
        input="alignment"
        images={alignment}
        comments={comments}
        onChange={handleChange}
      />
      <UploadImage
        label="Result"
        input="result"
        images={result}
        comments={comments}
        onChange={handleChange}
      />
      <UploadVideo
        label="Demonstration"
        input="video"
        video={video}
        onChange={handleChange}
      />
      <div style={{ height: 16 }}></div>
      <UploadSubmit value="Submit" />
    </form>
  );
}

function UploadImage({ label, input, images, comments, onChange }) {
  const handleMedia = (e) => {
    const target = e.target;

    if (target.files && target.files[0]) {
      const file = target.files[0];

      if (/^image\/(jpeg|png)$/.test(file.type)) {
        images.push(file);
        onChange(input, images);
      }
    }
  };

  const removeMedia = (index) => {
    images.splice(index, 1);
    onChange(input, images);
  };

  const handleComment = (e) => {
    const value = { ...comments, [input]: e.target.value };
    onChange("comments", value);
  };

  return (
    <section className="upload-media">
      <label>{label}<span>.jpg, .jpeg, .png</span></label>
      <div className="upload-image">
        <MediaFile
          id={`media-${input}-0`}
          media={images[0]}
          require={true}
          handleMedia={handleMedia}
          removeMedia={() => removeMedia(0)}
        />
        <MediaFile
          id={`media-${input}-1`}
          media={images[1]}
          handleMedia={handleMedia}
          removeMedia={() => removeMedia(1)}
        />
        <MediaFile
          id={`media-${input}-2`}
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
        onChange={handleComment}
      />
    </section>
  );
}

function UploadVideo({ label, input, video, onChange }) {
  const handleMedia = (e) => {
    const target = e.target;

    if (target.files && target.files[0]) {
      const file = target.files[0];

      if (/^video\/(mp4)$/.test(file.type)) {
        onChange(input, file);
      }
    }
  };

  return (
    <section className="upload-media">
      <label>{label}<span>.mp4</span></label>
      <div className="upload-video">
        <MediaFile
          id={"test"}
          image={false}
          media={video}
          handleMedia={handleMedia}
          removeMedia={(_) => onChange(input, null)}
        />
      </div>
    </section>
  );
}

function MediaFile({ id, image = true, media, require = false, handleMedia, removeMedia }) {
  const label = image ? "Add an image" : "Add a video";
  const accept = image ? "image/jpeg,image/png" : "video/mp4";

  return (
    <div>
      <input style={{ display: "none" }} id={id} type="file" accept={accept} onChange={handleMedia} />
      {media
        ? <div className="upload-media-file">
          {image
            ? <img src={URL.createObjectURL(media)} alt="" />
            : <video src={URL.createObjectURL(media)} alt="" />
          }
          <button title="Remove" type="button" onClick={removeMedia}>
            <img src={ic_delete} alt="" />
          </button>
          <Vertical />
        </div>
        : <label className="upload-media-label unselectable" htmlFor={id}>
          <img src={ic_add_box} alt="" />
          <span>{label}{require && <Required />}</span>
          <Vertical />
        </label>
      }
    </div>
  );
}

export default Media;
