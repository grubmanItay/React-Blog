import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';

export type PostProps = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  hasVideo: Boolean;
  published: boolean;
  videoUrl: string;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <div className="title-container">
        <h2 className="post-title">{post.title}</h2>
        {post.hasVideo && <FontAwesomeIcon icon={faVideo} />}
      </div>
      <small>By {authorName}</small>
      <ReactMarkdown children={post.content} />

      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }

        .title-container {
          display: flex;
          align-items: center;
          margin-left: -2rem;
        }

        .post-title {
          margin-right: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Post;
