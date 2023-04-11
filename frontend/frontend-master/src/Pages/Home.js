import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home(){
    const navigate = useNavigate();
    

    const handleNavigateAdmin = async (event) => {
        axios.get("http://localhost:8080/account/admin",{withCredentials: true})
            .then(response => {
                if(response.status === 200)
                    navigate("/admin");
        })
    }

    const handleLogout = async (event) => {
        axios.get("http://localhost:8080/logout", {withCredentials: true})
        .then(response => {
            if(response.status === 200)
                navigate("/login")
        })
    }

    return(
        <div>
            <h1>ESTI LOGAT!</h1>
            <button type = 'submit' onClick = {handleNavigateAdmin}>Admin</button>
            <br/>
            <button type = 'submit' onClick = {handleLogout}>Logout</button>
        </div>
    );
}

export default Home