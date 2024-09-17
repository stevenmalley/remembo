export default async function fetcher(path,method,body) {
  path = "/api"+path;

  if (document.location.origin === "http://localhost:3000")
    path = "http://localhost:8080"+path;

  const options = {
    method: method,
    credentials:"include",
    headers: {"Content-Type":"application/json", "Connection": "keep-alive"},
    body: JSON.stringify(body)
  };
  
  return await fetch(path,options);
}
