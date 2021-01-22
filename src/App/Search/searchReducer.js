const searchReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_SEARCH_STRING": {
      const { value } = action.payload;
      return {
        ...state,
        searchString: value,
        notFound: false,
        error: null,
      };
    }
    case "FETCHING_PLANET_LIST": {
      return {
        ...state,
        pending: true,
      };
    }
    case "PLANET_LIST_FETCHED": {
      const { planets } = action.payload;
      return {
        ...state,
        pending: false,
        planets,
        notFound: planets.length === 0,
      };
    }
    case "CLEAR_PLANET_LIST": {
      return {
        ...state,
        planets: [],
      };
    }
    case "PLANET_LIST_FETCH_FAILED": {
      const error = action.payload;
      return {
        ...state,
        pending: false,
        error,
        planets: [],
      };
    }
    default: {
      return state;
    }
  }
};

export default searchReducer;
