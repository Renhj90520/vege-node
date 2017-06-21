function buildResult(message, body, state) {
    return { "message": message, "body": body, "state": state };
}

module.exports = buildResult;