const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null // Si no hay blogs, retornamos null

  let blogFav = blogs[0] // Inicializamos con el primer blog

  blogs.forEach((blog) => {
    if (blog.likes > blogFav.likes) {
      blogFav = blog // Si encontramos un blog con más likes, lo actualizamos
    }
  })

  return {
    title: blogFav.title,
    author: blogFav.author,
    likes: blogFav.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const grouped = _.countBy(blogs, 'author')
  const topAuthor = _.maxBy(Object.keys(grouped), (author) => grouped[author])

  return { author: topAuthor, blogs: grouped[topAuthor] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const grouped = _.groupBy(blogs, 'author')
  const topAuthor = _.maxBy(Object.keys(grouped), (author) => _.sumBy(grouped[author], 'likes'))

  return { author: topAuthor, likes: _.sumBy(grouped[topAuthor], 'likes') }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
