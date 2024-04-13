import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/root'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { RouterProvider,BrowserRouter,createBrowserRouter} from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'

const router = createBrowserRouter([{
  path:"/",
  element:<App/>,
}])
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <NextUIProvider>
    <RouterProvider router={router}/>
    <Toaster
      position='bottom-right'
      reverseOrder={false}
    />
  </NextUIProvider>
)
