import { AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AnimatedPage from "./AnimatedPage";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const QuestCreator = () => {

    const navigate = useNavigate();
    const [name, setName] = useState("")
    const [answer, setAnswer] = useState("")
    const [description, setDescription] = useState("")
    const [tokensRequired, setTokensRequired] = useState(0)
    const [tokensGained, setTokensGained] = useState(0)
    const [submitHovered, setSubmitHovered] = useState("");
    const [nameError, setNameError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [answerError, setAnswerError] = useState("")
    const [tokensGainedError, setTokensGainedError] = useState("");
    const [tokensRequiredError, setTokensRequiredError] = useState("");
    const { state } = useLocation();
    const validatedUser = state ? state.user : null;


    const handleAnswerSubmit = async (event) => {
        if (validatedUser != null) {

            event.preventDefault();

            if (name === "") {
                setNameError("Please provide a name for the quest.");
            } else {
                setNameError("");
            }

            if (description === "") {
                setDescriptionError("Please provide a description for the quest.");
            } else {
                setDescriptionError("");
            }

            if (answer === "") {
                setAnswerError("Please provide an answer for the quest.");
            } else {
                setAnswerError("");
            }

            if (tokensGained <= 0) {
                setTokensGainedError("Tokens gained by the solver must be a positive integer.");
            } else if (tokensGained > validatedUser.tokens) {
                setTokensGainedError("You can't give away more tokens than you have.");
            }
            else {
                setTokensGainedError("");
            }

            if (tokensRequired <= 0) {
                setTokensRequiredError("Tokens required must be a positive integer.");
            } else if (tokensRequired < tokensGained) {
                setTokensRequiredError("You can't request less than you give.");
            }
            else {
                setTokensRequiredError("");
            }

            if (nameError == "" && descriptionError == "" && answerError == "" && tokensGainedError == "" && tokensRequiredError == "") {
                let questModel = {
                    name: name,
                    description: description,
                    username: validatedUser.username,
                    answer: answer,
                    tokens_required: tokensRequired,
                    tokensGained: tokensGained
                }
                await axios.post("http://localhost:8080/Quests/addQuest", questModel)
                    .then(response => {
                        navigate("/user", { state: { user: validatedUser } });
                    }).catch(error => {
                    })
            }
        }
    }

    return (
        <div
            className="h-screen bg-cover bg-center bg-fixed"
            style={{
                backgroundImage:
                    'url("https://wallpaperaccess.com/full/1124099.jpg")',
                backgroundSize: "100%"
            }}
        >
            {validatedUser!=null && <AnimatePresence>
                <AnimatedPage>
                    <div className="flex flex-col items-center justify-center ">
                        <form className="bg-slate-800 p-10 rounded-lg shadow-lg animate__animated flex flex-col justify-center opacity-80">
                            <div>
                                <h2 className="text-3xl mb-4 font-extrabold text-center text-yellow-50 ">Add a quest</h2>
                                <div className="text-white mb-5">Tokens available: {validatedUser.tokens}</div>
                            </div>

                            <div className="">
                                <label className="block text-yellow-50 font-bold mb-2" htmlFor="name">
                                    Name:
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-400 rounded-md animate-pulse"
                                    placeholder="Enter the name of your quest"
                                    id="name"
                                    type="text"
                                    onChange={(event) => setName(event.target.value)}
                                />
                                {nameError !== "" && <div className="text-red-500 text-base mt-1">{nameError}</div>}
                            </div>
                            <div className="">
                                <label className="block text-yellow-50 font-bold mb-2" >
                                    Description:
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-400 rounded-md animate-pulse"
                                    placeholder="Enter the description of your quest"
                                    id="name"
                                    type="text"
                                    onChange={(event) => setDescription(event.target.value)}
                                />
                                {descriptionError !== "" && <div className="text-red-500 text-base mt-1">{descriptionError}</div>}
                            </div>
                            <div className="">
                                <label className="block text-yellow-50 font-bold mb-2" >
                                    Answer:
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-400 rounded-md animate-pulse"
                                    placeholder="The answer of the quest"
                                    id="name"
                                    type="text"
                                    onChange={(event) => setAnswer(event.target.value)}
                                />
                                {answerError !== "" && <div className="text-red-500 text-base mt-1">{answerError}</div>}
                            </div>
                            <div className="">
                                <label className="block text-yellow-50 font-bold mb-2" >
                                    Tokens required to access this quest:
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-400 rounded-md animate-pulse"
                                    placeholder="Minimum number of tokens the solving player needs"
                                    id="name"
                                    type="text"
                                    onChange={(event) => setTokensRequired(event.target.value)}
                                />
                                {tokensRequiredError !== "" && <div className="text-red-500 text-base mt-1">{tokensRequiredError}</div>}
                            </div>
                            <div className="">
                                <label className="block text-yellow-50 font-bold mb-2" >
                                    Tokens Rewarded:
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-400 rounded-md animate-pulse"
                                    placeholder="Tokens awarded to the solver"
                                    id="name"
                                    type="text"
                                    onChange={(event) => setTokensGained(event.target.value)}
                                />
                                {tokensGainedError !== "" && <div className="text-red-500 text-base mt-1">{tokensGainedError}</div>}
                            </div>

                            <div className="text-white mt-7">
                                Please put a valid name, a valid description and the answer you are requesting should be the correct answer of your quest.
                            </div>
                            <div className="flex justify-center">
                                <button className={`${submitHovered ? "bg-blue-300" : "bg-blue-700"} text-white w-24 h-10 rounded-xl shadow-lg mr-4 mt-6`}
                                    onMouseEnter={() => { setSubmitHovered(true) }}
                                    onMouseLeave={() => { setSubmitHovered(false) }}
                                    onClick={handleAnswerSubmit}
                                >Submit</button>
                                <button className="bg-red-500 hover:bg-red-200  text-white w-24 h-10 rounded-xl shadow-lg mr-4 mt-6"
                                    onClick={() => {
                                        navigate("/user", { state: { user: validatedUser } });
                                    }}
                                >Go back</button>
                            </div>


                        </form>
                    </div>
                </AnimatedPage>
            </AnimatePresence>}

            {validatedUser==null && <AnimatePresence>
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
    )
}

export default QuestCreator;