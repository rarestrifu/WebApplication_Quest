import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AnimatedPage from "./AnimatedPage";
import { AnimatePresence } from "framer-motion";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);
  const [usernameNull, setUsernameNull] = useState(false);
  const [showErrorUsername, setShowErrorUsername] = useState(false);
  const [showErrorPassword, setShowErrorPassword] = useState(false);
  const [validatedUser, setValidatedUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/account/usernameTaken?username=" + username)
      .then(response => {
        setUsernameValid(response.data);
      })
      .catch(error => {
        setUsernameValid(false);
      });

  }, [username]);
  useEffect(() => {
    if (usernameValid) {
      axios.get(`http://localhost:8080/account/isUsernamesPassword?username=${username}&password=${password}`)
        .then(response => {
          axios.get("http://localhost:8080/account/getUserByUsername?username=" + username)
            .then(response => {
              setPasswordValid(true);
              setValidatedUser(response.data)
            })
            .catch(error => {
              setPasswordValid(false);
            })
        }).catch(error => {
          setPasswordValid(false);
        })
    }
  }, [password]);

  const handleSubmit = async (event) => {

    if (username == "") {
      setUsernameNull(true)
    } else {
      setUsernameNull(false)
    }
  }

  const handleNavigate = () => {
    navigate("/register")
  }

  const handleClick = (event) => {
    setShowErrorUsername(!usernameValid);
    setShowErrorPassword(!passwordValid)
    if (usernameValid && passwordValid) {
      navigate("/user", { state: { user: validatedUser } });
    }
  }

  const onClick = () => {
    handleSubmit();
    handleClick();
  }

  return (
    <div class=" h-screen">
      <div class="bg-cover bg-center bg-fixed w-screen"
        style={{
          backgroundImage: 'url("https://images.hdqwalls.com/download/moon-fox-galaxy-4k-79-1920x1080.jpg")',
          backgroundSize: "1920x1080",
          backgroundAttachment: "fixed",

        }}>
        <AnimatePresence>
          <AnimatedPage>
            <div className="flex flex-col items-center justify-center h-screen font-sans">
              <form className="bg-slate-900 p-10 rounded-lg shadow-md animate__animated animate__fadeIn opacity-75">
                <h2 className="text-4xl font-bold mb-6 text-center text-white">Login</h2>
                <div className="mb-6">
                  <label className="block text-white font-bold mb-2" htmlFor="username">
                    Username:
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-400 rounded-md animate-pulse"
                    placeholder="Enter your username"
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                  {showErrorUsername && usernameNull && <div className="text-red-500 text-base text-ellipsis">Enter a valid username</div>}
                  {showErrorUsername && !usernameNull && <div className="text-red-500 text-base text-ellipsis">No username found</div>}

                </div>
                <div className="mb-6">
                  <label className="block text-white font-bold mb-2" htmlFor="password">
                    Password:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline animate-pulse"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  {showErrorPassword && <div className="text-red-500 text-base text-ellipsis">Wrong password</div>}
                </div>
                <div className="flex justify-between items-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline animate__animated animate__bounce"
                    type="button"
                    onClick={onClick}
                  >
                    Login
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline animate__animated animate__bounce"
                    type="button"
                    onClick={handleNavigate}
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </AnimatedPage>
        </AnimatePresence>
      </div>
    </div>

  );
}

export default Login;