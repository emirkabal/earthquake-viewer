import cities from "../assets/jsons/cities.json";
import seas from "../assets/jsons/seas.json";

const toProperCase = (str) => {
  return str
    .toLocaleLowerCase("en")
    .split(" ")
    .map((word) => word.charAt(0).toLocaleUpperCase("en") + word.slice(1))
    .join(" ");
};

/**
 * grabLocation function
 * @param {string} str
 * @returns {object} {name: string, type: string}
 */
export const grabLocation = (str) => {
  const match = /\((.*?)\)/g.exec(str);
  if (match) {
    const city = cities.find((e) => e.term === match[1])?.name;
    const sea = seas.find((e) => e.term === match[1])?.name;
    if (city) {
      return {
        name: city,
        type: "city",
      };
    }
    if (sea) {
      return {
        name: sea,
        type: "sea",
      };
    }
    return {
      name: toProperCase(match[1]),
      type: "other",
    };
  } else {
    const city = cities.find((e) => e.term === str)?.name;
    const sea = seas.find((e) => e.term === str)?.name;
    if (city) {
      return {
        name: city,
        type: "city",
      };
    }
    if (sea) {
      return {
        name: sea,
        type: "sea",
      };
    }
    return {
      name: toProperCase(str),
      type: "other",
    };
  }
};
