import React, { useState } from "react";

const Task = ({ task, removeTask, updateTask }) => {
  const [onEditing, setOnEditing] = useState(false);
  const [text, setText] = useState(task.text);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let updatedTask = { ...task, text: text };

    await updateTask({ updatedTask: updatedTask });

    setText("");
    setOnEditing(false);
  };

  const handleDeleteTask = () => {
    removeTask(task.key);
  };

  const HandleMarkDone = async () => {
    let updatedTask = { ...task, status: !task.status };

    await updateTask({ updatedTask: updatedTask });
  };

  const handleUpdateTask = () => {
    setText(task.text);
    setOnEditing(true);
  };

  const cancelUpdateTask = () => {
    setOnEditing(false);
  };

  const date = new Date(task.date).toLocaleString();
  const lastUpdate = new Date(task.lastUpdate).toLocaleString();

  if (!onEditing) {
    return (
      <div
        className={`flex min-h-[80px] w-full flex-row items-start ${task.status ? "bg-primary-600 text-gray-50" : "bg-primary-100 text-gray-800"}`}
      >
        <div className="flex h-full flex-1 flex-col justify-between px-2 py-2">
          <div className="flex w-full text-wrap break-words text-sm leading-none md:text-base">
            {task.text}
          </div>
          <div className="mt-1 flex flex-row flex-wrap justify-start gap-x-2 gap-y-[-2px]">
            <div className="flex text-xs leading-none  ">Created: {date}</div>
            <div className="flex text-xs leading-none">
              {lastUpdate ? `Updated: ${lastUpdate}` : null}
            </div>
          </div>
        </div>
        <div className="flex h-full w-16 flex-col items-center justify-center text-gray-100">
          <div
            className={`flex h-1/2 w-full cursor-pointer items-center justify-center hover:scale-105 ${task.status ? "hidden" : "bg-primary-200"}`}
            onClick={handleUpdateTask}
          >
            <span>Update</span>
          </div>
          <div
            className={`flex h-1/2 w-full cursor-pointer items-center justify-center hover:scale-105 ${task.status ? "" : "bg-primary-600"}`}
            onClick={HandleMarkDone}
          >
            <span>Done</span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`flex min-h-[80px] w-full items-center justify-center ${task.status ? "bg-primary-600 text-gray-50" : "bg-primary-100 text-gray-800"}`}
      >
        <div className="flex h-full w-full flex-col items-center justify-center">
          <input
            className="h-3/5 w-full px-2 py-2 leading-tight text-gray-900 focus:outline-none"
            type="text"
            maxLength="100"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex w-full flex-1 flex-row text-gray-50">
            <button
              className={`flex h-full w-1/3 cursor-pointer items-center justify-center bg-primary-200 transition hover:scale-[1.02] hover:border-r-[1px] hover:border-white`}
              onClick={handleSubmit}
            >
              <span>Update</span>
            </button>
            <button
              className={`flex h-full flex-1 cursor-pointer items-center justify-center bg-primary-400 transition hover:scale-[1.02] hover:border-x-[1px] hover:border-white`}
              onClick={handleDeleteTask}
            >
              <span>Delete</span>
            </button>
            <button
              className={`flex h-full w-1/3 cursor-pointer items-center justify-center bg-primary-300 transition hover:scale-[1.02] hover:border-l-[1px] hover:border-white`}
              onClick={cancelUpdateTask}
            >
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default Task;
