import { View, Pressable } from 'react-native'
import { useMutation } from "@apollo/client";
import { Formik } from 'formik';
import * as yup from 'yup'
import tw from 'twrnc'
import Text from '../components/Text';
import FormikTextInput from '../components/FormikTextInput'
import useSignIn from "../hooks/useSignIn"
import { REGISTER_USER } from "../graphql/mutations";


const intialValues = {
    username: '',
    password: '',
    confirmPassword: ''
}

const validationSchema = yup.object().shape({
    username: yup
        .string()
        .min(2)
        .max(30)
        .required('Username is required'),
    password: yup
        .string()
        .min(5)
        .max(50)
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'confirmed password and password does not match')
        .required('Password confirmation is required')
})

const SignUpForm = ({onSubmit}) => {
  return (
      <View style={tw`w-full h-screen m-auto p-3`}>
          <FormikTextInput name='username' placeholder='Username' />
          <FormikTextInput name='password' placeholder='Password' secureTextEntry />
          <FormikTextInput name='confirmPassword' placeholder='Password Confirmation' secureTextEntry />
            <Pressable onPress={onSubmit} style={tw`justify-center items-center bg-violet-800 font-bold mx-2 mt-8 py-2 px-4 rounded-lg border border-violet-800`}>
              <Text fontWeight="bold" style={tw`text-white text-md`}>Sign Up</Text>
            </Pressable>
      </View>
  )
};


export const SignUpContainer = ({onSubmit}) => {
    return (
        <Formik 
            initialValues={intialValues} 
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            { ({handleSubmit}) => <SignUpForm onSubmit={handleSubmit} /> }
        </Formik>
    )
}


const SignUp = ({navigation}) => {
    const [mutate] = useMutation(REGISTER_USER)
    const [signIn] = useSignIn()

    const onSubmit = async (values) => {
        const {username, password} = values
        try {
            const {data} = await mutate({variables: {username, password}})
            if (data.createUser.id){
                await signIn({username, password})
                navigation.navigate('Home')
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <SignUpContainer onSubmit={onSubmit} />
    )
}
export default SignUp;