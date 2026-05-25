

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src: string
    alt?: string
    size?: "sm" | "md" | "lg"
}
const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
}
function Avatar({ src, alt = "avatar", size = "md",className }: AvatarProps){
          return(
                    <div className={`${sizeMap[size]} rounded-full p-1 overflow-hidden 
                         ring-2 ring-white/20 shrink-0 ${className}`}>
                              <img src={src} alt={alt}
                              className="w-full h-full object-cover" />
                    </div>
                    
          )

}

export default Avatar