import React from "react";

// React components
import { SvgAddBox } from "../SvgIcons";
import { SvgFavorite } from "../SvgIcons";
import { SvgSchedule } from "../SvgIcons";
import { SvgUpload } from "../SvgIcons";


function Collections() {
  return (
    <ul className="sidebar-collections">
      <CollectionItem svg={<SvgFavorite color="#f5f5f5" />} title="Favorites" />
      <CollectionItem svg={<SvgUpload color="#f5f5f5" />} title="Uploaded" />
      <CollectionItem svg={<SvgSchedule color="#f5f5f5" />} title="View later" />
      <CollectionItem svg={<SvgAddBox color="#f5f5f5" />} title="Create new collection" />
    </ul>
  );
}


function CollectionItem({ svg, title }) {
  return (
    <li><a href="" title={title}>{svg}{title}</a></li>
  );
}


export default Collections;
