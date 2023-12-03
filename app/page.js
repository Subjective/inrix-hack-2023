async function getToken() {
  const TOKEN_URL = "https://api.iq.inrix.com/auth/v1/appToken";
  const APP_ID = process.env.APP_ID;
  const HASH_TOKEN = process.env.HASH_TOKEN;

  const res = await fetch(
    `${TOKEN_URL}?appId=${APP_ID}&hashToken=${HASH_TOKEN}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch auth token");
  }

  return res.json();
}

async function getRoute(lat1, long1, lat2, long2) {
  const token = await getToken();
  const ROUTE_URL = `https://api.iq.inrix.com/findRoute?wp_1=${lat1}%2C${long1}&wp_2=${lat2}%2C${long2}&format=json`;
  const res = await fetch(`${ROUTE_URL}&accessToken=${token.result.token}`);

  if (!res.ok) {
    throw new Error("Failed to fetch route");
  }

  return res.json();
}

export default async function Home() {
  const route = await getRoute(
    37.82003799923093,
    -122.47859198941423,
    37.77713968854348,
    -122.49901876479714,
  );
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Trip ID: {route.result.trip.tripId}</div>
      <div>Routes:</div>
      {route.result.trip.routes.map((route) => (
        <div key={route.id}>
          ID: {route.id}
          <ul>
            <li>Travel Time: {route.uncongestedTravelTimeMinutes}</li>
          </ul>
        </div>
      ))}
    </main>
  );
}
