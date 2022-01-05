import { useRoutes } from 'react-router-dom';

import { routes } from './routes';

export function App() {
  const routeElement = useRoutes(routes);

  return routeElement;
}
