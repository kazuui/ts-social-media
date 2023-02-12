import React from 'react';

//Components
import { ReactComponent as SVG } from "../../assets/ellipsis-solid.svg"

function Home() {

  // temporary only
  var showImage = true;

  return (
    <div className='page'>
      <div className='panel-container'>
        <div className='side-panel side-panel-left'>
          <p>Side Panel</p>
        </div>
        <div className='main-panel'>
          <p>Main Panel</p>
          {/* Post Example?? */}
          <div className='post-item'>
            <div className='post-user-info'>
              <div className='post-user-profile-img'>
                {/*  */}
              </div>
              <div className='post-user-text'>
                <p className='post-user-name'>qwerty123</p>
                <p className='post-user-location'>8/1/2023 12:40PM (Edited)</p>
              </div>
              <div className='post-edit'>
                <SVG height='20px' />
              </div>
            </div>
            <div className='post-content'>
              <p>Post Content</p>
            </div>
            <div className='post-image'>
            </div>
            <div className='post-interactions'>
              <p>Like</p>
              <p>Comment</p>
              <p>Share</p>
              <p>Bookmark</p>
            </div>
            <div className='post-likes'>
              <p>Likes</p>
            </div>
            <div className='post-comment-summary'>
              <p>Comment summary</p>
            </div>
          </div>
        </div>
        <div className='side-panel side-panel-right'>
          <p>Side Panel</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
