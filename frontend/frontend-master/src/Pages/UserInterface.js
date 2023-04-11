import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AnimatedPage from "./AnimatedPage";
import { AnimatePresence } from "framer-motion";

function UserInterface() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [quests, setQuests] = useState([]);
  const [showQuest, setShowQuest] = useState(false);
  const [bgPosition, setBgPosition] = useState(0);
  const [leaderboardUsers, setLeaderboardUsers] = useState({});
  const user = state ? state.user : null;
  const [completedMessage, setCompletedMessage] = useState("");
  const [solvedQuestIds, setSolvedQuestIds] = useState([]);

  async function fetchSortUsers() {
    const response = await axios.get("http://localhost:8080/account/leaderboard")
    return response.data;
  }

  useEffect(() => {
    if (user !== null) {
      axios.get("http://localhost:8080/account/solved-quests?username=" + user.username)
        .then(response => {
          setSolvedQuestIds(response.data)
        }).catch(error => {
        })
    }
  })

  useEffect(() => {
    if (user !== null) {
      axios.get("http://localhost:8080/Quests/displayAll")
        .then(response => {
          if (user.username != response.data.username) {
            setQuests(response.data);
          }
        })
        .catch(error => {
        });
    }
  }, []);
  useEffect(() => {
    if (user !== null) {
      fetchSortUsers()
        .then(data => {
          setLeaderboardUsers(data);
        })
        .catch(error => {
        });
    }
  }, []);
  useEffect(() => {
    if (user !== null) {
    const handleScroll = () => {
      setBgPosition(-window.pageYOffset / 2);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);}
  }, []);

  const handleNavigate = () => {
    navigate("/login")
  }

  const renderLeaderboard = () => {

    if (!leaderboardUsers == leaderboardUsers.length === 0) {
      return <p>No users registered yet.</p>
    }
    let groupedLeaderboard = [];
    for (let i = 0; i < leaderboardUsers.length; i++) {
      const leaderboardUser = leaderboardUsers[i];
      groupedLeaderboard.push(
        <div className="p-4 rounded-xl font-bold shadow-md mb-4 mx-4 my-4 text-white 
        bg-gradient-to-bl from-red-700 to-blue-800">
          <div className="flex items-center justify-between">
            <img src={`${leaderboardUser.userIconURL}`} width="24" height="24" className='mr-3 rounded-full' />
            <span className="text-lg font-bold mr-2">{i + 1}. {leaderboardUser.username}:</span>
            <span className="text-base font-normal ">{leaderboardUser.tokens} tokens acquired</span>
          </div>
        </div>
      )
    }

    return groupedLeaderboard;
  }

  const renderQuests = () => {
    if (!quests || quests.length === 0) {
      return <p>No quests available.</p>;
    }
    const groupedQuests = [];
    let row = [];
    for (let i = 0; i < quests.length; i++) {
      const quest = quests[i];
      row.push(
        <div
          className={`p-4 rounded-md font-bold shadow-md mb-4 mx-4 my-4 cursor-pointer ${showQuest === quest.id ? (user.solvedQuestIds !== null ?
            (!user.solvedQuestIds.includes(quest.id) ? "bg-red-600" : "bg-green-500") : "bg-red-600") : "bg-blue-600"}`}
          key={quest.id}
          onMouseEnter={() => {
            if (user.solvedQuestIds !== null) {
              if (user.solvedQuestIds.includes(quest.id)) {
                setCompletedMessage("Quest already completed")
                setShowQuest(quest.id)
              } else {
                setCompletedMessage("Click to access quest")
                setShowQuest(quest.id)
              }
            }
            if (user.solvedQuestIds === null) {
              setShowQuest(quest.id)
              setCompletedMessage("Click to access quest")
            }
          }}
          onMouseLeave={() => setShowQuest(null)}

          onClick={() => {
            if (user.solvedQuestIds === null) {
              navigate("/questSolver", { state: { quest, user } });
            }
            else if (user.solvedQuestIds.includes(quest.id)) {
            } else {
              navigate("/questSolver", { state: { quest, user } });
            }


          }}
        >
          {quest.name}
        </div>

      );
      if (row.length === 3 || i === quests.length - 1) {
        groupedQuests.push(
          <div className="flex justify-center" key={groupedQuests.length}>
            {row}
          </div>
        );
        row = [];
      }
    }

    return (
      <>
        {groupedQuests}
        {showQuest && <QuestPopup quest={showQuest} />}
      </>
    );
  };

  const QuestPopup = ({ quest }) => {
    return (
      <button class="py-1 px-2 capitalize bg-red-500 text-white rounded-lg border focus:outline-none
      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        {completedMessage}
      </button>

    );
  };

  const addQuest = () => {
    navigate("/questCreator", { state: { user } });
  }

  return (
    <div class="bg-cover "
      style={{
        backgroundImage: 'url("https://w0.peakpx.com/wallpaper/551/690/HD-wallpaper-space-vertical-nebula-portrait-display-astronomy-universe.jpg")',
        backgroundPosition: `center ${bgPosition}px`,
        backgroundSize: "100% ",
        backgroundAttachment: "fixed",

      }}>
      {state != null && <AnimatePresence >
        <AnimatedPage >
          <div className={`grid grid-rows-3  ease-in-out transition-opacity duration-500`}>

            <div className={`flex flex-col items-center justify-center h-screen `}>
              <div className="bg-gray-900 p-10 rounded-lg shadow-md opacity-75">
                <h1 className="text-3xl font-bold text-white mb-4">Welcome, {user.username}!</h1>
                <div className="flex items-center justify-center mb-8">
                  <img src={`${user.userIconURL}`} alt="User Avatar" className="w-24 h-24 rounded-full shadow-lg mr-4" />
                  <div>
                    <p className="text-lg text-gray-400 mb-1">Your email is</p>
                    <p className="text-lg text-white mb-4">{user.email}</p>
                    <p className="text-lg text-gray-400 mb-1">Your phone number is</p>
                    <p className="text-lg text-white mb-4">{user.phoneNumber}</p>
                    <p className="text-lg text-gray-400 mb-1">Tokens available</p>
                    <p className="text-lg text-white mb-4">{user.tokens}</p>
                    <p className="text-lg text-gray-400 mb-1">Ranking</p>
                    <div className="flex items-center">
                      <p className="text-lg text-white  mr-5">{user.rankingName} {user.rankingNumber}</p>
                      <img src={user.badgeURL} width="40" height="20"
                        className={`rounded-full border  mr-2`} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full mr-4" type="submit" onClick={handleNavigate}>Logout</button>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full" type="submit" onClick={addQuest}>Add quest</button>
                </div>
              </div>
            </div>

            <div className="h-screen flex items-center justify-center">
              <div className=" flex flex-col justify-center items-center h-screen">
                <div className="bg-gray-900 p-4 rounded-md shadow-md ml-auto  opacity-75">
                  <div className="text-center">
                    <p className="text-lg text-gray-50 font-extrabold outline-5 outline-red-900">Available Quests</p>
                    {renderQuests()}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-screen flex items-center justify-center">
              <div className=" flex flex-col justify-center items-center h-screen">
                <div className="bg-gray-900 p-4 rounded-md shadow-md ml-auto  opacity-75">
                  <div className="text-center">
                    <p className="text-lg text-gray-50 font-extrabold outline-5 outline-red-900">Leaderboard</p>
                    {renderLeaderboard()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedPage>
      </AnimatePresence>}
      {state == null &&
        <div class="bg-cover "
          style={{
            backgroundImage: 'url("https://wallpaper.dog/large/10761309.jpg")',
            backgroundPosition: `center ${bgPosition}px`,
            backgroundSize: "cover",
            backgroundAttachment: "fixed",

          }}>
          <AnimatePresence>
            <AnimatedPage>
              <div className="flex flex-col items-center justify-center h-screen ">
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl  opacity-75">
                  <div className="md:flex">
                    <div className="md:flex-shrink-0">
                      <img className="h-48 w-full object-cover md:h-full md:w-48" src="https://img.icons8.com/color/512/restriction-shield.png" alt="Error" />
                    </div>
                    <div className="p-8">
                      <div className="uppercase tracking-wide text-lg text-red-600 font-bold">Access Forbidden</div>
                      <h2 className="mt-2 text-2xl font-extrabold text-gray-900">Please log in or register first</h2>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none focus:shadow-outline"
                        onClick={() => navigate("/login")}
                      >
                        Back to Login
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedPage>
          </AnimatePresence>
        </div>}
    </div>

  );
}

export default UserInterface;