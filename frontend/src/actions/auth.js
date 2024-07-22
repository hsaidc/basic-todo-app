const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export const resetPassword = async ({ password, token }) => {
  try {
    // Create endpoint
    const endpoint = new URL("./auth/reset-password", REACT_APP_API_URL);

    // Add token to query params
    const params = new URLSearchParams();
    params.append("token", token);

    // Add query params to endpoint
    endpoint.search = params.toString();

    let res = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ password: password }),
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
export const initiatePasswordReset = async (userData) => {
  try {
    const endpoint = new URL(
      "./auth/initiate-password-reset",
      REACT_APP_API_URL,
    );

    let res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const registerUser = async (userData) => {
  try {
    const endpoint = new URL("./auth/register", REACT_APP_API_URL);

    let res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const login = async (credentials) => {
  try {
    const endpoint = new URL("./auth/login", REACT_APP_API_URL);

    let res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(credentials),
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const authenticateUser = async (token) => {
  try {
    const res = await fetch(REACT_APP_API_URL + "auth/verify-token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
};
