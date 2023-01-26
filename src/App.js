import "./App.css";
import Header from "./components/header/Header";
import SignIn from "./components/auth/signIn/SignIn";
import Music from "./components/music/Music";

function App() {
  return (
    <>
      <SignIn />
      <Header />
      <Music />
    </>
  );
}

export default App;
