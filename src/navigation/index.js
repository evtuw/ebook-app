import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Login from '../pages/Auth/login';
import AuthLoading from '../pages/Auth/auth-loading';
import TabComponent from './tab-component';
import Register from '../pages/Auth/register';
import Latest from '../pages/List-detail/latest';
import Featured from '../pages/List-detail/featured';
import Popular from '../pages/List-detail/popular';
import Category from '../pages/List-detail/category';
import Authors from '../pages/List-detail/author';
import BookDetail from '../pages/BookDetail/BookDetail';
import ListBookByCategory from '../pages/List/list-book-by-category';
import ListBookByAuthor from '../pages/List/list-book-by-author';
import ListCard from '../pages/List/list-card';
import ListBookSearch from '../pages/List/list-book-search';
import ListComment from '../pages/List/list-comment';
import Viewall from '../pages/BookDetail/Viewall';
import NewDetail from '../pages/NewDetail/NewDetail';
import CreatePost from '../pages/Social/create-post';

const stackNavigator = {
  HomeScreen: {
    screen: TabComponent,
  },
  LatestScreen: {
    screen: Latest,
  },
  FeaturedScreen: {
    screen: Featured,
  },
  PopularScreen: {
    screen: Popular,
  },
  CategoryScreen: {
    screen: Category,
  },
  AuthorsScreen: {
    screen: Authors,
  },
  BookDetailScreen: {
    screen: BookDetail,
  },
  ListBookByCategory: {
    screen: ListBookByCategory,
  },
  ListBookByAuthor: {
    screen: ListBookByAuthor,
  },
  ListBookSearch: {
    screen: ListBookSearch,
  },
  ListCommentScreen: {
    screen: ListComment,
  },
  ViewAllBookScreen: {
    screen: Viewall,
  },
  ListCardScreen: {
    screen: ListCard,
  },
  NewsDetailScreen: {
    screen: NewDetail,
  },
  CreatePostScreen: {
    screen: CreatePost,
  },
};
const stackScreens = createStackNavigator(stackNavigator, {
  navigationOptions: {headers: null},
  initialRouteName: 'HomeScreen',
  headerMode: 'none',
});

const stackLogin = {
  LoginScreen: {
    screen: Login,
  },
  RegisterScreen: {
    screen: Register,
  },
};

const LoginStack = createStackNavigator(stackLogin, {
  navigationOptions: {headers: null},
  initialRouteName: 'LoginScreen',
  headerMode: 'none',
});

const switchNavigator = createSwitchNavigator(
  {
    AuthLoading: {
      screen: AuthLoading,
    },
    LoginStack: {
      screen: LoginStack,
    },
    AppStack: {
      screen: stackScreens,
    },
  },
  {
    initialRouteName: 'AuthLoading',
    navigationOptions: {headers: null},
  },
);

const AppStack = createAppContainer(switchNavigator);
export default AppStack;
