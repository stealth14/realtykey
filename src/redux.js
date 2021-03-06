import { createStore, applyMiddleware, combineReducers } from 'redux';
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { requestReducer } from './Request/request-reducer';
import { propertyReducer } from './Property/property-reducer';

const initialState = {
  //general
  errorMessage: '',
  currentUser: '',
  userData: null,
  notifications: null,
  //request form
  map: {
    lat: 0,
    lng: 0,
    zoom: 1,
    snapUrl: ``,
    address: '',
  },
  //publish stepper
  activeStep: 0,
  //matches view
  selectedMatch: null,
  matches: [],
  details: false,
  //search
  searchParams: {},
  filterEnabled: true,
  loading: true,
  //agent preview
  userPreview: null
};

// Reducer
const generalReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_PREVIEW':
      return {
        ...state,
        userPreview:action.payload
      }
    case 'CLEAN_MAP':
      return {
        ...state,
        map: {
          lat: 0,
          lng: 0,
          zoom: 1,
          snapUrl: ``,
          address: '',
        },
      }
    case 'SHOW_ALERT':
      return {
        ...state,
        errorMessage: action.payload
      }
    case 'CLOSE_ALERT':
      return {
        ...state,
        errorMessage: ''
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'SET_SEARCH_PARAMS':
      return {
        ...state,
        searchParams: action.payload
      }
    case 'SET_USER':
      return {
        ...state,
        loading: false,
        currentUser: action.payload
      }
    case 'SET_USER_DATA':
      return {
        ...state,
        loading: false,
        userData: action.payload
      }
    case 'SET_MAP':
      return {
        ...state,
        map: { ...state.map, ...action.payload }
      }
    case 'SET_STEP':
      return {
        ...state,
        activeStep: action.payload
      }
    case 'SWITCH_DETAILS':
      return {
        ...state,
        details: !state.details
      }
    case 'SELECT_MATCH':
      const matches = state.matches.map((match, index) => {
        //match seleccionado
        if (index === action.payload.index) {
          return { ...match, selected: !match.selected }
        }
        //resto de matches
        return {
          ...match, selected: false
        }
      }
      );
      return {
        ...state,
        selectedMatch: action.payload.match,
        matches: matches,
        details: true
      }

    case 'SHOW_FILTER':
      return {
        ...state,
        filterEnabled: !state.filterEnabled
      }

    case 'FETCH_MATCHES':
      return {
        ...state,
        loading: true,
      }

    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        matches: action.payload
      }
    default:
      return state;
  }
}
//current user data
export const fetchUserDataThunk = (uid) => {

  return async (dispatch) => {
    const {firebase} = await import('./base');
    
    const userDoc = await firebase.firestore().collection('users').doc(uid).get();
    dispatch(setUserData(userDoc.data()));
      
  }
}
export const setUserAction = (currentUser) => { return { type: 'SET_USER', payload: currentUser } }
export const setUserData = (userData) => { return { type: 'SET_USER_DATA', payload: userData } }

//MatchesView
export const setMatchAction = (match, index) => { return { type: 'SELECT_MATCH', payload: { match: match, index: index } } }
export const switchDetailsAction = () => { return { type: 'SWITCH_DETAILS' } }
export const fetchMatchesAction = () => { return { type: 'FETCH_MATCHES' } }
const fetchSuccessAction = (matches) => { return { type: 'FETCH_SUCCESS', payload: matches } }

//Search (visibilidad, controles de busqueda)
export const filterSwitchAction = () => { return { type: 'SHOW_FILTER' } }
//Publish (stepper)
export const setStepAction = (step) => { return { type: 'SET_STEP', payload: step } }
//Map
export const setMapAction = (map) => { return { type: 'SET_MAP', payload: map } }

export const fetchMatchesThunk = (uid) => {

  return (dispatch) => {

    import('./base').then(
      ({ app }) => {
        app.firestore().collection('users').doc(uid).collection('matches').get().then(
          (snap) => {
            let matches = [];
            snap.docs.forEach(
              (doc, index) => {

                let match = { ...doc.data(), key: doc.id, selected: false };

                matches.push(match);
              }
            )
            dispatch(fetchSuccessAction(matches));
          }
        )
      }
    )
  }

}

//error prompts
export const showAlertAction = message => { return { type: 'SHOW_ALERT', payload: message } };
export const closeAlertAction = () => { return { type: 'CLOSE_ALERT' } };

const mainReducer = combineReducers(
  {
    general: generalReducer,
    request: requestReducer,
    property: propertyReducer
  });
const middleware = composeWithDevTools(applyMiddleware(reduxThunk));

export const store = createStore(mainReducer, middleware);
