import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import ErrorBoundary from "./components/ErrorBoundary"
import { lazy, Suspense } from "react"
import { BubbleLoading } from "./components/Icons"

const Home = lazy(() => import("./pages/Home"))
const SignUp = lazy(() => import("./pages/SignUp"))
const SignIn = lazy(() => import("./pages/SignIn"))

const App = () => {
  return (
    <BrowserRouter basename="/starter-fullstack-graphql-rq/">
      <ErrorBoundary>
        <Layout>
          <Suspense fallback={<BubbleLoading />}>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/sign-in" element={<SignIn />}></Route>
              <Route path="/sign-up" element={<SignUp />}></Route>
            </Routes>
          </Suspense>
        </Layout>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
