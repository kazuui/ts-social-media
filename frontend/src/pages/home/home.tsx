import React from 'react';

//Components

function Home() {
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
                <p className='post-user-location'>Location</p>
              </div>
              <div className='post-edit'>
                <p>icon</p>
              </div>
            </div>
            <div className='post-content'>
              <p>Post Content</p>
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
