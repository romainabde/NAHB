import { useState } from 'react'
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StoriesList from "./pages/StoriesList";
import StoryReader from "./pages/StoryReader";
import AuthorDashboard from "./pages/AuthorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import {AuthProvider} from "./contexts/AuthContext.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import StoryEditor from "./pages/StoryEditor/StoryEditor.jsx";
import PageEditor from "./pages/StoryEditor/PageEditor.jsx";
import MyStories from "./pages/MyStories/MyStories.jsx";


function App() {

  return (
      <AuthProvider>
          <BrowserRouter>
              <Routes>

                  {/* Pages publiques */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Pages stories */}
                  <Route path="/stories" element={<StoriesList />} />
                  <Route path="/story/:id" element={<StoryReader />} />

                  <Route path="/author/stories" element={<MyStories />} />
                  <Route path="/author/story/new" element={<StoryEditor />} />
                  <Route path="/author/story/:id/pages/new" element={<PageEditor />} />

                  {/* Pages protégées (pour l’instant on ne bloque pas) */}
                  <Route path="/author" element={<AuthorDashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />

              </Routes>
          </BrowserRouter>
      </AuthProvider>
  )
}

export default App
