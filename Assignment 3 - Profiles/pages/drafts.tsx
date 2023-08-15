import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import { useSession, getSession } from "next-auth/react";
import prisma from '../lib/prisma'
import { getUserSessionFromStorage } from "./new_session";
import axios from "axios";
import Router, { useRouter } from "next/router";



// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   const session = await getSession({ req });
//   if (!session) {
//     res.statusCode = 403;
//     return { props: { drafts: [] } };
//   }

//   const drafts = await prisma.post.findMany({
//     where: {
//       author: { email: session.user?.email },
//       published: false,
//     },
//     include: {
//       author: {
//         select: { name: true },
//       },
//     },
//   });
//   return {
//     props: { drafts },
//   };
// };

type Props = {
  drafts: PostProps[];
};

const Drafts: React.FC<Props> = () => {
  const router = useRouter()
  const session = getUserSessionFromStorage()

  let [drafts, setDrafts] = useState(null)

  useEffect(() => {
    if (!session) {
      router.push(`/login`);
    }
    const fetchData = async () => {
      const res = await axios.get("/api/drafts", { headers: { "Authorization": `Bearer ${session.token}` } });
      console.log(res.data.props);
      setDrafts(res.data.props);
    }
    fetchData().catch(console.error);
  }, [session]);

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Drafts</h1>
        <main>
          {drafts ? drafts.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          )) : <div></div>}
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

export default Drafts;
