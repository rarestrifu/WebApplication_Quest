import { AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AnimatedPage from "./AnimatedPage";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const QuestSolver = () => {

    const { state } = useLocation();
    const quest = state ? state.quest : null;
    const validatedUser = state ? state.user : null;
    const navigate = useNavigate();
    const [answer, setAnswer] = useState("");
    const [showError, setShowError] = useState(null);
    const [rankMessage, setRankMessage] = useState("")

    let currentRankName = "";
    let currentRankNumber = 0;
    let tokensGained = 0;
    let newRankNumber = 0;
    let newRankName = "";

    const handleAnswerChange = (event) => {
        setAnswer(event.target.value);
    };

    const handleAnswerSubmit = (event) => {
        event.preventDefault();
        if (quest != null && validatedUser != null) {
            let continueOperation = 1;
            if (quest.answer != answer) {
                setShowError(true);
                setRankMessage("");
            } else {
                if (quest.tokens_required > validatedUser.tokens) {

                    setShowError(true);
                    continueOperation = 0;
                }
                if (continueOperation == 1) {

                    setShowError(false);
                    currentRankName = validatedUser.rankingName;
                    currentRankNumber = validatedUser.rankingNumber;
                    tokensGained = quest.tokensGained;

                    if (currentRankName == "Gold" && currentRankNumber == 1) {

                    } else {
                        newRankName = currentRankName;
                        newRankNumber = currentRankNumber;

                        validatedUser.tokens = validatedUser.tokens + tokensGained;
                        switch (validatedUser.tokens) {
                            case 1:
                            case 2:
                                newRankName = "Bronze";
                                newRankNumber = 4;
                                validatedUser.badgeURL = "Images/Bronze4.png"
                                break;
                            case 3:
                            case 4:
                                newRankName = "Bronze";
                                newRankNumber = 3;
                                validatedUser.badgeURL = "Images/Bronze3.png"
                                break;
                            case 5:
                            case 6:
                                newRankName = "Bronze";
                                newRankNumber = 2;
                                validatedUser.badgeURL = "Images/Bronze2.png"
                                break;
                            case 7:
                            case 8:
                                newRankName = "Bronze";
                                newRankNumber = 1;
                                validatedUser.badgeURL = "Images/Bronze1.png"
                                break;
                            case 9:
                            case 10:
                                newRankName = "Silver";
                                newRankNumber = 4;
                                validatedUser.badgeURL = "Images/Silver4.png"
                                break;
                            case 11:
                            case 12:
                                newRankName = "Silver";
                                newRankNumber = 3;
                                validatedUser.badgeURL = "Images/Silver3.png"
                                break;
                            case 13:
                            case 14:
                                newRankName = "Silver";
                                newRankNumber = 2;
                                validatedUser.badgeURL = "Images/Silver2.png"
                                break;
                            case 15:
                            case 16:
                                newRankName = "Silver";
                                newRankNumber = 1;
                                validatedUser.badgeURL = "Images/Silver1.png"
                                break;
                            case 17:
                            case 18:
                                newRankName = "Gold";
                                newRankNumber = 4;
                                validatedUser.badgeURL = "Images/Gold4.png"
                                break;
                            case 18:
                            case 20:
                                newRankName = "Gold";
                                newRankNumber = 3;
                                validatedUser.badgeURL = "Images/Gold3.png"
                                break;
                            case 21:
                            case 22:
                                newRankName = "Gold";
                                newRankNumber = 2;
                                validatedUser.badgeURL = "Images/Gold2.png"
                                break;
                            case 23:
                            case 24:
                                newRankName = "Gold";
                                newRankNumber = 1;
                                validatedUser.badgeURL = "Images/Gold1.png"
                                break;
                            default:
                                newRankName = "Gold";
                                newRankNumber = 1;
                                validatedUser.badgeURL = "Images/Gold1.png"
                        }
                        axios.get("http://localhost:8080/account/user?username=" + validatedUser.username)
                            .then(response => {
                                let id = response.data.id;
                                if (validatedUser.solvedQuestIds === null) {
                                    validatedUser.solvedQuestIds = [];
                                }
                                validatedUser.solvedQuestIds.push(quest.id);
                                let updatedUser = {
                                    id: id,
                                    username: validatedUser.username,
                                    password: validatedUser.password,
                                    email: validatedUser.email,
                                    phoneNumber: validatedUser.phoneNumber,
                                    tokens: validatedUser.tokens,
                                    rankingNumber: newRankNumber,
                                    rankingName: newRankName,
                                    badgeURL: validatedUser.badgeURL,
                                    solvedQuestIds: validatedUser.solvedQuestIds,
                                    userIconURL: validatedUser.userIconURL,
                                    dateOfBirth: validatedUser.dateOfBirth
                                };

                                axios.put("http://localhost:8080/account/updateUser", updatedUser)
                                    .then((response) => {
                                        validatedUser.rankingName = newRankName;
                                        validatedUser.rankingNumber = newRankNumber;
                                        validatedUser.tokens = updatedUser.tokens;
                                        validatedUser.badgeURL = updatedUser.badgeURL;
                                        validatedUser.solvedQuestIds = updatedUser.solvedQuestIds;
                                    })
                                    .catch((error) => {
                                    });
                            }).catch(error => {
                            })
                    }
                }
            }
        };
    }


    return (
        <div
            className="h-screen bg-cover bg-center bg-fixed"
            style={{
                backgroundImage:
                    'url("https://images8.alphacoders.com/503/503792.jpg")',
            }}
        >
            {quest != null && <AnimatePresence>
                <AnimatedPage>
                    {(showError == null || showError == true) && (validatedUser.username != quest.username) &&
                        <div className="flex flex-col items-center justify-center h-screen font-sans bg-gradient-to-br">
                            <div className="w-96 h-140 bg-gray-800 rounded-lg shadow-lg p-8 animate__animated animate__fadeInUp opacity-80">
                                <h2 className="text-lg font-bold mb-4 text-white">{quest.name}</h2>
                                <p className="mb-4 text-white">{quest.description}</p>
                                <div className="mb-4">
                                    <label className="block font-bold mb-2 text-white">Answer:</label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        type="text"
                                        value={answer}
                                        onChange={handleAnswerChange}
                                    />
                                    {showError && quest.tokens_required <= validatedUser.tokens && <div className="text-red-500 mt-2">Wrong answer</div>}
                                    {showError && quest.tokens_required > validatedUser.tokens && <div className="text-red-500 mt-2">Not enough tokens</div>}
                                </div>

                                <div className="flex justify-center space-x-4">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transform hover:scale-110 transition duration-300 ease-in-out"
                                        onClick={handleAnswerSubmit}
                                    >
                                        Submit
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transform hover:scale-110 transition duration-300 ease-in-out"
                                        onClick={() => {
                                            navigate("/user", { state: { user: validatedUser } });
                                        }}
                                    >
                                        Go back
                                    </button>
                                </div>
                                <div className="mt-8">
                                    <div className="text-lg font-bold text-white flex justify-between items-center">
                                        <div>Quest proposed by:</div>
                                        <div className="text-teal-400">{quest.username}</div>
                                    </div>
                                    <div className="text-lg font-bold text-white flex justify-between items-center mt-2">
                                        <div>Minimum tokens required:</div>
                                        <div className="text-teal-400">{quest.tokens_required}</div>
                                    </div>
                                    <div className="text-lg font-bold text-white flex justify-between items-center mt-2">
                                        <div>You have:</div>
                                        <div className="text-teal-400">{validatedUser.tokens} tokens available</div>
                                    </div>
                                    <div className="text-lg font-bold text-white flex justify-between items-center mt-2">
                                        <div>Reward:</div>
                                        {quest.tokensGained > 1 && <div className="text-teal-400"> {quest.tokensGained} tokens </div>}
                                        {quest.tokensGained == 1 && <div className="text-teal-400">{quest.tokensGained} token</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {showError === false && (validatedUser.username != quest.username) && (
                        <div className="flex flex-col items-center justify-center h-screen font-sans">
                            <div className="w-96 h-140 bg-cyan-900 rounded-lg shadow-lg p-8">

                                <p className="text-2xl font-bold mb-4 text-white text-center">Congratulations! Your answer is correct.</p>
                                <p className="text-lg mb-4 text-white text-center"></p>
                                <div className="text-center">
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                                        onClick={() => {
                                            navigate("/user", { state: { user: validatedUser } });
                                        }}

                                    >
                                        Go back
                                    </button>
                                </div>
                            </div>
                        </div>

                    )}
                    {validatedUser.username == quest.username && (
                        <div className="flex flex-col items-center justify-center h-screen font-sans">
                            <div className="w-96 h-140 bg-cyan-900 rounded-lg shadow-lg p-8">

                                <p className="text-2xl font-bold mb-4 text-white text-center">You can't solve this quest since it is proposed by you.</p>

                                <div className="text-center">
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                                        onClick={() => {
                                            navigate("/user", { state: { user: validatedUser } });
                                        }}

                                    >
                                        Go back
                                    </button>
                                </div>
                            </div>
                        </div>

                    )}
                </AnimatedPage>
            </AnimatePresence>}
            {validatedUser===null &&<AnimatePresence>
            <AnimatedPage>
              <div className="flex flex-col items-center justify-center h-screen ">
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl  opacity-75">
                  <div className="md:flex">
                    <div className="md:flex-shrink-0">
                      <img className="h-48 w-full object-cover md:h-full md:w-48" src="https://img.icons8.com/color/512/restriction-shield.png" alt="Error" />
                    </div>
                    <div className="p-8">
                      <div className="uppercase tracking-wide text-lg text-red-600 font-bold">Access Forbidden</div>
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
          </AnimatePresence>}
        </div>
    );
};

export default QuestSolver;