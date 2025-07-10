import { Link } from "react-router";
import { useMyContext } from "../context/MyContext";

const Navbar = () => {
    const {user}= useMyContext();
    const {count} = useMyContext();
    console.log(user);
    return (
        <div className="py-4 px-6 flex justify-between bg-emerald-500">
            <div className="font-bold text-amber-300">Shopping App</div>
            <div className="flex gap-2">
                <input className="b-1 py-1 px-2 rounded-md" />
                <button className="b-1 py-1 px-2 rounded-md">Search</button>
            </div>
            <div className="flex gap-2">
                <Link to="/profile">Profile</Link>
                <Link to="/signup">Signup</Link>
                <p> value :{count} </p>
            </div>
        </div>
    );
};

export { Navbar };
