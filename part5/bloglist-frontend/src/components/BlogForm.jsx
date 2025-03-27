import { useState } from 'react';

const BlogForm = ({ onCreateBlog }) => {
  const [blog, setBlog] = useState({ title: '', author: '', url: '', likes: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBlog(prevBlog => ({ ...prevBlog, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onCreateBlog(blog); // send the blog to App.jsx
    setBlog({ title: '', author: '', url: '', likes: '' }); // Restart form
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        title:
        <input type="text" name="title" value={blog.title} onChange={handleChange} />
      </div>
      <div>
        author:
        <input type="text" name="author" value={blog.author} onChange={handleChange} />
      </div>
      <div>
        URL:
        <input type="text" name="url" value={blog.url} onChange={handleChange} />
      </div>
      <div>
        Likes:
        <input type="number" name="likes" value={blog.likes} onChange={handleChange} />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export { BlogForm };
