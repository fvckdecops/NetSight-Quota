export async function HttpHandler(res, data) {
    let response = {
        code: 0,
        content: null,
        message: "Success"
    }
    if(!data) {
        response['message'] = "Data not available"
        return res.json(response)
    }

    response['content'] = data
    return res.json(response)
}