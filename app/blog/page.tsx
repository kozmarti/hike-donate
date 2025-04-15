export default async function Page() {
    const data = await fetch('http://localhost:3000/api/user/147153150/project/test/stats')
    const posts = await data.json()
    return (
      <ul>
        {posts
          .photosUrl.map((post: any) => (
            <li key={post.hikeDate}>
              <h2>{post.hikeDate}</h2>
              <img src={post.photos[0]} alt="Hike" />
            </li>
          ))}
      </ul>
    )
  }