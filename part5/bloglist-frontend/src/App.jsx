import { useState, useEffect } from 'react'
import {Blog, Notification} from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '', likes: '' })
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggerBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogOut = async() =>{
    setUser(null)
    blogService.setToken(user.token)
    window.localStorage.removeItem('loggerBlogAppUser')
  }
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem('loggerBlogAppUser',JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleBlogChange = (event) => {
    const { name, value } = event.target;
    setNewBlog(prevBlog => ({
      ...prevBlog,
      [name]: value
    }));
  };

  const addBlog = async (event) => {
    event.preventDefault();

    try {
      const createdBlog = await blogService.create(newBlog);
      setBlogs(prevBlogs => [...prevBlogs, createdBlog]);
      setNewBlog({ title: '', author: '', url: '', likes: '' });
      setSuccessMessage(`A new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Error creating blog:', error);
      setErrorMessage('Failed to add blog');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          type="text"
          name="title"
          value={newBlog.title}
          onChange={handleBlogChange}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          name="author"
          value={newBlog.author}
          onChange={handleBlogChange}
        />
      </div>
      <div>
        URL:
        <input
          type="text"
          name="url"
          value={newBlog.url}
          onChange={handleBlogChange}
        />
      </div>
      <div>
        Likes:
        <input
          type="number"
          name="likes"
          value={newBlog.likes}
          onChange={handleBlogChange}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );

  return (
    <div>
      {user === null ? (
        <div>
          <h2>Log in to application</h2>
          <Notification message={successMessage} errorMessage={errorMessage}/>
          {loginForm()}
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <Notification message={successMessage} errorMessage={errorMessage}/>
          <p>{user.username} logged in <button onClick={handleLogOut}>logout</button></p>
          <h2>Create a new Blog</h2>
          {blogForm()}          
          {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
        </div>
      )}
    </div>
  )
}

export default App