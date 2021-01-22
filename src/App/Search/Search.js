import React, { useContext, useEffect, useReducer } from "react";
import { searchPlanets } from "root/api";
import { Input } from "root/components";
import UserContext from "root/context/UserContext";
import searchReducer from "./searchReducer";
import "./Search.css";

const _byPopulationSorter = ({ population: p1 }, { population: p2 }) => {
  return (parseInt(p1) || 0) - (parseInt(p2) || 0);
};

const PlanetCard = ({ name, population, size }) => {
  return (
    <div className="planetCard" style={{ fontSize: `${size}em` }}>
      <div className="planetCard__name" data-testid="planetName">
        {name}
      </div>
      <div className="planetCard__population">{population}</div>
    </div>
  );
};

const PlanDetails = ({ name, plan }) => {
  return (
    <div className="plan_details">
      {name},{" "}
      {plan === "unlimited"
        ? "you can have unlimited searches"
        : `your search is limited to ${plan.split("-")[1]} per minute`}
    </div>
  );
};

const Search = () => {
  const { user } = useContext(UserContext);

  const [state, dispatch] = useReducer(searchReducer, {
    searchString: "",
    planets: [],
    pending: false,
    notFound: false,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    const getPlanets = async () => {
      if (state.searchString) {
        dispatch({ type: "FETCHING_PLANET_LIST" });
        try {
          const searchResult = await searchPlanets(
            state.searchString,
            user.accessToken
          );
          !cancelled &&
            dispatch({ type: "PLANET_LIST_FETCHED", payload: searchResult });
        } catch (ex) {
          !cancelled &&
            dispatch({ type: "PLANET_LIST_FETCH_FAILED", payload: ex.message });
        }
      } else {
        dispatch({ type: "CLEAR_PLANET_LIST" });
      }
    };
    const timeoutHandle = setTimeout(getPlanets, 1000);
    return () => {
      cancelled = true;
      clearTimeout(timeoutHandle);
    };
  }, [state.searchString, user.accessToken]);

  return (
    <div className="search">
      <h2>Search Planets</h2>
      <PlanDetails {...user} />
      <Input
        value={state.searchString}
        label="Type to search"
        onChange={(value) =>
          dispatch({ type: "UPDATE_SEARCH_STRING", payload: { value } })
        }
        pending={state.pending}
      />
      {state.notFound && <span>No planets found!</span>}
      {state.error && <span className="search__error">{state.error}</span>}
      <div className="search__planet_list">
        {!state.error &&
          state.planets
            .sort(_byPopulationSorter)
            .map((planet, rank) => (
              <PlanetCard key={planet.name} {...planet} size={1 + rank * 0.1} />
            ))}
      </div>
    </div>
  );
};

export default Search;
