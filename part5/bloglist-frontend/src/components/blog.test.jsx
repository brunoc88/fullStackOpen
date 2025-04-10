import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Blog} from './Blog'
import { BlogForm } from './BlogForm';

test('show title and author', ()=>{
    const blog = {
        title: 'Testing with Vitest',
        author: 'Vitest Author',
        url: 'http://vitest.dev',
        likes: 42,
        user: {
          name: 'Test User',
          username: 'testuser'
        }
      }
    render(<Blog blog ={blog}/>)
    
    const element = screen.getByText((content, element) =>
      content.includes('Testing with Vitest')
    )
    const url = screen.queryByText(blog.url)
    const likes = screen.queryByText(/Likes:/i)

    expect(url).toBeNull()
    expect(likes).toBeNull()
    expect(element).toBeDefined()

})

test('showing the url and number of like when user click de button view', async()=>{
  const blog = {
    title: 'Testing with Vitest',
    author: 'Vitest Author',
    url: 'http://vitest.dev',
    likes: 42,
    user: {
      name: 'Test User',
      username: 'testuser'
    }
  }

  render(<Blog blog={blog} user={blog.user} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  expect(screen.getByText(blog.url)).toBeDefined()
  expect(screen.getByText(/Likes:/i)).toBeDefined()
  
})

test('calls like handler twice when like button is clicked twice', async () => {
  const blog = {
    title: 'Testing with Vitest',
    author: 'Vitest Author',
    url: 'http://vitest.dev',
    likes: 42,
    user: {
      name: 'Test User',
      username: 'testuser'
    }
  }

  const mockLikeHandler = vi.fn() 

  render(
    <Blog
      blog={blog}
      user={{ username: 'testuser' }}
      handleLike={mockLikeHandler}
      handleDelete={() => {}}
    />
  )

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockLikeHandler).toHaveBeenCalledTimes(2)
})


