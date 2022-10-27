exports.generateResult = (isSuccess, response, error) => {
    return {Success : isSuccess, Response : response, Error : error}
}