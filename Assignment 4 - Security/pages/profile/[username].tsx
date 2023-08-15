import React, { useState } from "react";
import { GetServerSideProps } from "next";
import prisma from "../../lib/prisma";
import Layout from "../../components/Layout";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    let username:string|string[] = params?.username || "";
    username = Array.isArray(username) ? username.join(",") : username;
    
    const user = await prisma.user.findUnique({
        where: {
            userName: username,
          },
    })

    const props:ProfileProps = {
        name: user?.name ||"",
        username: user?.userName || "",
        email: user?.email || ""
    }

    return {props: props};
}

type ProfileProps = {
    name: string;
    username: string;
    email: string;
  };


  const profile: React.FC<ProfileProps> = (data) => {
    return (
        <Layout>
      <div className='body'>
        <div className='profile'>
          <h1>Profile</h1>
          <div className='profile-info'>
            <p>
              <strong>Full Name:</strong> {data.name}
            </p>
            <p>
              <strong>Username:</strong> {data.username}
            </p>
            <p>
              <strong>Email:</strong> {data.email}
            </p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .body {
          margin: 0;
          padding: 0;
          font-family: 'Arial';
          display: flex;
          align-items: flex-start;
          justify-content: center;
          height: 100vh;
        }

        .profile {
          width: 600px;
          overflow: hidden;
          padding: 20px;
          border-radius: 15px;
          background-color: white;
        }

        .profile-info {
          margin-bottom: 20px;
          margin-left: 50px;
        }

        h1 {
          text-align: center;
          padding: 20px;
        }
      `}</style>
    </Layout>
    )
  }

  export default profile;