import { Link,useNavigate } from "react-router-dom";
import SearchBar from "../ui/Searchbar";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { useAuth } from "../../hooks/useAuth";
import Modal from "../ui/Modal";
import Glass from "../ui/Glass";
import Logo from '../../assets/logo.png'
import uploadLogo from '../../assets/uploadLogo.png'
import createLogo from '../../assets/createLogo.png'
import { useEffect, useState } from "react";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import UploadVideoModal from "../video/UploadVideoModal";
import CreateTweetModal from "../tweet/createTweetModal";

function Navbar(){
          const {user,isLoggedIn,error,logout} =useAuth()
          const navigate=useNavigate()
          const avatar=user?.avatar
          const [openCreateModal,setOpenCreateModal] =useState(false)
          const [openUploadModal,setOpenUploadModal] =useState(false)
          const[openUserPanel,setOpenUserPanel] = useState(false)
          function handleLogout(){
                    logout()
          }
          return(
          <>
                    <Glass className="w-full fixed top-1 z-50 inset-x-0 flex items-center h-20 p-6">
                              <div className="w-full flex items-center justify-between h-16 rounded-lg bg-gray-400 ">
                                        <Link to='/' className="flex lg:p-2 gap-1 items-center justify-between">
                                                  <img src={Logo} alt="Logo" className="w-16 hidden md:block md:ml-12 lg:ml-0 rounded-lg"/>
                                                  <div className="w-16 md:hidden md:ml-12 lg:ml-0 rounded-lg"></div>
                                                  <div className="text-gray-800 hidden lg:block font-bold text-xl">
                                                            Ytweet
                                                  </div>
                                        </Link>
                                        <div className="flex p-2 gap-1 items-center justify-between">
                                                  <SearchBar/>
                                        </div>
                                        {isLoggedIn ?
                                                  <div className="flex p-2 gap-3 items-center justify-between">
                                                            
                                                            <Button onClick={()=>setOpenUploadModal(!openUploadModal)} className="w-14 lg:w-16 lg:h-12">
                                                                      <img src={uploadLogo} alt="uploadVideo" className="w-8"/>
                                                            </Button>
                                                            <Button onClick={()=>setOpenCreateModal(!openCreateModal)} className="hidden lg:block">
                                                                      <img src={createLogo} alt="createTweet" className="w-8"/>
                                                            </Button>
                                                            <div className="relative" onClick={()=> setOpenUserPanel(!openUserPanel)}>
                                                                      <Avatar src={`${avatar}`} alt='avatar' size='md'  />
                                                                      {openUserPanel && 
                                                                                <div className="absolute bg-gray-500 rounded-xl p-2 w-48 md:w-xs right-0 top-18 flex justify-center items-center">
                                                                                          <Glass className=" w-fit flex flex-col ">
                                                                                                    <button className=" flex h-1/3 font-bold w-36 md:w-64 rounded-xl text-center" onClick={(e) => {
                                                                                                              e.stopPropagation
                                                                                                              handleLogout()
                                                                                                    }}>
                                                                                                              logout
                                                                                                    </button>
                                                                                          
                                                                                          </Glass>
                                                                                </div>
                                                                      }
                                                            </div>
                                                  </div>:
                                                  <div>
                                                            <Link to='/login' className="flex p-2 gap-1 items-center justify-between">
                                                                      <p className="text-gray-800 text-lg font-bold">login</p>
                                                            </Link>
                                                  </div>
                                        }
                              </div>
                    </Glass>
                    <UploadVideoModal
                    isOpen={openUploadModal}
                    onClose={() => setOpenUploadModal(false)}
                    />
                    <CreateTweetModal 
                    isOpen={openCreateModal}
                    onClose={()=>setOpenCreateModal(false)}/>
          </>
          )


}
export default Navbar