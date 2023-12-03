"use client";

import { useState } from "react";
import Image from "next/image";

export function ParkingCard({
  name,
  address,
  distance,
  price,
  rate,
  totalSpaces,
  occupancy,
  hours,
  thumbnailURL,
  amenities,
  websiteURL,
}) {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${name}, ${address.street}, ${address.city}, ${address.state}`,
  )}`;

  return (
    <div className="rounded-lg bg-blue-100 m-4 p-4 shadow-lg transform transition duration-500 ease-in-out hover:scale-105">
      <div className="flex flex-row justify-between">
        <div>
          <div className="relative group">
            <h2 className="text-xl font-bold mb-2">{name}</h2>
            <div className="absolute right-0 top-1/2 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
              {amenities.map((a, index) => (
                <p key={index}>
                  {a.name} {typeof a.value === "boolean" ? "" : ": " + a.value}
                </p>
              ))}
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-700">
            {address.street}, {address.city}
          </h3>
          <p className="text-gray-700">
            Estimated distance: {(distance * 0.001).toFixed(3)} mi
          </p>
          <div className="relative group">
            <p className="text-gray-700">
              Price: {price === null ? "Free" : "$".repeat(price)}
            </p>
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-sm hidden group-hover:block">
              {rate.map((r, index) => (
                <p key={index}>{r}</p>
              ))}
            </div>
          </div>
          <p className="text-gray-700">
            {occupancy}/{totalSpaces} Spaces Available
          </p>
          <p className="text-gray-700">Hours: {hours}</p>
          <button className="mt-2 mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              Get Directions
            </a>
          </button>
          <button className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            <a href={websiteURL} target="_blank" rel="noopener noreferrer">
              Visit Website
            </a>
          </button>
        </div>
        <Image src={thumbnailURL} alt={name} width={300} height={300} />
      </div>
    </div>
  );
}

export default function Home() {
  const [address, setAddress] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [lots, setLots] = useState([]);

  const onSubmitAddressForm = async (event) => {
    event.preventDefault();
    const res = await fetch(`/api?address=${address}`);
    const data = await res.json();
    setLots(data);
    setFormSubmitted(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {!formSubmitted ? (
        <div className="w-full max-w-md justify-center">
          <h1 className="text-2xl font-semibold mb-6">
            Where would you like to go today?
          </h1>
          <form onSubmit={onSubmitAddressForm} className="space-y-4">
            <label className="block">
              <input
                type="text"
                value={address}
                placeholder="Destination Address"
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm py-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </label>
            <input
              type="submit"
              value="Go"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            />
          </form>
        </div>
      ) : (
        <div className="max-w-2xl justify-between">
          <h1 className="text-2xl font-semibold mb-6">
            Here are the parking lots I found near {address}:
          </h1>
          <ul>
            {lots.result.map((lot) => (
              <ParkingCard
                key={lot.id}
                name={lot.name}
                address={lot.navigationAddress}
                distance={lot.distance}
                price={lot.costIndex}
                rate={lot.rateCard}
                totalSpaces={lot.spacesTotal}
                occupancy={lot.occupancy.available}
                hours={lot.hrs}
                thumbnailURL={lot.photoThumbs[0]}
                amenities={lot.amenities}
                websiteURL={lot.url}
              />
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
