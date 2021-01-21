const BASE_URL = "https://swapi.dev/api";

const searchEntity = async (entity, searchTerm) => {
  try {
    const rawResult = await fetch(
      `${BASE_URL}/${entity}/?search=${searchTerm}`
    );
    const { results } = await rawResult.json();
    console.log({ [entity]: results });
    return results;
  } catch (ex) {
    console.warn("api error", ex);
    return [];
  }
};

const login = async (userName, password) => {
  const loweredUserName = userName.toLowerCase();

  if (!loweredUserName || !password) {
    throw new Error("Fields cannot be left blank!");
  }
  const results = await searchEntity("people", loweredUserName);
  if (
    !results.some(
      ({ name, birth_year }) =>
        name.toLowerCase() === loweredUserName && birth_year === password
    )
  ) {
    throw new Error("Invalid credentials");
  }
};

const searchPlanets = async (searchString) => {
  const results = await searchEntity("planets", searchString);
  return results;
};

export { login, searchPlanets };
