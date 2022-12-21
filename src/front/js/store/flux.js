const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      localToken: "",
      username: null,
      errorMessage: "",
      successMessage: "",
      logged: null,
      user_info: '',
      selectedList:'',
      userTodoLists:[],
    },
    actions: {
      setUserTodoLists:(userTodoLists) => {
        setStore({
          userTodoLists: userTodoLists
          })
      },
  
      setselectedList: (name) =>{
        setStore({
          selectedList: name
        })
      },
      //>>> todolist and todos actions related with backend
      // <<< todolist and todos actions related with backend
      fetchUser: async (token, username) => {  //this retrieves user info from the backend
		const store = getStore();
        const opts = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await fetch(
          `https://3001-4geeksacade-reactflaskh-sxrwtzv8epr.ws-eu79.gitpod.io/api/${username}`, opts);
		const data = await response.json();
		await setStore({ user_info: data })
    await console.log(data)
      },
      setLoggedIn: (logged) => {
        setStore({
          logged: logged,
        });
      },
      loginUser: async (email, password) => { //this is just for login and retrieve the access_token
        const store = getStore();
        console.log("Function called");
        const opts = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: `{
						"email": "${email}",
						"password": "${password}"
					}`,
        };
        const response = await fetch(
          "https://3001-4geeksacade-reactflaskh-sxrwtzv8epr.ws-eu79.gitpod.io/api/login",
          opts
        );
        const data = await response.json();

        await sessionStorage.setItem("token", data.access_token);

        await sessionStorage.setItem("username", data.username);

		await setStore({
			localToken: data.access_token,
			username: data.username,
			logged: true})
      },
      logOut: () => {}, //to be implemented
      signUp: async (username, email, password) => { //this is the signup
        const opts = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: `
						{"username": "${username}",
						"email": "${email}",
						"password": "${password}"
						}
					`,
        };
        try {
          const response = await fetch(
            "https://3001-4geeksacade-reactflaskh-sxrwtzv8epr.ws-eu79.gitpod.io/api/signup",
            opts
          );
          const data = await response.json();
          console.log(data);
          if (data.success) {
            setStore({
              successMessage: data.message,
            });
          } else {
            setStore({
              errorMessage: data.message,
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
        try {
          // fetching data from the backend
          const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
          const data = await resp.json();
          setStore({ message: data.message });
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
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
      },
    },
  };
};

export default getState;
