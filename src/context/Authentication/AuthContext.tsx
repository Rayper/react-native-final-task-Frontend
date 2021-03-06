import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { createContext, ReactNode, useEffect, useState } from 'react';

export const BASE_URL = 'http://192.168.1.13:8000/api';

interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmpassword: string;
}

interface LoginForm {
  email: string;
  password: string;
}

interface PersonalInfoForm {
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
}

interface UpdatePasswordForm {
  password: string;
  confirmpassword: string;
}

export const AuthContext = createContext<any>({});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [signInError, setSignInError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signUpError, setSignUpError] = useState('');

  useEffect(() => {
    (async () => await userToken())();
  }, [updatedUser]);

  const userSignUp = async (data: SignUpForm) => {
    setIsLoading(true);
    let responseUser;
    await axios
      .post(`${BASE_URL}/auth/register`, data)
      .then((response) => {
        responseUser = response.data;
        setIsLoading(false);
        setSignUpError('');
      })
      .catch((error) => {
        setSignUpError(error.response.data.message);
        setIsLoading(false);
      });
    return responseUser;
  };

  const userSignIn = async (data: LoginForm) => {
    setIsLoading(true);

    const { email, password } = data;
    let responseUser;
    await axios
      .post(`${BASE_URL}/auth/login`, { email, password })
      .then(async (response) => {
        responseUser = response.data.user;
        setUser(responseUser);
        console.log(responseUser);
        await AsyncStorage.setItem('token', response.data.token);
        setIsLoading(false);
        setSignInError('');
      })
      .catch((error) => {
        setSignInError(error.response.data.message);
        console.log(error.response.data.message);
        setIsLoading(false);
      });
    return responseUser;
  };

  // useEffect buat trigger updated User
  const userUpdatePersonalInfo = async (data: PersonalInfoForm) => {
    setIsLoading(true);

    const bearerToken = await AsyncStorage.getItem('token');
    console.log(bearerToken);

    let responseUser: any;
    const { email, firstName, lastName, address } = data;
    await axios
      .patch(
        `${BASE_URL}/users/updatePersonalInfo`,
        { email, firstName, lastName, address },
        { headers: { Authorization: `Bearer ${bearerToken}` } },
      )
      .then((response) => {
        responseUser = response.data;
        setUpdatedUser(responseUser);
        setIsLoading(false);
        console.log(responseUser);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        console.log(error.response.status);
        setIsLoading(false);
      });
    return responseUser;
  };

  const userUpdatePassword = async (data: UpdatePasswordForm) => {
    const bearerToken = await AsyncStorage.getItem('token');
    console.log(bearerToken);

    const { password, confirmpassword } = data;
    setIsLoading(true);
    let responseUser;
    await axios
      .patch(
        `${BASE_URL}/users/updatePassword`,
        { password, confirmpassword },
        { headers: { Authorization: `Bearer ${bearerToken}` } },
      )
      .then((response) => {
        responseUser = response.data;
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        if (error.response.status === 401) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Authentication' }],
            }),
          );
        }
        setIsLoading(false);
      });
    return responseUser;
  };

  const userToken = async () => {
    const bearerToken = await AsyncStorage.getItem('token');
    console.log(bearerToken);

    if (bearerToken) {
      await axios
        .get(`${BASE_URL}/auth/myProfile`, {
          headers: { Authorization: `Bearer ${bearerToken}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch(async (error) => {
          console.log(error);
          console.log(error.response.status);
        });
    }
  };

  const signOut = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem('token');
      console.log('token has been removed.');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userSignUp,
        signUpError,
        isLoading,
        signInError,
        userSignIn,
        user,
        userUpdatePersonalInfo,
        userUpdatePassword,
        signOut,
        updatedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
