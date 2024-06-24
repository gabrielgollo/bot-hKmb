class Exception extends Error {
  constructor(statusCode, message, statusMessage) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.statusMessage = statusMessage;
  }
}

module.exports = { Exception };
