import { getSubscribedChannels } from "../api/subscription.api";
import { getUserChannelProfile } from "../api/user.api";
import { useAuth } from "../hooks/useAuth";
import Glass from "../components/ui/Glass";
import { useState,useEffect } from "react";
import type {SubscribedChannel} from '../types'
import SubscriptionCard from "../components/Subscriptions/SubscriptionCard";
import Spinner from "../components/ui/Spinner";
import { showToast } from "../features/uiSlice";
import useAppDispatch from "../hooks/useAppDispatch";


const SubcribedChannels = function(){
          const {user} =useAuth()
          const [subcribedChannels,setSubscribedChannels] =useState<SubscribedChannel[]>([])
          const [error, setError] = useState<string | null>(null)
          const [loading,setLoading] =useState(false)
          const  subscriberId=user?._id
          const dispatch=useAppDispatch()
          async function fetchSubscribedChannels(subscriberId:string){
                    try {
                              const res= await getSubscribedChannels(subscriberId)
                              setLoading(true)
                              setSubscribedChannels(res.data)
                    } catch (error:any) {
                              setError(error.message)
                    }finally{
                              setLoading(false)
                    }
          }  
          useEffect(() => {
                  if (error) {
                      dispatch(showToast({ message: error, type: "error" }))
                  }
          }, [error])       

          useEffect(() => {
                    if (subscriberId) fetchSubscribedChannels(subscriberId)
          }, [subscriberId])
          return(
                    <Glass className="flex flex-col gap-4 py-4 w-full ">
                              <div className="flex flex-col items-start justify-center border-white/10 bg-slate-950/70 p-2 md:p-4 rounded-xl lg:ml-40 max-w-3xl">
                                        <Glass className="text-gray-300 mb-4 md:mb-6">
                                                  Subscribed Channels
                                        </Glass>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                                  {loading ?
                                                            <Spinner/>
                                                            :
                                                            subcribedChannels.map((channel) => {
                                                                      return   <SubscriptionCard key={channel._id} subscribedChannel={channel} />
                                                            })
                                                  }
                                        </div>
                              </div>
                    </Glass>
          )
}

export default SubcribedChannels