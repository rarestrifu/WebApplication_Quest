import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AnimatedPage from "./AnimatedPage";
import { AnimatePresence } from "framer-motion";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [usernameValid, setUsernameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [dateOfBirthValid, setDateOfBirthValid] = useState(true);
  const [pickUserLogo, setPickUserLogo] = useState(false);

  const defaultAvatarURL = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
  const [userAvatarURL, setUserAvatarURL] = useState(defaultAvatarURL);


  const handleRegister = async (event) => {
    event.preventDefault();
    let data = {
      username: username,
      password: password,
      email: email,
      phoneNumber: phoneNumber,
      dateOfBirth: dateOfBirth,
      tokens: 0,
      rankingNumber: 4,
      rankingName: "Bronze",
      badgeURL: "Images/Bronze4.png",
      userIconURL: userAvatarURL,
      solvedQuestIds: null
    };

    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (regex.test(dateOfBirth)) {
      const year = parseInt(dateOfBirth.substring(0, 4));
      if (year >= 2023 || year<=1900) {
        setDateOfBirthValid(false);
      } else {
        setDateOfBirthValid(true);
      }
    } else {
      setDateOfBirthValid(false);
    }

    setUsernameValid(await axios.get("http://localhost:8080/account/usernameValid?username=" + username));
    setEmailValid(await axios.get("http://localhost:8080/account/emailValid?email=" + email));
    setPasswordValid(await axios.get("http://localhost:8080/account/passwordValid?password=" + password));
    setPhoneValid(await axios.get("http://localhost:8080/account/phoneValid?phone=" + phoneNumber));
    setUsernameTaken(await axios.get("http://localhost:8080/account/usernameTaken?username=" + username));
    setEmailTaken(await axios.get("http://localhost:8080/account/emailTaken?email=" + email));

    if (usernameTaken.data === true) {
      console.log("username is already taken")
    } else {
      if (emailTaken.data === true) {
        console.log("email is already taken")
      } else {
        if (dateOfBirthValid === false) {

        } else {
          axios.post("http://localhost:8080/account/signup", data)
            .then(response => {
              axios.get("http://localhost:8080/account/user?email=" + email)
                .then(response => {
                  if(data.userIconURL===null){
                    data.userIconURL=defaultAvatarURL;
                  }
                  const userData = response.data;
                  navigate("/user", { state: { user: userData } });
                })
            }).catch((error) => {
              if (error.response && error.response.status === 500) {
              }
            })
        }

      }

    }

  }

  const handleNavigate = () => {
    navigate("/login")
  }

  const logosPick = () => {
    let logos = [];
    let row = [];
    let logosPick = ["Images/chick.png", "Images/duck.png", "Images/gorilla.png"
      , "Images/narwhal.png", "Images/owl.png", "Images/whale.png"
      , "Images/parrot.png", "Images/penguin.png", "Images/sloth.png"];

    for (let i = 0; i < 9; i++) {
      row.push(
        <div className="mb-10 ml-3 mr-3">
          <img src={`${logosPick[i]}`}
            className="opacity-100 hover:opacity-50 cursor-pointer w-24 h-24 rounded-full shadow-lg mr-4 mb-4
          border border-yellow-100"
          onClick={() => {
            setUserAvatarURL(logosPick[i]);
            setPickUserLogo(false);
          }}
          />
        </div>
      );
      if (row.length === 3) {
        logos.push(
          <div className="flex justify-center">
            {row}
          </div>
        );
        row = [];
      }
    }
    if (row.length > 0) {
      logos.push(
        <div className="flex justify-center">
          {row}
        </div>
      );
    }
    return logos;
  }

  return (
    <div class=" h-screen">
      <div class="bg-cover bg-center bg-fixed w-screen"
        style={{
          backgroundImage: 'url("https://wallpapercave.com/wp/agLijth.jpg")',
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}>

        {!pickUserLogo && <AnimatePresence>
          <AnimatedPage>
            <div className="flex flex-col items-center justify-center h-screen">
              <form className="bg-slate-800 p-10 rounded-lg shadow-lg animate__animated opacity-80">
                <h2 className="text-3xl mb-4 font-extrabold text-center text-yellow-50">Create an account</h2>
                <div className="mb-4">
                  <img src={`${userAvatarURL}`}
                    className="opacity-100 hover:opacity-50 cursor-pointer w-24 h-24 rounded-full shadow-lg mr-4 mb-4"
                    onClick={() => {
                      setPickUserLogo(true);
                    }}
                    role="button" />
                  <label className="block text-yellow-50 font-bold mb-2" htmlFor="username">
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
                  {usernameValid.data === false && <div className="text-red-500 text-base text-ellipsis">Enter a valid username</div>}
                  {usernameTaken.data === true && <div className="text-red-500 text-base text-ellipsis">Username is already taken</div>}
                </div>
                <div className="mb-4">
                  <label className="block text-yellow-50 font-bold mb-2" htmlFor="password">
                    Password:
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-400 rounded-md animate-pulse"
                    placeholder="Enter your password"
                    id="password"
                    type="text"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  {passwordValid.data === false && <div className="text-red-500 text-base text-ellipsis">Password needs minimum 8 characters</div>}
                </div>
                <div className="mb-4">
                  <label className="block text-yellow-50 font-bold mb-2" htmlFor="email">
                    Email:
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-400 rounded-md animate-pulse"
                    placeholder="Enter your email"
                    id="email"
                    type="text"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  {emailValid.data === false && <div className="text-red-500 text-base">Enter a valid email address</div>}
                  {emailTaken.data === true && <div className="text-red-500 text-base">Email is already taken</div>}
                </div>
                <div className="mb-4">
                  <label className="block text-yellow-50 font-bold mb-2" htmlFor="phone">
                    Phone Number:
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-400 rounded-md animate-pulse"
                    placeholder="Enter your phone number"
                    id="phone"
                    type="text"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                  />
                  {phoneValid.data === false && <div className="text-red-500 text-base">Enter a valid phone number</div>}
                </div>
                <div className="mb-4">
                  <label className="block text-yellow-50 font-bold mb-2" htmlFor="dob">
                    Date of Birth:
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-400 rounded-md animate-pulse"
                    placeholder="Enter your date of birth"
                    id="dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(event) => setDateOfBirth(event.target.value)}
                  />
                  {dateOfBirthValid === false && <div className="text-red-500 text-base">Enter a valid date of birth</div>}
                </div>

                <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded  ml-10 mb-4" type="submit" onClick={handleRegister}>
                  Register
                </button>
                <button className="bg-blue-500 text-white font-bold py-2 px-2 rounded ml-10 mb-4 " type="submit" onClick={handleNavigate}>
                  Login
                </button>
              </form>
            </div>
          </AnimatedPage>
        </AnimatePresence>}
        {pickUserLogo &&
          <div class=" h-screen">
            <div class="bg-cover bg-center bg-fixed w-screen"
              style={{
                backgroundImage: 'url("https://wallpaperaccess.com/full/128756.jpg")',
                backgroundSize: "cover",
                backgroundAttachment: "fixed",
              }}>

              <AnimatePresence>
                <AnimatedPage>
                  <div className="flex flex-col items-center justify-center h-screen">
                    <form className="bg-slate-800 p-10 rounded-lg shadow-lg animate__animated ">
                      {logosPick()}
                      <button className="text-red-500 text-sm font-extralight "
                      onClick={()=>{
                        setUserAvatarURL(defaultAvatarURL)
                        setPickUserLogo(false)
                      }}>
                        Use default avatar</button>
                    </form>
                    
                  </div>
                  
                </AnimatedPage>
              </AnimatePresence>
            </div>
          </div>}
      </div>
    </div>
  );
}

export default Register;