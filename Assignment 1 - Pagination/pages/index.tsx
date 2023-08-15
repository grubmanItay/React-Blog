import React, { useState } from "react";
import type { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from '../lib/prisma'

export const getServerSideProps: GetServerSideProps = async () => {
  const feed = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
  return {
    props: { feed },
  };
};

type Props = {
  feed: PostProps[];
};

type PaginationProps = {
  numPages: number;
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

type PostsInPageProps = {
  size: number
  setSize: React.Dispatch<React.SetStateAction<number>>
}

const Pagination: React.FC<PaginationProps> = (props) => {
  let pagesNums = [];
  let pagestart = Math.max(1, props.currentPage - 3)
  let pageend = Math.min(props.numPages, props.currentPage + 3)
  for (let i = pagestart; i <= pageend; i++)
    pagesNums.push(i);

  return (
    <div style={{ textAlign: "center" }}>
      <div className="pagination">
        {props.currentPage !== 1 ?
          <a href="#" onClick={() => props.setCurrentPage(props.currentPage - 1)}>{"«"}</a> :
          <a className="disabled" >{"«"}</a>}
        {pagesNums.map(num => (
          <a key={num} className={num === props.currentPage ? "active" : ""} href="#" onClick={() => props.setCurrentPage(num)}>
            {num}
          </a>
        ))}
        {props.currentPage !== props.numPages ?
          <a href="#" onClick={() => props.setCurrentPage(props.currentPage + 1)}>{"»"}</a> :
          <a className="disabled">{"»"}</a>}
      </div>
    </div>
  )
}

const SizeOfPageComponent: React.FC<PostsInPageProps> = (props) => {
  let pageSizes = [5, 10, 20]
  return (
    <div style={{ textAlign: "right" }}>
      <div className="sizing">
        <a className="text">page size:</a>
        {pageSizes.map(size => (
          <a key={size} className={size === props.size ? "active" : ""} href="#" onClick={() => props.setSize(size)}>
            {size}
          </a>
        ))}
      </div>
    </div>
  )
}


const Blog: React.FC<Props> = (props) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sizeOfPage, setSizeOfPage] = useState(10)
  const start: number = (currentPage - 1) * sizeOfPage;
  const end: number = start + sizeOfPage;
  const slicedfeed = props.feed.slice(start, end);
  slicedfeed.length === 0 ? currentPage !== 1 ? setCurrentPage(currentPage - 1) : null : null
  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {slicedfeed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
          {
            <div>
              <Pagination numPages={Math.ceil(props.feed.length / sizeOfPage)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}></Pagination>
              <SizeOfPageComponent size={sizeOfPage} setSize={setSizeOfPage}></SizeOfPageComponent>
            </div>
          }
        </main>
      </div>
      <style jsx>{`
        
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }

      `}</style>
    </Layout>
  );
};

export default Blog;
