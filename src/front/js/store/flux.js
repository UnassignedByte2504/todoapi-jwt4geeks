const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			errorMessage: '',
			successMessage:'',
			logged: null,
			user: {},
		},
		actions: {
			setLoggedIn: (logged) => {
				setStore({
					logged: logged
				})},
			loginUser: async (email, password) => {
				const store = getStore();
				console.log("Function called")
				const opts ={
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'},
					body:`{
						"email": "${email}",
						"password": "${password}"
					}`
			}
				console.log(opts)
					 await fetch('https://3001-4geeksacade-reactflaskh-sxrwtzv8epr.ws-eu79.gitpod.io/api/login', opts)
					 .then((response) => response.json())
					 .then((response) => response.access_token ? sessionStorage.setItem('token', response.access_token) && setStore({logged:true}) : null)
					 .catch((error) => alert(error));

					 await console.log(store.logged)
			},
			logout: () => {
			},
			signUp: async (username, email, password) => { 
				const opts = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: `
						{"username": "${username}",
						"email": "${email}",
						"password": "${password}"
						}
					`
				}
				try {
				const response = await fetch("https://3001-4geeksacade-reactflaskh-sxrwtzv8epr.ws-eu79.gitpod.io/api/signup",
				 opts)
				 const data = await response.json();
				 console.log(data);
				 if(data.success) {
					 setStore({
						 successMessage: data.message
					 });
				 } else {
					 setStore({
						 errorMessage: data.message
					 });
				 }
				} catch (error) {
					console.log(error);
				}
			},
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
