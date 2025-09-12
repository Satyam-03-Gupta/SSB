import { useState } from "react";
import '../src/App.css';

const dummyPosts = [
  {
    id: 1,
    title: "The Future of Fitness & Technology",
    author: "Satyam Gupta",
    date: "August 25, 2025",
    image: "./assets/dinner4.png",
    content:
      "Discover how AI and smart devices are transforming fitness. From personalized training plans to real-time tracking, the future is exciting!",
  },
  {
    id: 2,
    title: "Top 5 Nutrition Myths Busted",
    author: "Satyam Gupta",
    date: "August 20, 2025",
    image: "./assets/dinner5.png",
    content:
      "Are carbs really bad? Is fat always harmful? We clear up the most common nutrition myths with science-backed facts.",
  },
  {
    id: 3,
    title: "Home Workout Routines for Busy People",
    author: "Satyam Gupta",
    date: "August 15, 2025",
    image: "./assets/dinner6.png",
    content:
      "No time for the gym? No problem! Here are effective home workout routines that keep you fit in just 20 minutes a day.",
  },
  {
    id: 4,
    title: "The Future of Fitness & Technology",
    author: "Satyam Gupta",
    date: "August 25, 2025",
    image: "./assets/dinner4.png",
    content:
      "Discover how AI and smart devices are transforming fitness. From personalized training plans to real-time tracking, the future is exciting!",
  },
  {
    id: 5,
    title: "Top 5 Nutrition Myths Busted",
    author: "Satyam Gupta",
    date: "August 20, 2025",
    image: "./assets/dinner5.png",
    content:
      "Are carbs really bad? Is fat always harmful? We clear up the most common nutrition myths with science-backed facts.",
  },
  {
    id: 6,
    title: "Home Workout Routines for Busy People",
    author: "Satyam Gupta",
    date: "August 15, 2025",
    image: "./assets/dinner6.png",
    content:
      "No time for the gym? No problem! Here are effective home workout routines that keep you fit in just 20 minutes a day.",
  },
];

export default function Blog() {
  const [posts] = useState(dummyPosts);

  return (
    <div className="blog-container">
      <h1 className="blog-title">Our Blog</h1>
      <div className="blog-grid">
        {posts.map((post) => (
          <div key={post.id} className="blog-card">
            <img src={post.image} alt={post.title} className="blog-image" />
            <div className="blog-content">
              <h2 className="blog-post-title">{post.title}</h2>
              <p className="blog-meta">
                {post.date} · <span>{post.author}</span>
              </p>
              <p className="blog-excerpt">{post.content}</p>
              <button className="read-more-btn">Read More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
