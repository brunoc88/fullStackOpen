import { useState, useEffect } from 'react';
import { Blog, Notification } from './components/Blog';
import { LoginForm } from './components/Loginform';
import { BlogForm } from './components/BlogForm';
import { Toggable } from './components/toggable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs.sort((a, b) => b.likes - a.likes));
    });
  }, []);
  

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggerBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogOut = () => {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem('loggerBlogAppUser');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggerBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.log(exception)
      setErrorMessage('Wrong credentials');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const addBlog = async (blogData) => {
    try {
      const createdBlog = await blogService.create(blogData);
      setBlogs(prevBlogs => [...prevBlogs, createdBlog]);
      setSuccessMessage(`A new blog "${blogData.title}" by ${blogData.author} added`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.log(error)
      setErrorMessage('Failed to add blog');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const updateBlog = (updatedBlog) => {
    setBlogs(blogs.map(blog => (blog.id === updatedBlog.id ? updatedBlog : blog)));
  };

  const updateBlogListAfterDelete = (deletedId) => {
    setBlogs(prevBlogs => prevBlogs.filter(b => b.id !== deletedId));
  };
  

  return (
    <div>
      {user === null ? (
        <div>
          <h2>Log in to application</h2>
          <Notification message={successMessage} errorMessage={errorMessage} />
          <LoginForm
            username={username}
            password={password}
            handlesubmit={handleLogin}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
          />
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <Notification message={successMessage} errorMessage={errorMessage} />
          <p>{user.username} logged in <button onClick={handleLogOut}>logout</button></p>

          <Toggable buttonLabel="create new blog">
            <h2>Create a new Blog</h2>
            <BlogForm onCreateBlog={addBlog} />
          </Toggable>

          {blogs.map(blog => <Blog key={blog.id} blog={blog} updateBlog={updateBlog} updateBlogListAfterDelete = {updateBlogListAfterDelete} user={user}/>)}
        </div>
      )}
    </div>
  );
};

export default App;
