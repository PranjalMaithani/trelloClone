import { useEffect } from "react";

export const handleKeyDown = (event, confirmAction, cancelAction) => {
  if (event.key === "Escape") cancelAction(event);
  else if (event.key === "Enter") confirmAction(event);
};

export async function asyncCatch(callback, ...args) {
  try {
    await callback(...args);
  } catch (error) {
    console.log("An error occured while updating");
    console.log(error);
    alert("Failed to connect to the server");
  }
}

export function useClickOutside(innerRef, callback) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (innerRef.current && !innerRef.current.contains(event.target)) {
        callback(event);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [callback, innerRef]);
}

export function randomVividColor(minSat, maxSat, minLightness, maxLightness) {
  const randomHue = Math.floor(360 * Math.random());
  const randomSaturation =
    Math.floor(Math.random() * (maxSat - minSat)) + minSat;
  const randomLightness =
    Math.floor(Math.random() * (maxLightness - minLightness)) + minLightness;
  return {
    h: randomHue,
    s: randomSaturation,
    l: randomLightness,
  };
}

export function createModal(divId) {
  const checkElement = document.getElementById(divId);
  if (!checkElement) {
    let element = document.createElement("div");
    element.setAttribute("id", divId);
    document.body.appendChild(element);
  }
}

export function convertToSlug(Text) {
  return Text.toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}
