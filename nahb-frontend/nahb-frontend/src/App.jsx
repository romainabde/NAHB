import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StoriesList from "./pages/StoriesList";
import StoryReader from "./pages/StoryReader";
import AdminDashboard from "./pages/AdminDashboard";
import {AuthProvider} from "./contexts/AuthContext.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import StoryEditor from "./pages/StoryEditor/StoryEditor.jsx";
import PageEditor from "./pages/StoryEditor/PageEditor.jsx";
import MyStories from "./pages/MyStories/MyStories.jsx";
import './App.css';


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

                  {/* Pages auteur */}
                  <Route path="/author/stories" element={<MyStories />} />
                  <Route path="/author/story/new" element={<StoryEditor />} />
                  <Route path="/author/story/:id/pages/new" element={<PageEditor />} />

                  {/* Pages admin */}
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />

              </Routes>
          </BrowserRouter>
      </AuthProvider>
  )
}

export default App
