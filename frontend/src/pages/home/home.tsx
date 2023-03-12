import React from 'react';

//Components
import PostFormat from './components/postFormat';

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

          {/* Posts Start */}
          <PostFormat
            postUser={"qwerty123"}
            postDateTime={"8/1/2023 12:40PM (Edited)"}
          />
          {/* Post End */}

        </div>
        <div className='side-panel side-panel-right'>
          <p>Side Panel</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
