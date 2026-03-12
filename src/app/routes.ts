import { createBrowserRouter } from 'react-router';
import { SplashPage } from './components/SplashPage';
import { LoginPage, SignupPage } from './components/AuthPages';
import { IntroPage, EnrollPage, StyleSurveyPage, StyleResultPage } from './components/OnboardingPages';
import { HomePage } from './components/HomePage';
import { CoursesPage } from './components/CoursesPage';
import { CommunityPage } from './components/CommunityPage';
import { PlayerPage } from './components/PlayerPage';

export const router = createBrowserRouter([
  { path: '/', Component: SplashPage },
  { path: '/login', Component: LoginPage },
  { path: '/signup', Component: SignupPage },
  { path: '/intro', Component: IntroPage },
  { path: '/enroll', Component: EnrollPage },
  { path: '/style-survey', Component: StyleSurveyPage },
  { path: '/style-result', Component: StyleResultPage },
  { path: '/home', Component: HomePage },
  { path: '/courses', Component: CoursesPage },
  { path: '/community', Component: CommunityPage },
  { path: '/player', Component: PlayerPage },
]);
