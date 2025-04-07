import { useState } from 'react';
import blogService from '../services/blogs';

const Blog = ({ blog, updateBlog, updateBlogListAfterDelete, user }) => {
  const [visible, setVisible] = useState(false);


  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    };

    try {
      const updated = await blogService.update(blog.id, updatedBlog);
      updateBlog({ ...updated, user: blog.user });
    } catch (error) {
      console.error("Error updating blog:", error.response?.data || error.message);
    }
  };



  const handleDelete = async (blogToDelete) => {
    const message = `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`;
    if (window.confirm(message)) {
      try {
        await blogService.deleteBlog(blogToDelete.id);
        updateBlogListAfterDelete(blogToDelete.id);
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>Likes: {blog.likes} <button onClick={handleLike}>like</button></p>
          <p>{blog.user.name}</p>
          <div>
            {user.username === (blog.user.username || blog.user.name) && (
              <button onClick={() => handleDelete(blog)}>remove</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};



const Notification = ({ message, errorMessage }) => {
  if (!message && !errorMessage) {
    return null;
  }

  return (
    <div className={errorMessage ? 'error' : 'success'}>
      {errorMessage || message}
    </div>
  );
};

export { Blog, Notification };
