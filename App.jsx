import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '@/Layout';
import Home from '@/Pages/Home';
import StudentDashboard from '@/Pages/StudentDashboard';
import AdminDashboard from '@/Pages/AdminDashboard';
import Documentation from '@/Pages/Documentation';
import Login from '@/Pages/Login';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout currentPageName="Home">
            <Home />
          </Layout>
        }
      />
      <Route
        path="/StudentDashboard"
        element={
          <Layout currentPageName="StudentDashboard">
            <StudentDashboard />
          </Layout>
        }
      />
      <Route
        path="/AdminDashboard"
        element={
          <Layout currentPageName="AdminDashboard">
            <AdminDashboard />
          </Layout>
        }
      />
      <Route
        path="/Documentation"
        element={
          <Layout currentPageName="Documentation">
            <Documentation />
          </Layout>
        }
      />
      <Route
        path="/Login"
        element={
          <Layout currentPageName="Login">
            <Login />
          </Layout>
        }
      />
      <Route
        path="*"
        element={
          <Layout currentPageName="Home">
            <Home />
          </Layout>
        }
      />
    </Routes>
  );
}
