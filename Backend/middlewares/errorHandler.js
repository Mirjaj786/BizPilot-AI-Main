const ErrorHandler = (err, req, res, next) => {
  const statucCode = err.statucCode || 500;

  res.status(statucCode).json({
    success: false,
    statucCode,
    message: err.message || "Something went Worng!",
    errors: err.errors || [],
  });
};

export default ErrorHandler;
