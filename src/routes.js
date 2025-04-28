import React from 'react';

import { Icon } from '@chakra-ui/react';
import { MdBarChart, MdPerson, MdHome, MdLock } from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import Profile from 'views/admin/profile';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import LogAnalyzer from 'components/loganalyzer/LogAnalyzer';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Home',
    layout: '/admin',
    path: '/home',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Logs Analyzer',
    layout: '/admin',
    path: '/log-analyzer',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <LogAnalyzer />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export default routes;
