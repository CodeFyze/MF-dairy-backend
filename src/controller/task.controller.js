import { TopologyDescriptionChangedEvent } from "mongodb";
import { Task } from "../models/task.model.js";
import { ApiError } from "../utlis/ApiError.js";

const addTask = async (req, res, next) => {
  const { description, assignedTo, createdAt, dueDate } = req.body;

  if (
    [description, assignedTo, createdAt, dueDate].some(
      (item) => item.trim() == ""
    )
  ) {
    return next(new ApiError(400, "All fields are required"));
  }

  try {
    const task = await Task.create({
      description,
      assignedTo,
      createdAt,
      dueDate,
      dairyFarmId: req.user.dairyFarmId,
    });

    if (!task) {
      return next(new ApiError(400, "error occur while creating task"));
    }

    res
      .status(201)
      .json({ success: true, message: "Task created successfully" });
  } catch (error) {
    next(error);
  }
};

const getTaskByUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const tasks = await Task.find({ assignedTo: userId });

    if (!tasks) {
      return next(new ApiError(400, "task not found "));
    }

    res
      .status(200)
      .json({ success: true, message: "Successfully get user task", tasks });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.aggregate([
      {
        $match: { dairyFarmId: req.user.dairyFarmId },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedTo",
        },
      },

      {
        $addFields: {
            assignedTo: { $arrayElemAt: ["$assignedTo", 0] },
        },
      },
      {
        $project: {
          description: 1,
       
          createdAt: 1,
          dueDate: 1,
          taskStatus: 1,
          assignedTo: { name: "$assignedTo.name", email: "$assignedTo.email", _id: "$assignedTo._id" },
        },
      },
    ]);
    if (!tasks) {
      return next(new ApiError(400, "Tasks not found "));
    }
    res
      .status(200)
      .json({ success: true, message: "Successfully get all tasks", tasks });
  } catch (error) {
    next(error);
  }
};

const getMonthlyTasks = async (req, res, next) => {
  let { month } = req.params;

  month = month.slice(0, 3);

  const tasks = await Task.aggregate([
    {
      $match: {
        $and: [
          { createdAt: { $regex: month, $options: "i" } },
          { dairyFarmId: req.user.dairyFarmId },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
      },
    },

    {
      $addFields: {
        assignedTo: { $arrayElemAt: ["$assignedTo", 0] },
      },
    }
  ]);

  if (!tasks) {
    return next(new ApiError(400, "Tasks not found "));
  }

  res
    .status(200)
    .json({ success: true, message: "Successfully get monthly tasks", tasks });
};

const ToggleTaskStatus = async (req, res, next) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return next(new ApiError(400, "Task not found"));
    }
    task.taskStatus = !task.taskStatus;
  await task.save();
    res
      .status(200)
      .json({ success: true, message: "successfully Toggle Task" });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  const { taskId } = req.params;

  try {
    const task = await Task.deleteOne({ _id: taskId });

    if (!task) {
      return next(new ApiError(400, "Error Occur while deleting task"));
    }

    res
      .status(200)
      .json({ success: true, message: "successfully Delete Task" });
  } catch (error) {
    next(error);
  }
};
export {
  addTask,
  getTaskByUserId,
  getTasks,
  getMonthlyTasks,
  deleteTask,
  ToggleTaskStatus,
};
