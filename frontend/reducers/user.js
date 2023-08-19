import { createSlice } from '@reduxjs/toolkit';

// the local storage
const initialState = {
  value: { nickname: null, places: [] },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    /**
     * Description :
     * add a nickname to the nickname value of the local storage
     */
    updateNickname: (state, action) => {
      state.value.nickname = action.payload;
    },

    /**
     * Description :
     * add a place to the user places local storage
     * 
     * @param {object} state the value of the user places local storage
     * @param {object} action the place that user wants to add
     */
    addPlace: (state, action) => {
      state.value.places.push(action.payload);  
    },

    /**
     * Description :
     * ecrase places to the user places local storage
     * 
     * @param {object} state the value of the user places local storage
     * @param {object} action places that user wants to ecrase
     */
    ecrasePlace: (state, action) => {
      state.value.places = action.payload;  
    },

    
    /**
     * Description :
     * delete a place to the user places local storage
     * 
     * @param {object} state the value of the user places local storage
     * @param {object} action the place that user wants to delete
     */
    removePlace: (state, action) => {
      state.value.places = state.value.places.filter(e => e.name !== action.payload);
    },
  },
});

export const { updateNickname, addPlace, removePlace, ecrasePlace} = userSlice.actions;
export default userSlice.reducer;
