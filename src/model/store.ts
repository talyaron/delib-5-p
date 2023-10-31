import { configureStore } from '@reduxjs/toolkit'
import { statementsSlicer } from './statements/statementsSlice'
import { userSlicer } from './users/userSlice'
import { evaluationsSlicer } from './evaluations/evaluationsSlice'
import { votesSlicer } from './vote/votesSlice'
import {resultsSlice} from './results/resultsSlice'


export const store = configureStore({
  reducer: {
    statements: statementsSlicer.reducer,
    evaluations: evaluationsSlicer.reducer,
    user: userSlicer.reducer,
    votes: votesSlicer.reducer,
    results: resultsSlice.reducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch