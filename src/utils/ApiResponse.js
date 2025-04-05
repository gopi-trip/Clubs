//Standardized Response that will be sent to the frontend part
class ApiResponse {
    constructor(statusCode,data,message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }