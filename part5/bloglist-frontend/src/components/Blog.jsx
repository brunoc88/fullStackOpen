const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
      </div>
  </div>
)}


const Notification = ({ message, errorMessage }) => {
  if (!message && !errorMessage) {
      return null;
  }
  
  if(errorMessage){
      return(
          <div className="error">
              {errorMessage}
          </div>
      )
  }

  return (
    <div className="success">
      {message}
    </div>
  )
}

export {Blog, Notification}