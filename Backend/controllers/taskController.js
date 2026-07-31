import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";
import AsyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import httpStatus from "http-status";

import Task from "../models/taskModel.js";

export const createTask = AsyncHandler(async (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;

  if (!title || !description || !priority || !status || !dueDate) {
    throw new ApiError(httpStatus.BAD_REQUEST, "All field are required!");
  }

  const newTask = await Task.create({
    owner: req.user._id,
    title: title.trim(),
    description: description.trim(),
    priority: priority,
    status: status,
    dueDate: dueDate,
  });

  return res.status(httpStatus.CREATED).json(
    new ApiResponse({
      success: true,
      message: "New task created successfully!",
      data: newTask,
    }),
  );
});

export const getAllTask = AsyncHandler(async (req, res) => {
  const tasks = await Task.find({
    owner: req.user._id,
  }).sort({ createdAt: -1 });

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      message: "All tasks fetched successfully!",
      data: tasks,
    }),
  );
});

export const getOneTask = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Task Id !");
  }

  const task = await Task.findById({
    _id: id,
    owner: ownerId,
  });

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task Not Found!");
  }

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      success: true,
      message: "Task fetched successfully!",
      data: task,
    }),
  );
});

export const updateTask = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user._id;

  const { title, description, priority, status, dueDate } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid task ID!");
  }

  const updatedTask = await Task.findOneAndUpdate(
    {
      _id: id,
      owner: ownerId,
    },
    {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!updatedTask) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task not found!");
  }

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      success: true,
      message: "Task updated successfully!",
      data: updatedTask,
    }),
  );
});

export const deleteTask = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid task ID!");
  }

  const deletedTask = await Task.findOneAndDelete({
    _id: id,
    owner: ownerId,
  });
  if (!deletedTask) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task not found!");
  }

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      success: true,
      message: "Task Delete Successfully!",
      data: deletedTask,
    }),
  );
});

export const searchTask = AsyncHandler(async (req, res) => {
  const { title, priority, status } = req.query;

  const filter = {
    owner: req.user._id,
    isDeleted: false,
  };

  if (title) {
    filter.title = {
      $regex: title,
      $options: "i",
    };
  }

  if (priority) {
    filter.priority = priority;
  }

  if (status) {
    filter.status = status;
  }

  const tasks = await Task.find(filter).sort({ createdAt: -1 });

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      success: true,
      message: "Tasks fetched successfully!",
      data: tasks,
    }),
  );
});
