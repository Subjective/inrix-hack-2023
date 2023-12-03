export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const coordinate = await getCoordinates(address);
  const lotsData = await getParkingLots(
    coordinate.latitude,
    coordinate.longitude,
    1000,
  );

  return Response.json(lotsData);
}

async function getToken() {
  const TOKEN_URL = "https://api.iq.inrix.com/auth/v1/appToken";

  const res = await fetch(
    `${TOKEN_URL}?appId=${process.env.INRIX_APP_ID}&hashToken=${process.env.INRIX_HASH_TOKEN}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch auth token");
  }

  return res.json();
}

async function getCoordinates(address) {
  const formattedAddress = encodeURIComponent(address);
  const ROUTE_URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}`;
  const res = await fetch(
    `${ROUTE_URL}&key=${process.env.GOOGLE_ACCESS_TOKEN}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch coordinates");
  }

  const lot = await res.json();
  console.log(formattedAddress);
  console.log(lot);
  const lat = lot.results[0].geometry.location.lat;
  const long = lot.results[0].geometry.location.lng;

  return { latitude: lat, longitude: long };
}

async function getParkingLots(latitude, longitude, radius) {
  const token = await getToken();
  console.log(token.result.token);
  const ROUTE_URL = `https://api.iq.inrix.com/lots/v3?point=${latitude}%7C${longitude}&radius=${radius}`;
  console.log(`${ROUTE_URL}&accessToken=${token.result.token}`);
  const res = await fetch(`${ROUTE_URL}&accessToken=${token.result.token}`);

  if (!res.ok) {
    throw new Error("Failed to fetch parking lots");
  }

  return res.json();
}
