import { RequestHandler } from "express";

export const getTodos: RequestHandler = async (req, res) => {
  res.status(200).json({ todos: [] });
};

export const createTodo: RequestHandler = async (req, res) => {
  res.status(200).json({ todos: [] });
};

export const updateTodo: RequestHandler = async (req, res) => {
  res.status(200).json({ todos: [] });
};

export const deleteTodo: RequestHandler = async (req, res) => {
  res.status(200).json({ todos: [] });
};
