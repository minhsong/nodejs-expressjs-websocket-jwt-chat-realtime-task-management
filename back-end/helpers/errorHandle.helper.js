/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
exports.handleError = (res, err) => {
  // Prints error in console
  if (process.env.NODE_ENV === "development") {
    console.log(err);
  }
  // Sends error to user
  return res.status(err.code || err.statusCode || 504).json({
    errors: {
      msg: err.message,
    },
  });
};

/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
exports.buildErrObject = (code, message) => {
  return {
    code,
    message,
  };
};
