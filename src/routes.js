import HomeBase from './pages/home/Base';
import PostsPage from './pages/posts/PostsPage';
import Ranking from './pages/ranking/Ranking';


export default [
  { name: 'home', path: '/', component: HomeBase },
  { name: 'posts', path: '/posts', component: PostsPage },
  { name: 'ranking', path: '/ranking', component: Ranking },
];
