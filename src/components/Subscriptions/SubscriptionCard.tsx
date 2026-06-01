import Glass from "../ui/Glass";
import type{SubscribedChannel} from '../../types'
import Avatar from "../ui/Avatar";
import { Link } from "react-router-dom";
interface SubscriptionCardProps{
          subscribedChannel:SubscribedChannel
}
const SubscriptionCard = function({subscribedChannel}:SubscriptionCardProps){
          const username=subscribedChannel.username
          const fullName=subscribedChannel.fullName
          const avatar=subscribedChannel.avatar
          return(
                    <Glass className="w-full">
                              <Link to={`/profile/${username}`} className="w-full flex flex-row items-center gap-3 rounded-lg">
                                        <Glass className="flex flex-row gap-2 items-center">
                                                  <Avatar src={avatar} alt="avatar" size="md"/>
                                                  <div className="flex flex-col justify-start gap-1 items-center">
                                                            <p className="font-semibold">{fullName}</p>
                                                            <p className="text-gray-400 text-sm">@{username}</p>
                                                  </div>
                                        </Glass>
                              </Link>
                    </Glass>
          )
}

export default SubscriptionCard