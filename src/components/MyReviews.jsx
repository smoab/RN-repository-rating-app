import { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { RETRIEVE_USER } from "../graphql/queries";
// import { DELETE_REVIEW } from "../graphql/mutations";
import useAuthStorage from '../hooks/useAuthStorage';
import useDeleteReview from '../hooks/useDeleteReview'
import ReviewItem from './ReviewItem'
import SignInPrompt from './SignInPrompt'



const MyReviews = ({navigation}) => {
  const authStorage = useAuthStorage()
  const [userIsLoggedIn, setUserIsLoggedIn] = useState()
  let [userReviews, setUserReviews] = useState([])
  const {data, error, loading, refetch} = useQuery(RETRIEVE_USER, {fetchPolicy: 'cache-and-network', variables: {includeReviews: true}})
//   const [mutate] = useMutation(DELETE_REVIEW)
  const [deleteReview] = useDeleteReview()

  const deleteAndRefetch = async (id) => {
      try {
          await deleteReview(id)
          refetch()
      } catch (e) {
          console.log(e)
      }
   } 

  useEffect(() => {
    if (!error && !loading){
        const reviews = data.me?.reviews.edges.map(edge => edge.node)
        setUserReviews(reviews)
    }
    }, [data, loading]);

    useEffect(() => {
      authStorage.getAccessToken().then(token => setUserIsLoggedIn(token))
    }, [userReviews])

  return (
      userIsLoggedIn ? (
        <FlatList 
          data={userReviews}
          keyExtractor={({id}) => id}
          renderItem={({item}) => <ReviewItem review={item} onlyUserReview={true} deleteReview={deleteAndRefetch} navigation={navigation} />}        
        />

      ) : (
        <SignInPrompt navigation={navigation}/>
      )
  )
};

export default MyReviews;