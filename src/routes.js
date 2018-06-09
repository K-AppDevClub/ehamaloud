import HomeBase from './pages/home/Base';
import PostsPage from './pages/posts/PostsPage';
import Ranking from './pages/ranking/Ranking';
import HomePage from './pages/home/HomePage';
import Help from './pages/help/Help';


export default [
  { name: 'main-menu', path: '/', component: HomeBase },
  { name: 'posts', path: '/posts', component: PostsPage },
  { name: 'ranking', path: '/ranking', component: Ranking },
  { name: 'home', path: '/home', component: HomePage },
  { name: 'help', path: '/help', component: Help },
];
