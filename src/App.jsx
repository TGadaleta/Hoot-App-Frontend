import { useState, useEffect, createContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Landing from "./components/Landing/Landing";
import HootForm from "./components/HootForm/HootForm";
import HootList from "./components/HootList/HootList";
import Dashboard from "./components/Dashboard/Dashboard";
import SignupForm from "./components/SignupForm/SignupForm";
import SigninForm from "./components/SigninForm/SigninForm";
import HootDetails from "./components/HootDetails/HootDetails";
import * as authService from "../src/services/authService"; // import the authservice
import * as hootService from "../src/services/hootService";

export const AuthedUserContext = createContext(null);

const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getUser()); // using the method from authservice
  const [hoots, setHoots] = useState();

  useEffect(() => {
    const fetchHoots = async () => {
      const hoots = await hootService.index();
      setHoots(hoots);
    };
    if (user) {
      fetchHoots();
    }
  }, [user]);

  const handleAddHoot = async (hootData) => {
    const newHoot = await hootService.create(hootData);
    setHoots([...hoots, newHoot]);
    navigate("/hoots");
  };

  const handleUpdateHoot = async (hootId, hootFormData) => {
    const updatedHoot = await hootService.update(hootId, hootFormData)
    setHoots(hoots.map((hoot) => (hoot._id === updatedHoot._id ? updatedHoot : hoot)))
    navigate(`/hoots/${hootId}`);
  };

  const handleDeleteHoot = async (hootId) => {
    const deletedHoot = await hootService.deleteHoot(hootId);
    setHoots(hoots.filter((hoot) => hoot._id !== deletedHoot._id));
    navigate("/hoots");
  };

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  return (
    <>
      <AuthedUserContext.Provider value={user}>
        <NavBar handleSignout={handleSignout} />
        <Routes>
          {user ? (
            // Protected
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/hoots" element={<HootList hoots={hoots} />} />
              <Route
                path="/hoots/:hootId"
                element={<HootDetails handleDeleteHoot={handleDeleteHoot} />}
              />
              <Route
                path="/hoots/new"
                element={<HootForm handleAddHoot={handleAddHoot} />}
              />
              <Route
                path="/hoots/:hootId/edit"
                element={<HootForm handleUpdateHoot={handleUpdateHoot} />}
              />
            </>
          ) : (
            // Not protected
            <Route path="/" element={<Landing />} />
          )}
          <Route path="/signup" element={<SignupForm setUser={setUser} />} />
          <Route path="/signin" element={<SigninForm setUser={setUser} />} />
        </Routes>
      </AuthedUserContext.Provider>
    </>
  );
};

export default App;
