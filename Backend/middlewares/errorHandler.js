const ErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Something went wrong!",
    errors: err.errors || [],
  });
};

export default ErrorHandler;
