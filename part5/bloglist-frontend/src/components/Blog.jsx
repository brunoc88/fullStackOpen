const Blog = ({ blog }) => (
  <div>
    {blog.title} {blog.author}
  </div>  
)


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