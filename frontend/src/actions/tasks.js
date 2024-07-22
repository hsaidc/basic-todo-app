const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export const fetchTasksAction = async (filters) => {
  try {
    const endpoint = new URL("./tasks", REACT_APP_API_URL);

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      params.append(key, value);
    }

    endpoint.search = params.toString();

    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      console.log("Some error occured return status is: ", res.status);
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

export const addTaskAction = async (newTask) => {
  try {
    const endpoint = new URL("./tasks", REACT_APP_API_URL);

    let res = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(newTask),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Could not add task!");
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateTaskAction = async (updatedTask) => {
  try {
    const endpoint = new URL("./tasks", REACT_APP_API_URL);

    let res = await fetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(updatedTask),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Could not update task!");
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteTaskAction = async (taskKey) => {
  try {
    const endpoint = new URL("./tasks", REACT_APP_API_URL);

    let res = await fetch(endpoint, {
      method: "DELETE",
      body: JSON.stringify({ taskKey: taskKey }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Could not delete task!");
    }
  } catch (error) {
    console.log(error);
  }
};
