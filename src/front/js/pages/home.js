import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	console.log(store.logged)
	return (
		<div className="text-center mt-5">
				<h1>Todo + API + JWT</h1>
		</div>
	);
};
