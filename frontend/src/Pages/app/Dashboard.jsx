import React from "react";
import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { useDebounce } from "use-debounce";

import Task from "../../components/Tasks/Task";
import DownArrow from "../../components/icons/DownArrow";
import UpArrow from "../../components/icons/UpArrow";
import ListOpen from "../../components/icons/ListOpen";
import ListClosed from "../../components/icons/ListClosed";

import {
  fetchTasksAction,
  addTaskAction,
  updateTaskAction,
  deleteTaskAction,
} from "../../actions/tasks";

const Dashboard = ({ userID }) => {
  const [text, setText] = useState("");
  const [searchText, setSearchText] = useState("");
  // const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  const [debouncedSearchText] = useDebounce(searchText, 300);

  const [sortCompleted, setSortCompleted] = useState("asc");
  const [sortOpen, setSortOpen] = useState("asc");
  const [toggleCompleted, setToggleCompleted] = useState(true);
  const [toggleOpen, setToggleOpen] = useState(true);

  const [completedTasks, setCompletedTasks] = useState([]);
  const [openTasks, setOpenTasks] = useState([]);

  const [isLoading, setIsLoading] = useState([true]);
  const [isUpdate, setIsUpdate] = useState(true);

  // Refetch tasks if there is any update or any filtering word is entered.
  useEffect(() => {
    setIsLoading(true);

    const fetchCompletedTasks = async () => {
      try {
        let compeltedTaskFilters = {
          status: true,
          search: debouncedSearchText,
        };
        const res = await fetchTasksAction(compeltedTaskFilters);

        if (res.status === true && res.data) {
          let completedSortedTasks = res.data.toSorted((a, b) =>
            sortCompleted === "asc"
              ? new Date(a.date) - new Date(b.date)
              : new Date(b.date) - new Date(a.date),
          );

          setCompletedTasks(completedSortedTasks);
        } else {
          setCompletedTasks([]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const fetchOpenTasks = async () => {
      try {
        let openTaskFilters = { status: false, search: debouncedSearchText };

        const res = await fetchTasksAction(openTaskFilters);

        if (res.status === true && res.data) {
          let openSortedTasks = res.data.toSorted((a, b) =>
            sortOpen === "asc"
              ? new Date(a.date) - new Date(b.date)
              : new Date(b.date) - new Date(a.date),
          );

          setOpenTasks(openSortedTasks);
        } else {
          setOpenTasks([]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchCompletedTasks();
    fetchOpenTasks();

    setIsLoading(false);
  }, [isUpdate, debouncedSearchText, userID, sortCompleted, sortOpen]);

  const handleSearch = async (event) => {
    setSearchText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const taskKey = uuid();
    const taskDate = new Date();
    const lastUpdate = taskDate;

    // Construct task
    const newTask = {
      key: taskKey,
      date: taskDate,
      text: text,
      lastUpdate: lastUpdate,
      userID: userID.replaceAll('"', ""),
    };

    await handleAddTask(newTask);
    setText("");
  };

  const handleAddTask = async (newTask) => {
    try {
      await addTaskAction(newTask);
      setIsUpdate((prevIsUpdate) => !prevIsUpdate);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateTask = async ({ updatedTask }) => {
    try {
      const lastUpdate = new Date();
      updatedTask.lastUpdate = lastUpdate;

      await updateTaskAction(updatedTask);

      setIsUpdate((prevIsUpdate) => !prevIsUpdate);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = async (taskKey) => {
    try {
      await deleteTaskAction(taskKey);
      setIsUpdate((prevIsUpdate) => !prevIsUpdate);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSortCompletedChange = async () => {
    if (sortCompleted === "desc") {
      setSortCompleted("asc");
    } else {
      setSortCompleted("desc");
    }
  };

  const handleSortOpenChange = async () => {
    if (sortOpen === "desc") {
      setSortOpen("asc");
    } else {
      setSortOpen("desc");
    }
  };

  const handleToggleOpen = () => {
    setToggleOpen((prevIsUpdate) => !prevIsUpdate);
  };

  const handleToggleCompleted = () => {
    setToggleCompleted((prevIsUpdate) => !prevIsUpdate);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-start px-1">
      <div className="mb-3 flex h-10 w-full items-center">
        <form
          className="flex h-full w-full flex-row items-center gap-x-2 px-1 sm:px-2"
          onSubmit={handleSubmit}
        >
          <input
            className="bg-primary-50 h-full w-full rounded border px-2 py-2 leading-tight text-gray-800 focus:outline-none"
            placeholder="Write your task/note here!"
            value={text}
            maxLength="100"
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="h-full w-32 rounded bg-gray-50 font-semibold text-gray-800 transition hover:scale-[1.02]"
            type="submit"
          >
            Add Task
          </button>
        </form>
      </div>
      <div className="mb-1 flex w-[95%] flex-row justify-start gap-x-1">
        <input
          className="bg-primary-50 w-full rounded border px-2 py-2 leading-tight text-gray-800 focus:outline-none"
          type="text"
          maxLength="30"
          placeholder="Search through your tasks/notes..."
          onChange={handleSearch}
          value={searchText}
        />
      </div>
      <div className="my-2 flex w-full flex-col items-center justify-center gap-y-2">
        <div className="justift-center flex w-full flex-col items-center gap-y-2">
          <div className="flex h-8 w-full items-center justify-start px-2">
            <div className="flex h-full w-full flex-row items-center justify-start">
              <div
                className="flex h-8 w-fit cursor-pointer items-center justify-center"
                onClick={handleToggleOpen}
              >
                {toggleOpen ? <ListOpen /> : <ListClosed />}
              </div>
              <span className="ml-2 text-xl font-bold">Open</span>
            </div>
            <div
              className={`${toggleOpen ? "flex" : "hidden"} h-8 w-fit cursor-pointer items-center justify-center`}
              onClick={handleSortOpenChange}
            >
              {sortOpen === "desc" ? <DownArrow /> : <UpArrow />}
            </div>
          </div>
          <div
            className={`${toggleOpen ? "flex" : "hidden"} h-fit max-h-[340px] min-h-[80px] w-[95%] flex-col gap-y-2 overflow-y-auto pr-2`}
          >
            {isLoading ? null : (
              <>
                {openTasks.map((task) => (
                  <Task
                    key={task.key}
                    task={task}
                    removeTask={handleDeleteTask}
                    updateTask={handleUpdateTask}
                  />
                ))}
              </>
            )}
          </div>
        </div>

        <div className="justift-center flex w-full flex-col items-center gap-y-2">
          <div className="flex h-8 w-full items-center justify-start px-2">
            <div className="flex h-full w-full flex-row items-center justify-start">
              <div
                className="flex h-8 w-fit cursor-pointer items-center justify-center"
                onClick={handleToggleCompleted}
              >
                {toggleCompleted ? <ListOpen /> : <ListClosed />}
              </div>
              <span className="ml-2 text-xl font-bold">Completed</span>
            </div>
            <div
              className={`${toggleCompleted ? "flex" : "hidden"} h-8 w-fit cursor-pointer items-center justify-center`}
              onClick={handleSortCompletedChange}
            >
              {sortCompleted === "desc" ? <DownArrow /> : <UpArrow />}
            </div>
          </div>

          <div
            className={`mb-2 ${toggleCompleted ? "flex" : "hidden"} h-fit max-h-[340px] min-h-[80px] w-[95%] flex-col gap-y-2 overflow-y-auto rounded pr-2`}
          >
            {isLoading ? null : (
              <>
                {completedTasks.map((task) => (
                  <Task
                    key={task.key}
                    task={task}
                    removeTask={handleDeleteTask}
                    updateTask={handleUpdateTask}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
