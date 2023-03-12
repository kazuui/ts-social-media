import React from 'react';

//Components
import { ReactComponent as SVG } from "../../../assets/ellipsis-solid.svg"

function PostFormat(props) {

  //Props
  const { postUser, postDateTime } = props;


  return (
    <div className='post-item'>
      <div className='post-user-info'>
        <div className='post-user-profile-img'>
          {/*  */}
        </div>
        <div className='post-user-text'>
          <p className='post-user-name'>{postUser}</p>
          <p className='post-date-time'>{postDateTime}</p>
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
  )
}

export default PostFormat;