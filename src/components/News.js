import React, {useEffect, useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
// import PropTypes from "prop-types";
import InfiniteScroll from 'react-infinite-scroll-component'

const News = props => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const updateNews = async () => {
    props.setProgress(10)
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`
    setLoading(true)
    let data = await fetch(url)
    props.setProgress(40)
    let parsedData = await data.json()
    props.setProgress(70)
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
    props.setProgress(100)
  }
  useEffect(() => {
    updateNews()
    document.title = `${capitalizeFirstLetter(props.category)} - NewsZ`
  }, [])

  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${props.category}&apiKey=${props.apiKey}&page=${
      page + 1
    }&pageSize=${props.pageSize}`
    setPage(page + 1)
    let data = await fetch(url)
    let parsedData = await data.json()
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
    setLoading(false)
  }

  return (
    <>
      <h1 className="text-center" style={{marginTop: '70px'}}>
        NewsZ - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map(element => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 57) : ''}
                    description={
                      element.description
                        ? element.description.slice(0, 97)
                        : ''
                    }
                    imageUrl={
                      element.urlToImage
                        ? element.urlToImage
                        : 'https://thumbs.dreamstime.com/b/new-skills-knowledge-webinar-training-business-internet-technology-concept-new-skills-knowledge-webinar-training-business-internet-121274023.jpg'
                    }
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  )
}

// News.PropTypes = {
//   country: PropTypes.string,
//   pageSize: PropTypes.number,
//   category: PropTypes.string
// }

// News.defaultProp ={
//     country: "in",
//     pageSize: 9,
//     category: "general"
// }

export default News
