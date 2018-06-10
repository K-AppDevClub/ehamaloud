import HomeBase from './pages/home/Base';
import Ranking from './pages/ranking/Ranking';
import PlayGame from './pages/home/PlayGame';
import Help from './pages/help/Help';


export default [
  { name: 'main-menu', path: '/', component: HomeBase },
  { name: 'ranking', path: '/ranking', component: Ranking },
  { name: 'home', path: '/home', component: PlayGame },
  { name: 'help', path: '/help', component: Help },
];
