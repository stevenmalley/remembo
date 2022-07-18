export default async function fetcher(path,options) {
  path = "/api"+path;

  if (document.location.port === "3000")
    path = "http://localhost:8080"+path;
  
  return await fetch(path,options);
}
