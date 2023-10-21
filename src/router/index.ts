import { route } from 'quasar/wrappers';
import { removeToken } from 'src/helpers/token';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  Router
} from 'vue-router';
import routes from './routes';



const router: Router|null = null




export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

   
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  Router.beforeEach((to, from, next) => {

    //console.log(from.fullPath, to.fullPath);


    if(to.fullPath == '/' && from.fullPath != '/'){
      removeToken()
    }
    next();
  });


  return Router;
});


const getRouter=()=>{
  return router;
}



export {
  getRouter,
}
