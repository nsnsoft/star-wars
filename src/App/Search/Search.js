import React, { useEffect, useState } from "react";
import { searchPlanets } from "root/api";
import { Input } from "root/components";
import { useDebounce } from "root/hooks";
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

const Search = () => {
  const [searchString, setSearchString] = useState("");
  const [pending, setPending] = useState(false);
  const [planets, setPlanets] = useState([]);
  const debouncedSearchString = useDebounce(searchString, 1000);

  useEffect(() => {
    let cancelled = false;
    const getPlanets = async () => {
      setPending(true);
      const planetsFound = await searchPlanets(debouncedSearchString);
      if (!cancelled) {
        setPending(false);
        setPlanets(planetsFound);
      }
    };

    debouncedSearchString ? getPlanets() : setPlanets([]);
    return () => {
      cancelled = true;
    };
  }, [debouncedSearchString]);

  return (
    <div className="search">
      <h2>Search Planets</h2>
      <Input
        value={searchString}
        label="Type to search"
        onChange={(value) => setSearchString(value)}
      />
      {pending ? (
        <span style={{ marginBottom: "1em" }}>Updating...</span>
      ) : (
        searchString &&
        debouncedSearchString === searchString &&
        planets.length === 0 && <span>No planets found!</span>
      )}
      <div className="search__planet_list">
        {planets.sort(_byPopulationSorter).map((planet, rank) => (
          <PlanetCard key={planet.name} {...planet} size={1 + rank * 0.1} />
        ))}
      </div>
    </div>
  );
};

export default Search;
