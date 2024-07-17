export async function fetchGet(data) {
  let body = ''

  Object.keys(data.body).forEach((key, ind) => {
    if(key !== "sort") {
      body += ((ind === 0) ? '?' : '&') + key +'='+ data.body[key]
    } else {
      let sortKey = Object.keys(data.body[key])[0]
      let sortOrder = (data.body[key][sortKey] < 0) ? "-" : "+"

      body += ((ind === 0) ? '?' : '&') +"sort="+ sortOrder + sortKey
    }
  })

  const rawResponse = await fetch(data.url + body);
  
  const response = await rawResponse.json();

  if (!rawResponse.ok) {
    return { code: rawResponse.status, content: response }
  }

  return response
}