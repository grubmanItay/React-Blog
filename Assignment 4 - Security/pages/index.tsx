import React, { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from '../lib/prisma'
import router from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const toTake = 10;
  const pageNum = context.query.page;
  const pageNumber: number = parseInt(pageNum as string, 10);
  const toSkip = (pageNumber - 1) * toTake;
  const feed = await prisma.post.findMany({
    take: toTake,
    skip: toSkip ? toSkip : 0,
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
    orderBy: { id: 'desc' }
  });
  const totalCount = await prisma.post.count({
    where: {
      published: true,
    },
  })
  return {
    props: { feed, totalCount },
  };
};

type Props = {
  feed: PostProps[];
  totalCount: number
};

type PaginationProps = {
  numPages: number;
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

// ----------------   DELETE IF NO USED ----------------
// type PostsInPageProps = {
//   size: number
//   setSize: React.Dispatch<React.SetStateAction<number>>
// }

const Pagination: React.FC<PaginationProps> = (props) => {
  let pagesNums = [];
  let pagestart = Math.max(1, props.currentPage - 3)
  let pageend = Math.min(props.numPages, props.currentPage + 3)
  for (let i = pagestart; i <= pageend; i++)
    pagesNums.push(i);

  const handlePageChange = (pageNumber: number) => {
    props.setCurrentPage(pageNumber);
    router.push(`?page=${pageNumber}`);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div className="pagination">
        {props.currentPage !== 1 ?
          <a href="#" onClick={() => handlePageChange(1)}>{"«"}</a> :
          <a className="disabled">{"«"}</a>}
        {props.currentPage !== 1 ?
          <a href="#" onClick={() => handlePageChange(props.currentPage - 1)}>{"‹"}</a> :
          <a className="disabled" >{"‹"}</a>}
        {pagesNums.map(num => (
          <a key={num} className={num === props.currentPage ? "active" : ""} href="#" onClick={() => handlePageChange(num)}>
            {num}
          </a>
        ))}
        {props.currentPage !== props.numPages ?
          <a href="#" onClick={() => handlePageChange(props.currentPage + 1)}>{"›"}</a> :
          <a className="disabled">{"›"}</a>}
        {props.currentPage !== props.numPages ?
          <a href="#" onClick={() => handlePageChange(props.numPages)}>{"»"}</a> :
          <a className="disabled">{"»"}</a>}
      </div>
    </div>
  )
}
// ----------------   DELETE IF NO USED ----------------
// const SizeOfPageComponent: React.FC<PostsInPageProps> = (props) => {
//   let pageSizes = [5, 10, 20]
//   return (
//     <div style={{ textAlign: "right" }}>
//       <div className="sizing">
//         <a className="text">page size:</a>
//         {pageSizes.map(size => (
//           <a key={size} className={size === props.size ? "active" : ""} href="#" onClick={() => props.setSize(size)}>
//             {size}
//           </a>
//         ))}
//       </div>
//     </div>
//   )
// }

const Blog: React.FC<Props> = (props) => {
  const [currentPage, setCurrentPage] = useState(1)
  let username = 'alice1'
  //const [sizeOfPage, setSizeOfPage] = useState(10) //DELETE IF NO USED

  const numPages = Math.ceil(props.totalCount as number / 10)
  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
          {
            <div>
              <Pagination numPages={numPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}></Pagination>
              {/* <SizeOfPageComponent size={sizeOfPage} setSize={setSizeOfPage}></SizeOfPageComponent> */}
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
