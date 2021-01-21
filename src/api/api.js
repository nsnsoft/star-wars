const login = async (userName, password) => {
  const loweredUserName = userName.toLowerCase();

  if (!loweredUserName || !password) {
    throw "Fields cannot be left blank!";
  }

  const rawResult = await fetch(
    `https://swapi.dev/api/people/?search=${loweredUserName}`
  );
  const { results } = await rawResult.json();
  console.log({ results });
  if (
    !results.some(
      ({ name, birth_year }) =>
        name.toLowerCase() === loweredUserName && birth_year === password
    )
  ) {
    throw "Invalid credentials";
  }
};

const searchPlanets = async (searchString) => {
  if (!searchString) {
    return [];
  }
  const rawResult = await fetch(
    `https://swapi.dev/api/planets/?search=${searchString}`
  );
  const { results } = await rawResult.json();
  console.log({ results });
  return results;
};

export { login, searchPlanets };
