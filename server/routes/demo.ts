import { RequestHandler } from "express";

export const handleDemo: RequestHandler = (req, res) => {
  const response: { message: string } = {
    message: "Hello from Express server",
  };
  res.status(200).json(response);
};
