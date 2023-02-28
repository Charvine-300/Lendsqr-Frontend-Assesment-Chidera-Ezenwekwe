import { Fragment, useState, useEffect, createContext } from "react"
import Login from "./components/Login"
import Homepage from "./components/Dashboard"
import ScrollToTop from "./components/ScrollToTop"
import { UserDataProps } from "../interfaces"
import { Post } from "./api/api"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"


//Initializing context API for user data
export const CurrentUsersContext = createContext<UserDataProps[] | null>(null);
export const UserDataContext = createContext<UserDataProps[] | any>(null);
export const SetUserDataContext = createContext<any | null>(null);
export const PageNumberContext = createContext<number | any>(null);
export const SetPageNumberContext = createContext<any | null>(null);
export const PerPageContext = createContext<number | any>(null);
export const SetPerPageContext = createContext<any | null>(null);
export const IsError = createContext<boolean | any>(null);
export const IsLoading = createContext<boolean | any>(null);
export const FilterToggle = createContext<string | any>(null);
export const SetFilterToggle = createContext<any | null>(null);
export const FilterFormToggleFunc = createContext<any | null>(null);
export const OptionsToggle = createContext<boolean | null>(null);
export const SetOptionsToggle = createContext<any | null>(null);
export const UserID = createContext<any | null>(null);
export const SetUserID = createContext<any | null>(null);
export const UserOptionsToggleFunc = createContext<any | null>(null);

function App() {

  //Creating an array of status types to pick at random for each user
  const statusTypes = ['active', 'inactive', 'pending', 'blacklisted'];

  const [userData, setUserData] = useState<UserDataProps[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //Stateful variable for creating pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage, setUsersPerPage] = useState<number>(10);

  useEffect(() => {
    //Making request to API to get user data
    Post.getPosts()
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        const random = Math.floor(Math.random() * statusTypes.length);
        data[i].status = statusTypes[random];
      }

      //Storing data in localStorage for reset feature in filter form
      localStorage.setItem('userData', JSON.stringify(data));
      setUserData(data)
      setIsLoading(false)
    })
    .catch((err) => {
      setIsError(true);
      setIsLoading(false);
      console.log(err)
    });
    return () => {};
  }, []);

  //Varables for slicing through user data
  const lastPostIndex = currentPage * usersPerPage;
  const firstPostIndex = lastPostIndex - usersPerPage;

  //Slicing through user data
  const currentUsers = userData.slice(firstPostIndex, lastPostIndex);

  //Stateful variable for filter form component
  const [filterToggle, setFilterToggle] = useState<string>('none');

  const FilterFormToggle = () => {
    if (filterToggle === 'none') {
      setFilterToggle('block');
    }

    else {
      setFilterToggle('none');
    }
  }

  const closeOnClickOut = () => {
    if (filterToggle === 'block') {
      setFilterToggle('none');
    }

    if (optionsToggle === true) {
      setOptionsToggle(false);
    }
  }

  //Stateful variable for User options
  const [optionsToggle, setOptionsToggle] = useState<boolean>(false);
  const [userID, setUserID] = useState<number>(0);

  const UserOptionsToggle = (id: number) => {
    setUserID(id);

    if (optionsToggle === false) {
      setOptionsToggle(true);
    }

    else {
      setOptionsToggle(false);
    }
  }

  

  return (
    <div onClick={closeOnClickOut}>
      <CurrentUsersContext.Provider value={currentUsers}>
        <UserDataContext.Provider value={userData}>
          <SetUserDataContext.Provider value={setUserData}>
            <SetPageNumberContext.Provider value={setCurrentPage}>
              <PageNumberContext.Provider value={currentPage}>
                <PerPageContext.Provider value={usersPerPage}>
                  <SetPerPageContext.Provider value={setUsersPerPage}>
                    <IsError.Provider value={isError}>
                      <IsLoading.Provider value={isLoading}>
                        <FilterToggle.Provider value={filterToggle}>
                          <FilterFormToggleFunc.Provider value={FilterFormToggle}>
                            <SetFilterToggle.Provider value={setFilterToggle}>
                              <OptionsToggle.Provider value={optionsToggle}>
                                <SetOptionsToggle.Provider value={setOptionsToggle}>
                                  <UserID.Provider value={userID}>
                                    <UserOptionsToggleFunc.Provider value={UserOptionsToggle}>
                                      <Router>
                                        <ScrollToTop />
                                        <Routes>
                                          <Route path="/" element={<Navigate to='/login' />} />
                                          <Route path="/login" element={<Login />} />
                                          <Route path='/dashboard/*' element={<Homepage />} />
                                        </Routes>
                                      </Router>
                                    </UserOptionsToggleFunc.Provider>
                                  </UserID.Provider>
                                </SetOptionsToggle.Provider>
                              </OptionsToggle.Provider>
                            </SetFilterToggle.Provider>
                          </FilterFormToggleFunc.Provider>
                       </FilterToggle.Provider>
                      </IsLoading.Provider>
                    </IsError.Provider>
                  </SetPerPageContext.Provider>
                </PerPageContext.Provider>
              </PageNumberContext.Provider>
            </SetPageNumberContext.Provider>
          </SetUserDataContext.Provider>
        </UserDataContext.Provider>
      </CurrentUsersContext.Provider>
    </div>
  )
}

export default App
