import Consumer from "./Consumer";

const BASE_URL = "https://swapi.dev/api";
const QUOTA_PER_MINUTE = 15;
const UNLIMITED_PLAN_USERS = ["luke skywalker"];

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

  const accessToken = JSON.stringify({ userName: loweredUserName });
  return {
    accessToken,
    plan: UNLIMITED_PLAN_USERS.includes(loweredUserName)
      ? "unlimited"
      : `limited-${QUOTA_PER_MINUTE}`,
  };
};

const isUnlimitedPlan = (accessToken) => {
  const { userName } = JSON.parse(accessToken);
  return UNLIMITED_PLAN_USERS.includes(userName);
};

let consumer = new Consumer(QUOTA_PER_MINUTE, 60 * 1000);

const searchPlanets = async (searchString, accessToken) => {
  if (!isUnlimitedPlan(accessToken)) {
    const consumption = consumer.consume();
    if (consumption.quota < 0) {
      throw new Error(
        `Search quota (${QUOTA_PER_MINUTE} searches per minute) exceeded. Please try after ${new Date(
          consumption.lastRecharge + 60 * 1000
        ).toLocaleTimeString()}`
      );
    }
  }
  const planets = await searchEntity("planets", searchString);
  return { planets };
};

export { login, searchPlanets };
